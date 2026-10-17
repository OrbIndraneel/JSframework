import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.api.v1.api import api_router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("campusconnect_ai")

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
    description="CampusConnect AI Microservice: Job-Skill Matcher, Ranked Recommender, and Resume Parser",
    version="1.0.0",
)

# CORS middleware for development and internal integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Incoming {request.method} {request.url.path}")
    try:
        response = await call_next(request)
        logger.info(f"Completed {request.method} {request.url.path} with status {response.status_code}")
        return response
    except Exception as exc:
        logger.error(f"Request failed: {request.method} {request.url.path} - {str(exc)}")
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error in AI recommendation microservice."}
        )

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "message": "Welcome to CampusConnect AI Recommendation Service",
        "docs": f"{settings.API_V1_STR}/docs",
        "health": f"{settings.API_V1_STR}/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
