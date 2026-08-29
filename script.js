/* ============================================
   PORTFOLIO — Interactive JavaScript
   Scroll animations, filters, nav, counters, 
   form handling, and micro-interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollReveal();
  initProjectSearchAndFilters();
  initStatCounters();
  initSmoothScroll();
  initActiveNavHighlight();
  initCardTilt();
  initProjectModal();
  initThemeSwitcher();
  initTypewriter();
  initBackToTop();
  initContactCopy();
  initAINetworkCanvas();
  initISTClock();
  initCodeArchitectureTabs();
});

/* ============================================
   NAVBAR
   ============================================ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  // Scroll behavior — add/remove "scrolled" class
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });

  // Mobile hamburger toggle
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close mobile menu when clicking a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ============================================
   SCROLL REVEAL ANIMATIONS
   ============================================ */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ============================================
   PROJECT FILTER & SEARCH SYSTEM
   ============================================ */
function initProjectSearchAndFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const searchInput = document.getElementById('projectSearchInput');
  const clearBtn = document.getElementById('clearSearchBtn');
  const countBadge = document.getElementById('projectCountBadge');

  let activeCategory = 'all';
  let searchQuery = '';

  function filterProjects() {
    let visibleCount = 0;

    projectCards.forEach((card) => {
      const categories = card.dataset.category || '';
      const textContent = card.innerText.toLowerCase();

      const matchesCategory = activeCategory === 'all' || categories.includes(activeCategory);
      const matchesSearch = searchQuery === '' || textContent.includes(searchQuery);

      if (matchesCategory && matchesSearch) {
        card.style.display = '';
        card.style.animation = 'fadeInUp 0.4s ease forwards';
        visibleCount++;
      } else {
        card.style.display = 'none';
        card.style.animation = '';
      }
    });

    if (countBadge) {
      countBadge.textContent = `Showing ${visibleCount} of ${projectCards.length} Projects`;
    }
  }

  // Filter Buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.filter;
      filterProjects();
    });
  });

  // Search Input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      if (clearBtn) {
        clearBtn.style.display = searchQuery ? 'block' : 'none';
      }
      filterProjects();
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        clearBtn.style.display = 'none';
        filterProjects();
        searchInput.focus();
      });
    }
  }
}

/* ============================================
   ANIMATED STAT COUNTERS
   ============================================ */
function initStatCounters() {
  const statNumbers = document.querySelectorAll('.stat-number[data-count]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => observer.observe(el));
}

function animateCounter(element) {
  const target = parseInt(element.dataset.count);
  const duration = 2000;
  const startTime = performance.now();
  const suffix = element.textContent.replace(/[0-9]/g, '').trim();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(target * eased);

    element.textContent = current + (target === parseInt(element.dataset.count) ? '+' : '');

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target + '+';
    }
  }

  requestAnimationFrame(update);
}

/* ============================================
   SMOOTH SCROLLING
   ============================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const navbarHeight = 80;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ============================================
   ACTIVE NAV HIGHLIGHT ON SCROLL
   ============================================ */
function initActiveNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeId = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${activeId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-80px 0px -40% 0px'
  });

  sections.forEach(section => observer.observe(section));
}

/* ============================================
   3D CARD TILT EFFECT
   ============================================ */
function initCardTilt() {
  const cards = document.querySelectorAll('.project-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / centerY * -4;
      const rotateY = (x - centerX) / centerX * 4;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
      setTimeout(() => {
        card.style.transition = '';
      }, 500);
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'none';
    });
  });
}

/* ============================================
   CONTACT FORM HANDLER
   ============================================ */
function handleSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const submitBtn = form.querySelector('.btn-submit');
  const originalContent = submitBtn.innerHTML;

  // Animate button
  submitBtn.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spin"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>
    Sending...
  `;
  submitBtn.disabled = true;

  // Simulate send (replace with actual backend call)
  setTimeout(() => {
    submitBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      Message Sent!
    `;
    submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';

    setTimeout(() => {
      submitBtn.innerHTML = originalContent;
      submitBtn.style.background = '';
      submitBtn.disabled = false;
      form.reset();
    }, 3000);
  }, 1500);

  return false;
}

