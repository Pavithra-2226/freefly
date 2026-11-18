from fastapi import APIRouter, Depends, HTTPException
from app.auth.security import get_current_admin
from app.services import homepage_service

router = APIRouter(tags=["Homepage Management"])

SECTIONS = {
    "banners": homepage_service.banners,
    "postcards": homepage_service.postcards,
}


def get_collection(section):
    if section not in SECTIONS:
        raise HTTPException(
            status_code=404,
            detail="Invalid homepage section."
        )

    return SECTIONS[section]


# PUBLIC: Get active homepage content

@router.get("/api/homepage")
def get_homepage_content():
    return {
        "banners": homepage_service.get_items(
            homepage_service.banners, True
        ),
        "postcards": homepage_service.get_items(
            homepage_service.postcards, True
        )
    }


# ADMIN: Get all banners or postcards

@router.get("/api/admin/homepage/{section}")
def list_homepage_items(
    section: str,
    admin=Depends(get_current_admin)
):
    collection = get_collection(section)

    return homepage_service.get_items(collection)


# ADMIN: Create banner or postcard

@router.post("/api/admin/homepage/{section}")
def create_homepage_item(
    section: str,
    payload: dict,
    admin=Depends(get_current_admin)
):
    collection = get_collection(section)

    if section == "banners" and not payload.get("title"):
       raise HTTPException(400, "Title is required.")

    if not payload.get("image"):
        raise HTTPException(400, "Please upload an image.")

    return homepage_service.create_item(
        collection, payload
    )


# ADMIN: Update banner or postcard

@router.put("/api/admin/homepage/{section}/{item_id}")
def update_homepage_item(
    section: str,
    item_id: str,
    payload: dict,
    admin=Depends(get_current_admin)
):
    collection = get_collection(section)

    item = homepage_service.update_item(
        collection, item_id, payload
    )

    if not item:
        raise HTTPException(404, "Content not found.")

    return item


# ADMIN: Delete banner or postcard

@router.delete("/api/admin/homepage/{section}/{item_id}")
def delete_homepage_item(
    section: str,
    item_id: str,
    admin=Depends(get_current_admin)
):
    collection = get_collection(section)

    deleted = homepage_service.delete_item(
        collection, item_id
    )

    if not deleted:
        raise HTTPException(404, "Content not found.")

    return {"message": "Content deleted successfully."}