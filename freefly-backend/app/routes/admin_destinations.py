from fastapi import APIRouter, Depends, HTTPException, status

from app.auth.security import get_current_admin
from app.schemas.destination import (
    DestinationCreate,
    DestinationUpdate,
    DestinationResponse,
)
from app.services import destination_service

router = APIRouter(
    prefix="/api/admin/destinations",
    tags=["Admin - Destinations"],
)


@router.get(
    "",
    response_model=list[DestinationResponse],
)
def admin_list_destinations(
    current_admin=Depends(get_current_admin),
):
    return destination_service.get_destinations()


@router.post(
    "",
    response_model=DestinationResponse,
    status_code=status.HTTP_201_CREATED,
)
def admin_create_destination(
    payload: DestinationCreate,
    current_admin=Depends(get_current_admin),
):
    return destination_service.create_destination(payload)


@router.put(
    "/{destination_id}",
    response_model=DestinationResponse,
)
def admin_update_destination(
    destination_id: str,
    payload: DestinationUpdate,
    current_admin=Depends(get_current_admin),
):
    destination = destination_service.update_destination(
        destination_id,
        payload,
    )

    if destination is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Destination not found.",
        )

    return destination


@router.delete(
    "/{destination_id}",
)
def admin_delete_destination(
    destination_id: str,
    current_admin=Depends(get_current_admin),
):
    deleted = destination_service.delete_destination(
        destination_id
    )

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Destination not found.",
        )

    return {
        "message": "Destination deleted successfully."
    }