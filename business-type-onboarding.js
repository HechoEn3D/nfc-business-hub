/* NFC Business Hub — Business Type Onboarding V2 */
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

  function getClient() {
    if (!window.supabase) return null;
    if (!window.__nfcBusinessTypeClient) {
      window.__nfcBusinessTypeClient = window.supabase.createClient(
        'https://znegwqcdaxqfzbjyzija.supabase.co',
        'sb_publishable_OxUV1v29_QwhZQyy7Skg3w_-f1gTcre',
        { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }
      );
    }
    return window.__nfcBusinessTypeClient;
  }

  function styles() {
    if (document.getElementById('nfc-type-onboarding-css')) return;
    const s = document.createElement('style');
    s.id = 'nfc-type-onboarding-css';
    s.textContent = `
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
      @media(max-width:620px){.nfc-type-grid{grid-template-columns:1fr}.nfc-type-modal{padding:22px;border-radius:22px}}
    `;
    document.head.appendChild(s);
  }

  function createModal(business) {
    if (document.getElementById('nfcTypeOnboarding')) return;
    const el = document.createElement('div');
    el.id = 'nfcTypeOnboarding';
    el.innerHTML = `<div class="nfc-type-modal"><div style="font-size:10px;font-weight:900;letter-spacing:.12em;color:#8b7a59">NFC BUSINESS HUB</div><h2>¿Qué tipo de negocio tienes?</h2><p>Elige tu tipo de negocio y prepararemos tu dashboard con las herramientas más útiles para ti.</p><div class="nfc-type-grid">${Object.entries(TYPES).map(([id,t])=>`<button type="button" class="nfc-type-option" data-type="${id}"><span class="ico">${t.icon}</span><strong>${t.name}</strong><small>${t.description}</small></button>`).join('')}</div><button id="nfcTypeContinue" type="button" disabled>Continuar</button><div id="nfcTypeError"></div></div>`;
    document.body.appendChild(el);

    let selected = null;
    el.querySelectorAll('.nfc-type-option').forEach(btn => btn.addEventListener('click', () => {
      el.querySelectorAll('.nfc-type-option').forEach(x => x.classList.remove('selected'));
      btn.classList.add('selected');
      selected = btn.dataset.type;
      el.querySelector('#nfcTypeContinue').disabled = false;
    }));

    el.querySelector('#nfcTypeContinue').addEventListener('click', async () => {
      if (!selected) return;
      const c = getClient();
      const b = el.querySelector('#nfcTypeContinue');
      const errorBox = el.querySelector('#nfcTypeError');
      if (!c || !business?.id) { errorBox.textContent = 'No se ha podido localizar tu negocio.'; return; }

      b.disabled = true;
      b.textContent = 'Guardando…';
      errorBox.textContent = '';

      const { data, error } = await c
        .from('businesses')
        .update({ business_type: selected })
        .eq('id', business.id)
        .eq('owner_id', business.owner_id)
        .select('id,business_type')
        .maybeSingle();

      if (error || !data) {
        console.error('Business type save:', error);
        b.disabled = false;
        b.textContent = 'Reintentar';
        errorBox.textContent = 'No se pudo guardar. Comprueba las políticas de Supabase.';
        return;
      }

      business.business_type = selected;
      localStorage.setItem('nfcBusinessType', selected);
      el.remove();
      if (typeof window.selectBusinessType === 'function') window.selectBusinessType(selected);
      if (typeof window.notify === 'function') window.notify('Tipo de negocio guardado ✓');
    });

    el.classList.add('show');
  }

  async function init() {
    styles();
    if (window.location.pathname.match(/^\/b\//i)) return;
    const hub = window.NFCBusinessHub;
    if (!hub || typeof hub.loadOwnerBusiness !== 'function') return;
    const business = await hub.loadOwnerBusiness();
    if (!business) return;
    if (!business.business_type) createModal(business);
    else if (typeof window.selectBusinessType === 'function') window.selectBusinessType(business.business_type);
  }

  window.NFCBusinessTypeOnboarding = { init, TYPES };
  setTimeout(init, 1600);
})();
