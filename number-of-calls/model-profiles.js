window.ZORIX_MODEL_PROFILES = {

  "nex-coder-38-neptune": {
    slug: "zorix/nex-coder-3.8-neptune",
    tagline: "Depth-oriented coding intelligence built on AA4 / Zorix4.",
    description: "Nex Coder 3.8 Preview Neptune is the deepest reasoning profile in the Nex Coder 3.8 generation. It is designed for repository-scale software engineering where the task extends beyond producing a local patch: understanding project state, forming a plan, coordinating tools, validating changes and recovering when an implementation path fails. Neptune emphasizes sustained reasoning and verification over raw response speed.",
    highlights: [
      "Repository-scale software engineering",
      "Adaptive planning across longer tasks",
      "Terminal and development-tool execution",
      "Verification and recovery loops",
      "2M-token working context"
    ],
    modalities: ["Text", "Code", "Tools"],
    released: "Aug 29, 2026",
    availability: "Early access preview",
    weights: null,
    benchmarkNote: "AA4 internal preview evaluation. Not a third-party leaderboard submission."
  },

  "deepseek-v4-flash-0731": {
    slug: "deepseek/deepseek-v4-flash-0731",
    tagline: "High-throughput sparse MoE model for coding and general reasoning.",
    description: "DeepSeek V4 Flash 0731 is used inside Zorix Code as a high-throughput option for coding, tool-oriented workflows and general reasoning. Its sparse mixture-of-experts architecture activates only a fraction of the full parameter set for each token, giving the model a large total capacity while keeping active compute substantially smaller. The usage shown here represents traffic observed inside Zorix Code rather than global DeepSeek usage.",
    highlights: [
      "284B total parameters",
      "13B active parameters",
      "Sparse MoE architecture",
      "1M-token context",
      "High-volume Zorix Code deployment"
    ],
    modalities: ["Text", "Code"],
    released: "Jul 31, 2026",
    availability: "Available",
    weights: null,
    benchmarkNote: "Shown where the current Zorix evaluation set contains a comparable result."
  },

  "claude-opus-5": {
    slug: "anthropic/claude-opus-5",
    tagline: "Opus-tier model for long-running professional and agentic work.",
    description: "Claude Opus 5 is Anthropic's highest-tier model in the current Zorix Code catalog. It is positioned for demanding coding sessions, multi-step professional work and agentic tasks that benefit from sustained reasoning across longer trajectories. Zorix Code records substantial Opus 5 usage, while Anthropic does not publicly disclose the model's parameter count.",
    highlights: [
      "Long-running agentic workflows",
      "Complex software engineering",
      "Professional reasoning tasks",
      "Anthropic Opus tier",
      "Closed parameter disclosure"
    ],
    modalities: ["Text", "Code", "Tools"],
    released: "Jul 24, 2026",
    availability: "Available",
    weights: null,
    benchmarkNote: "Zorix evaluation comparison; not an Anthropic leaderboard claim."
  },

  "tencent-hy3": {
    slug: "tencent/hy3",
    tagline: "Tencent sparse MoE architecture balancing capacity and active compute.",
    description: "Tencent Hy3 is a large sparse mixture-of-experts model available through Zorix Code. Its architecture combines a 295B-parameter total model with approximately 21B active parameters per token, targeting a balance between broad model capacity and practical inference cost. In Zorix Code it is used as a general reasoning and coding model with one of the largest recorded daily token volumes in the catalog.",
    highlights: [
      "295B total parameters",
      "21B active parameters",
      "256K-token context",
      "Tencent MoE architecture",
      "High Zorix Code traffic"
    ],
    modalities: ["Text", "Code"],
    released: "—",
    availability: "Available",
    weights: null,
    benchmarkNote: null
  },

  "mimo-v25": {
    slug: "xiaomi/mimo-v2.5",
    tagline: "Xiaomi's sparse MiMo generation for long-context reasoning.",
    description: "Xiaomi MiMo-V2.5 is a sparse mixture-of-experts model in the Zorix Code catalog. It combines a large 310B total parameter footprint with approximately 15B active parameters and a long-context design. Compared with the trillion-token-scale models on the usage ranking, MiMo-V2.5 occupies a smaller traffic tier while remaining available for long-context coding and reasoning workloads.",
    highlights: [
      "310B total parameters",
      "15B active parameters",
      "1M-token context",
      "Mixture-of-experts design",
      "Long-context workloads"
    ],
    modalities: ["Text", "Code"],
    released: "Apr 23, 2026",
    availability: "Available",
    weights: null,
    benchmarkNote: null
  },

  "gpt-56-luna": {
    slug: "openai/gpt-5.6-luna",
    tagline: "GPT-5.6 Luna deployment available inside Zorix Code.",
    description: "GPT-5.6 Luna is an OpenAI model configuration available through Zorix Code. The page tracks only the traffic handled by the Zorix Code environment and should not be interpreted as global OpenAI usage. Parameter count and internal architecture details are not disclosed in the Zorix model catalog, so this page keeps those fields explicitly undisclosed rather than estimating them.",
    highlights: [
      "GPT-5.6 family",
      "Available through Zorix Code",
      "Closed architecture",
      "Usage measured inside Zorix Code",
      "No inferred parameter count"
    ],
    modalities: ["Text", "Code"],
    released: "—",
    availability: "Available",
    weights: null,
    benchmarkNote: "Zorix evaluation comparison; not an OpenAI leaderboard submission."
  },

  "glm-53-flash": {
    slug: "zai/glm-5.3-flash",
    tagline: "Fast GLM deployment delivered through Zorix Metron API.",
    description: "GLM 5.3 Flash is available through Zorix Metron API, Zorix's hybrid model API layer. It uses a sparse mixture-of-experts design with 320B total parameters and approximately 18B active parameters. Its Metron usage is recorded weekly and normalized to a daily figure on the usage ranking, making it directly comparable with the rest of the catalog without changing the original weekly measurement.",
    highlights: [
      "320B total parameters",
      "18B active parameters",
      "1M-token context",
      "Hybrid sparse and linear attention",
      "Delivered through Zorix Metron API"
    ],
    modalities: ["Text", "Code"],
    released: "—",
    availability: "Available",
    weights: null,
    benchmarkNote: null
  },

  "glm-52-max": {
    slug: "zai/glm-5.2-max",
    tagline: "Maximum-effort GLM 5.2 configuration on Zorix Metron API.",
    description: "GLM 5.2 Max represents the maximum-thinking-effort configuration of GLM 5.2 used through Zorix Metron API. The Max label describes the inference profile rather than a separate parameter checkpoint. It therefore retains the GLM architecture characteristics while allocating the highest reasoning effort available through this Metron configuration.",
    highlights: [
      "744B total parameters",
      "40B active parameters",
      "1M-token context",
      "Maximum reasoning-effort profile",
      "Zorix Metron API deployment"
    ],
    modalities: ["Text", "Code"],
    released: "—",
    availability: "Available",
    weights: null,
    benchmarkNote: null
  },

  "gemini-37-flash": {
    slug: "google/gemini-3.7-flash",
    tagline: "Google Gemini deployment optimized for fast Zorix Code workloads.",
    description: "Gemini 3.7 Flash is the Google model configuration currently tracked in Zorix Code. Its recorded volume is supplied as weekly usage and normalized to a daily rate on the ranking page. This model page focuses on the behavior of the Zorix Code deployment and deliberately leaves parameter information undisclosed rather than inferring proprietary architecture details.",
    highlights: [
      "Gemini Flash family",
      "Google model deployment",
      "2.9B recorded tokens per week",
      "Fast general-purpose workloads",
      "Closed parameter disclosure"
    ],
    modalities: ["Text", "Code"],
    released: "—",
    availability: "Available",
    weights: null,
    benchmarkNote: "Zorix evaluation comparison; not a Google leaderboard submission."
  },

  "claude-sonnet-5": {
    slug: "anthropic/claude-sonnet-5",
    tagline: "Balanced Claude configuration for coding and everyday agentic tasks.",
    description: "Claude Sonnet 5 occupies the balanced tier of the Anthropic models available in Zorix Code. It is intended for workloads that need stronger reasoning and coding capability than lightweight assistants while avoiding the cost profile of the highest Opus tier. Current Zorix Code usage is recorded at 2.1M tokens per week.",
    highlights: [
      "Balanced Claude tier",
      "Coding and reasoning workflows",
      "Agent-oriented tasks",
      "2.1M tokens per week in Zorix Code",
      "Closed parameter disclosure"
    ],
    modalities: ["Text", "Code", "Tools"],
    released: "—",
    availability: "Available",
    weights: null,
    benchmarkNote: null
  },

  "claude-opus-48": {
    slug: "anthropic/claude-opus-4.8",
    tagline: "Earlier Opus-tier model retained for high-effort Claude workloads.",
    description: "Claude Opus 4.8 is an earlier Opus-tier model retained in the Zorix Code catalog for demanding Claude workflows. Its usage is materially smaller than Opus 5, but it remains separately tracked so traffic can be compared across Claude generations. Parameter count and internal architecture remain undisclosed.",
    highlights: [
      "Anthropic Opus tier",
      "Earlier-generation Opus deployment",
      "High-effort reasoning workflows",
      "1.1M recorded tokens per week",
      "Separately tracked from Opus 5"
    ],
    modalities: ["Text", "Code", "Tools"],
    released: "—",
    availability: "Available",
    weights: null,
    benchmarkNote: null
  },

  "claude-fable-5-fallback-max": {
    slug: "anthropic/claude-fable-5-fallback-max",
    tagline: "Fable 5 routing profile with maximum fallback behavior.",
    description: "Claude Fable 5 with fallback max is represented as a distinct routing profile inside Zorix Code rather than being merged with the other Claude traffic. The fallback-max configuration is intended to preserve task completion when the primary path needs a stronger fallback, and its usage is therefore tracked independently from Sonnet and Opus deployments.",
    highlights: [
      "Distinct Zorix Code routing profile",
      "Maximum fallback configuration",
      "Independent traffic accounting",
      "2.1M tokens per week",
      "Anthropic provider route"
    ],
    modalities: ["Text", "Code", "Tools"],
    released: "—",
    availability: "Available",
    weights: null,
    benchmarkNote: null
  },

  "gpt-56-sol-max": {
    slug: "openai/gpt-5.6-sol-max",
    tagline: "Maximum-effort Sol profile in the GPT-5.6 family.",
    description: "GPT-5.6 Sol (Max) is tracked as a separate maximum-effort GPT-5.6 configuration in Zorix Code. Its traffic is substantially smaller than the platform's trillion-token-scale deployments, but separating Sol Max from Luna makes it possible to compare different GPT-5.6 routing and reasoning profiles without conflating their usage.",
    highlights: [
      "GPT-5.6 family",
      "Maximum-effort Sol configuration",
      "Separately tracked from Luna",
      "1.7M recorded tokens per week",
      "Closed architecture"
    ],
    modalities: ["Text", "Code"],
    released: "—",
    availability: "Available",
    weights: null,
    benchmarkNote: null
  }

};


