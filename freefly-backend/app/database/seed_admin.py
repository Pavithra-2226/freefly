from getpass import getpass

from app.auth.security import hash_password
from app.database.connection import get_collection


def main():
    collection = get_collection("admins")

    print("=== Freefly Admin Creator ===")

    name = input("Admin name: ").strip()
    email = input("Admin email: ").strip().lower()
    password = getpass("Admin password: ")
    confirm_password = getpass("Confirm password: ")

    if not name:
        print("Error: Admin name is required.")
        return

    if not email:
        print("Error: Admin email is required.")
        return

    if not password:
        print("Error: Password is required.")
        return

    if password != confirm_password:
        print("Error: Passwords do not match.")
        return

    existing = collection.find_one({"email": email})

    if existing:
        print("Error: An admin with this email already exists.")
        return

    admin = {
        "name": name,
        "email": email,
        "password_hash": hash_password(password),
        "role": "admin",
        "status": "active",
    }

    result = collection.insert_one(admin)

    print(f"Admin created successfully. ID: {result.inserted_id}")


if __name__ == "__main__":
    main()