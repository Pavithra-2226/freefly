"""
Destination service layer (MongoDB / PyMongo).

All database querying and filtering logic for destinations lives here,
kept separate from the route file (which only handles HTTP concerns) and
the schema file (which only defines the API contract).

Every function returns either raw MongoDB documents or plain dicts already
shaped for DestinationResponse (via destination_doc_to_response) — routes
never touch PyMongo or ObjectId directly.
"""

from datetime import datetime, timezone
from typing import Optional

from bson import ObjectId
from bson.errors import InvalidId
from pymongo import ReturnDocument

from app.database.connection import get_collection
from app.schemas.destination import (
    DestinationCreate,
    DestinationUpdate,
    destination_doc_to_response,
)

COLLECTION_NAME = "destinations"


def _collection():
    return get_collection(COLLECTION_NAME)


def get_destinations(
    category: Optional[str] = None,
    search: Optional[str] = None,
) -> list[dict]:
    """
    Returns destinations, optionally filtered by category and/or a search
    term matched (case-insensitively) against name/country. Category and
    search combine with AND, matching the requirement that
    GET /api/destinations?category=Beach&search=Maldives works together.
    """
    query: dict = {}

    if category and category.lower() != "all":
        query["category"] = {"$regex": f"^{category}$", "$options": "i"}

    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"country": {"$regex": search, "$options": "i"}},
        ]

    cursor = _collection().find(query).sort("_id", 1)
    return [destination_doc_to_response(doc) for doc in cursor]

def get_active_destinations(
    category: Optional[str] = None,
    search: Optional[str] = None,
) -> list[dict]:
    """
    Returns only active destinations for the public/user website.
    """

    query: dict = {
        "status": "active"
    }

    if category and category.lower() != "all":
        query["category"] = {
            "$regex": f"^{category}$",
            "$options": "i"
        }

    if search:
        query["$or"] = [
            {
                "name": {
                    "$regex": search,
                    "$options": "i"
                }
            },
            {
                "country": {
                    "$regex": search,
                    "$options": "i"
                }
            },
        ]

    cursor = _collection().find(query).sort("_id", 1)

    return [
        destination_doc_to_response(doc)
        for doc in cursor
    ]


def get_active_destination_by_id(
    destination_id: str
) -> Optional[dict]:
    """
    Returns a destination only if it exists and is active.
    Used by the public/user website.
    """

    try:
        object_id = ObjectId(destination_id)
    except (InvalidId, TypeError):
        return None

    doc = _collection().find_one({
        "_id": object_id,
        "status": "active"
    })

    if doc is None:
        return None

    return destination_doc_to_response(doc)

def get_destination_by_id(destination_id: str) -> Optional[dict]:
    """
    Returns a single destination by id, or None if it doesn't exist OR if
    the id string isn't a valid MongoDB ObjectId at all (bad input is
    treated the same as "not found" — see the route layer for the actual
    HTTP status chosen for each case).
    """
    try:
        object_id = ObjectId(destination_id)
    except (InvalidId, TypeError):
        return None

    doc = _collection().find_one({"_id": object_id})
    if doc is None:
        return None
    return destination_doc_to_response(doc)


def create_destination(payload: DestinationCreate) -> dict:
    """Prepared for future admin use — not yet exposed on a public route."""
    now = datetime.now(timezone.utc)
    document = {
        **payload.model_dump(),
        "created_at": now,
        "updated_at": now,
    }
    result = _collection().insert_one(document)
    document["_id"] = result.inserted_id
    return destination_doc_to_response(document)


def update_destination(destination_id: str, payload: DestinationUpdate) -> Optional[dict]:
    """Prepared for future admin use — not yet exposed on a public route."""
    try:
        object_id = ObjectId(destination_id)
    except (InvalidId, TypeError):
        return None

    update_data = payload.model_dump(exclude_unset=True)
    if not update_data:
        return get_destination_by_id(destination_id)

    update_data["updated_at"] = datetime.now(timezone.utc)

    result = _collection().find_one_and_update(
        {"_id": object_id},
        {"$set": update_data},
        return_document=ReturnDocument.AFTER,
    )
    if result is None:
        return None
    return destination_doc_to_response(result)


def delete_destination(destination_id: str) -> bool:
    """Prepared for future admin use — not yet exposed on a public route."""
    try:
        object_id = ObjectId(destination_id)
    except (InvalidId, TypeError):
        return False

    result = _collection().delete_one({"_id": object_id})
    return result.deleted_count > 0
