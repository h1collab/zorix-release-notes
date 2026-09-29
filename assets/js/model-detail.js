/* MODEL DETAIL BLOCK 1 */
const id = document.body?.dataset?.modelRouteId || "";



/*
 * Primary source: full model metadata.
 * Fallback source: generated model index.
 *
 * This prevents one malformed/failed models.js file
 * from turning every model route into "Model not found".
 */
const primaryModels =
  Array.isArray(
    window.ZORIX_MODEL_DETAILS
  )
    ? window.ZORIX_MODEL_DETAILS
    : [];


const fallbackModels =
  Array.isArray(
    window.ZORIX_MODEL_INDEX
  )
    ? window.ZORIX_MODEL_INDEX
    : [];


/*
 * Merge both sources by stable model ID.
 * Full metadata wins when available.
 */
const modelMap =
  new Map();


fallbackModels.forEach(
  item=>{

    if(item?.id){

      modelMap.set(
        item.id,
        item
      );

    }

  }
);


primaryModels.forEach(
  item=>{

    if(!item?.id){
      return;
    }


    const fallback =
      modelMap.get(
        item.id
      )
      ||
      {};


    modelMap.set(
      item.id,
      {
        ...fallback,
        ...item
      }
    );

  }
);


const models =
  Array.from(
    modelMap.values()
  );

const profiles =
  window.ZORIX_MODEL_PROFILES || {};

const benchmarkCatalog =
  window.ZORIX_BENCHMARKS || {
    metrics:[],
    scores:{}
  };

const benchmarkMap =
  benchmarkCatalog.scores || {};

const externalBenchmarkCatalog =
  window.ZORIX_EXTERNAL_BENCHMARKS || {};


const voteCatalog =
  window.ZORIX_COMMUNITY_VOTES || {
    models:[]
  };


function normalizeModelKey(value){

  return String(
    value || ""
  )
  .trim()
  .toLowerCase()
  .replace(
    /—/g,
    "-"
  )
  .replace(
    /[^a-z0-9]+/g,
    "-"
  )
  .replace(
    /^-+|-+$/g,
    ""
  );

}


/*
 * Accept:
 *   ?id=nex-coder-38-neptune
 *   ?id=Nex Coder 3.8 Preview Neptune
 *   older slug/name links
 */
const requestedKey =
  normalizeModelKey(
    id
  );


const model =
  models.find(
    item=>
      item.id===id
      ||
      item.name===id
      ||
      normalizeModelKey(
        item.id
      )===requestedKey
      ||
      normalizeModelKey(
        item.name
      )===requestedKey
  );

const profile =
  profiles[id] || {};


const providerRoutes = {
  "Zorix":"/zorix/",
  "Anthropic":"/anthropic/",
  "OpenAI":"/openai/",
  "Google":"/google/",
  "DeepSeek":"/deepseek/",
  "Tencent":"/tencent/",
  "Xiaomi":"/xiaomi/",
  "Z.ai":"/zai/"
};


function fmt(n){

  n=Number(n || 0);

  const compact=
    new Intl.NumberFormat(
      "en-US",
      {
        notation:"compact",
        maximumFractionDigits:2
      }
    );

  return compact.format(n);

}


function weekly(){

  if(
    model.weeklyTokens !== undefined &&
    model.weeklyTokens !== null
  ){
    return Number(
      model.weeklyTokens
    );
  }

  return Number(
    model.dailyTokens || 0
  ) * 7;

}


function modalityHTML(list){

  return (
    list || ["Text"]
  )
  .map(
    x=>`
      <span class="modality">
        ${x}
      </span>
    `
  )
  .join("");

}


function metaCard(
  label,
  value,
  raw=false
){

  return `
    <div class="meta-card">

      <div class="meta-label">
        ${label}
      </div>

      <div class="meta-value">
        ${
          raw
          ? value
          : (value || "—")
        }
      </div>

    </div>
  `;

}


function rankFor(
  key,
  score
){

  const values=
    Object.entries(
      benchmarkMap
    )
    .filter(
      ([_,v])=>
        Number.isFinite(
          Number(v[key])
        )
    )
    .map(
      ([modelId,v])=>({
        id:modelId,
        value:Number(v[key])
      })
    )
    .sort(
      (a,b)=>
        b.value-a.value
    );


  const index=
    values.findIndex(
      x=>x.id===id
    );


  if(index<0)
    return null;


  return {
    rank:index+1,
    total:values.length
  };

}


function percentileLabel(
  rank,
  total
){

  if(
    !rank ||
    !total
  ){
    return "";
  }

  const pct=
    Math.ceil(
      rank/total*100
    );

  return `Top ${pct}%`;

}


function benchmarkCard(
  title,
  key,
  score
){

  const rank=
    rankFor(
      key,
      score
    );


  return `
    <div
      class="bench-card"
      onclick="
        location.href=
          '/number-of-calls/compare/?a=${encodeURIComponent(id)}'
      "
    >

      <div class="bench-name">
        ${title}
      </div>

      ${
        rank
        ? `
          <div class="bench-rank">
            ${percentileLabel(
              rank.rank,
              rank.total
            )}
          </div>
        `
        : ""
      }

      <div class="bench-score-row">

        <div class="bench-score">
          ${score.toFixed(1)}
        </div>

        <div class="bench-unit">
          %
        </div>

      </div>


      <div class="bench-line">

        <div
          class="bench-fill"
          style="
            width:${Math.min(
              100,
              Math.max(
                0,
                score
              )
            )}%
          "
        ></div>

      </div>


      <div class="bench-foot">

        ${
          rank
          ? `
            <span>
              Rank ${rank.rank}
              of ${rank.total}
            </span>

            <span>·</span>
          `
          : ""
        }

        <span>
          Click to compare
        </span>

      </div>

    </div>
  `;

}


function radarHTML(
  terminal,
  swe
){

  /*
   * There are currently only two public comparison
   * axes on this site. The visualization deliberately
   * does not invent extra benchmark categories.
   */

  const axes=[
    {
      label:"Terminal",
      value:terminal
    },
    {
      label:"SWE Verified",
      value:swe
    },
    {
      label:"Terminal",
      value:terminal
    },
    {
      label:"SWE Verified",
      value:swe
    }
  ];


  const cx=300;
  const cy=210;
  const radius=145;


  function point(
    index,
    total,
    r
  ){

    const angle=
      -Math.PI/2 +
      index/total *
      Math.PI*2;

    return [
      cx +
      Math.cos(angle)*r,

      cy +
      Math.sin(angle)*r
    ];

  }


  const grid=[];


  for(
    const ratio of
    [.25,.5,.75,1]
  ){

    grid.push(
      axes.map(
        (_,i)=>
          point(
            i,
            axes.length,
            radius*ratio
          ).join(",")
      ).join(" ")
    );

  }


  const data=
    axes.map(
      (axis,i)=>
        point(
          i,
          axes.length,
          radius*
          axis.value/100
        ).join(",")
    ).join(" ");


  const labels=
    axes.map(
      (axis,i)=>{

        const [x,y]=
          point(
            i,
            axes.length,
            radius+33
          );

        return `
          <text
            x="${x}"
            y="${y}"
            text-anchor="middle"
            dominant-baseline="middle"
            font-size="13"
            fill="#333"
          >
            ${axis.label}
          </text>
        `;

      }
    ).join("");


  return `
    <div class="radar-card">

      <div class="radar-top">

        <div class="radar-title">
          Benchmark profile
        </div>

        <div class="radar-toggle">
          <span class="active">
            Score
          </span>
          <span>
            Rank
          </span>
        </div>

      </div>


      <div class="radar-wrap">

        <svg
          class="radar"
          viewBox="0 0 600 420"
          role="img"
          aria-label="Benchmark performance profile"
        >

          ${
            grid.map(
              points=>`
                <polygon
                  points="${points}"
                  fill="none"
                  stroke="#deded9"
                  stroke-width="1"
                />
              `
            ).join("")
          }


          ${
            axes.map(
              (_,i)=>{

                const [x,y]=
                  point(
                    i,
                    axes.length,
                    radius
                  );

                return `
                  <line
                    x1="${cx}"
                    y1="${cy}"
                    x2="${x}"
                    y2="${y}"
                    stroke="#e2e2df"
                    stroke-width="1"
                  />
                `;

              }
            ).join("")
          }


          <polygon
            points="${data}"
            fill="rgba(124,92,231,.16)"
            stroke="#7c5ce7"
            stroke-width="4"
          />


          ${
            axes.map(
              (axis,i)=>{

                const [x,y]=
                  point(
                    i,
                    axes.length,
                    radius*
                    axis.value/100
                  );

                return `
                  <circle
                    cx="${x}"
                    cy="${y}"
                    r="5"
                    fill="#fff"
                    stroke="#7c5ce7"
                    stroke-width="4"
                  />
                `;

              }
            ).join("")
          }


          ${labels}

        </svg>

      </div>

    </div>
  `;

}




