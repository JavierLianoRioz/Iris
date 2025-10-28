from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .session import get_db
from .schemas import SubscriptionRequest
from . import service as subscription_service

router = APIRouter()

@router.post("/subscriptions/")
def update_subscriptions_endpoint(request: SubscriptionRequest, db: Session = Depends(get_db)):
    user = subscription_service.update_subscriptions(db, request)
    return {"message": f"Subscriptions updated for user {user.phone}"}
