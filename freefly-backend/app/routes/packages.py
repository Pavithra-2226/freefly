from fastapi import APIRouter, Depends, HTTPException, status

from app.auth.security import get_current_admin
from app.schemas.package import (
    PackageCreate,
    PackageUpdate,
    PackageResponse,
)
from app.services import package_service


# -----------------------------
# Public Package Routes
# -----------------------------

router = APIRouter(
    prefix="/api/packages",
    tags=["Packages"],
)


@router.get("", response_model=list[PackageResponse])
def list_packages():
    return package_service.get_packages()

@router.get("/{package_id}", response_model=PackageResponse)
def get_package(package_id: str):
    package = package_service.get_package_by_id(package_id)

    if package is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Package not found.",
        )

    return package
# -----------------------------
# Admin Package Routes
# -----------------------------

admin_router = APIRouter(
    prefix="/api/admin/packages",
    tags=["Admin - Packages"],
)


@admin_router.get("", response_model=list[PackageResponse])
def admin_list_packages(
    current_admin=Depends(get_current_admin),
):
    return package_service.get_all_packages()


@admin_router.post(
    "",
    response_model=PackageResponse,
    status_code=status.HTTP_201_CREATED,
)
def admin_create_package(
    payload: PackageCreate,
    current_admin=Depends(get_current_admin),
):
    return package_service.create_package(payload)


@admin_router.put(
    "/{package_id}",
    response_model=PackageResponse,
)
def admin_update_package(
    package_id: str,
    payload: PackageUpdate,
    current_admin=Depends(get_current_admin),
):
    package = package_service.update_package(
        package_id,
        payload,
    )

    if package is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Package not found.",
        )

    return package


@admin_router.delete("/{package_id}")
def admin_delete_package(
    package_id: str,
    current_admin=Depends(get_current_admin),
):
    deleted = package_service.delete_package(package_id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Package not found.",
        )

    return {
        "message": "Package deleted successfully."
    }