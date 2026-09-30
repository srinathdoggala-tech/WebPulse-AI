"""Category classifier for classifying items."""

from typing import Dict, List
from backend.models import ItemCategory


class CategoryClassifier:
    """Classify items into categories based on content."""

    def __init__(self):
        self.category_keywords = {
            ItemCategory.TECHNOLOGY: [
                "ai", "ml", "machine learning", "deep learning", "llm",
                "transformer", "python", "javascript", "typescript", "rust",
                "react", "vue", "angular", "nextjs", "svelte",
                "kubernetes", "docker", "microservices", "serverless",
                "api", "rest", "graphql", "grpc", "websocket",
                "database", "sql", "nosql", "postgresql", "mongodb", "redis",
                "ci/cd", "devops", "terraform", "ansible", "github actions",
                "cloud", "aws", "gcp", "azure", "vercel", "netlify",
                "git", "github", "open source", "repository", "contribution",
                "security", "privacy", "encryption", "blockchain", "web3",
                "ar", "vr", "xr", "metaverse", "gaming", "unity", "unreal",
                "quantum", "computing", "optimization", "performance",
                "programming", "development", "software engineering"
            ],
            ItemCategory.BUSINESS: [
                "business", "startup", "funding", "venture capital",
                "series a", "series b", "series c", "ipo", "acquisition",
                "product", "launch", "mvp", "saas", "b2b", "b2c",
                "growth", "marketing", "sales", "revenue", "profit",
                "company", "ceo", "founder", "team", "hiring",
                "remote work", "engineer", "developer", "salary",
                "market", "industry", "competition", "strategy"
            ],
            ItemCategory.SCIENCE: [
                "research", "paper", "arxiv", "scientific", "scientific discovery",
                "experiment", "hypothesis", "theory", "study", "research paper",
                "dataset", "benchmark", "evaluation", "testing", "peer review",
                "neuroscience", "biology", "physics", "chemistry", "quantum",
                "genetics", "genomics", "bioinformatics", "computational biology"
            ],
            ItemCategory.DESIGN: [
                "design", "ux", "ui", "user interface", "user experience",
                "design system", "prototyping", "wireframe", "mockup",
                "color", "typography", "layout", "visual", "graphic design",
                "interaction", "usability", "accessibility", "responsive design",
                "frontend", "css", "html", "figma", "sketch"
            ],
            ItemCategory.PRODUCT: [
                "product", "launch", "release", "features", "update",
                "version", "roadmap", "user experience", "market fit",
                "feedback", "reviews", "rating", "customer", "user research",
                "a/b test", "metrics", "kpi", "retention", "engagement",
                "conversion", "onboarding", "iteration"
            ],
            ItemCategory.JOBS: [
                "job", "hiring", "position", "role", "salary", "remote",
                "engineer", "developer", "scientist", "designer", "manager",
                "full stack", "frontend", "backend", "devops", "ml engineer",
                "data scientist", "product manager", "ux designer",
                "cto", "vp", "director", "principal", "staff", "senior",
                "junior", "intern", "contract", "full time", "part time",
                "w2", "1099", "consulting", "freelance"
            ],
            ItemCategory.COMMUNITY: [
                "community", "meetup", "conference", "event", "workshop",
                "hackathon", "forum", "discussion", "question", "help",
                "support", "collaboration", "open source", "contribution",
                "volunteer", "mentor", "networking", "social"
            ],
            ItemCategory.GENERAL: []
        }

    async def classify(self, text: str) -> Dict[ItemCategory, float]:
        """Classify text into categories with confidence scores."""
        text_lower = text.lower()
        scores = {}

        for category, keywords in self.category_keywords.items():
            score = 0
            for keyword in keywords:
                if keyword in text_lower:
                    score += 1
            if score > 0:
                scores[category] = score / len(keywords)

        # Normalize scores
        total = sum(scores.values()) if scores else 1
        for category in scores:
            scores[category] = scores[category] / total if total > 0 else 0

        # If no category matched, return general
        if not scores:
            scores[ItemCategory.GENERAL] = 1.0

        return scores