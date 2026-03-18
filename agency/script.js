/* ============================================
   Suleman Jaam - AI Engineer Portfolio
   Interactions · Particles · 3D · Reveal
   ============================================ */

(function () {
  'use strict';

  // ========== NAVBAR SCROLL EFFECT ==========
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  function handleNavScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // ========== MOBILE NAV TOGGLE ==========
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close on link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ========== ACTIVE NAV LINK HIGHLIGHT ==========
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav-link');

  function highlightNav() {
    const scrollY = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinksAll.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });

  // ========== SCROLL REVEAL ==========
  const revealElements = document.querySelectorAll('[data-reveal]');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Stagger delay based on order within the parent
          const siblings = entry.target.parentElement.querySelectorAll('[data-reveal]');
          let siblingIndex = 0;
          siblings.forEach((sib, i) => {
            if (sib === entry.target) siblingIndex = i;
          });

          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, siblingIndex * 100);

          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach(el => revealObserver.observe(el));

  // ========== 3D CARD TILT EFFECT ==========
  const cards3d = document.querySelectorAll('.card-3d');

  cards3d.forEach(card => {
    const inner = card.querySelector('.card-3d-inner');
    if (!inner) return;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      inner.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });

  // ========== HERO PARTICLE CANVAS ==========
  const canvas = document.getElementById('heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animFrame;
    let width, height;

    function resize() {
      const hero = canvas.closest('.hero');
      width = hero.offsetWidth;
      height = hero.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    }

    function createParticles() {
      particles = [];
      const count = Math.min(Math.floor((width * height) / 12000), 120);

      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.4,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.4 + 0.1,
          hue: Math.random() > 0.7 ? 270 : 165, // Purple or teal
        });
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 65%, ${p.opacity})`;
        ctx.fill();
      });

      // Draw connections between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.12;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 212, 170, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animFrame = requestAnimationFrame(drawParticles);
    }

    resize();
    createParticles();
    drawParticles();

    window.addEventListener('resize', () => {
      resize();
      createParticles();
    });

    // Pause when not visible
    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!animFrame) drawParticles();
        } else {
          cancelAnimationFrame(animFrame);
          animFrame = null;
        }
      },
      { threshold: 0.05 }
    );
    heroObserver.observe(canvas.closest('.hero'));
  }

  // ========== SMOOTH SCROLL ==========
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const y = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

  // ========== FORM INTERACTION ==========
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', () => {
      // Allow native submission to FormSubmit
      const btn = form.querySelector('.btn-submit');
      if (btn) {
        btn.innerHTML = `
          <svg class="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
          Sending...
        `;
        btn.style.pointerEvents = 'none';
        btn.style.opacity = '0.7';
      }
    });
  }

  // ========== INITIAL REVEAL FOR ABOVE-FOLD CONTENT ==========
  // Trigger reveals for elements already in viewport on load
  setTimeout(() => {
    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add('revealed');
      }
    });
  }, 100);

  // ========== FLIP CARD TOUCH SUPPORT ==========
  const flipCards = document.querySelectorAll('.ag-flip-wrap');
  flipCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Only toggle on touch devices (no hover)
      if (window.matchMedia('(hover: none)').matches) {
        // Close other flipped cards
        flipCards.forEach(c => {
          if (c !== card) c.classList.remove('flipped');
        });
        card.classList.toggle('flipped');
      }
    });
  });

})();

