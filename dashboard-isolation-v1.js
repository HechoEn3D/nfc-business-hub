/* NFC Business Hub — Dashboard View Isolation V1 */
(function(){
  'use strict';
  if(/^\/b\//i.test(location.pathname)) return;
  if(window.__NFC_DASHBOARD_ISOLATION_V1) return;
  window.__NFC_DASHBOARD_ISOLATION_V1=true;
  const STYLE_ID='nfc-dashboard-isolation-css';
  function install(){
    if(!document.getElementById(STYLE_ID)){
      const s=document.createElement('style');
      s.id=STYLE_ID;
      s.textContent='.dash-main > .dash-view{display:none!important}.dash-main > .dash-view.active{display:block!important}';
      document.head.appendChild(s);
    }
  }
  function normalize(){
    const views=[...document.querySelectorAll('.dash-main > .dash-view')];
    if(!views.length)return;
    const active=views.filter(v=>v.classList.contains('active'));
    const target=active[0]||views[0];
    views.forEach(v=>v.classList.toggle('active',v===target));
  }
  function bind(){
    document.querySelectorAll('.sidebar .side-item[data-dash-section]').forEach(item=>{
      if(item.dataset.nfcIsolationBound)return;
      item.dataset.nfcIsolationBound='1';
      item.addEventListener('click',()=>setTimeout(normalize,0),true);
    });
  }
  function boot(){install();normalize();bind();}
  const timer=setInterval(()=>{boot();if(document.querySelector('.dash-main')){clearInterval(timer);setTimeout(boot,250);setTimeout(boot,1000)}},300);
  boot();
})();
