(function(){
  if(window.__nfcLandingPremiumLoaded)return;
  window.__nfcLandingPremiumLoaded=true;
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root=document.body;root.classList.add('lp-premium');
  const link=document.createElement('link');link.rel='stylesheet';link.href='/landing-premium-v1.css';document.head.appendChild(link);
  const qsa=(s,c=document)=>[...c.querySelectorAll(s)];
  const fine=window.matchMedia('(pointer:fine)').matches;
  if(!reduce&&fine){
    qsa('.feature,.price-card,.demo-phone,.nfc-card').forEach(el=>{
      el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();const x=e.clientX-r.left-r.width/2;const y=e.clientY-r.top-r.height/2;const max=el.classList.contains('nfc-card')?3.5:1.6;el.style.setProperty('--tx',(-y/r.height*max).toFixed(2)+'deg');el.style.setProperty('--ty',(x/r.width*max).toFixed(2)+'deg');el.style.setProperty('--px',((e.clientX-r.left)/r.width*100)+'%');el.style.setProperty('--py',((e.clientY-r.top)/r.height*100)+'%')});
      el.addEventListener('pointerleave',()=>{el.style.removeProperty('--tx');el.style.removeProperty('--ty');el.style.removeProperty('--px');el.style.removeProperty('--py')});
    });
    const s=document.createElement('style');s.textContent='.lp-premium .feature,.lp-premium .price-card,.lp-premium .demo-phone{position:relative;transform:perspective(1000px) rotateX(var(--tx,0deg)) rotateY(var(--ty,0deg));transition:transform .18s ease-out,box-shadow .35s ease,border-color .35s ease}.lp-premium .nfc-card{transform:perspective(1100px) rotateX(var(--tx,0deg)) rotateY(var(--ty,0deg));transition:transform .2s ease-out}.lp-premium .feature::after,.lp-premium .price-card::after,.lp-premium .demo-phone::after{content:"";position:absolute;inset:0;pointer-events:none;border-radius:inherit;background:radial-gradient(circle at var(--px,50%) var(--py,50%),rgba(199,165,106,.11),transparent 36%);opacity:0;transition:opacity .25s ease}.lp-premium .feature:hover::after,.lp-premium .price-card:hover::after,.lp-premium .demo-phone:hover::after{opacity:1}';document.head.appendChild(s);
  }
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('lp-in');observer.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -8% 0px'});
  qsa('.feature,.price-card,.section-head,.demo-shell,.dashboard-wrap,.cta-shine').forEach(e=>observer.observe(e));
  if(!reduce){const s=document.createElement('style');s.textContent='.lp-premium .lp-in{animation:lpReveal .78s cubic-bezier(.2,.8,.2,1) both}@keyframes lpReveal{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:none}}@media(max-width:900px){.lp-premium .feature,.lp-premium .price-card,.lp-premium .demo-phone,.lp-premium .nfc-card{transform:none!important}.lp-premium .lp-in{animation:lpRevealMobile .65s cubic-bezier(.2,.8,.2,1) both}@keyframes lpRevealMobile{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}}';document.head.appendChild(s)}
})();
