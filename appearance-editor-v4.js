/* NFC Business Hub — Appearance Editor V5
   Important: preview-only. Changes are rendered inside the iframe and never applied to the dashboard document. */
(function(){
  'use strict';
  const URL='https://znegwqcdaxqfzbjyzija.supabase.co';
  const KEY='sb_publishable_OxUV1v29_QwhZQyy7Skg3w_-f1gTcre';
  const PRESETS={
    minimal:{name:'Minimal',accent:'#171714',bg:'#f5f3ee',card:'#ffffff',radius:22,buttonRadius:14,shadow:'soft',font:'Inter',cover:'solid',spacing:16,buttonStyle:'filled'},
    elegant:{name:'Elegant',accent:'#8b6b3f',bg:'#f7f3ec',card:'#fffdf8',radius:26,buttonRadius:999,shadow:'soft',font:'Georgia',cover:'gradient',spacing:20,buttonStyle:'filled'},
    modern:{name:'Modern',accent:'#2457d6',bg:'#f5f7fb',card:'#ffffff',radius:16,buttonRadius:11,shadow:'medium',font:'Inter',cover:'gradient',spacing:13,buttonStyle:'filled'},
    bold:{name:'Bold',accent:'#b34d40',bg:'#f7f2f0',card:'#ffffff',radius:28,buttonRadius:999,shadow:'strong',font:'Inter',cover:'solid',spacing:21,buttonStyle:'filled'},
    midnight:{name:'Midnight',accent:'#d8b675',bg:'#11110f',card:'#1c1c19',radius:24,buttonRadius:14,shadow:'strong',font:'Inter',cover:'dark',spacing:18,buttonStyle:'filled'},
    editorial:{name:'Editorial',accent:'#5d4037',bg:'#f3eee8',card:'#fbf8f4',radius:9,buttonRadius:8,shadow:'none',font:'Georgia',cover:'photo',spacing:15,buttonStyle:'outline'}
  };
  const FONTS={Inter:'Inter,ui-sans-serif,system-ui,sans-serif',Georgia:'Georgia,serif',Arial:'Arial,sans-serif','Trebuchet MS':'"Trebuchet MS",sans-serif','Courier New':'"Courier New",monospace'};
  const SHADOWS={none:'none',soft:'0 12px 30px rgba(20,20,16,.07)',medium:'0 18px 45px rgba(20,20,16,.11)',strong:'0 26px 70px rgba(20,20,16,.18)'};
  let client=null,business=null,config={};
  const getClient=()=>client||(client=window.supabase?.createClient(URL,KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}}));
  const normalize=c=>Object.assign({preset:'minimal',accent:'#171714',bg:'#f5f3ee',card:'#ffffff',radius:22,buttonRadius:14,shadow:'soft',font:'Inter',cover:'solid',spacing:16,buttonStyle:'filled',buttonText:'#ffffff',borderWidth:1,cardBorder:true,heroHeight:220,compactActions:false},c||{});
  const message=t=>window.notify?window.notify(t):console.log(t);
  const num=v=>Number.isFinite(Number(v))?Number(v):0;
  const esc=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[c]));

  function uiCss(){
    if(document.getElementById('nfc-ap-v5-css'))return;
    const s=document.createElement('style');s.id='nfc-ap-v5-css';s.textContent=`
      #nfcAppearanceView{padding-bottom:40px}.nfc-ap-wrap{display:grid;grid-template-columns:360px minmax(0,1fr);gap:18px;align-items:start}.nfc-ap-panel{background:#fff;border:1px solid #e6e3db;border-radius:22px;padding:18px;position:sticky;top:16px;max-height:calc(100vh - 32px);overflow:auto}.nfc-ap-section{padding:14px 0;border-bottom:1px solid #eeeae1}.nfc-ap-section:last-child{border-bottom:0}.nfc-ap-section-title{font-size:10px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;color:#8b7a59;margin-bottom:9px}.nfc-ap-row{display:flex;gap:7px;flex-wrap:wrap}.nfc-ap-btn{border:1px solid #e6e3db;background:#fff;border-radius:12px;padding:9px 11px;font-weight:800;cursor:pointer;font-size:11px}.nfc-ap-btn.active{border-color:#171714;box-shadow:inset 0 0 0 1px #171714;background:#faf9f5}.nfc-ap-control{display:grid;gap:7px;padding:8px 0;font-size:12px}.nfc-ap-control>span{font-weight:700;color:#5f5b54}.nfc-ap-color{width:100%;height:42px;padding:2px;border:1px solid #ddd7ca;border-radius:10px;background:#fff}.nfc-ap-range{width:100%}.nfc-ap-select{width:100%;padding:10px 11px;border:1px solid #e6e3db;border-radius:11px;background:#faf9f5;outline:none;font-size:12px}.nfc-ap-check{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:8px 0;font-size:12px}.nfc-ap-check input{width:17px;height:17px;accent-color:#171714}.nfc-ap-save{margin-top:14px;width:100%;border:0;background:#171714;color:#fff;border-radius:14px;padding:13px;font-weight:900;cursor:pointer}.nfc-ap-save:disabled{opacity:.45}.nfc-ap-preview{min-height:820px;border-radius:24px;overflow:hidden;background:#eceae4;border:1px solid #e6e3db;padding:16px}.nfc-ap-preview-head{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:12px}.nfc-ap-preview-head strong{font-size:13px}.nfc-ap-preview-head span{font-size:11px;color:#77746d}.nfc-ap-iframe-wrap{width:min(540px,100%);margin:0 auto;background:#111;border-radius:34px;padding:9px;box-shadow:0 24px 70px rgba(20,20,16,.16)}.nfc-ap-iframe{display:block;width:100%;height:760px;border:0;border-radius:26px;background:#fff}.nfc-ap-hint{font-size:11px;color:#77746d;text-align:center;margin-top:10px;line-height:1.45}.nfc-ap-note{margin-top:12px;padding:11px 12px;border:1px solid #eadfc9;background:#fff8e9;border-radius:13px;color:#6f5b37;font-size:11px;line-height:1.45}
      @media(max-width:900px){.nfc-ap-wrap{grid-template-columns:1fr}.nfc-ap-panel{position:relative;top:auto;max-height:none}.nfc-ap-preview{min-height:690px;padding:9px}.nfc-ap-iframe{height:690px}}@media(max-width:620px){.nfc-ap-preview{border-radius:18px}.nfc-ap-iframe-wrap{border-radius:25px;padding:7px}.nfc-ap-iframe{height:700px;border-radius:20px}}
    `;document.head.appendChild(s);
  }

  function buildStyle(){
    const font=FONTS[config.font]||FONTS.Inter;
    const shadow=SHADOWS[config.shadow]||SHADOWS.soft;
    const cover=config.cover==='gradient'?`linear-gradient(135deg,${config.accent},#2b2a26)`:config.cover==='dark'?'linear-gradient(135deg,#080807,#24241f)':config.cover==='photo'?'linear-gradient(135deg,#4d5a4a,#9a8a67)':config.accent;
    return `
      :root{--nfc-public-accent:${config.accent};--nfc-public-bg:${config.bg};--nfc-public-card:${config.card};--nfc-public-cover:${cover};--nfc-public-soft:${config.bg}}
      body{background:${config.bg}!important;font-family:${font}!important}
      #publicBusinessPage{background:${config.bg}!important}
      #publicBusinessPage .public-card{background:${config.card}!important;border-radius:${config.radius}px!important;box-shadow:${shadow}!important}
      #publicBusinessPage .public-cover{background:${cover}!important;min-height:${config.heroHeight}px!important;padding:${Math.max(24,config.spacing*1.5)}px!important}
      #publicBusinessPage .public-actions{gap:${Math.max(6,config.spacing/2)}px!important;padding:${config.spacing}px!important;background:${config.card}!important}
      #publicBusinessPage .public-action{background:${config.buttonStyle==='outline'?'transparent':config.accent}!important;color:${config.buttonStyle==='outline'?config.accent:config.buttonText}!important;border:${config.borderWidth}px solid ${config.accent}!important;border-radius:${config.buttonRadius}px!important}
      #publicBusinessPage .public-content{padding:${config.spacing+4}px!important;background:${config.card}!important}
      #publicBusinessPage .public-highlight,#publicBusinessPage .public-hero-extra,#publicBusinessPage .public-menu-card,#publicBusinessPage .public-promo-card{background:${config.card}!important;border-radius:${config.radius}px!important;${config.cardBorder?`border:${config.borderWidth}px solid rgba(0,0,0,.08)!important;`:'border:0!important;'}box-shadow:${config.shadow==='strong'?shadow:'none'}!important}
      #publicBusinessPage .public-section-title{color:${config.accent}!important}
      #publicBusinessPage .public-menu-card strong{color:${config.accent}!important}
      #publicBusinessPage .public-footer{background:${config.card}!important}
      #publicBusinessPage .public-category-tabs button.active{background:${config.accent}!important;border-color:${config.accent}!important}
    `;
  }

  function applyToPreview(){
    const frame=document.getElementById('nfcApIframe');
    const doc=frame?.contentDocument;
    if(!doc?.head)return;
    let st=doc.getElementById('nfc-live-appearance-style');
    if(!st){st=doc.createElement('style');st.id='nfc-live-appearance-style';doc.head.appendChild(st)}
    st.textContent=buildStyle();
  }

  function setConfig(next){
    config=normalize(next);
    syncControls();
    // CRITICAL: never apply appearance to dashboard document. Preview only.
    applyToPreview();
  }

  function syncControls(){
    const map={nfcApColor:config.accent,nfcApBg:config.bg,nfcApCard:config.card,nfcApRadius:config.radius,nfcApButtonRadius:config.buttonRadius,nfcApSpacing:config.spacing,nfcApHero:config.heroHeight};
    Object.entries(map).forEach(([id,v])=>{const e=document.getElementById(id);if(e)e.value=v});
    const selects={nfcApFont:config.font,nfcApShadow:config.shadow,nfcApButtonStyle:config.buttonStyle,nfcApCover:config.cover};
    Object.entries(selects).forEach(([id,v])=>{const e=document.getElementById(id);if(e)e.value=v});
    const cb={nfcApCardBorder:config.cardBorder,nfcApCompactActions:config.compactActions};
    Object.entries(cb).forEach(([id,v])=>{const e=document.getElementById(id);if(e)e.checked=v});
    document.querySelectorAll('[data-ap-preset]').forEach(e=>e.classList.toggle('active',e.dataset.apPreset===config.preset));
  }

  async function loadBusiness(){
    const c=getClient();if(!c)return null;const {data:{user}}=await c.auth.getUser();if(!user)return null;
    const {data}=await c.from('businesses').select('id,name,slug,owner_id,appearance_config').eq('owner_id',user.id).maybeSingle();business=data||null;return business;
  }

  async function save(){
    const c=getClient();if(!c||!business)return;
    const b=document.getElementById('nfcApSave');if(b){b.disabled=true;b.textContent='Guardando…'}
    const {error}=await c.from('businesses').update({appearance_config:config}).eq('id',business.id).eq('owner_id',business.owner_id);
    localStorage.setItem('nfcAppearance:'+business.owner_id,JSON.stringify(config));
    message(error?'No se pudo sincronizar todavía':'Apariencia guardada ✓');
    if(b){b.disabled=false;b.textContent='Guardar apariencia'}
  }

  function control(id,label,type,value,extra){return `<div class="nfc-ap-control"><span>${label}</span>${type==='color'?`<input id="${id}" class="nfc-ap-color" type="color" value="${value}">`:type==='range'?`<input id="${id}" class="nfc-ap-range" type="range" ${extra||''} value="${value}">`:type==='select'?`<select id="${id}" class="nfc-ap-select">${extra}</select>`:''}</div>`}

  function render(){
    if(document.getElementById('nfcAppearanceView'))return;
    const main=document.querySelector('.dash-main');if(!main||!business)return;
    const v=document.createElement('div');v.id='nfcAppearanceView';v.className='dash-view';
    v.innerHTML=`<div class="dash-view-head"><div><h3>Apariencia</h3><p>Personaliza la web pública. Esta vista previa está aislada del dashboard.</p></div></div><div class="nfc-ap-wrap"><div class="nfc-ap-panel">
      <div class="nfc-ap-section"><div class="nfc-ap-section-title">Presets</div><div class="nfc-ap-row">${Object.entries(PRESETS).map(([k,p])=>`<button class="nfc-ap-btn" type="button" data-ap-preset="${k}">${p.name}</button>`).join('')}</div></div>
      <div class="nfc-ap-section"><div class="nfc-ap-section-title">Colores</div>${control('nfcApColor','Color principal','color',config.accent)}${control('nfcApBg','Fondo','color',config.bg)}${control('nfcApCard','Tarjetas','color',config.card)}</div>
      <div class="nfc-ap-section"><div class="nfc-ap-section-title">Tipografía</div>${control('nfcApFont','Fuente','select',config.font,'<option value="Inter">Inter</option><option value="Georgia">Georgia</option><option value="Arial">Arial</option><option value="Trebuchet MS">Trebuchet MS</option><option value="Courier New">Courier New</option>')}</div>
      <div class="nfc-ap-section"><div class="nfc-ap-section-title">Formas y espaciado</div>${control('nfcApRadius','Bordes','range',config.radius,'min="6" max="36" step="1"')}${control('nfcApButtonRadius','Botones','range',config.buttonRadius,'min="4" max="40" step="1"')}${control('nfcApSpacing','Espaciado','range',config.spacing,'min="8" max="28" step="1"')}${control('nfcApHero','Altura portada','range',config.heroHeight,'min="160" max="320" step="5"')}</div>
      <div class="nfc-ap-section"><div class="nfc-ap-section-title">Botones y profundidad</div>${control('nfcApButtonStyle','Estilo de botones','select',config.buttonStyle,'<option value="filled">Rellenos</option><option value="outline">Contorno</option>')}${control('nfcApShadow','Sombras','select',config.shadow,'<option value="none">Sin sombra</option><option value="soft">Suave</option><option value="medium">Media</option><option value="strong">Intensa</option>')}</div>
      <div class="nfc-ap-section"><div class="nfc-ap-section-title">Portada</div>${control('nfcApCover','Estilo','select',config.cover,'<option value="solid">Sólida</option><option value="gradient">Degradado</option><option value="dark">Oscura</option><option value="photo">Editorial</option>')}</div>
      <div class="nfc-ap-section"><div class="nfc-ap-section-title">Componentes</div><label class="nfc-ap-check"><span>Bordes en tarjetas</span><input id="nfcApCardBorder" type="checkbox" ${config.cardBorder?'checked':''}></label><label class="nfc-ap-check"><span>Acciones compactas</span><input id="nfcApCompactActions" type="checkbox" ${config.compactActions?'checked':''}></label></div>
      <div class="nfc-ap-section"><div class="nfc-ap-note">Los cambios de aquí solo afectan a la página pública. El dashboard permanece intacto.</div></div>
      <button id="nfcApSave" class="nfc-ap-save" type="button">Guardar apariencia</button>
    </div><div class="nfc-ap-preview"><div class="nfc-ap-preview-head"><strong>Vista previa real</strong><span>${esc(business.name||'Tu negocio')}</span></div><div class="nfc-ap-iframe-wrap"><iframe id="nfcApIframe" class="nfc-ap-iframe" title="Vista previa de la web pública"></iframe></div><div class="nfc-ap-hint">Los cambios se ven al momento. Guardar los sincroniza con Supabase y la web pública.</div></div></div>`;
    main.appendChild(v);

    v.querySelectorAll('[data-ap-preset]').forEach(b=>b.addEventListener('click',()=>setConfig({...PRESETS[b.dataset.apPreset],preset:b.dataset.apPreset})));
    const input=(id,fn)=>v.querySelector('#'+id)?.addEventListener('input',fn);const change=(id,fn)=>v.querySelector('#'+id)?.addEventListener('change',fn);
    input('nfcApColor',e=>setConfig({...config,accent:e.target.value}));input('nfcApBg',e=>setConfig({...config,bg:e.target.value}));input('nfcApCard',e=>setConfig({...config,card:e.target.value}));input('nfcApRadius',e=>setConfig({...config,radius:num(e.target.value)}));input('nfcApButtonRadius',e=>setConfig({...config,buttonRadius:num(e.target.value)}));input('nfcApSpacing',e=>setConfig({...config,spacing:num(e.target.value)}));input('nfcApHero',e=>setConfig({...config,heroHeight:num(e.target.value)}));change('nfcApFont',e=>setConfig({...config,font:e.target.value}));change('nfcApButtonStyle',e=>setConfig({...config,buttonStyle:e.target.value}));change('nfcApShadow',e=>setConfig({...config,shadow:e.target.value}));change('nfcApCover',e=>setConfig({...config,cover:e.target.value}));change('nfcApCardBorder',e=>setConfig({...config,cardBorder:e.target.checked}));change('nfcApCompactActions',e=>setConfig({...config,compactActions:e.target.checked}));
    v.querySelector('#nfcApSave').addEventListener('click',save);
    const frame=v.querySelector('#nfcApIframe');frame.src=getPublicUrl();frame.addEventListener('load',applyToPreview);syncControls();
  }
  function getPublicUrl(){return business?.slug?`/b/${encodeURIComponent(business.slug)}?nfc_editor=1`:'/'}
  async function applySavedToPublic(){
    const c=getClient();if(!c)return;const slug=decodeURIComponent(location.pathname.match(/^\/b\/([^/]+)\/?$/i)?.[1]||'');if(!slug)return;
    const {data}=await c.from('businesses').select('appearance_config').eq('slug',slug).maybeSingle();if(data?.appearance_config)config=normalize(data.appearance_config);
    // Public page only: this function intentionally applies to the public document.
    const style=buildStyle();let st=document.getElementById('nfc-live-appearance-style');if(!st){st=document.createElement('style');st.id='nfc-live-appearance-style';document.head.appendChild(st)}st.textContent=style;
  }
  function addEntry(){const side=document.querySelector('.sidebar');if(!side||side.querySelector('[data-nfc-appearance]'))return;const item=document.createElement('div');item.className='side-item';item.dataset.nfcAppearance='1';item.textContent='🎨 Apariencia';side.appendChild(item);item.addEventListener('click',()=>{document.querySelectorAll('.dash-view').forEach(x=>x.classList.remove('active'));render();document.getElementById('nfcAppearanceView')?.classList.add('active');document.querySelectorAll('.side-item').forEach(x=>x.classList.remove('active'));item.classList.add('active')})}
  async function init(){uiCss();if(/^\/b\//i.test(location.pathname)){await applySavedToPublic();return}let tries=0;const timer=setInterval(async()=>{tries++;if(!document.querySelector('.dash-main')){if(tries>40)clearInterval(timer);return}const b=business||await loadBusiness();if(b){config=normalize(b.appearance_config);try{if(!b.appearance_config){const local=localStorage.getItem('nfcAppearance:'+b.owner_id);if(local)config=normalize(JSON.parse(local))}}catch{}addEntry();clearInterval(timer)}else if(tries>40)clearInterval(timer)},500)}
  window.NFCAppearanceEditor={init,render,apply:setConfig};init();
})();
