"""
FastAPI Main Application Entry Point.
Initializes CORS, database schema, routers, and runs automatic seeding on startup.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine, SessionLocal
from seed_data import seed_database
from routers import meetings, action_items, ai_features

# Create SQLite tables on startup
Base.metadata.create_all(bind=engine)

# Auto-seed sample meeting data if empty
seed_database()

app = FastAPI(
    title="Fireflies.ai Clone API",
    description="Backend API for meeting management, interactive transcription, and AI notes.",
    version="1.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Modular Routers
app.include_router(meetings.router)
app.include_router(action_items.router)
app.include_router(ai_features.router)


@app.get("/")
def health_check():
    """Health check endpoint confirming API status."""
    return {
        "status": "online",
        "service": "Fireflies.ai Clone API",
        "version": "1.0.0",
        "docs_url": "/docs"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
