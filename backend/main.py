from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
import os

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000", # Frontend origin
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database configuration
PG_USER = os.getenv("POSTGRES_USER")
PG_PASSWORD = os.getenv("POSTGRES_PASSWORD")
DATABASE_URL = f"postgresql://{PG_USER}:{PG_PASSWORD}@postgres:5432/iris"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database model
class Subject(Base):
    __tablename__ = "subjects"
    code = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)

# Create tables
Base.metadata.create_all(bind=engine)

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/subjects/")
def read_subjects(db: Session = Depends(get_db)):
    subjects = db.query(Subject).all()
    return subjects

@app.get("/")
def read_root():
    return {"message": "Welcome to the backend API!"}
