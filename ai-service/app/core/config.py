import os

class Settings:
    PROJECT_NAME: str = "CampusConnect AI Recommendation Service"
    API_V1_STR: str = "/api/v1"
    PORT: int = int(os.getenv("PORT", "8000"))
    HOST: str = os.getenv("HOST", "0.0.0.0")
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    INTERNAL_API_KEY: str = os.getenv("INTERNAL_API_KEY", "campusconnect_internal_secret_key")

settings = Settings()
