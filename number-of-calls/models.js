window.ZORIX_MODEL_DETAILS = [
  {
    id: "claude-opus-5",
    name: "Claude Opus 5",
    provider: "Anthropic",
    logo: "./assets/logos/anthropic.svg",
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
  }
  {
    id: "nex-coder-38-neptune",
    name: "Nex Coder 3.8 Preview Neptune",
    provider: "Zorix",
    logo: "./assets/logos/zorix.svg",
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
  }
  {
    id: "deepseek-v4-flash-0731",
    name: "DeepSeek V4 Flash 0731",
    provider: "DeepSeek",
    logo: "./assets/logos/deepseek.svg",
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
  }
  {
    id: "tencent-hy3",
    name: "Tencent Hy3",
    provider: "Tencent",
    logo: "./assets/logos/hunyuan.svg",
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
  }
  {
    id: "mimo-v25",
    name: "Xiaomi MiMo-V2.5",
    provider: "Xiaomi",
    logo: "./assets/logos/mimo.svg",
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
  }
  {
    id: "gpt-56-luna",
    name: "GPT-5.6 Luna",
    provider: "OpenAI",
    logo: "./assets/logos/openai.svg",
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
  }
    {
    id: "glm-53-flash",
    name: "GLM 5.3 Flash",
    provider: "Z.ai",
    logo: "./assets/logos/glm.svg",
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
  }
    {
    id: "glm-52-max",
    name: "GLM 5.2 Max",
    provider: "Z.ai",
    logo: "./assets/logos/glm.svg",
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
  }];
