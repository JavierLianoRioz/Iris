from pydantic import BaseModel
from typing import List

class SubscriptionRequest(BaseModel):
    name: str
    phone: str
    subject_codes: List[str]