function renderPublicEvaluations(){

  const target =
    document.getElementById(
      "publicEvaluationContent"
    );

  if(!target || !model){
    return;
  }


  const catalog =
    window.ZORIX_EXTERNAL_BENCHMARKS || {};


  const entry =
    catalog[
      model.id
    ];


  if(!entry){

    target.innerHTML=`
      <div class="public-eval-empty">
        No public evaluation record has been
        attached for this model yet.
      </div>
    `;

    return;
  }


  const evaluations =
    Array.isArray(
      entry.evaluations
    )
      ? entry.evaluations
      : [];


  const sourceLink =
    entry.source
      ? `
        <a
          class="public-eval-link"
          href="${entry.source}"
          target="_blank"
          rel="noopener"
        >
          View source ↗
        </a>
      `
      : "";


  const rows =
    evaluations.length
      ? `
        <div class="public-eval-list">

          ${
            evaluations.map(
              item=>`

                <div class="public-eval-row">

                  <div>

                    <div class="public-eval-name">
                      ${item.benchmark}
                    </div>

                    ${
                      item.detail
                        ? `
                          <div class="public-eval-detail">
                            ${item.detail}
                          </div>
                        `
                        : ""
                    }

                  </div>


                  <div class="public-eval-value">

                    ${item.value}

                    ${
                      item.unit
                        ? `
                          <span class="public-eval-unit">
                            ${item.unit}
                          </span>
                        `
                        : ""
                    }

                  </div>

                </div>

              `
            ).join("")
          }

        </div>
      `
      : `
        <div class="public-eval-empty">
          ${
            entry.note ||
            "No verified public benchmark attached."
          }
        </div>
      `;


  target.innerHTML=`

    <div class="public-eval-source">

      <span class="public-eval-type">
        ${
          entry.sourceType ||
          "external"
        }
      </span>

      <strong>
        ${
          entry.label ||
          "Public evaluation"
        }
      </strong>

      ${sourceLink}

    </div>

    ${rows}

    ${
      evaluations.length &&
      entry.note
        ? `
          <div class="public-eval-note">
            ${entry.note}
          </div>
        `
        : ""
    }

  `;

}


