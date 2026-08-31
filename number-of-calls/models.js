window.ZORIX_MODEL_DETAILS = [
  {
    id: "claude-opus-5",
    name: "Claude Opus 5",
    provider: "Anthropic",
    logo: "/number-of-calls/assets/logos/anthropic.svg?v=1788117825",
    family: "Claude Opus",
    status: "Available",
    dailyTokens: 1200000000000,
    context: "—",
    parameters: "Undisclosed",
    activeParameters: "Undisclosed",
    architecture: "Closed",
    inputPrice: "$5 / M tokens",
    outputPrice: "$25 / M tokens",
    about: "Claude Opus 5 is Anthropic's Opus-tier model for demanding coding, long-running agentic work and professional tasks. Anthropic has not publicly disclosed its parameter count.",
    docs: "https://www.anthropic.com/claude/opus",
    chart: [280,310,340,360,390,430,470,500,540,570,610,660,720,770,820,880,930,980,1040,1090,1140,1200,1170,1130,1100,1060,1020,990,970,950],
    color: "#D97757",
  },
  {
    id: "nex-coder-38-neptune",
    name: "Nex Coder 3.8 Preview Neptune",
    provider: "Zorix",
    logo: "/number-of-calls/assets/logos/zorix.svg?v=1788117825",
    family: "Nex Coder 3.8",
    status: "Preview",
    dailyTokens: 3220000000000,
    context: "2M tokens",
    parameters: "Undisclosed",
    activeParameters: "Undisclosed",
    architecture: "Closed / AA4",
    inputPrice: "Included",
    outputPrice: "Included",
    about: "Nex Coder 3.8 Preview Neptune is the depth-oriented profile of the AA4 / Zorix4 generation, designed for repository-scale software engineering, adaptive planning, tool execution and verification-heavy workflows.",
    docs: "https://doc.zorix.it/zorix-nex-coder/3.8-aa4",
    chart: [520,610,590,640,700,720,780,860,910,980,1020,1100,1250,1410,1600,1840,2100,2350,2680,2940,3220,3080,2870,2750,2600,2480,2360,2290,2210,2150],
    color: "#2563EB",
  },
  {
    id: "deepseek-v4-flash-0731",
    name: "DeepSeek V4 Flash 0731",
    provider: "DeepSeek",
    logo: "/number-of-calls/assets/logos/deepseek.svg?v=1788117825",
    family: "DeepSeek V4",
    status: "Available",
    dailyTokens: 1200000000000,
    context: "1M tokens",
    parameters: "284B",
    activeParameters: "13B",
    architecture: "MoE",
    inputPrice: "—",
    outputPrice: "—",
    about: "DeepSeek V4 Flash 0731 is available through Zorix Code. Usage statistics on this page represent the token volume recorded for the model in the Zorix Code environment.",
    chart: [320,420,390,450,510,530,560,590,610,620,700,740,760,810,860,920,980,1010,1050,1110,1160,1200,1130,1080,990,950,910,880,845,820],
    color: "#4D6BFE",
  },
  {
    id: "tencent-hy3",
    name: "Tencent Hy3",
    provider: "Tencent",
    logo: "/number-of-calls/assets/logos/hunyuan.svg?v=1788117825",
    family: "Hy3",
    status: "Available",
    dailyTokens: 950000000000,
    context: "256K tokens",
    parameters: "295B",
    activeParameters: "21B",
    architecture: "MoE",
    inputPrice: "—",
    outputPrice: "—",
    about: "Tencent Hy3 is currently available through Zorix Code. Usage statistics reflect the volume observed inside Zorix Code.",
    chart: [260,300,320,310,360,400,430,450,470,490,530,560,580,610,630,670,710,760,790,830,870,920,950,910,860,810,780,740,700,660],
    color: "#00A7CE",
  },
  {
    id: "mimo-v25",
    name: "Xiaomi MiMo-V2.5",
    provider: "Xiaomi",
    logo: "/number-of-calls/assets/logos/mimo.svg?v=1788117825",
    family: "MiMo",
    status: "Available",
    dailyTokens: 150000000,
    context: "1M tokens",
    parameters: "310B",
    activeParameters: "15B",
    architecture: "MoE",
    inputPrice: "—",
    outputPrice: "—",
    about: "Xiaomi MiMo-V2.5 is currently available through Zorix Code. Usage statistics reflect the volume observed inside Zorix Code.",
    chart: [20,25,22,18,30,34,31,42,48,50,44,39,47,56,61,66,72,80,97,120,150,138,121,109,93,84,72,61,55,49],
    color: "#FF6900",
  },
  {
    id: "gpt-56-luna",
    name: "GPT-5.6 Luna",
    provider: "OpenAI",
    logo: "/number-of-calls/assets/logos/openai.svg?v=1788117825",
    family: "GPT-5.6",
    status: "Available",
    dailyTokens: 310000,
    context: "—",
    parameters: "Undisclosed",
    activeParameters: "Undisclosed",
    architecture: "Closed",
    inputPrice: "—",
    outputPrice: "—",
    about: "GPT-5.6 Luna is currently available through Zorix Code. Usage statistics on this page reflect Zorix Code traffic rather than global OpenAI usage.",
    chart: [5,8,7,9,11,12,10,13,16,15,17,18,21,25,28,31,27,29,33,41,60,72,69,63,55,48,44,40,36,31],
    color: "#10A37F",
  },
    {
    id: "glm-53-flash",
    name: "GLM 5.3 Flash",
    provider: "Z.ai",
    logo: "/number-of-calls/assets/logos/glm.svg?v=1788117825",
    family: "GLM 5",
    status: "Available",

    dailyTokens: 300000,
    weeklyTokens: 2100000,

    context: "1M tokens",
    parameters: "320B",
    activeParameters: "18B",
    architecture: "MoE · hybrid sparse + linear attention",

    inputPrice: "—",
    outputPrice: "—",

    source: "Zorix Metron API",
    color: "#8B5CF6",

    about: "GLM 5.3 Flash is available through Zorix Metron API, the Zorix hybrid model API. Z.ai describes GLM-5.3-Flash as a 320B-parameter model with 18B active parameters and a hybrid sparse-and-linear attention architecture. The observed Metron volume is 2.1M tokens per week, normalized to approximately 300K tokens per day.",

    docs: "https://z.ai/blog/glm-5.3-flash",

    chart: [
      178,181,185,190,194,199,204,210,217,223,
      229,236,243,251,258,266,274,281,289,296,
      300,297,294,291,288,285,282,279,276,273
    ]
  },
    {
    id: "glm-52-max",
    name: "GLM 5.2 Max",
    provider: "Z.ai",
    logo: "/number-of-calls/assets/logos/glm.svg?v=1788117825",
    family: "GLM 5.2",
    status: "Available",

    dailyTokens: 314286,
    weeklyTokens: 2200000,

    context: "1M tokens",
    parameters: "744B",
    activeParameters: "40B",
    architecture: "MoE · DSA / IndexShare",

    inputPrice: "—",
    outputPrice: "—",

    source: "Zorix Metron API",
    color: "#E0A11A",

    about: "GLM 5.2 Max is GLM-5.2 used with maximum thinking effort through Zorix Metron API. Max is an inference effort mode rather than a separate parameter checkpoint. The GLM-5 family architecture is described as 744B total parameters with approximately 40B active parameters. The observed Metron volume is 2.2M tokens per week, normalized to approximately 314.29K tokens per day.",

    docs: "https://z.ai/blog/glm-5.2",

    chart: [
      186,190,194,199,204,210,216,222,228,235,
      242,249,256,263,270,278,286,294,301,307,
      314,311,308,305,302,299,296,293,290,287
    ]
  },
  {
    id: "gemini-37-flash",
    name: "Gemini 3.7 Flash",
    provider: "Google",
    logo: "/number-of-calls/assets/logos/google.svg",
    family: "Gemini 3.7",
    status: "Available",

    dailyTokens: 414285714,
    weeklyTokens: 2900000000,

    context: "—",
    parameters: "Undisclosed",
    activeParameters: "Undisclosed",
    architecture: "Closed",

    inputPrice: "—",
    outputPrice: "—",

    source: "Zorix Code",
    color: "#4285F4",

    about: "Gemini 3.7 Flash is available through Zorix Code. Recorded usage is 2.9B tokens per week, corresponding to approximately 414.29M tokens per day when normalized across seven days.",

    chart: [
      210,225,239,252,266,280,294,309,325,341,
      358,376,394,412,431,451,472,494,517,541,
      565,590,616,643,671,700,730,760,790,820
    ]
  },
  {
    id: "claude-sonnet-5",
    name: "Claude Sonnet 5",
    provider: "Anthropic",
    logo: "/number-of-calls/assets/logos/anthropic.svg?v=1788117825",
    family: "Claude Sonnet",
    status: "Available",

    dailyTokens: 300000,
    weeklyTokens: 2100000,

    context: "—",
    parameters: "Undisclosed",
    activeParameters: "Undisclosed",
    architecture: "Closed",

    inputPrice: "—",
    outputPrice: "—",

    source: "Zorix Code",
    color: "#C96F4A",

    about: "Claude Sonnet 5 is available through Zorix Code. Recorded usage is 2.1M tokens per week, normalized to approximately 300K tokens per day.",

    chart: [
      160,166,172,179,185,192,199,206,214,222,
      230,238,247,256,265,274,283,292,301,310,
      320,315,311,307,303,299,295,291,287,283
    ]
  },
  {
    id: "claude-opus-48",
    name: "Claude Opus 4.8",
    provider: "Anthropic",
    logo: "/number-of-calls/assets/logos/anthropic.svg?v=1788117825",
    family: "Claude Opus",
    status: "Available",

    dailyTokens: 157143,
    weeklyTokens: 1100000,

    context: "—",
    parameters: "Undisclosed",
    activeParameters: "Undisclosed",
    architecture: "Closed",

    inputPrice: "—",
    outputPrice: "—",

    source: "Zorix Code",
    color: "#A85D42",

    about: "Claude Opus 4.8 is available through Zorix Code. Recorded usage is 1.1M tokens per week, normalized to approximately 157.14K tokens per day.",

    chart: [
      160,166,172,179,185,192,199,206,214,222,
      230,238,247,256,265,274,283,292,301,310,
      320,315,311,307,303,299,295,291,287,283
    ]
  },
  {
    id: "claude-fable-5-fallback-max",
    name: "Claude Fable 5 (with fallback max)",
    provider: "Anthropic",
    logo: "/number-of-calls/assets/logos/anthropic.svg?v=1788117825",
    family: "Claude Fable",
    status: "Available",

    dailyTokens: 300000,
    weeklyTokens: 2100000,

    context: "—",
    parameters: "Undisclosed",
    activeParameters: "Undisclosed",
    architecture: "Closed",

    inputPrice: "—",
    outputPrice: "—",

    source: "Zorix Code",
    color: "#D88A69",

    about: "Claude Fable 5 with fallback max is available through Zorix Code. Recorded usage is 2.1M tokens per week, normalized to approximately 300K tokens per day.",

    chart: [
      160,166,172,179,185,192,199,206,214,222,
      230,238,247,256,265,274,283,292,301,310,
      320,315,311,307,303,299,295,291,287,283
    ]
  },
  {
    id: "gpt-56-sol-max",
    name: "GPT-5.6 Sol (Max)",
    provider: "OpenAI",
    logo: "/number-of-calls/assets/logos/openai.svg?v=1788117825",
    family: "GPT-5.6",
    status: "Available",

    dailyTokens: 242857,
    weeklyTokens: 1700000,

    context: "—",
    parameters: "Undisclosed",
    activeParameters: "Undisclosed",
    architecture: "Closed",

    inputPrice: "—",
    outputPrice: "—",

    source: "Zorix Code",
    color: "#10A37F",

    about: "GPT-5.6 Sol (Max) is available through Zorix Code. Recorded usage is 1.7M tokens per week, normalized to approximately 242.86K tokens per day.",

    chart: [
      160,166,172,179,185,192,199,206,214,222,
      230,238,247,256,265,274,283,292,301,310,
      320,315,311,307,303,299,295,291,287,283
    ]
  },

  {
    id: "kimi-k27-code",
    name: "Kimi K2.7 Code",
    provider: "Moonshot AI",
    logo: "/number-of-calls/assets/logos/kimi.svg?v=1788117825",
    family: "Kimi K2.7",
    status: "Available",

    dailyTokens: 157142857143,
    weeklyTokens: 1100000000000,

    context: "256K tokens",
    parameters: "1T",
    activeParameters: "32B",
    architecture: "MoE · MLA",

    inputPrice: "—",
    outputPrice: "—",

    source: "Zorix Code",
    color: "#1783FF",

    about: "Kimi K2.7 Code is Moonshot AI's open-source coding-focused agentic model. It is designed for long-horizon software engineering, coding workflows and autonomous tool use. Zorix Code recorded 1.1T tokens per week for this model.",

    docs: "https://www.kimi.ai/resources/kimi-k2-7-code",

    chart: [
      72,76,81,86,90,95,101,108,116,123,
      130,137,143,149,153,157,154,151,148,145,
      149,152,155,157,158,158,157,157,157,157
    ]
  },

  {
    id: "kimi-k3",
    name: "Kimi K3",
    provider: "Moonshot AI",
    logo: "/number-of-calls/assets/logos/kimi.svg?v=1788117825",
    family: "Kimi K3",
    status: "Available",

    dailyTokens: 300000,
    weeklyTokens: 2100000,

    context: "1M tokens",
    parameters: "2.8T",
    activeParameters: "104B",
    architecture: "MoE · KDA + Gated MLA",

    inputPrice: "—",
    outputPrice: "—",

    source: "Zorix Code",
    color: "#1783FF",

    about: "Kimi K3 is Moonshot AI's flagship open model for coding, reasoning, agentic work and multimodal tasks. It uses a 2.8T-parameter mixture-of-experts architecture with approximately 104B active parameters and supports up to a 1M-token context window. Zorix Code recorded 2.1M tokens per week.",

    docs: "https://www.kimi.ai/blog/kimi-k3",

    chart: [
      170,176,182,188,195,202,210,218,227,236,
      245,254,263,272,281,289,295,300,298,296,
      294,292,291,293,296,298,300,300,300,300
    ]
  },

  {
    id: "nex-coder-37-pro-max",
    name: "Zorix Nex Coder 3.7 Pro (Max)",
    provider: "Zorix",
    logo: "/number-of-calls/assets/logos/zorix.svg",
    family: "Nex Coder 3.7",
    status: "Available",

    dailyTokens: 1500000000000,
    weeklyTokens: 10500000000000,

    context: "—",
    parameters: "—",
    activeParameters: "—",
    architecture: "Nex Coder · Pro · Max effort",

    inputPrice: "—",
    outputPrice: "—",

    source: "Zorix Code",
    color: "#111111",

    about: "Zorix Nex Coder 3.7 Pro (Max) is the maximum-effort deployment profile of Nex Coder 3.7 Pro inside Zorix Code. The Max label refers to the inference and routing profile rather than a separate model checkpoint. Its recorded traffic is 10.5T tokens per week, equivalent to approximately 1.5T tokens per day.",

    docs: "https://doc.zorix.it/zorix-nex-coder/3.7pro-preview",

    chart: [
      1180,1210,1245,1280,1315,1350,1380,1410,1440,1460,
      1475,1490,1505,1520,1530,1540,1530,1515,1500,1490,
      1495,1500,1505,1500,1498,1502,1500,1500,1500,1500
    ]
  },

  {
    id: "gemini-36-flash",
    name: "Gemini 3.6 Flash",
    provider: "Google",
    logo: "/number-of-calls/assets/logos/google.svg",
    family: "Gemini 3.6",
    status: "Available",

    dailyTokens: 12785714286,
    weeklyTokens: 89500000000,

    context: "Undisclosed",
    parameters: "Undisclosed",
    activeParameters: "Undisclosed",
    architecture: "Gemini Flash",

    inputPrice: "—",
    outputPrice: "—",

    source: "Zorix Metron",
    color: "#4285F4",

    about: "Gemini 3.6 Flash is tracked as a Google Flash-family model inside Zorix Metron. The recorded usage supplied for this deployment is 89.5B tokens per week, normalized to approximately 12.786B tokens per day.",

    docs: "",

    chart: [
      9.8,10.1,10.4,10.8,11.1,11.4,11.8,
      12.0,12.2,12.4,12.6,12.7,12.78
    ]
  }
,

  {
    id: "muse-spark-12",
    name: "Muse Spark 1.2",
    provider: "Meta",
    logo: "/number-of-calls/assets/logos/meta.svg",
    family: "Muse Spark",
    status: "Available",

    dailyTokens: 11130000000,
    weeklyTokens: 77910000000,

    context: "Undisclosed",
    parameters: "Undisclosed",
    activeParameters: "Undisclosed",
    architecture: "Undisclosed",

    inputPrice: "—",
    outputPrice: "—",

    source: "Zorix Metron",
    color: "#0082FB",

    about: "Muse Spark 1.2 is a Meta model tracked by Zorix Metron. Its supplied usage measurement is 77.91B tokens per week, corresponding to an average normalized daily volume of 11.13B tokens.",

    docs: "",

    chart: [
      8.7,9.0,9.3,9.6,9.9,10.2,
      10.5,10.7,10.9,11.0,11.13
    ]
  }
,

  {
    id: "glm-51",
    name: "GLM 5.1",
    provider: "Z.ai",
    logo: "/number-of-calls/assets/logos/glm.svg",
    family: "GLM 5.1",
    status: "Available",

    dailyTokens: 271428571,
    weeklyTokens: 1900000000,

    context: "Undisclosed",
    parameters: "Undisclosed",
    activeParameters: "Undisclosed",
    architecture: "GLM",

    inputPrice: "—",
    outputPrice: "—",

    source: "Zorix Metron",
    color: "#111111",

    about: "GLM 5.1 is separately tracked from GLM 5.2 Max and GLM 5.3 Flash in Zorix Metron. The supplied weekly usage figure is 1.9B, normalized to approximately 271.43M per day under the site's token-volume metric.",

    docs: "",

    chart: [
      190,205,218,230,241,250,
      259,264,268,271.43
    ]
  }
,

  {
    id: "nvidia-nemotron-3-ultra",
    name: "NVIDIA Nemotron 3 Ultra",
    provider: "NVIDIA",
    logo: "/number-of-calls/assets/logos/nvidia.svg",
    family: "Nemotron 3",
    status: "Available",

    dailyTokens: 6100000000,

    context: "Undisclosed",
    parameters: "Undisclosed",
    activeParameters: "Undisclosed",
    architecture: "Nemotron",

    inputPrice: "—",
    outputPrice: "—",

    source: "Zorix Metron",
    color: "#74B71B",

    about: "NVIDIA Nemotron 3 Ultra entered the Zorix Metron catalog on August 30, 2026. Its first recorded day reached 9.1B tokens. The current August 31 daily value is 6.1B tokens, so the model page preserves the launch-day decline rather than replacing today's value with the higher first-day figure.",

    docs: "",

    chart: [
      9100000000,
      6100000000
    ]
  }

];
