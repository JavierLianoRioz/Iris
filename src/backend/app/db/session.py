from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

# Database configuration
PG_USER = os.getenv("POSTGRES_USER")
PG_PASSWORD = os.getenv("POSTGRES_PASSWORD")
PG_DB = os.getenv("POSTGRES_DB", "iris") # Use the env var, default to iris
DATABASE_URL = f"postgresql://{PG_USER}:{PG_PASSWORD}@postgres:5432/{PG_DB}"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()