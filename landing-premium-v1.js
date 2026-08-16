/* NFC Business Hub — Original landing loader */
(function(){
  'use strict';
  if(location.pathname && /^\/b\//i.test(location.pathname)) return;
  if(window.__nfcOriginalLandingLoader)return;
  window.__nfcOriginalLandingLoader=true;
  if(document.getElementById('nfc-original-landing'))return;
  const s=document.createElement('script');
  s.id='nfc-original-landing';
  s.src='/landing-premium-v2.js';
  document.head.appendChild(s);
})();
