/* NFC Business Hub — Appearance Media V3
   Safe visual extension: preview/public only. Never styles the dashboard document. */
(function(){
  'use strict';
  if(window.__NFC_APPEARANCE_MEDIA_V3)return;
  window.__NFC_APPEARANCE_MEDIA_V3=true;

  const URL='https://znegwqcdaxqfzbjyzija.supabase.co';
  const KEY='sb_publishable_OxUV1v29_QwhZQyy7Skg3w_-f1gTcre';
  let client=null;
  let business=null;
  let localConfig={};

  const THEMES={
    minimal:{name:'Minimal',tag:'Clean / contemporary',accent:'#171714',bg:'#f5f3ee',card:'#ffffff',font:'Inter',buttonStyle:'filled'},
    elegant:{name:'Maison',tag:'Luxury / hospitality',accent:'#8b6b3f',bg:'#f7f3ec',card:'#fffdf8',font:'Georgia',buttonStyle:'filled'},
    modern:{name:'Swiss',tag:'Swiss / precision',accent:'#2457d6',bg:'#f5f7fb',card:'#ffffff',font:'Inter',buttonStyle:'filled'},
    bold:{name:'Studio',tag:'Bold / editorial',accent:'#b34d40',bg:'#f7f2f0',card:'#ffffff',font:'Inter',buttonStyle:'filled'},
    midnight:{name:'Obsidian',tag:'Dark / premium',accent:'#d8b675',bg:'#11110f',card:'#1c1c19',font:'Inter',buttonStyle:'filled'},
    editorial:{name:'Atelier',tag:'Warm / crafted',accent:'#5d4037',bg:'#f3eee8',card:'#fbf8f4',font:'Georgia',buttonStyle:'outline'}
  };

  const getClient=()=>client||(client=window.supabase?.createClient(URL,KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}}));
  const msg=t=>window.notify?window.notify(t):console.log(t);
  const esc=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[c]));
  const normalize=c=>Object.assign({preset:'minimal',accent:'#171714',bg:'#f5f3ee',card:'#ffffff',font:'Inter',buttonStyle:'filled',logoUrl:'',coverImage:''},c||{});

  function getPreviewDoc(){return document.getElementById('nfcApIframe')?.contentDocument||null}

  function buildTheme(theme){
    const common='body{overflow-x:hidden!important}.public-card{overflow:hidden!important}.public-cover{position:relative!important}.public-cover::after{pointer-events:none!important}.public-action{transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease!important}.public-action:hover{transform:translateY(-2px)!important}.public-menu-card,.public-highlight,.public-promo-card,.public-hero-extra{transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease!important}';
    const themes={
      minimal:`${common}body{background:#f7f6f2!important;color:#161616!important;font-family:Inter,ui-sans-serif,system-ui,sans-serif!important}.public-card{border:1px solid #dedbd2!important;border-radius:24px!important;box-shadow:0 18px 55px rgba(20,20,16,.07)!important}.public-cover{background:linear-gradient(145deg,#181816,#33332d)!important}.public-action{background:#fff!important;color:#171714!important;border:1px solid #dedbd2!important;border-radius:12px!important}.public-action span{color:#6d6a63!important}.public-content{padding:22px!important}.public-menu-card{border-radius:14px!important;background:#fbfaf7!important}.public-footer{border-top:1px solid #e5e1d8!important}`,
      elegant:`${common}body{background:#f5f0e8!important;color:#2c241e!important;font-family:Georgia,serif!important}.public-card{background:#fbf8f2!important;border:1px solid #d8c9b5!important;border-radius:6px!important;box-shadow:0 24px 75px rgba(61,43,23,.13)!important}.public-cover{background:linear-gradient(145deg,#241b16,#5b4939)!important}.public-cover::before{content:"";position:absolute;inset:14px;border:1px solid rgba(216,182,117,.42);z-index:1;pointer-events:none}.public-action{border:0!important;border-right:1px solid #d8c9b5!important;border-radius:0!important;background:#efe6d8!important;color:#47372a!important}.public-action span{font-family:Inter,sans-serif!important;color:#776556!important;text-transform:uppercase!important;letter-spacing:.08em!important}.public-content{padding:30px!important}.public-menu-card{border:0!important;border-bottom:1px solid #ddd0bd!important;border-radius:0!important;background:transparent!important}.public-menu-card strong{color:#8a6b45!important}.public-highlight{background:#efe3d1!important;border:1px solid #dfcfb6!important;border-radius:4px!important}.public-footer{background:#2a201b!important;color:#c9bcac!important}`,
      modern:`${common}body{background:#f0f3f7!important;color:#151a21!important;font-family:Inter,Arial,sans-serif!important}.public-card{border:1px solid #d9e0e8!important;border-radius:18px!important;background:#fff!important;box-shadow:0 18px 48px rgba(25,39,57,.1)!important}.public-cover{background:#14181e!important}.public-action{background:#f8fafc!important;border:1px solid #dce3eb!important;border-radius:10px!important;color:#17315f!important}.public-action span{color:#65707e!important}.public-menu-card{background:#f8fafc!important;border:1px solid #e3e8ef!important;border-radius:10px!important}.public-menu-card strong{color:#2457d6!important}`,
      bold:`${common}body{background:#f1ece6!important;color:#1d1917!important;font-family:Inter,Arial,sans-serif!important}.public-card{border:0!important;border-radius:0!important;box-shadow:0 28px 85px rgba(54,39,28,.15)!important;background:#fbf8f3!important}.public-cover{background:linear-gradient(135deg,#272321,#a44e40)!important}.public-cover h1{font-weight:900!important;letter-spacing:-.075em!important}.public-action{background:#1e1b19!important;color:#fff!important;border:0!important;border-radius:4px!important;text-align:left!important}.public-content{padding:26px!important}.public-menu-card{background:#fff!important;border:1px solid #e2d9cf!important;border-radius:4px!important}.public-menu-card strong{color:#a44e40!important}.public-highlight{border-radius:4px!important;background:#e9ddd0!important;border:0!important}`,
      midnight:`${common}body{background:#090909!important;color:#fff!important;font-family:Inter,Arial,sans-serif!important}.public-card{background:#10100f!important;border:1px solid #2e2d29!important;border-radius:22px!important;box-shadow:0 35px 95px rgba(0,0,0,.45)!important}.public-cover{background:linear-gradient(135deg,#060606,#25231e)!important}.public-action{background:#181816!important;color:#fff!important;border:1px solid #35332c!important;border-radius:14px!important}.public-action span{color:#a9a59b!important}.public-content{background:#10100f!important}.public-menu-card{background:#171714!important;border:1px solid #2f2d28!important;border-radius:14px!important}.public-menu-card strong,.public-section-title{color:#d8b675!important}.public-highlight{background:#1a1814!important;border:1px solid #383126!important;border-radius:14px!important}.public-footer{background:#0a0a09!important;color:#77746d!important}`,
      editorial:`${common}body{background:#ece4d7!important;color:#2b231f!important;font-family:Georgia,serif!important}.public-card{background:#f7f1e8!important;border:1px solid #d8cbbd!important;border-radius:10px!important;box-shadow:0 22px 70px rgba(64,46,32,.11)!important}.public-cover{background:linear-gradient(135deg,#5a4034,#8d6c56)!important}.public-action{background:#f8f3eb!important;color:#5a4034!important;border:1px solid #d3c5b4!important;border-radius:999px!important}.public-action span{color:#816b5d!important}.public-menu-card{background:#faf5ed!important;border:1px solid #dfd2c2!important;border-radius:10px!important}.public-menu-card strong{color:#6e4938!important}.public-highlight{background:#e8dccb!important;border:1px solid #d7c7b5!important;border-radius:10px!important}`
    };
    return themes[theme]||themes.minimal;
  }

  function applyToDoc(doc){
    if(!doc?.head)return;
    let st=doc.getElementById('nfc-theme-style-v3');
    if(!st){st=doc.createElement('style');st.id='nfc-theme-style-v3';doc.head.appendChild(st)}
    st.textContent=buildTheme(localConfig.preset);
    const cover=doc.querySelector('.public-cover');
    if(cover){
      if(localConfig.coverImage){cover.style.backgroundImage=`linear-gradient(180deg,rgba(0,0,0,.06),rgba(0,0,0,.24)),url("${String(localConfig.coverImage).replace(/"/g,'%22')}")`;cover.style.backgroundSize='cover';cover.style.backgroundPosition='center'}
      else cover.style.removeProperty('background-image');
    }
    const content=doc.querySelector('.public-cover-content');
    if(content){let wrap=content.querySelector('.nfc-media-logo-wrap');if(localConfig.logoUrl){if(!wrap){wrap=doc.createElement('div');wrap.className='nfc-media-logo-wrap';content.prepend(wrap)}wrap.innerHTML=`<img src="${esc(localConfig.logoUrl)}" alt="Logo" style="width:42px;height:42px;border-radius:12px;object-fit:cover;margin-bottom:12px;border:1px solid rgba(255,255,255,.22)">`}else if(wrap)wrap.remove()}
  }

  function applyPreview(){applyToDoc(getPreviewDoc())}

  async function loadBusiness(){
    const c=getClient();if(!c)return null;
    const {data:{user}}=await c.auth.getUser();
    if(!user)return null;
    const {data}=await c.from('businesses').select('id,name,slug,owner_id,appearance_config').eq('owner_id',user.id).maybeSingle();
    business=data||null;localConfig=normalize(data?.appearance_config);return business;
  }

  async function loadPublicConfig(){
    const c=getClient();if(!c)return;
    const slug=decodeURIComponent(location.pathname.match(/^\/b\/([^/]+)\/?$/i)?.[1]||'');
    if(!slug)return;
    const {data}=await c.from('businesses').select('appearance_config').eq('slug',slug).maybeSingle();
    localConfig=normalize(data?.appearance_config);applyToDoc(document);
  }

  async function saveMedia(){
    if(!business)return;
    const c=getClient();if(!c)return;
    const current={...(business.appearance_config||{}),...localConfig};
    const {error}=await c.from('businesses').update({appearance_config:current}).eq('id',business.id).eq('owner_id',business.owner_id);
    if(error){msg('No se pudo guardar las imágenes');return}
    business.appearance_config=current;localConfig=normalize(current);msg('Imágenes guardadas ✓');applyPreview();
  }

  function injectCss(){
    if(document.getElementById('nfc-media-v3-css'))return;
    const s=document.createElement('style');s.id='nfc-media-v3-css';s.textContent=`
      .nfc-media-preview{display:flex;gap:10px;align-items:center;margin-top:8px}.nfc-media-thumb{width:48px;height:48px;border-radius:12px;object-fit:cover;border:1px solid #e6e3db;background:#faf9f5}.nfc-media-empty{font-size:11px;color:#8a877f}.nfc-media-input{width:100%;padding:10px 11px;border:1px solid #e6e3db;border-radius:11px;background:#faf9f5;outline:none;font-size:12px}.nfc-media-actions{display:flex;gap:7px;margin-top:8px}.nfc-media-btn{border:1px solid #e6e3db;background:#fff;border-radius:11px;padding:8px 10px;font-size:11px;font-weight:800;cursor:pointer}.nfc-media-btn.primary{background:#171714;color:#fff;border-color:#171714}.nfc-media-logo-wrap{position:relative;z-index:2}.nfc-theme-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-top:9px}.nfc-theme-card{border:1px solid #e6e3db;background:#fff;border-radius:14px;padding:11px;text-align:left;cursor:pointer;overflow:hidden;min-height:72px}.nfc-theme-card strong{display:block;font-size:11px}.nfc-theme-card span{display:block;font-size:9px;color:#8a877f;margin-top:3px}.nfc-theme-card.active{border-color:#171714;box-shadow:inset 0 0 0 1px #171714;background:#faf9f5}
      #nfcDashboardScopeGuard{display:none!important}
    `;document.head.appendChild(s)
  }

  function addControls(){
    const panel=document.querySelector('#nfcAppearanceView .nfc-ap-panel');if(!panel||panel.querySelector('[data-nfc-media-v3]'))return;
    const sec=document.createElement('div');sec.className='nfc-ap-section';sec.dataset.nfcMediaV3='1';
    sec.innerHTML=`<div class="nfc-ap-section-title">Dirección visual</div><div class="nfc-media-empty">Identidades completas para la web pública.</div><div class="nfc-theme-grid">${Object.entries(THEMES).map(([id,t])=>`<button type="button" class="nfc-theme-card" data-theme="${id}"><strong>${t.name}</strong><span>${t.tag}</span></button>`).join('')}</div><div style="height:10px"></div><label class="nfc-media-empty">Logo público</label><input id="nfcMediaLogoV3" class="nfc-media-input" value="${esc(localConfig.logoUrl||'')}" placeholder="https://…/logo.png"><label class="nfc-media-empty" style="display:block;margin-top:8px">Foto de portada</label><input id="nfcMediaCoverV3" class="nfc-media-input" value="${esc(localConfig.coverImage||'')}" placeholder="https://…/foto.jpg"><div class="nfc-media-actions"><button id="nfcMediaApplyV3" type="button" class="nfc-media-btn">Vista previa</button><button id="nfcMediaSaveV3" type="button" class="nfc-media-btn primary">Guardar</button></div>`;
    const save=panel.querySelector('#nfcApSave');panel.insertBefore(sec,save||null);
    const refresh=()=>sec.querySelectorAll('[data-theme]').forEach(b=>b.classList.toggle('active',b.dataset.theme===localConfig.preset));
    sec.querySelectorAll('[data-theme]').forEach(btn=>btn.addEventListener('click',()=>{localConfig={...localConfig,preset:btn.dataset.theme};document.querySelector(`[data-ap-preset="${btn.dataset.theme}"]`)?.click();setTimeout(()=>{refresh();applyPreview()},30)}));
    const logo=sec.querySelector('#nfcMediaLogoV3'),cover=sec.querySelector('#nfcMediaCoverV3');
    const render=()=>{localConfig={...localConfig,logoUrl:logo.value.trim(),coverImage:cover.value.trim()};applyPreview();refresh()};
    sec.querySelector('#nfcMediaApplyV3').onclick=render;
    sec.querySelector('#nfcMediaSaveV3').onclick=async()=>{render();await saveMedia()};
    refresh();
  }

  function dashboardIsolation(){
    if(location.pathname.match(/^\/b\//i))return;
    if(document.getElementById('nfc-dashboard-scope-v3'))return;
    const s=document.createElement('style');s.id='nfc-dashboard-scope-v3';s.textContent='.dash-main > .dash-view{display:none!important}.dash-main > .dash-view.active{display:block!important}';document.head.appendChild(s);

    const getViews=()=>[...document.querySelectorAll('.dash-main > .dash-view')];
    const activate=section=>{
      const views=getViews();if(!views.length)return;
      let target=null;
      if(section==='appearance')target=document.getElementById('nfcAppearanceView');
      else if(section==='settings')target=document.getElementById('nfcBusinessSettings');
      else target=document.querySelector(`.dash-main > .dash-view[data-dash-view="${CSS.escape(section||'')}"]`);
      views.forEach(v=>v.classList.toggle('active',v===target));
      if(target)target.scrollIntoView({behavior:'auto',block:'start'});
    };
    document.addEventListener('click',e=>{
      const item=e.target.closest?.('.sidebar .side-item');if(!item)return;
      const regular=item.dataset.dashSection;
      if(regular){setTimeout(()=>activate(regular),0);return}
      if(item.dataset.nfcAppearance){setTimeout(()=>activate('appearance'),0);return}
      if(item.dataset.nfcV6Settings){setTimeout(()=>activate('settings'),0);return}
      if(item.classList.contains('nfc-core-nav-item')){setTimeout(()=>getViews().forEach(v=>v.classList.remove('active')),0)}
    },true);
    const observer=new MutationObserver(()=>{const views=getViews();if(!views.length)return;const active=views.filter(v=>v.classList.contains('active'));if(active.length>1){active.slice(1).forEach(v=>v.classList.remove('active'))}});
    observer.observe(document.querySelector('.dash-main')||document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
    const boot=()=>{const views=getViews();if(views.length&&!views.some(v=>v.classList.contains('active')))views[0].classList.add('active')};
    boot();
  }

  function hook(){
    injectCss();dashboardIsolation();
    let tries=0;const timer=setInterval(()=>{tries++;if(document.getElementById('nfcAppearanceView')){addControls();clearInterval(timer)}if(tries>80)clearInterval(timer)},250);
  }

  async function init(){
    if(/^\/b\//i.test(location.pathname)){await loadPublicConfig();return}
    await loadBusiness();hook();
  }

  window.NFCBusinessAppearanceMedia={init,apply:applyToDoc,themes:THEMES};
  init();
})();
