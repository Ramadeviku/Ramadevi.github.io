/**
 * Rama Devi - Senior .NET Full Stack Developer Portfolio
 * Interactive Modern UI Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initTypingEffect();
  initThemeSwitcher();
  initSoundEffects();
  initNavScroll();
  initArchTabs();
  initSkillsFilter();
  initModals();
  initTerminal();
  initContactForm();
  initClipboard();
});

/* ==========================================================================
   1. INTERACTIVE PARTICLE CANVAS
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const mouse = { x: null, y: null, radius: 150 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1;
      this.baseX = this.x;
      this.baseY = this.y;
      this.density = (Math.random() * 30) + 1;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
    }

    draw() {
      ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--accent') || '#00f2fe';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;

      // Mouse interaction
      if (mouse.x !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const maxDistance = mouse.radius;
          const force = (maxDistance - distance) / maxDistance;
          const directionX = forceDirectionX * force * this.density;
          const directionY = forceDirectionY * force * this.density;
          this.x -= directionX;
          this.y -= directionY;
        }
      }
    }
  }

  const particleCount = Math.min(Math.floor(window.innerWidth / 15), 75);
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function connect() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 130) {
          const opacity = (1 - distance / 130) * 0.22;
          ctx.strokeStyle = `rgba(0, 242, 254, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].draw();
      particles[i].update();
    }
    connect();
    requestAnimationFrame(animate);
  }
  animate();
}

/* ==========================================================================
   2. DYNAMIC ROTATING TYPING EFFECT
   ========================================================================== */
function initTypingEffect() {
  const typingEl = document.getElementById('typing-text');
  if (!typingEl) return;

  const roles = [
    'Senior .NET Full Stack Developer',
    'Enterprise Cloud Architect (Azure & AWS)',
    '.NET 10 & Microservices Specialist',
    'FHIR Healthcare & AI Copilot Integrator',
    'Modern React & Blazor UI Engineer'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function type() {
    const currentRole = roles[roleIndex];
    if (isDeleting) {
      typingEl.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 45;
    } else {
      typingEl.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      typingSpeed = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 400; // Pause before typing next
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   3. THEME ACCENT SWITCHER
   ========================================================================== */
function initThemeSwitcher() {
  const themeDots = document.querySelectorAll('.theme-dot');
  const savedTheme = localStorage.getItem('rama-portfolio-theme') || 'cyan';
  setTheme(savedTheme);

  themeDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const theme = dot.getAttribute('data-theme');
      setTheme(theme);
      playUiSound('click');
    });
  });

  function setTheme(theme) {
    if (theme === 'cyan') {
      document.body.removeAttribute('data-theme');
    } else {
      document.body.setAttribute('data-theme', theme);
    }
    localStorage.setItem('rama-portfolio-theme', theme);
  }
}

/* ==========================================================================
   4. WEB AUDIO SYNTHESIZED SOUND EFFECTS (Subtle Sci-Fi Feedback)
   ========================================================================== */
let audioCtx = null;
let soundEnabled = true;

function initSoundEffects() {
  const soundToggleBtn = document.getElementById('sound-toggle-btn');

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      soundToggleBtn.innerHTML = soundEnabled 
        ? `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/></svg>`
        : `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`;
      showToast(soundEnabled ? 'Audio Feedback Enabled' : 'Audio Feedback Muted');
    });
  }
}

function playUiSound(type = 'click') {
  if (!soundEnabled) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;
    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(580, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'success') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    }
  } catch (e) {
    // Audio context silently ignored if blocked by autoplay policy
  }
}

/* ==========================================================================
   5. NAVIGATION & SCROLL SPY
   ========================================================================== */
function initNavScroll() {
  const nav = document.querySelector('.nav-container');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.7)';
      nav.style.borderColor = 'rgba(255, 255, 255, 0.18)';
    } else {
      nav.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
      nav.style.borderColor = 'var(--border-highlight)';
    }

    // Scroll spy
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 140;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      playUiSound('click');
    });

    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        playUiSound('click');
      });
    });
  }
}

/* ==========================================================================
   6. ARCHITECTURE SHOWCASE TABS
   ========================================================================== */
