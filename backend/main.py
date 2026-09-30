import os
import sys

# Ensure both backend/ and parent directory are on sys.path
backend_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(backend_dir)
for p in [backend_dir, parent_dir]:
    if p not in sys.path:
        sys.path.insert(0, p)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from datetime import datetime
import asyncio
import uvicorn

# Import existing routes
try:
    from backend.api import trends, sources, dashboard, tracking
except ImportError:
    from api import trends, sources, dashboard, tracking

# Import full intelligence suite routes
from app.database import init_db
from app.routes import feed, jobs, stats, summary, collect

# Application state
class AppState:
    def __init__(self):
        self.running = False
        self.collection_task = None
        self.last_collection = None
        self.stats = {
            "total_items": 0,
            "sources_active": [],
            "last_error": None
        }

state = AppState()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan - start/stop background tasks."""
    # Startup
    try:
        init_db()
    except Exception as e:
        print(f"Database init warning: {e}")
    state.running = True
    state.collection_task = asyncio.create_task(periodic_collection())
    yield
    # Shutdown
    state.running = False
    if state.collection_task:
        state.collection_task.cancel()

async def periodic_collection():
    """Periodic data collection task."""
    while state.running:
        try:
            await collect_from_all_sources()
            state.last_collection = datetime.now().isoformat()
            await asyncio.sleep(300)  # Collect every 5 minutes
        except asyncio.CancelledError:
            break
        except Exception as e:
            state.stats["last_error"] = str(e)
            await asyncio.sleep(60)

async def collect_from_all_sources():
    """Collect data from all configured sources."""
    try:
        from backend.collectors import factory as collector_factory
    except ImportError:
        try:
            from collectors import factory as collector_factory
        except ImportError:
            collector_factory = None

    if collector_factory:
        try:
            sources = await collector_factory.get_all_sources()
            for source_name, collector in sources.items():
                try:
                    items = await collector.collect()
                    state.stats["total_items"] += len(items)
                    if source_name not in state.stats["sources_active"]:
                        state.stats["sources_active"].append(source_name)
                except Exception as e:
                    print(f"Error collecting from {source_name}: {e}")
        except Exception as e:
            print(f"Error fetching sources: {e}")

# Create FastAPI app
app = FastAPI(
    title="TrendRadar-AI API",
    description="AI-powered trend intelligence & opportunity radar",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(trends.router, prefix="/api/trends", tags=["trends"])
app.include_router(sources.router, prefix="/api/sources", tags=["sources"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])
app.include_router(tracking.router, prefix="/api/tracking", tags=["tracking"])

# Full intelligence suite routers
app.include_router(feed.router, prefix="/api", tags=["feed"])
app.include_router(jobs.router, prefix="/api", tags=["jobs"])
app.include_router(stats.router, prefix="/api", tags=["stats"])
app.include_router(summary.router, prefix="/api", tags=["summary"])
app.include_router(collect.router, prefix="/api", tags=["collect"])

@app.get("/")
async def root():
    return {
        "status": "ok", 
        "service": "TrendRadar-AI",
        "documentation": "/docs"
    }

@app.get("/api/health")
async def health():
    return {
        "status": "healthy",
        "running": state.running,
        "last_collection": state.last_collection,
        "stats": state.stats
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)