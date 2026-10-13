/* MedAmerica Growth pilot: page-local behaviour. The engine stays untouched;
   everything bespoke lives here and reads scroll geometry directly. */
(function () {
  'use strict';

  // Thiago's WhatsApp, digits only with country code. Pending: he will supply it.
  var WHATSAPP = 'WHATSAPP_NUMBER';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var root = document.documentElement;
  var sc = window.ScrollCraft.mount(document.body);

  /* ------------------------------------------------------------ i18n -- */
  var ES = {
    'f.title': 'Portada', 'f.one': 'La oportunidad', 'f.two': 'La brecha', 'f.three': 'La ruta', 'f.four': 'Trabajar juntos', 'f.end': 'Contacto',
    'hero.h1': 'Los pacientes internacionales no son suerte. Son un sistema.',
    'hero.sub': 'Construimos el sistema de adquisición que lleva pacientes de otros países a tu clínica.',
    'cta': 'Hablar por WhatsApp',
    'one.h2': 'En otro país, alguien está buscando exactamente lo que tú haces.',
    'one.p1': 'Cada año, millones de residentes de EE. UU. viajan al exterior para recibir atención médica, y México y Sudamérica están entre sus destinos frecuentes.<sup><a href="#source">1</a></sup>',
    'one.p2': 'Eligen a distancia: lo que pueden encontrar, entender y en lo que pueden confiar en línea, en su propio idioma. Para una clínica en Latinoamérica, esa demanda ya existe. Necesita un camino para llegar a ti.',
    'pass.label': 'Pase de abordar', 'pass.you': 'TÚ', 'pass.clinic': 'Tu clínica', 'pass.pax': 'Pasajero', 'pass.paxv': 'Paciente internacional', 'pass.why': 'Motivo', 'pass.whyv': 'Tratamiento',
    'one.cap': 'Ilustrativo. El viaje empieza mucho antes del vuelo: con una búsqueda.',
    'msg.new': 'Mensaje nuevo', 'msg.text': '¡Hola! ¿Hablan inglés? Estoy en Houston y quisiera saber sobre implantes y cómo funciona el viaje.', 'msg.status': 'Entregado. Sin respuesta desde hace',
    'two.cap': 'Ilustrativo. El mensaje más caro es el que nadie responde.',
    'two.h2': 'Y la mayoría nunca llega a ti.',
    'two.p1': 'Hoy un paciente internacional encuentra una clínica por casualidad: una recomendación, una publicación, un directorio. Cuando escribe, muchas veces es en otro idioma, fuera de horario, con preguntas que nadie del equipo asume.',
    'two.p2': 'Sin una ruta, el interés muere entre el primer mensaje y la primera cita.',
    'inter': 'Existe una ruta.',
    'route.h2': 'De una búsqueda en otro país a una silla en tu clínica.',
    'route.note': 'Escenario ilustrativo. No es un caso de cliente.',
    'sample': 'Ejemplo',
    's1.k': 'Anuncios', 's1.t': 'Campañas en el mercado y el idioma del paciente.', 's1.a': 'Implantes dentales en México, con un equipo que habla inglés', 's1.b': 'Mira el plan de tratamiento y cómo funciona el viaje',
    's2.k': 'Página', 's2.t': 'Una página que responde a la distancia: procedimiento, médico, ubicación, siguiente paso.', 's2.a': 'Tu tratamiento, explicado antes de viajar', 's2.b': 'Procedimiento y etapas', 's2.c': 'Quién te atiende', 's2.d': 'Dónde te hospedas',
    's3.k': 'Calificación', 's3.t': 'Preguntas que separan un clic curioso de un paciente real.', 's3.a': '¿Qué tratamiento estás considerando y cuándo podrías viajar?', 's3.b': 'Implantes. Podría ir en marzo.',
    's4.k': 'Atención', 's4.t': 'Respuestas humanas en el idioma del paciente, con alguien a cargo de la conversación.', 's4.a': 'Respondido en inglés', 's4.b': 'Radiografías solicitadas', 's4.c': 'Fechas de viaje conversadas',
    's5.k': 'Ventas', 's5.t': 'Una consulta agendada, con fechas y siguientes pasos acordados.', 's5.a': 'Videoconsulta agendada', 's5.b': 'Después: plan de tratamiento, viaje, primera cita',
    's6.k': 'Llegada', 's6.t': 'En tu silla.',
    'four.h2': 'De la primera llamada a la primera cita.',
    'four.p': 'El alcance, los plazos y las responsabilidades se definen juntos en la primera conversación.',
    'st1.k': 'Alineación.', 'st1.t': 'Tu oferta, tus objetivos y el mercado que quieres alcanzar.',
    'st2.k': 'Briefing.', 'st2.t': 'La información y los accesos que necesitamos de tu equipo.',
    'st3.k': 'Construcción.', 'st3.t': 'Anuncios, páginas, calificación y atención, dentro del alcance acordado.',
    'st4.k': 'Rutina.', 'st4.t': 'Decisiones y responsabilidades claras de cada lado, revisadas juntos.',
    'end.a': 'Si tu clínica está lista para recibir pacientes de otros países,', 'end.b': 'hablemos por WhatsApp',
    'end.what': 'Adquisición de pacientes para clínicas en Latinoamérica.', 'end.src': 'Fuente', 'end.note': 'Los escenarios ilustrativos de esta página no son casos de clientes.'
  };
  var WA_TEXT = {
    en: "Hi Thiago, I saw the MedAmerica Growth site and I'd like to talk about international patients for my practice.",
    es: 'Hola Thiago, vi el sitio de MedAmerica Growth y quisiera hablar sobre pacientes internacionales para mi clínica.'
  };
  var EN = {};
  var nodes = Array.prototype.slice.call(document.querySelectorAll('[data-i18n],[data-i18n-html]'));
  nodes.forEach(function (n) {
    var k = n.getAttribute('data-i18n') || n.getAttribute('data-i18n-html');
    if (!(k in EN)) EN[k] = n.hasAttribute('data-i18n-html') ? n.innerHTML : n.textContent;
  });
  var lang = 'en';
  var langBox = document.querySelector('.lang');

  function applyLang(next, animate) {
    var dict = next === 'es' ? ES : EN;
    var swap = function () {
      nodes.forEach(function (n) {
        var html = n.hasAttribute('data-i18n-html');
        var k = n.getAttribute(html ? 'data-i18n-html' : 'data-i18n');
        var v = dict[k] != null ? dict[k] : EN[k];
        if (html) n.innerHTML = v; else n.textContent = v;
      });
      document.querySelectorAll('[data-wa]').forEach(function (a) {
        a.href = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(WA_TEXT[next]);
      });
      root.lang = next;
      updateFolioTitle();
      layoutRoute();
    };
    lang = next;
    langBox.setAttribute('data-active', next);
    langBox.querySelectorAll('.lang__opt').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === next)); });
    try { localStorage.setItem('mag-lang', next); } catch (e) {}
    if (!animate || reduce) { swap(); return; }
    root.classList.add('is-swapping');
    setTimeout(function () { swap(); requestAnimationFrame(function () { root.classList.remove('is-swapping'); }); }, 150);
  }
  langBox.addEventListener('click', function (e) {
    var b = e.target.closest('.lang__opt');
    if (b && b.getAttribute('data-lang') !== lang) applyLang(b.getAttribute('data-lang'), true);
  });

  /* ----------------------------------------------------------- folio -- */
  var folio = document.querySelector('.folio');
  var chapters = Array.prototype.slice.call(document.querySelectorAll('.ch'));
  var track = document.querySelector('.folio__track');
  var stamps = [];
  var current = chapters[0];
  var marks = chapters.filter(function (c, i) { return i === 0 || c.getAttribute('data-folio') !== chapters[i - 1].getAttribute('data-folio'); });
  marks.forEach(function () { var li = document.createElement('li'); track.appendChild(li); stamps.push(li); });

  function updateFolioTitle() {
    var k = current.getAttribute('data-folio-key');
    document.querySelector('.folio__num').textContent = current.getAttribute('data-folio');
    var t = document.querySelector('.folio__title');
    t.setAttribute('data-i18n', k);
    t.textContent = (lang === 'es' ? ES : EN)[k] || EN[k] || '';
  }
  // The folio's own label keys need English fallbacks too.
  Object.assign(EN, { 'f.title': 'Title', 'f.one': 'The opportunity', 'f.two': 'The gap', 'f.three': 'The route', 'f.four': 'Working together', 'f.end': 'Contact' });

  var docH = 1, vh = innerHeight, markTops = [];
  function measure() {
    vh = innerHeight;
    docH = Math.max(1, document.documentElement.scrollHeight - vh);
    markTops = marks.map(function (c) { return Math.min(1, Math.max(0, (c.offsetTop) / docH)); });
    stamps.forEach(function (li, i) { li.style.top = (markTops[i] * 100) + '%'; });
  }

  /* -------------------------------------------------- hero planes + pointer -- */
  var hero = document.querySelector('.ch--title');
  var planes = {
    ghost: hero.querySelector('.plane--ghost'),
    left: hero.querySelector('.plane--left'),
    right: hero.querySelector('.plane--right'),
    chev: hero.querySelector('.plane--chevron')
  };
  var ptr = { x: 0, y: 0, tx: 0, ty: 0 };
  if (fine && !reduce) {
    hero.addEventListener('pointermove', function (e) {
      ptr.tx = (e.clientX / innerWidth) * 2 - 1;
      ptr.ty = (e.clientY / innerHeight) * 2 - 1;
    });
    hero.addEventListener('pointerleave', function () { ptr.tx = 0; ptr.ty = 0; });
  }

  /* ----------------------------------------------------------- route -- */
  var routeSec = document.querySelector('.ch--route');
  var routeStage = routeSec.querySelector('[data-sc-stage]');
  var heroStage = document.querySelector('.ch--title [data-sc-stage]');
  var routeLine = routeSec.querySelector('.route__line');
  var stationsG = routeSec.querySelector('.route__stations');
  var stops = Array.prototype.slice.call(routeSec.querySelectorAll('.stop'));
  var L = routeLine.getTotalLength();
  routeLine.style.strokeDasharray = L + ' ' + L;
  var stationEls = [];
  function layoutRoute() {
    stationsG.innerHTML = '';
    stationEls = [];
    stops.forEach(function (s, i) {
      if (s.classList.contains('stop--arrive')) return;
      var f = parseFloat(s.getAttribute('data-at'));
      var p = routeLine.getPointAtLength(f * L);
      var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      var c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('cx', p.x); c.setAttribute('cy', p.y); c.setAttribute('r', 7);
      var t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      var left = p.x < 500;
      t.setAttribute('x', p.x + (left ? -16 : 16)); t.setAttribute('y', p.y + 5);
      t.setAttribute('text-anchor', left ? 'end' : 'start');
      if (Math.abs(p.x - 500) < 20) { t.setAttribute('x', p.x); t.setAttribute('y', p.y - 20); t.setAttribute('text-anchor', 'middle'); }
      t.textContent = s.querySelector('.stop__k span:last-child').textContent;
      g.appendChild(c); g.appendChild(t); stationsG.appendChild(g);
      stationEls.push({ g: g, f: f });
    });
  }

  /* ---------------------------------------------------- msg silence -- */
  var two = document.querySelector('.ch--two');
  var wait = two.querySelector('.msg__wait');

  /* ----------------------------------------------------- the flight -- */
  var flyer = document.querySelector('.flyer');
  var heroSlot = hero.querySelector('[data-slot="hero"] .mpart');
  var landSec = document.querySelector('.ch--colophon');
  var landSlot = landSec.querySelector('[data-slot="land"] .mpart');
  var CHEV_RATIO = 153 / 247.77;
  if (!reduce) root.classList.add('flight');

  var cur = null;
  var clamp = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };
  var ss = function (a, b, v) { var t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
  var mix = function (a, b, t) { return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, w: a.w + (b.w - a.w) * t, r: a.r + (b.r - a.r) * t, c: t < 0.5 ? a.c : b.c }; };
  var fromRect = function (r, c) { return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, r: 0, c: c }; };
  var lastTone = '';

  function frame() {
    var y = scrollY;
    var mobile = innerWidth <= 860;

    // Folio state: chapter under the reading line, stamps passed, tone of the ground.
    var line = vh * 0.5, next = current;
    for (var i = 0; i < chapters.length; i++) {
      var r = chapters[i].getBoundingClientRect();
      if (r.top <= line && r.bottom > line) { next = chapters[i]; break; }
    }
    if (next !== current) { current = next; updateFolioTitle(); }
    var tone = current.getAttribute('data-tone');
    if (tone !== lastTone) { folio.setAttribute('data-tone', tone); lastTone = tone; }
    var pageP = clamp(y / docH);
    stamps.forEach(function (li, i) { li.classList.toggle('is-passed', pageP >= markTops[i] - 0.001); });

    // Hero planes: legs part, ghost breathes, pointer leans the whole stack.
    var hr = hero.getBoundingClientRect();
    var hp = clamp(-hr.top / Math.max(1, hr.height - vh));
    ptr.x += (ptr.tx - ptr.x) * 0.08; ptr.y += (ptr.ty - ptr.y) * 0.08;
    if (!reduce) {
      planes.ghost.style.transform = 'translate3d(' + (ptr.x * -6) + 'px,' + (hp * -36 + ptr.y * -4) + 'px,0) scale(' + (1 + hp * 0.08) + ')';
      planes.left.style.transform = 'translate3d(' + (hp * -7 + ptr.x * 1.1) + '%,' + (hp * 4 + ptr.y * 0.8) + '%,0)';
      planes.right.style.transform = 'translate3d(' + (hp * 7 + ptr.x * 1.1) + '%,' + (hp * 4 + ptr.y * 0.8) + '%,0)';
      planes.chev.style.transform = 'translate3d(' + (ptr.x * 2.4) + '%,' + (ptr.y * 1.8) + '%,0)';
    }

    // Unanswered message: the silence grows while chapter II crosses the screen.
    var tr = two.getBoundingClientRect();
    var tp = clamp((vh - tr.top) / (tr.height + vh));
    var hours = Math.round(ss(0.15, 0.85, tp) * 14);
    var txt = hours + ' h';
    if (wait.textContent !== txt) wait.textContent = txt;

    // Route: draw, light stations, show the current panel.
    var rr = routeSec.getBoundingClientRect();
    var rp = clamp(-rr.top / Math.max(1, rr.height - vh));
    var drawn = clamp((rp - 0.03) / 0.9);
    if (reduce) drawn = Math.max(drawn, 0);
    routeLine.style.strokeDashoffset = String(L * (1 - drawn));
    stationEls.forEach(function (s) { s.g.classList.toggle('is-on', drawn >= s.f - 0.002); });
    var active = -1;
    stops.forEach(function (s, i) { if (drawn >= parseFloat(s.getAttribute('data-at')) - 0.002) active = i; });
    if (active < 0 && rr.top < vh * 0.6) active = 0;
    stops.forEach(function (s, i) { s.classList.toggle('is-on', i === active); });
    routeStage.setAttribute('data-sc-verify-state', drawn.toFixed(2) + '|' + active);
    if (!reduce) heroStage.setAttribute('data-sc-verify-state', hp.toFixed(2));

    if (!reduce) {
      // Anchors: hero slot, folio, route point, landing slot.
      var A = fromRect(heroSlot.getBoundingClientRect(), '#25272B');
      var tRect = track.getBoundingClientRect();
      var F = { x: tRect.left + tRect.width / 2, y: tRect.top + pageP * tRect.height, w: mobile ? 16 : 24, r: 0, c: null };
      var fc = (tone === 'dark' || tone === 'deep') ? '#F3F2EE' : '#25272B';
      F.c = fc;
      var pt = routeLine.getPointAtLength(drawn * L);
      var ahead = routeLine.getPointAtLength(Math.min(L, drawn * L + 1));
      var behind = routeLine.getPointAtLength(Math.max(0, drawn * L - 1));
      var ang = Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 180 / Math.PI + 90;
      var m = routeLine.getScreenCTM();
      var sp = new DOMPoint(pt.x, pt.y).matrixTransform(m);
      var land = ss(0.94, 1, drawn);
      var R = { x: sp.x, y: sp.y - land * (mobile ? 18 : 26), w: (mobile ? 26 : 38) * (1 + land * 0.5), r: ang * (1 - land), c: '#25272B' };
      var C = fromRect(landSlot.getBoundingClientRect(), '#F3F2EE');

      // Take-off climbs above the headline before turning for the margin.
      var tk = ss(0.1, 0.92, hp);
      var top = { x: A.x - (A.x - F.x) * 0.25, y: Math.min(A.y, mobile ? 84 : 46), w: (A.w + F.w) / 2, r: 0, c: A.c };
      var pos = tk < 0.45 ? mix(A, top, ss(0, 0.45, tk)) : mix(top, F, ss(0.45, 1, tk));
      var pre = clamp(1 - rr.top / vh), post = clamp(1 - rr.bottom / vh);
      var wR = rr.top > 0 ? ss(0.62, 1, pre) : 1 - ss(0.3, 0.75, post);
      pos = mix(pos, R, wR);
      var lr = landSec.getBoundingClientRect();
      var wC = ss(0.3, 0.92, clamp(1 - lr.top / vh));
      pos = mix(pos, C, wC);

      if (!cur) cur = pos;
      var k = 0.3;
      cur = { x: cur.x + (pos.x - cur.x) * k, y: cur.y + (pos.y - cur.y) * k, w: cur.w + (pos.w - cur.w) * k, r: cur.r + (pos.r - cur.r) * k, c: pos.c };
      var h = cur.w * CHEV_RATIO;
      flyer.style.width = '100px';
      flyer.style.transform = 'translate3d(' + (cur.x - 50) + 'px,' + (cur.y - 50 * CHEV_RATIO) + 'px,0) rotate(' + cur.r + 'deg) scale(' + (cur.w / 100) + ')';
      if (flyer.style.color !== cur.c) flyer.style.color = cur.c;
    }
    requestAnimationFrame(frame);
  }

  /* ------------------------------------------------------------ boot -- */
  var saved = null;
  try { saved = localStorage.getItem('mag-lang'); } catch (e) {}
  var q = new URLSearchParams(location.search).get('lang');
  layoutRoute();
  applyLang(q === 'es' || q === 'en' ? q : (saved === 'es' ? 'es' : 'en'), false);
  measure();
  addEventListener('resize', function () { measure(); }, { passive: true });
  addEventListener('load', function () { measure(); dispatchEvent(new Event('resize')); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { measure(); if (sc && sc.layout) sc.layout(); });
  requestAnimationFrame(frame);
})();
