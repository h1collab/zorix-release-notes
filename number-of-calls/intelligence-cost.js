window.ZORIX_INTELLIGENCE_COST = {
  title: "Metron Intelligence / Cost Map",

  note:
    "Cost-per-task values must come from a reproducible evaluation or supplied source. Models without a verified cost/task observation are omitted instead of estimated.",

  xLabel: "Cost per task (USD, log scale)",
  yLabel: "Intelligence index",

  points: [
    /*
      Example schema:

      {
        id: "gpt-56-luna",
        label: "GPT-5.6 Luna",
        provider: "OpenAI",
        cost: 0.06,
        intelligence: 51.2,
        source: "Artificial Analysis",
        sourceDate: "2026-07-31"
      }

      Add only sourced observations here.
    */
  ]
};
