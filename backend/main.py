from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
import os
from pydantic import BaseModel
from typing import List

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
PG_DB = os.getenv("POSTGRES_DB", "iris") # Use the env var, default to iris
DATABASE_URL = f"postgresql://{PG_USER}:{PG_PASSWORD}@postgres:5432/{PG_DB}"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# --- Database Models ---
class Subject(Base):
    __tablename__ = "subjects"
    code = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    phone = Column(String, unique=True, index=True, nullable=False)

class UserSubject(Base):
    __tablename__ = "user_subjects"
    user_id = Column(Integer, primary_key=True)
    subject_code = Column(String, primary_key=True)

# --- Pydantic Models ---
class SubscriptionRequest(BaseModel):
    name: str
    phone: str
    subject_codes: List[str]

# --- Database Session Dependency ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- API Endpoints ---
@app.get("/")
def read_root():
    return {"message": "Welcome to the backend API!"}

@app.get("/subjects/")
def read_subjects(db: Session = Depends(get_db)):
    subjects = db.query(Subject).all()
    return subjects

@app.post("/subscriptions/")
def update_subscriptions(request: SubscriptionRequest, db: Session = Depends(get_db)):
    # Find user by phone, or create if not exists
    user = db.query(User).filter(User.phone == request.phone).first()
    if not user:
        # If user doesn't exist, create one with the provided name and phone
        user = User(phone=request.phone, name=request.name)
        db.add(user)
        db.commit()
        db.refresh(user)
    elif user.name != request.name:
        # If user exists but name is different, update it
        user.name = request.name
        db.commit()

    # Clear existing subscriptions for this user
    db.query(UserSubject).filter(UserSubject.user_id == user.id).delete(synchronize_session=False)

    # Add new subscriptions
    for subject_code in request.subject_codes:
        # Check if subject_code exists in subjects table
        if db.query(Subject).filter(Subject.code == subject_code).first():
            new_subscription = UserSubject(user_id=user.id, subject_code=subject_code)
            db.add(new_subscription)
        else:
            print(f"Warning: Subject code '{subject_code}' not found. Skipping.")

    db.commit()
    return {"message": f"Subscriptions updated for user {user.phone}"}
