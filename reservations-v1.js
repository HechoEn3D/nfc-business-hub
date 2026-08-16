/* NFC Business Hub — Reservations V1
   Independent fallback module. Uses the existing visual theme and only renders
   when the existing reservations module is not already present. */
(function(){
  'use strict';
  if (window.__NFC_RESERVATIONS_V1) return;
  window.__NFC_RESERVATIONS_V1 = true;

  const URL='https://znegwqcdaxqfzbjyzija.supabase.co';
  const KEY='sb_publishable_OxUV1v29_QwhZQyy7Skg3w_-f1gTcre';
  let client=null,business=null;
  const getClient=()=>client||(client=window.supabase?.createClient(URL,KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}}));
  const esc=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[c]));
  const notify=t=>window.notify?window.notify(t):console.log(t);

  function css(){
    if(document.getElementById('nfc-reservations-v1-css')) return;
    const s=document.createElement('style'); s.id='nfc-reservations-v1-css';
    s.textContent=`
      .nfc-rsv-empty{padding:28px;text-align:center;color:#7b776f;border:1px dashed #ddd8ce;border-radius:16px;background:#faf9f5}
      .nfc-rsv-toolbar{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap;margin-bottom:16px}
      .nfc-rsv-toolbar h3{margin:0;font-size:28px;letter-spacing:-.04em}.nfc-rsv-toolbar p{margin:4px 0 0;color:#77746d;font-size:12px}
      .nfc-rsv-card{background:#fff;border:1px solid #e6e2d9;border-radius:18px;padding:16px}
      .nfc-rsv-table{width:100%;border-collapse:collapse}.nfc-rsv-table th,.nfc-rsv-table td{padding:11px 8px;text-align:left;border-bottom:1px solid #eeeae2;font-size:12px}.nfc-rsv-table th{font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:#89857d}
      .nfc-rsv-badge{display:inline-flex;padding:5px 8px;border-radius:999px;font-size:10px;font-weight:900;background:#f2efe8;color:#67635a}.nfc-rsv-badge.pending{background:#fff4d9;color:#866b32}.nfc-rsv-badge.confirmed{background:#eaf6ef;color:#24724f}.nfc-rsv-badge.canceled,.nfc-rsv-badge.no_show{background:#faece9;color:#a24d42}
      .nfc-rsv-select{border:1px solid #ddd8ce;border-radius:10px;padding:7px 9px;background:#fbfaf7;font:inherit;font-size:11px}
      .nfc-rsv-public-btn{width:100%;margin-top:12px;border:0;border-radius:14px;padding:14px 16px;background:#171714;color:#fff;font-weight:900;cursor:pointer}
      .nfc-rsv-modal{position:fixed;inset:0;z-index:100002;display:none;align-items:flex-end;justify-content:center;background:rgba(18,17,14,.56);backdrop-filter:blur(12px)}
      .nfc-rsv-modal.show{display:flex}.nfc-rsv-sheet{width:min(620px,100%);max-height:92vh;overflow:auto;background:#fff;border-radius:26px 26px 0 0;padding:22px;box-shadow:0 -24px 80px rgba(0,0,0,.2)}
      .nfc-rsv-sheet h3{margin:0;font-size:30px;letter-spacing:-.05em}.nfc-rsv-sheet p{color:#77746d;font-size:12px}
      .nfc-rsv-form{display:grid;grid-template-columns:1fr 1fr;gap:10px}.nfc-rsv-form .full{grid-column:1/-1}.nfc-rsv-form input,.nfc-rsv-form textarea{width:100%;box-sizing:border-box;border:1px solid #ddd8ce;border-radius:12px;padding:11px;background:#fbfaf7;font:inherit}.nfc-rsv-form textarea{min-height:86px;resize:vertical}
      .nfc-rsv-actions{display:flex;gap:8px;margin-top:12px}.nfc-rsv-actions button{flex:1;border:0;border-radius:12px;padding:12px;font-weight:900;cursor:pointer}.nfc-rsv-main{background:#171714;color:#fff}.nfc-rsv-ghost{background:#f1eee8;color:#302e29}
      @media(max-width:620px){.nfc-rsv-form{grid-template-columns:1fr}.nfc-rsv-form .full{grid-column:auto}.nfc-rsv-table{display:block;overflow:auto;white-space:nowrap}}
    `; document.head.appendChild(s);
  }

  async function loadBusiness(){
    const c=getClient(); if(!c)return null;
    const {data:{user}}=await c.auth.getUser(); if(!user)return null;
    const {data}=await c.from('businesses').select('id,name,owner_id,business_type').eq('owner_id',user.id).maybeSingle();
    business=data||null; return business;
  }

  function existingReservationView(){
    return document.querySelector('[data-core-view="nfcCoreReservations"], #nfcCoreReservations, [data-nfc-reservations], #nfcReservationsView');
  }

  function addSidebar(){
    const side=document.querySelector('.sidebar'); if(!side || side.querySelector('[data-nfc-rsv-nav]')) return;
    if(existingReservationView()) return;
    const item=document.createElement('div'); item.className='side-item'; item.dataset.nfcRsvNav='1'; item.textContent='📅 Reservas'; side.appendChild(item);
    item.addEventListener('click',openDashboard);
  }

  async function openDashboard(){
    const main=document.querySelector('.dash-main'); if(!main||!business)return;
    let view=document.getElementById('nfcReservationsV1View');
    if(!view){view=document.createElement('div');view.id='nfcReservationsV1View';view.className='dash-view';main.appendChild(view)}
    document.querySelectorAll('.dash-view').forEach(x=>x.classList.remove('active')); view.classList.add('active');
    document.querySelectorAll('.side-item').forEach(x=>x.classList.remove('active')); document.querySelector('[data-nfc-rsv-nav]')?.classList.add('active');
    await renderDashboard(view);
  }

  async function renderDashboard(view){
    const c=getClient(); const {data:rows,error}=await c.from('reservations').select('*').eq('business_id',business.id).order('reservation_date',{ascending:true}).order('reservation_time',{ascending:true}).limit(200);
    if(error){view.innerHTML='<div class="nfc-rsv-card">No se pudieron cargar las reservas.</div>';return}
    const list=rows||[];
    const pending=list.filter(x=>x.status==='pending').length, confirmed=list.filter(x=>x.status==='confirmed').length;
    view.innerHTML=`<div class="nfc-rsv-toolbar"><div><h3>Reservas</h3><p>${esc(business.name||'Tu negocio')} · ${pending} pendientes · ${confirmed} confirmadas</p></div><button class="btn" id="nfcRsvRefresh">Actualizar</button></div>
      ${list.length?`<div class="nfc-rsv-card"><table class="nfc-rsv-table"><thead><tr><th>Fecha</th><th>Cliente</th><th>Personas</th><th>Estado</th><th>Notas</th></tr></thead><tbody>${list.map(x=>`<tr><td><strong>${esc(x.reservation_date)}</strong><br><small>${x.reservation_time?String(x.reservation_time).slice(0,5):'—'}</small></td><td><strong>${esc(x.customer_name)}</strong><br><small>${esc(x.phone||x.email||'')}</small></td><td>${x.party_size}</td><td><select class="nfc-rsv-select" data-rsv-status="${x.id}"><option value="pending" ${x.status==='pending'?'selected':''}>Pendiente</option><option value="confirmed" ${x.status==='confirmed'?'selected':''}>Confirmada</option><option value="completed" ${x.status==='completed'?'selected':''}>Completada</option><option value="canceled" ${x.status==='canceled'?'selected':''}>Cancelada</option><option value="no_show" ${x.status==='no_show'?'selected':''}>No show</option></select></td><td>${esc(x.notes||'')}</td></tr>`).join('')}</tbody></table></div>`:'<div class="nfc-rsv-empty"><strong>Todavía no hay reservas.</strong><br>Cuando un cliente reserve desde tu web aparecerá aquí.</div>'}`;
    view.querySelector('#nfcRsvRefresh')?.addEventListener('click',()=>renderDashboard(view));
    view.querySelectorAll('[data-rsv-status]').forEach(sel=>sel.addEventListener('change',async()=>{const r=await c.from('reservations').update({status:sel.value}).eq('id',sel.dataset.rsvStatus).eq('business_id',business.id);if(r.error)notify('No se pudo actualizar la reserva');else notify('Reserva actualizada ✓')}));
  }

  async function log(eventType,bizId,meta={}){try{const c=getClient();await c.from('analytics_events').insert({business_id:bizId,event_type:eventType,path:location.pathname,metadata:meta,session_id:'rsv-'+Math.random().toString(36).slice(2)})}catch(e){console.debug('reservation analytics',e)}}

  async function publicInit(){
    const c=getClient(); if(!c)return; const m=location.pathname.match(/^\/b\/([^/]+)\/?$/i); if(!m)return;
    const {data:biz}=await c.from('businesses').select('id,name,business_type').eq('slug',decodeURIComponent(m[1])).maybeSingle(); if(!biz)return;
    if(document.querySelector('.nfc-public-reserve,.nfc-rsv-public-btn')) return;
    const btn=document.createElement('button');btn.className='nfc-rsv-public-btn';btn.textContent=biz.business_type==='gym'?'Reservar una clase':(biz.business_type==='barbershop'||biz.business_type==='beauty'?'Reservar cita':'Reservar / solicitar');
    const host=document.querySelector('#publicBusinessPage .public-content')||document.getElementById('publicBusinessPage')||document.body; host.prepend(btn); btn.addEventListener('click',()=>openModal(biz));
  }

  function openModal(biz){
    let modal=document.getElementById('nfcRsvPublicModal');
    if(!modal){modal=document.createElement('div');modal.id='nfcRsvPublicModal';modal.className='nfc-rsv-modal';document.body.appendChild(modal)}
    modal.innerHTML=`<div class="nfc-rsv-sheet"><h3>Reservar</h3><p>${esc(biz.name||'El negocio')} recibirá tu solicitud y podrá confirmarla.</p><form class="nfc-rsv-form"><input name="customer_name" required placeholder="Nombre"><input name="phone" placeholder="Teléfono"><input class="full" name="email" type="email" placeholder="Email"><input name="reservation_date" required type="date"><input name="reservation_time" type="time"><input name="party_size" type="number" min="1" max="99" value="2" required placeholder="Personas"><textarea class="full" name="notes" placeholder="Notas (opcional)"></textarea><div class="nfc-rsv-actions full"><button type="button" class="nfc-rsv-ghost" id="nfcRsvClose">Cerrar</button><button class="nfc-rsv-main">Enviar solicitud</button></div></form></div>`;
    modal.classList.add('show'); modal.onclick=e=>{if(e.target===modal)modal.classList.remove('show')}; modal.querySelector('#nfcRsvClose').onclick=()=>modal.classList.remove('show');
    modal.querySelector('form').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.currentTarget);const c=getClient();const payload={business_id:biz.id,customer_name:String(f.get('customer_name')||'').trim(),phone:String(f.get('phone')||'').trim()||null,email:String(f.get('email')||'').trim()||null,reservation_date:f.get('reservation_date'),reservation_time:f.get('reservation_time')||null,party_size:Number(f.get('party_size')||1),notes:String(f.get('notes')||'').trim()||null,source:'public_web'};const r=await c.from('reservations').insert(payload);if(r.error){notify('No se pudo enviar la reserva');return}await log('reservation_submit',biz.id,{party_size:payload.party_size});modal.classList.remove('show');notify('Reserva enviada ✓')}
  }

  async function init(){
    css();
    if(/^\/b\//i.test(location.pathname)){setTimeout(publicInit,500);return;}
    let tries=0;const t=setInterval(async()=>{tries++;if(document.querySelector('.dash-main')){clearInterval(t);business=await loadBusiness();if(!existingReservationView()){addSidebar()}else{document.querySelector('[data-nfc-rsv-nav]')?.remove()} }if(tries>50)clearInterval(t)},300);
  }
  init();
})();
