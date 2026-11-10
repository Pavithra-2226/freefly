from fastapi import APIRouter, Depends, HTTPException, status

from app.auth.security import get_current_admin
from app.schemas.enquiry import (
    EnquiryCreate,
    EnquiryUpdate,
    EnquiryResponse,
)
from app.services import enquiry_service


# -----------------------------
# Public Enquiry Routes
# -----------------------------

router = APIRouter(
    prefix="/api/enquiries",
    tags=["Enquiries"],
)


@router.post(
    "",
    response_model=EnquiryResponse,
    status_code=status.HTTP_201_CREATED,
)
def submit_enquiry(enquiry: EnquiryCreate):
    return enquiry_service.create_enquiry(
        enquiry.model_dump()
    )


# -----------------------------
# Admin Enquiry Routes
# -----------------------------

admin_router = APIRouter(
    prefix="/api/admin/enquiries",
    tags=["Admin - Enquiries"],
)


@admin_router.get(
    "",
    response_model=list[EnquiryResponse],
)
def admin_list_enquiries(
    current_admin=Depends(get_current_admin),
):
    return enquiry_service.get_all_enquiries()


@admin_router.get(
    "/{enquiry_id}",
    response_model=EnquiryResponse,
)
def admin_get_enquiry(
    enquiry_id: str,
    current_admin=Depends(get_current_admin),
):
    enquiry = enquiry_service.get_enquiry_by_id(enquiry_id)

    if enquiry is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Enquiry not found.",
        )

    return enquiry


@admin_router.put(
    "/{enquiry_id}",
    response_model=EnquiryResponse,
)
def admin_update_enquiry(
    enquiry_id: str,
    payload: EnquiryUpdate,
    current_admin=Depends(get_current_admin),
):
    if payload.status not in {"new", "contacted", "closed"}:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid enquiry status.",
        )

    enquiry = enquiry_service.update_enquiry_status(
        enquiry_id,
        payload.status,
    )

    if enquiry is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Enquiry not found.",
        )

    return enquiry


@admin_router.delete("/{enquiry_id}")
def admin_delete_enquiry(
    enquiry_id: str,
    current_admin=Depends(get_current_admin),
):
    deleted = enquiry_service.delete_enquiry(enquiry_id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Enquiry not found.",
        )

    return {
        "message": "Enquiry deleted successfully."
    }