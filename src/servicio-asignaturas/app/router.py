from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .session import get_db
from .models import Subject

router = APIRouter()

@router.get("/subjects/")
def read_subjects(db: Session = Depends(get_db)):
    subjects = db.query(Subject).all()
    return subjects
