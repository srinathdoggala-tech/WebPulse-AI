const API_BASE = "http://localhost:8000/api";

export const mockTrends = [
  {
    id: "trend_1",
    topic: "Model Context Protocol (MCP)",
    category: "AI & Agents",
    score: 98.4,
    velocity: 245.5,
    sentiment: "Positive",
    mention_count: 42,
    sources: ["HackerNews", "GitHub", "ArXiv/TechNews"],
    summary: "Standard open protocol by Anthropic allowing LLMs and IDEs to securely interface with local servers and dev tools.",
    is_rising: true,
    related_items: [
      { title: "Anthropic releases MCP SDK for TypeScript & Python", url: "https://modelcontextprotocol.io", source: "GitHub", score: 840 },
      { title: "Why MCP is replacing ad-hoc tool calling in agents", url: "https://news.ycombinator.com", source: "HackerNews", score: 512 }
    ]
  },
  {
    id: "trend_2",
    topic: "Reasoning Models & Test-Time Compute",
    category: "LLMs & Architecture",
    score: 96.8,
    velocity: 310.2,
    sentiment: "Positive",
    mention_count: 56,
    sources: ["Reddit", "ArXiv/TechNews", "HackerNews"],
    summary: "Shift from pre-training compute scaling to inference-time verification, Monte Carlo Tree Search, and reinforcement learning.",
    is_rising: true,
    related_items: [
      { title: "Test-time compute scaling laws in practice", url: "https://arxiv.org", source: "ArXiv/TechNews", score: 620 }
    ]
  },
  {
    id: "trend_3",
    topic: "vLLM & High-Performance Inference",
    category: "AI Infrastructure",
    score: 92.1,
    velocity: 120.4,
    sentiment: "Positive",
    mention_count: 38,
    sources: ["GitHub", "Reddit", "HackerNews"],
    summary: "Widespread enterprise migration toward vLLM, SGLang, and TensorRT-LLM for high-throughput FP8/AWQ model serving.",
    is_rising: false,
    related_items: [
      { title: "vLLM v0.6 architecture deep dive: PagedAttention + FP8 kernels", url: "https://github.com/vllm-project/vllm", source: "GitHub", score: 1450 }
    ]
  },
  {
    id: "trend_4",
    topic: "Rust Developer Tooling (uv, Bun)",
    category: "Developer Tools",
    score: 89.5,
    velocity: 85.6,
    sentiment: "Positive",
    mention_count: 34,
    sources: ["GitHub", "HackerNews"],
    summary: "Rust rewriting the modern Python and JavaScript tooling ecosystem, bringing orders-of-magnitude faster CI/CD build speeds.",
    is_rising: false,
    related_items: [
      { title: "astral-sh/uv: Python packaging written in Rust", url: "https://github.com/astral-sh/uv", source: "GitHub", score: 3200 }
    ]
  },
  {
    id: "trend_5",
    topic: "Multi-Agent Orchestration & Determinism",
    category: "AI & Agents",
    score: 87.3,
    velocity: 160.0,
    sentiment: "Neutral",
    mention_count: 29,
    sources: ["HackerNews", "ArXiv/TechNews", "Reddit"],
    summary: "Growing focus on deterministic validation and stateful agent frameworks like LangGraph and AutoGen for business-critical automations.",
    is_rising: true,
    related_items: []
  },
  {
    id: "trend_6",
    topic: "React 19 & Next.js Server Components",
    category: "Web Development",
    score: 79.2,
    velocity: 42.0,
    sentiment: "Controversial",
    mention_count: 22,
    sources: ["HackerNews", "Reddit"],
    summary: "Ongoing community debates around server actions, hydration complexity, and frontend state management paradigms.",
    is_rising: false,
    related_items: []
  }
];

