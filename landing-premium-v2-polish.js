(function(){
  if(window.__nfcLandingPremiumPolish)return;window.__nfcLandingPremiumPolish=true;
  const css=`
  /* PHONE POLISH — premium hardware feel */
  .p2-device{width:100%;height:100%;border-radius:42px!important;background:linear-gradient(145deg,#0a0a09,#22211d)!important;padding:10px!important;box-shadow:inset 0 0 0 1px rgba(255,255,255,.12),inset 0 0 0 2px rgba(0,0,0,.55),0 40px 95px rgba(0,0,0,.32)!important;position:relative;overflow:hidden}
  .p2-device:after{content:'';position:absolute;left:6px;top:118px;width:3px;height:48px;background:#30302b;border-radius:3px;box-shadow:0 62px #30302b}
  .p2-device-screen{border-radius:33px!important;background:#f7f5ef!important;box-shadow:inset 0 0 0 1px rgba(0,0,0,.13);overflow:hidden}
  .p2-device-screen:after{content:'';position:absolute;inset:0;pointer-events:none;border-radius:33px;box-shadow:inset 0 0 42px rgba(0,0,0,.025)}
  .p2-device-screen:before{width:96px!important;height:26px!important;top:9px!important;box-shadow:0 0 0 1px rgba(255,255,255,.02)}
  .p2-phone-head{height:58px!important;padding:0 20px!important;font-size:9px!important}
  .p2-phone-hero{height:225px!important;padding:22px!important;background:linear-gradient(155deg,#171713,#4d493f 58%,#927c59)!important}
  .p2-phone-hero:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,transparent 42%,rgba(0,0,0,.34));pointer-events:none}
  .p2-phone-hero-copy strong{font-size:31px!important;letter-spacing:-.06em!important}
  .p2-phone-actions{padding:14px!important;gap:7px!important;background:#f7f5ef}
  .p2-phone-action{padding:11px 4px!important;border-radius:13px!important;background:#fff!important;box-shadow:0 5px 16px rgba(20,20,16,.035)}
  .p2-phone-list{padding:0 14px 14px!important;background:#f7f5ef}
  .p2-phone-row{padding:13px!important;border-radius:15px!important;box-shadow:0 6px 18px rgba(20,20,16,.035)}
  .p2-floating-tag{font-size:9px!important;letter-spacing:.12em!important;text-transform:uppercase!important;border-radius:2px!important}
  .p2-tag-a{left:-18px!important}.p2-tag-b{right:-18px!important}
  /* DASHBOARD POLISH */
  .dashboard-section .dashboard-wrap{grid-template-columns:248px 1fr!important;min-height:710px!important;padding:10px!important;border-radius:30px!important;background:#0f0f0e!important}
  .dashboard-section .sidebar{padding:20px 13px!important;border-radius:22px!important;background:linear-gradient(180deg,#171714,#11110f)!important}
  .dashboard-section .side-brand{padding:7px 12px 24px!important;color:#f3eee4!important;font-size:12px!important}
  .dashboard-section .side-item{padding:11px 13px!important;border-radius:11px!important;font-size:10px!important;color:#87837a!important}
  .dashboard-section .side-item.active{background:#27251f!important;color:#fff!important;box-shadow:inset 0 0 0 1px rgba(201,166,105,.2),0 8px 20px rgba(0,0,0,.14)!important}
  .dashboard-section .dash-main{padding:28px!important;border-radius:22px!important;background:#f6f3eb!important;box-shadow:none!important}
  .dashboard-section .dash-top{padding-bottom:20px!important;margin-bottom:20px!important}
  .dashboard-section .stat-grid{gap:10px!important}
  .dashboard-section .stat{min-height:125px!important;padding:18px!important;border-radius:18px!important;background:rgba(255,255,255,.78)!important;border:1px solid rgba(21,21,19,.08)!important;box-shadow:0 8px 28px rgba(21,21,19,.035)!important}
  .dashboard-section .stat .small{font-size:9px!important;text-transform:uppercase;letter-spacing:.09em;color:#817b70!important}
  .dashboard-section .stat b{font-size:34px!important;font-weight:400!important;letter-spacing:-.06em!important}
  .dashboard-section .chart{margin-top:12px!important;padding:20px!important;border-radius:20px!important;background:#fffdf9!important;border:1px solid rgba(21,21,19,.08)!important;box-shadow:0 10px 30px rgba(21,21,19,.04)!important}
  .dashboard-section .bars{height:160px!important;gap:8px!important;align-items:end!important}
  .dashboard-section .bar{background:linear-gradient(180deg,#d0b07b,#b89459)!important;border-radius:7px 7px 3px 3px!important}
  .dashboard-section .dashboard-grid-2{gap:12px!important}
  .dashboard-section .panel{padding:18px!important;border-radius:18px!important;background:rgba(255,255,255,.7)!important;border:1px solid rgba(21,21,19,.08)!important}
  /* PRICING POLISH */
  .pricing-section .pricing{align-items:stretch!important;border-radius:28px!important;box-shadow:0 30px 80px rgba(21,21,19,.09)!important}
  .pricing-section .price-card{min-height:450px!important;padding:34px!important;display:flex!important;flex-direction:column!important}
  .pricing-section .price-card h3{font-size:11px!important;letter-spacing:.18em!important;text-transform:uppercase!important}
  .pricing-section .price-card .price{font-size:76px!important;line-height:.9!important;letter-spacing:-.07em!important;margin:20px 0 7px!important}
  .pricing-section .price-card .checks{margin-top:auto!important;padding-top:22px!important}
  .pricing-section .price-card.popular{position:relative!important;outline:1px solid rgba(201,166,105,.36)!important;outline-offset:-1px!important}
  .pricing-section .price-card.popular:before{content:'RECOMENDADO';position:absolute;top:18px;right:18px;padding:7px 9px;border-radius:99px;background:#c9a669;color:#111;font-size:8px;font-weight:900;letter-spacing:.13em}
  .pricing-section .price-card.popular .badge{display:none!important}
  .pricing-section .price-card .btn{margin-top:20px;width:100%}
  @media(max-width:1020px){.dashboard-section .dashboard-wrap{grid-template-columns:1fr!important}.dashboard-section .sidebar{display:flex!important;overflow:auto!important;gap:6px!important}.dashboard-section .side-item{white-space:nowrap!important}.dashboard-section .dash-main{padding:20px!important}}
  @media(max-width:720px){.p2-frame{width:min(330px,88vw)!important}.p2-tag-a,.p2-tag-b{display:none!important}.dashboard-section .dashboard-wrap{min-height:0!important}.dashboard-section .stat-grid{grid-template-columns:1fr 1fr!important}.dashboard-section .stat{min-height:105px!important;padding:14px!important}.dashboard-section .stat b{font-size:27px!important}.pricing-section .price-card{min-height:380px!important}.pricing-section .price-card .price{font-size:60px!important}}
  `;
  const st=document.createElement('style');st.id='nfc-lp-polish-css';st.textContent=css;document.head.appendChild(st);
  const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
  if(!reduced){document.querySelectorAll('.p2-device,.dashboard-section .dashboard-wrap,.pricing-section .price-card').forEach(el=>{el.addEventListener('pointermove',e=>{if(!matchMedia('(pointer:fine)').matches)return;const r=el.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;const y=(e.clientY-r.top)/r.height-.5;el.style.setProperty('--rx',(-y*2.1).toFixed(2)+'deg');el.style.setProperty('--ry',(x*2.1).toFixed(2)+'deg');el.style.transform=`perspective(1200px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg)) translateY(-2px)`});el.addEventListener('pointerleave',()=>el.style.transform='')});}
})();
