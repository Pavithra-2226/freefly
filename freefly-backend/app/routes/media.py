
from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    UploadFile,
)

from app.auth.security import get_current_admin
from app.services import cloudinary_service


router = APIRouter(
    prefix="/api/admin/media",
    tags=["Admin - Media"],
)

MAX_FILE_SIZE = 10 * 1024 * 1024

ALLOWED_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
}


@router.post("/upload")
async def upload_media(
    file: UploadFile = File(...),
    current_admin=Depends(get_current_admin),
):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Only JPG, PNG, WEBP and GIF images are allowed.",
        )

    file_bytes = await file.read(MAX_FILE_SIZE + 1)

    if not file_bytes:
        raise HTTPException(
            status_code=400,
            detail="Please select an image.",
        )

    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="Image size must not exceed 10 MB.",
        )

    result = cloudinary_service.upload_image(file_bytes)

    return {
        "message": "Image uploaded successfully.",
        "image": result,
    }


@router.delete("/{public_id:path}")
def remove_media(
    public_id: str,
    current_admin=Depends(get_current_admin),
):
    if not public_id.startswith("freefly/"):
        raise HTTPException(
            status_code=400,
            detail="Invalid Free Fly image reference.",
        )

    return cloudinary_service.delete_image(public_id)
