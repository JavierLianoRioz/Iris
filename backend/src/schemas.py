from pydantic import BaseModel
from typing import List

class SubjectBase(BaseModel):
    code: str
    name: str

class SubjectCreate(SubjectBase):
    pass

class Subject(SubjectBase):
    class Config:
        from_attributes = True

class UserBase(BaseModel):
    username: str
    phone: str

class UserCreate(UserBase):
    subjects: List[str] # List of subject codes

class User(UserBase):
    id: int
    subjects: List[Subject] = []

    class Config:
        from_attributes = True
