(() => {
  'use strict';


  const esc = value =>
    String(
      value ?? ''
    )
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');


  const num = value =>
    Number(
      value || 0
    );


  const hasScore = model =>
    Boolean(
      model
      &&
      model.score !== null
      &&
      model.score !== undefined
      &&
      model.score !== ''
      &&
      Number.isFinite(
        Number(
          model.score
        )
      )
    );


  const billion = value =>
    (
      num(value)
      /
      1e9
    )
    .toLocaleString(
      'en-US',
      {
        maximumFractionDigits:2
      }
    )
    +
    'B';


  const scoreText = model =>
    hasScore(model)
      ? String(model.score)
      : 'Not published';


  const deltaText = (
    model,
    base
  ) => {

    if(!hasScore(model)){
      return 'score not published';
    }


    const delta =
      Number(model.score)
      -
      Number(base);


    return (
      (delta>=0 ? '+' : '')
      +
      delta
      +
      ' from base'
    );

  };


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

    const map = {

      'google-translation-llm':
        'Google TLLM',

      'google-neural-machine-translation':
        'Google NMT',

      'hy-mt2-30b-a3b':
        'Hy-MT2-30B-A3B',

      'zorix-nexhate-1-preview-xhigh':
        'NexHate 1 (xhigh)',

      'zorix-nexhate-xhigh':
        'NexHate (xhigh)'

    };


    return (
      map[
        model.id
      ]
      ||
      model.name
    );

  };


  const sorted = data => {

    const models =
      [
        ...(
          data?.models
          ||
          []
        )
      ];


    const scored =
      models
      .filter(
        hasScore
      )
      .sort(
        (a,b)=>
          Number(b.score)
          -
          Number(a.score)
      );


    const requests =
      [...models]
      .sort(
        (a,b)=>
          num(b.requests5h)
          -
          num(a.requests5h)
      );


    return {

      models,

      scored,

      requests,

      base:
        num(
          data?.scoreBase
          ||
          1000
        )

    };

  };


  const brand = (
    width,
    title,
    subtitle
  ) => `

    <text
      x="44"
      y="49"
      fill="#111"
      font-family="OpenAI Sans,Arial,sans-serif"
      font-size="23"
      font-weight="700"
    >
      ${esc(title)}
    </text>

    <text
      x="44"
      y="75"
      fill="#6b6b67"
      font-family="OpenAI Sans,Arial,sans-serif"
      font-size="11"
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
      x="${width-80}"
      y="28"
      width="36"
      height="36"
    />

  `;


  function compact(data){

    const {
      requests,
      base
    } = sorted(data);


    const width =
      560;


    const rowHeight =
      78;


    const height =
      Math.max(
        488,
        154
        +
        requests.length
        *
        rowHeight
        +
        50
      );


    const rows =
      requests.map(
        (model,index)=>{

          const y =
            134
            +
            index
            *
            rowHeight;


          return `

            ${logo(
              model,
              44,
              y,
              36
            )}

            <text
              x="94"
              y="${y+15}"
              fill="#111"
              font-family="OpenAI Sans,Arial,sans-serif"
              font-size="13"
              font-weight="600"
            >
              ${esc(shortName(model))}
            </text>

            <text
              x="94"
              y="${y+35}"
              fill="#777"
              font-family="SF Mono,monospace"
              font-size="9"
            >
              ${esc(model.provider)}
            </text>

            <text
              x="516"
              y="${y+13}"
              text-anchor="end"
              fill="#111"
              font-family="SF Mono,monospace"
              font-size="13"
              font-weight="700"
            >
              ${billion(model.requests5h)} / 5h
            </text>

            <text
              x="516"
              y="${y+34}"
              text-anchor="end"
              fill="${hasScore(model) ? '#4e765a' : '#777'}"
              font-family="SF Mono,monospace"
              font-size="9"
            >
              ${
                hasScore(model)
                  ? (
                      'score '
                      +
                      model.score
                      +
                      ' · '
                      +
                      deltaText(
                        model,
                        base
                      )
                    )
                  : 'score not published'
              }
            </text>

            <line
              x1="44"
              y1="${y+58}"
              x2="516"
              y2="${y+58}"
              stroke="#e1e1dc"
            />

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
            'Published request observations and translation scores'
          )}

          ${rows}

          <text
            x="44"
            y="${height-25}"
            fill="#777"
            font-family="SF Mono,monospace"
            font-size="9"
          >
            REQUEST WINDOW: 5 HOURS · SCORE BASE: ${base}
          </text>

        </svg>
      `

    };

  }


  function dual(data){

    const {
      scored,
      requests,
      base
    } = sorted(data);


    const width =
      1200;


    const count =
      Math.max(
        scored.length,
        requests.length,
        1
      );


    const rowHeight =
      82;


    const height =
      Math.max(
        675,
        205
        +
        count
        *
        rowHeight
        +
        95
      );


    const leftX =
      62;


    const rightX =
      630;


    const cardTop =
      118;


    const cardBottom =
      height
      -
      72;


    const scoredRows =
      scored.map(
        (model,index)=>{

          const y =
            205
            +
            index
            *
            rowHeight;


          const delta =
            Math.max(
              0,
              Number(model.score)
              -
              base
            );


          const maxDelta =
            Math.max(
              1,
              ...scored.map(
                item=>
                  Number(item.score)
                  -
                  base
              )
            );


          const bar =
            delta
            /
            maxDelta
            *
            310;


          return `

            ${logo(
              model,
              leftX+10,
              y-22,
              34
            )}

            <text
              x="${leftX+55}"
              y="${y-5}"
              fill="#111"
              font-family="OpenAI Sans,Arial,sans-serif"
              font-size="13"
              font-weight="600"
            >
              ${esc(shortName(model))}
            </text>

            <rect
              x="${leftX+55}"
              y="${y+11}"
              width="310"
              height="8"
              rx="4"
              fill="#ecece8"
            />

            <rect
              x="${leftX+55}"
              y="${y+11}"
              width="${bar}"
              height="8"
              rx="4"
              fill="${esc(model.color || '#111')}"
            />

            <text
              x="${leftX+460}"
              y="${y+18}"
              text-anchor="end"
              fill="#111"
              font-family="SF Mono,monospace"
              font-size="13"
              font-weight="700"
            >
              ${model.score}
            </text>

            <text
              x="${leftX+460}"
              y="${y+37}"
              text-anchor="end"
              fill="#58725f"
              font-family="SF Mono,monospace"
              font-size="9"
            >
              ${deltaText(model,base)}
            </text>

          `;

        }
      )
      .join('');


    const requestRows =
      requests.map(
        (model,index)=>{

          const y =
            205
            +
            index
            *
            rowHeight;


          const maxRequests =
            Math.max(
              1,
              ...requests.map(
                item=>
                  num(item.requests5h)
              )
            );


          const bar =
            num(model.requests5h)
            /
            maxRequests
            *
            310;


          return `

            ${logo(
              model,
              rightX+10,
              y-22,
              34
            )}

            <text
              x="${rightX+55}"
              y="${y-5}"
              fill="#111"
              font-family="OpenAI Sans,Arial,sans-serif"
              font-size="13"
              font-weight="600"
            >
              ${esc(shortName(model))}
            </text>

            <rect
              x="${rightX+55}"
              y="${y+11}"
              width="310"
              height="8"
              rx="4"
              fill="#ecece8"
            />

            <rect
              x="${rightX+55}"
              y="${y+11}"
              width="${bar}"
              height="8"
              rx="4"
              fill="${esc(model.color || '#111')}"
            />

            <text
              x="${rightX+460}"
              y="${y+18}"
              text-anchor="end"
              fill="#111"
              font-family="SF Mono,monospace"
              font-size="13"
              font-weight="700"
            >
              ${billion(model.requests5h)}
            </text>

            <text
              x="${rightX+460}"
              y="${y+37}"
              text-anchor="end"
              fill="#777"
              font-family="SF Mono,monospace"
              font-size="9"
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
            'Score and request traffic are independent measurements'
          )}

          <rect
            x="42"
            y="${cardTop}"
            width="520"
            height="${cardBottom-cardTop}"
            rx="18"
            fill="#fff"
            stroke="#deded9"
          />

          <rect
            x="610"
            y="${cardTop}"
            width="548"
            height="${cardBottom-cardTop}"
            rx="18"
            fill="#fff"
            stroke="#deded9"
          />

          <text
            x="${leftX+10}"
            y="158"
            fill="#111"
            font-family="OpenAI Sans,Arial,sans-serif"
            font-size="18"
            font-weight="700"
          >
            Translation score
          </text>

          <text
            x="${leftX+10}"
            y="179"
            fill="#777"
            font-family="SF Mono,monospace"
            font-size="9"
          >
            published scores only · base ${base}
          </text>

          <text
            x="${rightX+10}"
            y="158"
            fill="#111"
            font-family="OpenAI Sans,Arial,sans-serif"
            font-size="18"
            font-weight="700"
          >
            Request load
          </text>

          <text
            x="${rightX+10}"
            y="179"
            fill="#777"
            font-family="SF Mono,monospace"
            font-size="9"
          >
            all published 5-hour observations
          </text>

          ${scoredRows}
          ${requestRows}

          <text
            x="42"
            y="${height-30}"
            fill="#777"
            font-family="SF Mono,monospace"
            font-size="9"
          >
            MODELS WITHOUT A PUBLISHED SCORE ARE NOT ASSIGNED A SYNTHETIC SCORE
          </text>

        </svg>
      `

    };

  }


  function baseline(data){

    const {
      scored,
      base
    } = sorted(data);


    const width =
      1200;


    const rowHeight =
      92;


    const height =
      Math.max(
        675,
        230
        +
        scored.length
        *
        rowHeight
        +
        110
      );


    const left =
      270;


    const right =
      1080;


    const maxScore =
      Math.max(
        base+12,
        ...scored.map(
          model=>
            Number(model.score)+2
        )
      );


    const scoreX = value =>
      left
      +
      (
        (
          Number(value)-base
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


    const rows =
      scored.map(
        (model,index)=>{

          const y =
            230
            +
            index
            *
            rowHeight;


          const x =
            scoreX(
              model.score
            );


          return `

            ${logo(
              model,
              54,
              y-22,
              36
            )}

            <text
              x="105"
              y="${y+5}"
              fill="#111"
              font-family="OpenAI Sans,Arial,sans-serif"
              font-size="14"
              font-weight="600"
            >
              ${esc(shortName(model))}
            </text>

            <line
              x1="${scoreX(base)}"
              y1="${y}"
              x2="${x}"
              y2="${y}"
              stroke="${esc(model.color || '#111')}"
              stroke-width="5"
              stroke-linecap="round"
            />

            <circle
              cx="${x}"
              cy="${y}"
              r="9"
              fill="${esc(model.color || '#111')}"
              stroke="#fff"
              stroke-width="3"
            />

            <text
              x="${x}"
              y="${y-20}"
              text-anchor="middle"
              fill="#111"
              font-family="SF Mono,monospace"
              font-size="13"
              font-weight="700"
            >
              ${model.score}
            </text>

            <text
              x="${right}"
              y="${y+5}"
              text-anchor="end"
              fill="#666"
              font-family="SF Mono,monospace"
              font-size="10"
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
            'Published scores against the 1000 reference'
          )}

          <line
            x1="${scoreX(base)}"
            y1="170"
            x2="${scoreX(base)}"
            y2="${height-95}"
            stroke="#111"
            stroke-width="2"
          />

          <text
            x="${scoreX(base)}"
            y="150"
            text-anchor="middle"
            fill="#111"
            font-family="SF Mono,monospace"
            font-size="10"
            font-weight="700"
          >
            BASE ${base}
          </text>

          ${rows}

          <text
            x="42"
            y="${height-34}"
            fill="#777"
            font-family="SF Mono,monospace"
            font-size="9"
          >
            UNSCORED MODELS OMITTED FROM SCORE AXIS
          </text>

        </svg>
      `

    };

  }


  function cards(data){

    const {
      requests,
      base
    } = sorted(data);


    const width =
      1200;


    const columns =
      2;


    const cardWidth =
      540;


    const cardHeight =
      250;


    const gapX =
      36;


    const gapY =
      24;


    const rowsCount =
      Math.ceil(
        requests.length
        /
        columns
      );


    const height =
      Math.max(
        675,
        130
        +
        rowsCount
        *
        (
          cardHeight
          +
          gapY
        )
        +
        60
      );


    const cards =
      requests.map(
        (model,index)=>{

          const column =
            index
            %
            columns;


          const row =
            Math.floor(
              index
              /
              columns
            );


          const x =
            42
            +
            column
            *
            (
              cardWidth
              +
              gapX
            );


          const y =
            118
            +
            row
            *
            (
              cardHeight
              +
              gapY
            );


          return `

            <rect
              x="${x}"
              y="${y}"
              width="${cardWidth}"
              height="${cardHeight}"
              rx="18"
              fill="#fff"
              stroke="#deded9"
            />

            ${logo(
              model,
              x+28,
              y+27,
              44
            )}

            <text
              x="${x+88}"
              y="${y+50}"
              fill="#111"
              font-family="OpenAI Sans,Arial,sans-serif"
              font-size="16"
              font-weight="700"
            >
              ${esc(shortName(model))}
            </text>

            <text
              x="${x+88}"
              y="${y+70}"
              fill="#777"
              font-family="SF Mono,monospace"
              font-size="9"
            >
              ${esc(model.provider)}
            </text>

            <text
              x="${x+28}"
              y="${y+123}"
              fill="#777"
              font-family="OpenAI Sans,Arial,sans-serif"
              font-size="10"
            >
              Translation score
            </text>

            <text
              x="${x+28}"
              y="${y+157}"
              fill="#111"
              font-family="SF Mono,monospace"
              font-size="${hasScore(model) ? 25 : 15}"
              font-weight="700"
            >
              ${esc(scoreText(model))}
            </text>

            <text
              x="${x+512}"
              y="${y+123}"
              text-anchor="end"
              fill="#777"
              font-family="OpenAI Sans,Arial,sans-serif"
              font-size="10"
            >
              Requests / 5h
            </text>

            <text
              x="${x+512}"
              y="${y+157}"
              text-anchor="end"
              fill="#111"
              font-family="SF Mono,monospace"
              font-size="25"
              font-weight="700"
            >
              ${billion(model.requests5h)}
            </text>

            <line
              x1="${x+28}"
              y1="${y+183}"
              x2="${x+512}"
              y2="${y+183}"
              stroke="#e1e1dc"
            />

            <text
              x="${x+28}"
              y="${y+216}"
              fill="#777"
              font-family="SF Mono,monospace"
              font-size="9"
            >
              ${
                hasScore(model)
                  ? (
                      'score rank #'
                      +
                      model.scoreRank
                      +
                      ' · '
                      +
                      deltaText(
                        model,
                        base
                      )
                    )
                  : 'score rank not published'
              }
            </text>

            <text
              x="${x+512}"
              y="${y+216}"
              text-anchor="end"
              fill="#777"
              font-family="SF Mono,monospace"
              font-size="9"
            >
              request rank #${model.requestRank}
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
            'Current published score and request observations'
          )}

          ${cards}

          <text
            x="42"
            y="${height-26}"
            fill="#777"
            font-family="SF Mono,monospace"
            font-size="9"
          >
            SCORE BASE ${base} · REQUEST WINDOW 5 HOURS
          </text>

        </svg>
      `

    };

  }


  function scatter(data){

    const {
      scored,
      base
    } = sorted(data);


    const width =
      1200;


    const height =
      675;


    const left =
      120;


    const right =
      1090;


    const top =
      150;


    const bottom =
      515;


    const maxRequests =
      Math.max(
        1,
        ...scored.map(
          model=>
            num(model.requests5h)
        )
      )
      *
      1.12;


    const maxScore =
      Math.max(
        base+12,
        ...scored.map(
          model=>
            Number(model.score)+2
        )
      );


    const x = value =>
      left
      +
      (
        num(value)
        /
        maxRequests
      )
      *
      (
        right-left
      );


    const y = value =>
      bottom
      -
      (
        (
          Number(value)-base
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


    const points =
      scored.map(
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
              r="23"
              fill="#fff"
              stroke="${esc(model.color || '#111')}"
              stroke-width="3"
            />

            ${logo(
              model,
              px-14,
              py-14,
              28
            )}

            <text
              x="${px}"
              y="${py+45}"
              text-anchor="middle"
              fill="#111"
              font-family="OpenAI Sans,Arial,sans-serif"
              font-size="11"
              font-weight="600"
            >
              ${esc(shortName(model))}
            </text>

            <text
              x="${px}"
              y="${py+62}"
              text-anchor="middle"
              fill="#666"
              font-family="SF Mono,monospace"
              font-size="9"
            >
              ${model.score} · ${billion(model.requests5h)}
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
            'Only models with both published measurements are plotted'
          )}

          <line
            x1="${left}"
            y1="${bottom}"
            x2="${right}"
            y2="${bottom}"
            stroke="#111"
          />

          <line
            x1="${left}"
            y1="${top}"
            x2="${left}"
            y2="${bottom}"
            stroke="#111"
          />

          <line
            x1="${left}"
            y1="${y(base)}"
            x2="${right}"
            y2="${y(base)}"
            stroke="#d8d8d3"
            stroke-dasharray="4 6"
          />

          <text
            x="${left-14}"
            y="${y(base)+4}"
            text-anchor="end"
            fill="#666"
            font-family="SF Mono,monospace"
            font-size="9"
          >
            ${base}
          </text>

          ${points}

          <text
            x="${(left+right)/2}"
            y="596"
            text-anchor="middle"
            fill="#111"
            font-family="OpenAI Sans,Arial,sans-serif"
            font-size="12"
          >
            Requests per 5 hours
          </text>

          <text
            x="39"
            y="${(top+bottom)/2}"
            text-anchor="middle"
            transform="rotate(-90 39 ${(top+bottom)/2})"
            fill="#111"
            font-family="OpenAI Sans,Arial,sans-serif"
            font-size="12"
          >
            Translation score
          </text>

          <text
            x="42"
            y="643"
            fill="#777"
            font-family="SF Mono,monospace"
            font-size="9"
          >
            UNSCORED MODELS OMITTED · NO SCORE IS SYNTHESIZED FROM REQUEST VOLUME
          </text>

        </svg>
      `

    };

  }


  const BUILDERS = {

    compact,

    dual,

    baseline,

    cards,

    scatter

  };


  window.ZORIX_TRANSLATE_SVG = {

    styles:[
      {
        id:
          'compact',
        name:
          'Compact'
      },
      {
        id:
          'dual',
        name:
          'Dual metric'
      },
      {
        id:
          'baseline',
        name:
          '1000 baseline'
      },
      {
        id:
          'cards',
        name:
          'Model cards'
      },
      {
        id:
          'scatter',
        name:
          'Requests × score'
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
