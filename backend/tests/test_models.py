import sys
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Add backend directory (parent of src) to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../')))

from src.models import Base, User, Subject

def test_create_user_and_subject():
    # In-memory SQLite for testing
    engine = create_engine("sqlite:///:memory:")
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db = TestingSessionLocal()
    
    # Create Subject
    subject = Subject(code="MAT101", name="Mathematics")
    db.add(subject)
    db.commit()
    db.refresh(subject)
    
    assert subject.code == "MAT101"
    
    # Create User and subscribe
    user = User(username="john_doe", phone="+123456789")
    user.subjects.append(subject)
    db.add(user)
    db.commit()
    db.refresh(user)
    
    assert user.username == "john_doe"
    assert len(user.subjects) == 1
    assert user.subjects[0].code == "MAT101"
    
    db.close()
