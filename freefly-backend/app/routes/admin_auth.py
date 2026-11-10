from fastapi import APIRouter, Depends, HTTPException, status

from app.auth.security import (
    create_access_token,
    get_current_admin,
    verify_password,
)
from app.schemas.admin import (
    AdminLoginRequest,
    AdminLoginResponse,
    AdminPublic,
)
from app.services.admin_service import (
    admin_to_public,
    get_admin_by_email,
)


router = APIRouter(
    prefix="/api/admin",
    tags=["Admin Authentication"],
)


@router.post(
    "/login",
    response_model=AdminLoginResponse,
)
def admin_login(login_data: AdminLoginRequest):
    """
    Authenticate an admin and return a JWT access token.
    """

    admin = get_admin_by_email(login_data.email)

    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    if not verify_password(
        login_data.password,
        admin["password_hash"],
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    token = create_access_token(
        admin_id=str(admin["_id"]),
        role=admin["role"],
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "admin": admin_to_public(admin),
    }


@router.get(
    "/me",
    response_model=AdminPublic,
)
def get_me(current_admin=Depends(get_current_admin)):
    """
    Protected test endpoint.
    Returns the currently authenticated admin.
    """

    return admin_to_public(current_admin)