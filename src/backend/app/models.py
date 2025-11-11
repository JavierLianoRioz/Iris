from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class Subject(Base):
    __tablename__ = "subjects"
    code = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    phone = Column(String, unique=True, index=True, nullable=False)

class UserSubject(Base):
    __tablename__ = "user_subjects"
    user_id = Column(Integer, primary_key=True)
    subject_code = Column(String, primary_key=True)