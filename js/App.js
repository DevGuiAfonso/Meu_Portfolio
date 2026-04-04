(function () {
  'use strict';

  var isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

  /* ── Lenis smooth scroll ── */
  var lenis = new Lenis({
    duration: 1.12,
    easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
    smoothWheel: !isTouch,
    touchMultiplier: isTouch ? 2 : 1,
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
  gsap.ticker.lagSmoothing(0);

  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  /* ── Customização do cursor do mouse ── */
  if (!isTouch) {
    var cur = document.getElementById('cursor');
    var ring = document.getElementById('cursor-ring');
    cur.style.display = 'block';
    ring.style.display = 'block';
    var mx = window.innerWidth / 2, my = window.innerHeight / 2;
    var rx = mx, ry = my;
    window.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; });
    (function tick() {
      cur.style.left = mx + 'px'; cur.style.top = my + 'px';
      rx += (mx - rx) * 0.11; ry += (my - ry) * 0.11;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      requestAnimationFrame(tick);
    })();
    document.querySelectorAll('a,button').forEach(function (el) {
      el.addEventListener('mouseenter', function () { gsap.to(cur, { width: 18, height: 18, duration: .16 }); });
      el.addEventListener('mouseleave', function () { gsap.to(cur, { width: 10, height: 10, duration: .16 }); });
    });
  } else {
    document.querySelectorAll('a,button').forEach(function (el) { el.style.cursor = 'pointer'; });
  }

  /* ── barra de progreço no topo do site ── */
  gsap.to('#progress-bar', {
    scaleX: 1, ease: 'none',
    scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: true }
  });

  /* ── Hero entrance ── */
  gsap.timeline({ delay: .18 })
    .to('.hero-eyebrow', { opacity: 1, y: 0, duration: .58, ease: 'power3.out' })
    .to('.hero-title-inner', { y: '0%', duration: .86, stagger: .1, ease: 'power4.out' }, '-=.28')
    .to('.hero-sub', { opacity: 1, y: 0, duration: .68, ease: 'power3.out' }, '-=.4')
    .to('.hero-actions', { opacity: 1, y: 0, duration: .68, ease: 'power3.out' }, '-=.4')
    .to('.scroll-hint', { opacity: 1, duration: .5 }, '-=.1');

  /* ── Navbar section sync ── */
  var navLinks = document.querySelectorAll('.nav-link');
  function setActive(id) {
    navLinks.forEach(function (l) { l.classList.remove('active'); });
    var a = document.querySelector('.nav-link[data-section="' + id + '"]');
    if (a) a.classList.add('active');
  }
  document.querySelectorAll('section[id]').forEach(function (sec) {
    ScrollTrigger.create({
      trigger: sec, start: 'top 52%', end: 'bottom 52%',
      onEnter: function () { setActive(sec.id); },
      onEnterBack: function () { setActive(sec.id); },
    });
  });
  navLinks.forEach(function (l) {
    l.addEventListener('click', function (e) {
      e.preventDefault();
      var t = document.getElementById(l.dataset.section);
      if (t) lenis.scrollTo(t, { duration: 1.26, offset: 0 });
    });
  });
  document.getElementById('navCta').addEventListener('click', function () {
    lenis.scrollTo(document.getElementById('cntt'), { duration: 1.26 });
  });

  /* Navbar scroll shadow */
  ScrollTrigger.create({
    start: 'top -40',
    onEnter: function () { gsap.to('#navbar', { boxShadow: '0 8px 32px rgba(0,0,0,.10)', duration: .4 }); },
    onLeaveBack: function () { gsap.to('#navbar', { boxShadow: '0 4px 20px rgba(0,0,0,.07)', duration: .4 }); },
  });

  /* ── Sobre ── */
  gsap.timeline({ scrollTrigger: { trigger: '#sobre', start: 'top 74%' } })
    .to('#sobre .section-label', { opacity: 1, y: 0, duration: .56, ease: 'power3.out' })
    .to('#sobre .section-title', { opacity: 1, y: 0, duration: .66, ease: 'power3.out' }, '-=.26')
    .to('.sobre-card', { opacity: 1, y: 0, duration: .66, stagger: .11, ease: 'power3.out' }, '-=.26');

  /* ── Showcase header ── */
  gsap.timeline({ scrollTrigger: { trigger: '#showcase', start: 'top 75%' } })
    .to('#showcase-label', { opacity: 1, y: 0, duration: .56, ease: 'power3.out' })
    .to('#showcase-title', { opacity: 1, y: 0, duration: .66, ease: 'power3.out' }, '-=.26');



  /* ══════════════════════════════════════════ Recado para mim mesmo para não esquecer:
 CARROSSEL — fixo (pin) + rolagem (scrub), sem espaços

 O espaço do “spacer” é eliminado por:
 1. #showcase usa display:block, sem padding/overflow:hidden
 2. pinSpacing:true → o pin-spacer do GSAP ajusta automaticamente
    à distância de rolagem
 3. end() retorna exatamente (slideW + gap) × (n-1), de modo que
    a altura do spacer == a rolagem consumida, sem sobra
══════════════════════════════════════════ */
  var track = document.getElementById('carouselTrack');
  var slides = Array.from(track.querySelectorAll('.carousel-slide'));
  var dots = Array.from(document.querySelectorAll('.carousel-dot'));

  function getGap() {
    var cs = getComputedStyle(track);
    return parseFloat(cs.gap || cs.columnGap) || 16;
  }
  function scrollDist() {
    if (!slides[0]) return 0;
    return (slides[0].offsetWidth + getGap()) * (slides.length - 1);
  }
  function styleSlides() {
    var cx = window.innerWidth / 2;
    slides.forEach(function (s) {
      var rc = s.getBoundingClientRect();
      var dist = Math.abs((rc.left + rc.width * 0.5) - cx);
      var r = Math.max(0, 1 - dist / (window.innerWidth * 0.52));
      gsap.set(s, {
        scale: 0.84 + r * 0.16,
        filter: 'brightness(' + (0.48 + r * 0.52) + ')',
        transformOrigin: 'center center',
      });
    });
  }
  function updateDots(p) {
    var idx = Math.round(p * (slides.length - 1));
    dots.forEach(function (d, i) { d.classList.toggle('active', i === idx); });
  }

  ScrollTrigger.create({
    trigger: '#showcase',
    start: 'top top',
    end: function () { return '+=' + scrollDist(); },
    pin: '.showcase-sticky',
    pinSpacing: true,
    anticipatePin: 1,
    scrub: 0.9,
    invalidateOnRefresh: true,
    onUpdate: function (self) {
      track.style.transform = 'translateX(' + (-scrollDist() * self.progress) + 'px)';
      updateDots(self.progress);
      styleSlides();
    },
    onRefresh: function () {
      track.style.transform = 'translateX(0px)';
      setTimeout(styleSlides, 80);
    },
  });
  setTimeout(styleSlides, 180);

  /* ── Contatos ── */
  gsap.timeline({ scrollTrigger: { trigger: '#cntt', start: 'top 65%' } })
    .to('#cntt .section-label', { opacity: 1, y: 0, duration: .56, ease: 'power3.out' })
    .to('#cntt .section-title', { opacity: 1, y: 0, duration: .66, ease: 'power3.out' }, '-=.26')
    .to('#cntt .section-sub', { opacity: 1, y: 0, duration: .66, ease: 'power3.out' }, '-=.26')
    .to('.cntt-card-main', { opacity: 1, x: 0, rotation: 0, duration: .82, ease: 'power3.out' }, '-=.44')
    .to('.stat-card', { opacity: 1, y: 0, duration: .56, stagger: .09, ease: 'power3.out' }, '-=.44')
    .to('.cntt-list', { opacity: 1, y: 0, duration: .56, ease: 'power3.out' }, '-=.3');

  /* Stat counters */
  document.querySelectorAll('.stat-number[data-target]').forEach(function (el) {
    var target = parseFloat(el.dataset.target);
    var isFloat = target % 1 !== 0;
    ScrollTrigger.create({
      trigger: el, start: 'top 88%', once: true,
      onEnter: function () {
        var obj = { v: 0 };
        gsap.to(obj, {
          v: target, duration: 1.8, ease: 'power2.out',
          onUpdate: function () {
            el.textContent = isFloat
              ? obj.v.toFixed(1)
              : Math.round(obj.v) + (target >= 100 ? '+' : '');
          }
        });
      }
    });
  });

  /* ── CTTS ── */
  gsap.to('.cntt-inner', {
    opacity: 1, y: 0, scale: 1, duration: .8, ease: 'power3.out',
    scrollTrigger: { trigger: '#cntt', start: 'top 72%' }
  });

  /* ── Hero orb parallax ── */
  [['orb-1', -90], ['orb-2', -64], ['orb-3', -46]].forEach(function (pair) {
    gsap.to('.' + pair[0], {
      y: pair[1], ease: 'none',
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
    });
  });

  /* ══════════════════════════════════════════
     MODAL — iformações da timeline
  ══════════════════════════════════════════ */
  var MODAL_DATA = {
    eu: {
      title: 'Eu',
      label: 'Trajetória Pessoal',
      tags: ['Clique e arraste para scrollar a modal'],
      tagColors: [],
      timeline: [
        {
          period: '2013 → 2019',
          title: 'Início da Jornada',
          desc: 'Meu primeiro contato com tecnologia foi ainda criança, porque minha família tinha uma lan house. Eu vivia naquele ambiente, mexendo em tudo, fuçando os computadores, mas era mais curiosidade do que qualquer outra coisa.A vontade real de aprender programação veio quando tentei criar um mod para Minecraft — não deu certo, mas foi justamente essa tentativa frustrada que me fez querer entender de verdade como as coisas funcionavam.',
          status: 'done'
        },
        {
          period: '2020 → Dez 2022',
          title: 'Primeiros Passos',
          desc: 'Na pandemia, com mais tempo livre, comecei a ir mais a fundo. Parei de só usar e fui tentar entender o que estava por trás das coisas. Eu ficava me perguntando como os softwares funcionavam e por que parecia tão complicado fazer até um simples “Hello World”. Foi aí que dei meu primeiro passo mais sério.',
          status: 'done'
        },
        {
          period: 'Ago 2023 → Dez 2024',
          title: 'Primeiro Contato Formal com Desenvolvimento de SoftWare',
          desc: 'Depois de terminar o ensino médio, entrei na Etec no curso técnico de Desenvolvimento de Sistemas. Ali eu tive um choque de realidade — percebi que sabia muito menos do que imaginava. Mas, ao invés de me desanimar, isso me deu mais vontade ainda de aprender. Nesse período, também atuei como assistente técnico dos professores, ajudando na manutenção e configuração dos desktops da escola.Isso me colocou mais próximo da parte prática e me fez aprender na marra a resolver problemas reais. Foi aí que comecei a mudar minha forma de estudar e a levar isso com mais foco, já pensando em trabalhar na área.',
          status: 'done'
        },
        {
          period: 'Fev 2025 → Jul 2025',
          title: 'Evolução Nos Estudos',
          desc: 'Assim que terminei o técnico, já fui atrás da faculdade. Fiquei um tempo em dúvida sobre qual curso escolher, até encontrar Ciência da Computação. Quando vi a grade, fez total sentido pra mim. Mas entrando lá, veio outro choque: de novo percebi que ainda tinha muito chão pela frente — e isso só aumentou minha vontade de evoluir.',
          status: 'done'
        },
        {
          period: 'Ago 2025 → Presente',
          title: 'Entrando ',
          desc: 'Depois do primeiro semestre, comecei a procurar minha primeira oportunidade. Mandei currículo pra todo lado até aparecer uma chance inesperada: virar professor de robótica. No começo achei que nem fazia sentido tentar, ainda mais vendo que tinha gente bem mais experiente concorrendo. Mesmo assim, fui. Fiz a entrevista, dei o meu melhor… e consegui. Hoje, trabalho como professor de robótica.',
          status: 'ongoing'
        },
        {
          period: '2027',
          title: 'Futuro Proximo',
          desc: 'Eu gosto muito de ensinar, mas sei que quero crescer ainda mais. Meu objetivo é entrar de vez na área de programação, seja back-end ou front-end — gosto dos dois. Agora o foco é continuar evoluindo até chegar lá.',
          status: 'ongoing'
        },
      ]
    },
    academico: {
      title: 'Acadêmico',
      label: 'Formação & Estudos',
      tags: ['Clique e arraste para scrollar a modal'],
      tagColors: [{ color: 'var(--accent2)', bg: 'var(--accent2-lt)' }],
      timeline: [
        {
          period: 'Ago 2023 → Dez 2024',
          title: 'Técnico - Desenvolvimento de Sistemas (ETEC)',
          desc: 'Foi aqui que tive meu primeiro contato formal com diversas áreas da tecnologia, incluindo programação, redes, desenvolvimento front-end e back-end, design e banco de dados.',
          status: 'done'
        },
        {
          period: 'Fev 2025 → Dez 2025',
          title: 'Graduação - semipresencial (Ciência da Computação) — 1º Ano (São Judas)',
          desc: 'Ingresso na faculdade de Ciência da Computação. Disciplinas de algoritmos, lógica, Java e estrutura de dados — base teórica aprofundada.',
          status: 'done'
        },
        {
          period: 'Fev 2026 → Dez 2026',
          title: 'Graduação - semipresencial (Ciência da Computação) — 2º Ano (São Judas)',
          desc: 'Foco em engenharia de software, interfaces e sistemas distribuídos. Iniciação científica sobre acessibilidade em interfaces web.',
          status: 'ongoing'
        },
      ]
    },
    carreira: {
      title: 'Carreira',
      label: 'Experiência Profissional',
      tags: ['Clique e arraste para scrollar a modal'],
      tagColors: [{ color: 'var(--accent3)', bg: 'var(--accent3-lt)' }],
      timeline: [
        {
          period: 'Ago 2024 → Dez 2024',
          title: 'Assistente técnico (Não remunerado)',
          desc: 'Atuação informal como assistente técnico, oferecendo suporte a alunos e professores. Responsável pela manutenção de computadores, instalação e configuração de softwares, além da preparação de ambientes de desenvolvimento utilizando Visual Studio Code e C#, auxiliando também na resolução de problemas técnicos.',
          status: 'done'
        },
        {
          period: 'Ago 2025 → Atuando',
          title: 'Professor de Robótica',
          desc: 'Atuo como professor de robótica, conduzindo aulas teóricas e práticas com foco em programação, eletrônica e automação. Através de projetos com microcontroladores, sensores e atuadores, desenvolvo não apenas habilidades técnicas, mas também o pensamento lógico, a criatividade, o trabalho em equipe e a responsabilidade dos alunos.',
          status: 'ongoing'
        },
      ]
    }
  };

  var overlay = document.getElementById('modal-overlay');
  var modalBox = document.getElementById('modalBox');
  var modalClose = document.getElementById('modalClose');
  var modalIcon = document.getElementById('modalIcon');
  var modalLabel = document.getElementById('modalLabel');
  var modalTitle = document.getElementById('modal-title-text');
  var modalTags = document.getElementById('modalTags');
  var modalTl = document.getElementById('modalTimeline');

  function buildTimeline(items) {
    return items.map(function (item, i) {
      var statusClass = item.status === 'done' ? 'done' : 'ongoing';
      var statusLabel = item.status === 'done' ? 'Concluído' : 'Em andamento';
      return [
        '<div class="timeline-item">',
        '<div class="timeline-left">',
        '<div class="timeline-dot"></div>',
        '<div class="timeline-connector"></div>',
        '</div>',
        '<div class="timeline-card">',
        '<div class="timeline-period"><span class="timeline-period-dot"></span>' + item.period + '</div>',
        '<div class="timeline-card-title">' + item.title + '</div>',
        '<p class="timeline-card-desc">' + item.desc + '</p>',
        '<div class="timeline-status ' + statusClass + '"><span class="timeline-status-dot"></span>' + statusLabel + '</div>',
        '</div>',
        '</div>'
      ].join('');
    }).join('');
  }

  function buildTags(tags, colors) {
    return tags.map(function (tag, i) {
      navCta
      var c = colors && colors[i];
      var style = c ? ' style="color:' + c.color + ';background:' + c.bg + '"' : '';
      return '<span class="modal-tag"' + style + '>' + tag + '</span>';
    }).join('');
  }

  function openModal(key) {
    var d = MODAL_DATA[key];
    if (!d) return;

    /* populate */
    modalIcon.textContent = d.icon;
    modalLabel.textContent = d.label;
    modalTitle.textContent = d.title;
    modalTags.innerHTML = buildTags(d.tags, d.tagColors);
    modalTl.innerHTML = buildTimeline(d.timeline);

    /* lock body scroll — but keep native scroll working inside modal-box */
    var scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = '-' + scrollY + 'px';
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.overflowY = 'scroll';
    document.body.dataset.scrollY = scrollY;
    lenis.stop();

    /* show */
    overlay.classList.add('open');
    modalBox.scrollTop = 0;

    /* animate timeline items in */
    var cards = modalTl.querySelectorAll('.timeline-card');
    var dots = modalTl.querySelectorAll('.timeline-dot');
    gsap.fromTo(cards,
      { opacity: 0, x: -16 },
      { opacity: 1, x: 0, duration: .48, stagger: .09, ease: 'power3.out', delay: .18 }
    );
    gsap.fromTo(dots,
      { scale: 0 },
      { scale: 1, duration: .36, stagger: .09, ease: 'back.out(2)', delay: .18 }
    );
  }

  function closeModal() {
    var scrollY = parseInt(document.body.dataset.scrollY || '0', 10);
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.overflowY = '';
    window.scrollTo(0, scrollY);
    lenis.start();
    overlay.classList.remove('open');
  }

  /* ── Para scrollar clicando na modal (mouse + touch) ── */
  (function () {
    var el = modalBox;
    var isDragging = false;
    var startY = 0;
    var startScroll = 0;
    var velY = 0;
    var lastY = 0;
    var lastT = 0;
    var rafId = null;
    var DRAG_THRESHOLD = 4; /* px — abaixo disso = não arrasta */
    var didDrag = false;

    function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

    /* momentum loop */
    function momentum() {
      velY *= 0.88;
      el.scrollTop += velY;
      if (Math.abs(velY) > 0.5) {
        rafId = requestAnimationFrame(momentum);
      } else {
        velY = 0;
      }
    }

    /* ── MOUSE ── */
    el.addEventListener('mousedown', function (e) {
      /* only main button, ignore clicks on interactive children */
      if (e.button !== 0) return;
      if (e.target.closest('a, button')) return;
      isDragging = true;
      didDrag = false;
      startY = e.clientY;
      startScroll = el.scrollTop;
      lastY = e.clientY;
      lastT = Date.now();
      velY = 0;
      cancelAnimationFrame(rafId);
      el.style.cursor = 'grabbing';
      el.style.userSelect = 'none';
      e.preventDefault();
    });

    window.addEventListener('mousemove', function (e) {
      if (!isDragging) return;
      var dy = e.clientY - startY;
      if (Math.abs(dy) > DRAG_THRESHOLD) didDrag = true;
      if (!didDrag) return;

      /* velocity */
      var now = Date.now();
      var dt = now - lastT || 16;
      velY = (lastY - e.clientY) / dt * 14;
      lastY = e.clientY;
      lastT = now;

      el.scrollTop = startScroll - dy;
    });

    window.addEventListener('mouseup', function (e) {
      if (!isDragging) return;
      isDragging = false;
      el.style.cursor = '';
      el.style.userSelect = '';
      if (didDrag) {
        /* kick off momentum */
        rafId = requestAnimationFrame(momentum);
        /* prevent the mouseup from bubbling as a click to the overlay */
        e.stopPropagation();
      }
    });

    /* suppress click-on-overlay-close when user was dragging */
    el.addEventListener('click', function (e) {
      if (didDrag) { e.stopPropagation(); didDrag = false; }
    }, true);

    /* ── TOUCH (extra inertia layer on top of native) ── */
    var touchStartY = 0;
    var touchLastY = 0;
    var touchLastT = 0;
    var touchVelY = 0;
    var touchStartScroll = 0;

    el.addEventListener('touchstart', function (e) {
      var t = e.touches[0];
      touchStartY = t.clientY;
      touchLastY = t.clientY;
      touchLastT = Date.now();
      touchStartScroll = el.scrollTop;
      touchVelY = 0;
      cancelAnimationFrame(rafId);
    }, { passive: true });

    el.addEventListener('touchmove', function (e) {
      var t = e.touches[0];
      var now = Date.now();
      var dt = now - touchLastT || 16;
      touchVelY = (touchLastY - t.clientY) / dt * 14;
      touchLastY = t.clientY;
      touchLastT = now;
    }, { passive: true });

    el.addEventListener('touchend', function () {
      velY = touchVelY;
      rafId = requestAnimationFrame(momentum);
    }, { passive: true });

  })();

  /* open on card click / keyboard */
  document.querySelectorAll('.sobre-card[data-modal]').forEach(function (card) {
    card.addEventListener('click', function () { openModal(card.dataset.modal); });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(card.dataset.modal); }
    });
  });

  /* close on overlay click */
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeModal();
  });
  modalClose.addEventListener('click', closeModal);

  /* close on Escape */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
  });

  /* ── Resize + orientation ── */
  var rt;
  function onResize() {
    clearTimeout(rt);
    rt = setTimeout(function () {
      ScrollTrigger.refresh(true);
      setTimeout(styleSlides, 100);
    }, 200);
  }
  window.addEventListener('resize', onResize);
  window.addEventListener('orientationchange', function () { setTimeout(onResize, 350); });
})();