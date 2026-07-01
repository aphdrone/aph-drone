/* APH Drone — Injection automatique du header et du footer communs
   Utilisation : ajouter dans chaque page (avant </body>) :
   <div id="header-placeholder"></div>  (juste après <body>)
   <div id="footer-placeholder"></div>  (à l'endroit du footer)
   <script src="/assets/include.js"></script>
*/
(function () {
  function loadPartial(url, placeholderId, callback) {
    var el = document.getElementById(placeholderId);
    if (!el) return;
    fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error('Erreur chargement ' + url);
        return res.text();
      })
      .then(function (html) {
        el.outerHTML = html;
        if (callback) callback();
      })
      .catch(function (err) {
        console.error(err);
      });
  }

  function initHeaderBehavior() {
    document.querySelectorAll('#site-header .has-dropdown').forEach(function (item) {
      var dd = item.querySelector('.dropdown');
      if (!dd) return;
      item.addEventListener('mouseenter', function () { dd.style.display = 'block'; });
      item.addEventListener('mouseleave', function () { dd.style.display = 'none'; });
    });

    window.toggleMobileMenu = function () {
      var menu = document.getElementById('mobile-menu');
      if (!menu) return;
      menu.classList.toggle('open');
      document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
    };

    function checkMobile() {
      var burger = document.getElementById('burger-btn');
      if (!burger) return;
      if (window.innerWidth <= 768) {
        burger.style.display = 'flex';
      } else {
        burger.style.display = 'none';
        var m = document.getElementById('mobile-menu');
        if (m) { m.classList.remove('open'); document.body.style.overflow = ''; }
      }
    }
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Marquer le lien de navigation actif selon l'URL courante
    var current = window.location.pathname;
    document.querySelectorAll('#site-header nav a, .mobile-menu-sub a').forEach(function (a) {
      if (a.getAttribute('href') === '#') return;
      try {
        var linkPath = new URL(a.href).pathname;
        if (linkPath === current) {
          a.classList.add('active-link');
        }
      } catch (e) {}
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    loadPartial('/partials/header.html', 'header-placeholder', initHeaderBehavior);
    loadPartial('/partials/footer.html', 'footer-placeholder');

    // Bandeau de consentement cookies (RGPD), chargé une seule fois sur toute page
    if (!document.querySelector('script[src="/assets/cookies.js"]')) {
      var cookieScript = document.createElement('script');
      cookieScript.src = '/assets/cookies.js';
      document.body.appendChild(cookieScript);
    }
  });
})();
