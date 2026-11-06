from bson import ObjectId
from bson.errors import InvalidId

from app.database.connection import get_collection


COLLECTION_NAME = "admins"


def _collection():
    return get_collection(COLLECTION_NAME)


def get_admin_by_email(email: str):
    """Find an active admin by email."""

    return _collection().find_one(
        {
            "email": email.lower().strip(),
            "status": "active",
        }
    )


def get_admin_by_id(admin_id: str):
    """Find an active admin by MongoDB ObjectId."""

    try:
        object_id = ObjectId(admin_id)
    except (InvalidId, TypeError):
        return None

    return _collection().find_one(
        {
            "_id": object_id,
            "status": "active",
        }
    )


def admin_to_public(admin: dict) -> dict:
    """Remove sensitive database fields before returning admin data."""

    return {
        "id": str(admin["_id"]),
        "name": admin["name"],
        "email": admin["email"],
        "role": admin["role"],
        "status": admin["status"],
    }