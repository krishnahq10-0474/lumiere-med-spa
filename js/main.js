/**
 * LUMIÈRE AESTHETICS & MED SPA — MASTER SCRIPT
 * Production-quality Vanilla JavaScript
 * No frameworks or external dependencies required.
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initScrollAnimations();
  initBeforeAfterSliders();
  initTestimonialCarousel();
  initFaqAccordions();
  initCategoryFilters();
  initConsultationForm();
  initNewsletterForm();
});

/* --------------------------------------------------------------------------
   1. STICKY HEADER SCROLL STATE
   -------------------------------------------------------------------------- */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --------------------------------------------------------------------------
   2. MOBILE FULLSCREEN MENU
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger-btn');
  const overlay = document.querySelector('.mobile-nav-overlay');
  if (!hamburger || !overlay) return;

  const toggleMenu = (open) => {
    const isOpen = open !== undefined ? open : !hamburger.classList.contains('active');
    hamburger.classList.toggle('active', isOpen);
    overlay.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen.toString());
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  hamburger.addEventListener('click', () => toggleMenu());

  // Close when clicking nav links
  overlay.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Close with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
      toggleMenu(false);
    }
  });
}

/* --------------------------------------------------------------------------
   3. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-up-element');
  if (!elements.length) return;

  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.1
  });

  elements.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   4. BEFORE & AFTER DRAGGABLE SLIDERS (Mouse, Touch, Keyboard)
   -------------------------------------------------------------------------- */
function initBeforeAfterSliders() {
  const sliders = document.querySelectorAll('.before-after-slider');

  sliders.forEach(slider => {
    const beforeWrap = slider.querySelector('.slider-before-wrap');
    const handle = slider.querySelector('.slider-handle');
    const rangeInput = slider.querySelector('.slider-accessible-range');
    let isDragging = false;

    const setPosition = (percentage) => {
      const clamped = Math.max(0, Math.min(100, percentage));
      if (beforeWrap) beforeWrap.style.width = `${clamped}%`;
      if (handle) handle.style.left = `${clamped}%`;
      if (rangeInput) rangeInput.value = clamped;
    };

    const handleMove = (clientX) => {
      const rect = slider.getBoundingClientRect();
      const x = clientX - rect.left;
      const pct = (x / rect.width) * 100;
      setPosition(pct);
    };

    // Mouse Dragging
    slider.addEventListener('mousedown', (e) => {
      isDragging = true;
      handleMove(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch Dragging
    slider.addEventListener('touchstart', (e) => {
      isDragging = true;
      if (e.touches[0]) handleMove(e.touches[0].clientX);
    }, { passive: true });

    slider.addEventListener('touchmove', (e) => {
      if (!isDragging || !e.touches[0]) return;
      handleMove(e.touches[0].clientX);
    }, { passive: true });

    slider.addEventListener('touchend', () => {
      isDragging = false;
    });

    // Keyboard range accessibility input
    if (rangeInput) {
      rangeInput.addEventListener('input', (e) => {
        setPosition(parseFloat(e.target.value));
      });
    }

    // Default start at 50%
    setPosition(50);
  });
}

/* --------------------------------------------------------------------------
   5. TESTIMONIALS CAROUSEL
   -------------------------------------------------------------------------- */
function initTestimonialCarousel() {
  const carousel = document.querySelector('.testimonial-carousel');
  if (!carousel) return;

  const slides = carousel.querySelectorAll('.testimonial-slide');
  const dots = carousel.querySelectorAll('.carousel-dot');
  const prevBtn = carousel.querySelector('.carousel-prev-btn');
  const nextBtn = carousel.querySelector('.carousel-next-btn');

  if (!slides.length) return;

  let currentIndex = 0;
  let timer = null;
  const autoInterval = 6500;

  const showSlide = (index) => {
    slides.forEach((slide, i) => {
      const isActive = i === index;
      slide.classList.toggle('active', isActive);
      slide.setAttribute('aria-hidden', (!isActive).toString());
    });

    dots.forEach((dot, i) => {
      const isActive = i === index;
      dot.classList.toggle('active', isActive);
      dot.setAttribute('aria-selected', isActive.toString());
    });

    currentIndex = index;
  };

  const nextSlide = () => {
    const next = (currentIndex + 1) % slides.length;
    showSlide(next);
  };

  const prevSlide = () => {
    const prev = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(prev);
  };

  const startTimer = () => {
    stopTimer();
    timer = setInterval(nextSlide, autoInterval);
  };

  const stopTimer = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      startTimer();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      startTimer();
    });
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      showSlide(i);
      startTimer();
    });
  });

  carousel.addEventListener('mouseenter', stopTimer);
  carousel.addEventListener('mouseleave', startTimer);
  carousel.addEventListener('focusin', stopTimer);
  carousel.addEventListener('focusout', startTimer);

  showSlide(0);
  startTimer();
}

