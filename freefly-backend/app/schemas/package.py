
from datetime import datetime
from typing import Optional, Union

from pydantic import BaseModel, ConfigDict, Field


class ItineraryDay(BaseModel):
    day: int = Field(..., ge=1)
    title: str = Field(..., max_length=150)
    description: str
    image: str = Field(..., max_length=500)


class PackageBase(BaseModel):
    title: str = Field(..., max_length=150)
    destination: str = Field(..., max_length=120)
    duration: str = Field(..., max_length=100)
    price: str = Field(..., max_length=100)
    description: str
    image: str = Field(..., max_length=500)

    tag: Optional[str] = Field(default=None, max_length=50)
    status: str = Field(default="active", max_length=20)

    inclusions: list[str] = Field(default_factory=list)
    inclusion_images: list[str] = Field(default_factory=list)

    exclusions: list[str] = Field(default_factory=list)
    exclusion_images: list[str] = Field(default_factory=list)

    itinerary: list[Union[ItineraryDay, str]] = Field(default_factory=list)


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
    inclusion_images: Optional[list[str]] = None

    exclusions: Optional[list[str]] = None
    exclusion_images: Optional[list[str]] = None

    itinerary: Optional[list[Union[ItineraryDay, str]]] = None


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
        "inclusion_images": doc.get("inclusion_images", []),

        "exclusions": doc.get("exclusions", []),
        "exclusion_images": doc.get("exclusion_images", []),

        "itinerary": doc.get("itinerary", []),

        "created_at": doc["created_at"],
        "updated_at": doc["updated_at"],
    }