/* ============================================
   CSS ANIMATION KEYFRAMES (injected)
   ============================================ */
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

/* ============================================
   PROJECT DETAILS MODAL LOGIC
   ============================================ */
const projectDetails = {
  gesturetalk: {
    title: "GestureTalk",
    tagline: "Real-time ASL Sign Language to Speech Communication Engine",
    badge: "AI + Accessibility",
    icon: "🤟",
    desc: "GestureTalk is an accessibility-focused AI tool that bridges communication gaps for the speech and hearing-impaired community. It uses computer vision to track 21 hand landmark points in real time and classifies American Sign Language (ASL) gestures with ~90% accuracy, rendering instant text and audio output across 8 global languages.",
    arch: ["Webcam Feed", "MediaPipe Hands", "21 Landmark Detection", "Rule Classifier", "Web Speech API", "PWA / Electron"],
    features: [
      "Real-time A-Z alphabet and 0-9 number gesture recognition (~90% accuracy)",
      "Multilingual Text-to-Speech synthesis in 8 languages (English, Hindi, Spanish, French, German, Japanese, Chinese, Arabic)",
      "Interactive ASL Practice Mode with live accuracy score feedback",
      "PWA offline support & desktop app wrapper with native Windows installer (Electron + NSIS)",
      "4 visual themes (Dark Blue, Purple Night, Matrix Green, Neon Pink) with audio haptic feedback"
    ],
    tech: ["MediaPipe Hands", "Web Speech API", "Electron 29", "PWA (Service Workers)", "Vanilla JS", "Python PPTX"],
    github: "https://github.com/Tejaspatel1524",
    demo: null
  },
  jarvis: {
    title: "J.A.R.V.I.S",
    tagline: "Just A Rather Very Intelligent System — Desktop Voice AI",
    badge: "AI Assistant",
    icon: "🎙️",
    desc: "Inspired by Tony Stark's iconic AI, J.A.R.V.I.S is a full-featured desktop voice assistant with system tray controls, wake-word activation, and frameless HUD interface. It connects to OpenAI/Groq streaming LLMs and uses agentic tool-calling to execute system commands safely via a security whitelist.",
    arch: ["Wake Word Detector", "Speech-to-Text", "FastAPI Engine", "Groq / OpenAI LLM", "Tool Executor", "pywebview HUD"],
    features: [
      "Hands-free wake-word detection ('Hey Jarvis') popping open a frameless glassmorphism HUD",
      "Agentic tool calling: open applications, search the web, run whitelisted shell commands, and read system diagnostics",
      "Streaming voice & text responses with automatic exponential backoff retry mechanisms",
      "Token-safe conversation memory trimming to preserve context without hitting token limits",
      "System tray background service with global hotkey (Ctrl+Shift+J)"
    ],
    tech: ["Python 3.11", "FastAPI", "AsyncOpenAI / Groq API", "pywebview", "pystray", "psutil", "WebSockets"],
    github: "https://github.com/Tejaspatel1524",
    demo: null
  },
  sentinelai: {
    title: "SentinelAI / CrimeGPT",
    tagline: "Cyber Fraud Investigation Intelligence Platform",
    badge: "Enterprise Platform",
    icon: "🛡️",
    desc: "SentinelAI (CrimeGPT) is a specialized digital forensics and investigation platform engineered for Indian law enforcement agencies and cyber defense teams. It organizes complex financial fraud cases, parses digital evidence, maps suspect entity networks using flow diagrams, and generates official investigation reports.",
    arch: ["React 19 SPA", "Dashboard Analytics", "Case Directory", "ReactFlow Entity Graph", "Report Engine"],
    features: [
      "Comprehensive case management tracking total cases, priority levels, and open financial fraud investigations",
      "Interactive node-based entity mapping (@xyflow/react) to visually connect suspects, bank accounts, and phone numbers",
      "INR currency formatting and Indian law enforcement regulatory compliance formatting",
      "Detailed 76KB forensic report generator producing official case timelines and evidence manifests",
      "Dark-themed investigation workspace styled with Tailwind CSS 4 and Radix UI primitives"
    ],
    tech: ["React 19", "TypeScript 6", "Vite 8", "Tailwind CSS 4", "@xyflow/react", "Recharts", "Radix UI"],
    github: "https://github.com/Tejaspatel1524",
    demo: "https://crime-gpt-seven.vercel.app"
  },
  income: {
    title: "Income Smoothing Platform",
    tagline: "AI-Driven Financial Stability Platform for Gig Workers",
    badge: "FinTech SaaS",
    icon: "💰",
    desc: "A fintech SaaS platform designed for freelancers and gig workers with irregular income streams. The custom AI prediction engine calculates earnings variability, sets automated savings buffer targets, and schedules predictable monthly income payouts to guarantee financial peace of mind.",
    arch: ["React 18 Frontend", "Express 4 Backend", "AI Predictor Engine", "Smoothing Engine", "PostgreSQL DB", "JWT Auth"],
    features: [
      "Custom AI Income Predictor analyzing historical payment data to forecast future earnings",
      "Automated Financial Buffer Engine determining safe payout amounts to smooth out irregular income spikes and drops",
      "Behavioral Nudge Engine delivering personalized micro-financial tips and lessons",
      "Security-hardened backend featuring Helmet security headers, rate-limiting, and PostgreSQL transaction logging",
      "Calm, trust-first UI design system built with custom Tailwind CSS tokens and Inter typography"
    ],
    tech: ["React 18", "Node.js 18", "Express 4", "PostgreSQL", "Tailwind CSS 3", "JWT Auth", "Winston Logger"],
    github: "https://github.com/Tejaspatel1524",
    demo: null
  },
  nexusbiz: {
    title: "NexusBiz (AI Business Automation)",
    tagline: "AI Marketing Copy Generator & CSV Analytics Engine",
    badge: "AI Business",
    icon: "📈",
    desc: "An all-in-one AI platform that turns raw product details into high-converting, SEO-optimized marketing copy, while allowing business owners to upload CSV metrics to receive automated business insights and interactive charts.",
    arch: ["React 19 Frontend", "Express Backend", "OpenAI GPT Engine", "CSV Multer Parser", "Recharts Dashboard"],
    features: [
      "Instant SEO marketing description generator tailoring tone, length, and call-to-action",
      "CSV dataset upload engine converting raw sales spreadsheet rows into actionable strategic insights",
      "Interactive data visualization charts powered by Recharts",
      "One-click batch execution startup via custom Windows scripts"
    ],
    tech: ["React 19", "Vite 7", "Node.js", "Express 4", "OpenAI API", "Recharts", "Multer"],
    github: "https://github.com/Tejaspatel1524",
    demo: "https://nexus-biz.vercel.app"
  },
  aibusiness: {
    title: "NexusBiz (AI Business Automation)",
    tagline: "AI Marketing Copy Generator & CSV Analytics Engine",
    badge: "AI Business",
    icon: "📈",
    desc: "An all-in-one AI platform that turns raw product details into high-converting, SEO-optimized marketing copy, while allowing business owners to upload CSV metrics to receive automated business insights and interactive charts.",
    arch: ["React 19 Frontend", "Express Backend", "OpenAI GPT Engine", "CSV Multer Parser", "Recharts Dashboard"],
    features: [
      "Instant SEO marketing description generator tailoring tone, length, and call-to-action",
      "CSV dataset upload engine converting raw sales spreadsheet rows into actionable strategic insights",
      "Interactive data visualization charts powered by Recharts",
      "One-click batch execution startup via custom Windows scripts"
    ],
    tech: ["React 19", "Vite 7", "Node.js", "Express 4", "OpenAI API", "Recharts", "Multer"],
    github: "https://github.com/Tejaspatel1524",
    demo: "https://nexus-biz.vercel.app"
  },
  custbook: {
    title: "CustBook (ShopBase)",
    tagline: "Smart Mobile Customer Manager for Retail Shopkeepers",
    badge: "PWA",
    icon: "📒",
    desc: "CustBook is a lightweight Progressive Web App tailored for small retail shopkeepers to replace traditional paper khata books. It allows business owners to record customer transactions, manage pending payments, and generate digital receipts instantly.",
    arch: ["Vanilla HTML5 / CSS3", "Vanilla JS App Core", "Browser localStorage", "Service Worker PWA", "Web Share API"],
    features: [
      "Complete offline capability powered by browser localStorage — zero internet connection required",
      "One-tap WhatsApp digital receipt sharing with shop branding and GST details",
      "Customer directory search, payment status tracking (Paid, Pending, Partial), and debt collection reminders",
      "PIN-protected store access and installable app manifest for iOS and Android"
    ],
    tech: ["HTML5", "CSS3 Custom Properties", "Vanilla JavaScript", "PWA Service Worker", "Web Share API"],
    github: "https://github.com/Tejaspatel1524",
    demo: "https://custbook.online"
  }
};

