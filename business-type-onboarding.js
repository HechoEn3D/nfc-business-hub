/* NFC Business Hub — Business Type Onboarding V4 */
(function () {
  const TYPES = {
    restaurant: { icon:'🍽️', name:'Restaurante', description:'Carta, promociones, reservas y horarios.' },
    gym: { icon:'🏋️', name:'Gimnasio', description:'Clases, entrenadores, planes y horarios.' },
    barbershop: { icon:'💈', name:'Barbería / Peluquería', description:'Servicios, precios, citas y profesionales.' },
    beauty: { icon:'✨', name:'Estética', description:'Tratamientos, precios, citas y promociones.' },
    shop: { icon:'🛍️', name:'Tienda', description:'Catálogo, novedades, ofertas y contacto.' },
    bazaar: { icon:'🏪', name:'Bazar / Comercio', description:'Productos, ofertas, horarios y ubicación.' },
    hotel: { icon:'🏨', name:'Hotel / Alojamiento', description:'Habitaciones, servicios, reservas y ubicación.' },
    other: { icon:'➕', name:'Otro negocio', description:'Configuración flexible para cualquier actividad.' }
  };

  const MODULES = {
    restaurant:[['🍽️','Carta','Tus productos y categorías'],['🔥','Promociones','Ofertas activas'],['📅','Reservas','Reservas de clientes'],['⭐','Reseñas','Opiniones de clientes'],['📍','Ubicación','Cómo llegar'],['📊','Analítica','Visitas e interacciones']],
    gym:[['🏋️','Clases','Tus clases y horarios'],['👤','Entrenadores','Equipo del gimnasio'],['💳','Planes','Membresías y precios'],['🔥','Promociones','Ofertas activas'],['📍','Ubicación','Cómo llegar'],['📊','Analítica','Visitas e interacciones']],
    barbershop:[['✂️','Servicios','Cortes y precios'],['📅','Citas','Reservas de clientes'],['👤','Profesionales','Tu equipo'],['🔥','Promociones','Ofertas activas'],['📍','Ubicación','Cómo llegar'],['📊','Analítica','Visitas e interacciones']],
    beauty:[['✨','Tratamientos','Servicios y precios'],['📅','Citas','Reservas de clientes'],['👤','Profesionales','Tu equipo'],['🔥','Promociones','Ofertas activas'],['📍','Ubicación','Cómo llegar'],['📊','Analítica','Visitas e interacciones']],
    shop:[['🛍️','Catálogo','Tus productos'],['🔥','Ofertas','Promociones activas'],['🆕','Novedades','Productos destacados'],['📍','Ubicación','Cómo llegar'],['💬','Contacto','WhatsApp y teléfono'],['📊','Analítica','Visitas e interacciones']],
    bazaar:[['🏪','Productos','Tu catálogo'],['🔥','Ofertas','Promociones activas'],['🕐','Horarios','Apertura y cierre'],['📍','Ubicación','Cómo llegar'],['💬','Contacto','WhatsApp y teléfono'],['📊','Analítica','Visitas e interacciones']],
    hotel:[['🛏️','Alojamiento','Habitaciones y servicios'],['🍽️','Servicios','Desayuno y extras'],['📅','Reservas','Solicitudes de clientes'],['📍','Ubicación','Cómo llegar'],['💬','Recepción','Contacto'],['📊','Analítica','Visitas e interacciones']],
    other:[['📄','Información','Contenido del negocio'],['🔥','Promociones','Ofertas activas'],['🔗','Enlaces','Redes y contacto'],['📍','Ubicación','Cómo llegar'],['📅','Reservas','Solicitudes'],['📊','Analítica','Visitas e interacciones']]
  };

  function getClient(){
    if(!window.supabase) return null;
    if(!window.__nfcBusinessTypeClient){
      window.__nfcBusinessTypeClient=window.supabase.createClient(
        'https://znegwqcdaxqfzbjyzija.supabase.co',
        'sb_publishable_OxUV1v29_QwhZQyy7Skg3w_-f1gTcre',
        {auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}}
      );
    }
    return window.__nfcBusinessTypeClient;
  }

  function styles(){
    if(document.getElementById('nfc-type-onboarding-css')) return;
    const s=document.createElement('style');
    s.id='nfc-type-onboarding-css';
    s.textContent=`
      #nfcTypeOnboarding{position:fixed;inset:0;z-index:99999;display:none;align-items:center;justify-content:center;padding:18px;background:rgba(20,20,16,.58);backdrop-filter:blur(16px)}
      #nfcTypeOnboarding.show{display:flex}
      .nfc-type-modal{width:min(760px,100%);max-height:92vh;overflow:auto;background:#fff;border-radius:28px;padding:30px;box-shadow:0 35px 100px rgba(0,0,0,.25)}
      .nfc-type-modal h2{margin:10px 0 8px;font-size:clamp(30px,5vw,48px);letter-spacing:-.05em}
      .nfc-type-modal p{color:#77746d;line-height:1.55;margin-top:0}
      .nfc-type-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin:22px 0 16px}
      .nfc-type-option{border:1px solid #e6e3db;background:#fff;border-radius:16px;padding:15px;text-align:left;cursor:pointer;transition:.2s}
      .nfc-type-option:hover{transform:translateY(-2px);box-shadow:0 10px 25px rgba(20,20,16,.07)}
      .nfc-type-option.selected{border:2px solid #171714;background:#faf9f5}
      .nfc-type-option .ico{font-size:25px;display:block;margin-bottom:7px}.nfc-type-option strong{display:block}.nfc-type-option small{display:block;color:#77746d;margin-top:4px;line-height:1.4}
      #nfcTypeContinue{width:100%;border:0;border-radius:14px;padding:15px;background:#171714;color:#fff;font-weight:900;cursor:pointer}#nfcTypeContinue:disabled{opacity:.35;cursor:not-allowed}
      #nfcTypeError{color:#b34d40;font-size:13px;font-weight:700;text-align:center;min-height:20px;margin-top:9px}
      #nfcSectorView .nfc-sector-head{display:flex;justify-content:space-between;gap:16px;align-items:flex-end;margin-bottom:16px}
      #nfcSectorView .nfc-sector-head h3{margin:0;font-size:24px;letter-spacing:-.04em}
      #nfcSectorView .nfc-sector-head p{margin:6px 0 0;color:#77746d;font-size:13px;line-height:1.5}
      .nfc-sector-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
      .nfc-sector-card{border:1px solid #e6e3db;background:#fff;border-radius:18px;padding:16px;text-align:left;cursor:pointer;transition:transform .22s ease,box-shadow .22s ease,border-color .22s ease}
      .nfc-sector-card:hover{transform:translateY(-3px);box-shadow:0 14px 30px rgba(20,20,16,.08);border-color:#d8b675}
      .nfc-sector-card .icon{font-size:24px;display:block;margin-bottom:10px}.nfc-sector-card strong{display:block;font-size:14px}.nfc-sector-card span{display:block;margin-top:5px;color:#7b776f;font-size:11px;line-height:1.45}
      .nfc-sector-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:14px}
      .nfc-sector-stat{padding:13px;border:1px solid #e6e3db;border-radius:15px;background:#faf9f5}.nfc-sector-stat small{display:block;color:#88847c;font-size:10px}.nfc-sector-stat strong{display:block;font-size:21px;margin-top:4px}
      .nfc-sector-list{margin-top:14px;padding:16px;border:1px solid #e6e3db;border-radius:18px;background:#fff}.nfc-sector-list h4{margin:0 0 10px;font-size:14px}.nfc-sector-list-row{display:flex;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:1px solid #eeeae1;font-size:12px}.nfc-sector-list-row:last-child{border-bottom:0}
      @media(max-width:900px){.nfc-sector-grid{grid-template-columns:1fr 1fr}.nfc-sector-stats{grid-template-columns:1fr 1fr 1fr}}
      @media(max-width:620px){.nfc-type-grid{grid-template-columns:1fr}.nfc-type-modal{padding:22px;border-radius:22px}.nfc-sector-grid{grid-template-columns:1fr}.nfc-sector-stats{grid-template-columns:1fr 1fr}.nfc-sector-card{padding:14px}}
    `;
    document.head.appendChild(s);
  }

  function insertSectorView(){
    if(document.getElementById('nfcSectorView')) return;
    const main=document.querySelector('.dash-main');
    if(!main) return false;
    const anchor=main.querySelector('[data-dash-view="negocio"]');
    if(!anchor) return false;

    const side=main.parentElement?.querySelector('.sidebar');
    if(side && !side.querySelector('[data-dash-section="sector"]')){
      const item=document.createElement('div');
      item.className='side-item';
      item.dataset.dashSection='sector';
      item.textContent='Mi negocio';
      side.insertBefore(item,side.querySelector('[data-dash-section="negocio"]')||null);
      item.addEventListener('click',()=>window.switchDashboardSection?.('sector'));
    }

    const view=document.createElement('div');
    view.className='dash-view';
    view.dataset.dashView='sector';
    view.id='nfcSectorView';
    view.innerHTML=`<div class="nfc-sector-head"><div><h3 id="nfcSectorTitle">Mi negocio</h3><p id="nfcSectorDescription">Herramientas adaptadas a tu negocio.</p></div><span class="small" id="nfcSectorTypeLabel"></span></div><div class="nfc-sector-grid" id="nfcSectorGrid"></div><div class="nfc-sector-stats" id="nfcSectorStats"></div><div class="nfc-sector-list" id="nfcSectorList"></div>`;
    main.insertBefore(view,anchor);
    return true;
  }

  function setSectorTitle(type,business){
    const cfg=TYPES[type]||TYPES.other;
    const title=document.getElementById('nfcSectorTitle');
    const desc=document.getElementById('nfcSectorDescription');
    const label=document.getElementById('nfcSectorTypeLabel');
    if(title) title.textContent=cfg.icon+' '+cfg.name;
    if(desc) desc.textContent=`Dashboard especializado para ${business?.name||'tu negocio'}.`;
    if(label) label.textContent=(business?.city||'')+' · '+cfg.name;
  }

  async function loadSectorData(type,business){
    const c=getClient();
    if(!c || !business?.id) return;
    const grid=document.getElementById('nfcSectorGrid');
    const stats=document.getElementById('nfcSectorStats');
    const list=document.getElementById('nfcSectorList');
    const modules=MODULES[type]||MODULES.other;
    if(grid){
      grid.innerHTML=modules.map((m,i)=>`<button type="button" class="nfc-sector-card" data-module-index="${i}"><span class="icon">${m[0]}</span><strong>${m[1]}</strong><span>${m[2]}</span></button>`).join('');
    }

    const results={services:[],staff:[],classes:[],reservations:[]};
    if(['gym'].includes(type)){
      const [a,b,d]=await Promise.all([
        c.from('classes').select('id,name,start_time,end_time,day_of_week,active').eq('business_id',business.id).order('day_of_week').order('start_time'),
        c.from('staff').select('id,name,role,active').eq('business_id',business.id).order('name'),
        c.from('business_services').select('id,name,price,duration_minutes,active').eq('business_id',business.id).order('name')
      ]);
      results.classes=a.data||[]; results.staff=b.data||[]; results.services=d.data||[];
    } else if(['barbershop','beauty','hotel','other'].includes(type)){
      const [a,b,d]=await Promise.all([
        c.from('services').select('id,name,price,duration_minutes,active').eq('business_id',business.id).order('name'),
        c.from('staff').select('id,name,role,active').eq('business_id',business.id).order('name'),
        c.from('reservations').select('id,status,reservation_date,customer_name').eq('business_id',business.id).order('reservation_date',{ascending:false}).limit(50)
      ]);
      results.services=a.data||[]; results.staff=b.data||[]; results.reservations=d.data||[];
    } else if(['shop','bazaar','restaurant'].includes(type)){
      const [a,b]=await Promise.all([
        c.from('menu_items').select('id,name,price,category,available').eq('business_id',business.id).order('position').order('id'),
        c.from('business_promotions').select('id,title,active').eq('business_id',business.id).order('id',{ascending:false})
      ]);
      results.services=a.data||[]; results.reservations=b.data||[];
    }

    const primaryCount=type==='gym'?results.classes.length:results.services.length;
    const secondaryCount=type==='gym'?results.staff.length:(type==='restaurant'||type==='shop'||type==='bazaar'?results.reservations.length:results.reservations.length);
    const bookings=results.reservations.length;
    if(stats) stats.innerHTML=`<div class="nfc-sector-stat"><small>${type==='gym'?'Clases':(['shop','bazaar','restaurant'].includes(type)?'Productos':'Servicios')}</small><strong>${primaryCount}</strong></div><div class="nfc-sector-stat"><small>${type==='gym'?'Entrenadores':(['shop','bazaar','restaurant'].includes(type)?'Promociones':'Profesionales')}</small><strong>${secondaryCount}</strong></div><div class="nfc-sector-stat"><small>Reservas / solicitudes</small><strong>${bookings}</strong></div>`;

    const title=type==='gym'?'Próximas clases':(['restaurant','shop','bazaar'].includes(type)?'Contenido del negocio':'Servicios y equipo');
    let rows=[];
    if(type==='gym') rows=results.classes.slice(0,6).map(x=>`<div class="nfc-sector-list-row"><span>🏋️ ${escapeHtmlSafe(x.name)}</span><strong>${x.start_time?String(x.start_time).slice(0,5):'—'}</strong></div>`);
    else if(['restaurant','shop','bazaar'].includes(type)) rows=results.services.slice(0,6).map(x=>`<div class="nfc-sector-list-row"><span>${escapeHtmlSafe(x.name)} · ${escapeHtmlSafe(x.category||'')}</span><strong>${x.price!=null?Number(x.price).toFixed(2)+' €':'—'}</strong></div>`);
    else rows=results.services.slice(0,6).map(x=>`<div class="nfc-sector-list-row"><span>✨ ${escapeHtmlSafe(x.name)}</span><strong>${x.price!=null?Number(x.price).toFixed(2)+' €':'—'}</strong></div>`);
    if(list) list.innerHTML=`<h4>${title}</h4>${rows.length?rows.join(''):'<div style="color:#77746d;font-size:12px">Todavía no hay datos. Añádelos desde tu dashboard y aparecerán aquí.</div>'}`;

    grid?.querySelectorAll('.nfc-sector-card').forEach(card=>{
      card.addEventListener('click',()=>{
        const i=Number(card.dataset.moduleIndex); const m=(MODULES[type]||MODULES.other)[i];
        if(window.notify) window.notify(m[1]+' · módulo preparado ✓');
        if(type==='restaurant' && i===0 && window.switchDashboardSection) window.switchDashboardSection('carta');
        else if((type==='restaurant'||type==='shop'||type==='bazaar') && i===1 && window.switchDashboardSection) window.switchDashboardSection('promociones');
        else if(window.switchDashboardSection) window.switchDashboardSection('sector');
      });
    });
  }

  function escapeHtmlSafe(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}

  function applyDashboardType(type,business){
    if(!type) return;
    localStorage.setItem('nfcBusinessType',type);
    window.NFCBusinessCurrentType=type;
    if(typeof window.selectBusinessType==='function') window.selectBusinessType(type);
    insertSectorView();
    setSectorTitle(type,business);
    const cfg=TYPES[type]||TYPES.other;
    const side=document.querySelector('.sidebar');
    if(side){
      const sector=side.querySelector('[data-dash-section="sector"]');
      if(sector) sector.textContent=cfg.icon+' '+cfg.name;
      const carta=side.querySelector('[data-dash-section="carta"]');
      const allowedCatalogue=['restaurant','shop','bazaar'].includes(type);
      if(carta){carta.style.display=allowedCatalogue?'':'none'; if(allowedCatalogue) carta.textContent=type==='restaurant'?'Carta':'Catálogo';}
      const promo=side.querySelector('[data-dash-section="promociones"]');
      if(promo) promo.style.display=['restaurant','gym','barbershop','beauty','shop','bazaar'].includes(type)?'':'none';
    }
    if(typeof window.switchDashboardSection==='function') window.switchDashboardSection('sector');
    loadSectorData(type,business).catch(err=>console.error('Sector data:',err));
  }

  function createModal(business){
    if(document.getElementById('nfcTypeOnboarding')) return;
    const el=document.createElement('div'); el.id='nfcTypeOnboarding';
    el.innerHTML=`<div class="nfc-type-modal"><div style="font-size:10px;font-weight:900;letter-spacing:.12em;color:#8b7a59">NFC BUSINESS HUB</div><h2>¿Qué tipo de negocio tienes?</h2><p>Elige tu tipo de negocio y prepararemos tu dashboard con las herramientas más útiles para ti.</p><div class="nfc-type-grid">${Object.entries(TYPES).map(([id,t])=>`<button type="button" class="nfc-type-option" data-type="${id}"><span class="ico">${t.icon}</span><strong>${t.name}</strong><small>${t.description}</small></button>`).join('')}</div><button id="nfcTypeContinue" type="button" disabled>Continuar</button><div id="nfcTypeError"></div></div>`;
    document.body.appendChild(el);
    let selected=null;
    el.querySelectorAll('.nfc-type-option').forEach(btn=>btn.addEventListener('click',()=>{el.querySelectorAll('.nfc-type-option').forEach(x=>x.classList.remove('selected'));btn.classList.add('selected');selected=btn.dataset.type;el.querySelector('#nfcTypeContinue').disabled=false;}));
    el.querySelector('#nfcTypeContinue').addEventListener('click',async()=>{
      if(!selected) return; const c=getClient(); const b=el.querySelector('#nfcTypeContinue'); const errorBox=el.querySelector('#nfcTypeError');
      if(!c||!business?.id){errorBox.textContent='No se ha podido localizar tu negocio.';return;}
      b.disabled=true;b.textContent='Guardando…';errorBox.textContent='';
      const {data,error}=await c.from('businesses').update({business_type:selected}).eq('id',business.id).eq('owner_id',business.owner_id).select('id,business_type').maybeSingle();
      if(error||!data){console.error('Business type save:',error);b.disabled=false;b.textContent='Reintentar';errorBox.textContent='No se pudo guardar. Comprueba los permisos de Supabase.';return;}
      business.business_type=selected;el.remove();applyDashboardType(selected,business);if(window.notify) window.notify('Tipo de negocio guardado ✓');
    });
    el.classList.add('show');
  }

  async function fetchBusiness(){
    const c=getClient(); if(!c) return null;
    const {data:{user}}=await c.auth.getUser(); if(!user) return null;
    const {data,error}=await c.from('businesses').select('id,name,slug,description,instagram,whatsapp,phone,city,owner_id,business_type').eq('owner_id',user.id).maybeSingle();
    if(error){console.error('Business type load:',error);return null;}
    if(data && window.currentBusiness) window.currentBusiness.business_type=data.business_type;
    return data||null;
  }

  async function tryInit(){
    styles(); if(window.location.pathname.match(/^\/b\//i)) return true;
    if(!document.querySelector('.dash-main')) return false;
    const business=await fetchBusiness(); if(!business) return false;
    if(!business.business_type){createModal(business);return true;}
    applyDashboardType(business.business_type,business);return true;
  }

  async function init(){
    let attempts=0; const maxAttempts=40;
    const timer=setInterval(async()=>{attempts++;try{const done=await tryInit();if(done||attempts>=maxAttempts) clearInterval(timer);}catch(err){console.error('Business type init:',err);if(attempts>=maxAttempts) clearInterval(timer);}},500);
  }

  window.NFCBusinessTypeOnboarding={init,TYPES,MODULES,applyDashboardType};
  init();
})();
