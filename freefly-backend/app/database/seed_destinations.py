"""
Seeds the "destinations" collection with the 6 records currently hardcoded
in the frontend's src/data.js, so the database starts out matching exactly
what the site already shows.

Run with (from the freefly-backend/ directory, venv activated):

    python -m app.database.seed_destinations

Safe to run multiple times: each record is looked up by (name, country)
before inserting, so re-running this script will not create duplicates.
It also (re)creates the indexes described in ensure_indexes() every run,
which is harmless — MongoDB is a no-op if an equivalent index already
exists.
"""

from datetime import datetime, timezone

from app.database.connection import get_collection

COLLECTION_NAME = "destinations"

# Copied 1:1 from src/data.js `export const destinations` — same order,
# same field values. If data.js ever changes, update this list to match.
SEED_DESTINATIONS = [
    {
        "name": "Paris",
        "country": "France",
        "category": "International",
        "description": "Cafes, culture, and the glow of the city by the Seine.",
        "image": "/travel/paris.jpg",
    },
    {
        "name": "Maldives",
        "country": "Indian Ocean",
        "category": "Beach",
        "description": "Slow mornings, clear water, and barefoot island days.",
        "image": "/travel/maldives.jpg",
    },
    {
        "name": "Dubai",
        "country": "United Arab Emirates",
        "category": "International",
        "description": "A bold blend of desert horizons and electric city life.",
        "image": "/travel/dubai.jpg",
    },
    {
        "name": "Switzerland",
        "country": "Europe",
        "category": "Adventure",
        "description": "Alpine air, storybook villages, and train-window views.",
        "image": "/travel/switzerland.jpg",
    },
    {
        "name": "Bali",
        "country": "Indonesia",
        "category": "Honeymoon",
        "description": "A soulful mix of jungle, ceremony, surf, and stillness.",
        "image": "/travel/bali.jpg",
    },
    {
        "name": "Singapore",
        "country": "Southeast Asia",
        "category": "International",
        "description": "Garden city energy, hawker stalls, and future-facing design.",
        "image": "/travel/singapore.jpg",
    },
]


def ensure_indexes():
    """
    Creates the indexes useful for the current query patterns:
    - name, country: looked up together during seeding/dedup, and searched
      individually via the ?search= query param
    - category: filtered via the ?category= query param and the frontend's
      category buttons
    - status: will matter once "inactive" destinations can be hidden
    """
    collection = get_collection(COLLECTION_NAME)
    collection.create_index([("name", 1), ("country", 1)])
    collection.create_index("category")
    collection.create_index("status")


def seed():
    collection = get_collection(COLLECTION_NAME)
    ensure_indexes()

    inserted = 0
    skipped = 0
    now = datetime.now(timezone.utc)

    for record in SEED_DESTINATIONS:
        exists = collection.find_one({"name": record["name"], "country": record["country"]})
        if exists:
            skipped += 1
            continue

        collection.insert_one(
            {
                **record,
                "status": "active",
                "created_at": now,
                "updated_at": now,
            }
        )
        inserted += 1

    print(f"Seed complete: {inserted} inserted, {skipped} already present (skipped).")


if __name__ == "__main__":
    seed()
