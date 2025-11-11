from fastapi import FastAPI
from .app.router import router
from .app.models import Base
from .app.session import engine

app = FastAPI()

# Crear las tablas en la base de datos
Base.metadata.create_all(bind=engine)

app.include_router(router)

@app.get("/")
def read_root():
    return {"message": "Unified Backend is running!"}