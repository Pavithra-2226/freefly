from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class PackageBase(BaseModel):
    title: str = Field(..., max_length=150)
    destination: str = Field(..., max_length=120)
    duration: str = Field(..., max_length=100)
    price: str = Field(..., max_length=100)
    description: str = Field(...)
    image: str = Field(..., max_length=500)
    tag: Optional[str] = Field(default=None, max_length=50)
    status: str = Field(default="active", max_length=20)

    inclusions: list[str] = Field(default_factory=list)
    exclusions: list[str] = Field(default_factory=list)
    itinerary: list[str] = Field(default_factory=list)


class PackageCreate(PackageBase):
    pass


class PackageUpdate(BaseModel):
    title: Optional[str] = Field(default=None, max_length=150)
    destination: Optional[str] = Field(default=None, max_length=120)
    duration: Optional[str] = Field(default=None, max_length=100)
    price: Optional[str] = Field(default=None, max_length=100)
    description: Optional[str] = None
    image: Optional[str] = Field(default=None, max_length=500)
    tag: Optional[str] = Field(default=None, max_length=50)
    status: Optional[str] = Field(default=None, max_length=20)

    inclusions: Optional[list[str]] = None
    exclusions: Optional[list[str]] = None
    itinerary: Optional[list[str]] = None


class PackageResponse(PackageBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


def package_doc_to_response(doc: dict) -> dict:
    return {
        "id": str(doc["_id"]),
        "title": doc["title"],
        "destination": doc["destination"],
        "duration": doc["duration"],
        "price": doc["price"],
        "description": doc["description"],
        "image": doc["image"],
        "tag": doc.get("tag"),
        "status": doc.get("status", "active"),
        "inclusions": doc.get("inclusions", []),
        "exclusions": doc.get("exclusions", []),
        "itinerary": doc.get("itinerary", []),
        "created_at": doc["created_at"],
        "updated_at": doc["updated_at"],
    }