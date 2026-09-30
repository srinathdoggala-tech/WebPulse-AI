import re
import hashlib
from typing import List, Dict, Any
from datetime import datetime
from app.models.schema import CollectedItem

CATEGORY_KEYWORDS = {
    "AI & Agents": ["agent", "mcp", "model context protocol", "autonomous", "tool use", "langgraph", "crewai", "multi-agent"],
    "LLMs & Architecture": ["llm", "deepseek", "transformer", "attention", "mla", "moe", "reasoning", "quantization", "gguf"],
    "AI Infrastructure": ["vllm", "cuda", "triton", "gpu", "inference", "tensorrt", "sglang", "distributed"],
    "Developer Tools": ["rust", "uv", "bun", "package manager", "cli", "compiler", "ide", "vscode", "cursor"],
    "Web Development": ["react", "next.js", "frontend", "vue", "javascript", "typescript", "tailwind", "css", "html"],
    "Cloud & DevOps": ["kubernetes", "docker", "aws", "gcp", "kafka", "postgres", "database", "serverless"],
    "Open Source AI": ["ollama", "hugging face", "open-source", "open weights", "local llm", "self-hosted"],
    "Research & Papers": ["arxiv", "paper", "empirical", "benchmark", "theory", "scaling laws"]
}

class PipelineNormalizer:
    @staticmethod
    def generate_hash(title: str, url: str) -> str:
        clean_url = re.sub(r"https?://(www\.)?", "", url).split("?")[0].rstrip("/")
        clean_title = re.sub(r"[^\w\s]", "", title.lower())
        seed = f"{clean_title[:40]}_{clean_url[:40]}"
        return hashlib.sha256(seed.encode("utf-8")).hexdigest()[:16]

    @classmethod
    def classify_category(cls, title: str, content: str = "") -> str:
        text = f"{title} {content}".lower()
        for category, keywords in CATEGORY_KEYWORDS.items():
            for kw in keywords:
                if kw in text:
                    return category
        return "General Tech"

    @classmethod
    def extract_tags(cls, title: str, content: str = "", existing_tags: List[str] = None) -> List[str]:
        tags = set(existing_tags or [])
        text = f"{title} {content}".lower()
        for category, keywords in CATEGORY_KEYWORDS.items():
            for kw in keywords:
                if re.search(r"\b" + re.escape(kw) + r"\b", text):
                    tags.add(kw.title() if len(kw) > 3 else kw.upper())
        return list(tags)[:6]

    @classmethod
    def normalize_item(cls, item: CollectedItem) -> CollectedItem:
        clean_title = re.sub(r"\s+", " ", item.title).strip()
        clean_content = re.sub(r"<[^>]+>", "", item.content or "")
        clean_content = re.sub(r"\s+", " ", clean_content).strip()
        
        category = cls.classify_category(clean_title, clean_content)
        tags = cls.extract_tags(clean_title, clean_content, item.tags)
        content_hash = cls.generate_hash(clean_title, item.url)

        item.title = clean_title
        item.content = clean_content
        item.category = category
        item.tags = tags
        item.content_hash = content_hash
        return item
