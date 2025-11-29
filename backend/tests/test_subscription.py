from fastapi.testclient import TestClient
from sqlalchemy import create_engine, StaticPool
from sqlalchemy.orm import sessionmaker
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../')))

from src.main import app
from src.database import get_db, Base

# Setup in-memory DB
SQLALCHEMY_DATABASE_URL = "sqlite:///" # Use in-memory

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

def test_subscribe_flow():
    # 1. Create Subject
    response = client.post("/subjects", json={"code": "PROG1", "name": "Programming 1"})
    assert response.status_code == 200
    
    # 2. Subscribe
    payload = {
        "username": "jane_doe",
        "phone": "+1987654321",
        "subjects": ["PROG1"]
    }
    response = client.post("/subscribe", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "jane_doe"
    assert len(data["subjects"]) == 1
    assert data["subjects"][0]["code"] == "PROG1"

    # 3. Update Subscription (clear subscriptions)
    payload["subjects"] = []
    response = client.post("/subscribe", json=payload)
    data = response.json()
    assert len(data["subjects"]) == 0
