from sqlalchemy.orm import Session
from .models import User, UserSubject, Subject
from .schemas import SubscriptionRequest

def update_subscriptions(db: Session, request: SubscriptionRequest):
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
    return user