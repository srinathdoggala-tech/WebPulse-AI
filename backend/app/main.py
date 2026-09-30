import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import init_db
from app.routes import trends, feed, jobs, stats, summary, collect

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure database tables & seed data are initialized
    logger.info("Initializing TrendRadar AI Database...")
    init_db()
    logger.info("TrendRadar AI Engine Ready.")
    yield
    logger.info("Shutting down TrendRadar AI Engine.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="WebPulse & Community Intelligence: Multi-source Scraping, Topic Velocity Tracking, AI Analysis, and Job Opportunity Matcher.",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(trends.router, prefix=settings.API_PREFIX)
app.include_router(feed.router, prefix=settings.API_PREFIX)
app.include_router(jobs.router, prefix=settings.API_PREFIX)
app.include_router(stats.router, prefix=settings.API_PREFIX)
app.include_router(summary.router, prefix=settings.API_PREFIX)
app.include_router(collect.router, prefix=settings.API_PREFIX)

@app.get("/")
def root():
    return {
        "name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "docs_url": "/docs",
        "endpoints": [
            f"{settings.API_PREFIX}/trends",
            f"{settings.API_PREFIX}/trends/rising",
            f"{settings.API_PREFIX}/feed",
            f"{settings.API_PREFIX}/jobs",
            f"{settings.API_PREFIX}/jobs/match",
            f"{settings.API_PREFIX}/stats",
            f"{settings.API_PREFIX}/summary",
            f"{settings.API_PREFIX}/collect/trigger"
        ]
    }
