"""
TaskPilot AI - Database & Data Modeling Layer
This module handles asynchronous connectivity to the database and defines the ORM schema.
Using SQLAlchemy 2.0 and aiosqlite for non-blocking I/O operations.
"""

import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from dotenv import load_dotenv

load_dotenv()

# --- Async Database Connection ---

# aiosqlite is used as the asynchronous driver for SQLite.
# For production MySQL, change to: mysql+aiomysql://user:pass@host:port/db
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./taskpilot.db")

# Echo=False disables logging of every SQL statement (set to True for debugging)
engine = create_async_engine(DATABASE_URL, echo=False, future=True)

# Expire_on_commit=False prevents issues when accessing objects after commit in async mode
AsyncSessionLocal = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

Base = declarative_base()

# --- Data Models (ORM) ---

class History(Base):
    """
    The History table stores every interaction with the platform.
    This serves as both a user feature (chat history) and an LLMOps audit trail.
    """
    __tablename__ = "history"

    id = Column(Integer, primary_key=True, index=True)
    tool_name = Column(String(100), index=True) # e.g., 'Resume Analyzer'
    user_input = Column(Text)                    # The user's query
    ai_output = Column(Text)                     # The final response
    model_name = Column(String(50))              # Tracking the LLM version (LLMOps)
    latency_ms = Column(Integer)                 # Performance metric (DevOps)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

# --- Database Dependencies ---

async def get_db():
    """
    FastAPI dependency that provides an asynchronous database session.
    Automatically closes the session after the request is completed.
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