function initArchTabs() {
  const tabs = document.querySelectorAll('.arch-tab-btn');
  const panels = document.querySelectorAll('.arch-content-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-arch');

      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const activePanel = document.getElementById(`arch-${target}`);
      if (activePanel) {
        activePanel.classList.add('active');
      }
      playUiSound('click');
    });
  });
}

/* ==========================================================================
   7. SKILLS FILTER MATRIX
   ========================================================================== */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      skillCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });

      playUiSound('click');
    });
  });
}

/* ==========================================================================
   8. CASE STUDY MODALS
   ========================================================================== */
const projectDetailsData = {
  cvs: {
    title: 'CVS Health Enterprise Modernization & AI Copilot Suite',
    client: 'AETNA / CVS Health (Texas) • July 2025 - Present',
    tags: ['.NET 10', 'ASP.NET Core', 'AWS Lambda', 'EventBridge', 'FHIR / HIPAA', 'Microsoft Copilot', '.NET MAUI'],
    overview: 'Led the enterprise transformation of critical healthcare microservices and modern UI systems handling sensitive patient workflows, prescription fulfillment, and cross-organization integrations.',
    challenge: 'Transition legacy .NET 8 monoliths and disparate services into decoupled .NET 10 microservices, adhere to strict HIPAA and FHIR interoperability standards, and wire up AI Copilot capabilities without downtime.',
    solution: 'Designed event-driven pipelines utilizing Amazon EventBridge, AWS Lambda, S3, and DynamoDB alongside SQL Server. Upgraded application frameworks to .NET 10 with asynchronous caching, SignalR real-time event distribution, and Microsoft Copilot agent integration for automated clinical query handling. Built cross-platform mobile functionality via .NET MAUI.',
    metrics: [
      { label: 'Latency Reduction', val: '45%' },
      { label: 'Throughput', val: '10k+ req/sec' },
      { label: 'Compliance', val: '100% HIPAA/FHIR' },
      { label: 'Release Cycle', val: 'Automated CI/CD' }
    ]
  },
  microsoft: {
    title: 'Microsoft Substrate DCS & Flighting Platform',
    client: 'Microsoft (Redmond, WA) • August 2020 - January 2022',
    tags: ['C# .NET', 'Azure Service Bus', 'Azure Redis', 'Purview DCS', 'Exchange Online', 'Microservices'],
    overview: 'Engineered high-scale core systems running across Microsoft Exchange Online (EXO) and Purview Substrate, managing feature rollouts and sensitive data protection.',
    challenge: 'Enforcing mailbox throttling limits at cloud scale (10,000+ daily limit defaults) while running real-time Data Classification Service (DCS) for Data Loss Prevention (DLP) across Microsoft 365 services with sub-second SLA.',
    solution: 'Architected distributed event-driven microservices on Azure with Entity Framework Core, Redis Cache, Application Gateway, and weighted routing DNS. Implemented runtime policy management and gradual feature flighting for multi-million user cohorts.',
    metrics: [
      { label: 'DCS Scale', val: 'Millions M365 docs' },
      { label: 'Throttling Accuracy', val: '99.99%' },
      { label: 'Rollout Safety', val: 'Instant Flag Rollback' },
      { label: 'Availability', val: '99.999%' }
    ]
  },
  lacoe: {
    title: 'LACOE Statewide Education Data Exchange Platform',
    client: 'Los Angeles County Office of Education (LACOE) • Jan 2022 - July 2025',
    tags: ['ASP.NET Core', 'Angular 19', 'Blazor WASM', 'RabbitMQ', 'AKS', 'OAuth 2.0 / SSO', 'Power BI'],
    overview: 'Architected and modernized public-sector K-12 education platforms supporting administrative workflows, data compliance, and multi-department interoperability.',
    challenge: 'Ensuring seamless IFC sign data exchange between educational departments, third-party state agencies, and K-12 school districts with strict role-based access control and legacy data reconciliation.',
    solution: 'Developed the central Data Exchange Layer in ASP.NET Core with RabbitMQ queuing, AKS microservices, and modern UI dashboards using Angular 19 and Blazor WebAssembly. Created Power BI analytical dashboards for county stakeholders.',
    metrics: [
      { label: 'Districts Served', val: '80+ K-12 Districts' },
      { label: 'Data Processing', val: 'Real-time Async' },
      { label: 'Security', val: 'SSO & OAuth 2.0' },
      { label: 'UI Modernization', val: 'Angular 19 + Blazor' }
    ]
  },
  nationwide: {
    title: 'Nationwide Enterprise Quotation & Policy Engine',
    client: 'Nationwide Pet Insurance (Los Angeles, CA) • July 2019 - Aug 2020',
    tags: ['.NET Core', 'Service Fabric', 'Angular', 'React', 'Payment Gateways', 'OAuth 2.0'],
    overview: 'Built next-generation customer-facing insurance enrollment, quotation, and policy purchasing engines with integrated corporate employee discount rewards.',
    challenge: 'Modernizing the legacy Quote Enrollment Center (QEC) while integrating with major external partners (Amazon, Home Depot) and handling high-volume financial transactions securely.',
    solution: 'Created microservices utilizing Azure Service Fabric, Angular material components, REST APIs with OAuth tokens, and real-time payment gateway adapters.',
    metrics: [
      { label: 'Quote Speed', val: '< 1.2s instant' },
      { label: 'Conversion Lift', val: '+28%' },
      { label: 'Partner Feeds', val: 'Automated Sync' },
      { label: 'Test Coverage', val: 'TDD / 90%+' }
    ]
  },
  ebay: {
    title: 'eBay DSPM & PCI-SOX Financial Modernization',
    client: 'eBay (Draper, UT) • Feb 2019 - July 2019',
    tags: ['ASP.NET MVC', 'C#', 'SQL Server 2012', 'Kendo UI', 'PCI/SOX', 'REST & WCF'],
    overview: 'Developed critical digital document systems (DSPM, Digital Docs) and enterprise financial reporting portals adhering to stringent PCI-DSS and SOX requirements.',
    challenge: 'Processing high-volume credit card workflows and compliance tracking without exposing sensitive financial records.',
    solution: 'Implemented PCI-compliant payment validation services, Kendo UI Grid enterprise dashboards with server-side paging, and optimized T-SQL stored procedures.',
    metrics: [
      { label: 'Compliance Audit', val: '100% Passed' },
      { label: 'Query Tuning', val: '3x Faster Reports' },
      { label: 'Dashboard UX', val: 'Kendo UI Grid' },
      { label: 'Data Security', val: 'PCI-DSS Tier 1' }
    ]
  }
};

