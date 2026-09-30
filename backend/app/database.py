import sqlite3
import json
import os
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from app.config import settings

def get_db_connection():
    os.makedirs(os.path.dirname(settings.DATABASE_PATH), exist_ok=True)
    conn = sqlite3.connect(settings.DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Table for normalized collected items
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS items (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        url TEXT NOT NULL,
        content TEXT,
        source TEXT NOT NULL,
        author TEXT,
        score INTEGER DEFAULT 0,
        comments_count INTEGER DEFAULT 0,
        timestamp DATETIME NOT NULL,
        category TEXT NOT NULL,
        tags TEXT, -- JSON array
        content_hash TEXT UNIQUE
    )
    """)

    # Table for aggregated trend topics
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS trends (
        id TEXT PRIMARY KEY,
        topic TEXT NOT NULL,
        category TEXT NOT NULL,
        score REAL DEFAULT 0,
        velocity REAL DEFAULT 0,
        sentiment TEXT DEFAULT 'Neutral',
        mention_count INTEGER DEFAULT 1,
        sources TEXT, -- JSON array
        summary TEXT,
        opportunity_signal TEXT,
        is_rising INTEGER DEFAULT 0,
        updated_at DATETIME NOT NULL
    )
    """)

    # Safe migration for existing databases
    cursor.execute("PRAGMA table_info(trends)")
    columns = [col[1] for col in cursor.fetchall()]
    if "opportunity_signal" not in columns:
        try:
            cursor.execute("ALTER TABLE trends ADD COLUMN opportunity_signal TEXT")
        except Exception:
            pass

    # Table for job postings
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS jobs (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        company TEXT NOT NULL,
        location TEXT NOT NULL,
        type TEXT NOT NULL,
        salary TEXT,
        experience_level TEXT,
        skills TEXT, -- JSON array
        url TEXT NOT NULL,
        source TEXT NOT NULL,
        description TEXT,
        posted_at DATETIME NOT NULL
    )
    """)

    # Table for historical snapshots
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS snapshots (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME NOT NULL,
        metric TEXT NOT NULL,
        value REAL NOT NULL,
        meta TEXT
    )
    """)

    conn.commit()

    # Check if empty, and seed rich demo data if so
    cursor.execute("SELECT COUNT(*) FROM trends")
    if cursor.fetchone()[0] == 0:
        seed_initial_data(conn)

    conn.close()

