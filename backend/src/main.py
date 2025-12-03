from contextlib import asynccontextmanager
from typing import List
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import models, schemas, crud
from .database import engine, get_db
from .services import subject as subject_service
from .services.subject import SubjectAlreadyExistsError
from .services import subscription as subscription_service
from .services.subscription import SubjectNotFoundForSubscriptionError

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables on startup
    models.Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(title="Iris Backend", lifespan=lifespan)

# Configure CORS
origins = [
    "http://localhost:3000",
    "http://localhost:4321",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:4321",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Iris Backend is running"}

@app.post("/subjects", response_model=schemas.Subject, status_code=status.HTTP_201_CREATED)
def create_subject(subject: schemas.SubjectCreate, db: Session = Depends(get_db)):
    try:
        return subject_service.create_subject(db=db, subject=subject)
    except SubjectAlreadyExistsError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/subjects", response_model=List[schemas.Subject])
def read_subjects(db: Session = Depends(get_db)):
    return subject_service.get_all_subjects(db)

@app.post("/subscribe", response_model=schemas.User)
def subscribe(user: schemas.UserCreate, db: Session = Depends(get_db)):
    try:
        return subscription_service.create_or_update_subscription(db=db, user_data=user)
    except SubjectNotFoundForSubscriptionError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/users/{email}", response_model=schemas.User)
def read_user(email: str, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=email)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@app.delete("/users/{email}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(email: str, db: Session = Depends(get_db)):
    success = crud.delete_user_by_email(db, email=email)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return None