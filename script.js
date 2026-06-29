/**
 * POD Designer Portfolio - Core Interactive Engine
 * Pure Vanilla JavaScript | High-Performance Animations & UX
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Initialize Systems ---
  initPreloader();
  initCursorGlow();
  initThemeToggle();
  initNavbarScroll();
  initMobileNav();
  initScrollProgress();
  initRevealOnScroll();
  initStatsCounter();
  initPortfolioFilter();
  initContactForm();
  initScrollToTop();
  updateActiveMenu();
});

// --- 1. PRELOADER ANIMATION ---
function initPreloader() {
  const loader = document.getElementById('loader');
  if (loader) {
    // Add a small delay to let visual elements stabilize
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('loaded');
        // Trigger reveal animations for the hero section immediately
        document.querySelectorAll('#home .reveal').forEach(el => {
          el.classList.add('active');
        });
      }, 800);
    });

    // Fallback if load event takes too long
    setTimeout(() => {
      if (!loader.classList.contains('loaded')) {
        loader.classList.add('loaded');
      }
    }, 3000);
  }
}

// --- 2. ANIMATED CURSOR GLOW ---
function initCursorGlow() {
  const glow = document.getElementById('cursor-glow');
  if (!glow) return;

  // Track if mouse is over window
  document.addEventListener('mouseenter', () => {
    glow.style.opacity = '1';
  });

  document.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
  });

  document.addEventListener('mousemove', (e) => {
    // High-performance requestAnimationFrame is ideal for cursor glow,
    // but a direct translate3d within standard mousemove is incredibly crisp too.
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
    if (glow.style.opacity === '0' || glow.style.opacity === '') {
      glow.style.opacity = '1';
    }
  });
}

// --- 3. DARK / LIGHT MODE SYSTEM ---
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  const root = document.documentElement;
  
  if (!toggleBtn) return;

  // Check saved preference or default to dark
  const savedTheme = localStorage.getItem('theme') || 'dark';
  if (savedTheme === 'light') {
    root.classList.add('light-mode');
    updateThemeIcon('light');
  } else {
    root.classList.remove('light-mode');
    updateThemeIcon('dark');
  }

  toggleBtn.addEventListener('click', () => {
    const isLight = root.classList.toggle('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    updateThemeIcon(isLight ? 'light' : 'dark');
  });
}

function updateThemeIcon(theme) {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;
  
  if (theme === 'light') {
    // Show Moon icon (for switching back to dark)
    toggleBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
      </svg>
    `;
  } else {
    // Show Sun icon (for switching to light)
    toggleBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="4"/>
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
      </svg>
    `;
  }
}

// --- 4. STICKY NAVBAR BACKDROP ---
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// --- 5. MOBILE NAV DRAWER TOGGLE ---
function initMobileNav() {
  const toggle = document.getElementById('mobile-toggle');
  const menu = document.getElementById('nav-menu');
  
  if (!toggle || !menu) return;

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggle.classList.toggle('active');
    menu.classList.toggle('active');
  });

  // Close when clicking a nav item
  const navItems = menu.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      toggle.classList.remove('active');
      menu.classList.remove('active');
    });
  });

  // Close when clicking anywhere outside
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !toggle.contains(e.target)) {
      toggle.classList.remove('active');
      menu.classList.remove('active');
    }
  });
}

// --- 6. SCROLL PROGRESS INDICATOR ---
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (windowHeight <= 0) return;
    const progress = (window.scrollY / windowHeight) * 100;
    bar.style.width = `${progress}%`;
  });
}

// --- 7. REVEAL SECTIONS ON SCROLL ---
function initRevealOnScroll() {
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Once visible, stop observing this element
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px' // reveal slightly before it enters viewport
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });
}

// --- 8. STATS ANIMATED COUNTER ---
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  
  const countUp = (element) => {
    const target = parseFloat(element.getAttribute('data-target'));
    const isDecimal = element.getAttribute('data-decimal') === 'true';
    const suffix = element.getAttribute('data-suffix') || '';
    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing out quadratic
      const easeProgress = progress * (2 - progress);
      const currentVal = easeProgress * target;
      
      if (isDecimal) {
        element.innerText = currentVal.toFixed(1) + suffix;
      } else {
        element.innerText = Math.floor(currentVal).toLocaleString() + suffix;
      }
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        element.innerText = (isDecimal ? target.toFixed(1) : target.toLocaleString()) + suffix;
      }
    };
    
    requestAnimationFrame(animate);
  };

  const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.5
  });

  statNumbers.forEach(num => {
    statsObserver.observe(num);
  });
}

// --- 9. PORTFOLIO FILTER WITH TRANSITIONS ---
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  if (filterBtns.length === 0 || portfolioItems.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from other buttons, add to current
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');

        if (filterValue === 'all' || itemCategory === filterValue) {
          // Fade in matching items
          item.classList.remove('hidden');
          // Trigger slight reflow to allow scale transitions to run smoothly
          void item.offsetWidth;
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        } else {
          // Fade out mismatching items
          item.style.opacity = '0';
          item.style.transform = 'scale(0.85)';
          // Add a timeout to hide the element completely after animation completes
          setTimeout(() => {
            if (item.style.opacity === '0') {
              item.classList.add('hidden');
            }
          }, 350); // matches the standard smooth transition speed
        }
      });
    });
  });
}

// --- 11. CONTACT FORM VALIDATION & SUCCESS FEEDBACK ---
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = form.querySelector('input[type="text"]');
    const emailInput = form.querySelector('input[type="email"]');
    const messageInput = form.querySelector('textarea');

    if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
      alert('Please fill out all fields of the contact form.');
      return;
    }

    // Capture values
    const name = nameInput.value.trim();

    // Create a beautiful custom elegant overlay alert
    const dialog = document.createElement('div');
    dialog.style.position = 'fixed';
    dialog.style.top = '50%';
    dialog.style.left = '50%';
    dialog.style.transform = 'translate(-50%, -50%) scale(0.9)';
    dialog.style.background = 'var(--bg-secondary)';
    dialog.style.color = 'var(--text-primary)';
    dialog.style.border = '1px solid var(--accent)';
    dialog.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.5)';
    dialog.style.borderRadius = '16px';
    dialog.style.padding = '30px 40px';
    dialog.style.zIndex = '10000';
    dialog.style.textAlign = 'center';
    dialog.style.opacity = '0';
    dialog.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    dialog.style.maxWidth = '400px';
    dialog.style.width = '90%';

    dialog.innerHTML = `
      <div style="font-size: 2.5rem; color: var(--accent-gold); margin-bottom: 16px;">✓</div>
      <h3 style="font-family: var(--font-display); font-size: 1.5rem; margin-bottom: 12px; font-weight: 600;">Message Received!</h3>
      <p style="color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 24px; line-height: 1.5;">Thank you, <strong>${name}</strong>. Your original design inquiry has been sent. I will get in touch shortly.</p>
      <button class="btn btn-primary" id="dialog-close-btn" style="padding: 10px 24px; font-size: 0.85rem;">Continue</button>
    `;

    document.body.appendChild(dialog);

    // Fade in
    setTimeout(() => {
      dialog.style.opacity = '1';
      dialog.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 50);

    const closeBtn = dialog.querySelector('#dialog-close-btn');
    closeBtn.addEventListener('click', () => {
      dialog.style.opacity = '0';
      dialog.style.transform = 'translate(-50%, -50%) scale(0.9)';
      setTimeout(() => {
        dialog.remove();
      }, 400);
    });

    // Reset Form
    form.reset();
  });
}

// --- 12. SCROLL TO TOP BUTTON ---
function initScrollToTop() {
  const toTopBtn = document.getElementById('scroll-to-top');
  if (!toTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      toTopBtn.classList.add('visible');
    } else {
      toTopBtn.classList.remove('visible');
    }
  });

  toTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// --- 13. ACTIVE NAVIGATION LINK HIGHLIGHTING ---
function updateActiveMenu() {
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('.nav-item');

  if (sections.length === 0 || navItems.length === 0) return;

  const handleActiveMenu = () => {
    let currentId = '';
    const scrollPos = window.scrollY + 120; // adding threshold buffer for header height

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        currentId = id;
      }
    });

    if (currentId) {
      navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${currentId}`) {
          item.classList.add('active');
        }
      });
    }
  };

  window.addEventListener('scroll', handleActiveMenu);
  // Trigger once initially to capture current position
  handleActiveMenu();
}
