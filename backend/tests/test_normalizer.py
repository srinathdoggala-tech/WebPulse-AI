import pytest
from app.models.schema import CollectedItem
from app.pipeline.normalizer import PipelineNormalizer
from app.pipeline.deduplicator import PipelineDeduplicator

def test_pipeline_normalizer_classification():
    item = CollectedItem(
        id="test_1",
        title="Building Autonomous Agents with Model Context Protocol (MCP)",
        url="https://example.com/mcp",
        content="Exploring tool use with Anthropic MCP servers",
        source="HackerNews"
    )
    normalized = PipelineNormalizer.normalize_item(item)
    assert normalized.category == "AI & Agents"
    assert "MCP" in normalized.tags
    assert normalized.content_hash is not None

def test_deduplicator():
    item1 = CollectedItem(id="1", title="Rust in Python", url="https://example.com/uv", source="GitHub", content_hash="hash_a")
    item2 = CollectedItem(id="2", title="Rust in Python", url="https://example.com/uv", source="Reddit", content_hash="hash_a")
    item3 = CollectedItem(id="3", title="Different topic", url="https://example.com/other", source="HackerNews", content_hash="hash_b")

    deduped = PipelineDeduplicator.deduplicate([item1, item2, item3])
    assert len(deduped) == 2
    assert {i.content_hash for i in deduped} == {"hash_a", "hash_b"}