if(!model){

  document
    .getElementById("main")
    .innerHTML=`
      <a
        class="back"
        href="./"
      >
        ← All models
      </a>

      <h1>
        Model not found
      </h1>
    `;

}else{


  document.title=
    (
      model.blindTest
        ? `${model.name} | Zorix Metron`
        : `${model.name} | Zorix Code`
    );


  /* BLIND_TEST_VISIBILITY_V1 */

  if(model.blindTest){

    const accessSection =
      document.getElementById(
        "accessSection"
      );


    const providersSection =
      document.getElementById(
        "providersSection"
      );


    if(accessSection){

      accessSection.hidden =
        true;

    }


    if(providersSection){

      providersSection.hidden =
        true;

    }

  }


  /* identity */

  const logo=
    document.getElementById(
      "logo"
    );


  if(model.logo){

    logo.innerHTML=`
      <img
        src="${model.logo}?v=1788156881"
        alt=""
      >
    `;

  }else{

    logo.innerHTML=`
      <span class="logo-fallback">
        ${model.provider.slice(0,1)}
      </span>
    `;

  }


  const provider=
    document.getElementById(
      "provider"
    );

  provider.textContent=
    model.provider;


  if(
    providerRoutes[
      model.provider
    ]
  ){

    provider.onclick=
      ()=>
        location.href=
          providerRoutes[
            model.provider
          ];

  }


  document
    .getElementById("name")
    .textContent=
      model.name;


  const slug=
    profile.slug ||
    (
      model.provider
        .toLowerCase()
        .replace(/[^a-z0-9]+/g,"-") +
      "/" +
      model.id
    );


  document
    .getElementById("slug")
    .textContent=
      slug;


  document
    .getElementById(
      "copySlug"
    )
    .onclick=
      async ()=>{

        await navigator
          .clipboard
          .writeText(slug);

        document
          .getElementById(
            "copySlug"
          )
          .textContent=
            "Copied";

      };


  if(model.docs){

    const docs=
      document.getElementById(
        "docs"
      );

    docs.href=
      model.docs;

    docs.hidden=false;

  }


  if(profile.weights){

    const weights=
      document.getElementById(
        "weights"
      );

    weights.href=
      profile.weights;

    weights.hidden=false;

  }


  /* unique copy */

  document
    .getElementById(
      "tagline"
    )
    .textContent=
      profile.tagline ||
      model.family;


  document
    .getElementById(
      "description"
    )
    .textContent=
      profile.description ||
      model.about ||
      "";


  document
    .getElementById(
      "highlights"
    )
    .innerHTML=
      (
        profile.highlights ||
        []
      )
      .map(
        x=>`<li>${x}</li>`
      )
      .join("");


  /* cards */

  document
    .getElementById(
      "metaGrid"
    )
    .innerHTML=

      metaCard(
        "Modalities",
        modalityHTML(
          profile.modalities
        ),
        true
      )

      +

      metaCard(
        "Context",
        model.context
      )

      +

      metaCard(
        "Released",
        profile.released
      )

      +

      metaCard(
        "Availability",
        profile.availability ||
        model.status
      )

      +

      metaCard(
        "Parameters",
        model.parameters
      )

      +

      metaCard(
        "Active parameters",
        model.activeParameters
      )

      +

      metaCard(
        "Architecture",
        model.architecture
      )

      +

      metaCard(
        "Family",
        model.family
      );


  /* WOLF_THETA_USAGE_V1 */

  const isRequestMetric =
    model.usageMetric ===
    "requests";


  const modelVote =
    (
      voteCatalog.models ||
      []
    )
    .find(
      item=>
        item.id===model.id
    )
    ||
    null;


  if(isRequestMetric){

    const copy =
      document.getElementById(
        "usageSectionCopy"
      );


    if(copy){

      copy.textContent =
        (
          "Published request traffic for this blind-test alias. "
          +
          "Request figures are kept separate from token usage."
        );

    }


    const dailyLabel =
      document.getElementById(
        "dailyLabel"
      );


    const weeklyLabel =
      document.getElementById(
        "weeklyLabel"
      );


    if(dailyLabel){

      dailyLabel.textContent =
        "Daily requests";

    }


    if(weeklyLabel){

      weeklyLabel.textContent =
        "Weekly requests";

    }


    document
      .getElementById(
        "daily"
      )
      .textContent =
        "Not published";


    document
      .getElementById(
        "weekly"
      )
      .textContent =
        (
          model.weeklyRequests
            ? (
                fmt(
                  model.weeklyRequests
                )
                +
                " requests / wk"
              )
            : "Not published"
        );

  }else if(
    model.fiveHourOnlyTokens
  ){

    /* FIVE_HOUR_MODEL_USAGE_V1 */

    const copy =
      document.getElementById(
        "usageSectionCopy"
      );


    if(copy){

      copy.textContent =
        (
          "A five-hour Zorix Metron token observation is "
          +
          "published for this newly tracked model. "
          +
          "No daily, weekly or historical token series "
          +
          "is inferred from that period total."
        );

    }


    const dailyLabel =
      document.getElementById(
        "dailyLabel"
      );


    const weeklyLabel =
      document.getElementById(
        "weeklyLabel"
      );


    if(dailyLabel){

      dailyLabel.textContent =
        "5-hour observation";

    }


    if(weeklyLabel){

      weeklyLabel.textContent =
        "Daily total";

    }


    document
      .getElementById(
        "daily"
      )
      .textContent =
        fmt(
          model.fiveHourTokens
        )
        +
        " tokens / 5h";


    document
      .getElementById(
        "weekly"
      )
      .textContent =
        "Not published";


  }else if(
    model.weeklyOnlyTokens
  ){

    const copy =
      document.getElementById(
        "usageSectionCopy"
      );


    if(copy){

      copy.textContent =
        (
          (
            model.thirtyDayTokens !== undefined
            &&
            model.thirtyDayTokens !== null
          )
            ? (
                "Weekly and 30-day Zorix Metron token observations "
                +
                "are published for this model. No measured daily "
                +
                "breakdown or historical per-day series has been "
                +
                "published."
              )
            : (
                "A weekly Zorix Metron token observation is published "
                +
                "for this model. No measured daily breakdown or "
                +
                "historical per-day series has been published."
              )
        );

    }


    document
      .getElementById(
        "daily"
      )
      .textContent =
        "Not published";


    document
      .getElementById(
        "weekly"
      )
      .textContent =
        fmt(
          weekly()
        )
        +
        " tokens / wk";


  }else{

    document
      .getElementById(
        "daily"
      )
      .textContent=
        fmt(
          model.dailyTokens
        ) +
        " tokens";


    document
      .getElementById(
        "weekly"
      )
      .textContent=
        fmt(
          weekly()
        ) +
        " tokens";

  }


  document
    .getElementById(
      "source"
    )
    .textContent=
      model.source ||
      (
        isRequestMetric
          ? "Zorix Metron"
          : "Zorix Code"
      );


  /* trend */

  const arr=
    model.chart || [];

  const max=
    Math.max(
      ...arr,
      1
    );

  const chart=
    document.getElementById(
      "chart"
    );


  if(
    isRequestMetric &&
    !arr.length
  ){

    chart.insertAdjacentHTML(
      "beforeend",
      `
        <div
          style="
            position:absolute;
            inset:0;
            display:grid;
            place-items:center;
            color:#777;
            font-size:12px;
            text-align:center;
            padding:30px;
          "
        >
          Historical request series not published.
        </div>
      `
    );

  }


  if(
    model.fiveHourOnlyTokens &&
    !arr.length
  ){

    chart.insertAdjacentHTML(
      "beforeend",
      `
        <div
          style="
            position:absolute;
            inset:0;
            display:grid;
            place-items:center;
            color:#777;
            font-size:12px;
            text-align:center;
            padding:30px;
          "
        >
          Historical daily token series not published.
          Current 5-hour observation:
          ${fmt(model.fiveHourTokens)} tokens.
        </div>
      `
    );

  }


  if(
    model.weeklyOnlyTokens &&
    !arr.length
  ){

    chart.insertAdjacentHTML(
      "beforeend",
      `
        <div
          style="
            position:absolute;
            inset:0;
            display:grid;
            place-items:center;
            color:#777;
            font-size:12px;
            text-align:center;
            padding:30px;
          "
        >
          Historical daily token series not published.
          Current weekly observation: ${fmt(model.weeklyTokens)} tokens.
          ${
            model.thirtyDayTokens !== undefined
            &&
            model.thirtyDayTokens !== null
              ? (
                  " Current 30-day observation: "
                  +
                  fmt(model.thirtyDayTokens)
                  +
                  " tokens."
                )
              : ""
          }
        </div>
      `
    );

  }


  chart.insertAdjacentHTML(
    "beforeend",

    arr.map(
      value=>`
        <div
          class="bar"
          style="
            height:${
              Math.max(
                1,
                value/max*100
              )
            }%;
            background:${
              model.color ||
              "#111"
            }
          "
        ></div>
      `
    ).join("")
  );


  /* benchmark */

  const internalScores =
    benchmarkMap[id] || {};

  const externalEntry =
    externalBenchmarkCatalog[id] || null;

  const benchContent =
    document.getElementById(
      "benchmarkContent"
    );

  const internalMetrics =
    benchmarkCatalog.metrics || [];


  const internalAvailable =
    internalMetrics.filter(
      metric=>{

        const value =
          internalScores[
            metric.id
          ];

        return Number.isFinite(
          Number(value)
        );

      }
    );


  const externalAvailable =
    (
      externalEntry &&
      Array.isArray(
        externalEntry.evaluations
      )
    )
      ? externalEntry.evaluations
      : [];


  function internalCard(metric){

    const score =
      Number(
        internalScores[
          metric.id
        ]
      );

    const rank =
      rankFor(
        metric.id,
        score
      );

    return `
      <div
        class="bench-card"
        onclick="
          location.href=
            '/number-of-calls/compare/?a=${encodeURIComponent(id)}'
        "
      >

        <div class="bench-name">
          ${metric.name}
        </div>

        ${
          rank
            ? `
              <div class="bench-rank">
                ${percentileLabel(
                  rank.rank,
                  rank.total
                )}
              </div>
            `
            : ""
        }

        <div class="bench-score-row">

          <div class="bench-score">
            ${score.toFixed(1)}
          </div>

          <div class="bench-unit">
            %
          </div>

        </div>

        <div class="bench-line">

          <div
            class="bench-fill"
            style="
              width:${
                Math.min(
                  100,
                  Math.max(
                    0,
                    score
                  )
                )
              }%
            "
          ></div>

        </div>

        <div class="bench-foot">

          <span>
            Zorix internal preview
          </span>

          ${
            rank
              ? `
                <span>·</span>
                <span>
                  Rank ${rank.rank}
                  of ${rank.total}
                </span>
              `
              : ""
          }

        </div>

      </div>
    `;
  }


  function externalCard(item){

    const raw =
      String(
        item.value ?? "—"
      );

    const numeric =
      Number(raw);

    const isNumeric =
      Number.isFinite(
        numeric
      );

    return `
      <div
        class="bench-card bench-public-card"
      >

        <div class="bench-name">
          ${item.benchmark}
        </div>

        <div class="bench-public-value">

          ${raw}

          ${
            item.unit
              ? `
                <span class="bench-public-unit">
                  ${item.unit}
                </span>
              `
              : ""
          }

        </div>

        ${
          isNumeric &&
          (
            item.unit === "%" ||
            item.unit === "score"
          )
            ? `
              <div class="bench-line">

                <div
                  class="bench-fill"
                  style="
                    width:${
                      Math.min(
                        100,
                        Math.max(
                          0,
                          numeric
                        )
                      )
                    }%
                  "
                ></div>

              </div>
            `
            : ""
        }

        ${
          item.detail
            ? `
              <div class="bench-public-detail">
                ${item.detail}
              </div>
            `
            : ""
        }

        <div class="bench-foot">

          <span>
            ${
              externalEntry?.sourceType ===
              "provider"
                ? "Provider published"
                : externalEntry?.sourceType ===
                  "third-party"
                    ? "Third-party evaluation"
                    : "External evaluation"
            }
          </span>

        </div>

      </div>
    `;
  }


  const sections=[];


  /*
   * Zorix internal results:
   * only render metrics that actually have scores.
   *
   * We deliberately DO NOT render a wall of
   * "Not evaluated" cards anymore.
   */
  if(internalAvailable.length){

    sections.push(`
      <div class="bench-source-group">

        <div class="bench-source-head">

          <div class="bench-source-title">

            Zorix evaluation

            <span class="bench-source-badge">
              Internal
            </span>

          </div>

          <div class="bench-source-note">
            AA4 internal preview/testing results.
            They are not third-party leaderboard submissions.
          </div>

        </div>

        <div class="bench-grid">

          ${
            internalAvailable
              .map(internalCard)
              .join("")
          }

        </div>

      </div>
    `);

  }


  /*
   * Provider / third-party results.
   */
  if(externalAvailable.length){

    const typeLabel =
      externalEntry?.sourceType ===
      "provider"
        ? "Provider"
        : externalEntry?.sourceType ===
          "third-party"
            ? "Third-party"
            : "External";


    sections.push(`
      <div class="bench-source-group">

        <div class="bench-source-head">

          <div class="bench-source-title">

            ${
              externalEntry?.label ||
              "Public evaluation"
            }

            <span class="bench-source-badge">
              ${typeLabel}
            </span>

          </div>

          <div class="bench-source-note">
            ${
              externalEntry?.note ||
              "Published evaluation results."
            }
          </div>

        </div>

        <div class="bench-grid">

          ${
            externalAvailable
              .map(externalCard)
              .join("")
          }

        </div>

        ${
          externalEntry?.source
            ? `
              <a
                class="bench-source-link"
                href="${externalEntry.source}"
                target="_blank"
                rel="noopener"
              >
                View evaluation source ↗
              </a>
            `
            : ""
        }

      </div>
    `);

  }


  /*
   * Only show an empty state when BOTH datasets
   * genuinely have no evaluation for this model.
   */
  if(!sections.length){

    benchContent.innerHTML=`
      <div class="bench-no-data">

        No reliable benchmark result has been
        attached for ${model.name} yet.

        <br><br>

        This means the site currently has neither
        a Zorix internal result nor a verified
        provider/third-party evaluation for the
        exact model configuration.

      </div>
    `;

  }else{

    benchContent.innerHTML=
      sections.join("");

  }



  /* details */

  const details=
    isRequestMetric
      ? [
          [
            "Provider",
            model.provider
          ],
          [
            "Status",
            model.status
          ],
          [
            "Released",
            model.launchDate ||
            "—"
          ],
          [
            "Underlying model",
            model.underlyingModel ||
            "Not disclosed"
          ],
          [
            "Community score",
            modelVote
              ? fmt(
                  modelVote.votes
                )
              : "Not published"
          ],
          [
            "Weekly requests",
            model.weeklyRequests
              ? (
                  fmt(
                    model.weeklyRequests
                  )
                  +
                  " / wk"
                )
              : "Not published"
          ],
          [
            "Historical request series",
            "Not published"
          ],
          [
            "Context",
            model.context
          ],
          [
            "Parameters",
            model.parameters
          ],
          [
            "Architecture",
            model.architecture
          ]
        ]
      : [
          [
            "Provider",
            model.provider
          ],
          [
            "Status",
            model.status
          ],
          [
            "Context",
            model.context
          ],
          [
            "Parameters",
            model.parameters
          ],
          [
            "Active parameters",
            model.activeParameters
          ],
          [
            "Architecture",
            model.architecture
          ],
          [
            "Input",
            model.inputPrice
          ],
          [
            "Output",
            model.outputPrice
          ],
          ...(
            model.fiveHourTokens !== undefined
            &&
            model.fiveHourTokens !== null
              ? [
                  [
                    "5-hour tokens",
                    fmt(
                      model.fiveHourTokens
                    )
                    +
                    " / 5h"
                  ],
                  [
                    "Zorix availability",
                    model.launchDate ||
                    "Not published"
                  ],
                  [
                    "Provider release",
                    model.providerReleaseDate ||
                    "Not published"
                  ],
                  [
                    "Maximum input",
                    model.maxInputTokens ||
                    "Not published"
                  ],
                  [
                    "Maximum output",
                    model.maxOutputTokens ||
                    "Not published"
                  ]
                ]
              : []
          ),

          [
            "Daily tokens",
            (
              model.fiveHourOnlyTokens
              ||
              model.weeklyOnlyTokens
            )
              ? "Not published"
              : fmt(
                  model.dailyTokens
                )
          ],
          [
            "Weekly tokens",
            model.fiveHourOnlyTokens
              ? "Not published"
              : model.weeklyOnlyTokens
                ? (
                    fmt(
                      weekly()
                    )
                    +
                    " / wk"
                  )
                : fmt(
                    weekly()
                  )
          ],
          [
            "30-day tokens",
            model.thirtyDayTokens !== undefined
            &&
            model.thirtyDayTokens !== null
              ? (
                  fmt(
                    model.thirtyDayTokens
                  )
                  +
                  " / 30d"
                )
              : "Not published"
          ]
        ];


  document
    .getElementById(
      "detailGrid"
    )
    .innerHTML=
      details.map(
        ([label,value])=>`
          <div class="detail-row">

            <div class="detail-label">
              ${label}
            </div>

            <div class="detail-value">
              ${value || "—"}
            </div>

          </div>
        `
      ).join("");


  /* THIRD_PARTY_EVIDENCE_RENDER_V3 */

  const evidence =
    Array.isArray(
      model.thirdPartyEvidence
    )
      ? model.thirdPartyEvidence
      : [];


  const evidenceSection =
    document.getElementById(
      "thirdPartyEvidenceSection"
    );


  const evidenceList =
    document.getElementById(
      "thirdPartyEvidenceList"
    );


  function evidenceEsc(value){

    return String(
      value ?? ""
    )
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;");

  }


  function evidenceReferenceHTML(
    reference
  ){

    const url =
      String(
        reference?.url
        ||
        ""
      );


    if(!url){
      return "";
    }


    const external =
      /^https?:\/\//i
      .test(
        url
      );


    return `

      <a
        class="evidence-reference"
        href="${evidenceEsc(url)}"
        ${
          external
            ? (
                'target="_blank" '
                +
                'rel="noopener"'
              )
            : ""
        }
      >

        <span class="evidence-reference-name">

          ${evidenceEsc(
            reference.name
            ||
            "Reference model"
          )}

          <span class="evidence-reference-arrow">
            ${
              external
                ? "↗"
                : "→"
            }
          </span>

        </span>


        <span class="evidence-reference-kind">

          ${evidenceEsc(
            reference.kind
            ||
            reference.availability
            ||
            "Reference"
          )}

        </span>

      </a>

    `;

  }


  if(
    evidence.length
    &&
    evidenceSection
    &&
    evidenceList
  ){

    evidenceSection.hidden =
      false;


    evidenceList.innerHTML =
      evidence.map(
        item=>{

          const references =
            Array.isArray(
              item.references
            )
              ? item.references
              : [];


          return `

            <article class="evidence-card">

              <div class="evidence-top">

                <span class="evidence-badge">
                  ${evidenceEsc(
                    item.language
                    ||
                    "Unknown language"
                  )}
                </span>

                <span class="evidence-badge">
                  ${evidenceEsc(
                    item.type
                    ||
                    "Observation"
                  )}
                </span>

                <span class="evidence-badge">
                  ${evidenceEsc(
                    item.status
                    ||
                    "Unverified"
                  )}
                </span>

                <span class="evidence-badge">
                  ${evidenceEsc(
                    item.confidence
                    ||
                    "Unclassified"
                  )}
                </span>

              </div>


              <div class="evidence-title">

                ${evidenceEsc(
                  item.finding
                  ||
                  "Observation recorded"
                )}

              </div>


              ${
                item.interpretation
                  ? `

                      <div class="evidence-copy">

                        ${evidenceEsc(
                          item.interpretation
                        )}

                      </div>

                    `
                  : ""
              }


              ${
                item.verification
                  ? `

                      <div class="evidence-warning">

                        Verification status:
                        ${evidenceEsc(
                          item.verification
                        )}

                      </div>

                    `
                  : ""
              }


              ${
                references.length
                  ? `

                      <div class="evidence-reference-title">
                        Models referenced by this observation
                      </div>


                      <div class="evidence-references">

                        ${
                          references
                            .map(
                              evidenceReferenceHTML
                            )
                            .join("")
                        }

                      </div>


                      <div class="evidence-reference-note">

                        Reference links do not imply that the
                        referenced model is the underlying identity
                        of Wolf Theta.

                      </div>

                    `
                  : ""
              }

            </article>

          `;

        }
      )
      .join("");

  }


  const compareButton =
    document.getElementById(
      "compareButton"
    );


  if(model.blindTest){

    /*
     * BLIND_MODEL_GUESS_LINK_V1
     */
    if(model.guessUrl){

      compareButton.style.display =
        "";

      compareButton.href =
        model.guessUrl;

      compareButton.textContent =
        model.guessQuestion
          ? "Guess the model"
          : "Guess model";

    }else{

      compareButton.style.display =
        "none";

    }

  }else{

    compareButton.href =
      "/number-of-calls/compare/?a=" +
      encodeURIComponent(
        model.id
      );

  }

}




