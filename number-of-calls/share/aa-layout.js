(()=>{
  'use strict';

  const nav=document.querySelector('.nav');
  const toggle=document.querySelector('.aa-menu-toggle');

  toggle?.addEventListener('click',()=>{
    const open=nav?.classList.toggle('aa-menu-open');
    toggle.setAttribute('aria-expanded',open?'true':'false');
  });

  document.addEventListener('click',event=>{
    if(!nav || !nav.classList.contains('aa-menu-open')) return;
    if(nav.contains(event.target)) return;
    nav.classList.remove('aa-menu-open');
    toggle?.setAttribute('aria-expanded','false');
  });

  const report=document.getElementById('reportType');
  const tabs=[...document.querySelectorAll('[data-report-target]')];

  function syncTabs(){
    if(!report) return;
    tabs.forEach(tab=>{
      tab.classList.toggle('active',tab.dataset.reportTarget===report.value);
    });
  }

  tabs.forEach(tab=>{
    tab.addEventListener('click',()=>{
      if(!report) return;
      const target=tab.dataset.reportTarget;
      if(![...report.options].some(option=>option.value===target)) return;
      report.value=target;
      report.dispatchEvent(new Event('change',{bubbles:true}));
      syncTabs();
      document.querySelector('.aa-workspace')?.scrollIntoView({behavior:'smooth',block:'start'});
    });
  });

  report?.addEventListener('change',syncTabs);
  syncTabs();

  const status=document.getElementById('shareDataStatus');
  const live=document.getElementById('aaLiveDataText');
  if(status && live){
    const sync=()=>{
      const text=(status.textContent||'').trim();
      if(text) live.textContent=text;
    };
    new MutationObserver(sync).observe(status,{childList:true,subtree:true,characterData:true,attributes:true});
    sync();
  }
})();
