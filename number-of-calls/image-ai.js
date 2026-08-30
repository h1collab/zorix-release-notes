window.ZORIX_IMAGE_AI = {
  updatedAt: "2026-08-30",

  methodology: {
    title: "Zorix Metron Image AI Composite",
    note: "Cross-source editorial ranking based on current placement across Arena Text-to-Image and Artificial Analysis Text-to-Image. Source scores remain separate; no synthetic Elo is presented as an official benchmark.",
    sources: [
      {
        name: "Arena",
        date: "2026-08-25",
        url: "https://arena.ai/leaderboard/text-to-image"
      },
      {
        name: "Artificial Analysis",
        date: "2026-08-30",
        url: "https://artificialanalysis.ai/image/leaderboard/text-to-image"
      }
    ]
  },

  models: [
    {
      rank: 1,
      name: "GPT Image 2",
      provider: "OpenAI",
      arena: {
        rank: 1,
        score: 1382,
        uncertainty: 4
      },
      artificialAnalysis: {
        rank: 1,
        elo: 1370,
        ci: 10
      },
      note: "Top-ranked on both current source leaderboards."
    },

    {
      rank: 2,
      name: "MAI-Image-2.6 Preview",
      provider: "Microsoft AI",
      arena: {
        rank: 2,
        score: 1331,
        uncertainty: 8
      },
      artificialAnalysis: {
        rank: 2,
        elo: 1351,
        ci: 12
      },
      note: "Second on both current source leaderboards."
    },

    {
      rank: 3,
      name: "Reve 2.1",
      provider: "Reve",
      arena: {
        rank: 4,
        score: 1302,
        uncertainty: 8
      },
      artificialAnalysis: {
        rank: 3,
        elo: 1322,
        ci: 9
      },
      note: "Consistently near the top across both leaderboards."
    },

    {
      rank: 4,
      name: "Nano Banana 2",
      provider: "Google",
      arena: {
        rank: 7,
        score: 1263,
        uncertainty: 5
      },
      artificialAnalysis: {
        rank: 4,
        elo: 1321,
        ci: 9
      },
      note: "Gemini 3.1 Flash Image / Nano Banana 2."
    },

    {
      rank: 5,
      name: "Grok Imagine Image 2.0",
      provider: "xAI",
      arena: {
        rank: 3,
        score: 1316,
        uncertainty: 12,
        preliminary: true
      },
      artificialAnalysis: null,
      note: "Arena score is marked Preliminary."
    },

    {
      rank: 6,
      name: "Muse Image",
      provider: "Meta",
      arena: {
        rank: 5,
        score: 1281,
        uncertainty: 6
      },
      artificialAnalysis: null,
      note: "Strong current Arena placement."
    },

    {
      rank: 7,
      name: "GPT Image 1.5 High",
      provider: "OpenAI",
      arena: null,
      artificialAnalysis: {
        rank: 5,
        elo: 1306,
        ci: 9
      },
      note: "Current Artificial Analysis top-five model."
    }
  ]
};