/* =========================================================
   OTHER MODELS FROM SAME PROVIDER
   Randomized on every page load.
   ========================================================= */

function randomUint(max){

  if(max<=1){
    return 0;
  }


  if(
    window.crypto &&
    window.crypto.getRandomValues
  ){

    const buffer=
      new Uint32Array(1);

    window.crypto
      .getRandomValues(
        buffer
      );

    return (
      buffer[0] %
      max
    );

  }


  return Math.floor(
    Math.random()*max
  );

}


function shuffled(list){

  const arr=[
    ...list
  ];


  for(
    let i=
      arr.length-1;
    i>0;
    i--
  ){

    const j=
      randomUint(
        i+1
      );

    [
      arr[i],
      arr[j]
    ]=[
      arr[j],
      arr[i]
    ];

  }


  return arr;

}


function smallFmt(n){

  n=Number(n || 0);

  if(n>=1e15)
    return (
      n/1e15
    ).toFixed(2)
     .replace(/\.00$/,"")
     +"P";

  if(n>=1e12)
    return (
      n/1e12
    ).toFixed(2)
     .replace(/\.00$/,"")
     +"T";

  if(n>=1e9)
    return (
      n/1e9
    ).toFixed(2)
     .replace(/\.00$/,"")
     +"B";

  if(n>=1e6)
    return (
      n/1e6
    ).toFixed(2)
     .replace(/\.00$/,"")
     +"M";

  if(n>=1e3)
    return (
      n/1e3
    ).toFixed(2)
     .replace(/\.00$/,"")
     +"K";

  return String(
    Math.round(n)
  );

}


