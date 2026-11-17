from datetime import datetime, timezone

from app.database.connection import db


packages = [
    {
        "title": "Bali Escape",
        "destination": "Bali",
        "duration": "4 Days / 3 Nights",
        "price": "From ₹45,000",
        "description": "An easy island escape with beautiful beaches, tropical views, private villa stays, and unforgettable sunset experiences.",
        "image": "/travel/bali.jpg",
        "tag": "Most loved",
        "status": "active",
        "inclusions": [],
        "exclusions": [],
        "itinerary": [],
    },
    {
        "title": "Manali Adventure",
        "destination": "Manali",
        "duration": "5 Days / 4 Nights",
        "price": "From ₹25,000",
        "description": "Explore the beautiful mountains, peaceful valleys, rivers, and scenic landscapes of Manali with family and friends.",
        "image": "/travel/mountain-lake.jpg",
        "tag": "New route",
        "status": "active",
        "inclusions": [],
        "exclusions": [],
        "itinerary": [],
    },
    {
        "title": "Dubai Explorer",
        "destination": "Dubai",
        "duration": "6 Days / 5 Nights",
        "price": "From ₹55,000",
        "description": "Experience Dubai with iconic skyscrapers, luxury shopping, desert adventures, beautiful attractions, and modern city life.",
        "image": "/travel/dubai.jpg",
        "tag": "Popular",
        "status": "active",
        "inclusions": [],
        "exclusions": [],
        "itinerary": [],
    },
]


def seed_packages():
    collection = db["packages"]

    inserted = 0
    skipped = 0

    now = datetime.now(timezone.utc)

    for package in packages:
        existing = collection.find_one({
            "title": package["title"]
        })

        if existing:
            skipped += 1
            continue

        package["created_at"] = now
        package["updated_at"] = now

        collection.insert_one(package)
        inserted += 1

    print(
        f"Package seed complete: "
        f"{inserted} inserted, {skipped} already present (skipped)."
    )


if __name__ == "__main__":
    seed_packages()