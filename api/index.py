from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/py/hello")
def hello_py():
    return {"message": "Hello from FastAPI!", "status": "integrated"}

@app.get("/api/py/health")
def health_py():
    return {
        "status": "ok",
        "service": "fastapi",
        "environment": os.getenv("NODE_ENV", "production")
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
