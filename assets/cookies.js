/* ═══════════════════════════════════════════════════
   APH Drone — Gestion du consentement cookies (RGPD)
   Catégories : essentiels (toujours actifs) / tiers (Google Maps)
   Durée de validité du consentement : 6 mois
   ═══════════════════════════════════════════════════ */
(function(){
  var STORAGE_KEY = 'aphdrone_cookie_consent';
  var VALIDITY_DAYS = 180;

  function getConsent(){
    try{
      var raw = localStorage.getItem(STORAGE_KEY);
      if(!raw) return null;
      var data = JSON.parse(raw);
      var age = Date.now() - data.date;
      if(age > VALIDITY_DAYS * 24 * 60 * 60 * 1000) return null;
      return data;
    }catch(e){ return null; }
  }

  function saveConsent(tiers){
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ tiers: !!tiers, date: Date.now() }));
    applyConsent(tiers);
  }

  function applyConsent(tiers){
    document.querySelectorAll('[data-consent="tiers"]').forEach(function(el){
      if(tiers){
        if(el.dataset.src && !el.src){ el.src = el.dataset.src; }
        el.classList.remove('cookie-blocked');
      } else {
        el.classList.add('cookie-blocked');
      }
    });
  }

  function injectStyles(){
    var css = [
      '.cookie-banner{position:fixed;left:0;right:0;bottom:0;z-index:99999;background:#0B1F3A;color:white;padding:18px 24px;display:flex;align-items:center;gap:20px;flex-wrap:wrap;box-shadow:0 -8px 30px rgba(0,0,0,.2);font-family:Inter,sans-serif;}',
      '.cookie-banner p{flex:1;min-width:240px;font-size:.85rem;line-height:1.5;color:rgba(255,255,255,.85);margin:0;}',
      '.cookie-banner p a{color:#7fc8ff;text-decoration:underline;}',
      '.cookie-banner .actions{display:flex;gap:10px;flex-wrap:wrap;}',
      '.cookie-btn{padding:10px 18px;border-radius:8px;font-size:.82rem;font-weight:600;cursor:pointer;border:1.5px solid transparent;transition:.15s;white-space:nowrap;}',
      '.cookie-btn.accept{background:#1F5FAF;color:white;}',
      '.cookie-btn.accept:hover{background:#4A90E2;}',
      '.cookie-btn.refuse{background:transparent;color:white;border-color:rgba(255,255,255,.3);}',
      '.cookie-btn.refuse:hover{border-color:white;}',
      '.cookie-btn.customize{background:transparent;color:rgba(255,255,255,.7);border-color:transparent;text-decoration:underline;padding:10px 6px;}',
      '.cookie-modal-overlay{display:none;position:fixed;inset:0;background:rgba(11,31,58,.6);z-index:100000;align-items:center;justify-content:center;padding:20px;}',
      '.cookie-modal-overlay.open{display:flex;}',
      '.cookie-modal{background:white;border-radius:16px;padding:30px;max-width:460px;width:100%;font-family:Inter,sans-serif;color:#222;}',
      '.cookie-modal h3{font-size:1.1rem;color:#0B1F3A;margin-bottom:6px;}',
      '.cookie-modal>p{font-size:.82rem;color:#7a8fa5;margin-bottom:20px;line-height:1.5;}',
      '.cookie-cat{display:flex;justify-content:space-between;align-items:flex-start;gap:14px;padding:14px 0;border-bottom:1px solid #eef1f6;}',
      '.cookie-cat:last-of-type{border-bottom:none;}',
      '.cookie-cat h4{font-size:.88rem;color:#0B1F3A;margin-bottom:4px;}',
      '.cookie-cat p{font-size:.76rem;color:#94a3b8;line-height:1.4;}',
      '.cookie-toggle{position:relative;width:42px;height:23px;flex-shrink:0;}',
      '.cookie-toggle input{opacity:0;width:0;height:0;}',
      '.cookie-toggle .slider{position:absolute;inset:0;background:#cbd5e1;border-radius:20px;cursor:pointer;transition:.2s;}',
      '.cookie-toggle .slider::before{content:"";position:absolute;width:17px;height:17px;left:3px;top:3px;background:white;border-radius:50%;transition:.2s;}',
      '.cookie-toggle input:checked+.slider{background:#16a34a;}',
      '.cookie-toggle input:checked+.slider::before{transform:translateX(19px);}',
      '.cookie-toggle input:disabled+.slider{opacity:.5;cursor:not-allowed;}',
      '.cookie-modal-actions{display:flex;gap:10px;margin-top:22px;}',
      '.cookie-modal-actions button{flex:1;padding:12px;border-radius:9px;font-size:.85rem;font-weight:600;cursor:pointer;border:1.5px solid #dde3ec;background:white;color:#1F5FAF;}',
      '.cookie-modal-actions button.primary{background:#1F5FAF;color:white;border-color:#1F5FAF;}',
      '.cookie-blocked{display:flex;align-items:center;justify-content:center;background:#F5F7FA;min-height:200px;border-radius:12px;text-align:center;padding:24px;}',
      '.cookie-blocked-msg{font-size:.85rem;color:#64748b;font-family:Inter,sans-serif;}',
      '.cookie-blocked-msg button{margin-top:10px;padding:8px 16px;border-radius:7px;border:1.5px solid #1F5FAF;background:white;color:#1F5FAF;font-size:.8rem;font-weight:600;cursor:pointer;}'
    ].join('');
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  function buildBanner(){
    var banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.id = 'cookie-banner';
    banner.innerHTML =
      '<p>Ce site utilise des cookies essentiels à son fonctionnement, et des contenus tiers (Google Maps) nécessitant votre accord. ' +
      '<a href="/pages/confidentialite.html">En savoir plus</a></p>' +
      '<div class="actions">' +
        '<button class="cookie-btn customize" id="cookie-customize">Personnaliser</button>' +
        '<button class="cookie-btn refuse" id="cookie-refuse">Refuser</button>' +
        '<button class="cookie-btn accept" id="cookie-accept">Accepter</button>' +
      '</div>';
    document.body.appendChild(banner);

    document.getElementById('cookie-accept').addEventListener('click', function(){
      saveConsent(true);
      banner.remove();
    });
    document.getElementById('cookie-refuse').addEventListener('click', function(){
      saveConsent(false);
      banner.remove();
    });
    document.getElementById('cookie-customize').addEventListener('click', function(){
      openModal();
    });
  }

  function buildModal(){
    var overlay = document.createElement('div');
    overlay.className = 'cookie-modal-overlay';
    overlay.id = 'cookie-modal-overlay';
    overlay.innerHTML =
      '<div class="cookie-modal">' +
        '<h3>Paramètres des cookies</h3>' +
        '<p>Choisissez les cookies que vous acceptez. Vous pouvez modifier ce choix à tout moment depuis le lien "Paramétrer les cookies" en bas de page.</p>' +
        '<div class="cookie-cat">' +
          '<div><h4>Cookies essentiels</h4><p>Connexion à votre espace personnel, sécurité. Toujours actifs.</p></div>' +
          '<label class="cookie-toggle"><input type="checkbox" checked disabled><span class="slider"></span></label>' +
        '</div>' +
        '<div class="cookie-cat">' +
          '<div><h4>Contenus tiers (Google Maps)</h4><p>Affichage de la carte interactive sur la page Contact.</p></div>' +
          '<label class="cookie-toggle"><input type="checkbox" id="cookie-toggle-tiers"><span class="slider"></span></label>' +
        '</div>' +
        '<div class="cookie-modal-actions">' +
          '<button id="cookie-modal-save">Enregistrer</button>' +
          '<button class="primary" id="cookie-modal-accept-all">Tout accepter</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);

    document.getElementById('cookie-modal-save').addEventListener('click', function(){
      var tiers = document.getElementById('cookie-toggle-tiers').checked;
      saveConsent(tiers);
      closeModal();
      var b = document.getElementById('cookie-banner');
      if(b) b.remove();
    });
    document.getElementById('cookie-modal-accept-all').addEventListener('click', function(){
      saveConsent(true);
      closeModal();
      var b = document.getElementById('cookie-banner');
      if(b) b.remove();
    });
    overlay.addEventListener('click', function(e){
      if(e.target === overlay) closeModal();
    });
  }

  function openModal(){
    var existing = getConsent();
    var overlay = document.getElementById('cookie-modal-overlay');
    if(!overlay){ buildModal(); overlay = document.getElementById('cookie-modal-overlay'); }
    document.getElementById('cookie-toggle-tiers').checked = existing ? existing.tiers : false;
    overlay.classList.add('open');
  }
  function closeModal(){
    var overlay = document.getElementById('cookie-modal-overlay');
    if(overlay) overlay.classList.remove('open');
  }

  // Blocage des contenus tiers non-consentis (ex: iframe Google Maps)
  function blockThirdPartyEmbeds(){
    document.querySelectorAll('iframe[data-consent="tiers"]').forEach(function(el){
      if(!el.dataset.src) el.dataset.src = el.src || '';
      el.removeAttribute('src');
      var wrapper = document.createElement('div');
      wrapper.className = 'cookie-blocked';
      var msg = document.createElement('div');
      msg.className = 'cookie-blocked-msg';
      msg.innerHTML = 'Contenu bloqué (Google Maps) tant que vous n\'avez pas accepté les cookies tiers.<br><button type="button">Autoriser et afficher</button>';
      el.parentNode.insertBefore(wrapper, el);
      wrapper.appendChild(msg);
      el.style.display = 'none';
      msg.querySelector('button').addEventListener('click', function(){
        saveConsent(true);
        location.reload();
      });
    });
  }

  window.openCookieSettings = openModal;

  document.addEventListener('DOMContentLoaded', function(){
    injectStyles();
    var consent = getConsent();
    if(consent === null){
      buildBanner();
      blockThirdPartyEmbeds();
    } else {
      applyConsent(consent.tiers);
      if(!consent.tiers) blockThirdPartyEmbeds();
    }
  });
})();