function otherModelLogo(item){

  if(item.logo){

    return `
      <img
        src="${item.logo}?v=1788156881"
        alt=""
      >
    `;

  }


  return `
    <span class="logo-fallback">
      ${
        String(
          item.provider || "?"
        ).slice(0,1)
      }
    </span>
  `;

}


function renderOtherModels(){

  const title=
    document.getElementById(
      "otherModelsTitle"
    );

  const copy=
    document.getElementById(
      "otherModelsCopy"
    );

  const grid=
    document.getElementById(
      "otherModelsGrid"
    );


  if(
    !model ||
    !title ||
    !grid
  ){
    return;
  }


  title.textContent=
    `Other models from ${model.provider}`;


  if(copy){

    copy.textContent=
      `Explore other ${model.provider} models tracked by Zorix Metron. Recommendations are shuffled on each visit.`;

  }


  const candidates=
    models.filter(
      item=>
        item.id!==model.id &&
        item.provider===
          model.provider
    );


  if(!candidates.length){

    grid.innerHTML=`
      <div class="other-model-empty">
        No other ${
          model.provider
        } models are currently
        tracked in this catalog.
      </div>
    `;

    return;
  }


  const selected=
    shuffled(
      candidates
    )
    .slice(
      0,
      3
    );


  grid.innerHTML=
    selected.map(
      item=>{

        const itemProfile=
          profiles[
            item.id
          ] || {};


        return `
          <a
            class="other-model-card"
            href="/number-of-calls/models/${encodeURIComponent(item.id)}/"
          >

            <div class="other-model-top">

              <div class="other-model-logo">
                ${otherModelLogo(item)}
              </div>


              <div>

                <div class="other-model-provider">
                  ${item.provider}
                </div>

                <div class="other-model-name">
                  ${item.name}
                </div>

              </div>

            </div>


            <div class="other-model-copy">
              ${
                itemProfile.tagline ||
                itemProfile.description ||
                item.about ||
                item.family ||
                ""
              }
            </div>


            <div class="other-model-stats">

              <span>
                ${smallFmt(item.dailyTokens)}
                / day
              </span>

              <span>
                ${
                  item.context ||
                  "Context —"
                }
              </span>

            </div>

          </a>
        `;

      }
    ).join("");

}


document
  .getElementById(
    "refreshOtherModels"
  )
  ?.addEventListener(
    "click",
    renderOtherModels
  );


if(model){
  renderOtherModels();
}




/* =========================================================
   MODEL PAGE HAMBURGER
   ========================================================= */

const modelMenuButton=
  document.getElementById(
    "modelMenuButton"
  );

const modelMenuOverlay=
  document.getElementById(
    "modelMenuOverlay"
  );


function closeModelMenu(){

  if(!modelMenuOverlay){
    return;
  }

  modelMenuOverlay
    .classList.remove(
      "open"
    );

  modelMenuOverlay
    .setAttribute(
      "aria-hidden",
      "true"
    );

}


modelMenuButton
  ?.addEventListener(
    "click",
    event=>{

      event.stopPropagation();

      modelMenuOverlay
        ?.classList.add(
          "open"
        );

      modelMenuOverlay
        ?.setAttribute(
          "aria-hidden",
          "false"
        );

    }
  );


modelMenuOverlay
  ?.addEventListener(
    "click",
    event=>{

      if(
        event.target===
        modelMenuOverlay
      ){
        closeModelMenu();
      }

    }
  );


document.addEventListener(
  "keydown",
  event=>{

    if(event.key==="Escape"){
      closeModelMenu();
    }

  }
);




/* =========================================================
   MODEL-SPECIFIC FAQ
   ========================================================= */

