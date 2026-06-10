(function () {
  'use strict';

  const header    = document.getElementById('site-header');
  const hamburger = document.getElementById('hamburger');
  const mainNav   = document.getElementById('main-nav');

  function handleScroll() {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  hamburger.addEventListener('click', function () {
    const isOpen = mainNav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mainNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      mainNav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('click', function (e) {
    if (!header.contains(e.target) && mainNav.classList.contains('open')) {
      mainNav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerHeight = header.offsetHeight;
        const targetY = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 12;
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
    });
  });

  function initReveal() {
    const revealEls = document.querySelectorAll(
      '.service-card, .review-card, .why-item, .info-block, .trust-item'
    );

    revealEls.forEach(function (el, i) {
      el.classList.add('reveal');
      el.style.transitionDelay = (i % 4) * 60 + 'ms';
    });

    const aboutImg = document.querySelector('.about-image-col');
    const aboutTxt = document.querySelector('.about-text-col');
    const whyImg   = document.querySelector('.why-image-col');
    const whyTxt   = document.querySelector('.why-text-col');
    const ctaImg   = document.querySelector('.cta-image-col');
    const ctaTxt   = document.querySelector('.cta-text-col');

    if (aboutImg) aboutImg.classList.add('reveal-left');
    if (aboutTxt) aboutTxt.classList.add('reveal-right');
    if (whyImg)   whyImg.classList.add('reveal-left');
    if (whyTxt)   whyTxt.classList.add('reveal-right');
    if (ctaImg)   ctaImg.classList.add('reveal-right');
    if (ctaTxt)   ctaTxt.classList.add('reveal-left');

    document.querySelectorAll('.section-header, .section-label, .section-title').forEach(function (el) {
      if (!el.closest('.hero-content')) {
        el.classList.add('reveal');
      }
    });

    const allReveal = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );

      allReveal.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      allReveal.forEach(function (el) {
        el.classList.add('visible');
      });
    }
  }

  function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = mainNav.querySelectorAll('a[href^="#"]');

    function updateActive() {
      let current = '';
      const scrollY = window.pageYOffset;

      sections.forEach(function (section) {
        const top = section.offsetTop - 100;
        if (scrollY >= top) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(function (link) {
        link.classList.remove('active-nav');
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('active-nav');
        }
      });
    }

    window.addEventListener('scroll', updateActive, { passive: true });
  }

  function animateCounters() {
    const counters = document.querySelectorAll('.trust-num');

    const targets = {
      '10+':  { end: 10,  suffix: '+' },
      '45+':  { end: 45,  suffix: '+' },
      '95%':  { end: 95,  suffix: '%' },
      '6':    { end: 6,   suffix: '' },
    };

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const el    = entry.target;
            const text  = el.textContent.trim();
            const data  = targets[text];

            if (!data) return;

            el.textContent = '0' + data.suffix;
            let current = 0;
            const step  = Math.ceil(data.end / 40);
            const timer = setInterval(function () {
              current = Math.min(current + step, data.end);
              el.textContent = current + data.suffix;
              if (current >= data.end) clearInterval(timer);
            }, 30);

            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(function (counter) {
      observer.observe(counter);
    });
  }

  function initMobileCallBar() {
    const callBar = document.querySelector('.mobile-call-bar');
    if (!callBar) return;

    window.addEventListener('scroll', function () {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 300) {
        callBar.style.transform = 'translateY(0)';
      }
    }, { passive: true });
  }

  function initLazyImages() {
    const images = document.querySelectorAll('img[loading="lazy"]');

    if ('loading' in HTMLImageElement.prototype) {
      return;
    }

    if ('IntersectionObserver' in window) {
      const imgObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            imgObserver.unobserve(img);
          }
        });
      });

      images.forEach(function (img) {
        imgObserver.observe(img);
      });
    }
  }

  function initPhoneTracking() {
    document.querySelectorAll('a[href^="tel:"]').forEach(function (link) {
      link.addEventListener('click', function () {
        console.log('[Sara Dental] Phone tap:', this.href);
      });
    });

    document.querySelectorAll('a[href^="https://wa.me"]').forEach(function (link) {
      link.addEventListener('click', function () {
        console.log('[Sara Dental] WhatsApp tap');
      });
    });
  }

  function init() {
    initReveal();
    initActiveNav();
    initMobileCallBar();
    initLazyImages();
    initPhoneTracking();

    if ('IntersectionObserver' in window) {
      animateCounters();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();