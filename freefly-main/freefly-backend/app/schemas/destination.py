"""
Pydantic schemas for the Destination resource.
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class DestinationPlace(BaseModel):
    name: str = Field(..., max_length=120)
    image: str = Field(..., max_length=500)
    description: str = Field(...)


class DestinationActivity(BaseModel):
    name: str = Field(..., max_length=120)
    image: str = Field(..., max_length=500)
    description: str = Field(...)


class DestinationBase(BaseModel):
    name: str = Field(..., max_length=120, examples=["Paris"])
    country: str = Field(..., max_length=120, examples=["France"])
    category: str = Field(..., max_length=50, examples=["International"])
    description: str = Field(...)
    image: str = Field(..., max_length=500)

    best_time_to_visit: Optional[str] = Field(
        default=None,
        max_length=200
    )

    places: list[DestinationPlace] = Field(
        default_factory=list
    )

    things_to_do: list[DestinationActivity] = Field(
        default_factory=list
    )

    gallery: list[str] = Field(
        default_factory=list
    )

    status: str = Field(
        default="active",
        max_length=20
    )


class DestinationCreate(DestinationBase):
    pass


class DestinationUpdate(BaseModel):
    name: Optional[str] = Field(default=None, max_length=120)
    country: Optional[str] = Field(default=None, max_length=120)
    category: Optional[str] = Field(default=None, max_length=50)
    description: Optional[str] = None
    image: Optional[str] = Field(default=None, max_length=500)

    best_time_to_visit: Optional[str] = Field(
        default=None,
        max_length=200
    )

    places: Optional[list[DestinationPlace]] = None

    things_to_do: Optional[list[DestinationActivity]] = None

    gallery: Optional[list[str]] = None

    status: Optional[str] = Field(
        default=None,
        max_length=20
    )


class DestinationResponse(DestinationBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


def destination_doc_to_response(doc: dict) -> dict:
    return {
        "id": str(doc["_id"]),
        "name": doc["name"],
        "country": doc["country"],
        "category": doc["category"],
        "description": doc["description"],
        "image": doc["image"],

        "best_time_to_visit": doc.get(
            "best_time_to_visit"
        ),

        "places": doc.get(
            "places",
            []
        ),

        "things_to_do": doc.get(
            "things_to_do",
            []
        ),

        "gallery": doc.get(
            "gallery",
            []
        ),

        "status": doc.get(
            "status",
            "active"
        ),

        "created_at": doc["created_at"],
        "updated_at": doc["updated_at"],
    }