export const mockJobs = [
  {
    id: "job_1",
    title: "Senior AI Platform Engineer",
    company: "Anthropic",
    location: "San Francisco, CA / Remote",
    type: "Full-Time",
    salary: "$240,000 - $320,000",
    experience_level: "Senior",
    skills: ["Python", "Kubernetes", "vLLM", "CUDA", "FastAPI", "Ray", "Go"],
    url: "https://anthropic.com/careers",
    source: "Greenhouse",
    description: "Design and scale distributed AI model inference clusters, low-latency API gateways, and developer toolchain."
  },
  {
    id: "job_2",
    title: "Staff AI Agent Systems Architect",
    company: "Cursor (Anysphere)",
    location: "San Francisco, CA / Hybrid",
    type: "Full-Time",
    salary: "$260,000 - $350,000",
    experience_level: "Staff",
    skills: ["TypeScript", "Rust", "Python", "LLMs", "MCP", "Next.js", "C++"],
    url: "https://cursor.com/careers",
    source: "Lever",
    description: "Build next-generation autonomous coding capabilities, multi-file codebase indexing, and MCP tool protocols."
  },
  {
    id: "job_3",
    title: "Full-Stack Machine Learning Engineer",
    company: "Perplexity AI",
    location: "San Francisco, CA / Hybrid",
    type: "Full-Time",
    salary: "$210,000 - $290,000",
    experience_level: "Mid-Senior",
    skills: ["React", "TypeScript", "Python", "FastAPI", "PostgreSQL", "LangChain", "Docker"],
    url: "https://perplexity.ai/jobs",
    source: "Ashby",
    description: "Drive product engineering for real-time search, conversational answer engines, and live retrieval pipelines."
  },
  {
    id: "job_4",
    title: "Senior Backend Engineer - Data & Pipelines",
    company: "Vercel",
    location: "Remote (US / Global)",
    type: "Full-Time",
    salary: "$190,000 - $260,000",
    experience_level: "Senior",
    skills: ["Go", "Rust", "Node.js", "TypeScript", "PostgreSQL", "Kafka", "AWS"],
    url: "https://vercel.com/careers",
    source: "Greenhouse",
    description: "Build global telemetry, edge infrastructure, and real-time streaming analytics for modern web applications."
  }
];

export async function fetchTrends(category = "All", sortBy = "score") {
  try {
    const url = `${API_BASE}/trends?category=${category}&sort_by=${sortBy}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(2000) });
    if (!res.ok) throw new Error("API error");
    return await res.json();
  } catch (e) {
    let filtered = [...mockTrends];
    if (category !== "All") filtered = filtered.filter(t => t.category === category);
    if (sortBy === "velocity") filtered.sort((a, b) => b.velocity - a.velocity);
    else filtered.sort((a, b) => b.score - a.score);
    return filtered;
  }
}

export async function fetchFeed(source = "All", search = "") {
  try {
    const url = `${API_BASE}/feed?source=${source}&search=${encodeURIComponent(search)}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(2000) });
    if (!res.ok) throw new Error("API error");
    return await res.json();
  } catch (e) {
    return [
      {
        id: "feed_1",
        title: "Model Context Protocol (MCP) specification and standard servers",
        url: "https://github.com/modelcontextprotocol",
        content: "Open protocol standardizing how applications expose context and tools to LLMs.",
        source: "GitHub",
        score: 1890,
        comments_count: 230,
        timestamp: new Date().toISOString(),
        category: "AI & Agents",
        tags: ["MCP", "Anthropic", "ToolUse"]
      },
      {
        id: "feed_2",
        title: "Show HN: Fast local inference engine written in pure C/Zig",
        url: "https://news.ycombinator.com",
        content: "Built a sub-10ms GGUF model runner with zero Python runtime dependencies.",
        source: "HackerNews",
        score: 412,
        comments_count: 94,
        timestamp: new Date().toISOString(),
        category: "AI Infrastructure",
        tags: ["HackerNews", "Inference", "Zig"]
      },
      {
        id: "feed_3",
        title: "[r/LocalLLaMA] DeepSeek-V3 vs Llama-3.3 70B quantization benchmarks",
        url: "https://reddit.com/r/LocalLLaMA",
        content: "Comparing EXL2 vs FP8 vs Q4_K_M performance on RTX 4090 and Mac Studio M2 Ultra.",
        source: "Reddit",
        score: 720,
        comments_count: 185,
        timestamp: new Date().toISOString(),
        category: "LLMs & Architecture",
        tags: ["Reddit", "DeepSeek", "Quantization"]
      }
    ];
  }
}

export async function fetchJobs() {
  try {
    const res = await fetch(`${API_BASE}/jobs`, { signal: AbortSignal.timeout(2000) });
    if (!res.ok) throw new Error("API error");
    return await res.json();
  } catch (e) {
    return mockJobs;
  }
}

