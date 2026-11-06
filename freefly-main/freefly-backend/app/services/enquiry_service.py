from datetime import datetime, timezone

from bson import ObjectId

from app.database.connection import db


def create_enquiry(enquiry_data):
    collection = db["enquiries"]

    now = datetime.now(timezone.utc)

    enquiry = {
        **enquiry_data,
        "status": "new",
        "created_at": now,
        "updated_at": now,
    }

    result = collection.insert_one(enquiry)

    enquiry["id"] = str(result.inserted_id)
    enquiry.pop("_id", None)

    return enquiry


def get_all_enquiries():
    collection = db["enquiries"]

    enquiries = list(
        collection.find({}).sort("created_at", -1)
    )

    for enquiry in enquiries:
        enquiry["id"] = str(enquiry["_id"])
        enquiry.pop("_id", None)

    return enquiries


def get_enquiry_by_id(enquiry_id: str):
    collection = db["enquiries"]

    if not ObjectId.is_valid(enquiry_id):
        return None

    enquiry = collection.find_one({
        "_id": ObjectId(enquiry_id)
    })

    if enquiry is None:
        return None

    enquiry["id"] = str(enquiry["_id"])
    enquiry.pop("_id", None)

    return enquiry


def update_enquiry_status(enquiry_id: str, status: str):
    collection = db["enquiries"]

    if not ObjectId.is_valid(enquiry_id):
        return None

    result = collection.update_one(
        {"_id": ObjectId(enquiry_id)},
        {
            "$set": {
                "status": status,
                "updated_at": datetime.now(timezone.utc),
            }
        },
    )

    if result.matched_count == 0:
        return None

    return get_enquiry_by_id(enquiry_id)


def delete_enquiry(enquiry_id: str):
    collection = db["enquiries"]

    if not ObjectId.is_valid(enquiry_id):
        return False

    result = collection.delete_one({
        "_id": ObjectId(enquiry_id)
    })

    return result.deleted_count > 0