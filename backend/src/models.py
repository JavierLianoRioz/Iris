from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import relationship
from .database import Base

# Association tables
user_subjects = Table(
    "user_subjects",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id"), primary_key=True),
    Column("subject_code", String, ForeignKey("subjects.code"), primary_key=True),
)

teacher_subjects = Table(
    "teacher_subjects",
    Base.metadata,
    Column("teacher_id", Integer, ForeignKey("teachers.id"), primary_key=True),
    Column("subject_code", String, ForeignKey("subjects.code"), primary_key=True),
)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    phone = Column(String)

    subjects = relationship("Subject", secondary=user_subjects, back_populates="subscribers")

class Subject(Base):
    __tablename__ = "subjects"

    code = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)

    subscribers = relationship("User", secondary=user_subjects, back_populates="subjects")
    teachers = relationship("Teacher", secondary=teacher_subjects, back_populates="subjects")

class Teacher(Base):
    __tablename__ = "teachers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)

    subjects = relationship("Subject", secondary=teacher_subjects, back_populates="teachers")