function initProjectModal() {
  const backdrop = document.getElementById('projectModalBackdrop');
  const closeBtn = document.getElementById('modalCloseBtn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!backdrop) return;

  projectCards.forEach(card => {
    card.style.cursor = 'pointer';

    card.addEventListener('click', (e) => {
      // Prevent double trigger if clicking direct outbound links inside card
      if (e.target.closest('a[target="_blank"]')) return;

      const pId = card.dataset.project;
      const data = projectDetails[pId];
      if (!data) return;

      document.getElementById('modalIcon').textContent = data.icon;
      document.getElementById('modalBadge').textContent = data.badge;
      document.getElementById('modalTitle').textContent = data.title;
      document.getElementById('modalTagline').textContent = data.tagline;
      document.getElementById('modalDesc').textContent = data.desc;

      // Architecture
      const archContainer = document.getElementById('modalArch');
      archContainer.innerHTML = '';
      data.arch.forEach((step, idx) => {
        const stepEl = document.createElement('span');
        stepEl.className = 'arch-step';
        stepEl.textContent = step;
        archContainer.appendChild(stepEl);

        if (idx < data.arch.length - 1) {
          const arrow = document.createElement('span');
          arrow.className = 'arch-arrow';
          arrow.textContent = '→';
          archContainer.appendChild(arrow);
        }
      });

      // Features
      const featContainer = document.getElementById('modalFeatures');
      featContainer.innerHTML = '';
      data.features.forEach(feat => {
        const li = document.createElement('li');
        li.className = 'modal-feature-item';
        li.textContent = feat;
        featContainer.appendChild(li);
      });

      // Tech Stack
      const techContainer = document.getElementById('modalTech');
      techContainer.innerHTML = '';
      data.tech.forEach(t => {
        const tag = document.createElement('span');
        tag.className = 'project-tech-tag';
        tag.textContent = t;
        techContainer.appendChild(tag);
      });

      // Links
      const sourceBtn = document.getElementById('modalSourceBtn');
      const demoBtn = document.getElementById('modalDemoBtn');

      if (sourceBtn) sourceBtn.href = data.github || 'https://github.com/Tejaspatel1524';
      if (demoBtn) {
        if (data.demo) {
          demoBtn.style.display = 'inline-flex';
          demoBtn.href = data.demo;
        } else {
          demoBtn.style.display = 'none';
        }
      }

      // Show modal
      backdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close modal logic
  const closeModal = () => {
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ============================================
   THEME SWITCHER
   ============================================ */
function initThemeSwitcher() {
  const themeBtn = document.getElementById('themeToggleBtn');
  if (!themeBtn) return;

  const themes = ['default', 'cyber', 'emerald', 'light'];
  const icons = ['🌙', '⚡', '🌿', '☀️'];
  let currentIdx = 0;

  themeBtn.addEventListener('click', () => {
    currentIdx = (currentIdx + 1) % themes.length;
    const chosenTheme = themes[currentIdx];

    if (chosenTheme === 'default') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', chosenTheme);
    }

    const iconSpan = themeBtn.querySelector('.theme-icon');
    if (iconSpan) iconSpan.textContent = icons[currentIdx];

    showToast(`Switched theme to ${chosenTheme.toUpperCase()} mode`, icons[currentIdx]);
  });
}

/* ============================================
   TYPEWRITER SUBTITLE EFFECT
   ============================================ */
function initTypewriter() {
  const target = document.getElementById('typedSubtitle');
  if (!target) return;

  const phrases = [
    "AI & Full-Stack Developer",
    "Multi-Agent AI Engineer",
    "Accessibility Tech Advocate",
    "Cyber Intelligence Developer"
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function typeStep() {
    const currentPhrase = phrases[phraseIdx];

    if (isDeleting) {
      target.textContent = currentPhrase.substring(0, charIdx - 1);
      charIdx--;
    } else {
      target.textContent = currentPhrase.substring(0, charIdx + 1);
      charIdx++;
    }

    let delay = isDeleting ? 40 : 80;

    if (!isDeleting && charIdx === currentPhrase.length) {
      delay = 2200;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      delay = 400;
    }

    setTimeout(typeStep, delay);
  }

  typeStep();
}

/* ============================================
   BACK TO TOP FLOATING BUTTON
   ============================================ */
function initBackToTop() {
  const backBtn = document.getElementById('backToTop');
  if (!backBtn) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 400) {
      backBtn.classList.add('visible');
    } else {
      backBtn.classList.remove('visible');
    }
  }, { passive: true });

  backBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================
   CONTACT COPY EMAIL FEEDBACK
   ============================================ */
function initContactCopy() {
  const emailLink = document.getElementById('contactEmail');
  if (!emailLink) return;

  emailLink.addEventListener('click', (e) => {
    e.preventDefault();
    const email = 'tejas.241006@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
      showToast('Email address copied to clipboard!', '📋');
    }).catch(() => {
      window.location.href = `mailto:${email}`;
    });
  });
}

/* ============================================
   TOAST NOTIFICATION SYSTEM
   ============================================ */
function showToast(message, icon = '✨') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-out');
    toast.addEventListener('animationend', () => {
      toast.remove();
    });
  }, 3200);
}

