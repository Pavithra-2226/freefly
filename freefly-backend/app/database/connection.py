"""
Database connection setup (MongoDB / PyMongo).

This module owns exactly three things:
1. `client`   — the PyMongo MongoClient (connection pool to MongoDB)
2. `db`       — the database instance (freefly_db, or whatever MONGODB_DB is)
3. `get_collection()` — a small helper for accessing a named collection

There is no ORM layer and no schema/table creation step here — MongoDB
collections are created implicitly the first time a document is inserted
into them (the seed script does this for "destinations").
"""

from pymongo import MongoClient
from pymongo.collection import Collection
from pymongo.database import Database
from pymongo.errors import PyMongoError

from app.config import get_settings

settings = get_settings()

# serverSelectionTimeoutMS keeps connection failures fast (a few seconds)
# instead of hanging — important for /health to respond promptly when
# MongoDB is unreachable.
client: MongoClient = MongoClient(
    settings.MONGODB_URL,
    serverSelectionTimeoutMS=5000,
)

db: Database = client[settings.MONGODB_DB]


def get_collection(name: str) -> Collection:
    """
    Small helper so route/service code never references `db[...]` directly
    and instead goes through one place, e.g. get_collection("destinations").
    """
    return db[name]


def check_db_connection() -> bool:
    """
    Confirms the app can actually reach MongoDB. Used by the /health
    endpoint in main.py. `ping` is the standard lightweight MongoDB
    connectivity check — it doesn't touch any collection or data.
    """
    try:
        client.admin.command("ping")
        return True
    except PyMongoError:
        return False
