from fastapi import APIRouter, Depends, HTTPException, status

from app.auth.security import get_current_admin
from app.schemas.service import (
    ServiceCreate,
    ServiceUpdate,
    ServiceResponse,
)
from app.services import service_service


router = APIRouter(
    prefix="/api/services",
    tags=["Services"],
)


@router.get("", response_model=list[ServiceResponse])
def list_services():
    return service_service.get_services()


admin_router = APIRouter(
    prefix="/api/admin/services",
    tags=["Admin - Services"],
)


@admin_router.get("", response_model=list[ServiceResponse])
def admin_list_services(current_admin=Depends(get_current_admin)):
    return service_service.get_all_services()


@admin_router.post(
    "",
    response_model=ServiceResponse,
    status_code=status.HTTP_201_CREATED,
)
def admin_create_service(
    payload: ServiceCreate,
    current_admin=Depends(get_current_admin),
):
    return service_service.create_service(payload)


@admin_router.put("/{service_id}", response_model=ServiceResponse)
def admin_update_service(
    service_id: str,
    payload: ServiceUpdate,
    current_admin=Depends(get_current_admin),
):
    service = service_service.update_service(service_id, payload)

    if service is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found.",
        )

    return service


@admin_router.delete("/{service_id}")
def admin_delete_service(
    service_id: str,
    current_admin=Depends(get_current_admin),
):
    deleted = service_service.delete_service(service_id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found.",
        )

    return {"message": "Service deleted successfully."}