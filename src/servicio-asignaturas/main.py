from fastapi import FastAPI
from app import models
from app.session import engine
from app.router import router

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Subjects Service"}

@app.get("/health")
def health_check():
    return {"status": "ok"}
