"""
Database configuration module using SQLite and SQLAlchemy.
Provides the database engine, session factory, and FastAPI session dependency.
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# SQLite database file stored locally in backend directory
DATABASE_URL = "sqlite:///./meetings.db"

# connect_args={"check_same_thread": False} is required for SQLite with FastAPI multi-threading
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# Session factory for handling database transactions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for SQLAlchemy ORM models
Base = declarative_base()


def get_db():
    """FastAPI dependency that yields a database session and closes it after the request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
