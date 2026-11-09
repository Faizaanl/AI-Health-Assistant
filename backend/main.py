
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.routes.symptoms import router as symptoms_router

app = FastAPI(
    title="AI Disease Prediction & Health Assistant",
    description="An AI-powered educational health assistance platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://ai-health-assistant-cyan.vercel.app",
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "Welcome to AI Health Assistant!",
        "status": "Backend is running successfully"
    }


@app.get("/api/v1/health")
def health_check():
    return {
        "status": "active",
        "project": "AI Health Assistant",
        "message": "API is working properly"
    }


app.include_router(
    symptoms_router,
    prefix="/api/v1"
)