function initModals() {
  const modalOverlay = document.getElementById('case-study-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalContent = document.getElementById('modal-dynamic-content');
  const triggerBtns = document.querySelectorAll('[data-open-modal]');

  triggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const key = btn.getAttribute('data-open-modal');
      const data = projectDetailsData[key];
      if (!data) return;

      modalContent.innerHTML = `
        <div style="margin-bottom: 1.5rem;">
          <span class="badge" style="margin-bottom: 0.75rem;">${data.client}</span>
          <h2 style="font-size: 1.75rem; margin-bottom: 0.75rem;">${data.title}</h2>
          <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1.25rem;">
            ${data.tags.map(t => `<span class="exp-tag">${t}</span>`).join('')}
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1.25rem; font-size: 0.95rem; color: #cbd5e1; line-height: 1.65;">
          <div>
            <h4 style="color: var(--accent); font-size: 1.05rem; margin-bottom: 0.35rem;">Overview</h4>
            <p>${data.overview}</p>
          </div>
          <div>
            <h4 style="color: #fbbf24; font-size: 1.05rem; margin-bottom: 0.35rem;">The Challenge</h4>
            <p>${data.challenge}</p>
          </div>
          <div>
            <h4 style="color: #34d399; font-size: 1.05rem; margin-bottom: 0.35rem;">Engineering Solution</h4>
            <p>${data.solution}</p>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.85rem; margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--border-subtle);">
          ${data.metrics.map(m => `
            <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 0.85rem; text-align: center;">
              <div style="font-size: 1.35rem; font-weight: 800; color: var(--accent); font-family: var(--font-heading);">${m.val}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">${m.label}</div>
            </div>
          `).join('')}
        </div>
      `;

      modalOverlay.classList.add('active');
      playUiSound('click');
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  function closeModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove('active');
    }
  }
}

