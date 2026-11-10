

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import media
from app.config import get_settings
from app.database.connection import check_db_connection
from app.routes import destinations
from app.routes import packages
from app.routes import enquiries
from app.routes import admin_auth
from app.routes import admin_destinations
settings = get_settings()

app = FastAPI(
    title=settings.APP_NAME,
    description="Backend API for the Freefly Tourism & Travels website.",
    version="0.1.0",
)

# Allow the Vite dev server (and any other configured origins) to call this API.
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
        print(f"[startup] Connected to MongoDB database '{settings.MONGODB_DB}'.")
    else:
        print(
            f"[startup] WARNING: could not reach MongoDB at the configured "
            f"MONGODB_URL. The API will still start; /health will report "
            f"'unreachable' until this is fixed."
        )


@app.get("/", tags=["Meta"])
def read_root():
    """Basic liveness check — confirms the API process itself is up."""
    return {
        "service": settings.APP_NAME,
        "status": "running",
        "environment": settings.APP_ENV,
    }


@app.get("/health", tags=["Meta"])
def health_check():
    """
    Confirms the API can reach MongoDB. This is the endpoint to hit
    right after setup to verify the database connection is actually working
    end-to-end (app -> PyMongo client -> MongoDB).
    """
    db_ok = check_db_connection()
    return {
        "api": "ok",
        "database": "connected" if db_ok else "unreachable",
    }


app.include_router(destinations.router)


app.include_router(packages.router)
app.include_router(packages.admin_router)
app.include_router(enquiries.router)
app.include_router(enquiries.admin_router)
app.include_router(admin_auth.router)
app.include_router(admin_destinations.router)
app.include_router(media.router)