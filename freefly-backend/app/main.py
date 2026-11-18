
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.database.connection import check_db_connection

from app.routes import destinations
from app.routes import packages
from app.routes import enquiries
from app.routes import admin_auth
from app.routes import services

settings = get_settings()

app = FastAPI(
    title=settings.APP_NAME,
    description="Backend API for the Freefly Tourism & Travels website.",
    version="0.1.0",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def verify_mongodb_connection():
    if check_db_connection():
        print(
            f"[startup] Connected to MongoDB database "
            f"'{settings.MONGODB_DB}'."
        )
    else:
        print(
            "[startup] WARNING: Could not reach MongoDB at the configured "
            "MONGODB_URL. The API will still start; /health will report "
            "'unreachable' until this is fixed."
        )


@app.get("/", tags=["Meta"])
def read_root():
    return {
        "service": settings.APP_NAME,
        "status": "running",
        "environment": settings.APP_ENV,
    }


@app.get("/health", tags=["Meta"])
def health_check():
    db_ok = check_db_connection()

    return {
        "api": "ok",
        "database": "connected" if db_ok else "unreachable",
    }


# Destination routes
app.include_router(destinations.router)
app.include_router(destinations.admin_router)

# Package routes
app.include_router(packages.router)
app.include_router(packages.admin_router)

# Enquiry routes
app.include_router(enquiries.router)
app.include_router(enquiries.admin_router)

# Admin authentication
app.include_router(admin_auth.router)

# Service routes
app.include_router(services.router)
app.include_router(services.admin_router)
