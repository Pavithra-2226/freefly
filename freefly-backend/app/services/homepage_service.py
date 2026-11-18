from bson import ObjectId
from datetime import datetime, timezone
from app.database.connection import get_collection

banners = get_collection("homepage_banners")
postcards = get_collection("homepage_postcards")


def serialize(item):
    item["id"] = str(item.pop("_id"))
    return item


def get_items(collection, active_only=False):
    query = {"active": True} if active_only else {}
    items = list(collection.find(query).sort("display_order", 1))
    return [serialize(item) for item in items]


def create_item(collection, payload):
    data = payload.copy()
    data["created_at"] = datetime.now(timezone.utc)
    data["updated_at"] = datetime.now(timezone.utc)

    result = collection.insert_one(data)

    return serialize(collection.find_one({"_id": result.inserted_id}))


def update_item(collection, item_id, payload):
    if not ObjectId.is_valid(item_id):
        return None

    data = payload.copy()
    data["updated_at"] = datetime.now(timezone.utc)

    collection.update_one(
        {"_id": ObjectId(item_id)},
        {"$set": data}
    )

    item = collection.find_one({"_id": ObjectId(item_id)})

    return serialize(item) if item else None


def delete_item(collection, item_id):
    if not ObjectId.is_valid(item_id):
        return False

    result = collection.delete_one({"_id": ObjectId(item_id)})

    return result.deleted_count > 0