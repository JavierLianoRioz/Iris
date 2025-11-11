from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from .session import get_db
from .models import Subject, User
from .schemas import SubscriptionRequest, SubjectSchema
from . import service as subscription_service

router = APIRouter()

@router.get("/subjects/", response_model=List[SubjectSchema])
def read_subjects(db: Session = Depends(get_db)):
    subjects = db.query(Subject).all()
    return subjects

@router.post("/subscriptions/")
def update_subscriptions_endpoint(request: SubscriptionRequest, db: Session = Depends(get_db)):
    user = subscription_service.update_subscriptions(db, request)
    return {"message": f"Subscriptions updated for user {user.phone}"}