function renderModelFaq(){

  const target =
    document.getElementById(
      "modelFaq"
    );


  if(!target || !model){
    return;
  }


  const catalog =
    window.ZORIX_MODEL_FAQ || {};


  const items =
    catalog[
      model.id
    ] || [];


  if(!items.length){

    target.innerHTML=`
      <div class="faq-empty">
        No FAQ has been published for this model yet.
      </div>
    `;

    return;
  }


  target.innerHTML =
    items.map(
      (item,index)=>`

        <div class="faq-item">

          <button
            class="faq-question"
            type="button"
            aria-expanded="false"
          >

            <span class="faq-question-text">
              ${item.q}
            </span>

            <span class="faq-plus">
              +
            </span>

          </button>


          <div class="faq-answer">
            ${item.a}
          </div>

        </div>

      `
    ).join("");


  target
    .querySelectorAll(
      ".faq-item"
    )
    .forEach(
      item=>{

        const button =
          item.querySelector(
            ".faq-question"
          );


        button.addEventListener(
          "click",
          ()=>{

            const open =
              item.classList
                .toggle(
                  "open"
                );


            button.setAttribute(
              "aria-expanded",
              open
                ? "true"
                : "false"
            );

          }
        );

      }
    );

}


if(model){
  renderModelFaq();
}

/* MODEL DETAIL BLOCK 2 */
/* METRON MODEL ANALYSIS */

(function(){

  if(
    typeof model==="undefined"
    ||
    !model
  ){
    return;
  }


  const catalog =
    window.ZORIX_MODEL_ANALYSIS ||
    {};


  const analysis =
    catalog[
      model.id
    ]
    ||
    {};


  const grid =
    document.getElementById(
      "analysisGrid"
    );


  if(!grid){
    return;
  }


  function esc(value){

    return String(
      value ?? ""
    )
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;");

  }


  function display(value){

    if(
      value===null
      ||
      value===undefined
      ||
      value===""
      ||
      (
        Array.isArray(value)
        &&
        !value.length
      )
    ){

      return `
        <div class="analysis-value empty">
          Not published
        </div>
      `;

    }


    if(Array.isArray(value)){

      return `
        <div class="analysis-pills">

          ${
            value.map(
              item=>`
                <span class="analysis-pill">
                  ${esc(item)}
                </span>
              `
            )
            .join("")
          }

        </div>
      `;

    }


    return `
      <div class="analysis-value">
        ${esc(value)}
      </div>
    `;

  }


  function measured(
    value,
    unit=""
  ){

    if(
      value===null
      ||
      value===undefined
      ||
      value===""
    ){

      return `
        <div class="analysis-value empty">
          Not measured
        </div>
      `;

    }


    return `
      <div class="analysis-value">
        ${esc(value)}${esc(unit)}
      </div>
    `;

  }


  const fields=[

    [
      "Model ID",
      display(
        model.id
      )
    ],

    [
      "Alias",
      display(
        analysis.alias
      )
    ],

    [
      "License",
      display(
        analysis.license
      )
    ],

    [
      "Context window",
      display(
        model.context
      )
    ],

    [
      "Max output",
      display(
        analysis.maxOutput
      )
    ],

    [
      "Knowledge cutoff",
      display(
        analysis.knowledgeCutoff
      )
    ],

    [
      "Modalities",
      display(
        analysis.modalities
      )
    ],

    [
      "Tools",
      display(
        analysis.tools
      )
    ],

    [
      "Reasoning variants",
      display(
        analysis.reasoningVariants
        ||
        analysis.variants
      )
    ],

    [
      "Agent modes",
      display(
        analysis.agentModes
      )
    ],

    [
      "Task fit",
      display(
        analysis.taskFit
      )
    ],

    [
      "Provider endpoints",
      display(
        analysis.providerEndpoints
      )
    ],

    [
      "Routing",
      display(
        analysis.routing
      )
    ],

    [
      "Cost per task",
      measured(
        analysis.costPerTask
      )
    ],

    [
      "Output speed",
      measured(
        analysis.outputSpeed,
        " tok/s"
      )
    ],

    [
      "Time to first token",
      measured(
        analysis.ttft,
        " s"
      )
    ],

    [
      "End-to-end response",
      measured(
        analysis.totalResponse,
        " s"
      )
    ],

    [
      "Reasoning time",
      measured(
        analysis.reasoningTime,
        " s"
      )
    ]

  ];


  grid.innerHTML=
    fields.map(
      field=>`

        <div class="analysis-item">

          <div class="analysis-label">
            ${esc(field[0])}
          </div>

          ${field[1]}

        </div>

      `
    )
    .join("");


  const compare =
    document.getElementById(
      "analysisCompare"
    );


  if(compare){

    compare.href =
      "/number-of-calls/compare/?a="
      +
      encodeURIComponent(
        model.id
      );

  }

})();

/* MODEL DETAIL BLOCK 3 */
/* METRON_ACCESS_PROVIDER_RENDERER_V3 */

