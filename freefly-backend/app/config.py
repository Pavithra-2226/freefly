"""
Centralized application configuration.

All environment-dependent values (DB connection, CORS origins, etc.) are
read from environment variables / a local .env file via pydantic-settings.
Nothing here is hardcoded — this file only defines *how* config is loaded
and validated, never the actual secret values.
"""

from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # --- App metadata ---
    APP_NAME: str = "Freefly Tourism & Travels API"
    APP_ENV: str = "development"  # development | staging | production
    DEBUG: bool = True

    # --- MongoDB connection ---
    # e.g. mongodb://localhost:27017  (local)
    # or   mongodb+srv://user:pass@cluster.mongodb.net  (Atlas / hosted)
    MONGODB_URL: str
    MONGODB_DB: str

    # --- CORS: which frontend origins may call this API ---
    # Comma-separated in .env, e.g. "http://localhost:5173,http://127.0.0.1:5173"
    CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173"

    
    CLOUDINARY_CLOUD_NAME: str="kgmrhxkm"
    CLOUDINARY_API_KEY: str= "954719721474747"
    CLOUDINARY_API_SECRET: str="TRzALDriDqae0sPAONeRnp6co"
    # --- Admin authentication ---
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 60
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    """
    Cached settings accessor. Using a function (instead of a module-level
    instance) makes it easy to override settings in tests later by clearing
    the cache, and avoids re-parsing the .env file on every import.
    """
    return Settings()
