window.ZORIX_EXTERNAL_BENCHMARKS = {

  "nex-coder-38-neptune": {
    label: "Zorix internal evaluation",
    sourceType: "internal",
    note: "No independent public evaluation is attached here yet. See the separate Zorix AA4 preview benchmark section.",
    source: "https://doc.zorix.it/zorix-nex-coder/3.8-aa4",
    evaluations: []
  },


  "claude-opus-5": {
    label: "Anthropic published evaluation",
    sourceType: "provider",
    note: "Anthropic's Conceptual Reasoning Index reports Opus 5 as the highest-scoring model in that evaluation.",
    source: "https://alignment.anthropic.com/2026/conceptual-reasoning-index/",
    evaluations: [
      {
        benchmark:"Conceptual Reasoning Index",
        value:"73.6",
        unit:"score",
        detail:"95% CI ±2.1"
      }
    ]
  },


  "deepseek-v4-flash-0731": {
    label: "Public evaluation status",
    sourceType: "unverified",
    note: "No sufficiently authoritative public benchmark source for the exact DeepSeek V4 Flash 0731 checkpoint is attached yet. Zorix internal comparison values remain separate.",
    source:null,
    evaluations: []
  },


  "tencent-hy3": {
    label: "Tencent Hunyuan evaluation",
    sourceType: "provider",
    note: "Tencent reports a blind evaluation with 270 experts using work-derived tasks.",
    source: "https://github.com/Tencent-Hunyuan/Hy3",
    evaluations: [
      {
        benchmark:"270-expert blind work evaluation",
        value:"2.67",
        unit:"/ 4",
        detail:"Tencent reports GLM-5.1 at 2.51/4 in the same evaluation."
      }
    ]
  },


  "mimo-v25": {
    label: "Xiaomi MiMo evaluation",
    sourceType: "provider",
    note: "Xiaomi reports MiMo-V2.5 surpassing MiMo-V2-Pro on ClawEval and reaching the same ClawEval score as Muse Spark with substantially fewer tokens.",
    source: "https://mimo.mi.com/docs/en-US/news/latest/v2.5-news",
    evaluations: [
      {
        benchmark:"ClawEval",
        value:"Above MiMo-V2-Pro",
        unit:"",
        detail:"Provider-reported agent evaluation."
      },
      {
        benchmark:"ClawEval token efficiency",
        value:"50%",
        unit:"fewer tokens",
        detail:"Compared with Muse Spark at the same ClawEval score."
      }
    ]
  },


  "gpt-56-luna": {
    label: "OpenAI published evaluation",
    sourceType: "provider",
    note: "Official GPT-5.6 Luna results from OpenAI's GPT-5.6 launch evaluation.",
    source: "https://openai.com/index/gpt-5-6/",
    evaluations: [
      {
        benchmark:"AA Coding Agent Index v1.1",
        value:"74.6",
        unit:"index"
      },
      {
        benchmark:"SWE-Bench Pro",
        value:"62.7",
        unit:"%"
      },
      {
        benchmark:"DeepSWE v1.1",
        value:"67.2",
        unit:"%"
      },
      {
        benchmark:"Terminal-Bench 2.1",
        value:"84.7",
        unit:"%"
      },
      {
        benchmark:"Agents' Last Exam",
        value:"50.3",
        unit:"%"
      }
    ]
  },


  "glm-53-flash": {
    label: "Z.ai published evaluation",
    sourceType: "provider",
    note: "Official GLM-5.3-Flash published evaluation.",
    source: "https://z.ai/blog/glm-5.3-flash",
    evaluations: [
      {
        benchmark:"Terminal Bench 2.1",
        value:"84.3",
        unit:"%"
      },
      {
        benchmark:"DeepSWE v1.1",
        value:"63.4",
        unit:"%"
      },
      {
        benchmark:"NL2Repo",
        value:"56.3",
        unit:"%"
      },
      {
        benchmark:"Toolathlon Verified",
        value:"78.4",
        unit:"%"
      },
      {
        benchmark:"AutomationBench v1.0.6",
        value:"48.8",
        unit:"%"
      },
      {
        benchmark:"GDPval-AA v2",
        value:"1773",
        unit:"Elo"
      }
    ]
  },


  "glm-52-max": {
    label: "Z.ai GLM-5.2 evaluation",
    sourceType: "provider",
    note: "These are published GLM-5.2 checkpoint results. The Zorix Max inference-effort profile may not reproduce the same result exactly.",
    source: "https://z.ai/blog/glm-5.2",
    evaluations: [
      {
        benchmark:"SWE-bench Pro",
        value:"62.1",
        unit:"%"
      },
      {
        benchmark:"Terminal Bench 2.1 · Terminus-2",
        value:"81.0",
        unit:"%"
      },
      {
        benchmark:"DeepSWE",
        value:"46.2",
        unit:"%"
      },
      {
        benchmark:"NL2Repo",
        value:"48.9",
        unit:"%"
      },
      {
        benchmark:"MCP-Atlas public set",
        value:"76.8",
        unit:"%"
      }
    ]
  },


  "gemini-37-flash": {
    label: "Google DeepMind published evaluation",
    sourceType: "provider",
    note: "Official Gemini 3.7 Flash results published by Google DeepMind.",
    source: "https://deepmind.google/models/gemini/flash/",
    evaluations: [
      {
        benchmark:"Artificial Analysis Intelligence Index",
        value:"56",
        unit:"index"
      },
      {
        benchmark:"FrontierCode 1.1 Main",
        value:"43.6",
        unit:"%"
      },
      {
        benchmark:"DeepSWE v1.1",
        value:"65.3",
        unit:"%"
      },
      {
        benchmark:"Code Arena",
        value:"1588",
        unit:"Elo"
      },
      {
        benchmark:"Terminal-bench 2.1",
        value:"85.8",
        unit:"%"
      }
    ]
  },


  "claude-sonnet-5": {
    label: "Google DeepMind comparison",
    sourceType: "third-party",
    note: "These Sonnet 5 comparison results are published by Google DeepMind alongside Gemini 3.7 Flash, rather than by Zorix.",
    source: "https://deepmind.google/models/gemini/flash/",
    evaluations: [
      {
        benchmark:"Artificial Analysis Intelligence Index",
        value:"55",
        unit:"index"
      },
      {
        benchmark:"FrontierCode 1.1 Main",
        value:"42.7",
        unit:"%"
      },
      {
        benchmark:"DeepSWE v1.1",
        value:"53.8",
        unit:"%"
      },
      {
        benchmark:"Code Arena",
        value:"1541",
        unit:"Elo"
      },
      {
        benchmark:"Terminal-bench 2.1",
        value:"80.4",
        unit:"%"
      }
    ]
  },


  "claude-opus-48": {
    label: "Anthropic system-card evaluation",
    sourceType: "provider",
    note: "Official Claude Opus 4.8 capability evaluation.",
    source: "https://www.anthropic.com/news/claude-opus-4-8",
    evaluations: [
      {
        benchmark:"SWE-bench Verified",
        value:"88.6",
        unit:"%"
      },
      {
        benchmark:"SWE-bench Pro",
        value:"69.2",
        unit:"%"
      },
      {
        benchmark:"Terminal-Bench 2.1 · Terminus-2",
        value:"74.6",
        unit:"%"
      },
      {
        benchmark:"OSWorld-Verified",
        value:"83.4",
        unit:"%"
      }
    ]
  },


  "claude-fable-5-fallback-max": {
    label: "External provider comparison",
    sourceType: "third-party",
    note: "Z.ai publishes comparison results for Fable 5 with fallback. This maps more closely to this routing profile than a plain Fable-only result.",
    source: "https://z.ai/blog/glm-5.3",
    evaluations: [
      {
        benchmark:"Terminal Bench 2.1",
        value:"88.0",
        unit:"%"
      },
      {
        benchmark:"DeepSWE v1.1",
        value:"69.7",
        unit:"%"
      }
    ]
  },


  "gpt-56-sol-max": {
    label: "OpenAI published GPT-5.6 Sol evaluation",
    sourceType: "provider",
    note: "Official Sol-family figures. Zorix's Max routing/effort configuration can differ from the exact harness settings used by OpenAI.",
    source: "https://openai.com/index/gpt-5-6/",
    evaluations: [
      {
        benchmark:"AA Coding Agent Index v1.1",
        value:"80",
        unit:"index"
      },
      {
        benchmark:"SWE-Bench Pro",
        value:"64.6",
        unit:"%"
      },
      {
        benchmark:"DeepSWE v1.1",
        value:"72.7",
        unit:"%"
      },
      {
        benchmark:"Terminal-Bench 2.1",
        value:"88.8",
        unit:"%"
      },
      {
        benchmark:"Agents' Last Exam",
        value:"52.7",
        unit:"%"
      }
    ]
  }

};