(function(){

  "use strict";


  if(
    typeof model==="undefined"
    ||
    !model
  ){
    return;
  }


  const pricingDB =
    window.ZORIX_MODEL_PRICING
    ||
    {
      zorix:{}
    };


  const providerDB =
    window.ZORIX_MODEL_PROVIDERS
    ||
    {
      models:{}
    };


  const zorix =
    pricingDB.zorix
    ||
    {};


  const isZorixModel =
    String(
      model.provider || ""
    )
    .toLowerCase()
    ===
    "zorix";


  const isNex38 =
    String(
      model.id || ""
    )
    .startsWith(
      "nex-coder-38"
    );


  function esc(value){

    return String(
      value ?? ""
    )
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;");

  }


  function money(value){

    if(
      value===null
      ||
      value===undefined
      ||
      value===""
    ){
      return "—";
    }


    const n =
      Number(value);


    if(!Number.isFinite(n)){
      return esc(value);
    }


    let digits=2;

    if(n<1){
      digits=4;
    }

    if(n<0.01){
      digits=5;
    }


    return (
      "$"
      +
      n.toLocaleString(
        "en-US",
        {
          minimumFractionDigits:0,
          maximumFractionDigits:digits
        }
      )
    );

  }


  /* ======================================================
     ACCESS
     ====================================================== */

  const accessGrid =
    document.getElementById(
      "accessGrid"
    );


  const access=[];


  access.push({

    name:
      "Zorix Code",

    state:
      "Available",

    badge:
      "Paid access",

    good:true,

    value:
      "Paid subscription required",

    note:
      isZorixModel
        ? (
            "This Zorix model is available "
            +
            "through Zorix Code."
          )
        : (
            "Third-party models are supported "
            +
            "through Zorix Code."
          ),

    links:[
      {
        label:
          "Paid plans ↗",

        url:
          zorix.plansUrl
          ||
          "https://subs.zorix.it/"
      }
    ]

  });


  /*
   * Chat is ONLY rendered on Zorix-owned models.
   */
  if(isZorixModel){

    access.push({

      name:
        "Zorix Chat",

      state:
        isNex38
          ? "Unavailable"
          : "Available",

      badge:
        isNex38
          ? "Gray rollout"
          : "Paid access",

      good:
        !isNex38,

      value:
        isNex38
          ? "Not available"
          : "Paid subscription required",

      note:
        isNex38
          ? (
              "Nex Coder 3.8 is currently "
              +
              "excluded from Zorix Chat "
              +
              "during gray rollout."
            )
          : (
              "Zorix Chat supports "
              +
              "Zorix-owned models."
            ),

      links:
        isNex38
          ? [
              {
                label:
                  "Paid plans ↗",

                url:
                  zorix.plansUrl
                  ||
                  "https://subs.zorix.it/"
              }
            ]
          : [
              {
                label:
                  "Open Chat ↗",

                url:
                  zorix.chat?.url
                  ||
                  "https://zorix.it/chat"
              },

              {
                label:
                  "Paid plans ↗",

                url:
                  zorix.plansUrl
                  ||
                  "https://subs.zorix.it/"
              }
            ]

    });

  }


  access.push({

    name:
      "Zorix API",

    state:
      "Unavailable",

    badge:
      "Service outage",

    good:false,

    value:
      "Temporarily unavailable",

    note:
      (
        "The Zorix API service is "
        +
        "currently unavailable."
      ),

    links:[
      {
        label:
          "View status ↗",

        url:
          "/status/"
      }
    ]

  });


  if(accessGrid){

    accessGrid.innerHTML =
      access.map(
        item=>`

          <article
            class="access-card ${
              item.good
                ? ""
                : "unavailable"
            }"
          >

            <div class="access-top">

              <div class="access-name">
                ${esc(item.name)}
              </div>


              <span
                class="access-badge ${
                  item.good
                    ? "good"
                    : "warn"
                }"
              >
                ${esc(item.badge)}
              </span>

            </div>


            <div class="access-value">
              ${esc(item.value)}
            </div>


            <div class="access-note">
              ${esc(item.note)}
            </div>


            <div class="access-links">

              ${
                item.links
                .map(
                  link=>`

                    <a
                      class="access-link"
                      href="${esc(link.url)}"
                      ${
                        String(
                          link.url
                        )
                        .startsWith("http")
                          ? (
                              'target="_blank" '
                              +
                              'rel="noopener"'
                            )
                          : ""
                      }
                    >
                      ${esc(link.label)}
                    </a>

                  `
                )
                .join("")
              }

            </div>

          </article>

        `
      )
      .join("");

  }


  const accessDisclaimer =
    document.getElementById(
      "accessDisclaimer"
    );


  if(accessDisclaimer){

    accessDisclaimer.textContent =
      isZorixModel
        ? (
            "Zorix Code supports this model. "
            +
            "Zorix Chat is available only for "
            +
            "Zorix-owned models, subject to rollout."
          )
        : (
            "This is a third-party model. "
            +
            "It is available through Zorix Code, "
            +
            "not through Zorix Chat."
          );

  }


  /* ======================================================
     PROVIDERS
     ====================================================== */

  const entry =
    providerDB.models?.[
      model.id
    ]
    ||
    {
      providers:[],
      history:[]
    };


  let providers =
    Array.isArray(
      entry.providers
    )
      ? [...entry.providers]
      : [];


  const table =
    document.getElementById(
      "providerTable"
    );


  const source =
    document.getElementById(
      "providerSource"
    );


  const sortSelect =
    document.getElementById(
      "providerSort"
    );


  const quantSelect =
    document.getElementById(
      "providerQuantization"
    );


  if(source){

    const text =
      entry.source
      ||
      "Provider data not published";


    source.innerHTML =
      entry.sourceUrl
        ? `
          <a
            href="${esc(entry.sourceUrl)}"
            target="_blank"
            rel="noopener"
          >
            ${esc(text)} ↗
          </a>
        `
        : esc(text);

  }


  if(quantSelect){

    const values =
      [
        ...new Set(
          providers
          .map(
            item=>
              item.quantization
          )
          .filter(Boolean)
        )
      ]
      .sort();


    quantSelect.innerHTML =
      `
        <option value="">
          All quantization
        </option>
      `
      +
      values.map(
        value=>`
          <option value="${esc(value)}">
            ${esc(value)}
          </option>
        `
      )
      .join("");

  }


  function metric(
    value,
    formatter
  ){

    if(
      value===null
      ||
      value===undefined
      ||
      value===""
    ){
      return "Not measured";
    }

    return formatter(value);

  }


  function providerLogo(row){

    const logo =
      row.logo
      ||
      {};


    if(logo.url){

      return `
        <img
          src="${esc(logo.url)}"
          alt=""
          loading="lazy"
          referrerpolicy="no-referrer"
        >
      `;

    }


    return esc(
      String(
        row.name || "?"
      )
      .slice(0,2)
      .toUpperCase()
    );

  }


  function rawOrMoney(
    row,
    rawKey,
    numericKey
  ){

    if(row[rawKey]){
      return esc(
        row[rawKey]
      );
    }

    return money(
      row[numericKey]
    );

  }


  function renderProviders(){

    if(!table){
      return;
    }


    const quant =
      quantSelect?.value
      ||
      "";


    let rows =
      providers.filter(
        row=>
          !quant
          ||
          row.quantization===quant
      );


    const mode =
      sortSelect?.value
      ||
      "price";


    const num =
      (
        value,
        fallback
      )=>{
        const n =
          Number(value);

        return Number.isFinite(n)
          ? n
          : fallback;
      };


    rows.sort(
      (a,b)=>{

        if(mode==="latency"){
          return (
            num(
              a.latencyP50,
              Infinity
            )
            -
            num(
              b.latencyP50,
              Infinity
            )
          );
        }


        if(mode==="throughput"){
          return (
            num(
              b.throughputP50,
              -Infinity
            )
            -
            num(
              a.throughputP50,
              -Infinity
            )
          );
        }


        if(mode==="uptime"){
          return (
            num(
              b.uptime,
              -Infinity
            )
            -
            num(
              a.uptime,
              -Infinity
            )
          );
        }


        if(mode==="name"){
          return String(
            a.name || ""
          ).localeCompare(
            String(
              b.name || ""
            )
          );
        }


        return (
          num(
            a.input,
            Infinity
          )
          -
          num(
            b.input,
            Infinity
          )
        );

      }
    );


    if(!rows.length){

      table.innerHTML=`
        <div class="provider-empty">
          No exact public provider route
          has been published for this model.
        </div>
      `;

      return;
    }


    table.innerHTML=`

      <table class="provider-table">

        <thead>

          <tr>

            <th>
              Provider
            </th>

            <th>
              Input /M
            </th>

            <th>
              Output /M
            </th>

            <th>
              Cache read /M
            </th>

            <th>
              Latency
            </th>

            <th>
              Throughput
            </th>

            <th>
              Uptime
            </th>

            <th>
              Link
            </th>

          </tr>

        </thead>


        <tbody>

          ${
            rows.map(
              row=>`

                <tr>

                  <td>

                    <div class="provider-identity">

                      <div class="provider-logo">
                        ${providerLogo(row)}
                      </div>


                      <div>

                        <div class="provider-name">
                          ${esc(row.name)}
                        </div>


                        <div class="provider-meta">
                          ${
                            row.quantization
                              ? (
                                  esc(
                                    row.quantization
                                  )
                                  +
                                  " · "
                                )
                              : ""
                          }

                          ${
                            esc(
                              row.telemetrySource
                              ||
                              row.sourceKind
                              ||
                              ""
                            )
                          }
                        </div>

                      </div>

                    </div>

                  </td>


                  <td class="provider-price">
                    ${
                      row.billing
                        ? esc(row.billing)
                        : rawOrMoney(
                            row,
                            "rawInput",
                            "input"
                          )
                    }
                  </td>


                  <td class="provider-price">
                    ${
                      row.billing
                        ? "Included"
                        : rawOrMoney(
                            row,
                            "rawOutput",
                            "output"
                          )
                    }
                  </td>


                  <td class="provider-price">
                    ${
                      row.billing
                        ? "Included"
                        : rawOrMoney(
                            row,
                            "rawCache",
                            "cacheRead"
                          )
                    }
                  </td>


                  <td>
                    ${
                      metric(
                        row.latencyP50,
                        value=>
                          Number(value)
                          .toFixed(2)
                          +
                          " s"
                      )
                    }
                  </td>


                  <td>
                    ${
                      metric(
                        row.throughputP50,
                        value=>
                          Number(value)
                          .toFixed(0)
                          +
                          " tps"
                      )
                    }
                  </td>


                  <td>
                    ${
                      metric(
                        row.uptime,
                        value=>
                          Number(value)
                          .toFixed(2)
                          +
                          "%"
                      )
                    }
                  </td>


                  <td>

                    ${
                      row.link
                        ? `
                          <a
                            class="pricing-link"
                            href="${esc(row.link)}"
                            target="_blank"
                            rel="noopener"
                          >
                            Open ↗
                          </a>
                        `
                        : "—"
                    }

                  </td>

                </tr>

              `
            )
            .join("")
          }

        </tbody>

      </table>
    `;

  }


  sortSelect
    ?.addEventListener(
      "change",
      renderProviders
    );


  quantSelect
    ?.addEventListener(
      "change",
      renderProviders
    );


  renderProviders();


  /* ======================================================
     REAL PROVIDER PRICE HISTORY
     ====================================================== */

  const chartTarget =
    document.getElementById(
      "providerChart"
    );


  let historyMetric =
    "input";


  const history =
    Array.isArray(
      entry.history
    )
      ? entry.history
      : [];


  function historyColor(index){

    const hue =
      (
        208
        +
        index*47
      )
      %
      360;

    return `hsl(${hue} 62% 48%)`;

  }


  function renderHistory(){

    if(!chartTarget){
      return;
    }


    if(history.length<2){

      chartTarget.innerHTML=`
        <div class="provider-chart-empty">
          Historical pricing needs at least
          two real provider sync snapshots.<br>
          No synthetic price history is generated.
        </div>
      `;

      return;
    }


    const latest =
      history[
        history.length-1
      ];


    const candidates =
      Object.entries(
        latest.providers
        ||
        {}
      )
      .filter(
        ([_,item])=>
          Number.isFinite(
            Number(
              item[
                historyMetric
              ]
            )
          )
      )
      .sort(
        (a,b)=>
          Number(
            a[1][historyMetric]
          )
          -
          Number(
            b[1][historyMetric]
          )
      )
      .slice(
        0,
        8
      );


    if(!candidates.length){

      chartTarget.innerHTML=`
        <div class="provider-chart-empty">
          No historical ${
            esc(historyMetric)
          } prices are available.
        </div>
      `;

      return;
    }


    const width=920;
    const height=330;

    const pad={
      left:62,
      right:24,
      top:25,
      bottom:52
    };


    const allValues=[];


    candidates.forEach(
      ([key])=>{

        history.forEach(
          snapshot=>{

            const value =
              snapshot
              .providers?.[
                key
              ]?.[
                historyMetric
              ];


            if(
              Number.isFinite(
                Number(value)
              )
            ){
              allValues.push(
                Number(value)
              );
            }

          }
        );

      }
    );


    if(!allValues.length){
      return;
    }


    let min =
      Math.min(
        ...allValues
      );

    let max =
      Math.max(
        ...allValues
      );


    if(min===max){
      min=Math.max(
        0,
        min*0.9
      );

      max=
        max*1.1
        +
        0.001;
    }


    const x =
      index=>
        pad.left
        +
        (
          index
          /
          Math.max(
            1,
            history.length-1
          )
        )
        *
        (
          width
          -
          pad.left
          -
          pad.right
        );


    const y =
      value=>
        pad.top
        +
        (
          max-value
        )
        /
        (
          max-min
        )
        *
        (
          height
          -
          pad.top
          -
          pad.bottom
        );


    const lines =
      candidates.map(
        ([key,item],index)=>{

          const points =
            history
            .map(
              (snapshot,i)=>{

                const value =
                  snapshot
                  .providers?.[
                    key
                  ]?.[
                    historyMetric
                  ];


                if(
                  !Number.isFinite(
                    Number(value)
                  )
                ){
                  return null;
                }


                return (
                  x(i)
                  +
                  ","
                  +
                  y(
                    Number(value)
                  )
                );

              }
            )
            .filter(Boolean)
            .join(" ");


          return `
            <polyline
              points="${points}"
              fill="none"
              stroke="${historyColor(index)}"
              stroke-width="2.3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          `;

        }
      )
      .join("");


    const grid = [0,1,2,3]
      .map(
        i=>{

          const value =
            max
            -
            (
              max-min
            )
            *
            i/3;

          const yy =
            y(value);


          return `
            <line
              x1="${pad.left}"
              x2="${width-pad.right}"
              y1="${yy}"
              y2="${yy}"
              stroke="#ecece8"
            />

            <text
              x="${pad.left-10}"
              y="${yy+4}"
              text-anchor="end"
              font-size="10"
              fill="#777"
            >
              ${money(value)}
            </text>
          `;

        }
      )
      .join("");


    const legend =
      candidates.map(
        ([_,item],index)=>`

          <span
            style="
              display:inline-flex;
              align-items:center;
              gap:5px;
              margin-right:12px;
              margin-top:7px;
              font-size:9px;
              color:#666;
            "
          >

            <span
              style="
                width:8px;
                height:8px;
                border-radius:50%;
                background:${historyColor(index)};
              "
            ></span>

            ${esc(item.name)}

          </span>

        `
      )
      .join("");


    const firstDate =
      new Date(
        history[0].at
      )
      .toLocaleDateString();


    const lastDate =
      new Date(
        history[
          history.length-1
        ].at
      )
      .toLocaleDateString();


    chartTarget.innerHTML=`

      <svg
        class="provider-chart"
        viewBox="0 0 ${width} ${height}"
        role="img"
        aria-label="Provider price history"
      >

        ${grid}

        ${lines}

        <text
          x="${pad.left}"
          y="${height-18}"
          font-size="10"
          fill="#777"
        >
          ${esc(firstDate)}
        </text>

        <text
          x="${width-pad.right}"
          y="${height-18}"
          text-anchor="end"
          font-size="10"
          fill="#777"
        >
          ${esc(lastDate)}
        </text>

      </svg>


      <div>
        ${legend}
      </div>
    `;

  }


  document
    .querySelectorAll(
      "[data-provider-metric]"
    )
    .forEach(
      button=>{

        button.addEventListener(
          "click",
          ()=>{

            document
              .querySelectorAll(
                "[data-provider-metric]"
              )
              .forEach(
                item=>
                  item.classList.remove(
                    "active"
                  )
              );


            button
              .classList.add(
                "active"
              );


            historyMetric =
              button.dataset
                .providerMetric;


            renderHistory();

          }
        );

      }
    );


  renderHistory();

})();

/* MODEL DETAIL BLOCK 4 */
/* NEPTUNE_RESEARCH_CARD_V1 */
(() => {
  const isNeptune =
    window.location.pathname.includes(
      "/number-of-calls/models/nex-coder-38-neptune/"
    );

  if(!isNeptune){
    return;
  }

  const section =
    document.getElementById(
      "neptuneResearchSection"
    );

  if(section){
    section.style.display = "block";
  }

  const actions =
    document.querySelector(
      ".action-row"
    );

  if(
    actions
    &&
    !actions.querySelector(
      "[data-neptune-research-link]"
    )
  ){
    const link =
      document.createElement(
        "a"
      );

    link.className = "action";
    link.dataset.neptuneResearchLink = "1";
    link.href =
      "/number-of-calls/models/nex-coder-38-neptune/research/degree-variance-independent-set/";
    link.textContent = "Research result";

    actions.appendChild(
      link
    );
  }
})();
