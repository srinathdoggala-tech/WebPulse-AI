import re
from collections import Counter
from typing import List, Dict, Any, Tuple
from app.models.schema import CollectedItem

# Known prominent tech entities for high-precision extraction
HIGH_VALUE_ENTITIES = [
    "Model Context Protocol (MCP)", "DeepSeek", "vLLM", "Rust", "Claude",
    "OpenAI", "LangGraph", "PyTorch", "Kubernetes", "Ollama", "React 19",
    "Bun", "Next.js", "FastAPI", "Triton", "CUDA", "Reasoning Models",
    "Agentic Workflows", "Vector Search", "Docker", "SGLang", "TypeScript",
    "PostgreSQL", "Quantization", "MoE Architecture"
]

class TopicExtractor:
    @classmethod
    def extract_entity_clusters(cls, items: List[CollectedItem]) -> Dict[str, List[CollectedItem]]:
        """
        Clusters collected items by technical topic/entity.
        """
        clusters: Dict[str, List[CollectedItem]] = {}

        for entity in HIGH_VALUE_ENTITIES:
            clusters[entity] = []

        for item in items:
            text = f"{item.title} {item.content} {' '.join(item.tags)}".lower()
            matched = False

            for entity in HIGH_VALUE_ENTITIES:
                # check clean name
                clean_name = re.sub(r"\(.*?\)", "", entity).strip().lower()
                pattern = r"\b" + re.escape(clean_name) + r"\b"
                if re.search(pattern, text):
                    clusters[entity].append(item)
                    matched = True

            # If not matched to pre-defined entity, group by category or high-frequency tag
            if not matched and item.tags:
                primary_tag = item.tags[0]
                if primary_tag not in clusters:
                    clusters[primary_tag] = []
                clusters[primary_tag].append(item)

        # Filter out clusters with 0 items
        return {k: v for k, v in clusters.items() if len(v) > 0}