def seed_initial_data(conn):
    cursor = conn.cursor()
    now = datetime.utcnow()

    # Seed Items
    sample_items = [
        (
            "hn_401",
            "Model Context Protocol (MCP) is becoming the standard for AI tool integration",
            "https://news.ycombinator.com/item?id=401",
            "Anthropic's open-source MCP protocol enables LLMs to securely connect with local tools, IDEs, and internal databases.",
            "HackerNews",
            "anthropic_fan",
            482,
            189,
            (now - timedelta(hours=2)).isoformat(),
            "AI & Agents",
            json.dumps(["MCP", "LLM", "Tool Use", "Anthropic", "API"]),
            "hash_mcp_hn"
        ),
        (
            "gh_101",
            "vllm-project/vllm: High-throughput and memory-efficient LLM serving engine",
            "https://github.com/vllm-project/vllm",
            "PagedAttention implementation for serving large language models at 10x throughput with FP8 quantization.",
            "GitHub",
            "woosuk",
            1240,
            94,
            (now - timedelta(hours=4)).isoformat(),
            "AI Infrastructure",
            json.dumps(["vLLM", "CUDA", "Inference", "Python", "GPU"]),
            "hash_vllm_gh"
        ),
        (
            "rd_201",
            "DeepSeek V3 and R1 architectures: Analysis of multi-head latent attention (MLA)",
            "https://reddit.com/r/LocalLLaMA/comments/deepseek_mla",
            "Deep dive into how DeepSeek achieved frontier performance at a fraction of training and inference compute using MoE and MLA.",
            "Reddit",
            "ml_researcher_99",
            890,
            340,
            (now - timedelta(hours=3)).isoformat(),
            "LLMs & Architecture",
            json.dumps(["DeepSeek", "MLA", "MoE", "Reasoning", "OpenWeights"]),
            "hash_deepseek_rd"
        ),
        (
            "tc_301",
            "AI Agent frameworks battle for developer adoption in enterprise production",
            "https://techcrunch.com/2026/02/ai-agents-enterprise",
            "Enterprises are moving from simple chatbots to autonomous multi-agent systems with human-in-the-loop validation.",
            "ArXiv/TechNews",
            "EnterpriseTech",
            320,
            45,
            (now - timedelta(hours=6)).isoformat(),
            "AI & Agents",
            json.dumps(["AI Agents", "LangGraph", "CrewAI", "Enterprise"]),
            "hash_agents_tc"
        ),
        (
            "gh_102",
            "astral-sh/uv: An extremely fast Python package and project manager, written in Rust",
            "https://github.com/astral-sh/uv",
            "Replacing pip, pip-tools, virtualenv, and poetry with a 10-100x faster single binary written in Rust.",
            "GitHub",
            "charliermarsh",
            2150,
            180,
            (now - timedelta(hours=5)).isoformat(),
            "Developer Tools",
            json.dumps(["Rust", "Python", "Packaging", "Performance"]),
            "hash_uv_gh"
        ),
        (
            "hn_402",
            "React 19 adoption and Server Actions in modern production applications",
            "https://news.ycombinator.com/item?id=402",
            "Discussion on the architectural shifts with React 19 Server Components, Actions, and async asset loading.",
            "HackerNews",
            "frontend_lead",
            310,
            145,
            (now - timedelta(hours=8)).isoformat(),
            "Web Development",
            json.dumps(["React 19", "JavaScript", "Frontend", "Full-Stack"]),
            "hash_react19_hn"
        ),
        (
            "rd_202",
            "Self-hosted AI stack 2026: Ollama + Open-WebUI + Qwen 2.5 Coder benchmarks",
            "https://reddit.com/r/SelfHosted/comments/stack2026",
            "Running 32B models locally on dual RTX 4090s with complete privacy and zero external API latency.",
            "Reddit",
            "privacy_first",
            670,
            215,
            (now - timedelta(hours=7)).isoformat(),
            "Open Source AI",
            json.dumps(["Ollama", "LocalLLaMA", "Qwen", "Self-Hosted"]),
            "hash_selfhost_rd"
        ),
        (
            "tc_302",
            "ArXiv: Test-Time Compute Scaling laws for advanced multi-step reasoning",
            "https://arxiv.org/abs/2601.09876",
            "Systematic empirical investigation of search over thoughts, verification scoring, and Monte Carlo tree exploration during inference.",
            "ArXiv/TechNews",
            "AI_Research_Daily",
            540,
            88,
            (now - timedelta(hours=10)).isoformat(),
            "Research & Papers",
            json.dumps(["Reasoning", "Test-Time Compute", "MCTS", "Scaling"]),
            "hash_scaling_tc"
        )
    ]

    for item in sample_items:
        cursor.execute("""
        INSERT OR IGNORE INTO items (id, title, url, content, source, author, score, comments_count, timestamp, category, tags, content_hash)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, item)

    # Seed Trends
    sample_trends = [
        (
            "trend_1",
            "Model Context Protocol (MCP)",
            "AI & Agents",
            98.4,
            245.5,
            "Positive",
            42,
            json.dumps(["HackerNews", "GitHub", "ArXiv/TechNews"]),
            "Standard open protocol by Anthropic allowing LLM applications and IDEs to securely interface with local servers and dev tools.",
            1,
            now.isoformat()
        ),
        (
            "trend_2",
            "Reasoning Models & Test-Time Compute",
            "LLMs & Architecture",
            96.8,
            310.2,
            "Positive",
            56,
            json.dumps(["Reddit", "ArXiv/TechNews", "HackerNews"]),
            "Shift from pre-training compute scaling to inference-time verification, Monte Carlo Tree Search, and reinforcement learning over chain-of-thought.",
            1,
            now.isoformat()
        ),
        (
            "trend_3",
            "vLLM & High-Performance Inference",
            "AI Infrastructure",
            92.1,
            120.4,
            "Positive",
            38,
            json.dumps(["GitHub", "Reddit", "HackerNews"]),
            "Widespread enterprise migration toward vLLM, SGLang, and TensorRT-LLM for high-throughput FP8/AWQ model serving.",
            0,
            now.isoformat()
        ),
        (
            "trend_4",
            "Rust-Powered Developer Tooling (uv, Bun, Turbopack)",
            "Developer Tools",
            89.5,
            85.6,
            "Positive",
            34,
            json.dumps(["GitHub", "HackerNews"]),
            "Rust rewriting the modern Python and JavaScript tooling ecosystem, bringing orders-of-magnitude faster CI/CD build speeds.",
            0,
            now.isoformat()
        ),
        (
            "trend_5",
            "Multi-Agent Orchestration & Human-in-the-Loop",
            "AI & Agents",
            87.3,
            160.0,
            "Neutral",
            29,
            json.dumps(["HackerNews", "ArXiv/TechNews", "Reddit"]),
            "Growing focus on deterministic validation and stateful agent frameworks like LangGraph and AutoGen for business-critical automations.",
            1,
            now.isoformat()
        ),
        (
            "trend_6",
            "Local Open-Weights LLMs & Private Serving",
            "Open Source AI",
            85.0,
            95.8,
            "Positive",
            27,
            json.dumps(["Reddit", "GitHub"]),
            "Democratization of 14B-72B open models running locally on consumer hardware with quantization (GGUF, EXL2).",
            0,
            now.isoformat()
        ),
        (
            "trend_7",
            "React 19 & Next.js Server Components",
            "Web Development",
            79.2,
            42.0,
            "Controversial",
            22,
            json.dumps(["HackerNews", "Reddit"]),
            "Ongoing community debates around server actions, hydration complexity, and frontend state management paradigms.",
            0,
            now.isoformat()
        )
    ]

    for trend in sample_trends:
        cursor.execute("""
        INSERT OR REPLACE INTO trends (id, topic, category, score, velocity, sentiment, mention_count, sources, summary, is_rising, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, trend)

    # Seed Jobs
    sample_jobs = [
        (
            "job_1",
            "Senior AI Platform Engineer",
            "Anthropic",
            "San Francisco, CA / Remote",
            "Full-Time",
            "$240,000 - $320,000",
            "Senior",
            json.dumps(["Python", "Kubernetes", "vLLM", "CUDA", "FastAPI", "Ray", "Go"]),
            "https://anthropic.com/careers",
            "Greenhouse",
            "Design and scale our distributed AI model inference clusters, low-latency API gateways, and developer toolchain.",
            (now - timedelta(days=1)).isoformat()
        ),
        (
            "job_2",
            "Staff AI Agent Systems Architect",
            "Cursor (Anysphere)",
            "San Francisco, CA / Hybrid",
            "Full-Time",
            "$260,000 - $350,000",
            "Staff",
            json.dumps(["TypeScript", "Rust", "Python", "LLMs", "MCP", "Next.js", "C++"]),
            "https://cursor.com/careers",
            "Lever",
            "Build next-generation autonomous coding capabilities, multi-file codebase indexing, and MCP tool protocols.",
            (now - timedelta(days=2)).isoformat()
        ),
        (
            "job_3",
            "Full-Stack Machine Learning Engineer",
            "Perplexity AI",
            "San Francisco, CA / Hybrid",
            "Full-Time",
            "$210,000 - $290,000",
            "Mid-Senior",
            json.dumps(["React", "TypeScript", "Python", "FastAPI", "PostgreSQL", "LangChain", "Docker"]),
            "https://perplexity.ai/jobs",
            "Ashby",
            "Drive product engineering for real-time search, conversational answer engines, and live retrieval pipelines.",
            (now - timedelta(days=3)).isoformat()
        ),
        (
            "job_4",
            "Senior Backend Engineer - Data & Pipelines",
            "Vercel",
            "Remote (US / Global)",
            "Full-Time",
            "$190,000 - $260,000",
            "Senior",
            json.dumps(["Go", "Rust", "Node.js", "TypeScript", "PostgreSQL", "Kafka", "AWS"]),
            "https://vercel.com/careers",
            "Greenhouse",
            "Build global telemetry, edge infrastructure, and real-time streaming analytics for modern web applications.",
            (now - timedelta(days=4)).isoformat()
        ),
        (
            "job_5",
            "Machine Learning Infrastructure Engineer",
            "Together AI",
            "San Francisco, CA / Remote",
            "Full-Time",
            "$220,000 - $310,000",
            "Senior",
            json.dumps(["CUDA", "C++", "PyTorch", "vLLM", "Triton", "Linux", "Python"]),
            "https://together.ai/careers",
            "Lever",
            "Optimize kernel performance, distributed training clusters, and sub-10ms token generation pipelines.",
            (now - timedelta(days=5)).isoformat()
        ),
        (
            "job_6",
            "AI Applications & Frontend Developer",
            "Cohere",
            "Toronto, ON / Remote",
            "Full-Time",
            "$160,000 - $220,000",
            "Mid-Level",
            json.dumps(["React", "Next.js", "TypeScript", "TailwindCSS", "Python", "REST APIs"]),
            "https://cohere.com/careers",
            "Greenhouse",
            "Create intuitive enterprise AI workspaces, prompt playgrounds, and fine-tuning control planes.",
            (now - timedelta(days=6)).isoformat()
        )
    ]

    for job in sample_jobs:
        cursor.execute("""
        INSERT OR REPLACE INTO jobs (id, title, company, location, type, salary, experience_level, skills, url, source, description, posted_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, job)

    conn.commit()
