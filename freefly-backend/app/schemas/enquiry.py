from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field, ConfigDict


class EnquiryCreate(BaseModel):
    name: str
    phone: str
    email: EmailStr
    package: Optional[str] = None
    destination: Optional[str] = None
    travel_date: Optional[str] = None
    travellers: Optional[int] = None
    message: Optional[str] = None


class EnquiryUpdate(BaseModel):
    status: Optional[str] = Field(default=None, max_length=20)


class EnquiryResponse(BaseModel):
    id: str
    name: str
    phone: str
    email: EmailStr
    package: Optional[str] = None
    destination: Optional[str] = None
    travel_date: Optional[str] = None
    travellers: Optional[int] = None
    message: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)