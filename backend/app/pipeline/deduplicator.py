from typing import List, Set
from app.models.schema import CollectedItem

class PipelineDeduplicator:
    @staticmethod
    def deduplicate(items: List[CollectedItem], existing_hashes: Set[str] = None) -> List[CollectedItem]:
        seen_hashes = set(existing_hashes or [])
        unique_items = []

        for item in items:
            if not item.content_hash:
                continue
            if item.content_hash not in seen_hashes:
                seen_hashes.add(item.content_hash)
                unique_items.append(item)

        return unique_items
