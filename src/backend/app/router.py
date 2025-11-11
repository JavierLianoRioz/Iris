from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .session import get_db
from .models import Subject, User # Importar todos los modelos necesarios
from .schemas import SubscriptionRequest
from . import service as subscription_service

router = APIRouter()

# Router para asignaturas (del antiguo servicio-asignaturas)
@router.get("/subjects/")
def read_subjects(db: Session = Depends(get_db)):
    subjects = db.query(Subject).all()
    return subjects

# Router para suscripciones (del antiguo servicio-suscripciones)
@router.post("/subscriptions/")
def update_subscriptions_endpoint(request: SubscriptionRequest, db: Session = Depends(get_db)):
    user = subscription_service.update_subscriptions(db, request)
    return {"message": f"Subscriptions updated for user {user.phone}"}

# Router para usuarios (el antiguo servicio-usuarios estaba vacío, pero podemos añadir endpoints si es necesario)
# Por ahora, no añadiremos endpoints específicos para usuarios aquí, ya que la creación/actualización se maneja en el servicio de suscripciones.
# Si en el futuro se necesitan operaciones CRUD directas sobre usuarios, se añadirían aquí.