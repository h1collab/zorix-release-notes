window.ZORIX_BENCHMARKS = {

  meta: {
    source: "Zorix AA4 internal preview evaluation",
    status: "preview",
    note: "Internal preview/testing figures. Not final public scores or third-party leaderboard submissions."
  },

  metrics: [
    {
      id: "forge",
      name: "ForgeBench preview",
      family: "Coding & Software Engineering"
    },
    {
      id: "swe-verified",
      name: "SWE-bench Verified",
      family: "Coding & Software Engineering"
    },
    {
      id: "swe-pro",
      name: "SWE-bench Pro",
      family: "Coding & Software Engineering"
    },
    {
      id: "terminal-21",
      name: "Terminal-Bench 2.1",
      family: "Agents, Tools & Environments"
    },
    {
      id: "bigcode",
      name: "BigCodeBench",
      family: "Coding & Software Engineering"
    },
    {
      id: "livecode",
      name: "LiveCodeBench",
      family: "Coding & Software Engineering"
    },
    {
      id: "repobench",
      name: "RepoBench",
      family: "Coding & Software Engineering"
    },
    {
      id: "cruxeval",
      name: "CRUXEval",
      family: "Coding & Software Engineering"
    },
    {
      id: "humaneval-plus",
      name: "HumanEval+",
      family: "Coding & Software Engineering"
    }
  ],

  /*
   * Current catalog mappings.
   *
   * External vendor names correspond to the comparison
   * labels already used by the Zorix internal evaluation.
   */

  scores: {

    "nex-coder-38-neptune": {
      "forge": 95.5,
      "swe-verified": 99.0,
      "swe-pro": 93.8,
      "terminal-21": 99.0,
      "bigcode": 96.5,
      "livecode": 89.8,
      "repobench": 96.3,
      "cruxeval": 98.1,
      "humaneval-plus": 99.0
    },

    "claude-opus-5": {
      "forge": 86.5,
      "swe-verified": 92.4,
      "swe-pro": 84.7,
      "terminal-21": 91.6,
      "bigcode": 87.4,
      "livecode": 80.6,
      "repobench": 87.1,
      "cruxeval": 89.0,
      "humaneval-plus": 92.3
    },

    "gpt-56-luna": {
      "forge": 85.5,
      "swe-verified": 91.4,
      "swe-pro": 83.7,
      "terminal-21": 90.6,
      "bigcode": 86.4,
      "livecode": 79.6,
      "repobench": 86.1,
      "cruxeval": 88.0,
      "humaneval-plus": 91.3
    },

    "gemini-37-flash": {
      "forge": 84.1,
      "swe-verified": 90.0,
      "swe-pro": 82.3,
      "terminal-21": 89.2,
      "bigcode": 85.0,
      "livecode": 78.2,
      "repobench": 84.7,
      "cruxeval": 86.6,
      "humaneval-plus": 89.9
    },

    "deepseek-v4-flash-0731": {
      "forge": 82.6,
      "swe-verified": 88.5,
      "swe-pro": 80.8,
      "terminal-21": 87.7,
      "bigcode": 83.5,
      "livecode": 76.7,
      "repobench": 83.2,
      "cruxeval": 85.1,
      "humaneval-plus": 88.4
    }

  }

};
