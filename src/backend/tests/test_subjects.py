from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from main import app
from app import models, router, session
import pytest
from unittest.mock import MagicMock

# Mock para la sesión de la base de datos
@pytest.fixture(name="db_session")
def db_session_fixture():
    mock_db_session = MagicMock(spec=Session)
    yield mock_db_session

# Fixture para sobrescribir la dependencia get_db y proporcionar un cliente de prueba
@pytest.fixture(name="test_app_client")
def test_app_client_fixture(db_session: Session):
    def override_get_db():
        yield db_session
    
    app.dependency_overrides[session.get_db] = override_get_db
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear() # Limpiar las sobrescrituras después de la prueba

def test_read_subjects(test_app_client: TestClient, db_session: Session):
    mock_subjects_data = [
        {"code": "MATH101", "name": "Matemáticas"},
        {"code": "PHY101", "name": "Física"},
    ]

    mock_query_result = MagicMock()
    mock_query_result.all.return_value = mock_subjects_data
    db_session.query.return_value = mock_query_result

    response = test_app_client.get("/subjects/")
    assert response.status_code == 200
    assert response.json() == mock_subjects_data
