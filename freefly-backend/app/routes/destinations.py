"""
Destination routes (MongoDB-backed).

Only the public read endpoints requested for this module are exposed here:

    GET /api/destinations                          (list, optional filters)
    GET /api/destinations/{id}                       (single destination)

Filtering is done via query params on the list endpoint:
    GET /api/destinations?category=Beach
    GET /api/destinations?search=Dubai
    GET /api/destinations?category=Beach&search=Maldives

Response shape is unchanged from the PostgreSQL version — the frontend
(Step 3) doesn't need to know the backend switched databases.

Create/update/delete logic already exists in the service layer for future
admin use, but is intentionally not wired to a route yet.
"""

from typing import Optional

from bson import ObjectId
from fastapi import APIRouter, HTTPException, Query

from app.schemas.destination import DestinationResponse
from app.services import destination_service

router = APIRouter(prefix="/api/destinations", tags=["Destinations"])


@router.get("", response_model=list[DestinationResponse])
def list_destinations(
    category: Optional[str] = Query(
        default=None, description="Filter by category, e.g. 'Beach'. 'All' returns everything."
    ),
    search: Optional[str] = Query(
        default=None, description="Case-insensitive match against name or country."
    ),
):
    """Returns all destinations, optionally filtered by category and/or search."""
    return destination_service.get_active_destinations(category=category, search=search)


@router.get("/{destination_id}", response_model=DestinationResponse)
def get_destination(destination_id: str):
    """
    Returns a single destination by id.

    - 404 if the id is a validly-formed ObjectId but no matching document
      exists (the common "not found" case, e.g. a stale or made-up id).
    - 400 if the id string isn't a valid MongoDB ObjectId at all — this
      keeps a malformed id (e.g. "abc") from ever surfacing a raw
      traceback to the client.
    """
    if not ObjectId.is_valid(destination_id):
        raise HTTPException(
            status_code=400,
            detail=f"'{destination_id}' is not a valid destination id.",
        )

    destination = destination_service.get_active_destination_by_id(destination_id)
    if destination is None:
        raise HTTPException(
            status_code=404,
            detail=f"Destination with id {destination_id} was not found.",
        )
    return destination