/* --------------------------------------------------------------------------
   6. FAQ ACCORDIONS
   -------------------------------------------------------------------------- */
function initFaqAccordions() {
  const items = document.querySelectorAll('.accordion-item');
  if (!items.length) return;

  items.forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    const content = item.querySelector('.accordion-content');
    if (!trigger || !content) return;

    trigger.addEventListener('click', () => {
      const isCurrentlyOpen = item.classList.contains('active');

      // Close all items in the same group for a clean experience
      items.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherTrigger = otherItem.querySelector('.accordion-trigger');
          const otherContent = otherItem.querySelector('.accordion-content');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
          if (otherContent) otherContent.style.maxHeight = null;
        }
      });

      // Toggle clicked item
      if (isCurrentlyOpen) {
        item.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = null;
      } else {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
}

/* --------------------------------------------------------------------------
   7. RESULTS PAGE CATEGORY FILTER
   -------------------------------------------------------------------------- */
function initCategoryFilters() {
  const filterPills = document.querySelectorAll('.results-filter-btn');
  const cards = document.querySelectorAll('.results-card-item');

  if (!filterPills.length || !cards.length) return;

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const selectedCategory = pill.getAttribute('data-filter');

      cards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (selectedCategory === 'all' || cardCategory === selectedCategory) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   8. CONSULTATION FORM VALIDATION
   -------------------------------------------------------------------------- */
function initConsultationForm() {
  const form = document.querySelector('#consultationForm');
  const successCard = document.querySelector('#formSuccessCard');
  if (!form) return;

  const validateInput = (input, validator, errorMsgEl, errorText) => {
    const isValid = validator(input.value.trim());
    if (!isValid) {
      input.classList.add('is-invalid');
      if (errorMsgEl) {
        errorMsgEl.textContent = errorText;
        errorMsgEl.classList.add('visible');
      }
      return false;
    } else {
      input.classList.remove('is-invalid');
      if (errorMsgEl) errorMsgEl.classList.remove('visible');
      return true;
    }
  };

  const nameInput = form.querySelector('#fullName');
  const phoneInput = form.querySelector('#phoneNumber');
  const emailInput = form.querySelector('#emailAddress');
  const treatmentSelect = form.querySelector('#treatmentInterest');
  const consentBox = form.querySelector('#consentCheckbox');

  // Regex validators
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone) => phone.replace(/\D/g, '').length >= 10;
  const isNotEmpty = (val) => val.length >= 2;

  // Real-time blur feedback
  if (nameInput) {
    nameInput.addEventListener('blur', () => {
      validateInput(nameInput, isNotEmpty, form.querySelector('#nameError'), 'Please enter your full name (at least 2 characters).');
    });
  }

  if (emailInput) {
    emailInput.addEventListener('blur', () => {
      validateInput(emailInput, isValidEmail, form.querySelector('#emailError'), 'Please enter a valid email address.');
    });
  }

  if (phoneInput) {
    phoneInput.addEventListener('blur', () => {
      validateInput(phoneInput, isValidPhone, form.querySelector('#phoneError'), 'Please enter a valid 10-digit phone number.');
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let valid = true;

    if (nameInput) {
      const v = validateInput(nameInput, isNotEmpty, form.querySelector('#nameError'), 'Please enter your full name.');
      if (!v) valid = false;
    }

    if (emailInput) {
      const v = validateInput(emailInput, isValidEmail, form.querySelector('#emailError'), 'Please enter a valid email address.');
      if (!v) valid = false;
    }

    if (phoneInput) {
      const v = validateInput(phoneInput, isValidPhone, form.querySelector('#phoneError'), 'Please enter a valid phone number with area code.');
      if (!v) valid = false;
    }

    if (treatmentSelect) {
      const v = validateInput(treatmentSelect, (val) => val !== '', form.querySelector('#treatmentError'), 'Please select a treatment of interest.');
      if (!v) valid = false;
    }

    if (consentBox) {
      const consentError = form.querySelector('#consentError');
      if (!consentBox.checked) {
        if (consentError) consentError.classList.add('visible');
        valid = false;
      } else {
        if (consentError) consentError.classList.remove('visible');
      }
    }

    if (valid) {
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting Request...';
      }

      setTimeout(() => {
        form.style.display = 'none';
        if (successCard) {
          successCard.classList.add('visible');
          successCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 700);
    }
  });
}

/* --------------------------------------------------------------------------
   9. FOOTER NEWSLETTER
   -------------------------------------------------------------------------- */
function initNewsletterForm() {
  const form = document.querySelector('#footerNewsletterForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('.footer-newsletter-input');
    const btn = form.querySelector('button');
    if (input && input.value.includes('@')) {
      input.value = 'Thank you for subscribing.';
      input.disabled = true;
      if (btn) btn.disabled = true;
    }
  });
}
