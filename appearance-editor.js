/* NFC Business Hub — Appearance Editor V2 */
(function(){
  const URL='https://znegwqcdaxqfzbjyzija.supabase.co';
  const KEY='sb_publishable_OxUV1v29_QwhZQyy7Skg3w_-f1gTcre';
  const PRESETS={
    minimal:{name:'Minimal',accent:'#171714',bg:'#f7f6f2',card:'#ffffff',radius:18,button:'14px',font:'Inter'},
    elegant:{name:'Elegant',accent:'#8b6b3f',bg:'#f7f3ec',card:'#fffdf8',radius:24,button:'999px',font:'Georgia'},
    modern:{name:'Modern',accent:'#2457d6',bg:'#f5f7fb',card:'#ffffff',radius:14,button:'10px',font:'Inter'},
    bold:{name:'Bold',accent:'#b34d40',bg:'#f7f2f0',card:'#ffffff',radius:28,button:'999px',font:'Inter'}
  };
  let client=null,business=null,config={};
  const getClient=()=>client||(client=window.supabase?.createClient(URL,KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}}));
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const normalize=c=>Object.assign({preset:'minimal',accent:'#171714',bg:'#f7f6f2',card:'#ffffff',radius:18,button:'14px',font:'Inter',blockOrder:[]},c||{});

  function css(){
    if(document.getElementById('nfc-appearance-v2-css'))return;
    const s=document.createElement('style');s.id='nfc-appearance-v2-css';s.textContent=`
      #nfcAppearanceView{padding-bottom:30px}
      .nfc-ap-wrap{display:grid;grid-template-columns:330px 1fr;gap:18px;align-items:start}
      .nfc-ap-panel{background:#fff;border:1px solid #e6e3db;border-radius:22px;padding:18px;position:sticky;top:16px}
      .nfc-ap-panel h4{margin:0 0 12px}.nfc-ap-label{display:block;font-size:11px;font-weight:800;color:#77746d;margin:12px 0 6px}
      .nfc-ap-row{display:flex;gap:8px;flex-wrap:wrap}.nfc-ap-btn{border:1px solid #e6e3db;background:#fff;border-radius:12px;padding:10px 12px;font-weight:800;cursor:pointer}.nfc-ap-btn.active{border-color:#171714;box-shadow:inset 0 0 0 1px #171714;background:#faf9f5}
      .nfc-ap-color{width:46px;height:38px;padding:2px;border:1px solid #ddd7ca;border-radius:10px;background:#fff}.nfc-ap-range{width:100%}
      .nfc-ap-save{margin-top:14px;width:100%;border:0;background:#171714;color:#fff;border-radius:14px;padding:13px;font-weight:900;cursor:pointer}.nfc-ap-save:disabled{opacity:.45}
      .nfc-ap-preview{min-height:760px;border-radius:24px;overflow:hidden;background:#eceae4;border:1px solid #e6e3db;padding:18px;position:relative}
      .nfc-ap-preview-head{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:12px}.nfc-ap-preview-head strong{font-size:13px}.nfc-ap-preview-head span{font-size:11px;color:#77746d}
      .nfc-ap-mode{border:1px solid #e6e3db;background:#fff;border-radius:999px;padding:8px 12px;font-size:11px;font-weight:900;cursor:pointer}.nfc-ap-mode.active{background:#171714;color:#fff;border-color:#171714}
      .nfc-ap-iframe-wrap{width:min(520px,100%);margin:0 auto;background:#111;border-radius:34px;padding:9px;box-shadow:0 24px 70px rgba(20,20,16,.16)}
      .nfc-ap-iframe{display:block;width:100%;height:760px;border:0;border-radius:26px;background:#fff}
      .nfc-ap-hint{font-size:11px;color:#77746d;text-align:center;margin-top:10px;line-height:1.45}
      .nfc-ap-editor-note{margin-top:12px;padding:11px 12px;border:1px solid #eadfc9;background:#fff8e9;border-radius:13px;color:#6f5b37;font-size:11px;line-height:1.45}
      .nfc-ap-control{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid #eeeae1;font-size:12px}.nfc-ap-control:last-child{border-bottom:0}
      @media(max-width:900px){.nfc-ap-wrap{grid-template-columns:1fr}.nfc-ap-panel{position:relative;top:auto}.nfc-ap-preview{min-height:650px;padding:10px}.nfc-ap-iframe{height:680px}}
      @media(max-width:620px){.nfc-ap-iframe-wrap{border-radius:25px;padding:7px}.nfc-ap-iframe{height:690px;border-radius:20px}.nfc-ap-preview{border-radius:18px}}
    `;document.head.appendChild(s);
  }

  function applyConfigToRoot(){
    config=normalize(config);
    document.documentElement.style.setProperty('--nfc-public-accent',config.accent);
    document.documentElement.style.setProperty('--nfc-public-bg',config.bg);
    document.documentElement.style.setProperty('--nfc-public-card',config.card);
    document.documentElement.style.setProperty('--nfc-public-radius',config.radius+'px');
    document.documentElement.style.setProperty('--nfc-public-button',config.button);
    document.documentElement.style.setProperty('--nfc-public-font',config.font);
    document.querySelectorAll('[data-ap-preset]').forEach(x=>x.classList.toggle('active',x.dataset.apPreset===config.preset));
    const color=document.getElementById('nfcApColor');if(color)color.value=config.accent;
    const range=document.getElementById('nfcApRadius');if(range)range.value=config.radius;
  }

  function getPublicUrl(){
    return business?.slug?`/b/${encodeURIComponent(business.slug)}?nfc_editor=1`:'/';
  }

  function blockKey(el){
    if(el.id)return el.id;
    if(el.classList.contains('public-cover'))return 'public-cover';
    if(el.classList.contains('public-actions'))return 'public-actions';
    if(el.classList.contains('public-hero-extra'))return 'public-hero-extra';
    if(el.classList.contains('public-content'))return 'public-content';
    if(el.classList.contains('public-footer'))return 'public-footer';
    return null;
  }

  function getBlocks(doc){
    return [...doc.querySelectorAll('#publicBusinessContent .public-card > .public-cover, #publicBusinessContent .public-card > .public-actions, #publicBusinessContent .public-card > .public-hero-extra, #publicBusinessContent .public-card > .public-content, #publicBusinessContent .public-card > .public-footer')].filter(Boolean);
  }

  function applyAppearanceToPublic(doc){
    if(!doc?.documentElement)return;
    const root=doc.documentElement;
    root.style.setProperty('--nfc-public-accent',config.accent);
    root.style.setProperty('--nfc-public-bg',config.bg);
    root.style.setProperty('--nfc-public-card',config.card);
    root.style.setProperty('--nfc-public-radius',config.radius+'px');
    root.style.setProperty('--nfc-public-button',config.button);
    root.style.setProperty('--nfc-public-font',config.font);
    const styleId='nfc-live-appearance-style';let st=doc.getElementById(styleId);
    if(!st){st=doc.createElement('style');st.id=styleId;doc.head.appendChild(st)}
    st.textContent=`
      body{background:${config.bg}!important;font-family:${config.font==='Georgia'?'Georgia,serif':'Inter,ui-sans-serif,system-ui,sans-serif'}!important}
      .public-card{background:${config.card}!important;border-radius:${config.radius}px!important}
      .public-actions,.public-action,.public-menu-card,.public-highlight,.public-hero-extra{border-radius:${config.radius}px!important}
      .public-action{border-radius:${config.button}!important}
      .public-action,.public-menu-card{background:${config.card}!important}
      .public-section-title{color:${config.accent}!important}
      .public-cover{background:linear-gradient(135deg,${config.accent},#2b2a26)!important}
      .public-promo-card{border-radius:${config.radius}px!important}
    `;
    const card=doc.querySelector('#publicBusinessContent .public-card');if(card)card.style.borderRadius=config.radius+'px';
    const order=config.blockOrder||[];const parent=doc.querySelector('#publicBusinessContent .public-card');if(parent&&order.length){const map=new Map(getBlocks(doc).map(el=>[blockKey(el),el]));order.forEach(k=>{const el=map.get(k);if(el)parent.appendChild(el)})}
  }

  function setEditableMode(enabled){
    const frame=document.getElementById('nfcApIframe');const doc=frame?.contentDocument;if(!doc)return;
    applyAppearanceToPublic(doc);
    doc.querySelectorAll('.nfc-editor-block').forEach(x=>x.classList.remove('nfc-editor-block'));
    const old=doc.getElementById('nfc-editor-overlay-style');old?.remove();
    if(!enabled)return;
    const s=doc.createElement('style');s.id='nfc-editor-overlay-style';s.textContent=`
      .nfc-editor-block{outline:2px solid #d8b675!important;outline-offset:-2px!important;cursor:grab!important;position:relative!important;transition:transform .15s ease,outline-color .15s ease!important}
      .nfc-editor-block::before{content:'Mover';position:absolute;top:8px;right:8px;z-index:99999;background:#171714;color:#fff;border-radius:999px;padding:4px 8px;font:800 9px system-ui;opacity:.9;pointer-events:none}
      .nfc-editor-block.nfc-dragging{opacity:.62;transform:scale(.992)}
    `;doc.head.appendChild(s);
    const blocks=getBlocks(doc);blocks.forEach(el=>{el.classList.add('nfc-editor-block');el.addEventListener('pointerdown',startDrag,{passive:false})});

    let dragging=null,placeholder=null,startY=0;
    function startDrag(e){
      if(e.button!==undefined&&e.button!==0)return;
      e.preventDefault();dragging=e.currentTarget;startY=e.clientY;dragging.classList.add('nfc-dragging');
      placeholder=doc.createElement('div');placeholder.style.height=dragging.getBoundingClientRect().height+'px';placeholder.style.margin='8px 0';placeholder.style.border='2px dashed #d8b675';placeholder.style.borderRadius='16px';dragging.parentNode.insertBefore(placeholder,dragging);
      doc.addEventListener('pointermove',moveDrag);doc.addEventListener('pointerup',endDrag,{once:true});
    }
    function moveDrag(e){if(!dragging)return;e.preventDefault();const siblings=getBlocks(doc).filter(x=>x!==dragging);const before=siblings.find(x=>e.clientY<x.getBoundingClientRect().top+x.getBoundingClientRect().height/2);if(before)before.parentNode.insertBefore(placeholder,before);else{const parent=doc.querySelector('#publicBusinessContent .public-card');parent?.appendChild(placeholder)}}
    function endDrag(){if(!dragging)return;placeholder?.parentNode?.insertBefore(dragging,placeholder);placeholder?.remove();dragging.classList.remove('nfc-dragging');dragging=null;doc.removeEventListener('pointermove',moveDrag);config.blockOrder=getBlocks(doc).map(blockKey).filter(Boolean);notifyExternal('Orden actualizado · pulsa Guardar apariencia');}
  }

  function notifyExternal(msg){if(window.notify)window.notify(msg)}

  async function loadBusiness(){
    const c=getClient();if(!c)return null;const {data:{user}}=await c.auth.getUser();if(!user)return null;
    const r=await c.from('businesses').select('id,name,slug,owner_id,appearance_config').eq('owner_id',user.id).maybeSingle();
    business=r.data||null;return business;
  }

  async function save(){
    const c=getClient();if(!c||!business)return;
    const btn=document.getElementById('nfcApSave');if(btn){btn.disabled=true;btn.textContent='Guardando…'}
    const {error}=await c.from('businesses').update({appearance_config:config}).eq('id',business.id).eq('owner_id',business.owner_id);
    localStorage.setItem('nfcAppearance:'+business.owner_id,JSON.stringify(config));
    if(error){notifyExternal('No se pudo sincronizar todavía');}else{notifyExternal('Apariencia guardada ✓')}
    if(btn){btn.disabled=false;btn.textContent='Guardar apariencia'}
  }

  function render(){
    if(document.getElementById('nfcAppearanceView'))return;
    const main=document.querySelector('.dash-main');if(!main||!business)return;
    const v=document.createElement('div');v.id='nfcAppearanceView';v.className='dash-view';
    v.innerHTML=`<div class="dash-view-head"><div><h3>Apariencia</h3><p>Edita la página real de tu negocio. Activa el modo edición y mueve los bloques con el dedo.</p></div></div>
      <div class="nfc-ap-wrap">
        <div class="nfc-ap-panel">
          <h4>Estilo</h4>
          <span class="nfc-ap-label">Preset</span><div class="nfc-ap-row">${Object.entries(PRESETS).map(([k,p])=>`<button class="nfc-ap-btn" type="button" data-ap-preset="${k}">${p.name}</button>`).join('')}</div>
          <span class="nfc-ap-label">Color principal</span><input id="nfcApColor" class="nfc-ap-color" type="color" value="#171714">
          <span class="nfc-ap-label">Redondeado</span><input id="nfcApRadius" class="nfc-ap-range" type="range" min="8" max="32" value="18"><div class="nfc-ap-row" style="justify-content:space-between;color:#77746d;font-size:11px"><span>Cuadrado</span><span>Muy redondeado</span></div>
          <div class="nfc-ap-control"><span>Modo edición</span><button id="nfcApEdit" class="nfc-ap-mode" type="button">Activar</button></div>
          <div class="nfc-ap-editor-note">En modo edición puedes mantener pulsado un bloque de la web y arrastrarlo arriba o abajo, como si reorganizaras el centro de control de iOS.</div>
          <button id="nfcApSave" class="nfc-ap-save" type="button">Guardar apariencia</button>
        </div>
        <div class="nfc-ap-preview"><div style="width:100%">
          <div class="nfc-ap-preview-head"><strong>Vista previa real</strong><span>${esc(business.name||'Tu negocio')}</span></div>
          <div class="nfc-ap-iframe-wrap"><iframe id="nfcApIframe" class="nfc-ap-iframe" title="Vista previa de la web pública"></iframe></div>
          <div class="nfc-ap-hint">La vista previa carga la misma página que verá tu cliente.</div>
        </div></div>
      </div>`;
    main.appendChild(v);
    v.querySelectorAll('[data-ap-preset]').forEach(b=>b.addEventListener('click',()=>apply({...PRESETS[b.dataset.apPreset],preset:b.dataset.apPreset,blockOrder:config.blockOrder||[]})));
    v.querySelector('#nfcApColor').addEventListener('input',e=>apply({...config,accent:e.target.value}));
    v.querySelector('#nfcApRadius').addEventListener('input',e=>apply({...config,radius:Number(e.target.value)}));
    v.querySelector('#nfcApSave').addEventListener('click',save);
    v.querySelector('#nfcApEdit').addEventListener('click',()=>{const btn=v.querySelector('#nfcApEdit');const active=!btn.classList.contains('active');btn.classList.toggle('active',active);btn.textContent=active?'Edición activa':'Activar';setEditableMode(active)});
    const frame=v.querySelector('#nfcApIframe');frame.src=getPublicUrl();frame.addEventListener('load',()=>{applyAppearanceToPublic(frame.contentDocument);if(v.querySelector('#nfcApEdit').classList.contains('active'))setEditableMode(true)});
    applyConfigToRoot();
  }

  function apply(c){config=normalize(c);applyConfigToRoot();const frame=document.getElementById('nfcApIframe');if(frame?.contentDocument)applyAppearanceToPublic(frame.contentDocument)}

  function addEntry(){
    const side=document.querySelector('.sidebar');if(!side||side.querySelector('[data-nfc-appearance]'))return;
    const item=document.createElement('div');item.className='side-item';item.dataset.nfcAppearance='1';item.textContent='🎨 Apariencia';side.appendChild(item);item.addEventListener('click',()=>{document.querySelectorAll('.dash-view').forEach(x=>x.classList.remove('active'));render();document.getElementById('nfcAppearanceView')?.classList.add('active');document.querySelectorAll('.side-item').forEach(x=>x.classList.remove('active'));item.classList.add('active')});
  }

  async function init(){
    css();let tries=0;const t=setInterval(async()=>{tries++;if(!document.querySelector('.dash-main')){if(tries>40)clearInterval(t);return}const b=business||await loadBusiness();if(b){const local=localStorage.getItem('nfcAppearance:'+b.owner_id);let c=b.appearance_config;try{if(!c&&local)c=JSON.parse(local)}catch{}config=normalize(c);addEntry();clearInterval(t)}else if(tries>40)clearInterval(t)},500)}
  window.NFCAppearanceEditor={init,apply,show:render};init();
})();
