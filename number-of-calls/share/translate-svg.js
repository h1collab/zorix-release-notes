(() => {
  'use strict';

  const esc = value =>
    String(value ?? '')
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;');

  const number = value =>
    Number(value || 0);

  const billion = value =>
    (
      number(value) / 1e9
    )
    .toLocaleString(
      'en-US',
      {
        maximumFractionDigits:2
      }
    )
    +
    'B';

  const logoUrl = model => {
    if(!model?.logo){
      return '';
    }

    try{
      return new URL(
        model.logo,
        location.origin
      ).href;
    }catch(error){
      return model.logo;
    }
  };

  const logo = (
    model,
    x,
    y,
    size
  ) => {
    const href =
      logoUrl(model);

    if(!href){
      return '';
    }

    return `
      <image
        href="${esc(href)}"
        x="${x}"
        y="${y}"
        width="${size}"
        height="${size}"
        preserveAspectRatio="xMidYMid meet"
      />
    `;
  };

  const shortName = model => {
    if(
      model.id ===
      'google-translation-llm'
    ){
      return 'Google TLLM';
    }

    if(
      model.id ===
      'zorix-nexhate-1-preview-xhigh'
    ){
      return 'NexHate 1 (xhigh)';
    }

    return model.name;
  };

  const sorted = data => {
    const models =
      [...(
        data?.models || []
      )];

    return {
      models,

      base:
        number(
          data?.scoreBase || 1000
        ),

      score:
        [...models]
        .sort(
          (a,b)=>
            number(b.score)
            -
            number(a.score)
        ),

      requests:
        [...models]
        .sort(
          (a,b)=>
            number(b.requests5h)
            -
            number(a.requests5h)
        )
    };
  };

  const brand = (
    width,
    title,
    subtitle=''
  ) => `
    <text
      x="42"
      y="50"
      fill="#111"
      font-family="OpenAI Sans, Arial, sans-serif"
      font-size="24"
      font-weight="700"
    >
      ${esc(title)}
    </text>

    <text
      x="42"
      y="78"
      fill="#6b6b67"
      font-family="OpenAI Sans, Arial, sans-serif"
      font-size="12"
    >
      ${esc(subtitle)}
    </text>

    <image
      href="${esc(
        new URL(
          '/number-of-calls/assets/logos/zorix.svg',
          location.origin
        ).href
      )}"
      x="${width-82}"
      y="30"
      width="38"
      height="38"
    />
  `;


  function compact(data){

    const {
      score,
      base
    } = sorted(data);

    const width=424;
    const height=488;

    const maxScore =
      Math.max(
        base+1,
        ...score.map(
          model=>
            number(model.score)
        )
      );

    const scaleMax =
      Math.max(
        base+12,
        maxScore+2
      );

    const startX=68;
    const endX=366;

    const scoreX = value =>
      startX
      +
      (
        (
          number(value)-base
        )
        /
        (
          scaleMax-base
        )
      )
      *
      (
        endX-startX
      );

    const rows =
      score.map(
        (model,index)=>{

          const y =
            177
            +
            index*112;

          const x =
            scoreX(
              model.score
            );

          return `
            ${logo(
              model,
              42,
              y-25,
              38
            )}

            <text
              x="91"
              y="${y-7}"
              fill="#111"
              font-family="OpenAI Sans, Arial, sans-serif"
              font-size="14"
              font-weight="600"
            >
              ${esc(shortName(model))}
            </text>

            <text
              x="91"
              y="${y+13}"
              fill="#777"
              font-family="SF Mono, monospace"
              font-size="10"
            >
              ${esc(model.provider)}
            </text>

            <line
              x1="${startX}"
              y1="${y+48}"
              x2="${endX}"
              y2="${y+48}"
              stroke="#e1e1dc"
              stroke-width="2"
            />

            <line
              x1="${startX}"
              y1="${y+48}"
              x2="${x}"
              y2="${y+48}"
              stroke="${esc(model.color)}"
              stroke-width="4"
              stroke-linecap="round"
            />

            <circle
              cx="${x}"
              cy="${y+48}"
              r="6"
              fill="${esc(model.color)}"
            />

            <text
              x="${endX}"
              y="${y-8}"
              text-anchor="end"
              fill="#111"
              font-family="SF Mono, monospace"
              font-size="15"
              font-weight="700"
            >
              ${number(model.score)}
            </text>

            <text
              x="${endX}"
              y="${y+13}"
              text-anchor="end"
              fill="#4e765a"
              font-family="SF Mono, monospace"
              font-size="10"
            >
              +${number(model.score)-base} from base
            </text>

            <text
              x="${endX}"
              y="${y+35}"
              text-anchor="end"
              fill="#666"
              font-family="SF Mono, monospace"
              font-size="10"
            >
              ${billion(model.requests5h)} requests / 5h
            </text>
          `;
        }
      )
      .join('');

    return {
      width,
      height,
      filename:
        'zorix-translation-compact',

      title:
        'Translation comparison · Compact',

      svg:`
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="${width}"
          height="${height}"
          viewBox="0 0 ${width} ${height}"
        >

          <rect
            width="${width}"
            height="${height}"
            fill="#fff"
          />

          ${brand(
            width,
            'Translation Comparison',
            '1000-base score · requests per 5-hour window'
          )}

          <line
            x1="${startX}"
            y1="126"
            x2="${endX}"
            y2="126"
            stroke="#111"
          />

          <text
            x="${startX}"
            y="117"
            fill="#555"
            font-family="SF Mono, monospace"
            font-size="10"
          >
            1000 base
          </text>

          <text
            x="${endX}"
            y="117"
            text-anchor="end"
            fill="#555"
            font-family="SF Mono, monospace"
            font-size="10"
          >
            ${scaleMax}
          </text>

          ${rows}

          <text
            x="42"
            y="462"
            fill="#777"
            font-family="SF Mono, monospace"
            font-size="9"
          >
            ZORIX METRON · TRANSLATION SNAPSHOT
          </text>

        </svg>
      `
    };
  }


  function dual(data){

    const {
      score,
      requests,
      base
    } = sorted(data);

    const width=1200;
    const height=675;

    const maxDelta =
      Math.max(
        1,
        ...score.map(
          model=>
            number(model.score)-base
        )
      );

    const maxRequests =
      Math.max(
        1,
        ...requests.map(
          model=>
            number(model.requests5h)
        )
      );

    const scoreRows =
      score.map(
        (model,index)=>{

          const y =
            230
            +
            index*150;

          const bar =
            (
              (
                number(model.score)-base
              )
              /
              maxDelta
            )
            *
            350;

          return `
            ${logo(
              model,
              70,
              y-28,
              44
            )}

            <text
              x="130"
              y="${y-4}"
              fill="#111"
              font-family="OpenAI Sans, Arial, sans-serif"
              font-size="17"
              font-weight="600"
            >
              ${esc(shortName(model))}
            </text>

            <rect
              x="130"
              y="${y+22}"
              width="350"
              height="13"
              rx="7"
              fill="#ecece8"
            />

            <rect
              x="130"
              y="${y+22}"
              width="${bar}"
              height="13"
              rx="7"
              fill="${esc(model.color)}"
            />

            <text
              x="500"
              y="${y+33}"
              fill="#111"
              text-anchor="end"
              font-family="SF Mono, monospace"
              font-size="17"
              font-weight="700"
            >
              ${number(model.score)}
            </text>

            <text
              x="500"
              y="${y+55}"
              fill="#58725f"
              text-anchor="end"
              font-family="SF Mono, monospace"
              font-size="10"
            >
              +${number(model.score)-base}
            </text>
          `;
        }
      )
      .join('');

    const requestRows =
      requests.map(
        (model,index)=>{

          const y =
            230
            +
            index*150;

          const bar =
            (
              number(model.requests5h)
              /
              maxRequests
            )
            *
            350;

          return `
            ${logo(
              model,
              650,
              y-28,
              44
            )}

            <text
              x="710"
              y="${y-4}"
              fill="#111"
              font-family="OpenAI Sans, Arial, sans-serif"
              font-size="17"
              font-weight="600"
            >
              ${esc(shortName(model))}
            </text>

            <rect
              x="710"
              y="${y+22}"
              width="350"
              height="13"
              rx="7"
              fill="#ecece8"
            />

            <rect
              x="710"
              y="${y+22}"
              width="${bar}"
              height="13"
              rx="7"
              fill="${esc(model.color)}"
            />

            <text
              x="1080"
              y="${y+33}"
              fill="#111"
              text-anchor="end"
              font-family="SF Mono, monospace"
              font-size="17"
              font-weight="700"
            >
              ${billion(model.requests5h)}
            </text>

            <text
              x="1080"
              y="${y+55}"
              fill="#777"
              text-anchor="end"
              font-family="SF Mono, monospace"
              font-size="10"
            >
              requests / 5h
            </text>
          `;
        }
      )
      .join('');

    return {
      width,
      height,
      filename:
        'zorix-translation-dual-metric',

      title:
        'Translation comparison · Dual metric',

      svg:`
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="${width}"
          height="${height}"
          viewBox="0 0 ${width} ${height}"
        >

          <rect
            width="${width}"
            height="${height}"
            fill="#faf9f6"
          />

          ${brand(
            width,
            'Translation Model Comparison',
            'Score and request traffic remain separate metrics'
          )}

          <rect
            x="42"
            y="122"
            width="520"
            height="460"
            rx="18"
            fill="#fff"
            stroke="#deded9"
          />

          <rect
            x="622"
            y="122"
            width="536"
            height="460"
            rx="18"
            fill="#fff"
            stroke="#deded9"
          />

          <text
            x="70"
            y="168"
            font-family="OpenAI Sans, Arial, sans-serif"
            font-size="20"
            font-weight="700"
            fill="#111"
          >
            Translation score
          </text>

          <text
            x="650"
            y="168"
            font-family="OpenAI Sans, Arial, sans-serif"
            font-size="20"
            font-weight="700"
            fill="#111"
          >
            Request load
          </text>

          <text
            x="70"
            y="192"
            font-family="SF Mono, monospace"
            font-size="10"
            fill="#777"
          >
            1000-base
          </text>

          <text
            x="650"
            y="192"
            font-family="SF Mono, monospace"
            font-size="10"
            fill="#777"
          >
            requests per 5 hours
          </text>

          ${scoreRows}
          ${requestRows}

          <text
            x="42"
            y="635"
            fill="#777"
            font-family="SF Mono, monospace"
            font-size="10"
          >
            SCORE LEADER AND REQUEST LEADER MAY DIFFER
          </text>

        </svg>
      `
    };
  }


  function baseline(data){

    const {
      score,
      base
    } = sorted(data);

    const width=1200;
    const height=675;

    const maxScore =
      Math.max(
        base+12,
        ...score.map(
          model=>
            number(model.score)+2
        )
      );

    const left=210;
    const right=1090;
    const top=190;
    const bottom=520;

    const x = value =>
      left
      +
      (
        (
          number(value)-base
        )
        /
        (
          maxScore-base
        )
      )
      *
      (
        right-left
      );

    const ticks =
      Array.from(
        {
          length:
            maxScore-base+1
        },
        (_,i)=>
          base+i
      )
      .filter(
        (_,i)=>
          i%2===0
      )
      .map(
        value=>`
          <line
            x1="${x(value)}"
            y1="${top}"
            x2="${x(value)}"
            y2="${bottom}"
            stroke="#ecece8"
          />
          <text
            x="${x(value)}"
            y="${bottom+31}"
            text-anchor="middle"
            font-family="SF Mono, monospace"
            font-size="10"
            fill="#666"
          >
            ${value}
          </text>
        `
      )
      .join('');

    const rows =
      score.map(
        (model,index)=>{

          const y =
            280
            +
            index*135;

          const pointX =
            x(
              model.score
            );

          return `
            ${logo(
              model,
              72,
              y-25,
              42
            )}

            <text
              x="128"
              y="${y+5}"
              fill="#111"
              font-family="OpenAI Sans, Arial, sans-serif"
              font-size="16"
              font-weight="600"
            >
              ${esc(shortName(model))}
            </text>

            <line
              x1="${x(base)}"
              y1="${y}"
              x2="${pointX}"
              y2="${y}"
              stroke="${esc(model.color)}"
              stroke-width="5"
              stroke-linecap="round"
            />

            <circle
              cx="${pointX}"
              cy="${y}"
              r="10"
              fill="${esc(model.color)}"
              stroke="#fff"
              stroke-width="3"
            />

            <text
              x="${pointX}"
              y="${y-22}"
              text-anchor="middle"
              fill="#111"
              font-family="SF Mono, monospace"
              font-size="15"
              font-weight="700"
            >
              ${number(model.score)}
            </text>

            <text
              x="${pointX}"
              y="${y+30}"
              text-anchor="middle"
              fill="#58725f"
              font-family="SF Mono, monospace"
              font-size="10"
            >
              +${number(model.score)-base}
            </text>

            <text
              x="1090"
              y="${y+5}"
              text-anchor="end"
              fill="#666"
              font-family="SF Mono, monospace"
              font-size="11"
            >
              ${billion(model.requests5h)} / 5h
            </text>
          `;
        }
      )
      .join('');

    return {
      width,
      height,
      filename:
        'zorix-translation-baseline',

      title:
        'Translation comparison · 1000 baseline',

      svg:`
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="${width}"
          height="${height}"
          viewBox="0 0 ${width} ${height}"
        >

          <rect
            width="${width}"
            height="${height}"
            fill="#fff"
          />

          ${brand(
            width,
            'Translation Score Baseline',
            'Every published translation score is shown against the 1000 reference'
          )}

          <line
            x1="${x(base)}"
            y1="${top}"
            x2="${x(base)}"
            y2="${bottom}"
            stroke="#111"
            stroke-width="2"
          />

          ${ticks}
          ${rows}

          <text
            x="${x(base)}"
            y="${top-20}"
            text-anchor="middle"
            fill="#111"
            font-family="SF Mono, monospace"
            font-size="11"
            font-weight="700"
          >
            BASE 1000
          </text>

          <text
            x="42"
            y="628"
            fill="#777"
            font-family="SF Mono, monospace"
            font-size="10"
          >
            NO SYNTHETIC HISTORY · CURRENT PUBLISHED SNAPSHOT ONLY
          </text>

        </svg>
      `
    };
  }


  function cards(data){

    const {
      models,
      base
    } = sorted(data);

    const width=1200;
    const height=675;

    const cards =
      models.map(
        (model,index)=>{

          const x =
            index===0
              ? 42
              : 618;

          return `
            <rect
              x="${x}"
              y="142"
              width="540"
              height="430"
              rx="22"
              fill="#fff"
              stroke="#deded9"
            />

            ${logo(
              model,
              x+34,
              181,
              62
            )}

            <text
              x="${x+116}"
              y="208"
              fill="#111"
              font-family="OpenAI Sans, Arial, sans-serif"
              font-size="21"
              font-weight="700"
            >
              ${esc(shortName(model))}
            </text>

            <text
              x="${x+116}"
              y="234"
              fill="#777"
              font-family="SF Mono, monospace"
              font-size="11"
            >
              ${esc(model.provider)} · ${esc(model.status)}
            </text>

            <text
              x="${x+34}"
              y="332"
              fill="#111"
              font-family="OpenAI Sans, Arial, sans-serif"
              font-size="13"
            >
              Translation score
            </text>

            <text
              x="${x+34}"
              y="394"
              fill="#111"
              font-family="OpenAI Sans, Arial, sans-serif"
              font-size="58"
              font-weight="600"
            >
              ${number(model.score)}
            </text>

            <text
              x="${x+182}"
              y="394"
              fill="#58725f"
              font-family="SF Mono, monospace"
              font-size="13"
            >
              +${number(model.score)-base}
            </text>

            <line
              x1="${x+34}"
              y1="428"
              x2="${x+506}"
              y2="428"
              stroke="#e1e1dc"
            />

            <text
              x="${x+34}"
              y="474"
              fill="#777"
              font-family="OpenAI Sans, Arial, sans-serif"
              font-size="12"
            >
              Requests / 5h
            </text>

            <text
              x="${x+506}"
              y="474"
              text-anchor="end"
              fill="#111"
              font-family="SF Mono, monospace"
              font-size="22"
              font-weight="700"
            >
              ${billion(model.requests5h)}
            </text>

            <text
              x="${x+34}"
              y="520"
              fill="#777"
              font-family="OpenAI Sans, Arial, sans-serif"
              font-size="12"
            >
              Score rank
            </text>

            <text
              x="${x+185}"
              y="520"
              fill="#111"
              font-family="SF Mono, monospace"
              font-size="15"
              font-weight="700"
            >
              #${number(model.scoreRank)}
            </text>

            <text
              x="${x+300}"
              y="520"
              fill="#777"
              font-family="OpenAI Sans, Arial, sans-serif"
              font-size="12"
            >
              Request rank
            </text>

            <text
              x="${x+506}"
              y="520"
              text-anchor="end"
              fill="#111"
              font-family="SF Mono, monospace"
              font-size="15"
              font-weight="700"
            >
              #${number(model.requestRank)}
            </text>
          `;
        }
      )
      .join('');

    return {
      width,
      height,
      filename:
        'zorix-translation-cards',

      title:
        'Translation comparison · Cards',

      svg:`
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="${width}"
          height="${height}"
          viewBox="0 0 ${width} ${height}"
        >

          <rect
            width="${width}"
            height="${height}"
            fill="#faf9f6"
          />

          ${brand(
            width,
            'Translation Model Cards',
            'Direct score and request comparison'
          )}

          ${cards}

          <text
            x="42"
            y="632"
            fill="#777"
            font-family="SF Mono, monospace"
            font-size="10"
          >
            SCORE BASE ${base} · REQUEST WINDOW 5 HOURS
          </text>

        </svg>
      `
    };
  }


  function scatter(data){

    const {
      models,
      base
    } = sorted(data);

    const width=1200;
    const height=675;

    const left=120;
    const right=1100;
    const top=155;
    const bottom=535;

    const maxRequests =
      Math.max(
        1,
        ...models.map(
          model=>
            number(model.requests5h)
            /
            1e9
        )
      )
      *
      1.16;

    const maxScore =
      Math.max(
        base+12,
        ...models.map(
          model=>
            number(model.score)+2
        )
      );

    const x = requests =>
      left
      +
      (
        (
          number(requests)/1e9
        )
        /
        maxRequests
      )
      *
      (
        right-left
      );

    const y = score =>
      bottom
      -
      (
        (
          number(score)-base
        )
        /
        (
          maxScore-base
        )
      )
      *
      (
        bottom-top
      );

    const gridX =
      [0,2,4,6,8]
      .filter(
        value=>
          value<=maxRequests
      )
      .map(
        value=>`
          <line
            x1="${x(value*1e9)}"
            y1="${top}"
            x2="${x(value*1e9)}"
            y2="${bottom}"
            stroke="#ecece8"
          />

          <text
            x="${x(value*1e9)}"
            y="${bottom+30}"
            text-anchor="middle"
            fill="#666"
            font-family="SF Mono, monospace"
            font-size="10"
          >
            ${value}B
          </text>
        `
      )
      .join('');

    const gridY =
      [1000,1002,1004,1006,1008,1010,1012]
      .filter(
        value=>
          value<=maxScore
      )
      .map(
        value=>`
          <line
            x1="${left}"
            y1="${y(value)}"
            x2="${right}"
            y2="${y(value)}"
            stroke="${
              value===base
                ? '#111'
                : '#ecece8'
            }"
            stroke-width="${
              value===base
                ? 2
                : 1
            }"
          />

          <text
            x="${left-14}"
            y="${y(value)+4}"
            text-anchor="end"
            fill="#666"
            font-family="SF Mono, monospace"
            font-size="10"
          >
            ${value}
          </text>
        `
      )
      .join('');

    const points =
      models.map(
        model=>{

          const px =
            x(
              model.requests5h
            );

          const py =
            y(
              model.score
            );

          return `
            <circle
              cx="${px}"
              cy="${py}"
              r="24"
              fill="#fff"
              stroke="${esc(model.color)}"
              stroke-width="3"
            />

            ${logo(
              model,
              px-15,
              py-15,
              30
            )}

            <text
              x="${px}"
              y="${py+47}"
              text-anchor="middle"
              fill="#111"
              font-family="OpenAI Sans, Arial, sans-serif"
              font-size="13"
              font-weight="600"
            >
              ${esc(shortName(model))}
            </text>

            <text
              x="${px}"
              y="${py+65}"
              text-anchor="middle"
              fill="#666"
              font-family="SF Mono, monospace"
              font-size="10"
            >
              ${number(model.score)} · ${billion(model.requests5h)}
            </text>
          `;
        }
      )
      .join('');

    return {
      width,
      height,
      filename:
        'zorix-translation-scatter',

      title:
        'Translation comparison · Scatter',

      svg:`
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="${width}"
          height="${height}"
          viewBox="0 0 ${width} ${height}"
        >

          <rect
            width="${width}"
            height="${height}"
            fill="#fff"
          />

          ${brand(
            width,
            'Translation Requests × Score',
            'Request traffic and translation score shown as independent axes'
          )}

          ${gridX}
          ${gridY}
          ${points}

          <text
            x="${(left+right)/2}"
            y="612"
            text-anchor="middle"
            fill="#111"
            font-family="OpenAI Sans, Arial, sans-serif"
            font-size="14"
          >
            Requests per 5 hours
          </text>

          <text
            x="38"
            y="${(top+bottom)/2}"
            text-anchor="middle"
            transform="rotate(-90 38 ${(top+bottom)/2})"
            fill="#111"
            font-family="OpenAI Sans, Arial, sans-serif"
            font-size="14"
          >
            Translation score
          </text>

          <text
            x="42"
            y="645"
            fill="#777"
            font-family="SF Mono, monospace"
            font-size="10"
          >
            1000-BASE SCORE · NO IMPLIED CAUSAL RELATIONSHIP BETWEEN TRAFFIC AND QUALITY
          </text>

        </svg>
      `
    };
  }


  const BUILDERS={
    compact,
    dual,
    baseline,
    cards,
    scatter
  };


  window.ZORIX_TRANSLATE_SVG = {

    styles:[
      {
        id:'compact',
        name:'Compact · 424 × 488'
      },
      {
        id:'dual',
        name:'Dual metric · 1200 × 675'
      },
      {
        id:'baseline',
        name:'1000 baseline · 1200 × 675'
      },
      {
        id:'cards',
        name:'Model cards · 1200 × 675'
      },
      {
        id:'scatter',
        name:'Requests × score · 1200 × 675'
      }
    ],


    build(
      style,
      data
    ){

      const builder =
        BUILDERS[
          style
        ]
        ||
        BUILDERS.dual;

      return builder(
        data
      );

    }

  };

})();
