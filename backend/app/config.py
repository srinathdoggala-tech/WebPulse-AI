import os

class Settings:
    PROJECT_NAME: str = "WebPulse AI: Real-Time Web Trend & Intelligence Tracker"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    DATABASE_PATH: str = os.path.join(os.path.dirname(__file__), "..", "webpulse.db")
    CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8000",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:8000",
        "*"
    ]
    COLLECTION_INTERVAL_MINUTES: int = 15
    DEFAULT_SOURCES: list = ["HackerNews", "GitHub", "Reddit", "ArXiv/TechNews", "JobBoards"]
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")

settings = Settings()
