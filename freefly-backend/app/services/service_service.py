
from datetime import datetime, timezone

from bson import ObjectId

from app.database.connection import db
from app.schemas.service import (
    ServiceCreate,
    ServiceUpdate,
    service_doc_to_response,
)


def get_services():
    collection = db["services"]

    services = list(
        collection.find({"status": "active"})
        .sort("sort_order", 1)
    )

    return [service_doc_to_response(service) for service in services]


def get_all_services():
    collection = db["services"]

    services = list(
        collection.find({})
        .sort("sort_order", 1)
    )

    return [service_doc_to_response(service) for service in services]


def create_service(payload: ServiceCreate):
    collection = db["services"]

    now = datetime.now(timezone.utc)

    service_data = payload.model_dump()
    service_data["created_at"] = now
    service_data["updated_at"] = now

    result = collection.insert_one(service_data)
    service = collection.find_one({"_id": result.inserted_id})

    return service_doc_to_response(service)


def update_service(service_id: str, payload: ServiceUpdate):
    collection = db["services"]

    if not ObjectId.is_valid(service_id):
        return None

    update_data = payload.model_dump(exclude_unset=True)

    if not update_data:
        service = collection.find_one({"_id": ObjectId(service_id)})
        return service_doc_to_response(service) if service else None

    update_data["updated_at"] = datetime.now(timezone.utc)

    result = collection.update_one(
        {"_id": ObjectId(service_id)},
        {"$set": update_data},
    )

    if result.matched_count == 0:
        return None

    service = collection.find_one({"_id": ObjectId(service_id)})
    return service_doc_to_response(service)


def delete_service(service_id: str):
    collection = db["services"]

    if not ObjectId.is_valid(service_id):
        return False

    result = collection.delete_one({"_id": ObjectId(service_id)})

    return result.deleted_count > 0
