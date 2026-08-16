/* NFC Business Hub — Appearance Media V1
   Logo + portada via URL. No storage dependency yet. */
(function(){
  const URL='https://znegwqcdaxqfzbjyzija.supabase.co';
  const KEY='sb_publishable_OxUV1v29_QwhZQyy7Skg3w_-f1gTcre';
  let client=null,business=null,config={};
  const getClient=()=>client||(client=window.supabase?.createClient(URL,KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}}));
  const normalize=c=>Object.assign({logoUrl:'',coverImage:''},c||{});
  const msg=t=>window.notify?window.notify(t):console.log(t);
  const esc=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[c]));

  function css(){
    if(document.getElementById('nfc-media-v1-css'))return;
    const s=document.createElement('style');s.id='nfc-media-v1-css';s.textContent=`
      .nfc-media-preview{display:flex;gap:10px;align-items:center;margin-top:8px}.nfc-media-thumb{width:48px;height:48px;border-radius:12px;object-fit:cover;border:1px solid #e6e3db;background:#faf9f5}.nfc-media-empty{font-size:11px;color:#8a877f}.nfc-media-input{width:100%;padding:10px 11px;border:1px solid #e6e3db;border-radius:11px;background:#faf9f5;outline:none;font-size:12px}.nfc-media-actions{display:flex;gap:7px;margin-top:8px}.nfc-media-btn{border:1px solid #e6e3db;background:#fff;border-radius:11px;padding:8px 10px;font-size:11px;font-weight:800;cursor:pointer}.nfc-media-btn.primary{background:#171714;color:#fff;border-color:#171714}
      .nfc-media-logo{width:42px;height:42px;border-radius:12px;object-fit:cover;display:block;border:1px solid rgba(255,255,255,.22);background:rgba(255,255,255,.1);margin-bottom:12px}.nfc-media-logo-wrap{position:relative;z-index:2}
    `;document.head.appendChild(s);
  }

  async function loadBusiness(){const c=getClient();if(!c)return null;const {data:{user}}=await c.auth.getUser();if(!user)return null;const {data}=await c.from('businesses').select('id,name,slug,owner_id,appearance_config').eq('owner_id',user.id).maybeSingle();business=data||null;config=normalize(data?.appearance_config);return data}
  function ensureConfig(){config=normalize(config);}
  async function saveConfig(){const c=getClient();if(!c||!business)return;ensureConfig();const {error}=await c.from('businesses').update({appearance_config:config}).eq('id',business.id).eq('owner_id',business.owner_id);if(error){msg('No se pudo guardar las imágenes');return}localStorage.setItem('nfcAppearance:'+business.owner_id,JSON.stringify(config));msg('Imágenes guardadas ✓');}

  function applyToDoc(doc){
    if(!doc?.querySelector)return;
    ensureConfig();
    const cover=doc.querySelector('.public-cover');
    if(cover){
      if(config.coverImage){cover.style.backgroundImage=`linear-gradient(180deg,rgba(0,0,0,.06),rgba(0,0,0,.24)),url("${String(config.coverImage).replace(/"/g,'%22')}")`;cover.style.backgroundSize='cover';cover.style.backgroundPosition='center';}
      else cover.style.removeProperty('background-image');
    }
    const coverContent=doc.querySelector('.public-cover-content');
    if(coverContent){let wrap=coverContent.querySelector('.nfc-media-logo-wrap');if(config.logoUrl){if(!wrap){wrap=doc.createElement('div');wrap.className='nfc-media-logo-wrap';coverContent.prepend(wrap)}wrap.innerHTML=`<img class="nfc-media-logo" src="${esc(config.logoUrl)}" alt="Logo">`;}else if(wrap)wrap.remove();}
  }

  function wirePreview(){const f=document.getElementById('nfcApIframe');if(!f)return;f.addEventListener('load',()=>applyToDoc(f.contentDocument));applyToDoc(f.contentDocument)}
  function addControls(){
    const panel=document.querySelector('#nfcAppearanceView .nfc-ap-panel');if(!panel||panel.querySelector('[data-nfc-media-section]'))return;
    ensureConfig();
    const sec=document.createElement('div');sec.className='nfc-ap-section';sec.dataset.nfcMediaSection='1';
    sec.innerHTML=`<div class="nfc-ap-section-title">Imágenes</div><div class="nfc-media-empty" style="margin-bottom:8px">Pega una URL pública de tu logo y de la foto de portada.</div><label class="nfc-ap-label">Logo</label><input id="nfcMediaLogo" class="nfc-media-input" value="${esc(config.logoUrl)}" placeholder="https://…/logo.png"><div id="nfcMediaLogoPreview" class="nfc-media-preview"></div><label class="nfc-ap-label">Portada</label><input id="nfcMediaCover" class="nfc-media-input" value="${esc(config.coverImage)}" placeholder="https://…/foto.jpg"><div id="nfcMediaCoverPreview" class="nfc-media-preview"></div><div class="nfc-media-actions"><button id="nfcMediaApply" class="nfc-media-btn" type="button">Vista previa</button><button id="nfcMediaSave" class="nfc-media-btn primary" type="button">Guardar imágenes</button></div>`;
    panel.insertBefore(sec,panel.querySelector('#nfcApSave')?.parentElement||null);
    const logo=sec.querySelector('#nfcMediaLogo'),cover=sec.querySelector('#nfcMediaCover');
    const render=()=>{config.logoUrl=logo.value.trim();config.coverImage=cover.value.trim();const lp=sec.querySelector('#nfcMediaLogoPreview'),cp=sec.querySelector('#nfcMediaCoverPreview');lp.innerHTML=config.logoUrl?`<img class="nfc-media-thumb" src="${esc(config.logoUrl)}" alt="Logo"><span class="nfc-media-empty">Logo cargado</span>`:'<span class="nfc-media-empty">Sin logo</span>';cp.innerHTML=config.coverImage?`<img class="nfc-media-thumb" style="width:78px" src="${esc(config.coverImage)}" alt="Portada"><span class="nfc-media-empty">Portada cargada</span>`:'<span class="nfc-media-empty">Sin portada</span>';wirePreview();applyToDoc(document.getElementById('nfcApIframe')?.contentDocument)};
    sec.querySelector('#nfcMediaApply').addEventListener('click',render);sec.querySelector('#nfcMediaSave').addEventListener('click',async()=>{render();await saveConfig()});render();
  }
  function hook(){css();let tries=0;const timer=setInterval(()=>{tries++;if(document.getElementById('nfcAppearanceView')){addControls();clearInterval(timer)}if(tries>60)clearInterval(timer)},300);}
  async function publicInit(){const c=getClient();if(!c)return;const match=location.pathname.match(/^\/b\/([^/]+)\/?$/i);if(!match)return;const slug=decodeURIComponent(match[1]);const {data}=await c.from('businesses').select('appearance_config').eq('slug',slug).maybeSingle();config=normalize(data?.appearance_config);applyToDoc(document)}
  async function init(){css();if(/^\/b\//i.test(location.pathname)){await publicInit();return}await loadBusiness();hook();}
  window.NFCBusinessAppearanceMedia={init,apply:applyToDoc};init();
})();
