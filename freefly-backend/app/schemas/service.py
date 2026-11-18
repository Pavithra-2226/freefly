
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class ServiceBase(BaseModel):
    title: str = Field(..., max_length=150)
    description: str
    image: str = Field(..., max_length=500)
    tag: Optional[str] = Field(default=None, max_length=50)
    button_text: str = Field(default="Explore Now", max_length=50)
    button_link: str = Field(default="/contact", max_length=300)
    status: str = Field(default="active", max_length=20)
    sort_order: int = Field(default=0)


class ServiceCreate(ServiceBase):
    pass


class ServiceUpdate(BaseModel):
    title: Optional[str] = Field(default=None, max_length=150)
    description: Optional[str] = None
    image: Optional[str] = Field(default=None, max_length=500)
    tag: Optional[str] = Field(default=None, max_length=50)
    button_text: Optional[str] = Field(default=None, max_length=50)
    button_link: Optional[str] = Field(default=None, max_length=300)
    status: Optional[str] = Field(default=None, max_length=20)
    sort_order: Optional[int] = None


class ServiceResponse(ServiceBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


def service_doc_to_response(doc: dict) -> dict:
    return {
        "id": str(doc["_id"]),
        "title": doc["title"],
        "description": doc["description"],
        "image": doc["image"],
        "tag": doc.get("tag"),
        "button_text": doc.get("button_text", "Explore Now"),
        "button_link": doc.get("button_link", "/contact"),
        "status": doc.get("status", "active"),
        "sort_order": doc.get("sort_order", 0),
        "created_at": doc["created_at"],
        "updated_at": doc["updated_at"],
    }
