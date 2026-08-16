/* NFC Business Hub — Appearance Media V2
   Premium visual theme layer + logo/cover media controls. */
(function(){
  const URL='https://znegwqcdaxqfzbjyzija.supabase.co';
  const KEY='sb_publishable_OxUV1v29_QwhZQyy7Skg3w_-f1gTcre';
  let client=null,business=null,config={};
  const THEMES={
    minimal:{name:'Minimal',tag:'Clean / contemporary'},
    elegant:{name:'Maison',tag:'Luxury / hospitality'},
    modern:{name:'Swiss',tag:'Swiss / precision'},
    bold:{name:'Studio',tag:'Bold / editorial'},
    midnight:{name:'Obsidian',tag:'Dark / premium'},
    editorial:{name:'Atelier',tag:'Warm / crafted'}
  };
  const getClient=()=>client||(client=window.supabase?.createClient(URL,KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}}));
  const normalize=c=>Object.assign({preset:'minimal',accent:'#171714',bg:'#f7f6f2',card:'#ffffff',radius:18,buttonRadius:14,shadow:'soft',font:'Inter',cover:'solid',spacing:16,buttonStyle:'filled',buttonText:'#ffffff',borderWidth:1,cardBorder:true,heroHeight:190,compactActions:false,logoUrl:'',coverImage:''},c||{});
  const msg=t=>window.notify?window.notify(t):console.log(t);
  const esc=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[c]));

  function css(){
    if(document.getElementById('nfc-media-v2-css'))return;
    const s=document.createElement('style');s.id='nfc-media-v2-css';s.textContent=`
      .nfc-media-preview{display:flex;gap:10px;align-items:center;margin-top:8px}.nfc-media-thumb{width:48px;height:48px;border-radius:12px;object-fit:cover;border:1px solid #e6e3db;background:#faf9f5}.nfc-media-empty{font-size:11px;color:#8a877f}.nfc-media-input{width:100%;padding:10px 11px;border:1px solid #e6e3db;border-radius:11px;background:#faf9f5;outline:none;font-size:12px}.nfc-media-actions{display:flex;gap:7px;margin-top:8px}.nfc-media-btn{border:1px solid #e6e3db;background:#fff;border-radius:11px;padding:8px 10px;font-size:11px;font-weight:800;cursor:pointer}.nfc-media-btn.primary{background:#171714;color:#fff;border-color:#171714}
      .nfc-media-logo{width:42px;height:42px;border-radius:12px;object-fit:cover;display:block;border:1px solid rgba(255,255,255,.22);background:rgba(255,255,255,.1);margin-bottom:12px}.nfc-media-logo-wrap{position:relative;z-index:2}
      .nfc-theme-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-top:9px}.nfc-theme-card{position:relative;border:1px solid #e6e3db;background:#fff;border-radius:14px;padding:11px;text-align:left;cursor:pointer;overflow:hidden;min-height:72px}.nfc-theme-card strong{display:block;font-size:11px}.nfc-theme-card span{display:block;font-size:9px;color:#8a877f;margin-top:3px}.nfc-theme-card::before{content:"";display:block;width:100%;height:22px;border-radius:8px;margin-bottom:8px;background:linear-gradient(90deg,#171714 0 42%,#f5f3ed 42% 100%)}.nfc-theme-card[data-theme="elegant"]::before{background:linear-gradient(90deg,#2b2119 0 54%,#d7b77a 54% 100%)}.nfc-theme-card[data-theme="modern"]::before{background:linear-gradient(90deg,#111 0 38%,#fff 38% 70%,#255bd7 70% 100%)}.nfc-theme-card[data-theme="bold"]::before{background:linear-gradient(90deg,#f2e8dc 0 55%,#bd5545 55% 100%)}.nfc-theme-card[data-theme="midnight"]::before{background:linear-gradient(90deg,#080807 0 62%,#d8b675 62% 100%)}.nfc-theme-card[data-theme="editorial"]::before{background:linear-gradient(90deg,#efe4d4 0 55%,#5b3b2f 55% 100%)}.nfc-theme-card.active{border-color:#171714;box-shadow:inset 0 0 0 1px #171714;background:#faf9f5}
      @media(max-width:620px){.nfc-theme-grid{grid-template-columns:1fr 1fr}}
    `;document.head.appendChild(s);
  }

  async function loadBusiness(){const c=getClient();if(!c)return null;const {data:{user}}=await c.auth.getUser();if(!user)return null;const {data}=await c.from('businesses').select('id,name,slug,owner_id,appearance_config').eq('owner_id',user.id).maybeSingle();business=data||null;config=normalize(data?.appearance_config);return data}
  function ensureConfig(){config=normalize(config)}
  async function saveConfig(){const c=getClient();if(!c||!business)return;ensureConfig();const {error}=await c.from('businesses').update({appearance_config:config}).eq('id',business.id).eq('owner_id',business.owner_id);if(error){msg('No se pudo guardar');return}localStorage.setItem('nfcAppearance:'+business.owner_id,JSON.stringify(config));msg('Configuración visual guardada ✓')}

  function themeStyle(theme){
    const common=`body{overflow-x:hidden!important}.public-card{overflow:hidden!important}.public-cover{position:relative!important}.public-cover::after{pointer-events:none!important}.public-actions{align-items:stretch!important}.public-action{transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease!important}.public-action:hover{transform:translateY(-2px)!important}.public-menu-card,.public-highlight,.public-promo-card,.public-hero-extra{transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease!important}.public-menu-card:hover,.public-highlight:hover,.public-promo-card:hover{transform:translateY(-2px)!important}`;
    const themes={
      minimal:`${common}
        body{background:#f7f6f2!important;color:#161616!important}.public-card{max-width:680px!important;border:1px solid #dedbd2!important;border-radius:24px!important;box-shadow:0 18px 55px rgba(20,20,16,.07)!important}.public-cover{min-height:210px!important;padding:34px 30px!important;background:linear-gradient(145deg,#181816,#33332d)!important}.public-cover h1{font-size:clamp(42px,7vw,58px)!important;letter-spacing:-.055em!important}.public-actions{grid-template-columns:repeat(4,1fr)!important;padding:12px!important;gap:8px!important}.public-action{background:#fff!important;color:#171714!important;border:1px solid #dedbd2!important;border-radius:12px!important}.public-action span{color:#6d6a63!important}.public-content{padding:22px!important}.public-section-title{letter-spacing:.12em!important}.public-menu-card{border-radius:14px!important;background:#fbfaf7!important}.public-footer{border-top:1px solid #e5e1d8!important}`,
      elegant:`${common}
        body{background:#f5f0e8!important;color:#2c241e!important;font-family:Georgia,serif!important}.public-card{max-width:740px!important;background:#fbf8f2!important;border:1px solid #d8c9b5!important;border-radius:6px!important;box-shadow:0 24px 75px rgba(61,43,23,.13)!important}.public-cover{min-height:270px!important;padding:40px 36px!important;background:linear-gradient(145deg,#241b16,#5b4939)!important}.public-cover::before{content:"";position:absolute;inset:14px;border:1px solid rgba(216,182,117,.42);z-index:1;pointer-events:none}.public-cover h1{font-size:clamp(44px,7vw,70px)!important;letter-spacing:-.05em!important;font-weight:500!important}.public-cover p{font-family:Inter,sans-serif!important;letter-spacing:.03em!important}.public-actions{grid-template-columns:repeat(4,1fr)!important;padding:0!important;background:#efe6d8!important;border-top:1px solid #d8c9b5!important;border-bottom:1px solid #d8c9b5!important;gap:0!important}.public-action{border:0!important;border-right:1px solid #d8c9b5!important;border-radius:0!important;background:transparent!important;color:#47372a!important;padding:16px 8px!important}.public-action:last-child{border-right:0!important}.public-action span{font-family:Inter,sans-serif!important;color:#776556!important;text-transform:uppercase!important;letter-spacing:.08em!important}.public-content{padding:30px!important}.public-section-title{font-family:Inter,sans-serif!important;letter-spacing:.16em!important;color:#8a6b45!important}.public-menu-card{border:0!important;border-bottom:1px solid #ddd0bd!important;border-radius:0!important;background:transparent!important;padding:18px 4px!important;box-shadow:none!important}.public-menu-card strong{color:#8a6b45!important}.public-highlight{background:#efe3d1!important;border:1px solid #dfcfb6!important;border-radius:4px!important}.public-footer{background:#2a201b!important;color:#c9bcac!important}`,
      modern:`${common}
        body{background:#f0f3f7!important;color:#151a21!important;font-family:Inter,Arial,sans-serif!important}.public-card{max-width:700px!important;border:1px solid #d9e0e8!important;border-radius:18px!important;background:#fff!important;box-shadow:0 18px 48px rgba(25,39,57,.1)!important}.public-cover{min-height:220px!important;padding:30px!important;background:#14181e!important}.public-cover::after{background:linear-gradient(120deg,rgba(37,87,214,.32),transparent 55%)!important}.public-cover h1{font-size:clamp(42px,7vw,62px)!important;letter-spacing:-.06em!important}.public-actions{grid-template-columns:repeat(4,1fr)!important;padding:14px!important;gap:8px!important;background:#fff!important}.public-action{background:#f8fafc!important;border:1px solid #dce3eb!important;border-radius:10px!important;color:#17315f!important}.public-action span{color:#65707e!important}.public-content{padding:22px!important}.public-section-title{color:#2457d6!important}.public-menu-card{background:#f8fafc!important;border:1px solid #e3e8ef!important;border-radius:10px!important}.public-menu-card strong{color:#2457d6!important}.public-category-tabs button{font-family:Inter,sans-serif!important}`,
      bold:`${common}
        body{background:#f1ece6!important;color:#1d1917!important;font-family:Inter,Arial,sans-serif!important}.public-card{max-width:760px!important;border:0!important;border-radius:0!important;box-shadow:0 28px 85px rgba(54,39,28,.15)!important;background:#fbf8f3!important}.public-cover{min-height:300px!important;padding:28px!important;background:linear-gradient(135deg,#272321,#a44e40)!important}.public-cover h1{font-size:clamp(50px,10vw,82px)!important;line-height:.88!important;letter-spacing:-.075em!important;font-weight:900!important;max-width:7ch!important}.public-actions{grid-template-columns:repeat(2,1fr)!important;padding:14px!important;gap:10px!important;background:#f1e9df!important}.public-action{background:#1e1b19!important;color:#fff!important;border:0!important;border-radius:4px!important;text-align:left!important;padding:16px!important}.public-action span{color:#e5d8cc!important;font-size:11px!important}.public-content{padding:26px!important}.public-section-title{font-size:12px!important;letter-spacing:.2em!important;color:#a44e40!important}.public-menu-card{background:#fff!important;border:1px solid #e2d9cf!important;border-radius:4px!important;padding:18px!important}.public-menu-card strong{color:#a44e40!important}.public-highlight{border-radius:4px!important;background:#e9ddd0!important;border:0!important}.public-footer{background:#1e1b19!important;color:#bdb0a6!important}`,
      midnight:`${common}
        body{background:#090909!important;color:#fff!important;font-family:Inter,Arial,sans-serif!important}.public-card{max-width:720px!important;background:#10100f!important;border:1px solid #2e2d29!important;border-radius:22px!important;box-shadow:0 35px 95px rgba(0,0,0,.45)!important}.public-cover{min-height:270px!important;padding:34px!important;background:linear-gradient(135deg,#060606,#25231e)!important}.public-cover::after{background:radial-gradient(circle at 80% 15%,rgba(216,182,117,.24),transparent 35%)!important}.public-cover h1{font-size:clamp(42px,7vw,64px)!important;letter-spacing:-.065em!important}.public-actions{grid-template-columns:repeat(4,1fr)!important;padding:10px!important;background:#10100f!important;gap:7px!important}.public-action{background:#181816!important;color:#fff!important;border:1px solid #35332c!important;border-radius:14px!important}.public-action span{color:#a9a59b!important}.public-content{padding:24px!important;background:#10100f!important}.public-section-title{color:#d8b675!important}.public-menu-card{background:#171714!important;border:1px solid #2f2d28!important;border-radius:14px!important}.public-menu-card span{color:#928e84!important}.public-menu-card strong{color:#d8b675!important}.public-highlight{background:#1a1814!important;border:1px solid #383126!important;border-radius:14px!important}.public-hero-extra{background:#181714!important}.public-footer{background:#0a0a09!important;color:#77746d!important}`,
      editorial:`${common}
        body{background:#ece4d7!important;color:#2b231f!important;font-family:Georgia,serif!important}.public-card{max-width:730px!important;background:#f7f1e8!important;border:1px solid #d8cbbd!important;border-radius:10px!important;box-shadow:0 22px 70px rgba(64,46,32,.11)!important}.public-cover{min-height:250px!important;padding:34px 32px!important;background:linear-gradient(135deg,#5a4034,#8d6c56)!important}.public-cover h1{font-size:clamp(44px,8vw,68px)!important;letter-spacing:-.06em!important;font-weight:500!important}.public-actions{grid-template-columns:repeat(4,1fr)!important;padding:12px!important;background:#e5dacb!important;gap:7px!important}.public-action{background:#f8f3eb!important;color:#5a4034!important;border:1px solid #d3c5b4!important;border-radius:999px!important}.public-action span{color:#816b5d!important}.public-content{padding:26px!important}.public-section-title{font-family:Inter,sans-serif!important;color:#6e4938!important;letter-spacing:.15em!important}.public-menu-card{background:#faf5ed!important;border:1px solid #dfd2c2!important;border-radius:10px!important}.public-menu-card strong{color:#6e4938!important}.public-highlight{background:#e8dccb!important;border:1px solid #d7c7b5!important;border-radius:10px!important}`
    };
    return themes[theme]||themes.minimal;
  }

  function applyThemeToDoc(doc,theme){
    if(!doc?.head)return;
    let st=doc.getElementById('nfc-theme-style');
    if(!st){st=doc.createElement('style');st.id='nfc-theme-style';doc.head.appendChild(st)}
    st.textContent=themeStyle(theme);
    doc.documentElement.dataset.nfcTheme=theme||'minimal';
    doc.body?.setAttribute('data-nfc-theme',theme||'minimal');
  }

  function applyToDoc(doc){
    if(!doc?.querySelector)return;ensureConfig();
    const cover=doc.querySelector('.public-cover');
    if(cover){
      if(config.coverImage){cover.style.backgroundImage=`linear-gradient(180deg,rgba(0,0,0,.06),rgba(0,0,0,.24)),url("${String(config.coverImage).replace(/"/g,'%22')}")`;cover.style.backgroundSize='cover';cover.style.backgroundPosition='center';}
      else cover.style.removeProperty('background-image');
    }
    const coverContent=doc.querySelector('.public-cover-content');
    if(coverContent){let wrap=coverContent.querySelector('.nfc-media-logo-wrap');if(config.logoUrl){if(!wrap){wrap=doc.createElement('div');wrap.className='nfc-media-logo-wrap';coverContent.prepend(wrap)}wrap.innerHTML=`<img class="nfc-media-logo" src="${esc(config.logoUrl)}" alt="Logo">`;}else if(wrap)wrap.remove();}
    applyThemeToDoc(doc,config.preset);
  }

  function wirePreview(){const f=document.getElementById('nfcApIframe');if(!f)return;f.addEventListener('load',()=>applyToDoc(f.contentDocument));applyToDoc(f.contentDocument)}
  function addThemeControls(){
    const panel=document.querySelector('#nfcAppearanceView .nfc-ap-panel');if(!panel||panel.querySelector('[data-nfc-theme-section]'))return;
    const sec=document.createElement('div');sec.className='nfc-ap-section';sec.dataset.nfcThemeSection='1';
    sec.innerHTML=`<div class="nfc-ap-section-title">Dirección visual</div><div class="nfc-media-empty">Seis sistemas visuales pensados como identidades completas, no simples cambios de color.</div><div class="nfc-theme-grid">${Object.entries(THEMES).map(([id,t])=>`<button type="button" class="nfc-theme-card" data-theme="${id}"><strong>${t.name}</strong><span>${t.tag}</span></button>`).join('')}</div>`;
    panel.insertBefore(sec,panel.firstElementChild?.nextElementSibling||panel.firstChild);
    const refresh=()=>sec.querySelectorAll('.nfc-theme-card').forEach(x=>x.classList.toggle('active',x.dataset.theme===config.preset));
    sec.querySelectorAll('.nfc-theme-card').forEach(btn=>btn.addEventListener('click',()=>{
      config.preset=btn.dataset.theme;
      refresh();
      document.querySelector(`[data-ap-preset="${btn.dataset.theme}"]`)?.click();
      setTimeout(()=>{const f=document.getElementById('nfcApIframe');applyToDoc(document);applyToDoc(f?.contentDocument)},30);
    }));
    refresh();
  }
  function addMediaControls(){
    const panel=document.querySelector('#nfcAppearanceView .nfc-ap-panel');if(!panel||panel.querySelector('[data-nfc-media-section]'))return;
    ensureConfig();
    const sec=document.createElement('div');sec.className='nfc-ap-section';sec.dataset.nfcMediaSection='1';
    sec.innerHTML=`<div class="nfc-ap-section-title">Imágenes</div><div class="nfc-media-empty" style="margin-bottom:8px">Pega una URL pública de tu logo y de la foto de portada.</div><label class="nfc-ap-label">Logo</label><input id="nfcMediaLogo" class="nfc-media-input" value="${esc(config.logoUrl)}" placeholder="https://…/logo.png"><div id="nfcMediaLogoPreview" class="nfc-media-preview"></div><label class="nfc-ap-label">Portada</label><input id="nfcMediaCover" class="nfc-media-input" value="${esc(config.coverImage)}" placeholder="https://…/foto.jpg"><div id="nfcMediaCoverPreview" class="nfc-media-preview"></div><div class="nfc-media-actions"><button id="nfcMediaApply" class="nfc-media-btn" type="button">Vista previa</button><button id="nfcMediaSave" class="nfc-media-btn primary" type="button">Guardar imágenes</button></div>`;
    panel.insertBefore(sec,panel.querySelector('#nfcApSave')?.parentElement||null);
    const logo=sec.querySelector('#nfcMediaLogo'),cover=sec.querySelector('#nfcMediaCover');
    const render=()=>{config.logoUrl=logo.value.trim();config.coverImage=cover.value.trim();const lp=sec.querySelector('#nfcMediaLogoPreview'),cp=sec.querySelector('#nfcMediaCoverPreview');lp.innerHTML=config.logoUrl?`<img class="nfc-media-thumb" src="${esc(config.logoUrl)}" alt="Logo"><span class="nfc-media-empty">Logo cargado</span>`:'<span class="nfc-media-empty">Sin logo</span>';cp.innerHTML=config.coverImage?`<img class="nfc-media-thumb" style="width:78px" src="${esc(config.coverImage)}" alt="Portada"><span class="nfc-media-empty">Portada cargada</span>`:'<span class="nfc-media-empty">Sin portada</span>';wirePreview();applyToDoc(document.getElementById('nfcApIframe')?.contentDocument)};
    sec.querySelector('#nfcMediaApply').addEventListener('click',render);sec.querySelector('#nfcMediaSave').addEventListener('click',async()=>{render();await saveConfig()});render();
  }
  function hook(){css();let tries=0;const timer=setInterval(()=>{tries++;if(document.getElementById('nfcAppearanceView')){addThemeControls();addMediaControls();clearInterval(timer)}if(tries>60)clearInterval(timer)},300)}
  async function publicInit(){const c=getClient();if(!c)return;const match=location.pathname.match(/^\/b\/([^/]+)\/?$/i);if(!match)return;const slug=decodeURIComponent(match[1]);const {data}=await c.from('businesses').select('appearance_config').eq('slug',slug).maybeSingle();config=normalize(data?.appearance_config);applyToDoc(document)}
  async function init(){css();if(/^\/b\//i.test(location.pathname)){await publicInit();return}await loadBusiness();hook();}
  window.NFCBusinessAppearanceMedia={init,apply:applyToDoc,themes:THEMES};init();
})();
