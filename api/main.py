import os
import slugify
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Request
from sqlmodel import Session, select
from datetime import datetime
import cloudinary
import cloudinary.uploader

from .database import engine, User, Post, Category, init_db, get_session
from .auth import (
    get_password_hash, 
    verify_password, 
    create_access_token, 
    get_current_user
)

# Initialize Cloudinary
cloudinary.config(
    cloudinary_url=os.getenv("CLOUDINARY_URL")
)

app = FastAPI(docs_url="/api/docs", openapi_url="/api/openapi.json")

@app.on_event("startup")
def on_startup():
    init_db()
    # Seed Admin
    with Session(engine) as session:
        admin_exists = session.exec(select(User).where(User.username == "admin")).first()
        if not admin_exists:
            hashed_pwd = get_password_hash("admin123")
            admin = User(username="admin", password=hashed_pwd, role="admin")
            session.add(admin)
            session.commit()
            print("Admin user created: admin / admin123")

# --- AUTH ROUTES ---

@app.post("/api/auth/login")
async def login(request: Request, session: Session = Depends(get_session)):
    data = await request.json()
    username = data.get("username")
    password = data.get("password")
    
    user = session.exec(select(User).where(User.username == username)).first()
    if not user or not verify_password(password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": user.username})
    return {
        "token": access_token,
        "user": {"id": user.id, "username": user.username, "role": user.role}
    }

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
        post_data.slug = slugify.slugify(post_data.title)
    
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
        raise HTTPException(status_code=500, detail=str(e))

# --- HEALTH CHECK ---

@app.get("/api/health")
def health():
    return {"status": "ok", "engine": "fastapi"}
