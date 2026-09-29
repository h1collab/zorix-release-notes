(()=>{
  'use strict';

  let DATA=window.ZORIX_REQUEST_USAGE||{models:[],updatedAt:''};

  const chart=document.getElementById('chart');
  const count=document.getElementById('count');
  const snapshot=document.getElementById('requestSnapshotText');

  const providerColors={
    Zorix:'#7b4bea',
    OpenAI:'#111111',
    Anthropic:'#cc785c',
    Google:'#34a853',
    DeepSeek:'#2243e6',
    Tencent:'#00a7ce',
    'Moonshot AI':'#047afe',
    Meta:'#0089f4',
    NVIDIA:'#76b900',
    'Z.ai':'#1c7ff8',
    Xiaomi:'#ff6900',
    Alibaba:'#ff7018',
    'Mistral AI':'#f06f2f',
    xAI:'#736cd3'
  };

  const esc=value=>String(value??'')
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');

  function fmt(value){
    const n=Number(value||0);
    if(n>=1e15) return (n/1e15).toFixed(2).replace(/\.00$/,'')+'P';
    if(n>=1e12) return (n/1e12).toFixed(2).replace(/\.00$/,'')+'T';
    if(n>=1e9) return (n/1e9).toFixed(2).replace(/\.00$/,'')+'B';
    if(n>=1e6) return (n/1e6).toFixed(2).replace(/\.00$/,'')+'M';
    if(n>=1e3) return (n/1e3).toFixed(2).replace(/\.00$/,'')+'K';
    return Math.round(n).toLocaleString('en-US');
  }

  function normalize(raw){
    const rows=Array.isArray(raw?.models)?raw.models.map(item=>({...item})):[];
    const total=rows.reduce((sum,item)=>sum+Number(item.requests||0),0);
    rows.forEach(item=>{
      const value=Number(item.requests||0);
      item.share=total?value/total*100:0;
    });
    return {...raw,totalRequests:total,models:rows};
  }

  async function refresh(){
    try{
      const response=await fetch('/data/model-requests.json',{
        cache:'no-store',
        headers:{'Cache-Control':'no-cache','Pragma':'no-cache'}
      });
      if(!response.ok) throw new Error('model-requests.json returned '+response.status);
      DATA=normalize(await response.json());
    }catch(error){
      console.warn('Request Share canonical refresh failed; using versioned fallback.',error);
      DATA=normalize(DATA);
    }
    render();
  }

  function render(){
    const limit=Math.max(1,Math.min(30,Number(count?.value||10)));
    const rows=[...(DATA.models||[])]
      .filter(item=>Number(item.requests||0)>0)
      .sort((a,b)=>Number(b.requests||0)-Number(a.requests||0))
      .slice(0,limit);

    const W=1200;
    const H=820;
    const plot={x:68,y:150,w:1064,h:430};
    const max=Math.max(1,...rows.map(item=>Number(item.requests||0)));
    const slot=plot.w/Math.max(1,rows.length);
    const barW=Math.max(24,Math.min(74,slot*.68));

    let grid='';
    for(let i=0;i<=4;i++){
      const y=plot.y+plot.h-(plot.h*i/4);
      grid+=`<line x1="${plot.x}" x2="${plot.x+plot.w}" y1="${y}" y2="${y}" stroke="#dedede" stroke-dasharray="3 5"/>`;
    }

    const bars=rows.map((item,index)=>{
      const value=Number(item.requests||0);
      const h=value/max*plot.h;
      const x=plot.x+slot*index+(slot-barW)/2;
      const y=plot.y+plot.h-h;
      const color=providerColors[item.provider]||'#444';
      const label=String(item.name||item.id||'');
      const short=label.length>18?label.slice(0,17)+'…':label;
      const provider=String(item.provider||'');
      return `
        <rect x="${x}" y="${y}" width="${barW}" height="${h}" rx="6" fill="${color}">
          <title>${esc(label)} · ${fmt(value)} requests · ${Number(item.share||0).toFixed(2)}%</title>
        </rect>
        <text x="${x+barW/2}" y="${Math.min(plot.y+plot.h-16,y+Math.max(24,h*.48))}" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" font-weight="700" fill="#fff">${Number(item.share||0).toFixed(1)}%</text>
        <text x="${x+barW/2}" y="${plot.y+plot.h+26}" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" font-weight="700" fill="#111">${esc(provider)}</text>
        <text x="${x+barW/2}" y="${plot.y+plot.h+44}" text-anchor="middle" font-family="Arial,sans-serif" font-size="9" fill="#606060">${esc(short)}</text>
      `;
    }).join('');

    const legend=rows.slice(0,12).map((item,index)=>{
      const col=index<6?0:1;
      const row=index%6;
      const x=74+col*520;
      const y=674+row*20;
      const color=providerColors[item.provider]||'#444';
      return `
        <circle cx="${x}" cy="${y}" r="5" fill="${color}"/>
        <text x="${x+12}" y="${y+4}" font-family="Arial,sans-serif" font-size="11" fill="#111">#${index+1} ${esc(item.name)} · ${fmt(item.requests)}</text>
      `;
    }).join('');

    chart.setAttribute('viewBox',`0 0 ${W} ${H}`);
    chart.innerHTML=`
      <rect width="${W}" height="${H}" fill="#fff"/>
      <text x="30" y="48" font-family="Georgia,serif" font-size="29" font-weight="600" fill="#111">Zorix Metron Request Index</text>
      <text x="30" y="77" font-family="Arial,sans-serif" font-size="13" fill="#777">Published request snapshot · higher is more observed request volume</text>
      <text x="1170" y="49" text-anchor="end" font-family="Arial,sans-serif" font-size="15" font-weight="700" fill="#7b4bea">Zorix Metron</text>
      ${grid}
      ${bars}
      <line x1="${plot.x}" x2="${plot.x+plot.w}" y1="${plot.y+plot.h}" y2="${plot.y+plot.h}" stroke="#111"/>
      <text x="30" y="625" font-family="Georgia,serif" font-size="22" font-weight="600" fill="#111">Current ranking</text>
      <text x="30" y="651" font-family="Arial,sans-serif" font-size="11" fill="#777">Snapshot: ${esc(DATA.updatedAt||'not dated')} · total ${fmt(DATA.totalRequests||0)} requests</text>
      ${legend}
    `;

    if(snapshot){
      snapshot.textContent=`Published request snapshot · ${DATA.updatedAt||'not dated'} · ${fmt(DATA.totalRequests||0)} requests`;
    }
  }

  function svgText(){
    const clone=chart.cloneNode(true);
    clone.setAttribute('xmlns','http://www.w3.org/2000/svg');
    return '<?xml version="1.0" encoding="UTF-8"?>\n'+clone.outerHTML;
  }

  function downloadBlob(blob,filename){
    if(!blob) return;
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url;
    a.download=filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  }

  document.getElementById('downloadSvg')?.addEventListener('click',()=>{
    downloadBlob(new Blob([svgText()],{type:'image/svg+xml;charset=utf-8'}),'zorix-request-share.svg');
  });

  document.getElementById('downloadPng')?.addEventListener('click',()=>{
    const blob=new Blob([svgText()],{type:'image/svg+xml;charset=utf-8'});
    const url=URL.createObjectURL(blob);
    const image=new Image();
    image.onload=()=>{
      const canvas=document.createElement('canvas');
      canvas.width=2400;
      canvas.height=1640;
      const ctx=canvas.getContext('2d');
      ctx.fillStyle='#fff';
      ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.drawImage(image,0,0,canvas.width,canvas.height);
      canvas.toBlob(output=>downloadBlob(output,'zorix-request-share.png'),'image/png',1);
      URL.revokeObjectURL(url);
    };
    image.src=url;
  });

  document.getElementById('share')?.addEventListener('click',async()=>{
    const url=location.href;
    if(navigator.share){
      try{
        await navigator.share({title:'Zorix Metron · Request Share',text:'Current published request distribution.',url});
        return;
      }catch(error){
        if(error?.name==='AbortError') return;
      }
    }
    try{
      await navigator.clipboard.writeText(url);
      const button=document.getElementById('share');
      if(button){
        const old=button.textContent;
        button.textContent='Link copied';
        setTimeout(()=>{button.textContent=old;},1400);
      }
    }catch(error){}
  });

  count?.addEventListener('change',render);
  refresh();
})();
