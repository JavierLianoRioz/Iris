from sqlalchemy.orm import Session
from . import models, schemas

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def get_user_by_phone(db: Session, phone: str):
    return db.query(models.User).filter(models.User.phone == phone).first()

def create_or_update_subscription(db: Session, user: schemas.UserCreate):
    db_user = get_user_by_username(db, user.username)
    if not db_user:
        db_user = models.User(username=user.username, phone=user.phone)
        db.add(db_user)
    else:
        # Update phone if changed?
        db_user.phone = user.phone
    
    db.commit()
    
    # Handle subjects
    # Get subjects that match the codes
    subjects = db.query(models.Subject).filter(models.Subject.code.in_(user.subjects)).all()
    
    # Replace subscriptions
    db_user.subjects = subjects
    db.commit()
    db.refresh(db_user)
    return db_user
