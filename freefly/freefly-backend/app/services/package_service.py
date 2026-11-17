from datetime import datetime, timezone

from bson import ObjectId

from app.database.connection import db
from app.schemas.package import (
    PackageCreate,
    PackageUpdate,
    package_doc_to_response,
)


def get_packages():
    collection = db["packages"]

    packages = list(
        collection.find(
            {"status": "active"}
        ).sort("created_at", -1)
    )

    return [package_doc_to_response(package) for package in packages]


def get_all_packages():
    collection = db["packages"]

    packages = list(
        collection.find({})
        .sort("created_at", -1)
    )

    return [package_doc_to_response(package) for package in packages]


def create_package(payload: PackageCreate):
    collection = db["packages"]

    now = datetime.now(timezone.utc)

    package_data = payload.model_dump()
    package_data["created_at"] = now
    package_data["updated_at"] = now

    result = collection.insert_one(package_data)

    package = collection.find_one({"_id": result.inserted_id})

    return package_doc_to_response(package)


def update_package(package_id: str, payload: PackageUpdate):
    collection = db["packages"]

    if not ObjectId.is_valid(package_id):
        return None

    update_data = payload.model_dump(exclude_unset=True)

    if not update_data:
        package = collection.find_one({"_id": ObjectId(package_id)})
        if package is None:
            return None
        return package_doc_to_response(package)

    update_data["updated_at"] = datetime.now(timezone.utc)

    result = collection.update_one(
        {"_id": ObjectId(package_id)},
        {"$set": update_data},
    )

    if result.matched_count == 0:
        return None

    package = collection.find_one({"_id": ObjectId(package_id)})

    return package_doc_to_response(package)


def delete_package(package_id: str):
    collection = db["packages"]

    if not ObjectId.is_valid(package_id):
        return False

    result = collection.delete_one(
        {"_id": ObjectId(package_id)}
    )

    return result.deleted_count > 0

def get_package_by_id(package_id: str):
    collection = db["packages"]

    if not ObjectId.is_valid(package_id):
        return None

    package = collection.find_one(
        {
            "_id": ObjectId(package_id),
            "status": "active",
        }
    )

    if package is None:
        return None

    return package_doc_to_response(package)