
import cloudinary
import cloudinary.uploader

from fastapi import HTTPException

from app.config import get_settings


def configure_cloudinary():
    settings = get_settings()

    if not all([
        settings.CLOUDINARY_CLOUD_NAME,
        settings.CLOUDINARY_API_KEY,
        settings.CLOUDINARY_API_SECRET,
    ]):
        raise HTTPException(
            status_code=503,
            detail="Cloudinary is not configured. Check backend environment variables.",
        )

    cloudinary.config(
        cloud_name=settings.CLOUDINARY_CLOUD_NAME,
        api_key=settings.CLOUDINARY_API_KEY,
        api_secret=settings.CLOUDINARY_API_SECRET,
        secure=True,
    )


def upload_image(file_bytes: bytes):
    configure_cloudinary()

    try:
        result = cloudinary.uploader.upload(
            file_bytes,
            folder="freefly",
            resource_type="image",
            allowed_formats=["jpg", "jpeg", "png", "webp", "gif"],
        )

        return {
            "url": result["secure_url"],
            "public_id": result["public_id"],
            "format": result.get("format"),
            "width": result.get("width"),
            "height": result.get("height"),
        }

    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail="Image upload failed. Please try again.",
        ) from exc


def delete_image(public_id: str):
    configure_cloudinary()

    try:
        result = cloudinary.uploader.destroy(
            public_id,
            resource_type="image",
        )

        if result.get("result") != "ok":
            raise HTTPException(
                status_code=404,
                detail="Image was not found in Cloudinary.",
            )

        return {"message": "Image deleted successfully."}

    except HTTPException:
        raise

    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail="Image deletion failed.",
        ) from exc
