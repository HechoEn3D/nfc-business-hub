/* NFC Business Hub — Business Type Onboarding V1 */
(function () {
  const TYPES = {
    restaurant: { icon: '🍽️', name: 'Restaurante', description: 'Carta, promociones, reservas y horarios.' },
    gym: { icon: '🏋️', name: 'Gimnasio', description: 'Clases, entrenadores, planes y horarios.' },
    barbershop: { icon: '💈', name: 'Barbería / Peluquería', description: 'Servicios, precios, citas y profesionales.' },
    beauty: { icon: '✨', name: 'Estética', description: 'Tratamientos, precios, citas y promociones.' },
    shop: { icon: '🛍️', name: 'Tienda', description: 'Catálogo, novedades, ofertas y contacto.' },
    bazaar: { icon: '🏪', name: 'Bazar / Comercio', description: 'Productos, ofertas, horarios y ubicación.' },
    hotel: { icon: '🏨', name: 'Hotel / Alojamiento', description: 'Habitaciones, servicios, reservas y ubicación.' },
    other: { icon: '➕', name: 'Otro negocio', description: 'Configuración flexible para cualquier actividad.' }
  };

  const MODULES = {
    restaurant: ['🍽️ Carta','🔥 Promociones','📅 Reservas','⭐ Reseñas','📍 Ubicación','📊 Analítica'],
    gym: ['🏋️ Clases','👤 Entrenadores','💳 Planes','🔥 Promociones','📍 Ubicación','📊 Analítica'],
    barbershop: ['✂️ Servicios','📅 Reservas','👤 Profesionales','🔥 Promociones','📍 Ubicación','📊 Analítica'],
    beauty: ['✨ Tratamientos','📅 Reservas','👤 Profesionales','🔥 Promociones','📍 Ubicación','📊 Analítica'],
    shop: ['🛍️ Catálogo','🔥 Ofertas','🆕 Novedades','📍 Ubicación','💬 Contacto','📊 Analítica'],
    bazaar: ['🏪 Productos','🔥 Ofertas','🕐 Horarios','📍 Ubicación','💬 Contacto','📊 Analítica'],
    hotel: ['🛏️ Alojamiento','🍽️ Servicios','📅 Reservas','📍 Ubicación','💬 Recepción','📊 Analítica'],
    other: ['📄 Información','🔥 Promociones','🔗 Enlaces','📍 Ubicación','📅 Reservas','📊 Analítica']
  };

  function client() { return window.NFCBusinessHub?.supabaseClient || window.supabaseClient || null; }

  function styles() {
    if (document.getElementById('nfc-type-onboarding-css')) return;
    const s = document.createElement('style');
    s.id = 'nfc-type-onboarding-css';
    s.textContent = `
      #nfcTypeOnboarding{position:fixed;inset:0;z-index:99999;display:none;align-items:center;justify-content:center;padding:18px;background:rgba(20,20,16,.58);backdrop-filter:blur(16px)}
      #nfcTypeOnboarding.show{display:flex}
      .nfc-type-modal{width:min(760px,100%);max-height:92vh;overflow:auto;background:#fff;border-radius:28px;padding:30px;box-shadow:0 35px 100px rgba(0,0,0,.25)}
      .nfc-type-modal h2{margin:10px 0 8px;font-size:clamp(30px,5vw,48px)}
      .nfc-type-modal p{color:#77746d;line-height:1.55;margin-top:0}
      .nfc-type-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin:22px 0 16px}
      .nfc-type-option{border:1px solid #e6e3db;background:#fff;border-radius:16px;padding:15px;text-align:left;cursor:pointer;transition:.2s}
      .nfc-type-option:hover{transform:translateY(-2px);box-shadow:0 10px 25px rgba(20,20,16,.07)}
      .nfc-type-option.selected{border:2px solid #171714;background:#faf9f5}
      .nfc-type-option .ico{font-size:25px;display:block;margin-bottom:7px}.nfc-type-option strong{display:block}.nfc-type-option small{display:block;color:#77746d;margin-top:4px;line-height:1.4}
      #nfcTypeContinue{width:100%;border:0;border-radius:14px;padding:15px;background:#171714;color:#fff;font-weight:900;cursor:pointer}#nfcTypeContinue:disabled{opacity:.35;cursor:not-allowed}
      #nfcTypeError{color:#b34d40;font-size:13px;font-weight:700;text-align:center;min-height:20px;margin-top:9px}
      @media(max-width:620px){.nfc-type-grid{grid-template-columns:1fr}.nfc-type-modal{padding:22px;border-radius:22px}}
    `;
    document.head.appendChild(s);
  }

  function modal() {
    if (document.getElementById('nfcTypeOnboarding')) return;
    const el = document.createElement('div');
    el.id = 'nfcTypeOnboarding';
    el.innerHTML = `<div class="nfc-type-modal"><div style="font-size:10px;font-weight:900;letter-spacing:.12em;color:#8b7a59">NFC BUSINESS HUB</div><h2>¿Qué tipo de negocio tienes?</h2><p>Elige tu tipo de negocio y prepararemos tu dashboard con las herramientas más útiles para ti.</p><div class="nfc-type-grid">${Object.entries(TYPES).map(([id,t])=>`<button type="button" class="nfc-type-option" data-type="${id}"><span class="ico">${t.icon}</span><strong>${t.name}</strong><small>${t.description}</small></button>`).join('')}</div><button id="nfcTypeContinue" type="button" disabled>Continuar</button><div id="nfcTypeError"></div></div>`;
    document.body.appendChild(el);
    let selected = null;
    el.querySelectorAll('.nfc-type-option').forEach(btn => btn.addEventListener('click', () => {
      el.querySelectorAll('.nfc-type-option').forEach(x => x.classList.remove('selected'));
      btn.classList.add('selected'); selected = btn.dataset.type;
      el.querySelector('#nfcTypeContinue').disabled = false;
    }));
    el.querySelector('#nfcTypeContinue').addEventListener('click', async () => {
      if (!selected) return;
      const c = client();
      const business = window.NFCBusinessHub?.currentBusiness || null;
      if (!c || !business?.id) { el.querySelector('#nfcTypeError').textContent = 'No se ha podido localizar tu negocio.'; return; }
      const b = el.querySelector('#nfcTypeContinue'); b.disabled = true; b.textContent = 'Guardando…';
      const { data, error } = await c.from('businesses').update({business_type:selected}).eq('id',business.id).select('id,business_type').maybeSingle();
      if (error || !data) { console.error(error); b.disabled = false; b.textContent = 'Reintentar'; el.querySelector('#nfcTypeError').textContent = 'No se pudo guardar. Comprueba los permisos de Supabase.'; return; }
      window.NFCBusinessHub.currentBusiness.business_type = selected;
      localStorage.setItem('nfcBusinessType', selected);
      el.remove();
      window.dispatchEvent(new CustomEvent('nfc:business-type-changed',{detail:{type:selected}}));
      if (typeof window.selectBusinessType === 'function') window.selectBusinessType(selected);
    });
    el.classList.add('show');
  }

  function init() {
    styles();
    const b = window.NFCBusinessHub?.currentBusiness;
    if (!b) return;
    if (!b.business_type) modal();
    else if (typeof window.selectBusinessType === 'function') window.selectBusinessType(b.business_type);
  }

  window.NFCBusinessTypeOnboarding = { init, TYPES, MODULES };
  window.addEventListener('nfc:business-loaded', init);
  setTimeout(init, 1200);
})();