export async function matchResume(resumeText) {
  try {
    const res = await fetch(`${API_BASE}/jobs/match`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resume_text: resumeText }),
      signal: AbortSignal.timeout(3000)
    });
    if (!res.ok) throw new Error("Match failed");
    return await res.json();
  } catch (e) {
    // Client-side intelligent fallback matcher
    const text = resumeText.toLowerCase();
    const skills = [];
    const checkSkills = ["python", "rust", "typescript", "react", "fastapi", "docker", "kubernetes", "cuda", "vllm", "mcp", "pytorch", "postgresql", "aws", "next.js", "langchain", "go"];
    checkSkills.forEach(s => {
      if (text.includes(s)) {
        skills.push(s === "mcp" ? "MCP" : s === "cuda" ? "CUDA" : s === "vllm" ? "vLLM" : s.charAt(0).toUpperCase() + s.slice(1));
      }
    });

    const topMatches = mockJobs.map(job => {
      const matched = job.skills.filter(s => skills.map(x => x.toLowerCase()).includes(s.toLowerCase()));
      const missing = job.skills.filter(s => !skills.map(x => x.toLowerCase()).includes(s.toLowerCase()));
      const score = Math.round((matched.length / Math.max(1, job.skills.length)) * 100);
      return {
        job,
        match_score: score,
        matched_skills: matched,
        missing_skills: missing,
        recommendation: score >= 60 ? "Strong technical profile fit!" : `Bridge skill gap: ${missing.slice(0, 2).join(", ")}`
      };
    }).sort((a, b) => b.match_score - a.match_score);

    return {
      extracted_skills: skills.length ? skills : ["Python", "FastAPI", "React", "Docker"],
      seniority_estimate: "Senior Engineer",
      overall_market_fit: topMatches[0] ? topMatches[0].match_score : 75,
      top_matches: topMatches,
      skill_gap_summary: [
        { skill: "CUDA", demand_frequency: 3, impact: "High" },
        { skill: "vLLM", demand_frequency: 2, impact: "High" },
        { skill: "MCP", demand_frequency: 2, impact: "Medium" }
      ]
    };
  }
}

export async function fetchStats() {
  try {
    const res = await fetch(`${API_BASE}/stats`, { signal: AbortSignal.timeout(2000) });
    if (!res.ok) throw new Error("API error");
    return await res.json();
  } catch (e) {
    return {
      total_items_collected: 184,
      total_trends_active: 28,
      total_jobs_tracked: 16,
      sources_breakdown: {
        "HackerNews": 48,
        "GitHub": 42,
        "Reddit": 36,
        "ArXiv/TechNews": 32,
        "JobBoards": 26
      },
      category_distribution: {
        "AI & Agents": 38,
        "AI Infrastructure": 24,
        "LLMs & Architecture": 22,
        "Developer Tools": 18,
        "Web Development": 14
      },
      sentiment_distribution: {
        "Positive": 68,
        "Neutral": 24,
        "Controversial": 8
      }
    };
  }
}

export async function fetchSummary() {
  try {
    const res = await fetch(`${API_BASE}/summary`, { signal: AbortSignal.timeout(2000) });
    if (!res.ok) throw new Error("API error");
    return await res.json();
  } catch (e) {
    return {
      headline: "Intelligence Briefing: Surge in Model Context Protocol (MCP) and Autonomous Tool Protocols",
      executive_summary: "Developer attention is heavily concentrated on MCP, Inference Optimizations, and Rust-native tooling. The cross-pollination of open-source architectures with enterprise tooling has accelerated, particularly around interoperable agent communication and sub-millisecond inference optimizations.",
      key_breakthroughs: [
        "Rapid convergence on Model Context Protocol (MCP) as the universal interface for LLM external tool calling.",
        "Test-time compute scaling: Empirical gains through inference verification and search over thoughts.",
        "High-throughput inference frameworks (vLLM, SGLang) achieving 3-5x throughput enhancements via FP8 and PagedAttention."
      ],
      emerging_developer_tools: [
        "astral-sh/uv & Bun: Next-generation ultra-fast runtimes transforming workflow speeds.",
        "LangGraph & AutoGen: Moving multi-agent execution from toy prototypes to deterministic state graphs.",
        "Local Ollama + DeepSeek/Qwen quant models providing sovereign offline reasoning."
      ],
      market_signals: [
        "Enterprise hiring demands have pivoted sharply from prompt engineering to AI Platform/Infrastructure and CUDA/C++ kernel tuning.",
        "High demand for Full-Stack AI engineers adept in modern React 19/Next.js alongside FastAPI and vector retrieval pipelines.",
        "Strong premium placed on candidates experienced with MCP server integration and production agent observability."
      ]
    };
  }
}

export async function triggerScrape() {
  try {
    const res = await fetch(`${API_BASE}/collect/trigger`, { method: "POST" });
    return await res.json();
  } catch (e) {
    return { status: "simulated", message: "Collectors triggered. Simulated refresh complete." };
  }
}