/* ============================================
   PDF RESUME DOWNLOAD HANDLER
   ============================================ */
function downloadPDFResume(event) {
  if (event) event.preventDefault();
  
  showToast('Opening & Downloading Tejas J Patel PDF Resume...', '📄');
  
  // Trigger file download or view PDF
  const link = document.createElement('a');
  link.href = 'file:///C:/Users/HP/Downloads/Tejas_J_Patel_Portfolio.pdf';
  link.target = '_blank';
  link.download = 'Tejas_J_Patel_Portfolio.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/* ============================================
   CONTACT FORM SUBMIT HANDLER
   ============================================ */
function handleSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('name')?.value || 'Friend';
  
  showToast(`Thank you, ${name}! Your message has been sent successfully.`, '🚀');
  
  const form = document.getElementById('contactForm');
  if (form) form.reset();
  return false;
}

/* ============================================
   AI NETWORK CANVAS VISUALIZER
   ============================================ */
function initAINetworkCanvas() {
  const canvas = document.getElementById('aiNetworkCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Fix resolution for high DPI displays
  const dpr = window.devicePixelRatio || 1;
  const width = canvas.width;
  const height = canvas.height;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  const nodes = [
    { id: 'user', label: 'User Query', x: 50, y: 120, color: '#38ef7d' },
    { id: 'router', label: 'Agent Coordinator', x: 170, y: 120, color: '#6366f1' },
    { id: 'rag', label: 'RAG Memory', x: 290, y: 55, color: '#06b6d4' },
    { id: 'llm', label: 'Gemini / OpenAI', x: 290, y: 185, color: '#8b5cf6' },
    { id: 'synthesis', label: 'Synthesis Engine', x: 400, y: 120, color: '#10b981' }
  ];

  const connections = [
    { from: 0, to: 1 },
    { from: 1, to: 2 },
    { from: 1, to: 3 },
    { from: 2, to: 4 },
    { from: 3, to: 4 }
  ];

  // Moving pulses
  const pulses = [
    { edge: 0, progress: 0, speed: 0.015 },
    { edge: 1, progress: 0.3, speed: 0.012 },
    { edge: 2, progress: 0.7, speed: 0.014 },
    { edge: 3, progress: 0.1, speed: 0.016 },
    { edge: 4, progress: 0.5, speed: 0.013 }
  ];

  let hoveredNode = null;

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) * (width / rect.width);
    const mouseY = (e.clientY - rect.top) * (height / rect.height);

    hoveredNode = nodes.find(n => Math.hypot(n.x - mouseX, n.y - mouseY) < 22);
    canvas.style.cursor = hoveredNode ? 'pointer' : 'default';
  });

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Draw background grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw connection lines
    connections.forEach(c => {
      const start = nodes[c.from];
      const end = nodes[c.to];
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.25)';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Draw moving pulses along connections
    pulses.forEach(p => {
      p.progress += p.speed;
      if (p.progress > 1) p.progress = 0;

      const conn = connections[p.edge];
      const start = nodes[conn.from];
      const end = nodes[conn.to];

      const px = start.x + (end.x - start.x) * p.progress;
      const py = start.y + (end.y - start.y) * p.progress;

      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#00f2fe';
      ctx.shadowColor = '#00f2fe';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Draw nodes
    nodes.forEach(n => {
      const isHovered = hoveredNode === n;

      // Outer glow ring
      ctx.beginPath();
      ctx.arc(n.x, n.y, isHovered ? 16 : 12, 0, Math.PI * 2);
      ctx.fillStyle = n.color + '22';
      ctx.fill();
      ctx.strokeStyle = n.color;
      ctx.lineWidth = isHovered ? 2.5 : 1.5;
      ctx.stroke();

      // Inner dot
      ctx.beginPath();
      ctx.arc(n.x, n.y, isHovered ? 6 : 4, 0, Math.PI * 2);
      ctx.fillStyle = n.color;
      ctx.fill();

      // Label text
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = isHovered ? '#ffffff' : '#94a3b8';
      ctx.textAlign = 'center';
      ctx.fillText(n.label, n.x, n.y + 26);
    });

    requestAnimationFrame(draw);
  }

  draw();
}

/* ============================================
   LIVE IST CLOCK (Bento Matrix)
   ============================================ */
function initISTClock() {
  const clockEl = document.getElementById('istClock');
  if (!clockEl) return;

  function updateTime() {
    // Current time in Asia/Kolkata timezone
    const now = new Date();
    const options = {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    const timeStr = new Intl.DateTimeFormat('en-US', options).format(now);
    clockEl.textContent = `IST ${timeStr}`;
  }

  updateTime();
  setInterval(updateTime, 1000);
}

/* ============================================
   INTERACTIVE CODE ARCHITECTURE TABS (Bento Matrix)
   ============================================ */
function initCodeArchitectureTabs() {
  const tabs = document.querySelectorAll('.code-tab');
  const codeContent = document.getElementById('codeSnippetContent');
  const langBadge = document.getElementById('codeLangBadge');
  const flowContainer = document.querySelector('.code-pipeline-flow');

  if (!tabs.length || !codeContent) return;

  const snippets = {
    mediapipe: {
      lang: 'Python',
      code: `<span class="c-keyword">import</span> mediapipe <span class="c-keyword">as</span> mp
<span class="c-keyword">from</span> engine.speech <span class="c-keyword">import</span> SpeechSynthesizer

<span class="c-keyword">class</span> <span class="c-class">ASLEngine</span>:
    <span class="c-keyword">def</span> <span class="c-func">predict_gesture</span>(self, landmarks):
        gesture = self.classifier.<span class="c-func">infer</span>(landmarks)
        <span class="c-keyword">if</span> gesture.confidence > <span class="c-num">0.88</span>:
            SpeechSynthesizer.<span class="c-func">speak</span>(gesture.label)
        <span class="c-keyword">return</span> gesture`,
      flow: [
        '📷 Video Input', '→', '✋ Landmarks (21 pts)', '→', '🤖 ~90% ASL Predict', '→', '🗣️ TTS Voice'
      ]
    },
    jarvis: {
      lang: 'FastAPI / Python',
      code: `<span class="c-keyword">from</span> fastapi <span class="c-keyword">import</span> FastAPI, WebSocket
<span class="c-keyword">from</span> core.agent <span class="c-keyword">import</span> JarvisAIEngine

app = FastAPI(title=<span class="c-str">"JARVIS Desktop Core"</span>)

@app.websocket(<span class="c-str">"/ws/voice"</span>)
<span class="c-keyword">async def</span> <span class="c-func">voice_stream</span>(ws: WebSocket):
    <span class="c-keyword">await</span> ws.accept()
    <span class="c-keyword">async for</span> chunk <span class="c-keyword">in</span> ws.iter_bytes():
        intent = <span class="c-keyword">await</span> JarvisAIEngine.<span class="c-func">process_audio</span>(chunk)
        <span class="c-keyword">await</span> ws.<span class="c-func">send_json</span>({<span class="c-str">"action"</span>: intent.tool, <span class="c-str">"status"</span>: <span class="c-str">"executing"</span>})`,
      flow: [
        '🎙️ Audio Stream', '→', '⚡ WebSocket Gateway', '→', '🧠 LLM Tool Planner', '→', '💻 Desktop HUD'
      ]
    },
    sentinel: {
      lang: 'TypeScript / React',
      code: `<span class="c-keyword">export const</span> <span class="c-func">useThreatGraph</span> = (caseId: <span class="c-class">string</span>) => {
  <span class="c-keyword">const</span> { data: graph } = useSWR(<span class="c-str">\`/api/v1/cases/\${caseId}/graph\`</span>, fetcher);
  
  <span class="c-keyword">const</span> flaggedNodes = useMemo(() => {
    <span class="c-keyword">return</span> graph?.nodes.filter(n => n.fraudScore > <span class="c-num">0.75</span>) ?? [];
  }, [graph]);

  <span class="c-keyword">return</span> { flaggedNodes, totalMuleAccounts: flaggedNodes.length };
};`,
      flow: [
        '🔍 Transaction Stream', '→', '🕸️ Graph Correlation', '→', '🚨 Threat Alert', '→', '📋 Law Enforcement Dossier'
      ]
    }
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const tabKey = tab.dataset.tab;
      const data = snippets[tabKey];
      if (!data) return;

      codeContent.innerHTML = data.code;
      langBadge.textContent = data.lang;

      if (flowContainer && data.flow) {
        flowContainer.innerHTML = data.flow.map(item => {
          if (item === '→') {
            return `<span class="flow-arrow">→</span>`;
          }
          return `<span class="flow-node">${item}</span>`;
        }).join('');
      }
    });
  });
}


