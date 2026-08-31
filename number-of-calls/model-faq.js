window.ZORIX_MODEL_FAQ = {

  "nex-coder-38-neptune": [
    {
      q: "What is Neptune designed for?",
      a: "Neptune is the depth-oriented Nex Coder 3.8 preview profile. In the Zorix catalog it is positioned for repository-scale coding, planning, tool use, verification and longer software-engineering tasks."
    },
    {
      q: "Why does Neptune have such high Metron usage?",
      a: "The usage value represents tokens processed through Zorix Code and Metron, not global model traffic. Neptune is currently one of the most heavily used models in this environment."
    },
    {
      q: "Is Neptune a final 3.8 release?",
      a: "No. The catalog identifies it as a Nex Coder 3.8 Preview / AA4 profile."
    }
  ],

  "nex-coder-37-pro-max": [
    {
      q: "What does Max mean on Nex Coder 3.7 Pro?",
      a: "Max refers to the highest-effort deployment profile used by Zorix. It is an inference configuration rather than a separately trained checkpoint."
    },
    {
      q: "How much traffic does this model receive?",
      a: "The supplied measurement is 10.5T tokens per week, equivalent to approximately 1.5T tokens per day."
    },
    {
      q: "Can Max benchmark results differ from the base checkpoint?",
      a: "Yes. Increased inference effort can change observed task performance even when the underlying checkpoint is the same, so the profile and checkpoint should not be treated as interchangeable benchmark identities."
    }
  ],

  "deepseek-v4-flash-0731": [
    {
      q: "What does the 0731 suffix mean here?",
      a: "It identifies the DeepSeek V4 Flash deployment tracked under the July 31 variant name in this Zorix catalog."
    },
    {
      q: "Is the 1.2T/day figure global DeepSeek usage?",
      a: "No. It is the token volume observed inside Zorix Code / Metron."
    },
    {
      q: "Why is it listed separately from other DeepSeek models?",
      a: "Metron tracks model checkpoints and routing targets separately so usage from different DeepSeek configurations is not merged."
    }
  ],

  "claude-opus-5": [
    {
      q: "When should Opus 5 be selected in this catalog?",
      a: "It is the high-tier Anthropic option tracked for demanding coding, professional reasoning and longer agentic work."
    },
    {
      q: "Are Claude parameter counts shown?",
      a: "Only when a reliable value is present in the catalog. Otherwise the page deliberately leaves proprietary architecture fields undisclosed."
    },
    {
      q: "What does its usage number represent?",
      a: "It represents traffic processed in Zorix Code, not Anthropic-wide traffic."
    }
  ],

  "tencent-hy3": [
    {
      q: "Why is Tencent Hy3 high in the usage ranking?",
      a: "Hy3 has substantial recorded traffic inside the Zorix Code environment. The ranking is based on that local Metron traffic rather than public market share."
    },
    {
      q: "Is Hy3 grouped with Zorix models?",
      a: "No. Its provider remains Tencent and its usage is independently accounted for."
    },
    {
      q: "Can its benchmark score be compared with every other score?",
      a: "Only when the models were evaluated under the same Zorix benchmark definition and harness."
    }
  ],

  "mimo-v25": [
    {
      q: "Who provides MiMo-V2.5?",
      a: "MiMo-V2.5 is listed under Xiaomi in the Zorix Metron catalog."
    },
    {
      q: "Why is its traffic lower than the trillion-token models?",
      a: "Usage ranking reflects actual recorded Zorix traffic. It is not a quality ranking and smaller traffic does not imply lower capability."
    },
    {
      q: "Does Metron estimate missing model specifications?",
      a: "No. Unknown fields should remain undisclosed rather than being inferred."
    }
  ],

  "gpt-56-luna": [
    {
      q: "What is GPT-5.6 Luna on this site?",
      a: "It is the GPT-5.6 Luna configuration currently tracked inside Zorix Code."
    },
    {
      q: "Is the displayed traffic OpenAI global usage?",
      a: "No. It only describes traffic handled by the Zorix environment."
    },
    {
      q: "Why are some architecture fields unavailable?",
      a: "The Zorix catalog does not infer closed-model parameter counts or architecture details that have not been supplied."
    }
  ],

  "gpt-56-sol-max": [
    {
      q: "What does Sol Max mean?",
      a: "It identifies the maximum-effort Sol configuration tracked separately from GPT-5.6 Luna."
    },
    {
      q: "Why are Luna and Sol separate entries?",
      a: "Keeping them separate makes their routing profile and Metron traffic directly visible instead of combining all GPT-5.6 usage."
    },
    {
      q: "How is its weekly usage displayed?",
      a: "The supplied 1.7M/week measurement is stored directly and normalized to the daily ranking where needed."
    }
  ],

  "glm-53-flash": [
    {
      q: "What is the purpose of the Flash label?",
      a: "Within the catalog it identifies the fast GLM 5.3 deployment rather than GLM 5.2 Max or GLM 5.1."
    },
    {
      q: "Why does the page show both weekly and daily values?",
      a: "The source measurement is weekly. Metron retains that value and also normalizes it to a daily rate for ranking."
    },
    {
      q: "Are GLM variants combined?",
      a: "No. GLM 5.1, GLM 5.2 Max and GLM 5.3 Flash are tracked separately."
    }
  ],

  "glm-52-max": [
    {
      q: "What does Max mean for GLM 5.2?",
      a: "It denotes the high-effort inference profile tracked by Zorix, not necessarily a separately trained GLM checkpoint."
    },
    {
      q: "Why not merge this with GLM 5.3 Flash?",
      a: "They represent different model/configuration targets and have independent usage measurements."
    },
    {
      q: "Does a higher Max effort guarantee a higher benchmark score?",
      a: "No. Benchmark outcome depends on the task, harness, model configuration and evaluation settings."
    }
  ],

  "glm-51": [
    {
      q: "Why was GLM 5.1 added as a separate model?",
      a: "It now has its own supplied Zorix usage measurement, so its 1.9B/week traffic can be tracked independently."
    },
    {
      q: "What daily rate does 1.9B/week correspond to?",
      a: "Approximately 271.43M per day when normalized across seven days."
    },
    {
      q: "Is the 1.9B number request count or token volume?",
      a: "This page currently stores it under Metron's token-volume metric. If the original measurement represents requests rather than tokens, it should be moved to a separate request-count dataset."
    }
  ],

  "gemini-37-flash": [
    {
      q: "Why is Gemini 3.7 Flash separate from Gemini 3.6 Flash?",
      a: "They are tracked as different Google model generations so their traffic and future benchmark results remain distinct."
    },
    {
      q: "What is the original usage measurement?",
      a: "The supplied figure is 2.9B tokens per week."
    },
    {
      q: "Does Metron disclose Gemini parameter counts?",
      a: "Not unless a reliable value is explicitly part of the catalog."
    }
  ],

  "gemini-36-flash": [
    {
      q: "How much Gemini 3.6 Flash usage is recorded?",
      a: "89.5B tokens per week, normalized to approximately 12.786B per day."
    },
    {
      q: "Is Gemini 3.6 Flash replacing Gemini 3.7 Flash?",
      a: "No. Both are independently tracked entries in Zorix Metron."
    },
    {
      q: "Why does this model use the Google G logo?",
      a: "Google-family models in the catalog now use the supplied Google provider mark for consistent provider identification."
    }
  ],

  "claude-sonnet-5": [
    {
      q: "Where does Sonnet 5 sit in the Claude models here?",
      a: "It is tracked as the balanced Sonnet tier, separately from Opus and Fable routing profiles."
    },
    {
      q: "How much Zorix usage does it have?",
      a: "The current supplied value is 2.1M tokens per week."
    },
    {
      q: "Does this page compare it directly with Opus 5?",
      a: "Usage can be compared directly, while benchmark comparisons should only use the same evaluation harness."
    }
  ],

  "claude-opus-48": [
    {
      q: "Why is Opus 4.8 still tracked?",
      a: "Keeping it in the catalog makes traffic across Claude Opus generations visible rather than folding older usage into Opus 5."
    },
    {
      q: "What is its recorded weekly volume?",
      a: "1.1M tokens per week."
    },
    {
      q: "Is Opus 4.8 the same routing target as Opus 5?",
      a: "No. They are separate catalog entries and are accounted for independently."
    }
  ],

  "claude-fable-5-fallback-max": [
    {
      q: "Why is Fable 5 listed with fallback max?",
      a: "The Zorix catalog treats this routing configuration as a distinct deployment rather than merging it with other Claude families."
    },
    {
      q: "Does fallback traffic count separately?",
      a: "Yes. That is the reason the profile is independently tracked."
    },
    {
      q: "What is its current weekly usage?",
      a: "The supplied measurement is 2.1M tokens per week."
    }
  ],

  "kimi-k27-code": [
    {
      q: "Why is K2.7 Code specifically labeled Code?",
      a: "The catalog treats it as the coding-focused Kimi deployment rather than combining its traffic with Kimi K3."
    },
    {
      q: "How much traffic is recorded?",
      a: "1.1T tokens per week, approximately 157.14B per day."
    },
    {
      q: "Is its usage comparable with Kimi K3?",
      a: "Yes for Metron traffic volume, because both are represented using the same token-volume unit."
    }
  ],

  "kimi-k3": [
    {
      q: "How is Kimi K3 different from K2.7 Code here?",
      a: "They are distinct Kimi model generations with separate usage and model-profile records."
    },
    {
      q: "What is K3's current supplied usage?",
      a: "2.1M tokens per week, normalized to 300K per day."
    },
    {
      q: "Why can two Kimi models have very different traffic?",
      a: "Metron usage reflects routing and user demand inside Zorix, not a capability score."
    }
  ],

  "muse-spark-12": [
    {
      q: "Who provides Muse Spark 1.2?",
      a: "The model is tracked under Meta and uses the Meta provider logo supplied for the catalog."
    },
    {
      q: "How much usage does Muse Spark 1.2 have?",
      a: "77.91B tokens per week, which normalizes to 11.13B tokens per day."
    },
    {
      q: "Why are technical specifications marked undisclosed?",
      a: "Only usage and metadata supplied to the catalog are shown. Unknown architecture or parameter details are not guessed."
    }
  ],

  "nvidia-nemotron-3-ultra": [
    {
      q: "When did Nemotron 3 Ultra appear in Metron?",
      a: "It was added on August 30, 2026."
    },
    {
      q: "Why did its displayed daily usage change from 9.1B to 6.1B?",
      a: "9.1B was the launch-day measurement on August 30. The current August 31 measurement is 6.1B, so the current ranking uses 6.1B."
    },
    {
      q: "Why is its trend much shorter than older models?",
      a: "Only two real daily observations have been supplied so far. Metron does not fabricate earlier history just to make the chart longer."
    }
  ]

};
