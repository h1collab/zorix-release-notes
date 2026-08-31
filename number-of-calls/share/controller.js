(() => {
  'use strict';

  const $ = id =>
    document.getElementById(id);

  const canvas =
    $('chartCanvas');

  const report =
    $('reportType');

  const metric =
    $('metricSelect');

  const count =
    $('modelCountSelect');

  const trendScale =
    $('trendScale');

  const trendControls =
    $('trendControls');

  const landscapeControls =
    $('landscapeControls');

  const landscapeX =
    $('landscapeX');

  const landscapeY =
    $('landscapeY');

  const downloadButton =
    $('downloadButton');

  const svgButton =
    $('downloadCodingSvgButton');

  const codingPngButton =
    $('downloadCodingPngButton');

  const codingPreview =
    $('codingBenchmarkSvgPreview');

  const codingHost =
    $('codingBenchmarkSvgHost');

  const svgStyleControls =
    $('svgStyleControls');

  const svgStyle =
    $('svgStyle');

  const translateSvgButton =
    $('downloadTranslateSvgButton');

  const translatePngButton =
    $('downloadTranslatePngButton');


  const status =
    $('shareDataStatus');

  const previewMeta =
    $('previewMeta');

  const previewTitle =
    document.querySelector(
      '.preview-title'
    );

  const controls =
    document.querySelector(
      '.controls'
    );

  const metricGroup =
    metric?.closest(
      '.control-group'
    );

  const countGroup =
    count?.closest(
      '.control-group'
    );


  if(
    !canvas ||
    !report ||
    !metric ||
    !count
  ){
    return;
  }


  const ctx =
    canvas.getContext(
      '2d'
    );


  const W=1600;
  const H=900;

  canvas.width=W;
  canvas.height=H;


  /* ========================================================
     DATA
     ======================================================== */

  const DATA={

    models:
      Array.isArray(
        window.ZORIX_MODEL_DETAILS
      )
        ? window.ZORIX_MODEL_DETAILS
        : [],

    usage:
      window.ZORIX_CODE_USAGE
      ||
      {
        models:[],
        daily:[]
      },

    votes:
      window.ZORIX_COMMUNITY_VOTES
      ||
      {
        models:[],
        history:[]
      },

    bench:
      window.ZORIX_BENCHMARKS
      ||
      {
        metrics:[],
        scores:{},
        meta:{}
      },

    requests:
      window.ZORIX_REQUEST_USAGE
      ||
      {
        models:[]
      },

    image:
      window.ZORIX_IMAGE_AI
      ||
      {
        models:[]
      },

    intel:
      window.ZORIX_INTELLIGENCE_COST
      ||
      {
        points:[]
      },

    translate:
      window.ZORIX_TRANSLATE
      ||
      {
        models:[],
        scoreBase:1000,
        requestWindowHours:5
      }


  };


  const providerColors={

    Zorix:'#7446c8',
    OpenAI:'#111111',
    Anthropic:'#a45a1b',
    Google:'#377fc1',
    'Z.ai':'#387dc0',
    DeepSeek:'#2552b5',
    'Moonshot AI':'#118f87',
    Kimi:'#118f87',
    Tencent:'#00a7ce',
    Xiaomi:'#ff6900',
    Meta:'#087aea',
    NVIDIA:'#74b71b',
    'Microsoft AI':'#5b5fc7',
    Reve:'#6546d7',
    xAI:'#111111'

  };


  const providerLogos={

    Zorix:
      '/number-of-calls/assets/logos/zorix.svg',

    OpenAI:
      '/number-of-calls/assets/logos/openai.svg',

    Anthropic:
      '/number-of-calls/assets/logos/anthropic.svg',

    Google:
      '/number-of-calls/assets/logos/google.svg',

    'Z.ai':
      '/number-of-calls/assets/logos/glm.svg',

    DeepSeek:
      '/number-of-calls/assets/logos/deepseek.svg',

    'Moonshot AI':
      '/number-of-calls/assets/logos/kimi.svg',

    Kimi:
      '/number-of-calls/assets/logos/kimi.svg',

    Tencent:
      '/number-of-calls/assets/logos/hunyuan.svg',

    Xiaomi:
      '/number-of-calls/assets/logos/mimo.svg',

    Meta:
      '/number-of-calls/assets/logos/meta.svg',

    NVIDIA:
      '/number-of-calls/assets/logos/nvidia.svg'

  };


  const canon =
    id=>
      String(
        id || ''
      )
      .replace(
        /^nvidia-nemotron-3-ultra$/,
        'nemotron-3-ultra'
      );


  const norm =
    value=>
      String(
        value || ''
      )
      .toLowerCase()
      .replace(
        /[^a-z0-9]+/g,
        ' '
      )
      .trim();


  function compact(value){

    const n =
      Number(
        value || 0
      );


    for(
      const [size,suffix]
      of [
        [1e15,'P'],
        [1e12,'T'],
        [1e9,'B'],
        [1e6,'M'],
        [1e3,'K']
      ]
    ){

      if(
        Math.abs(n)
        >=
        size
      ){

        const ratio=
          Math.abs(
            n/size
          );


        const digits=
          ratio>=100
            ? 0
            : ratio>=10
              ? 1
              : 2;


        return (
          (n/size)
          .toFixed(
            digits
          )
          .replace(
            /\.0+$|(\.\d*[1-9])0+$/,
            '$1'
          )
          +
          suffix
        );

      }

    }


    return Math.round(
      n
    )
    .toLocaleString(
      'en-US'
    );

  }


  function clip(
    value,
    max=34
  ){

    const text=
      String(
        value || ''
      );


    return (
      text.length>max
        ? (
            text.slice(
              0,
              max-1
            )
            +
            '…'
          )
        : text
    );

  }


  /* ========================================================
     MODEL MAPS
     ======================================================== */

  const modelById=
    new Map();


  const modelByName=
    new Map();


  DATA.models.forEach(
    model=>{

      modelById.set(
        canon(
          model.id
        ),
        model
      );


      modelByName.set(
        norm(
          model.name
        ),
        model
      );

    }
  );


  function modelFor(
    id,
    name=''
  ){

    return (
      modelById.get(
        canon(id)
      )
      ||
      modelByName.get(
        norm(name)
      )
      ||
      null
    );

  }


  function modelLogo(
    id,
    fallbackName='',
    fallbackProvider=''
  ){

    const model=
      modelFor(
        id,
        fallbackName
      );


    const provider=
      model?.provider
      ||
      fallbackProvider;


    return String(
      model?.logo
      ||
      providerLogos[
        provider
      ]
      ||
      ''
    )
    .split('?')[0];

  }


  function modelColor(
    id,
    fallbackName='',
    fallbackProvider='',
    index=0
  ){

    const model=
      modelFor(
        id,
        fallbackName
      );


    const provider=
      model?.provider
      ||
      fallbackProvider;


    return (
      model?.color
      ||
      providerColors[
        provider
      ]
      ||
      [
        '#111',
        '#2563eb',
        '#c9643b',
        '#7c3aed'
      ][
        index%4
      ]
    );

  }


  const usageRows=
    (
      DATA.usage.models
      ||
      []
    )
    .map(
      (row,index)=>{

        const model=
          modelByName.get(
            norm(
              row.name
            )
          );


        const id=
          canon(
            model?.id
            ||
            row.id
            ||
            norm(
              row.name
            )
            .replace(
              /\s+/g,
              '-'
            )
          );


        const daily=
          Number(
            row.tokens
            ??
            row.dailyTokens
            ??
            model?.dailyTokens
            ??
            0
          );


        return {

          ...row,

          id,

          name:
            model?.name
            ||
            row.name,

          provider:
            model?.provider
            ||
            row.provider,

          logo:
            modelLogo(
              id,
              row.name,
              row.provider
            ),

          color:
            modelColor(
              id,
              row.name,
              row.provider,
              index
            ),

          dailyTokens:
            daily,

          weeklyTokens:
            Number(
              row.weeklyTokens
              ??
              model?.weeklyTokens
              ??
              (
                daily*7
              )
            )

        };

      }
    )
    .sort(
      (a,b)=>
        b.dailyTokens
        -
        a.dailyTokens
    );


  const requestRows=
    (
      DATA.requests.models
      ||
      []
    )
    .map(
      (row,index)=>({

        ...row,

        id:
          canon(
            row.id
          ),

        logo:
          modelLogo(
            row.id,
            row.name,
            row.provider
          ),

        color:
          modelColor(
            row.id,
            row.name,
            row.provider,
            index
          )

      })
    )
    .sort(
      (a,b)=>
        Number(
          b.requests || 0
        )
        -
        Number(
          a.requests || 0
        )
    );


  const voteRows=
    (
      DATA.votes.models
      ||
      []
    )
    .map(
      (row,index)=>{

        const id=
          canon(
            row.id
          );


        const model=
          modelFor(
            id
          );


        return {

          ...row,

          id,

          name:
            model?.name
            ||
            row.name
            ||
            row.id,

          provider:
            model?.provider
            ||
            '',

          logo:
            modelLogo(
              id,
              row.name,
              model?.provider || ''
            ),

          color:
            modelColor(
              id,
              row.name,
              model?.provider || '',
              index
            )

        };

      }
    )
    .filter(
      row=>
        Number(
          row.votes || 0
        )
        >
        0
    )
    .sort(
      (a,b)=>
        Number(
          b.votes
        )
        -
        Number(
          a.votes
        )
    );


  const usageById=
    new Map(
      usageRows.map(
        (row,index)=>[
          canon(
            row.id
          ),
          {
            ...row,
            rank:index+1
          }
        ]
      )
    );


  const requestById=
    new Map(
      requestRows.map(
        (row,index)=>[
          canon(
            row.id
          ),
          {
            ...row,
            rank:index+1
          }
        ]
      )
    );


  const voteById=
    new Map(
      voteRows.map(
        row=>[
          canon(
            row.id
          ),
          row
        ]
      )
    );


  /* ========================================================
     IMAGES
     ======================================================== */

  const imageCache=
    new Map();


  function loadImage(src){

    if(!src){
      return Promise.resolve(
        null
      );
    }


    if(
      imageCache.has(
        src
      )
    ){
      return imageCache.get(
        src
      );
    }


    const promise=
      new Promise(
        resolve=>{

          const image=
            new Image();


          image.onload=
            ()=>resolve(
              image
            );


          image.onerror=
            ()=>resolve(
              null
            );


          image.src=src;

        }
      );


    imageCache.set(
      src,
      promise
    );


    return promise;

  }


  /* ========================================================
     CANVAS HELPERS
     ======================================================== */

  function clear(
    background='#faf9f6'
  ){

    ctx.clearRect(
      0,
      0,
      W,
      H
    );


    ctx.fillStyle=
      background;


    ctx.fillRect(
      0,
      0,
      W,
      H
    );

  }


  function rounded(
    x,
    y,
    width,
    height,
    radius
  ){

    ctx.beginPath();


    if(
      typeof ctx.roundRect
      ===
      'function'
    ){

      ctx.roundRect(
        x,
        y,
        width,
        height,
        radius
      );

      return;

    }


    const r=
      Math.min(
        radius,
        width/2,
        height/2
      );


    ctx.moveTo(
      x+r,
      y
    );

    ctx.lineTo(
      x+width-r,
      y
    );

    ctx.quadraticCurveTo(
      x+width,
      y,
      x+width,
      y+r
    );

    ctx.lineTo(
      x+width,
      y+height-r
    );

    ctx.quadraticCurveTo(
      x+width,
      y+height,
      x+width-r,
      y+height
    );

    ctx.lineTo(
      x+r,
      y+height
    );

    ctx.quadraticCurveTo(
      x,
      y+height,
      x,
      y+height-r
    );

    ctx.lineTo(
      x,
      y+r
    );

    ctx.quadraticCurveTo(
      x,
      y,
      x+r,
      y
    );

    ctx.closePath();

  }


  function text(
    value,
    x,
    y,
    size,
    weight='400',
    color='#111',
    align='left',
    family='Arial, sans-serif'
  ){

    ctx.save();


    ctx.font=
      `${weight} ${size}px ${family}`;


    ctx.fillStyle=
      color;


    ctx.textAlign=
      align;


    ctx.textBaseline=
      'alphabetic';


    ctx.fillText(
      String(value),
      x,
      y
    );


    ctx.restore();

  }


  async function brand(serial){

    const image=
      await loadImage(
        '/number-of-calls/assets/logos/zorix.svg'
      );


    if(
      serial
      !==
      renderSerial
    ){
      return false;
    }


    if(image){

      ctx.drawImage(
        image,
        1380,
        48,
        48,
        48
      );

    }


    text(
      'Zorix Metron',
      1442,
      80,
      20,
      '600',
      '#333'
    );


    return true;

  }


  async function base(
    serial,
    title,
    subtitle,
    note=''
  ){

    clear();


    text(
      'ZORIX METRON · PUBLIC CHART',
      70,
      60,
      17,
      '600',
      '#77736c'
    );


    text(
      title,
      70,
      125,
      50,
      '600'
    );


    text(
      subtitle,
      70,
      170,
      22,
      '400',
      '#555'
    );


    if(note){

      text(
        note,
        70,
        205,
        14,
        '400',
        '#77736c'
      );

    }


    return brand(
      serial
    );

  }


  /* ========================================================
     GENERIC RANKING — WITH REAL LOGOS
     ======================================================== */

  async function drawBars(
    serial,
    rows,
    title,
    subtitle,
    valueFormatter,
    note
  ){

    rows=
      rows.slice(
        0,
        Math.max(
          1,
          Number(
            count.value || 8
          )
        )
      );


    if(
      !await base(
        serial,
        title,
        subtitle
      )
    ){
      return;
    }


    if(!rows.length){

      text(
        'No published records for this view.',
        70,
        310,
        28,
        '500',
        '#777'
      );

      return;
    }


    const logos=
      await Promise.all(
        rows.map(
          row=>
            loadImage(
              row.logo
              ||
              providerLogos[
                row.provider
              ]
              ||
              ''
            )
        )
      );


    if(
      serial
      !==
      renderSerial
    ){
      return;
    }


    const values=
      rows.map(
        row=>
          Number(
            row.value || 0
          )
      );


    const maximum=
      Math.max(
        ...values,
        1
      );


    const minimum=
      Math.min(
        ...values
      );


    const floor=
      Math.max(
        0,
        minimum
        -
        Math.max(
          1,
          (
            maximum-minimum
          )
          *
          .18
        )
      );


    const span=
      Math.max(
        1,
        maximum-floor
      );


    const startY=245;
    const availableH=535;


    const rowHeight=
      Math.min(
        70,
        availableH
        /
        rows.length
      );


    const logoSize=
      Math.max(
        24,
        Math.min(
          38,
          rowHeight-12
        )
      );


    const nameSize=
      rowHeight<35
        ? 14
        : rowHeight<45
          ? 16
          : 19;


    const barHeight=
      Math.max(
        14,
        Math.min(
          31,
          rowHeight-16
        )
      );


    const nameX=170;
    const barX=590;
    const barMax=690;


    rows.forEach(
      (row,index)=>{

        const y=
          startY
          +
          index*rowHeight;


        ctx.strokeStyle=
          '#e2e0db';


        ctx.lineWidth=1;


        ctx.beginPath();

        ctx.moveTo(
          65,
          y+rowHeight-5
        );

        ctx.lineTo(
          1510,
          y+rowHeight-5
        );

        ctx.stroke();


        text(
          String(
            index+1
          ),
          78,
          y+
          Math.min(
            28,
            rowHeight*.62
          ),
          15,
          '500',
          '#68645e',
          'center',
          'ui-monospace, monospace'
        );


        const image=
          logos[index];


        if(image){

          ctx.drawImage(
            image,
            112,
            y+4,
            logoSize,
            logoSize
          );

        }else{

          rounded(
            112,
            y+4,
            logoSize,
            logoSize,
            8
          );


          ctx.fillStyle=
            providerColors[
              row.provider
            ]
            ||
            '#888';


          ctx.fill();


          text(
            (
              row.provider
              ||
              row.name
              ||
              '?'
            )
            .slice(
              0,
              1
            ),
            112+
            logoSize/2,
            y+
            4+
            logoSize*.69,
            logoSize*.42,
            '700',
            '#fff',
            'center'
          );

        }


        text(
          clip(
            row.name,
            31
          ),
          nameX,
          y+
          Math.min(
            24,
            rowHeight*.54
          ),
          nameSize,
          index<3
            ? '600'
            : '500',
          '#222'
        );


        if(
          row.provider
          &&
          rowHeight>=38
        ){

          text(
            row.provider,
            nameX,
            y+
            Math.min(
              44,
              rowHeight*.9
            ),
            11,
            '400',
            '#77736c'
          );

        }


        const width=
          Math.max(
            10,
            (
              (
                Number(
                  row.value
                )
                -
                floor
              )
              /
              span
            )
            *
            barMax
          );


        rounded(
          barX,
          y+6,
          width,
          barHeight,
          6
        );


        ctx.fillStyle=
          row.color
          ||
          providerColors[
            row.provider
          ]
          ||
          '#244a85';


        ctx.fill();


        text(
          valueFormatter(
            row
          ),
          barX+
          width+
          14,
          y+
          6+
          Math.max(
            17,
            barHeight*.72
          ),
          rowHeight<35
            ? 13
            : 17,
          '600',
          '#4f4b45',
          'left',
          'ui-monospace, monospace'
        );

      }
    );


    text(
      note,
      70,
      850,
      12,
      '400',
      '#68645e',
      'left',
      'ui-monospace, monospace'
    );

  }


  function usageAsRows(
    mode='daily'
  ){

    const weekly=
      mode==='weekly';


    return usageRows
      .map(
        row=>({

          ...row,

          value:
            weekly
              ? row.weeklyTokens
              : row.dailyTokens

        })
      )
      .filter(
        row=>
          row.value>0
      )
      .sort(
        (a,b)=>
          b.value-a.value
      );

  }


  async function drawUsageIndex(serial){

    const rows=
      usageRows
      .map(
        row=>({

          ...row,

          value:
            Number(
              row.share || 0
            )

        })
      )
      .filter(
        row=>
          row.value>0
      )
      .sort(
        (a,b)=>
          b.value-a.value
      );


    return drawBars(
      serial,
      rows,
      'Metron Usage Index',
      'Share of current recorded token traffic',
      row=>
        Number(
          row.value
        )
        .toFixed(2)
        +
        '%',
      'SOURCE: ZORIX METRON · CURRENT TOKEN SHARE'
    );

  }


  async function drawRanking(serial){

    const mode=
      metric.value==='weekly'
        ? 'weekly'
        : 'daily';


    return drawBars(
      serial,
      usageAsRows(
        mode
      ),
      'Metron Model Usage',
      mode==='weekly'
        ? 'Weekly token volume'
        : 'Daily token volume',
      row=>
        compact(
          row.value
        )
        +
        (
          mode==='weekly'
            ? '/wk'
            : '/day'
        ),
      'SOURCE: ZORIX METRON · TOKEN TRAFFIC RECORDED INSIDE ZORIX CODE'
    );

  }


  async function drawBenchmark(serial){

    const metricId=
      metric.value;


    const metricInfo=
      (
        DATA.bench.metrics
        ||
        []
      )
      .find(
        item=>
          item.id===metricId
      );


    const rows=
      Object.entries(
        DATA.bench.scores
        ||
        {}
      )
      .map(
        ([id,scores],index)=>{

          const value=
            Number(
              scores?.[
                metricId
              ]
            );


          if(
            !Number.isFinite(
              value
            )
          ){
            return null;
          }


          const model=
            modelFor(
              id
            );


          const provider=
            model?.provider
            ||
            (
              id.startsWith(
                'nex-coder'
              )
                ? 'Zorix'
                : ''
            );


          return {

            id,

            name:
              model?.name
              ||
              id,

            provider,

            logo:
              modelLogo(
                id,
                '',
                provider
              ),

            color:
              modelColor(
                id,
                '',
                provider,
                index
              ),

            value

          };

        }
      )
      .filter(Boolean)
      .sort(
        (a,b)=>
          b.value-a.value
      );


    return drawBars(
      serial,
      rows,
      'Metron Benchmark Ranking',
      metricInfo?.name
      ||
      metricId,
      row=>
        Number(
          row.value
        )
        .toFixed(1)
        +
        '%',
      'SOURCE: ZORIX METRON · INTERNAL PREVIEW EVALUATION · NOT A THIRD-PARTY LEADERBOARD'
    );

  }


  async function drawVoting(serial){

    const rows=
      voteRows.map(
        row=>({

          ...row,

          value:
            Number(
              row.votes
            )

        })
      );


    return drawBars(
      serial,
      rows,
      'Metron Community Voting',
      'Current published community-vote ranking',
      row=>
        Number(
          row.value
        )
        .toLocaleString(
          'en-US'
        )
        +
        (
          Number(
            row.uncertainty || 0
          )
          >0
            ? (
                ' ±'
                +
                row.uncertainty
              )
            : ''
        ),
      'SOURCE: ZORIX METRON COMMUNITY VOTING'
    );

  }


  /* ========================================================
     CURRENT WEEKLY RANK CURVE — NOT TIME HISTORY
     ======================================================== */

  async function drawTrend(serial){

    const rows=
      usageAsRows(
        'weekly'
      )
      .slice(
        0,
        Math.max(
          2,
          Number(
            count.value || 8
          )
        )
      )
      .sort(
        (a,b)=>
          a.value-b.value
      );


    if(
      !await base(
        serial,
        'Weekly token volume',
        'Current ranking curve · not a time series',
        'Explicit weeklyTokens are used when published; otherwise current daily rate × 7.'
      )
    ){
      return;
    }


    if(!rows.length){

      text(
        'No weekly token values available.',
        70,
        310,
        28,
        '500',
        '#777'
      );

      return;
    }


    const left=145;
    const right=1470;
    const top=270;
    const bottom=735;


    const logMode=
      trendScale?.value
      !==
      'linear';


    const minimum=
      Math.max(
        1,
        Math.min(
          ...rows.map(
            row=>row.value
          )
        )
      );


    const maximum=
      Math.max(
        ...rows.map(
          row=>row.value
        )
      );


    const logMinimum=
      Math.log10(
        minimum
      );


    const logMaximum=
      Math.log10(
        maximum===minimum
          ? maximum*10
          : maximum
      );


    function yFor(value){

      if(logMode){

        return (
          bottom
          -
          (
            (
              Math.log10(
                Math.max(
                  1,
                  value
                )
              )
              -
              logMinimum
            )
            /
            (
              logMaximum
              -
              logMinimum
            )
          )
          *
          (
            bottom-top
          )
        );

      }


      return (
        bottom
        -
        (
          value/maximum
        )
        *
        (
          bottom-top
        )
      );

    }


    ctx.strokeStyle=
      '#deded8';


    ctx.lineWidth=1;


    for(
      let i=0;
      i<=5;
      i++
    ){

      const progress=
        i/5;


      const value=
        logMode
          ? 10**(
              logMinimum
              +
              (
                logMaximum-logMinimum
              )
              *
              progress
            )
          : maximum*progress;


      const y=
        yFor(
          value
        );


      ctx.beginPath();

      ctx.moveTo(
        left,
        y
      );

      ctx.lineTo(
        right,
        y
      );

      ctx.stroke();


      text(
        compact(
          value
        ),
        left-14,
        y+5,
        12,
        '400',
        '#777',
        'right',
        'ui-monospace, monospace'
      );

    }


    const points=
      rows.map(
        (row,index)=>({

          row,

          x:
            rows.length===1
              ? (
                  left+right
                )/2
              : (
                  left
                  +
                  index/
                  (
                    rows.length-1
                  )
                  *
                  (
                    right-left
                  )
                ),

          y:
            yFor(
              row.value
            )

        })
      );


    ctx.strokeStyle=
      '#171717';

    ctx.lineWidth=4;

    ctx.lineJoin=
      'round';

    ctx.lineCap=
      'round';


    ctx.beginPath();


    points.forEach(
      (point,index)=>{

        if(index===0){

          ctx.moveTo(
            point.x,
            point.y
          );

        }else{

          ctx.lineTo(
            point.x,
            point.y
          );

        }

      }
    );


    ctx.stroke();


    points.forEach(
      (point,index)=>{

        ctx.beginPath();


        ctx.arc(
          point.x,
          point.y,
          index===points.length-1
            ? 9
            : 6,
          0,
          Math.PI*2
        );


        ctx.fillStyle=
          index===points.length-1
            ? '#e87520'
            : '#fff';


        ctx.fill();


        ctx.strokeStyle=
          index===points.length-1
            ? '#e87520'
            : '#171717';


        ctx.lineWidth=3;

        ctx.stroke();


        text(
          clip(
            point.row.name,
            22
          ),
          point.x,
          point.y-14,
          11,
          '500',
          '#333',
          'center'
        );

      }
    );


    text(
      logMode
        ? 'TOKENS PER WEEK · LOG SCALE'
        : 'TOKENS PER WEEK · LINEAR SCALE',
      left,
      790,
      13,
      '600',
      '#68645e'
    );


    text(
      'SOURCE: ZORIX METRON · CURRENT RANKING CURVE',
      left,
      850,
      12,
      '400',
      '#68645e',
      'left',
      'ui-monospace, monospace'
    );

  }


  /* ========================================================
     LANDSCAPE
     ======================================================== */

  const landscapeDefs={

    requests:{
      label:'Request count (B)',
      rank:false,
      fmt:value=>
        value.toFixed(
          value>=100
            ? 0
            : 1
        )
        +
        'B'
    },

    'request-rank':{
      label:'Request rank',
      rank:true,
      fmt:value=>
        '#'
        +
        Math.round(
          value
        )
    },

    'usage-rank':{
      label:'Usage rank',
      rank:true,
      fmt:value=>
        '#'
        +
        Math.round(
          value
        )
    },

    votes:{
      label:'Community voting score',
      rank:false,
      fmt:value=>
        Math.round(
          value
        )
        .toLocaleString(
          'en-US'
        )
    },

    'swe-verified':{
      label:'SWE-bench Verified',
      rank:false,
      fmt:value=>
        value.toFixed(1)
        +
        '%'
    },

    'terminal-21':{
      label:'Terminal-Bench 2.1',
      rank:false,
      fmt:value=>
        value.toFixed(1)
        +
        '%'
    }

  };


  function landscapeValue(
    id,
    key
  ){

    id=
      canon(
        id
      );


    if(
      key==='requests'
    ){

      const value=
        requestById.get(
          id
        )
        ?.requests;


      return Number.isFinite(
        Number(value)
      )
        ? Number(value)/1e9
        : null;

    }


    if(
      key==='request-rank'
    ){

      return (
        requestById.get(
          id
        )
        ?.rank
        ??
        null
      );

    }


    if(
      key==='usage-rank'
    ){

      return (
        usageById.get(
          id
        )
        ?.rank
        ??
        null
      );

    }


    if(
      key==='votes'
    ){

      const value=
        voteById.get(
          id
        )
        ?.votes;


      return (
        Number(value)>0
          ? Number(value)
          : null
      );

    }


    const value=
      DATA.bench
      .scores?.[
        id
      ]?.[
        key
      ];


    return Number.isFinite(
      Number(value)
    )
      ? Number(value)
      : null;

  }


  async function drawLandscape(serial){

    const xKey=
      landscapeX?.value
      ||
      'requests';


    const yKey=
      landscapeY?.value
      ||
      'votes';


    const xDefinition=
      landscapeDefs[
        xKey
      ];


    const yDefinition=
      landscapeDefs[
        yKey
      ];


    const ids=
      new Set([
        ...requestById.keys(),
        ...usageById.keys(),
        ...voteById.keys(),
        ...Object.keys(
          DATA.bench.scores
          ||
          {}
        )
        .map(
          canon
        )
      ]);


    let points=
      [...ids]
      .map(
        (id,index)=>{

          const x=
            landscapeValue(
              id,
              xKey
            );


          const y=
            landscapeValue(
              id,
              yKey
            );


          if(
            x==null
            ||
            y==null
          ){
            return null;
          }


          const requestRow=
            requestById.get(
              id
            );


          const usageRow=
            usageById.get(
              id
            );


          const model=
            modelFor(
              id,
              requestRow?.name
              ||
              usageRow?.name
              ||
              ''
            );


          const provider=
            model?.provider
            ||
            requestRow?.provider
            ||
            usageRow?.provider
            ||
            '';


          return {

            id,
            x,
            y,

            name:
              model?.name
              ||
              requestRow?.name
              ||
              usageRow?.name
              ||
              id,

            provider,

            color:
              model?.color
              ||
              providerColors[
                provider
              ]
              ||
              '#666',

            priority:
              Math.min(
                requestRow?.rank
                ||
                999,
                usageRow?.rank
                ||
                999,
                index+1
              )

          };

        }
      )
      .filter(Boolean)
      .sort(
        (a,b)=>
          a.priority-b.priority
      )
      .slice(
        0,
        Math.max(
          1,
          Number(
            count.value || 12
          )
        )
      );


    if(
      !await base(
        serial,
        'AI Model Landscape',
        `${xDefinition.label} vs. ${yDefinition.label}`,
        'Dots are current observations. Dotted paths only group models by provider.'
      )
    ){
      return;
    }


    if(!points.length){

      text(
        'No models have both selected observations.',
        70,
        310,
        28,
        '500',
        '#777'
      );

      return;
    }


    const plot={
      left:120,
      right:1515,
      top:260,
      bottom:735
    };


    const xValues=
      points.map(
        point=>point.x
      );


    const yValues=
      points.map(
        point=>point.y
      );


    function domain(
      values,
      rank
    ){

      let low=
        Math.min(
          ...values
        );


      let high=
        Math.max(
          ...values
        );


      if(low===high){

        low-=1;
        high+=1;

      }else if(!rank){

        const padding=
          (
            high-low
          )
          *
          .08;


        low=
          Math.max(
            0,
            low-padding
          );


        high+=padding;

      }


      return [
        low,
        high
      ];

    }


    const xDomain=
      domain(
        xValues,
        xDefinition.rank
      );


    const yDomain=
      domain(
        yValues,
        yDefinition.rank
      );


    const mapX=
      value=>
        plot.left
        +
        (
          value-xDomain[0]
        )
        /
        (
          xDomain[1]-xDomain[0]
        )
        *
        (
          plot.right-plot.left
        );


    const mapY=
      value=>
        yDefinition.rank
          ? (
              plot.top
              +
              (
                value-yDomain[0]
              )
              /
              (
                yDomain[1]-yDomain[0]
              )
              *
              (
                plot.bottom-plot.top
              )
            )
          : (
              plot.bottom
              -
              (
                value-yDomain[0]
              )
              /
              (
                yDomain[1]-yDomain[0]
              )
              *
              (
                plot.bottom-plot.top
              )
            );


    const sortedY=
      [...yValues]
      .sort(
        (a,b)=>a-b
      );


    const quartileIndex=
      Math.floor(
        (
          sortedY.length-1
        )
        *
        (
          yDefinition.rank
            ? .25
            : .75
        )
      );


    const zoneY=
      mapY(
        sortedY[
          quartileIndex
        ]
      );


    ctx.fillStyle=
      'rgba(219,239,214,.60)';


    ctx.fillRect(
      plot.left,
      plot.top,
      plot.right-plot.left,
      Math.max(
        0,
        zoneY-plot.top
      )
    );


    text(
      'Top quartile zone',
      plot.left+10,
      plot.top+20,
      12,
      '600',
      '#476447'
    );


    ctx.strokeStyle=
      '#e6e6e6';


    ctx.lineWidth=1;


    for(
      let i=0;
      i<=5;
      i++
    ){

      const xValue=
        xDomain[0]
        +
        (
          xDomain[1]-xDomain[0]
        )
        *
        i/5;


      const x=
        mapX(
          xValue
        );


      ctx.beginPath();

      ctx.moveTo(
        x,
        plot.top
      );

      ctx.lineTo(
        x,
        plot.bottom
      );

      ctx.stroke();


      text(
        xDefinition.fmt(
          xValue
        ),
        x,
        plot.bottom+25,
        11,
        '400',
        '#666',
        'center',
        'ui-monospace, monospace'
      );


      const yValue=
        yDomain[0]
        +
        (
          yDomain[1]-yDomain[0]
        )
        *
        i/5;


      const y=
        mapY(
          yValue
        );


      ctx.beginPath();

      ctx.moveTo(
        plot.left,
        y
      );

      ctx.lineTo(
        plot.right,
        y
      );

      ctx.stroke();


      text(
        yDefinition.fmt(
          yValue
        ),
        plot.left-10,
        y+4,
        11,
        '400',
        '#666',
        'right',
        'ui-monospace, monospace'
      );

    }


    const groups=
      new Map();


    points.forEach(
      point=>{

        if(
          !groups.has(
            point.provider
          )
        ){

          groups.set(
            point.provider,
            []
          );

        }


        groups.get(
          point.provider
        )
        .push(
          point
        );

      }
    );


    groups.forEach(
      (group,provider)=>{

        if(
          group.length<2
        ){
          return;
        }


        group.sort(
          (a,b)=>
            a.x-b.x
        );


        ctx.save();

        ctx.setLineDash(
          [
            2,
            6
          ]
        );


        ctx.strokeStyle=
          providerColors[
            provider
          ]
          ||
          '#888';


        ctx.globalAlpha=.35;

        ctx.lineWidth=1.5;

        ctx.beginPath();


        group.forEach(
          (point,index)=>{

            const x=
              mapX(
                point.x
              );


            const y=
              mapY(
                point.y
              );


            if(index===0){

              ctx.moveTo(
                x,
                y
              );

            }else{

              ctx.lineTo(
                x,
                y
              );

            }

          }
        );


        ctx.stroke();

        ctx.restore();

      }
    );


    points.forEach(
      (point,index)=>{

        const x=
          mapX(
            point.x
          );


        const y=
          mapY(
            point.y
          );


        ctx.beginPath();

        ctx.arc(
          x,
          y,
          7,
          0,
          Math.PI*2
        );


        ctx.fillStyle=
          point.color;


        ctx.fill();


        ctx.strokeStyle=
          '#fff';

        ctx.lineWidth=2;

        ctx.stroke();


        const right=
          x<
          plot.right-220;


        text(
          clip(
            point.name,
            24
          ),
          x+
          (
            right
              ? 11
              : -11
          ),
          y+
          (
            index%2
              ? 18
              : -8
          ),
          12,
          '500',
          '#333',
          right
            ? 'left'
            : 'right'
        );

      }
    );


    text(
      xDefinition.label,
      (
        plot.left+plot.right
      )/2,
      800,
      14,
      '600',
      '#444',
      'center'
    );


    ctx.save();

    ctx.translate(
      38,
      (
        plot.top+plot.bottom
      )/2
    );

    ctx.rotate(
      -Math.PI/2
    );


    text(
      yDefinition.label,
      0,
      0,
      14,
      '600',
      '#444',
      'center'
    );


    ctx.restore();


    text(
      'SOURCE: CURRENT ZORIX METRON OBSERVATIONS · MISSING VALUES OMITTED',
      70,
      855,
      12,
      '400',
      '#68645e',
      'left',
      'ui-monospace, monospace'
    );

  }


  /* ========================================================
     IMAGE AI
     ======================================================== */

  async function drawImageAI(serial){

    const rows=
      (
        DATA.image.models
        ||
        []
      )
      .slice(
        0,
        7
      )
      .map(
        row=>({

          name:
            row.name,

          provider:
            row.provider,

          logo:
            providerLogos[
              row.provider
            ]
            ||
            '',

          color:
            providerColors[
              row.provider
            ]
            ||
            '#555',

          value:
            Number(
              row.arena?.score
              ??
              row.artificialAnalysis?.elo
              ??
              0
            ),

          format:
            ()=>
              (
                'Arena '
                +
                (
                  row.arena
                    ? (
                        row.arena.score
                        +
                        ' ±'
                        +
                        row.arena.uncertainty
                      )
                    : '—'
                )
                +
                ' · AA '
                +
                (
                  row.artificialAnalysis
                    ? (
                        row.artificialAnalysis.elo
                        +
                        ' ±'
                        +
                        row.artificialAnalysis.ci
                      )
                    : '—'
                )
              )

        })
      );


    return drawBars(
      serial,
      rows,
      'Metron Image AI',
      'Arena and Artificial Analysis values remain separate',
      row=>
        row.format(),
      'SOURCE: PUBLISHED IMAGE-AI SOURCE SNAPSHOTS · NO SYNTHETIC UNIVERSAL SCORE'
    );

  }


  /* ========================================================
     INTELLIGENCE × COST
     ======================================================== */

  async function drawIntelligence(serial){

    const points=
      (
        DATA.intel.points
        ||
        []
      )
      .filter(
        point=>
          Number(
            point.cost
          )
          >
          0
          &&
          Number.isFinite(
            Number(
              point.intelligence
            )
          )
      );


    if(
      !await base(
        serial,
        'Metron Intelligence × Cost',
        'Verified cost-per-task observations only'
      )
    ){
      return;
    }


    if(!points.length){

      text(
        'No sourced cost-per-task observations yet.',
        70,
        330,
        32,
        '600',
        '#393936'
      );


      text(
        'Models are omitted rather than estimated from API token prices.',
        70,
        380,
        18,
        '400',
        '#77736c'
      );


      return;
    }


    const left=130;
    const right=1490;
    const top=270;
    const bottom=740;


    const costs=
      points.map(
        point=>
          Number(
            point.cost
          )
      );


    const scores=
      points.map(
        point=>
          Number(
            point.intelligence
          )
      );


    const xMinimum=
      Math.max(
        .001,
        Math.min(
          ...costs
        )
        *
        .75
      );


    const xMaximum=
      Math.max(
        ...costs
      )
      *
      1.25;


    const yMinimum=
      Math.min(
        ...scores
      )
      -
      3;


    const yMaximum=
      Math.max(
        ...scores
      )
      +
      3;


    const logLow=
      Math.log10(
        xMinimum
      );


    const logHigh=
      Math.log10(
        xMaximum
      );


    const xFor=
      value=>
        left
        +
        (
          Math.log10(
            value
          )
          -
          logLow
        )
        /
        (
          logHigh-logLow
        )
        *
        (
          right-left
        );


    const yFor=
      value=>
        bottom
        -
        (
          value-yMinimum
        )
        /
        (
          yMaximum-yMinimum
        )
        *
        (
          bottom-top
        );


    ctx.strokeStyle=
      '#ddd';


    ctx.beginPath();

    ctx.moveTo(
      left,
      top
    );

    ctx.lineTo(
      left,
      bottom
    );

    ctx.lineTo(
      right,
      bottom
    );

    ctx.stroke();


    points.forEach(
      point=>{

        const x=
          xFor(
            Number(
              point.cost
            )
          );


        const y=
          yFor(
            Number(
              point.intelligence
            )
          );


        ctx.beginPath();

        ctx.arc(
          x,
          y,
          8,
          0,
          Math.PI*2
        );


        ctx.fillStyle=
          providerColors[
            point.provider
          ]
          ||
          '#555';


        ctx.fill();


        text(
          point.label
          ||
          point.id,
          x+12,
          y-8,
          12,
          '500',
          '#333'
        );

      }
    );


    text(
      DATA.intel.xLabel
      ||
      'Cost per task (USD, log scale)',
      (
        left+right
      )/2,
      800,
      14,
      '600',
      '#444',
      'center'
    );


    ctx.save();

    ctx.translate(
      38,
      (
        top+bottom
      )/2
    );

    ctx.rotate(
      -Math.PI/2
    );


    text(
      DATA.intel.yLabel
      ||
      'Intelligence index',
      0,
      0,
      14,
      '600',
      '#444',
      'center'
    );


    ctx.restore();

  }


  /* ========================================================
     424 × 488 CODING BENCHMARK SVG
     ======================================================== */

  function buildCodingSvg(){

    const series=[

      [
        'nex-coder-38-neptune',
        'Nex Coder 3.8',
        '#133463'
      ],

      [
        'claude-opus-5',
        'Claude Opus 5',
        '#1f4e94'
      ],

      [
        'gpt-56-luna',
        'GPT-5.6 Luna',
        '#2c67c5'
      ],

      [
        'gemini-37-flash',
        'Gemini 3.7 Flash',
        '#873e60'
      ]

    ];


    const metrics=[

      [
        'swe-verified',
        'SWE-V'
      ],

      [
        'swe-pro',
        'SWE-Pro'
      ],

      [
        'terminal-21',
        'Terminal'
      ],

      [
        'livecode',
        'LiveCode'
      ],

      [
        'humaneval-plus',
        'HE+'
      ]

    ];


    const positions=[
      114,
      178,
      242,
      306,
      370
    ];


    const y=
      value=>
        147
        +
        (
          100-Number(value)
        )
        /
        30
        *
        276;


    const esc=
      value=>
        String(value)
        .replace(
          /&/g,
          '&amp;'
        )
        .replace(
          /</g,
          '&lt;'
        )
        .replace(
          />/g,
          '&gt;'
        );


    let legend='';
    let marks='';


    series.forEach(
      (item,seriesIndex)=>{

        const legendY=
          82+
          seriesIndex*16;


        legend+=`
          <circle
            cx="115"
            cy="${legendY}"
            r="5"
            fill="${item[2]}"
          />
          <text
            x="126"
            y="${legendY+4}"
            font-family="Arial,sans-serif"
            font-size="12"
            fill="#000"
          >${esc(item[1])}</text>
        `;


        const points=
          metrics
          .map(
            (metricItem,index)=>{

              const value=
                DATA.bench
                .scores?.[
                  item[0]
                ]?.[
                  metricItem[0]
                ];


              return Number.isFinite(
                Number(value)
              )
                ? [
                    positions[index],
                    y(value),
                    Number(value)
                  ]
                : null;

            }
          )
          .filter(Boolean);


        if(points.length){

          marks+=`
            <path
              d="${
                points.map(
                  (point,index)=>
                    (
                      index
                        ? 'L'
                        : 'M'
                    )
                    +
                    point[0]
                    +
                    ','
                    +
                    point[1]
                )
                .join('')
              }"
              fill="none"
              stroke="${item[2]}"
              stroke-width="2"
            />
          `;


          points.forEach(
            point=>{

              marks+=`
                <circle
                  cx="${point[0]}"
                  cy="${point[1]}"
                  r="4.2"
                  fill="${item[2]}"
                />
              `;

            }
          );

        }

      }
    );


    const xLabels=
      metrics.map(
        (item,index)=>`
          <line
            x1="${positions[index]}"
            y1="423"
            x2="${positions[index]}"
            y2="428"
            stroke="#000"
          />
          <text
            x="${positions[index]}"
            y="449"
            text-anchor="middle"
            font-family="SF Mono,monospace"
            font-size="8.5"
          >${item[1]}</text>
        `
      )
      .join('');


    const yTicks=
      [
        70,
        80,
        90,
        100
      ]
      .map(
        value=>`
          <line
            x1="108"
            y1="${y(value)}"
            x2="103"
            y2="${y(value)}"
            stroke="#000"
          />
          <text
            x="93"
            y="${y(value)+4}"
            text-anchor="end"
            font-family="SF Mono,monospace"
            font-size="12"
          >${value}%</text>
        `
      )
      .join('');


    return `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="424"
        height="488"
        viewBox="0 0 424 488"
      >

        <rect
          width="424"
          height="488"
          fill="#fff"
        />

        <text
          x="32"
          y="24"
          font-family="Arial,sans-serif"
          font-size="16"
          font-weight="700"
          dominant-baseline="text-before-edge"
        >
          Metron Coding Benchmark
        </text>

        <g transform="translate(384 26)">
          <circle
            r="12"
            fill="#7446c8"
          />
          <text
            x="0"
            y="4"
            text-anchor="middle"
            font-family="Arial,sans-serif"
            font-size="11"
            font-weight="700"
            fill="#fff"
          >Z</text>
        </g>

        ${legend}

        <line
          x1="108"
          y1="147"
          x2="108"
          y2="423"
          stroke="#000"
        />

        <line
          x1="108"
          y1="423"
          x2="376"
          y2="423"
          stroke="#000"
        />

        ${yTicks}
        ${xLabels}
        ${marks}

        <text
          x="242"
          y="480"
          text-anchor="middle"
          font-family="Arial,sans-serif"
          font-size="14"
        >
          Benchmark
        </text>

        <text
          x="51"
          y="285"
          text-anchor="middle"
          transform="rotate(-90 51 285)"
          font-family="Arial,sans-serif"
          font-size="14"
        >
          Score
        </text>

      </svg>
    `;

  }


  function renderCodingSvg(){

    if(codingHost){

      codingHost.innerHTML=
        buildCodingSvg();

    }


    if(previewMeta){

      previewMeta.textContent=
        'Metron Coding Benchmark · internal preview';

    }


    if(previewTitle){

      previewTitle.textContent=
        '424 × 488';

    }

  }



  /* ========================================================
     TRANSLATION_SHARE_SVG_V1
     ======================================================== */

  function translationSvgSpec(){

    const builder =
      window.ZORIX_TRANSLATE_SVG;


    if(
      !builder
      ||
      typeof builder.build
      !==
      'function'
    ){

      return {
        width:1200,
        height:675,
        filename:'zorix-translation-comparison',
        title:'Translation comparison',
        svg:`
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1200"
            height="675"
            viewBox="0 0 1200 675"
          >
            <rect
              width="1200"
              height="675"
              fill="#fff"
            />
            <text
              x="50"
              y="80"
              font-family="Arial,sans-serif"
              font-size="28"
              fill="#111"
            >
              Translation SVG builder unavailable
            </text>
          </svg>
        `
      };

    }


    return builder.build(
      svgStyle?.value
      ||
      'dual',
      DATA.translate
    );

  }


  function renderTranslationSvg(){

    const spec =
      translationSvgSpec();


    if(codingHost){

      codingHost.innerHTML =
        spec.svg;


      codingHost.style.width =
        spec.width
        +
        'px';


      codingHost.style.height =
        spec.height
        +
        'px';

    }


    if(codingPreview){

      codingPreview.style.minHeight =
        Math.max(
          540,
          spec.height+30
        )
        +
        'px';

    }


    if(previewTitle){

      previewTitle.textContent =
        spec.width
        +
        ' × '
        +
        spec.height;

    }


    if(previewMeta){

      previewMeta.textContent =
        spec.title
        +
        ' · current published translation data';

    }


    if(status){

      status.style.display =
        'block';


      status.textContent =
        'Translation comparison · '
        +
        (
          svgStyle
          ?.options[
            svgStyle.selectedIndex
          ]
          ?.textContent
          ?.trim()
          ||
          'SVG'
        );

    }

  }


  /* ========================================================
     CONTROLS
     ======================================================== */

  function setOptions(
    items,
    disabled=false
  ){

    const current=
      metric.value;


    metric.innerHTML=
      items.map(
        ([value,label])=>
          `<option value="${value}">${label}</option>`
      )
      .join('');


    if(
      items.some(
        ([value])=>
          value===current
      )
    ){

      metric.value=current;

    }


    metric.disabled=
      disabled;

  }


  function configureControls(){

    const type=
      report.value;


    if(svgStyleControls){

      svgStyleControls.style.display=
        'none';

    }


    if(translateSvgButton){

      translateSvgButton.style.display=
        'none';

    }


    if(translatePngButton){

      translatePngButton.style.display=
        'none';

    }


    landscapeControls
      ?.classList.remove(
        'active'
      );


    if(trendControls){

      trendControls.style.display=
        'none';

    }


    controls
      ?.classList.remove(
        'landscape-active',
        'trend-active'
      );


    if(metricGroup){

      metricGroup.style.display='';

    }


    if(countGroup){

      countGroup.style.display='';

    }


    canvas.style.display=
      'block';


    if(codingPreview){

      codingPreview.style.display=
        'none';

    }


    if(downloadButton){

      downloadButton.style.display='';

    }


    if(svgButton){

      svgButton.style.display=
        'none';

    }


    if(codingPngButton){

      codingPngButton.style.display=
        'none';

    }


    if(previewTitle){

      previewTitle.textContent=
        '1600 × 900';

    }


    if(type==='ranking'){

      setOptions([
        [
          'daily',
          'Daily tokens'
        ],
        [
          'weekly',
          'Weekly tokens'
        ]
      ]);

    }else if(type==='benchmark'){

      setOptions(
        (
          DATA.bench.metrics
          ||
          []
        )
        .map(
          item=>[
            item.id,
            item.name
          ]
        )
      );

    }else if(type==='usage'){

      setOptions(
        [[
          'share',
          'Current token share'
        ]],
        true
      );

    }else if(type==='trend'){

      setOptions(
        [[
          'weekly',
          'Weekly token volume'
        ]],
        true
      );


      if(trendControls){

        trendControls.style.display='';

      }


      controls
        ?.classList.add(
          'trend-active'
        );

    }else if(type==='voting'){

      setOptions(
        [[
          'community',
          'Community voting score'
        ]],
        true
      );

    }else if(
      type==='intelligence-cost'
    ){

      setOptions(
        [[
          'cost-intelligence',
          'Cost × intelligence'
        ]],
        true
      );

    }else if(
      type==='image-ai'
    ){

      setOptions(
        [[
          'source-values',
          'Arena + Artificial Analysis'
        ]],
        true
      );

    }else if(
      type==='model-landscape'
    ){

      if(metricGroup){

        metricGroup.style.display=
          'none';

      }


      landscapeControls
        ?.classList.add(
          'active'
        );


      controls
        ?.classList.add(
          'landscape-active'
        );

    }else if(
      type==='translation-compare'
    ){

      if(metricGroup){

        metricGroup.style.display=
          'none';

      }


      if(countGroup){

        countGroup.style.display=
          'none';

      }


      if(svgStyleControls){

        svgStyleControls.style.display=
          '';

      }


      canvas.style.display=
        'none';


      if(codingPreview){

        codingPreview.style.display=
          'flex';

      }


      if(downloadButton){

        downloadButton.style.display=
          'none';

      }


      if(translateSvgButton){

        translateSvgButton.style.display=
          '';

      }


      if(translatePngButton){

        translatePngButton.style.display=
          '';

      }


      renderTranslationSvg();


    }else if(
      type==='coding-benchmark-svg'
    ){

      if(metricGroup){

        metricGroup.style.display=
          'none';

      }


      if(countGroup){

        countGroup.style.display=
          'none';

      }


      canvas.style.display=
        'none';


      if(codingPreview){

        codingPreview.style.display=
          'flex';

      }


      if(downloadButton){

        downloadButton.style.display=
          'none';

      }


      if(svgButton){

        svgButton.style.display='';

      }


      if(codingPngButton){

        codingPngButton.style.display='';

      }


      renderCodingSvg();

    }

  }


  /* ========================================================
     SINGLE RENDERER
     ======================================================== */

  let renderSerial=0;

  let renderPromise=
    Promise.resolve();


  async function render(serial){

    const type=
      report.value;


    if(
      type==='translation-compare'
    ){

      renderTranslationSvg();

      return;
    }


    if(
      type==='coding-benchmark-svg'
    ){

      renderCodingSvg();

      return;
    }


    if(previewTitle){

      previewTitle.textContent=
        '1600 × 900';

    }


    if(type==='usage'){

      await drawUsageIndex(
        serial
      );

    }else if(type==='trend'){

      await drawTrend(
        serial
      );

    }else if(type==='ranking'){

      await drawRanking(
        serial
      );

    }else if(type==='benchmark'){

      await drawBenchmark(
        serial
      );

    }else if(type==='voting'){

      await drawVoting(
        serial
      );

    }else if(
      type==='model-landscape'
    ){

      await drawLandscape(
        serial
      );

    }else if(
      type==='intelligence-cost'
    ){

      await drawIntelligence(
        serial
      );

    }else if(
      type==='image-ai'
    ){

      await drawImageAI(
        serial
      );

    }


    if(
      serial
      !==
      renderSerial
    ){
      return;
    }


    if(
      previewMeta
      &&
      type!=='model-landscape'
      &&
      type!=='benchmark'
    ){

      previewMeta.textContent=
        'Zorix Metron · '
        +
        report
        .options[
          report.selectedIndex
        ]
        ?.textContent
        .trim();

    }


    if(status){

      status.style.display=
        'block';


      status.textContent=
        'Single renderer active · '
        +
        report
        .options[
          report.selectedIndex
        ]
        ?.textContent
        .trim();

    }

  }


  function scheduleRender(){

    const serial=
      ++renderSerial;


    renderPromise=
      render(
        serial
      )
      .catch(
        error=>{

          console.error(
            error
          );


          clear();


          text(
            'Share renderer error',
            70,
            130,
            42,
            '600'
          );


          text(
            error.message,
            70,
            185,
            18,
            '400',
            '#b42318'
          );

        }
      );


    return renderPromise;

  }


  /* ========================================================
     DOWNLOAD — CURRENT PREVIEW ONLY
     ======================================================== */

  function saveBlob(
    blob,
    filename
  ){

    if(!blob){
      return;
    }


    const url=
      URL.createObjectURL(
        blob
      );


    const link=
      document.createElement(
        'a'
      );


    link.href=url;

    link.download=
      filename;


    document.body
      .appendChild(
        link
      );


    link.click();

    link.remove();


    setTimeout(
      ()=>{
        URL.revokeObjectURL(
          url
        );
      },
      1000
    );

  }


  const stamp=
    ()=>
      new Date()
      .toISOString()
      .slice(
        0,
        10
      );


  downloadButton
    ?.addEventListener(
      'click',
      async ()=>{

        /*
         * Do NOT call another renderer here.
         * Wait for the currently selected render
         * and snapshot those exact pixels.
         */

        await renderPromise;


        const snapshot=
          document.createElement(
            'canvas'
          );


        snapshot.width=
          canvas.width;


        snapshot.height=
          canvas.height;


        snapshot
          .getContext(
            '2d'
          )
          .drawImage(
            canvas,
            0,
            0
          );


        snapshot.toBlob(
          blob=>
            saveBlob(
              blob,
              `zorix-metron-${report.value}-${metric.value || 'report'}-${stamp()}.png`
            ),
          'image/png',
          1
        );

      }
    );


  svgButton
    ?.addEventListener(
      'click',
      ()=>{

        const source=
          buildCodingSvg();


        saveBlob(
          new Blob(
            [source],
            {
              type:
                'image/svg+xml;charset=utf-8'
            }
          ),
          `metron-coding-benchmark-${stamp()}.svg`
        );

      }
    );


  codingPngButton
    ?.addEventListener(
      'click',
      ()=>{

        const source=
          buildCodingSvg();


        const blob=
          new Blob(
            [source],
            {
              type:
                'image/svg+xml;charset=utf-8'
            }
          );


        const url=
          URL.createObjectURL(
            blob
          );


        const image=
          new Image();


        image.onload=
          ()=>{

            const output=
              document.createElement(
                'canvas'
              );


            output.width=424;
            output.height=488;


            const outputContext=
              output.getContext(
                '2d'
              );


            outputContext.fillStyle=
              '#fff';


            outputContext.fillRect(
              0,
              0,
              424,
              488
            );


            outputContext.drawImage(
              image,
              0,
              0
            );


            output.toBlob(
              png=>
                saveBlob(
                  png,
                  `metron-coding-benchmark-${stamp()}.png`
                ),
              'image/png',
              1
            );


            URL.revokeObjectURL(
              url
            );

          };


        image.src=url;

      }
    );



  translateSvgButton
    ?.addEventListener(
      'click',
      ()=>{

        const spec =
          translationSvgSpec();


        saveBlob(
          new Blob(
            [
              spec.svg
            ],
            {
              type:
                'image/svg+xml;charset=utf-8'
            }
          ),
          spec.filename
          +
          '-'
          +
          stamp()
          +
          '.svg'
        );

      }
    );


  translatePngButton
    ?.addEventListener(
      'click',
      ()=>{

        const spec =
          translationSvgSpec();


        const blob =
          new Blob(
            [
              spec.svg
            ],
            {
              type:
                'image/svg+xml;charset=utf-8'
            }
          );


        const url =
          URL.createObjectURL(
            blob
          );


        const image =
          new Image();


        image.onload =
          ()=>{

            const output =
              document.createElement(
                'canvas'
              );


            output.width =
              spec.width;


            output.height =
              spec.height;


            const outputContext =
              output.getContext(
                '2d'
              );


            outputContext.fillStyle =
              '#fff';


            outputContext.fillRect(
              0,
              0,
              spec.width,
              spec.height
            );


            outputContext.drawImage(
              image,
              0,
              0,
              spec.width,
              spec.height
            );


            output.toBlob(
              png=>{

                saveBlob(
                  png,
                  spec.filename
                  +
                  '-'
                  +
                  stamp()
                  +
                  '.png'
                );

              },
              'image/png',
              1
            );


            URL.revokeObjectURL(
              url
            );

          };


        image.onerror =
          ()=>{

            URL.revokeObjectURL(
              url
            );

          };


        image.src =
          url;

      }
    );


  /* ========================================================
     EVENTS — ONLY THESE EXIST AFTER CLEANUP
     ======================================================== */

  report.addEventListener(
    'change',
    ()=>{

      configureControls();

      scheduleRender();

    }
  );


  metric.addEventListener(
    'change',
    scheduleRender
  );


  count.addEventListener(
    'change',
    scheduleRender
  );


  trendScale
    ?.addEventListener(
      'change',
      scheduleRender
    );


  landscapeX
    ?.addEventListener(
      'change',
      scheduleRender
    );


  landscapeY
    ?.addEventListener(
      'change',
      scheduleRender
    );


  svgStyle
    ?.addEventListener(
      'change',
      scheduleRender
    );


  configureControls();

  scheduleRender();

})();
