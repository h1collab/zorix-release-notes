(()=>{
  'use strict';

  const root=document.documentElement;
  root.classList.add('aa-global');

  function activeKey(path){
    if(path.startsWith('/models/') || path.startsWith('/number-of-calls/models/')) return 'models';
    if(path.startsWith('/number-request/')) return 'requests';
    if(path.startsWith('/number-of-calls/voting/')) return 'voting';
    if(path.startsWith('/translate/')) return 'translate';
    if(path.startsWith('/status/')) return 'status';
    if(path.startsWith('/number-of-calls/share/') || path==='/share/' || path==='/share') return 'share';
    if(path.startsWith('/number-of-calls/')) return 'usage';
    return 'home';
  }

  function navLink(key,label,href,current){
    return `<a href="${href}"${current===key?' class="active"':''}>${label}</a>`;
  }

  function buildShell(){
    if(!document.body || document.querySelector('.aa-site-header')) return;

    const path=location.pathname || '/';
    const current=activeKey(path);

    const legacy=[...document.body.children].find(el=>el.tagName==='HEADER');
    if(legacy) legacy.classList.add('aa-legacy-header');

    const header=document.createElement('div');
    header.className='aa-site-header';
    header.innerHTML=`
      <nav class="aa-site-nav" aria-label="Primary">
        <a class="aa-site-brand" href="/number-of-calls/">
          <img class="aa-site-logo" src="/number-of-calls/assets/logos/zorix.svg" alt="">
          <span>Zorix Metron</span>
        </a>
        <div class="aa-site-links">
          ${navLink('models','Models','/models/',current)}
          ${navLink('usage','Usage','/number-of-calls/',current)}
          ${navLink('requests','Requests','/number-request/',current)}
          ${navLink('voting','Voting','/number-of-calls/voting/',current)}
          ${navLink('translate','Translate','/translate/',current)}
          ${navLink('status','Status','/status/',current)}
        </div>
        <div class="aa-site-actions">
          <a class="aa-site-action" href="/number-of-calls/share/">Share</a>
          <button class="aa-site-menu-button" type="button" aria-label="Open navigation" aria-expanded="false">☰</button>
        </div>
      </nav>
      <div class="aa-mobile-menu" aria-label="Mobile navigation">
        <a href="/models/">Models</a>
        <a href="/number-of-calls/">Usage</a>
        <a href="/number-request/">Requests</a>
        <a href="/number-of-calls/voting/">Voting</a>
        <a href="/number-of-calls/share/">Share</a>
        <a href="/translate/">Translate</a>
        <a href="/status/">Status</a>
        <a href="/">Updates</a>
      </div>
    `;

    document.body.insertBefore(header,document.body.firstChild);

    const toggle=header.querySelector('.aa-site-menu-button');
    const menu=header.querySelector('.aa-mobile-menu');
    toggle?.addEventListener('click',()=>{
      const open=menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded',String(open));
      toggle.textContent=open?'×':'☰';
    });

    document.addEventListener('click',event=>{
      if(!menu?.classList.contains('open')) return;
      if(header.contains(event.target)) return;
      menu.classList.remove('open');
      toggle?.setAttribute('aria-expanded','false');
      if(toggle) toggle.textContent='☰';
    });
  }

  function decorate(){
    if(!document.body) return;

    const path=location.pathname || '/';
    document.body.classList.add('aa-global-shell','aa-page-'+activeKey(path));

    document.querySelectorAll('table').forEach(table=>{
      table.parentElement?.classList.add('aa-table-parent');
    });

    document.querySelectorAll('section').forEach(section=>{
      if(section.classList.contains('hero')) return;
      if(section.matches('.summary,.section,.benchmark-section,.directory,.preview-section')){
        section.classList.add('aa-research-section');
      }
    });

    document.querySelectorAll('a[href="/number-of-calls/share"],a[href="/number-of-calls/share.html"]').forEach(link=>{
      link.setAttribute('href','/number-of-calls/share/');
    });
  }

  function recoverKnownAliases(){
    const p=(location.pathname || '').replace(/\/+$/,'');
    const aliases={
      '/share':'/number-of-calls/share/',
      '/metron/share':'/number-of-calls/share/',
      '/request-share':'/number-request/share/'
    };
    const target=aliases[p];
    if(target && p!==target.replace(/\/+$/,'')){
      location.assign(target);
      return true;
    }
    return false;
  }

  function start(){
    if(recoverKnownAliases()) return;
    buildShell();
    decorate();
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',start,{once:true});
  }else{
    start();
  }
})();