/* ==========================================================================
   9. INTERACTIVE DEVELOPER CLI TERMINAL
   ========================================================================== */
function initTerminal() {
  const terminalInput = document.getElementById('terminal-cli-input');
  const terminalOutput = document.getElementById('terminal-cli-output');
  const quickBtns = document.querySelectorAll('.quick-cmd-btn');
  if (!terminalInput || !terminalOutput) return;

  const history = [];
  let historyIdx = -1;

  const commands = {
    help: () => `
<span class="terminal-line accent">Available Commands:</span>
  <span class="accent">whoami</span>        - Display candidate summary & role
  <span class="accent">skills</span>        - Technical skills matrix & competencies
  <span class="accent">experience</span>    - Client work history (Microsoft, CVS Health, LACOE...)
  <span class="accent">architecture</span>  - Enterprise design patterns & cloud stack
  <span class="accent">contact</span>       - Phone, email, location & contact links
  <span class="accent">download</span>      - Trigger PDF / Resume print preview
  <span class="accent">stats</span>         - Key enterprise metrics & benchmarks
  <span class="accent">clear</span>         - Clear terminal console screen
    `,
    whoami: () => `
<span class="terminal-line success">Rama Devi - Senior .NET Full Stack Developer</span>
• 10+ Years IT Experience across Fortune 500 & Enterprise clients
• Master's Degree (CalUMS, Los Angeles, CA) + BS in Computer Science
• Expert in .NET 10/8, C#, ASP.NET Core, React, Blazor, Angular 19, AWS & Azure
• Phone: (840) 977-6552 | Email: rkreddy313579@gmail.com
    `,
    skills: () => `
<span class="terminal-line accent">Technical Stack Summary:</span>
[Backend]    .NET 10 / 8 / 6, C#, ASP.NET Core, Web API, Microservices, SignalR, WCF
[Data Layer] Entity Framework Core, Dapper, SQL Server 2022, Oracle 11g, DynamoDB
[Cloud]      AWS (Lambda, EventBridge, SQS, S3) | Azure (AKS, Service Bus, Redis, Functions)
[Frontend]   React (Hooks, Redux), Angular 19/18/8, Blazor WebAssembly, TypeScript, Tailwind
[Testing]    xUnit, NUnit, MSTest, SpecFlow, Selenium, Postman, TDD
[Security]   OAuth 2.0, OpenID Connect, HIPAA, FHIR, PCI-DSS, SOX Compliance
    `,
    experience: () => `
<span class="terminal-line accent">Career Trajectory:</span>
1. <span class="success">AETNA / CVS Health</span> (Jul 2025 - Present)   - Senior .NET Full Stack Developer
2. <span class="success">LA County Office of Ed</span> (Jan 2022 - Jul 2025) - Senior .NET Full Stack Developer
3. <span class="success">Microsoft</span> (Aug 2020 - Jan 2022)              - Sr .NET Developer (Purview & Substrate)
4. <span class="success">Nationwide</span> (Jul 2019 - Aug 2020)             - .NET Core Windows App Developer
5. <span class="success">eBay</span> (Feb 2019 - Jul 2019)                   - Sr .NET Developer (DSPM / PCI)
6. <span class="success">Progressive Insurance</span> (Apr 2018 - Feb 2019)   - Senior Dot Net Developer
7. <span class="success">Bartronics</span> (Feb 2013 - Aug 2015)             - Software Engineer / .NET
    `,
    architecture: () => `
<span class="terminal-line accent">Architecture & Design Philosophy:</span>
• Clean Architecture & Domain-Driven Design (DDD)
• Event-Driven Microservices (AWS EventBridge + SQS + Lambda)
• High-Throughput In-Memory Caching (Azure Redis Cache)
• Real-time Enterprise Updates (SignalR WebSockets)
• Zero-Trust Role Based Security (OAuth 2.0 + SSO)
    `,
    contact: () => `
<span class="terminal-line success">Direct Contact Details:</span>
• Email:    <a href="mailto:rkreddy313579@gmail.com" class="accent">rkreddy313579@gmail.com</a>
• Phone:    <a href="tel:8409776552" class="accent">(840) 977-6552</a>
• Location: California, USA (Open to Remote & Hybrid)
    `,
    stats: () => `
<span class="terminal-line accent">Key Metrics:</span>
• Total Experience: 10+ Years
• Microservices Deployed: 40+
• Fortune 500 Clients: Microsoft, CVS Health, Nationwide, eBay, Progressive
• System Availability: 99.99% Uptime
    `,
    download: () => {
      window.print();
      return `<span class="terminal-line success">Opening print / export resume dialog...</span>`;
    },
    clear: () => {
      terminalOutput.innerHTML = '';
      return null;
    }
  };

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const rawCmd = terminalInput.value.trim();
      if (!rawCmd) return;

      history.push(rawCmd);
      historyIdx = history.length;

      executeCommand(rawCmd);
      terminalInput.value = '';
    } else if (e.key === 'ArrowUp') {
      if (historyIdx > 0) {
        historyIdx--;
        terminalInput.value = history[historyIdx];
      }
    } else if (e.key === 'ArrowDown') {
      if (historyIdx < history.length - 1) {
        historyIdx++;
        terminalInput.value = history[historyIdx];
      } else {
        historyIdx = history.length;
        terminalInput.value = '';
      }
    }
  });

  quickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      terminalInput.value = cmd;
      executeCommand(cmd);
      terminalInput.value = '';
    });
  });

  function executeCommand(cmdStr) {
    const cleanCmd = cmdStr.toLowerCase().trim();
    playUiSound('click');

    // Print command prompt line
    const promptLine = document.createElement('div');
    promptLine.className = 'terminal-line';
    promptLine.innerHTML = `<span class="terminal-ps-prompt">PS RamaDevi\\Portfolio&gt;</span> ${cmdStr}`;
    terminalOutput.appendChild(promptLine);

    if (commands[cleanCmd]) {
      const res = commands[cleanCmd]();
      if (res !== null) {
        const resLine = document.createElement('div');
        resLine.className = 'terminal-line';
        resLine.innerHTML = res;
        terminalOutput.appendChild(resLine);
      }
    } else {
      const errorLine = document.createElement('div');
      errorLine.className = 'terminal-line warn';
      errorLine.innerHTML = `Command not recognized: '${cmdStr}'. Type <span class="accent">help</span> for a list of valid commands.`;
      terminalOutput.appendChild(errorLine);
    }

    const termBody = document.querySelector('.terminal-body');
    if (termBody) {
      termBody.scrollTop = termBody.scrollHeight;
    }
  }
}

/* ==========================================================================
   10. CONTACT FORM HANDLING
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('form-name').value;
    const email = document.getElementById('form-email').value;
    const subject = document.getElementById('form-subject').value;
    const message = document.getElementById('form-message').value;

    if (!name || !email || !message) {
      showToast('Please fill in all required fields.', 'warn');
      return;
    }

    playUiSound('success');
    showToast(`Thank you, ${name}! Your inquiry has been received.`);
    form.reset();
  });
}

/* ==========================================================================
   11. CLIPBOARD COPY UTILITIES
   ========================================================================== */
function initClipboard() {
  const copyEmailBtn = document.getElementById('copy-email-btn');
  if (!copyEmailBtn) return;

  copyEmailBtn.addEventListener('click', () => {
    const email = 'rkreddy313579@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
      playUiSound('click');
      showToast('Email address copied to clipboard!');
    }).catch(() => {
      showToast('Email: ' + email);
    });
  });
}

/* ==========================================================================
   TOAST NOTIFICATION ENGINE
   ========================================================================== */
let toastTimeout;
function showToast(message, type = 'info') {
  const toast = document.getElementById('toast-notification');
  const toastText = document.getElementById('toast-text');
  if (!toast || !toastText) return;

  toastText.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}
