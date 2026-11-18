
from typing import Optional

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.auth.security import get_current_admin
from app.schemas.destination import (
    DestinationCreate,
    DestinationUpdate,
    DestinationResponse,
)
from app.services import destination_service


# Public destination routes
router = APIRouter(
    prefix="/api/destinations",
    tags=["Destinations"],
)


@router.get("", response_model=list[DestinationResponse])
def list_destinations(
    category: Optional[str] = Query(default=None),
    search: Optional[str] = Query(default=None),
):
    return destination_service.get_active_destinations(
        category=category,
        search=search,
    )


@router.get("/{destination_id}", response_model=DestinationResponse)
def get_destination(destination_id: str):
    if not ObjectId.is_valid(destination_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid destination ID.",
        )

    destination = destination_service.get_active_destination_by_id(
        destination_id
    )

    if destination is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Destination not found.",
        )

    return destination


# Protected admin destination routes
admin_router = APIRouter(
    prefix="/api/admin/destinations",
    tags=["Admin - Destinations"],
)


@admin_router.get("", response_model=list[DestinationResponse])
def admin_list_destinations(
    current_admin=Depends(get_current_admin),
):
    return destination_service.get_destinations()


@admin_router.post(
    "",
    response_model=DestinationResponse,
    status_code=status.HTTP_201_CREATED,
)
def admin_create_destination(
    payload: DestinationCreate,
    current_admin=Depends(get_current_admin),
):
    return destination_service.create_destination(payload)


@admin_router.put(
    "/{destination_id}",
    response_model=DestinationResponse,
)
def admin_update_destination(
    destination_id: str,
    payload: DestinationUpdate,
    current_admin=Depends(get_current_admin),
):
    if not ObjectId.is_valid(destination_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid destination ID.",
        )

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


@admin_router.delete("/{destination_id}")
def admin_delete_destination(
    destination_id: str,
    current_admin=Depends(get_current_admin),
):
    if not ObjectId.is_valid(destination_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid destination ID.",
        )

    deleted = destination_service.delete_destination(destination_id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Destination not found.",
        )

    return {"message": "Destination deleted successfully."}
