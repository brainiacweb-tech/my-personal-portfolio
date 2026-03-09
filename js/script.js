/* ============================================================
   Francis Kusi – Portfolio | script.js
   ============================================================ */

'use strict';

/* ============================================================
   1. NAVBAR – active link highlight & scroll shrink
   ============================================================ */
(function initNavbar() {
  const navbar    = document.getElementById('mainNavbar');
  const navLinks  = document.querySelectorAll('.nav-link');
  const sections  = document.querySelectorAll('section[id]');
  const toggler   = document.getElementById('navToggler');
  const navCollapse = document.getElementById('navbarNav');

  // Scroll: shrink navbar
  function onScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    highlightNav();
  }

  // Highlight active nav link based on scroll position
  function highlightNav() {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 100;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Close mobile menu on nav-link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const isOpen = navCollapse.classList.contains('show');
      if (isOpen) {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
        if (bsCollapse) bsCollapse.hide();
      }
    });
  });

  // Wire up hamburger button manually (Bootstrap already handles it via data attrs,
  // but we also manage the custom toggler)
  if (toggler) {
    toggler.addEventListener('click', () => {
      const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navCollapse);
      bsCollapse.toggle();
    });
  }
})();


/* ============================================================
   2. SMOOTH SCROLLING for anchor links
   ============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = 70;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ============================================================
   3. TYPING ANIMATION (Hero section)
   ============================================================ */
(function initTyping() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const words = [
    'Web Developer',
    'IT Support Specialist',
    'Tech Enthusiast',
    'Columnist',
    'Graphic Designer',
  ];

  let wordIndex  = 0;
  let charIndex  = 0;
  let isDeleting = false;
  const typingSpeed  = 100;
  const deletingSpeed = 55;
  const pauseEnd     = 1800;
  const pauseStart   = 400;

  function type() {
    const current = words[wordIndex];
    if (isDeleting) {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && charIndex === current.length) {
      delay = pauseEnd;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      delay = pauseStart;
    }

    setTimeout(type, delay);
  }

  setTimeout(type, 800);
})();


/* ============================================================
   4. SCROLL REVEAL ANIMATIONS
   ============================================================ */
(function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealEls.forEach(el => observer.observe(el));
})();


/* ============================================================
   5. ANIMATED SKILL BARS (trigger when scrolled into view)
   ============================================================ */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-progress .progress-bar');
  if (!bars.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const target = bar.getAttribute('data-width') || '0%';
          // Small delay for visual effect
          setTimeout(() => { bar.style.width = target; }, 200);
          observer.unobserve(bar);
        }
      });
    },
    { threshold: 0.4 }
  );

  bars.forEach(bar => observer.observe(bar));
})();


/* ============================================================
   6. PROJECT FILTERING
   ============================================================ */
(function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project-item');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.classList.remove('hide');
          // Re-trigger fade-in
          item.style.animation = 'none';
          item.offsetHeight; // reflow
          item.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          item.classList.add('hide');
        }
      });
    });
  });
})();


/* ============================================================
   7. CONTACT FORM VALIDATION
   ============================================================ */
(function initContactForm() {
  const form       = document.getElementById('contactForm');
  const successBox = document.getElementById('formSuccess');
  if (!form) return;

  const nameInput    = document.getElementById('contactName');
  const emailInput   = document.getElementById('contactEmail');
  const messageInput = document.getElementById('contactMessage');
  const nameError    = document.getElementById('nameError');
  const emailError   = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');
  const submitBtn    = document.getElementById('submitBtn');

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function setError(input, errorEl, msg) {
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
    if (errorEl) errorEl.textContent = msg;
  }

  function setValid(input, errorEl) {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
    if (errorEl) errorEl.textContent = '';
  }

  function clearValidation(input, errorEl) {
    input.classList.remove('is-invalid', 'is-valid');
    if (errorEl) errorEl.textContent = '';
  }

  // Real-time validation on blur
  nameInput.addEventListener('blur', () => {
    if (!nameInput.value.trim()) {
      setError(nameInput, nameError, 'Full name is required.');
    } else if (nameInput.value.trim().length < 2) {
      setError(nameInput, nameError, 'Name must be at least 2 characters.');
    } else {
      setValid(nameInput, nameError);
    }
  });

  emailInput.addEventListener('blur', () => {
    if (!emailInput.value.trim()) {
      setError(emailInput, emailError, 'Email address is required.');
    } else if (!isValidEmail(emailInput.value.trim())) {
      setError(emailInput, emailError, 'Please enter a valid email address.');
    } else {
      setValid(emailInput, emailError);
    }
  });

  messageInput.addEventListener('blur', () => {
    if (!messageInput.value.trim()) {
      setError(messageInput, messageError, 'Message cannot be empty.');
    } else if (messageInput.value.trim().length < 10) {
      setError(messageInput, messageError, 'Message must be at least 10 characters.');
    } else {
      setValid(messageInput, messageError);
    }
  });

  // Clear on input
  [nameInput, emailInput, messageInput].forEach(input => {
    input.addEventListener('input', () => {
      const errEl = document.getElementById(input.id.replace('contact', '').toLowerCase() + 'Error');
      clearValidation(input, errEl || null);
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let valid = true;

    // Name
    if (!nameInput.value.trim()) {
      setError(nameInput, nameError, 'Full name is required.');
      valid = false;
    } else if (nameInput.value.trim().length < 2) {
      setError(nameInput, nameError, 'Name must be at least 2 characters.');
      valid = false;
    } else {
      setValid(nameInput, nameError);
    }

    // Email
    if (!emailInput.value.trim()) {
      setError(emailInput, emailError, 'Email address is required.');
      valid = false;
    } else if (!isValidEmail(emailInput.value.trim())) {
      setError(emailInput, emailError, 'Please enter a valid email address.');
      valid = false;
    } else {
      setValid(emailInput, emailError);
    }

    // Message
    if (!messageInput.value.trim()) {
      setError(messageInput, messageError, 'Message cannot be empty.');
      valid = false;
    } else if (messageInput.value.trim().length < 10) {
      setError(messageInput, messageError, 'Message must be at least 10 characters.');
      valid = false;
    } else {
      setValid(messageInput, messageError);
    }

    if (!valid) return;

    // Simulate send
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending…';

    setTimeout(() => {
      form.reset();
      [nameInput, emailInput, messageInput].forEach(input => {
        input.classList.remove('is-valid', 'is-invalid');
      });
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Send Message';

      successBox.classList.remove('d-none');

      // Auto-hide success message after 5 seconds
      setTimeout(() => successBox.classList.add('d-none'), 5000);
    }, 1200);
  });
})();


/* ============================================================
   8. BACK TO TOP BUTTON
   ============================================================ */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ============================================================
   9. FOOTER YEAR
   ============================================================ */
(function setYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
