/* NFC Business Hub — Appearance Editor V3 */
(function(){
  const URL='https://znegwqcdaxqfzbjyzija.supabase.co';
  const KEY='sb_publishable_OxUV1v29_QwhZQyy7Skg3w_-f1gTcre';
  const PRESETS={
    minimal:{name:'Minimal',accent:'#171714',bg:'#f7f6f2',card:'#ffffff',text:'#171714',muted:'#77746d',radius:18,buttonRadius:14,shadow:'soft',font:'Inter',cover:'solid',spacing:16},
    elegant:{name:'Elegant',accent:'#8b6b3f',bg:'#f7f3ec',card:'#fffdf8',text:'#27231d',muted:'#7c7468',radius:24,buttonRadius:999,shadow:'soft',font:'Georgia',cover:'gradient',spacing:20},
    modern:{name:'Modern',accent:'#2457d6',bg:'#f5f7fb',card:'#ffffff',text:'#172033',muted:'#667085',radius:14,buttonRadius:10,shadow:'medium',font:'Inter',cover:'gradient',spacing:12},
    bold:{name:'Bold',accent:'#b34d40',bg:'#f7f2f0',card:'#ffffff',text:'#201817',muted:'#746765',radius:28,buttonRadius:999,shadow:'strong',font:'Inter',cover:'solid',spacing:22},
    midnight:{name:'Midnight',accent:'#d8b675',bg:'#11110f',card:'#1c1c19',text:'#ffffff',muted:'#b4b0a7',radius:22,buttonRadius:14,shadow:'strong',font:'Inter',cover:'dark',spacing:18},
    editorial:{name:'Editorial',accent:'#5d4037',bg:'#f3eee8',card:'#fbf8f4',text:'#2d2926',muted:'#756d66',radius:8,buttonRadius:8,shadow:'none',font:'Georgia',cover:'photo',spacing:14}
  };
  const FONTS={Inter:'Inter,ui-sans-serif,system-ui,sans-serif',Georgia:'Georgia,serif',Arial:'Arial,sans-serif','Trebuchet MS':'"Trebuchet MS",sans-serif','Courier New':'"Courier New",monospace'};
  const SHADOWS={none:'none',soft:'0 10px 28px rgba(20,20,16,.07)',medium:'0 18px 45px rgba(20,20,16,.11)',strong:'0 26px 70px rgba(20,20,16,.18)'};
  const COVERS={solid:['#2b2a26','#2b2a26'],gradient:['var(--ap-accent)','#2b2a26'],dark:['#080807','#24241f'],photo:['#4d5a4a','#9a8a67']};
  let client=null,business=null,config={};
  const getClient=()=>client||(client=window.supabase?.createClient(URL,KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}}));
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const normalize=c=>Object.assign({preset:'minimal',accent:'#171714',bg:'#f7f6f2',card:'#ffffff',text:'#171714',muted:'#77746d',radius:18,buttonRadius:14,shadow:'soft',font:'Inter',cover:'solid',spacing:16,buttonStyle:'filled',buttonText:'#ffffff',borderWidth:1,cardBorder:true,heroHeight:190,compactActions:false,blockOrder:[]},c||{});

  function uiCss(){
    if(document.getElementById('nfc-appearance-v3-css'))return;
    const s=document.createElement('style');s.id='nfc-appearance-v3-css';s.textContent=`
      #nfcAppearanceView{padding-bottom:36px}.nfc-ap-wrap{display:grid;grid-template-columns:360px 1fr;gap:18px;align-items:start}.nfc-ap-panel{background:#fff;border:1px solid #e6e3db;border-radius:22px;padding:18px;position:sticky;top:16px;max-height:calc(100vh - 32px);overflow:auto}.nfc-ap-panel h4{margin:0 0 12px}.nfc-ap-section{padding:13px 0;border-bottom:1px solid #eeeae1}.nfc-ap-section:last-child{border-bottom:0}.nfc-ap-section-title{font-size:11px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;color:#8b7a59;margin-bottom:9px}.nfc-ap-label{display:block;font-size:11px;font-weight:800;color:#77746d;margin:10px 0 6px}.nfc-ap-row{display:flex;gap:7px;flex-wrap:wrap}.nfc-ap-btn{border:1px solid #e6e3db;background:#fff;border-radius:12px;padding:9px 11px;font-weight:800;cursor:pointer;font-size:11px}.nfc-ap-btn.active{border-color:#171714;box-shadow:inset 0 0 0 1px #171714;background:#faf9f5}.nfc-ap-color{width:46px;height:38px;padding:2px;border:1px solid #ddd7ca;border-radius:10px;background:#fff}.nfc-ap-range{width:100%}.nfc-ap-select{width:100%;padding:10px 11px;border:1px solid #e6e3db;border-radius:11px;background:#faf9f5;outline:none;font-size:12px}.nfc-ap-check{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:8px 0;font-size:12px}.nfc-ap-check input{width:17px;height:17px;accent-color:#171714}.nfc-ap-save{margin-top:14px;width:100%;border:0;background:#171714;color:#fff;border-radius:14px;padding:13px;font-weight:900;cursor:pointer}.nfc-ap-save:disabled{opacity:.45}.nfc-ap-preview{min-height:820px;border-radius:24px;overflow:hidden;background:#eceae4;border:1px solid #e6e3db;padding:16px;position:relative}.nfc-ap-preview-head{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:12px}.nfc-ap-preview-head strong{font-size:13px}.nfc-ap-preview-head span{font-size:11px;color:#77746d}.nfc-ap-mode{border:1px solid #e6e3db;background:#fff;border-radius:999px;padding:8px 12px;font-size:11px;font-weight:900;cursor:pointer}.nfc-ap-mode.active{background:#171714;color:#fff;border-color:#171714}.nfc-ap-iframe-wrap{width:min(520px,100%);margin:0 auto;background:#111;border-radius:34px;padding:9px;box-shadow:0 24px 70px rgba(20,20,16,.16)}.nfc-ap-iframe{display:block;width:100%;height:760px;border:0;border-radius:26px;background:#fff}.nfc-ap-hint{font-size:11px;color:#77746d;text-align:center;margin-top:10px;line-height:1.45}.nfc-ap-note{margin-top:12px;padding:11px 12px;border:1px solid #eadfc9;background:#fff8e9;border-radius:13px;color:#6f5b37;font-size:11px;line-height:1.45}.nfc-ap-control{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:9px 0;font-size:12px}.nfc-ap-palette{display:grid;grid-template-columns:repeat(5,1fr);gap:6px}.nfc-ap-swatch{height:34px;border-radius:10px;border:1px solid rgba(0,0,0,.08);cursor:pointer}.nfc-ap-divider{height:1px;background:#eeeae1;margin:9px 0}.nfc-ap-small{font-size:10px;color:#8a877f}@media(max-width:900px){.nfc-ap-wrap{grid-template-columns:1fr}.nfc-ap-panel{position:relative;top:auto;max-height:none}.nfc-ap-preview{min-height:690px;padding:9px}.nfc-ap-iframe{height:690px}}@media(max-width:620px){.nfc-ap-preview{border-radius:18px}.nfc-ap-iframe-wrap{border-radius:25px;padding:7px}.nfc-ap-iframe{height:700px;border-radius:20px}}
    `;document.head.appendChild(s)
  }

  async function loadBusiness(){const c=getClient();if(!c)return null;const {data:{user}}=await c.auth.getUser();if(!user)return null;const {data}=await c.from('businesses').select('id,name,slug,owner_id,appearance_config').eq('owner_id',user.id).maybeSingle();business=data||null;return business}
  function getPublicUrl(){return business?.slug?`/b/${encodeURIComponent(business.slug)}?nfc_editor=1`:'/'}
  function message(t){window.notify?window.notify(t):console.log(t)}

  function applyConfigToRoot(){
    config=normalize(config);document.documentElement.style.setProperty('--nfc-public-accent',config.accent);document.documentElement.style.setProperty('--nfc-public-bg',config.bg);document.documentElement.style.setProperty('--nfc-public-card',config.card);document.documentElement.style.setProperty('--nfc-public-radius',config.radius+'px');document.documentElement.style.setProperty('--nfc-public-button-radius',config.buttonRadius+'px');document.documentElement.style.setProperty('--nfc-public-font',FONTS[config.font]||config.font);document.querySelectorAll('[data-ap-preset]').forEach(x=>x.classList.toggle('active',x.dataset.apPreset===config.preset));syncControls()
  }
  function syncControls(){const ids={nfcApColor:config.accent,nfcApBg:config.bg,nfcApCard:config.card,nfcApRadius:config.radius,nfcApButtonRadius:config.buttonRadius,nfcApBorder:nfcNum(config.borderWidth),nfcApHero:config.heroHeight,nfcApSpacing:config.spacing};Object.entries(ids).forEach(([id,v])=>{const el=document.getElementById(id);if(el)el.value=v});const selects={nfcApFont:config.font,nfcApShadow:config.shadow,nfcApButtonStyle:config.buttonStyle,nfcApCover:config.cover};Object.entries(selects).forEach(([id,v])=>{const el=document.getElementById(id);if(el)el.value=v});['nfcApCardBorder','nfcApCompactActions'].forEach(id=>{const el=document.getElementById(id);if(el)el.checked=id==='nfcApCardBorder'?config.cardBorder:config.compactActions})}
  function nfcNum(v){const n=Number(v);return Number.isFinite(n)?n:0}

  function blockKey(el){return el?.id||el?.dataset?.nfcBlock||null}
  function getBlocks(doc){return [...doc.querySelectorAll('[data-nfc-block]')].filter(x=>x.closest('#publicBusinessContent .public-card'))}
  function ensureKeys(doc){getBlocks(doc).forEach((el,i)=>{if(!el.dataset.nfcBlock)el.dataset.nfcBlock=`block-${i}`})}

  function buildPublicStyle(){
    const font=FONTS[config.font]||config.font;
    const shadow=SHADOWS[config.shadow]||SHADOWS.soft;
    const cover=COVERS[config.cover]||COVERS.gradient;
    const coverBg=config.cover==='gradient'?`linear-gradient(135deg,${config.accent},#2b2a26)`:config.cover==='dark'?`linear-gradient(135deg,#080807,#24241f)`:config.cover==='photo'?`linear-gradient(135deg,#4d5a4a,#9a8a67)`:config.accent;
    return `
      body{background:${config.bg}!important;color:${config.text}!important;font-family:${font}!important}
      .public-card{background:${config.card}!important;border-radius:${config.radius}px!important;box-shadow:${shadow}!important}
      .public-cover{background:${coverBg}!important;min-height:${config.heroHeight}px!important;padding:${Math.max(24,config.spacing*1.5)}px!important}
      .public-cover h1{color:#fff!important}
      .public-cover p{color:rgba(255,255,255,.86)!important}
      .public-actions{gap:${Math.max(6,config.spacing/2)}px!important;padding:${config.spacing}px!important;background:${config.card}!important}
      .public-action{background:${config.buttonStyle==='outline'?'transparent':config.accent}!important;color:${config.buttonStyle==='outline'?config.accent:config.buttonText}!important;border:${config.borderWidth}px solid ${config.accent}!important;border-radius:${config.buttonRadius}px!important;box-shadow:${config.shadow==='strong'?shadow:'none'}!important}
      .public-action span{color:inherit!important;opacity:.8}
      .public-content{padding:${config.spacing+4}px!important;background:${config.card}!important}
      .public-highlight,.public-hero-extra,.public-menu-card,.public-promo-card{background:${config.card}!important;border-radius:${config.radius}px!important;border:${config.cardBorder?config.borderWidth:0}px solid rgba(0,0,0,.08)!important;box-shadow:${config.shadow==='strong'?shadow:'none'}!important}
      .public-section-title{color:${config.accent}!important}
      .public-menu-card strong{color:${config.accent}!important}
      .public-footer{background:${config.card}!important;color:${config.muted}!important}
      .public-category-tabs button.active{background:${config.accent}!important;border-color:${config.accent}!important}
      ${config.compactActions?'.public-actions{grid-template-columns:repeat(4,1fr)!important}.public-action{padding:10px 6px!important}':'.public-action{padding:14px 8px!important}'}
      [data-nfc-block]{transition:transform .15s ease,box-shadow .15s ease}
    `
  }

  function applyAppearanceToPublic(doc){
    if(!doc?.head)return;ensureKeys(doc);let st=doc.getElementById('nfc-live-appearance-style');if(!st){st=doc.createElement('style');st.id='nfc-live-appearance-style';doc.head.appendChild(st)}st.textContent=buildPublicStyle();applyBlockOrder(doc)
  }
  function applyBlockOrder(doc){const order=config.blockOrder||[];if(!order.length)return;const parent=doc.querySelector('#publicBusinessContent .public-card');if(!parent)return;const blocks=getBlocks(doc);const map=new Map(blocks.map(x=>[blockKey(x),x]));order.forEach(k=>{const el=map.get(k);if(el)parent.appendChild(el)})}

  function setEditableMode(enabled){
    const frame=document.getElementById('nfcApIframe');const doc=frame?.contentDocument;if(!doc)return;applyAppearanceToPublic(doc);doc.querySelectorAll('.nfc-editor-block').forEach(x=>x.classList.remove('nfc-editor-block'));doc.getElementById('nfc-editor-mode-css')?.remove();if(!enabled)return;
    const css=doc.createElement('style');css.id='nfc-editor-mode-css';css.textContent=`[data-nfc-block].nfc-editor-block{outline:2px solid #d8b675!important;outline-offset:-2px!important;cursor:grab!important;touch-action:none!important;box-shadow:0 0 0 4px rgba(216,182,117,.12)!important}[data-nfc-block].nfc-dragging{opacity:.65!important;cursor:grabbing!important;transform:scale(.985)!important}[data-nfc-block].nfc-drag-target{outline:2px dashed #8b7a59!important}`;doc.head.appendChild(css);
    const blocks=getBlocks(doc);blocks.forEach(el=>{el.classList.add('nfc-editor-block');el.addEventListener('pointerdown',startDrag)})
    let dragging=null,placeholder=null,cleanup=null;
    function startDrag(e){if(e.button!==undefined&&e.button!==0)return;e.preventDefault();e.stopPropagation();dragging=e.currentTarget;dragging.setPointerCapture?.(e.pointerId);dragging.classList.add('nfc-dragging');placeholder=doc.createElement('div');placeholder.className='nfc-editor-placeholder';placeholder.style.height=`${Math.max(36,dragging.getBoundingClientRect().height)}px`;placeholder.style.border='2px dashed #d8b675';placeholder.style.borderRadius='16px';placeholder.style.margin='8px 0';dragging.parentNode.insertBefore(placeholder,dragging);const move=ev=>moveDrag(ev);const up=()=>endDrag();doc.addEventListener('pointermove',move);doc.addEventListener('pointerup',up,{once:true});doc.addEventListener('pointercancel',up,{once:true});cleanup=()=>{doc.removeEventListener('pointermove',move);doc.removeEventListener('pointerup',up);doc.removeEventListener('pointercancel',up)}}
    function moveDrag(e){if(!dragging)return;e.preventDefault();const siblings=getBlocks(doc).filter(x=>x!==dragging&&x!==placeholder);siblings.forEach(x=>x.classList.remove('nfc-drag-target'));const before=siblings.find(x=>{const r=x.getBoundingClientRect();return e.clientY<r.top+r.height/2});if(before){before.classList.add('nfc-drag-target');before.parentNode.insertBefore(placeholder,before)}else{const parent=doc.querySelector('#publicBusinessContent .public-card');parent?.appendChild(placeholder)}}
    function endDrag(){if(!dragging)return;placeholder?.parentNode?.insertBefore(dragging,placeholder);placeholder?.remove();getBlocks(doc).forEach(x=>x.classList.remove('nfc-drag-target'));dragging.classList.remove('nfc-dragging');cleanup?.();cleanup=null;config.blockOrder=getBlocks(doc).map(blockKey).filter(Boolean);message('Orden actualizado · Guardar apariencia')}
  }

  function setConfig(next){config=normalize(next);applyConfigToRoot();const frame=document.getElementById('nfcApIframe');if(frame?.contentDocument)applyAppearanceToPublic(frame.contentDocument)}

  async function save(){const c=getClient();if(!c||!business)return;const btn=document.getElementById('nfcApSave');if(btn){btn.disabled=true;btn.textContent='Guardando…'}const {error}=await c.from('businesses').update({appearance_config:config}).eq('id',business.id).eq('owner_id',business.owner_id);localStorage.setItem('nfcAppearance:'+business.owner_id,JSON.stringify(config));message(error?'No se pudo sincronizar todavía':'Apariencia guardada ✓');if(btn){btn.disabled=false;btn.textContent='Guardar apariencia'}}

  function control(id,label,type,value,extra=''){return `<div class="nfc-ap-control"><span>${label}</span>${type==='color'?`<input id="${id}" class="nfc-ap-color" type="color" value="${value}">`:type==='range'?`<input id="${id}" class="nfc-ap-range" type="range" ${extra} value="${value}">`:type==='select'?`<select id="${id}" class="nfc-ap-select">${extra}</select>`:''}</div>`}
  function selectOptions(obj,selected){return Object.entries(obj).map(([k,v])=>`<option value="${k}" ${k===selected?'selected':''}>${v}</option>`).join('')}

  function render(){
    if(document.getElementById('nfcAppearanceView'))return;const main=document.querySelector('.dash-main');if(!main||!business)return;const v=document.createElement('div');v.id='nfcAppearanceView';v.className='dash-view';
    v.innerHTML=`<div class="dash-view-head"><div><h3>Apariencia</h3><p>Construye la página pública con una vista previa real y edición visual.</p></div></div><div class="nfc-ap-wrap"><div class="nfc-ap-panel">
      <div class="nfc-ap-section"><div class="nfc-ap-section-title">Presets</div><div class="nfc-ap-row">${Object.entries(PRESETS).map(([k,p])=>`<button class="nfc-ap-btn" type="button" data-ap-preset="${k}">${p.name}</button>`).join('')}</div></div>
      <div class="nfc-ap-section"><div class="nfc-ap-section-title">Colores</div>${control('nfcApColor','Color principal','color',config.accent)}${control('nfcApBg','Fondo','color',config.bg)}${control('nfcApCard','Tarjetas','color',config.card)}</div>
      <div class="nfc-ap-section"><div class="nfc-ap-section-title">Tipografía</div>${control('nfcApFont','Fuente','select',config.font,selectOptions(FONTS,{Inter:'Inter',Georgia:'Georgia','Arial':'Arial','Trebuchet MS':'Trebuchet MS','Courier New':'Courier New'}))}</div>
      <div class="nfc-ap-section"><div class="nfc-ap-section-title">Formas y espaciado</div>${control('nfcApRadius','Bordes','range',config.radius,'min="4" max="36" step="1"')}${control('nfcApButtonRadius','Botones','range',config.buttonRadius,'min="4" max="40" step="1"')}${control('nfcApSpacing','Espaciado','range',config.spacing,'min="8" max="28" step="1"')}${control('nfcApHero','Altura portada','range',config.heroHeight,'min="140" max="280" step="5"')}</div>
      <div class="nfc-ap-section"><div class="nfc-ap-section-title">Botones</div>${control('nfcApButtonStyle','Estilo','select',config.buttonStyle,selectOptions({filled:'Rellenos',outline:'Contorno'}))}${control('nfcApShadow','Sombras','select',config.shadow,selectOptions({none:'Sin sombra',soft:'Suave',medium:'Media',strong:'Intensa'}))}</div>
      <div class="nfc-ap-section"><div class="nfc-ap-section-title">Portada</div>${control('nfcApCover','Estilo de portada','select',config.cover,selectOptions({solid:'Sólida',gradient:'Degradado',dark:'Oscura',photo:'Editorial'}))}</div>
      <div class="nfc-ap-section"><div class="nfc-ap-section-title">Componentes</div><label class="nfc-ap-check"><span>Bordes en tarjetas</span><input id="nfcApCardBorder" type="checkbox" ${config.cardBorder?'checked':''}></label><label class="nfc-ap-check"><span>Acciones compactas</span><input id="nfcApCompactActions" type="checkbox" ${config.compactActions?'checked':''}></label></div>
      <div class="nfc-ap-section"><div class="nfc-ap-section-title">Edición</div><div class="nfc-ap-control"><span>Modo edición</span><button id="nfcApEdit" class="nfc-ap-mode" type="button">Activar</button></div><div class="nfc-ap-note">Mantén pulsado un bloque de la web y arrástralo. Al soltar, el orden queda registrado inmediatamente.</div></div>
      <button id="nfcApSave" class="nfc-ap-save" type="button">Guardar apariencia</button>
    </div><div class="nfc-ap-preview"><div style="width:100%"><div class="nfc-ap-preview-head"><strong>Vista previa real</strong><span>${esc(business.name||'Tu negocio')}</span></div><div class="nfc-ap-iframe-wrap"><iframe id="nfcApIframe" class="nfc-ap-iframe" title="Vista previa de la web pública"></iframe></div><div class="nfc-ap-hint">Los cambios de diseño se aplican al momento. El orden se guarda cuando pulses Guardar apariencia.</div></div></div></div>`;
    main.appendChild(v);
    v.querySelectorAll('[data-ap-preset]').forEach(b=>b.addEventListener('click',()=>setConfig({...PRESETS[b.dataset.apPreset],preset:b.dataset.apPreset,blockOrder:config.blockOrder||[]})));
    const bind=(id,fn)=>v.querySelector('#'+id)?.addEventListener('input',fn);const bindChange=(id,fn)=>v.querySelector('#'+id)?.addEventListener('change',fn);
    bind('nfcApColor',e=>setConfig({...config,accent:e.target.value}));bind('nfcApBg',e=>setConfig({...config,bg:e.target.value}));bind('nfcApCard',e=>setConfig({...config,card:e.target.value}));bind('nfcApRadius',e=>setConfig({...config,radius:nfcNum(e.target.value)}));bind('nfcApButtonRadius',e=>setConfig({...config,buttonRadius:nfcNum(e.target.value)}));bind('nfcApSpacing',e=>setConfig({...config,spacing:nfcNum(e.target.value)}));bind('nfcApHero',e=>setConfig({...config,heroHeight:nfcNum(e.target.value)}));bindChange('nfcApFont',e=>setConfig({...config,font:e.target.value}));bindChange('nfcApButtonStyle',e=>setConfig({...config,buttonStyle:e.target.value}));bindChange('nfcApShadow',e=>setConfig({...config,shadow:e.target.value}));bindChange('nfcApCover',e=>setConfig({...config,cover:e.target.value}));bindChange('nfcApCardBorder',e=>setConfig({...config,cardBorder:e.target.checked}));bindChange('nfcApCompactActions',e=>setConfig({...config,compactActions:e.target.checked}));
    v.querySelector('#nfcApSave').addEventListener('click',save);
    v.querySelector('#nfcApEdit').addEventListener('click',()=>{const btn=v.querySelector('#nfcApEdit');const active=!btn.classList.contains('active');btn.classList.toggle('active',active);btn.textContent=active?'Edición activa':'Activar';setEditableMode(active)});
    const frame=v.querySelector('#nfcApIframe');frame.src=getPublicUrl();frame.addEventListener('load',()=>{applyAppearanceToPublic(frame.contentDocument);if(v.querySelector('#nfcApEdit').classList.contains('active'))setEditableMode(true)});syncControls();
  }

  async function applySavedToPublic(){
    const c=getClient();if(!c)return;const match=location.pathname.match(/^\/b\/([^/]+)\/?$/i);if(!match)return;const slug=decodeURIComponent(match[1]);const {data}=await c.from('businesses').select('appearance_config').eq('slug',slug).maybeSingle();let saved=data?.appearance_config;try{if(!saved&&data?.owner_id){const local=localStorage.getItem('nfcAppearance:'+data.owner_id);if(local)saved=JSON.parse(local)}}catch{}if(saved)config=normalize(saved);applyAppearanceToPublic(document)
  }
  function addEntry(){const side=document.querySelector('.sidebar');if(!side||side.querySelector('[data-nfc-appearance]'))return;const item=document.createElement('div');item.className='side-item';item.dataset.nfcAppearance='1';item.textContent='🎨 Apariencia';side.appendChild(item);item.addEventListener('click',()=>{document.querySelectorAll('.dash-view').forEach(x=>x.classList.remove('active'));render();document.getElementById('nfcAppearanceView')?.classList.add('active');document.querySelectorAll('.side-item').forEach(x=>x.classList.remove('active'));item.classList.add('active')})}
  async function init(){uiCss();if(/^\/b\//i.test(location.pathname)){await applySavedToPublic();return}let tries=0;const timer=setInterval(async()=>{tries++;if(!document.querySelector('.dash-main')){if(tries>40)clearInterval(timer);return}const b=business||await loadBusiness();if(b){let saved=b.appearance_config;try{if(!saved){const local=localStorage.getItem('nfcAppearance:'+b.owner_id);if(local)saved=JSON.parse(local)}}catch{}config=normalize(saved);addEntry();clearInterval(timer)}else if(tries>40)clearInterval(timer)},500)}
  window.NFCAppearanceEditor={init,render,apply:setConfig};init();
})();