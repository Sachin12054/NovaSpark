import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .firebase import init_firestore
from .routes import registration, chat, project, leaderboard, analytics

app = FastAPI(
    title="NovaSpark - Growth Engine API",
    description="Backend API powering NovaSpark student project discovery, registration, viral referral engine, and growth analytics dashboard via Firebase Firestore & Mistral AI.",
    version="2.1.0"
)

# CORS Configuration
frontend_url = os.getenv("FRONTEND_URL", "").strip()
allowed_origins = [
    "http://localhost:3000",
    "http://localhost:8081",
    "http://localhost:19006",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:8081",
    "http://127.0.0.1:19006",
]
if frontend_url:
    allowed_origins.append(frontend_url.rstrip("/"))

# Support Vercel production, preview deployments, and local dev
is_demo = os.getenv("DEMO_MODE", "true").lower() == "true"

if not is_demo and frontend_url:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_origin_regex=r"https:\/\/.*\.vercel\.app",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Include Routers
app.include_router(registration.router)
app.include_router(chat.router)
app.include_router(project.router)
app.include_router(leaderboard.router)
app.include_router(analytics.router)

@app.on_event("startup")
def on_startup():
    """Initialize Firebase Firestore client / local seeded emulator."""
    init_firestore()

@app.get("/")
def root():
    return {
        "status": "online",
        "project": "NovaSpark",
        "tagline": "Turn your idea into an AI project.",
        "docs_url": "/docs",
        "ai_mode": os.getenv("AI_MODE", "mistral"),
        "demo_mode": os.getenv("DEMO_MODE", "true").lower() == "true"
    }

@app.get("/api/health")
def health():
    return {"status": "healthy", "service": "novaspark-backend"}
