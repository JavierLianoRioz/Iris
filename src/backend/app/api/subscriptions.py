from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.subscription import SubscriptionRequest
from app.services import subscription_service

router = APIRouter()

@router.post("/subscriptions/")
def update_subscriptions_endpoint(request: SubscriptionRequest, db: Session = Depends(get_db)):
    user = subscription_service.update_subscriptions(db, request)
    return {"message": f"Subscriptions updated for user {user.phone}"}