/*
 * Only benchmark results that already exist in the current Zorix
 * comparison set are included here.
 *
 * Missing entries intentionally remain missing.
 */

window.ZORIX_MODEL_BENCHMARKS = {

  "nex-coder-38-neptune": {
    terminal: 99.0,
    swe: 99.0
  },

  "claude-opus-5": {
    terminal: 91.6,
    swe: 92.4
  },

  "gpt-56-luna": {
    terminal: 90.6,
    swe: 91.4
  },

  "gemini-37-flash": {
    terminal: 89.2,
    swe: 90.0
  },

  "deepseek-v4-flash-0731": {
    terminal: 87.7,
    swe: 88.5
  },


  "kimi-k27-code": {
    slug: "moonshot/kimi-k2.7-code",
    tagline: "Open agentic coding model for long-horizon software engineering.",
    description: "Kimi K2.7 Code is Moonshot AI's open-source coding-focused agentic model. It targets longer software-engineering trajectories such as repository work, multi-file implementation, debugging and autonomous tool use. Moonshot reports that K2.7 Code improves both coding and agent performance over K2.6 while using roughly 30% fewer thinking tokens.",
    highlights: [
      "1T total parameters",
      "32B active parameters",
      "256K-token context",
      "MoE with MLA attention",
      "Open-source coding and agentic model"
    ],
    modalities: ["Text", "Code", "Image", "Tools"],
    released: "Aug 12, 2026",
    availability: "Available",
    weights: "https://huggingface.co/moonshotai/Kimi-K2.7-Code",
    benchmarkNote: "Moonshot-published benchmark results are shown separately from Zorix internal evaluations."
  },

  "kimi-k3": {
    slug: "moonshot/kimi-k3",
    tagline: "Moonshot AI's 2.8T open frontier model for coding and agents.",
    description: "Kimi K3 is Moonshot AI's flagship open frontier model. Its 2.8T-parameter mixture-of-experts architecture activates approximately 104B parameters per token and combines KDA with gated MLA attention. It supports up to a 1M-token context window and is positioned for coding, long-running agents, reasoning, research and multimodal workflows.",
    highlights: [
      "2.8T total parameters",
      "104B active parameters",
      "1M-token context",
      "KDA + Gated MLA",
      "Text and image multimodality"
    ],
    modalities: ["Text", "Code", "Image", "Tools"],
    released: "Jul 2026",
    availability: "Available",
    weights: "https://huggingface.co/moonshotai/Kimi-K3",
    benchmarkNote: "K3 benchmark results use Moonshot's published max-reasoning configuration unless otherwise noted."
  },

};
