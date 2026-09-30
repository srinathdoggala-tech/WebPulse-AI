"""Topic extractor for identifying key topics in text."""

import re
from typing import List, Dict
from collections import Counter


class TopicExtractor:
    """Extract topics from text using keyword extraction and frequency analysis."""

    def __init__(self):
        # Common tech/business keywords
        self.keywords = {
            "ai", "ml", "machine learning", "deep learning", "neural network",
            "llm", "large language model", "gpt", "transformer", "attention",
            "vector database", "rag", "embedding", "fine-tuning", "prompt engineering",
            "agent", "autonomous", "multimodal", "generative ai", "genai",
            "python", "javascript", "typescript", "rust", "go", "java",
            "react", "vue", "angular", "nextjs", "svelte",
            "kubernetes", "docker", "microservices", "serverless", "cloud",
            "aws", "gcp", "azure", "vercel", "netlify",
            "startup", "funding", "venture capital", "series a", "series b",
            "product", "launch", "mvp", "saas", "b2b", "b2c",
            "hiring", "remote work", "engineer", "developer", "salary",
            "open source", "github", "repository", "contribution",
            "security", "privacy", "encryption", "blockchain", "web3",
            "ar", "vr", "xr", "metaverse", "gaming", "unity", "unreal",
            "quantum", "computing", "optimization", "performance",
            "api", "rest", "graphql", "grpc", "websocket",
            "database", "sql", "nosql", "postgresql", "mongodb", "redis",
            "ci/cd", "devops", "terraform", "ansible", "github actions"
        }

    async def extract(self, text: str, max_topics: int = 10) -> List[str]:
        """Extract key topics from text."""
        if not text:
            return []

        # Extract words and phrases
        words = re.findall(r'\b[\w\-\+\#]+\b', text.lower())

        # Find matching keywords
        found_keywords = [w for w in words if w in self.keywords]

        # Also look for multi-word phrases
        phrases = self._extract_phrases(text.lower())
        for phrase in phrases:
            if any(kw in phrase for kw in self.keywords):
                found_keywords.append(phrase)

        # Count frequencies
        counter = Counter(found_keywords)
        return [topic for topic, _ in counter.most_common(max_topics)]

    def _extract_phrases(self, text: str) -> List[str]:
        """Extract common multi-word phrases."""
        # Common tech phrases
        phrases = [
            "large language model", "machine learning", "deep learning",
            "vector database", "fine tuning", "prompt engineering",
            "artificial intelligence", "generative ai", "natural language",
            "computer vision", "reinforcement learning", "transfer learning",
            "software engineering", "web development", "mobile development",
            "cloud computing", "edge computing", "serverless architecture",
            "open source", "machine learning ops", "data science",
            "artificial general intelligence", "foundation model",
            "retrieval augmented generation", "knowledge graph"
        ]
        found = []
        for phrase in phrases:
            if phrase in text:
                found.append(phrase)
        return found