import os
import logging
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from datetime import datetime
from slugify import slugify
import cloudinary
import cloudinary.uploader

from .database import engine, User, Post, Category, init_db, get_session
from .auth import (
    get_password_hash, 
    verify_password, 
    create_access_token, 
    get_current_user
)
from .chat import router as chat_router

# Configure Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Cloudinary
cloudinary.config(
    cloudinary_url=os.getenv("CLOUDINARY_URL")
)

app = FastAPI(docs_url="/api/docs", openapi_url="/api/openapi.json")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router)

@app.on_event("startup")
def on_startup():
    try:
        logger.info("Initializing database...")
        init_db()
        # Seed Admin
        with Session(engine) as session:
            admin_exists = session.exec(select(User).where(User.username == "admin")).first()
            if not admin_exists:
                hashed_pwd = get_password_hash("admin123")
                admin = User(username="admin", password=hashed_pwd, role="admin")
                session.add(admin)
                session.commit()
                logger.info("Admin user created: admin / admin123")
    except Exception as e:
        logger.error(f"Startup failed: {str(e)}")
        # In serverless, we might not want to crash the whole process 
        # but the first request will fail if DB is down.

# --- AUTH ROUTES ---

@app.post("/api/auth/login")
async def login(request: Request, session: Session = Depends(get_session)):
    try:
        data = await request.json()
        username = data.get("username")
        password = data.get("password")
        
        logger.info(f"Login attempt for user: {username}")
        
        user = session.exec(select(User).where(User.username == username)).first()
        if not user:
            logger.warning(f"Login failed: User {username} not found")
            raise HTTPException(status_code=401, detail="Invalid credentials")
            
        if not verify_password(password, user.password):
            logger.warning(f"Login failed: Password mismatch for user {username}")
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        access_token = create_access_token(data={"sub": user.username})
        logger.info(f"Login successful for user: {username}")
        return {
            "token": access_token,
            "user": {"id": user.id, "username": user.username, "role": user.role}
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/auth/reset-admin")
async def reset_admin(session: Session = Depends(get_session)):
    try:
        # Force reset admin password to admin123
        admin = session.exec(select(User).where(User.username == "admin")).first()
        hashed_pwd = get_password_hash("admin123")
        
        if admin:
            admin.password = hashed_pwd
            logger.info("Admin password reset to 'admin123'")
        else:
            admin = User(username="admin", password=hashed_pwd, role="admin")
            session.add(admin)
            logger.info("Admin user created via reset endpoint")
            
        session.commit()
        return {"message": "Admin password has been reset to 'admin123'"}
    except Exception as e:
        logger.error(f"Reset admin error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/auth/verify")
async def verify(username: str = Depends(get_current_user), session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.username == username)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"id": user.id, "username": user.username, "role": user.role}

# --- POST ROUTES ---

@app.get("/api/posts", response_model=List[Post])
def get_posts(session: Session = Depends(get_session)):
    return session.exec(select(Post).where(Post.published == True).order_by(Post.created_at.desc())).all()

@app.get("/api/posts/admin/all", response_model=List[Post])
def get_all_posts_admin(current_user: str = Depends(get_current_user), session: Session = Depends(get_session)):
    return session.exec(select(Post).order_by(Post.created_at.desc())).all()

@app.get("/api/posts/{slug}", response_model=Post)
def get_post_by_slug(slug: str, session: Session = Depends(get_session)):
    post = session.exec(select(Post).where(Post.slug == slug)).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    # Increment views
    post.views += 1
    session.add(post)
    session.commit()
    session.refresh(post)
    return post

@app.post("/api/posts", response_model=Post)
def create_post(post_data: Post, current_user: str = Depends(get_current_user), session: Session = Depends(get_session)):
    # Calculate slug if not provided
    if not post_data.slug:
        post_data.slug = slugify(post_data.title)
    
    session.add(post_data)
    session.commit()
    session.refresh(post_data)
    return post_data

@app.put("/api/posts/{post_id}", response_model=Post)
def update_post(post_id: int, post_update: Post, current_user: str = Depends(get_current_user), session: Session = Depends(get_session)):
    post = session.get(Post, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    update_data = post_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        if key != "id":
            setattr(post, key, value)
    
    post.updated_at = datetime.utcnow()
    session.add(post)
    session.commit()
    session.refresh(post)
    return post

@app.delete("/api/posts/{post_id}")
def delete_post(post_id: int, current_user: str = Depends(get_current_user), session: Session = Depends(get_session)):
    post = session.get(Post, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    session.delete(post)
    session.commit()
    return {"message": "Post deleted"}

# --- CATEGORY ROUTES ---

@app.get("/api/categories", response_model=List[Category])
def get_categories(session: Session = Depends(get_session)):
    return session.exec(select(Category)).all()

# --- UPLOAD ROUTE ---

@app.post("/api/upload")
async def upload_image(image: UploadFile = File(...), current_user: str = Depends(get_current_user)):
    try:
        result = cloudinary.uploader.upload(
            image.file,
            folder="gatitu-blog",
            resource_type="auto"
        )
        return {"url": result.get("secure_url")}
    except Exception as e:
        logger.error(f"Upload error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# --- HEALTH CHECK ---

@app.get("/api/health")
def health(session: Session = Depends(get_session)):
    try:
        session.exec(select(User).limit(1)).first()
        return {"status": "ok", "engine": "fastapi", "database": "connected"}
    except Exception as e:
        return {"status": "error", "engine": "fastapi", "database": "disconnected", "error": str(e)}
