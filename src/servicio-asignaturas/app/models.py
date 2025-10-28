from sqlalchemy import Column, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Subject(Base):
    __tablename__ = "subjects"
    code = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
