from fastapi import FastAPI
from . import models
from .session import engine
from .router import router

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Subscriptions Service"}
