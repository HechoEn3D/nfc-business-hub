/* NFC Business Hub — Public Experience V3
   Deterministic public renderer. Reads businesses.appearance_config on every /b/:slug load. */
(function(){
  'use strict';
  if(!/^\/b\//i.test(location.pathname) || window.__NFC_PUBLIC_EXPERIENCE_V3) return;
  window.__NFC_PUBLIC_EXPERIENCE_V3=true;
  const URL='https://znegwqcdaxqfzbjyzija.supabase.co';
  const KEY='sb_publishable_OxUV1v29_QwhZQyy7Skg3w_-f1gTcre';
  let client=null,business=null;
  const sessionKey=sessionStorage.getItem('nfc_public_session') || Math.random().toString(36).slice(2)+Date.now().toString(36);
  sessionStorage.setItem('nfc_public_session',sessionKey);
  const getClient=()=>client||(client=window.supabase?.createClient(URL,KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}}));
  const esc=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[c]));
  const msg=t=>window.notify?window.notify(t):console.log(t);
  const slug=()=>decodeURIComponent(location.pathname.match(/^\/b\/([^/]+)\/?$/i)?.[1]||'');

  const DEFAULT={preset:'minimal',accent:'#171714',bg:'#f5f3ee',card:'#ffffff',font:'Inter',radius:24,buttonRadius:16,shadow:'soft',cover:'gradient',spacing:16,buttonStyle:'filled',buttonText:'#ffffff',borderWidth:1,cardBorder:true,heroHeight:235};

  function normalize(a){return {...DEFAULT,...(a||{})};}
  function cover(c){if(c.cover==='dark')return 'linear-gradient(135deg,#080807,#24241f)';if(c.cover==='photo')return 'linear-gradient(135deg,#4d5a4a,#9a8a67)';if(c.cover==='solid')return c.accent;return `linear-gradient(135deg,${c.accent},#2b2a26)`;}
  function font(c){return c.font==='Georgia'?'Georgia,serif':c.font==='Arial'?'Arial,sans-serif':c.font==='Trebuchet MS'?'"Trebuchet MS",sans-serif':c.font==='Courier New'?'"Courier New",monospace':'Inter,ui-sans-serif,system-ui,sans-serif';}
  function shadow(c){return c.shadow==='none'?'none':c.shadow==='strong'?'0 26px 70px rgba(20,20,16,.18)':c.shadow==='medium'?'0 18px 45px rgba(20,20,16,.11)':'0 12px 30px rgba(20,20,16,.07)';}

  function css(){
    if(document.getElementById('nfc-public-v3-css'))return;
    const s=document.createElement('style');s.id='nfc-public-v3-css';s.textContent=`
      #publicBusinessPage{min-height:100vh!important;background:var(--nfc-v3-bg)!important;color:var(--nfc-v3-text,#171714)!important;padding:18px 0 50px!important;font-family:var(--nfc-v3-font)!important}
      #publicBusinessPage *{font-family:inherit}
      #publicBusinessPage .public-card{background:var(--nfc-v3-card)!important;border:var(--nfc-v3-border-width) solid var(--nfc-v3-line)!important;border-radius:var(--nfc-v3-radius)!important;box-shadow:var(--nfc-v3-shadow)!important;overflow:hidden!important}
      #publicBusinessPage .public-cover{min-height:var(--nfc-v3-hero)!important;padding:calc(var(--nfc-v3-spacing)*1.5)!important;background:var(--nfc-v3-cover)!important}
      #publicBusinessPage .public-cover h1{font-family:inherit!important}
      #publicBusinessPage .public-actions{gap:max(6px,calc(var(--nfc-v3-spacing)/2))!important;padding:var(--nfc-v3-spacing)!important;background:var(--nfc-v3-card)!important}
      #publicBusinessPage .public-action{background:var(--nfc-v3-button-bg)!important;color:var(--nfc-v3-button-text)!important;border:var(--nfc-v3-border-width) solid var(--nfc-v3-accent)!important;border-radius:var(--nfc-v3-button-radius)!important}
      #publicBusinessPage .public-action span{color:inherit!important}
      #publicBusinessPage .public-hero-extra,#publicBusinessPage .public-highlight,#publicBusinessPage .public-promo-card{background:var(--nfc-v3-soft)!important;border:var(--nfc-v3-border-width) solid var(--nfc-v3-line)!important;border-radius:calc(var(--nfc-v3-radius) - 4px)!important}
      #publicBusinessPage .public-content{background:var(--nfc-v3-card)!important;padding:var(--nfc-v3-spacing)!important}
      #publicBusinessPage .public-section-title{color:var(--nfc-v3-accent)!important}
      #publicBusinessPage .public-menu-card{background:transparent!important;border-bottom:1px solid var(--nfc-v3-line)!important}
      #publicBusinessPage .public-menu-card strong{color:var(--nfc-v3-accent)!important}
      #publicBusinessPage .public-footer{background:var(--nfc-v3-soft)!important;border-top:1px solid var(--nfc-v3-line)!important}
      #publicBusinessPage .nfc-reserve{background:var(--nfc-v3-button-bg)!important;color:var(--nfc-v3-button-text)!important;border-color:var(--nfc-v3-accent)!important}
      #nfcPublicReservationModal{position:fixed;inset:0;z-index:100000;display:none;align-items:flex-end;justify-content:center;background:rgba(18,17,14,.58);backdrop-filter:blur(12px)}
      #nfcPublicReservationModal.show{display:flex}
      #nfcPublicReservationSheet{width:min(620px,100%);max-height:92vh;overflow:auto;background:#fff;border-radius:28px 28px 0 0;padding:22px;box-shadow:0 -24px 70px rgba(0,0,0,.18)}
      #nfcPublicReservationSheet h3{font-size:30px;letter-spacing:-.055em;margin:0}
      .nfc-r-form{display:grid;grid-template-columns:1fr 1fr;gap:10px}.nfc-r-full{grid-column:1/-1}
      .nfc-r-form label{font-size:10px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;color:#67635b}
      .nfc-r-form input,.nfc-r-form textarea{width:100%;box-sizing:border-box;margin-top:5px;border:1px solid #ded9cf;border-radius:12px;padding:11px;background:#faf9f5;font:inherit;outline:none}
      .nfc-r-form textarea{min-height:76px;resize:vertical}.nfc-r-actions{display:flex;gap:8px;margin-top:12px}.nfc-r-actions button{flex:1;border:0;border-radius:13px;padding:12px;font-weight:900;cursor:pointer}.nfc-r-cancel{background:#f0ede5;color:#36332d}.nfc-r-submit{background:var(--nfc-v3-accent)!important;color:#fff!important}.nfc-r-error{font-size:11px;font-weight:800;color:#a04c42;min-height:16px;margin-top:6px}
      @media(max-width:560px){#publicBusinessPage .public-actions{grid-template-columns:repeat(3,minmax(0,1fr))!important}.nfc-r-form{grid-template-columns:1fr}.nfc-r-full{grid-column:auto}#nfcPublicReservationSheet{padding:18px;border-radius:24px 24px 0 0}}
    `;document.head.appendChild(s);
  }

  function applyAppearance(raw){
    const c=normalize(raw);
    const outline=c.buttonStyle==='outline';
    const root=document.documentElement;
    root.style.setProperty('--nfc-v3-accent',c.accent);root.style.setProperty('--nfc-v3-bg',c.bg);root.style.setProperty('--nfc-v3-card',c.card);root.style.setProperty('--nfc-v3-soft',c.bg);root.style.setProperty('--nfc-v3-cover',cover(c));root.style.setProperty('--nfc-v3-font',font(c));root.style.setProperty('--nfc-v3-radius',`${c.radius}px`);root.style.setProperty('--nfc-v3-button-radius',c.buttonRadius>=200?'999px':`${c.buttonRadius}px`);root.style.setProperty('--nfc-v3-spacing',`${c.spacing}px`);root.style.setProperty('--nfc-v3-shadow',shadow(c));root.style.setProperty('--nfc-v3-border-width',`${Math.max(0,Number(c.borderWidth)||0)}px`);root.style.setProperty('--nfc-v3-line',c.cardBorder?`rgba(20,20,16,${Math.max(.06,Math.min(.18,(Number(c.borderWidth)||1)*.06))})`:'transparent');root.style.setProperty('--nfc-v3-hero',`${c.heroHeight}px`);root.style.setProperty('--nfc-v3-button-bg',outline?'transparent':c.accent);root.style.setProperty('--nfc-v3-button-text',outline?c.accent:c.buttonText);
    document.body?.setAttribute('data-nfc-public-theme',c.preset||'custom');
  }

  function syncContent(){
    const sc=business.site_config||{};const name=sc.title||business.name||'Tu negocio';const desc=sc.description||business.description||'Todo lo importante de tu negocio, en un solo lugar.';
    const set=(sel,val)=>document.querySelectorAll(sel).forEach(el=>el.textContent=val);set('#publicBizName',name);set('#publicBizDescription',desc);set('#publicWelcomeTitle',sc.welcome_title||'Todo lo que necesitas.');set('#publicWelcomeText',sc.welcome_text||'Consulta información, descubre promociones y accede rápidamente a lo importante.');set('#publicCity',business.city?`📍 ${business.city}`:'Información del negocio');
    const wa=document.getElementById('publicWhatsApp');if(wa){wa.style.display=business.whatsapp?'':'none';wa.onclick=()=>window.open(`https://wa.me/${String(business.whatsapp).replace(/\D/g,'')}`,'_blank','noopener')}
    const ig=document.getElementById('publicInstagram');if(ig){ig.style.display=business.instagram?'':'none';ig.onclick=()=>window.open(`https://instagram.com/${String(business.instagram).replace(/^@/,'')}`,'_blank','noopener')}
    const phone=document.getElementById('publicPhone');if(phone){phone.style.display=business.phone?'':'none';phone.onclick=()=>{location.href=`tel:${business.phone}`}}
    const maps=document.getElementById('publicMaps');if(maps){maps.style.display=business.city?'':'none';maps.onclick=()=>window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${business.name||''} ${business.city||''}`)}`,'_blank','noopener')}
  }

  async function renderMenu(){
    const c=getClient();const box=document.getElementById('publicMenuList');if(!c||!box)return;
    const q=await c.from('menu_items').select('id,name,description,price,category,available,position').eq('business_id',business.id).eq('available',true).order('position').order('id');
    if(!q.error&&q.data?.length){box.innerHTML=q.data.map(x=>`<div class="public-menu-card"><div><b>${esc(x.name)}</b><span>${esc(x.description||'')}</span></div><strong>${x.price==null?'':Number(x.price).toFixed(2)+' €'}</strong></div>`).join('');return}
    const s=await c.from('business_services').select('id,name,description,price,active,sort_order').eq('business_id',business.id).eq('active',true).order('sort_order').order('name');if(!s.error&&s.data?.length){box.innerHTML=s.data.map(x=>`<div class="public-menu-card"><div><b>${esc(x.name)}</b><span>${esc(x.description||'')}</span></div><strong>${x.price==null?'':Number(x.price).toFixed(2)+' €'}</strong></div>`).join('')}else box.innerHTML='<div style="color:#8a877f">Contenido próximamente.</div>';
  }

  function ensureReservation(){
    const actions=document.querySelector('#publicBusinessPage .public-actions');if(!actions||actions.querySelector('.nfc-reserve'))return;const b=document.createElement('button');b.type='button';b.className='public-action nfc-reserve';b.innerHTML='📅<span>Reservar</span>';b.onclick=()=>{ensureModal();document.getElementById('nfcPublicReservationModal').classList.add('show')};actions.appendChild(b);
  }
  function ensureModal(){
    if(document.getElementById('nfcPublicReservationModal'))return;const m=document.createElement('div');m.id='nfcPublicReservationModal';m.innerHTML=`<div id="nfcPublicReservationSheet"><h3>Reservar</h3><p>${esc(business.name||'Este negocio')} recibirá tu solicitud y podrá confirmarla desde su panel.</p><form id="nfcPublicReservationForm" class="nfc-r-form"><label>Nombre<input name="customer_name" required></label><label>Teléfono<input name="phone"></label><label class="nfc-r-full">Email<input name="email" type="email"></label><label>Fecha<input name="reservation_date" type="date" required></label><label>Hora<input name="reservation_time" type="time"></label><label>Personas<input name="party_size" type="number" min="1" max="99" value="2" required></label><label class="nfc-r-full">Notas<textarea name="notes"></textarea></label><div class="nfc-r-full nfc-r-error" id="nfcReservationError"></div><div class="nfc-r-full nfc-r-actions"><button type="button" class="nfc-r-cancel">Cerrar</button><button type="submit" class="nfc-r-submit">Enviar reserva</button></div></form></div>`;document.body.appendChild(m);m.onclick=e=>{if(e.target===m)m.classList.remove('show')};m.querySelector('.nfc-r-cancel').onclick=()=>m.classList.remove('show');m.querySelector('form').onsubmit=submitReservation;
  }
  async function submitReservation(e){e.preventDefault();const c=getClient(),f=new FormData(e.target),err=document.getElementById('nfcReservationError');if(err)err.textContent='';const row={business_id:business.id,customer_name:String(f.get('customer_name')||''),customer_phone:String(f.get('phone')||''),phone:String(f.get('phone')||''),email:String(f.get('email')||''),reservation_date:String(f.get('reservation_date')||''),reservation_time:String(f.get('reservation_time')||'')||null,party_size:Number(f.get('party_size')||1),notes:String(f.get('notes')||''),source:'public_web',status:'pending'};const r=await c.from('reservations').insert(row);if(r.error){if(err)err.textContent='No se pudo enviar la reserva.';console.error(r.error);return}e.target.reset();e.target.querySelector('[name="party_size"]').value='2';document.getElementById('nfcPublicReservationModal').classList.remove('show');msg('Reserva enviada ✓');}

  async function init(){
    css();const c=getClient();if(!c)return;
    const r=await c.from('businesses').select('id,name,slug,description,instagram,whatsapp,phone,city,business_type,appearance_config,site_config').eq('slug',slug()).maybeSingle();if(r.error||!r.data)return;
    business=r.data;
    // This is the key sync point: saved dashboard appearance is always read from Supabase here.
    applyAppearance(business.appearance_config);
    syncContent();await renderMenu();ensureReservation();
  }
  init();
})();
