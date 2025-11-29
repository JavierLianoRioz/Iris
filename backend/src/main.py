from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import models, schemas, crud
from .database import engine, get_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables on startup
    models.Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(title="Iris Backend", lifespan=lifespan)

@app.get("/")
def read_root():
    return {"message": "Iris Backend is running"}

@app.post("/subjects", response_model=schemas.Subject)
def create_subject(subject: schemas.SubjectCreate, db: Session = Depends(get_db)):
    # Check if exists
    existing = db.query(models.Subject).filter(models.Subject.code == subject.code).first()
    if existing:
        raise HTTPException(status_code=400, detail="Subject already exists")
    
    db_subject = models.Subject(code=subject.code, name=subject.name)
    db.add(db_subject)
    db.commit()
    db.refresh(db_subject)
    return db_subject

@app.post("/subscribe", response_model=schemas.User)
def subscribe(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return crud.create_or_update_subscription(db=db, user=user)