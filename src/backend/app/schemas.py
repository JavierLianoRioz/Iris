from pydantic import BaseModel, ConfigDict
from typing import List

class SubjectSchema(BaseModel):
    code: str
    name: str

    model_config = ConfigDict(from_attributes=True)

class SubscriptionRequest(BaseModel):
    name: str
    phone: str
    subject_codes: List[str]