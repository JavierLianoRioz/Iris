from sqlalchemy.orm import Session
from .models import User, UserSubject, Subject
from .schemas import SubscriptionRequest

def update_subscriptions(db: Session, request: SubscriptionRequest):
    user = db.query(User).filter(User.phone == request.phone).first()
    if not user:
        user = User(phone=request.phone, name=request.name)
        db.add(user)
        db.commit()
        db.refresh(user)
    elif user.name != request.name:
        user.name = request.name
        db.commit()

    db.query(UserSubject).filter(UserSubject.user_id == user.id).delete(synchronize_session=False)

    for subject_code in request.subject_codes:
        if db.query(Subject).filter(Subject.code == subject_code).first():
            new_subscription = UserSubject(user_id=user.id, subject_code=subject_code)
            db.add(new_subscription)
        else:
            print(f"Warning: Subject code '{subject_code}' not found. Skipping.")

    db.commit()
    return user