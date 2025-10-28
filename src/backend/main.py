from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import origins
from app.api import subscriptions, subjects

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(subscriptions.router)
app.include_router(subjects.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the backend API!"}