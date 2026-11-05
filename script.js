// ── SCROLL PROGRESS BAR ──
const scrollProgress = document.getElementById("scrollProgress");
const btt = document.getElementById("btt");
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
  const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (window.scrollY / totalHeight) * 100;
  if (scrollProgress) scrollProgress.style.width = `${progress}%`;

  if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 50);
  if (btt) btt.classList.toggle("show", window.scrollY > 300);

  updateActiveNavLink();
});

// ── CUSTOM CURSOR & SPOTLIGHT ──
const cursorDot = document.getElementById("cursorDot");
const cursorGlow = document.getElementById("cursorGlow");
let mouseX = 0, mouseY = 0;
let glowX = 0, glowY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  if (cursorDot) {
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  }
});

function animateGlow() {
  glowX += (mouseX - glowX) * 0.1;
  glowY += (mouseY - glowY) * 0.1;

  if (cursorGlow) {
    cursorGlow.style.left = `${glowX}px`;
    cursorGlow.style.top = `${glowY}px`;
  }
  requestAnimationFrame(animateGlow);
}
animateGlow();

// ── BACKGROUND PARTICLE CANVAS ──
const canvas = document.getElementById("particle-canvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212, 175, 55, ${this.alpha})`;
      ctx.fill();
    }
  }

  const particleCount = Math.min(Math.floor(window.innerWidth / 20), 60);
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, index) => {
      p.update();
      p.draw();

      // Draw distance lines between close particles
      for (let j = index + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(212, 175, 55, ${0.1 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    });

    requestAnimationFrame(animateParticles);
  }
  animateParticles();
}

// ── TYPEWRITER EFFECT ──
const typewriterElement = document.getElementById("typewriter");
if (typewriterElement) {
  const words = JSON.parse(typewriterElement.getAttribute("data-words"));
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeEffect() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      typingSpeed = 2000; // Pause on complete word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 500;
    }

    setTimeout(typeEffect, typingSpeed);
  }
  typeEffect();
}

// ── MOBILE MENU ──
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("open");
    hamburger.classList.toggle("active");
  });

  navLinks.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      navLinks.classList.remove("open");
      hamburger.classList.remove("active");
    });
  });
}

// ── ACTIVE NAV LINK TRACKING ──
const sections = document.querySelectorAll("section[id]");
const navLinksList = document.querySelectorAll(".nav-links a");

function updateActiveNavLink() {
  let currentSection = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 150;
    if (window.scrollY >= sectionTop) {
      currentSection = section.getAttribute("id");
    }
  });

  navLinksList.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${currentSection}`) {
      link.classList.add("active");
    }
  });
}

// ── SMOOTH SCROLLING ──
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");
    if (targetId === "#") return;
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      e.preventDefault();
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// ── INTERSECTION OBSERVER FOR FADE-IN ──
const fadeElements = document.querySelectorAll(".fade-in");
const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);
fadeElements.forEach((el) => fadeObserver.observe(el));

// ── SKILL BARS & PERCENTAGE FILL ──
const skillPanels = document.querySelectorAll("#skill");
const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll(".skill-bar-fill").forEach((bar) => {
          bar.style.width = bar.dataset.width + "%";
        });
        skillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
skillPanels.forEach((p) => skillObserver.observe(p));

// ── SKILL CATEGORY TAB FILTER ──
const skillTabs = document.querySelectorAll(".skill-tab");
const skillCards = document.querySelectorAll(".skill-card");

skillTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    skillTabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");

    const category = tab.dataset.category;
    skillCards.forEach((card) => {
      if (category === "all" || card.dataset.category === category) {
        card.style.display = "block";
        setTimeout(() => (card.style.opacity = "1"), 50);
      } else {
        card.style.opacity = "0";
        setTimeout(() => (card.style.display = "none"), 300);
      }
    });
  });
});

// ── STATS NUMBER COUNTER ──
const statElements = document.querySelectorAll(".stat-num");
let statsAnimated = false;

function animateStats() {
  if (statsAnimated) return;

  statElements.forEach((stat) => {
    const target = parseInt(stat.getAttribute("data-target"));
    const suffix = stat.getAttribute("data-suffix") || "";
    let count = 0;
    const duration = 1500;
    const stepTime = Math.abs(Math.floor(duration / target));

    const timer = setInterval(() => {
      count += 1;
      stat.textContent = count + suffix;
      if (count >= target) {
        stat.textContent = target + suffix;
        clearInterval(timer);
      }
    }, Math.max(stepTime, 20));
  });

  statsAnimated = true;
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateStats();
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector(".hero-stats");
if (heroStats) statsObserver.observe(heroStats);

// ── 3D CARD TILT EFFECT ──
const tiltCards = document.querySelectorAll("[data-tilt]");

tiltCards.forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 12;
    const rotateY = (centerX - x) / 12;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  });
});

// ── TOAST NOTIFICATIONS ──
function showToast(message, icon = "fas fa-check-circle") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<i class="${icon}"></i> <span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 50);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

// ── BILINGUAL LANGUAGE ENGINE (ID / EN) ──
let currentLang = localStorage.getItem("fdlann_lang") || "en";

const I18N_DICT = {
  en: {
    nav_home: "Home",
    nav_about: "About",
    nav_cert: "Certificates",
    nav_skill: "Skills",
    nav_exp: "Experience",
    nav_works: "Works",
    nav_contact: "Contact",
    btn_copy_email: "Copy Email",
    hero_status: "Open for Opportunities",
    hero_role_prefix: "I am a",
    hero_desc: "Fresh graduate in Information Systems with experience in building end-to-end web applications, designing database architectures, and analyzing business processes into scalable digital solutions.",
    hero_btn_works: "View My Works",
    hero_btn_cv: "Download CV",
    stat_cert: "Certifications",
    stat_repos: "GitHub Repos",
    stat_dedication: "Dedication",
    hero_major: "Information Systems",
    hero_avail: "Available for Hire",
    about_badge_title: "Web & System",
    about_badge_sub: "Development Focus",
    about_label: "Get To Know Me",
    about_heading: 'About <span class="gold-gradient">Me</span>',
    about_p1: 'Hi, I\'m <strong>Muhamad Fadlan</strong> — a passionate Information Systems graduate from <strong>Gunadarma University</strong> with a focus on web development, database management, and business process automation.',
    about_p2: "I specialize in bridging business needs with technical solutions: designing relational database models, developing robust backend logic, and engineering clean, user-centric web interfaces.",
    about_hl1_title: "Full-Stack Foundation",
    about_hl1_desc: "HTML, CSS, JavaScript, PHP, MySQL & React ecosystem",
    about_hl2_title: "System & Data Focus",
    about_hl2_desc: "Database design, workflow optimization & data structuring",
    about_btn_cv: "View Full CV (PDF)",
    about_btn_contact: "Quick Contact",
    cert_label: "Verified Credentials",
    cert_heading: 'Professional <span class="gold-gradient">Certificates</span>',
    cert_sub: "Certifications earned through rigorous training in Web Programming, UI/UX Design, JavaScript, and DBMS.",
    cert1_title: "UI/UX Design Certificate",
    cert1_desc: "Professional training program in user research, wireframing, interactive prototyping, and visual design principles.",
    cert2_title: "JavaScript Certificate",
    cert2_desc: "Comprehensive JavaScript course covering core logic, asynchronous JS, DOM manipulation, and modern ES6+ standards.",
    cert3_title: "BNSP – Junior Web Programmer",
    cert3_desc: "National certification standard for web programming: structured code implementation, security basics, and software testing.",
    cert4_title: "DBMS & Oracle Database",
    cert4_desc: "Database management fundamentals, relational design, complex SQL query structures, and Oracle database architecture.",
    btn_preview_pdf: "Preview PDF",
    skill_label: "Technical Expertise",
    skill_heading: 'My <span class="gold-gradient">Skills</span> & Tools',
    skill_sub: "Technologies and development tools I use to turn ideas into interactive digital reality.",
    skill_tab_all: "All Skills",
    skill_tab_tools: "Design & Tools",
    exp_label: "Career Journey",
    exp_heading: 'Work <span class="gold-gradient">Experience</span>',
    exp_sub: "Practical roles, internships, and laboratory assistant responsibilities.",
    exp1_desc: "Engineered a comprehensive product catalog system with admin panel controls and integrated direct WhatsApp ordering to streamline transaction flows. Collaborated in cross-functional teams to design intuitive UI components and backend database schemas.",
    exp2_period: "Academic Period",
    exp2_badge: "Academic Role",
    exp2_title: "Laboratory Assistant — Gunadarma University",
    exp2_desc: "Guided computer science students through programming fundamentals, algorithm logic, database structures, and debugging techniques. Prepared structured teaching modules, conducted lab sessions, and evaluated student project deliverables.",
    works_label: "Portfolio Showcase",
    works_heading: 'Recent <span class="gold-gradient">Works</span>',
    works_sub: 'Selected web projects, system analysis case studies, and interactive digital solutions (<a href="https://github.com/FdLann" target="_blank" class="text-gold">@FdLann</a>).',
    works_tab_all: "All Projects",
    works_search_placeholder: "Search projects or technologies...",
    contact_label: "Get In Touch",
    contact_heading: 'Let\'s Work <span class="gold-gradient">Together</span>',
    contact_sub: "Whether you have a full-time position, freelance project, or just want to connect — I am always open to chat!",
    contact_email_label: "Email Address",
    btn_copy: "Copy",
    btn_visit: "Visit",
    form_title: "Send Direct Message",
    form_desc: "Send a message directly to my inbox — no external mail app setup required.",
    form_name_label: "Your Name",
    form_email_label: "Your Email",
    form_subject_label: "Subject",
    form_msg_label: "Message",
    form_btn_send: "Send Message Now",
    footer_desc: "Information Systems Graduate passionate about crafting robust web applications, scalable database systems, and interactive digital solutions.",
    footer_links_title: "Quick Links",
    footer_status: "Open for Full-Time & Freelance",
    footer_visits: "Total Visits:",
    btn_close: "Close",
    btn_download_pdf: "Download PDF"
  },
  id: {
    nav_home: "Beranda",
    nav_about: "Tentang",
    nav_cert: "Sertifikat",
    nav_skill: "Keahlian",
    nav_exp: "Pengalaman",
    nav_works: "Projek",
    nav_contact: "Kontak",
    btn_copy_email: "Salin Email",
    hero_status: "Terbuka untuk Peluang Kerja",
    hero_role_prefix: "Saya seorang",
    hero_desc: "Lulusan baru Sistem Informasi yang berpengalaman membangun aplikasi web end-to-end, merancang arsitektur database relasional, dan menganalisis proses bisnis menjadi solusi digital yang terukur.",
    hero_btn_works: "Lihat Projek Saya",
    hero_btn_cv: "Unduh CV",
    stat_cert: "Sertifikasi",
    stat_repos: "Repo GitHub",
    stat_dedication: "Dedikasi",
    hero_major: "Sistem Informasi",
    hero_avail: "Siap Bekerja",
    about_badge_title: "Web & Sistem",
    about_badge_sub: "Fokus Pengembangan",
    about_label: "Kenali Saya Lebih Dekat",
    about_heading: 'Tentang <span class="gold-gradient">Saya</span>',
    about_p1: 'Halo, saya <strong>Muhamad Fadlan</strong> — lulusan Sistem Informasi dari <strong>Universitas Gunadarma</strong> yang berfokus pada pengembangan web, manajemen database, dan otomatisasi proses bisnis.',
    about_p2: "Saya berfokus menjembatani kebutuhan bisnis dengan solusi teknis: merancang model database relasional (ERD), membangun logika backend yang tangguh, serta mendesain antarmuka web yang bersih dan ramah pengguna.",
    about_hl1_title: "Fondasi Full-Stack",
    about_hl1_desc: "Ekosistem HTML, CSS, JavaScript, PHP, MySQL & React",
    about_hl2_title: "Fokus Sistem & Data",
    about_hl2_desc: "Perancangan database, optimasi alur kerja & struktur data",
    about_btn_cv: "Lihat CV Lengkap (PDF)",
    about_btn_contact: "Kontak Cepat",
    cert_label: "Kredensial Terverifikasi",
    cert_heading: '<span class="gold-gradient">Sertifikat</span> Profesional',
    cert_sub: "Sertifikasi kompetensi yang diraih melalui pelatihan intensif Pemrograman Web, UI/UX Design, JavaScript, dan DBMS.",
    cert1_title: "Sertifikat Desain UI/UX",
    cert1_desc: "Program pelatihan profesional dalam riset pengguna, wireframing, prototyping interaktif, dan prinsip desain visual.",
    cert2_title: "Sertifikat JavaScript",
    cert2_desc: "Kursus komprehensif JavaScript mencakup logika inti, asynchronous JS, manipulasi DOM, dan standar ES6+ modern.",
    cert3_title: "BNSP – Junior Web Programmer",
    cert3_desc: "Sertifikasi standar nasional pemrograman web: implementasi kode terstruktur, dasar keamanan, dan pengujian perangkat lunak.",
    cert4_title: "DBMS & Database Oracle",
    cert4_desc: "Fundamental manajemen database, desain relasional, struktur query SQL kompleks, dan arsitektur database Oracle.",
    btn_preview_pdf: "Lihat PDF",
    skill_label: "Keahlian Teknis",
    skill_heading: '<span class="gold-gradient">Keahlian</span> & Tools',
    skill_sub: "Teknologi dan perangkat pengembangan yang saya gunakan untuk mewujudkan ide menjadi solusi digital interaktif.",
    skill_tab_all: "Semua Keahlian",
    skill_tab_tools: "Desain & Tools",
    exp_label: "Perjalanan Karier",
    exp_heading: 'Pengalaman <span class="gold-gradient">Kerja</span>',
    exp_sub: "Peran praktis, program magang MSIB, dan tanggung jawab asisten laboratorium.",
    exp1_desc: "Merancang bangun sistem katalog produk komprehensif dengan panel admin serta integrasi pemesanan langsung ke WhatsApp untuk mempercepat alur transaksi. Berkolaborasi lintas divisi dalam merancang komponen UI dan skema database backend.",
    exp2_period: "Masa Perkuliahan",
    exp2_badge: "Peran Akademik",
    exp2_title: "Asisten Laboratorium — Universitas Gunadarma",
    exp2_desc: "Membimbing mahasiswa ilmu komputer dalam dasar pemrograman, logika algoritma, struktur database, dan teknik debugging. Menyusun modul praktikum, memandu sesi laboratorium, dan mengevaluasi hasil projek mahasiswa.",
    works_label: "Portofolio Karya",
    works_heading: 'Projek <span class="gold-gradient">Terbaru</span>',
    works_sub: 'Koleksi projek web terpilih, studi kasus analisis sistem, dan inovasi yang sedang dikembangkan (<a href="https://github.com/FdLann" target="_blank" class="text-gold">@FdLann</a>).',
    works_tab_all: "Semua Projek",
    works_search_placeholder: "Cari projek atau teknologi...",
    contact_label: "Hubungi Saya",
    contact_heading: 'Mari <span class="gold-gradient">Berkolaborasi</span>',
    contact_sub: "Baik untuk posisi full-time, projek freelance, maupun diskusi seputar teknologi — saya selalu terbuka untuk berbincang!",
    contact_email_label: "Alamat Email",
    btn_copy: "Salin",
    btn_visit: "Kunjungi",
    form_title: "Kirim Pesan Langsung",
    form_desc: "Kirim pesan langsung ke email saya dari halaman ini — tanpa perlu membuka aplikasi email tambahan.",
    form_name_label: "Nama Anda",
    form_email_label: "Email Anda",
    form_subject_label: "Subjek",
    form_msg_label: "Pesan",
    form_btn_send: "Kirim Pesan Sekarang",
    footer_desc: "Lulusan Sistem Informasi yang antusias merancang aplikasi web handal, sistem database terukur, dan solusi digital interaktif.",
    footer_links_title: "Navigasi Cepat",
    footer_status: "Terbuka untuk Full-Time & Freelance",
    footer_visits: "Total Kunjungan:",
    btn_close: "Tutup",
    btn_download_pdf: "Unduh PDF"
  }
};

window.setLanguage = function(lang) {
  currentLang = lang === "id" ? "id" : "en";
  try {
    localStorage.setItem("fdlann_lang", currentLang);
  } catch (e) {}

  const btnId = document.getElementById("langBtnId");
  const btnEn = document.getElementById("langBtnEn");
  if (btnId) btnId.classList.toggle("active", currentLang === "id");
  if (btnEn) btnEn.classList.toggle("active", currentLang === "en");

  const dict = I18N_DICT[currentLang];
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) {
      el.innerHTML = dict[key];
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (dict[key]) {
      el.setAttribute("placeholder", dict[key]);
    }
  });

  if (allProjects && allProjects.length > 0) {
    applyCombinedProjectFilter();
  }
};

// ── COPY EMAIL TO CLIPBOARD ──
function copyEmail() {
  const email = "muhamadfadlan2804@gmail.com";
  navigator.clipboard.writeText(email).then(() => {
    const msg = currentLang === "id"
      ? "Alamat email muhamadfadlan2804@gmail.com berhasil disalin!"
      : "Email muhamadfadlan2804@gmail.com copied to clipboard!";
    showToast(msg);
  }).catch(() => {
    showToast("Failed to copy email.", "fas fa-exclamation-triangle");
  });
}

// ── DIRECT AJAX EMAIL CONTACT (WITH GRACEFUL FALLBACK) ──
async function handleContactSubmit(event) {
  event.preventDefault();
  const name = document.getElementById("senderName")?.value.trim() || "";
  const email = document.getElementById("senderEmail")?.value.trim() || "";
  const subject = document.getElementById("senderSubject")?.value.trim() || "Portfolio Contact";
  const message = document.getElementById("senderMessage")?.value.trim() || "";
  const submitBtn = document.getElementById("contactSubmitBtn");

  const originalBtnHTML = submitBtn ? submitBtn.innerHTML : "";
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> <span>${currentLang === "id" ? "Mengirim Pesan..." : "Sending Message..."}</span>`;
  }

  try {
    const response = await fetch("https://formsubmit.co/ajax/muhamadfadlan2804@gmail.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        name: name,
        email: email,
        _subject: `[Portfolio] ${subject}`,
        message: message
      })
    });

    const result = await response.json();
    if (response.ok && (result.success === "true" || result.success === true)) {
      showToast(
        currentLang === "id"
          ? "Pesan berhasil dikirim ke muhamadfadlan2804@gmail.com!"
          : "Message sent directly to muhamadfadlan2804@gmail.com!",
        "fas fa-check-circle"
      );
      document.getElementById("quickContactForm")?.reset();
    } else {
      throw new Error("FormSubmit requires initial activation or fallback");
    }
  } catch (err) {
    const mailtoUrl = `mailto:muhamadfadlan2804@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("Name: " + name + "\nEmail: " + email + "\n\nMessage:\n" + message)}`;
    showToast(
      currentLang === "id"
        ? "Membuka pengiriman email langsung ke muhamadfadlan2804@gmail.com..."
        : "Opening direct email to muhamadfadlan2804@gmail.com...",
      "fas fa-paper-plane"
    );
    setTimeout(() => {
      window.location.href = mailtoUrl;
    }, 600);
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHTML;
    }
  }
}

// ── CERTIFICATE PDF MODAL ──
function openModal(pdf, title) {
  const modalTitle = document.getElementById("modalTitle");
  const modalFrame = document.getElementById("modalFrame");
  const modalDownload = document.getElementById("modalDownload");
  const modal = document.getElementById("modal");

  if (modalTitle) modalTitle.textContent = title;
  if (modalFrame) modalFrame.src = pdf;
  if (modalDownload) modalDownload.href = pdf;
  if (modal) modal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  const modal = document.getElementById("modal");
  const modalFrame = document.getElementById("modalFrame");
  if (modal) modal.classList.remove("open");
  if (modalFrame) modalFrame.src = "";
  document.body.style.overflow = "";
}

const modal = document.getElementById("modal");
if (modal) {
  modal.addEventListener("click", function (e) {
    if (e.target === this) closeModal();
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
    closeCaseStudyModal();
  }
});

// ── PROJECTS SHOWCASE & FILTER (FROM DATA-PROJEK.JSON) ──
let allProjects = [];
const cardImageIndices = {};

const FALLBACK_PROJECTS = [
  {
    id_projek: "1",
    gambar: ["gambar/Projek1.png"],
    title: "Ultimate Football Manager",
    deskripsi: "Permainan strategi sepak bola berbasis web yang mengasah kemampuan taktik, formasi, dan manajemen tim secara interaktif.",
    deskripsi_en: "An interactive web-based football strategy game that tests tactical decision-making, squad formation, and club management.",
    link: "https://football-manager-idle.vercel.app/",
    kategori: "Personal",
    tag: "Web Game",
    tech: ["HTML5", "JavaScript", "CSS3", "Vercel", "Idle Game"],
    caseStudy: {
      role: "Lead Game Logic & Front-End Developer",
      problem_id: "Banyak game simulasi manajer sepak bola memerlukan instalasi berat. Projek ini menghadirkan simulasi taktik dan manajemen klub yang ringan dan langsung dapat dimainkan di browser.",
      problem_en: "Many football management games require heavy installations. This project delivers a lightweight, browser-ready tactical and club management simulation.",
      features_id: [
        "Simulasi pertandingan real-time berbasis algoritma statistik pemain",
        "Manajemen formasi taktikal, rotasi skuad, dan bursa transfer",
        "Penyimpanan progres otomatis (State Persistence via LocalStorage)"
      ],
      features_en: [
        "Real-time match simulation driven by player attribute algorithms",
        "Tactical formation management, squad rotation, and transfer market",
        "Automatic progress persistence via LocalStorage state engine"
      ],
      architecture: ["UI Layer (DOM & CSS Grid)", "Game State Engine (JS)", "Match Simulation Algorithm", "LocalStorage Persistence"],
      dbEntities: "Club -> Squad_Players -> Match_Engine -> League_Standings"
    }
  },
  {
    id_projek: "2",
    gambar: ["gambar/Projek2.png"],
    title: "EA FC Scouting Tool",
    deskripsi: "Aplikasi analitik untuk membantu pemain EA FC mencari, memfilter, dan menganalisis potensi pemain secara efektif.",
    deskripsi_en: "An analytics web app designed to help EA FC players search, filter, and evaluate player potential and career mode value.",
    link: "https://ea-fc24-scouting-tool.vercel.app/scouting",
    kategori: "Personal",
    tag: "Web App",
    tech: ["React", "Analytics Tool", "REST API", "Vercel"],
    caseStudy: {
      role: "Front-End Engineer & Data Analyst",
      problem_id: "Pemain Career Mode sering kesulitan membandingkan atribut ribuan pemain muda (wonderkid) sesuai budget transfer dan gaya bermain.",
      problem_en: "Career Mode players often struggle to filter and compare thousands of wonderkids matching specific transfer budgets and tactical roles.",
      features_id: [
        "Pencarian multi-filter berdasarkan usia, rating, potensi, dan posisi",
        "Kalkulasi rasio efisiensi harga transfer terhadap potensi perkembangan",
        "Antarmuka reaktif dengan pembaruan data instan berbasis React"
      ],
      features_en: [
        "Multi-attribute filtering by age, overall rating, potential, and position",
        "Value-for-money ratio calculation against growth potential",
        "Reactive UI with instant client-side filtering built in React"
      ],
      architecture: ["React Component UI", "Multi-Parameter Filter Hook", "Player Dataset API", "Analytics & Rating Calculator"],
      dbEntities: "Players (ID, OVR, POT, Age, Value) -> Positions -> Club_Attributes"
    }
  },
  {
    id_projek: "3",
    gambar: ["gambar/Projek3.png"],
    title: "Galeri Foto & Komunitas Chat",
    deskripsi: "Platform web penyimpanan galeri foto dan ruang diskusi komunitas hasil karya Penulisan Ilmiah masa perkuliahan.",
    deskripsi_en: "A web platform featuring photo gallery management and community chat rooms developed as an undergraduate scientific research project.",
    link: "",
    kategori: "Academic",
    tag: "College Project",
    tech: ["PHP", "HTML5", "CSS3", "MySQL", "phpMyAdmin", "JavaScript"],
    isExpired: true,
    caseStudy: {
      role: "Full-Stack Developer & System Analyst (Penulisan Ilmiah)",
      problem_id: "Dibutuhkan wadah terpusat bagi komunitas fotografi kampus untuk mengunggah karya beresolusi tinggi sekaligus berdiskusi secara langsung.",
      problem_en: "Campus photography communities needed a centralized hub to showcase high-resolution portfolios and engage in topic-based discussions.",
      features_id: [
        "Autentikasi pengguna multi-level dan manajemen profil kreator",
        "Unggah foto dengan kategorisasi album dan validasi ukuran file",
        "Fitur ruang obrolan komunitas dan komentar interaktif berbasis MySQL"
      ],
      features_en: [
        "Multi-level user authentication and creator profile management",
        "Photo upload pipeline with album categorization and file validation",
        "Interactive community chat rooms and comment threads powered by MySQL"
      ],
      architecture: ["Client Browser (HTML/CSS/JS)", "PHP Native Controller", "File Upload & Auth Middleware", "MySQL Relational DB"],
      dbEntities: "Users (1:N) -> Albums (1:N) -> Photos (1:N) -> Chat_Messages"
    }
  },
  {
    id_projek: "4",
    gambar: ["gambar/Projek4.png", "gambar/Projek4-a.png"],
    title: "Match Me - Outfit Matcher",
    deskripsi: "Aplikasi web rekomendasi kombinasi outfit yang membantu mahasiswa/i memadupadankan pakaian yang serasi dan stylish.",
    deskripsi_en: "An outfit recommendation web app that helps university students mix and match harmonious, stylish daily wear.",
    link: "https://github.com/FdLann/Projek-MatchingBaju-PHP-NATIVE",
    kategori: "Academic",
    tag: "College Project",
    tech: ["PHP", "HTML5", "CSS3", "MySQL", "phpMyAdmin", "JavaScript", "UI/UX Design"],
    caseStudy: {
      role: "System Analyst, UI/UX Designer & Backend Developer",
      problem_id: "Mahasiswa sering menghabiskan banyak waktu memilih kombinasi warna dan jenis pakaian yang cocok untuk kegiatan kuliah formal maupun kasual.",
      problem_en: "Students often spend excessive time choosing matching color palettes and outfit styles for formal or casual campus activities.",
      features_id: [
        "Pencocokan otomatis atasan, bawahan, dan warna berdasarkan kategori acara",
        "Katalog digital interaktif dengan preview pasangan pakaian",
        "Panel manajemen data katalog pakaian berbasis PHP & MySQL"
      ],
      features_en: [
        "Automated matching of tops, bottoms, and color palettes by occasion",
        "Interactive digital wardrobe catalog with visual outfit pairing preview",
        "Full CRUD catalog management panel built with PHP & MySQL"
      ],
      architecture: ["UI/UX Wireframe & Prototype", "Outfit Matching Logic (PHP)", "Catalog CRUD Module", "MySQL Database Schema"],
      dbEntities: "Categories (1:N) -> Apparel_Items (N:M) -> Outfit_Combinations"
    }
  },
  {
    id_projek: "5",
    gambar: [
      "gambar/Projek5-a.png",
      "gambar/Projek5-b.png",
      "gambar/Projek5-c.png"
    ],
    title: "Sistem Informasi Administrasi Akademik",
    deskripsi: "Sistem informasi berbasis web untuk mengelola data penulisan ilmiah dan pengajuan surat magang mahasiswa FIKTI secara terstruktur.",
    deskripsi_en: "A web-based academic administration system engineered to streamline scientific writing submissions and internship letter requests for FIKTI students.",
    link: "https://github.com/FdLann/sistem-administrasi-sistem-informasi",
    kategori: "Academic",
    tag: "College Project",
    tech: ["PHP", "HTML5", "CSS3", "MySQL", "phpMyAdmin", "JavaScript"],
    caseStudy: {
      role: "System Analyst & Full-Stack Web Developer",
      problem_id: "Proses pengajuan surat pengantar magang dan pendataan penulisan ilmiah secara manual memakan waktu lama dan rawan kesalahan pencatatan status.",
      problem_en: "Manual processing of internship cover letters and academic research registrations caused long queues and status tracking errors.",
      features_id: [
        "Alur pengajuan mandiri oleh mahasiswa dengan pelacakan status real-time",
        "Dashboard verifikasi admin jurusan untuk persetujuan dokumen",
        "Otomatisasi rekapitulasi laporan dan cetak surat pengantar"
      ],
      features_en: [
        "Self-service student submission workflow with real-time status tracking",
        "Department admin verification dashboard for document approvals",
        "Automated reporting and printable cover letter generation"
      ],
      architecture: ["Mahasiswa Portal UI", "Role-Based Auth (PHP)", "Admin Approval Workflow", "MySQL Academic DB"],
      dbEntities: "Mahasiswa (1:N) -> Pengajuan_Surat (N:1) -> Admin_Verifikasi"
    }
  },
  {
    id_projek: "6",
    gambar: [
      "gambar/Projek6-a.png",
      "gambar/Projek6-b.png",
      "gambar/Projek6-c.png"
    ],
    title: "MedTrack - Portal Pasien",
    deskripsi: "Aplikasi web health-tech untuk membantu pasien mengakses hasil pemeriksaan medis dan rekam kesehatan secara aman dari mana saja.",
    deskripsi_en: "A health-tech patient portal enabling patients to securely access lab results, prescriptions, and medical records remotely.",
    link: "https://github.com/FdLann/medtrack-portal-pasien",
    kategori: "Personal",
    tag: "Web App",
    tech: [
      "React",
      "Vite",
      "Tailwind CSS",
      "Express.js",
      "PostgreSQL",
      "REST API",
      "JWT Auth",
      "bcrypt"
    ],
    caseStudy: {
      role: "Full-Stack Developer & Database Architect",
      problem_id: "Pasien sering harus mengantre kembali di rumah sakit hanya untuk mengambil lembar hasil laboratorium atau melihat riwayat resep dokter.",
      problem_en: "Patients frequently have to queue at hospitals just to pick up printed lab results or check past prescription records.",
      features_id: [
        "Keamanan akses berlapis menggunakan JWT Authentication & enkripsi bcrypt",
        "Dashboard riwayat pemeriksaan medis, hasil lab, dan jadwal kontrol",
        "RESTful API terstruktur dengan Express.js dan database relasional PostgreSQL"
      ],
      features_en: [
        "Multi-layer security using JWT Authentication & bcrypt password hashing",
        "Comprehensive dashboard for medical checkups, lab results, and appointments",
        "Structured RESTful API built with Express.js and PostgreSQL relational schema"
      ],
      architecture: ["React + Tailwind SPA", "JWT Auth Middleware", "Express.js REST API", "PostgreSQL Medical DB"],
      dbEntities: "Patients (1:N) -> Medical_Records (1:N) -> Lab_Results & Prescriptions"
    }
  },
  {
    id_projek: "7",
    gambar: ["gambar/Projek7-sdd.svg"],
    title: "SDD — Sistem Repositori PI & Tugas Akhir",
    deskripsi: "Dokumen Rancangan Perangkat Lunak (SDD) lengkap untuk Sistem Repositori Penulisan Ilmiah & Tugas Akhir Jurusan Sistem Informasi Universitas Gunadarma.",
    deskripsi_en: "Comprehensive Software Design Document (SDD) & System Analysis for the Scientific Research & Thesis Repository System at Gunadarma University.",
    link: "",
    pdfDoc: "gambar/DESIGN PROJEK.pdf",
    kategori: "Academic",
    tag: "System Design (SDD)",
    tech: [
      "System Analysis",
      "SDD",
      "BPMN",
      "UML Class Diagram",
      "UI/UX Wireframe",
      "RDBMS",
      "SRS Matrix"
    ],
    caseStudy: {
      role: "System Analyst & Software Architect (Kelompok 1 - PPSI)",
      problem_id: "Pengunggahan Penulisan Ilmiah (PI) dan Tugas Akhir (TA) di jurusan Sistem Informasi sebelumnya masih dilakukan manual melalui email ke staf, sehingga memperlambat validasi dan pencarian referensi akademik.",
      problem_en: "Submitting Scientific Research (PI) and Final Theses (TA) in the Information Systems department was previously handled manually via email to staff, slowing down validation and reference discovery.",
      features_id: [
        "Arsitektur Tiga-Lapis (Web Browser, Modul Login & Validasi KTM/KRS, serta RDBMS)",
        "Pemodelan proses bisnis lengkap dengan BPMN User (Mahasiswa/Dosen) & BPMN Admin",
        "Rancangan Class Diagram, Kamus Data, Pseudocode Validasi File, Struktur Navigasi, dan Wireframe UI"
      ],
      features_en: [
        "Three-Tier Architecture (Web Browser Client, Auth & Student ID Validation, and RDBMS)",
        "Complete Business Process Model & Notation (BPMN) for Students, Lecturers, and Admins",
        "Relational Class Diagram, Data Dictionary, File Validation Pseudocode, Navigation Map, and UI Wireframes"
      ],
      architecture: [
        "Web Browser Client",
        "Login & KTM Verification",
        "Directory PI & TA Manager",
        "RDBMS Central Storage"
      ],
      dbEntities: "Student & Dosen (1:N) -> Repositori_PI & Repositori_TA <- (1:N) Admin & Berita_Repository"
    }
  },
  {
    id_projek: "8",
    gambar: [],
    title: "Secret Next Project 🚀",
    deskripsi: "Projek selanjutnya yang masih dalam tahap perancangan rahasia & riset inovatif. Masih misterius tapi bakal seru banget! Tunggu tanggal mainnya! 🤫✨",
    deskripsi_en: "An upcoming project currently in stealth system design & R&D phase. Stay tuned for the next big innovation! 🤫✨",
    link: "#",
    kategori: "none",
    tag: "Coming Soon",
    tech: ["Top Secret", "In Research", "Next Innovation"],
    isComingSoon: true
  }
];

function sanitizeImagePaths(rawGambar) {
  if (!rawGambar) return [];
  if (Array.isArray(rawGambar)) {
    return rawGambar.filter(Boolean).map(img => img.replace(/^(\.\.\/)+/, ""));
  }
  if (typeof rawGambar === "string" && rawGambar.trim() !== "") {
    return [rawGambar.replace(/^(\.\.\/)+/, "")];
  }
  return [];
}

async function loadProjects() {
  const container = document.getElementById("githubProjects") || document.getElementById("worksGrid");
  if (!container) return;

  try {
    const response = await fetch("data/data-projek.json");
    if (!response.ok) throw new Error("Could not load data-projek.json");
    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      allProjects = data.map(item => {
        const images = sanitizeImagePaths(item.gambar);
        const isComingSoon = Boolean(
          item.isComingSoon ||
          (item.tag && item.tag.toLowerCase().includes("coming")) ||
          (item.title && item.title.toLowerCase().includes("coming")) ||
          (item.title && item.title.toLowerCase().includes("secret")) ||
          images.length === 0
        );

        const category = item.kategori || (item.tag === "College Project" ? "Academic" : (isComingSoon ? "none" : "Personal"));

        return {
          ...item,
          images: images,
          gambar: images.length > 0 ? images[0] : "",
          kategori: category,
          tech: item.tech || ["Web Project", "Clean Architecture"],
          tag: item.tag || (isComingSoon ? "Coming Soon" : "Featured Project"),
          isComingSoon: isComingSoon,
          isExpired: Boolean(item.isExpired || (!item.link && !item.pdfDoc && !isComingSoon))
        };
      });
    } else {
      allProjects = parseFallbackData();
    }
  } catch (err) {
    console.info("Using embedded project dataset:", err.message);
    allProjects = parseFallbackData();
  }

  updateCategoryTabCounts();
  renderProjectCards(allProjects);
}

function parseFallbackData() {
  return FALLBACK_PROJECTS.map(item => {
    const images = sanitizeImagePaths(item.gambar);
    return {
      ...item,
      images: images,
      gambar: images.length > 0 ? images[0] : "",
      kategori: item.kategori || (item.tag === "College Project" ? "Academic" : (item.isComingSoon ? "none" : "Personal")),
      isComingSoon: Boolean(item.isComingSoon),
      isExpired: Boolean(item.isExpired)
    };
  });
}

function updateCategoryTabCounts() {
  const countAllEl = document.getElementById("countAll");
  const countPersonalEl = document.getElementById("countPersonal");
  const countAcademicEl = document.getElementById("countAcademic");

  if (allProjects && allProjects.length > 0) {
    const personalCount = allProjects.filter(p => p.kategori && p.kategori.toLowerCase() === "personal").length;
    const academicCount = allProjects.filter(p => p.kategori && p.kategori.toLowerCase() === "academic").length;
    const allCount = personalCount + academicCount; // or allProjects.length

    if (countAllEl) countAllEl.textContent = `(${allCount})`;
    if (countPersonalEl) countPersonalEl.textContent = `(${personalCount})`;
    if (countAcademicEl) countAcademicEl.textContent = `(${academicCount})`;
  }
}

// ── MULTI-PHOTO SLIDER CONTROLS ──
window.slideCardImage = function(projectId, step, event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  const project = allProjects.find(p => String(p.id_projek) === String(projectId));
  if (!project || !project.images || project.images.length <= 1) return;

  const total = project.images.length;
  let currentIdx = cardImageIndices[projectId] || 0;
  currentIdx = (currentIdx + step + total) % total;
  cardImageIndices[projectId] = currentIdx;

  updateCardImageDOM(projectId, project.images, currentIdx);
};

window.setCardImage = function(projectId, index, event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  const project = allProjects.find(p => String(p.id_projek) === String(projectId));
  if (!project || !project.images || index < 0 || index >= project.images.length) return;

  cardImageIndices[projectId] = index;
  updateCardImageDOM(projectId, project.images, index);
};

function updateCardImageDOM(projectId, images, activeIdx) {
  const imgEl = document.getElementById(`projectImg-${projectId}`);
  const counterEl = document.getElementById(`imgCounter-${projectId}`);
  const dotsContainer = document.getElementById(`imgDots-${projectId}`);

  if (imgEl) {
    imgEl.style.opacity = "0.4";
    setTimeout(() => {
      imgEl.src = images[activeIdx];
      imgEl.style.opacity = "1";
    }, 150);
  }

  if (counterEl) {
    counterEl.innerHTML = `<i class="fas fa-images"></i> <span class="cur-idx">${activeIdx + 1}</span>/<span class="total-idx">${images.length}</span>`;
  }

  if (dotsContainer) {
    const dots = dotsContainer.querySelectorAll(".card-dot");
    dots.forEach((dot, idx) => {
      dot.classList.toggle("active", idx === activeIdx);
    });
  }
}

// ── PROJECT IMAGE FULLSCREEN LIGHTBOX ──
window.openLightbox = function(projectId) {
  const project = allProjects.find(p => String(p.id_projek) === String(projectId));
  if (!project) return;

  const images = project.images && project.images.length > 0 ? project.images : (project.gambar ? [project.gambar] : []);
  if (images.length === 0) return;

  const currentIdx = cardImageIndices[projectId] || 0;
  const activeImgSrc = images[currentIdx] || images[0];

  const modal = document.getElementById("lightboxModal");
  const modalImg = document.getElementById("lightboxImg");
  const modalCaption = document.getElementById("lightboxCaption");

  if (modal && modalImg) {
    modalImg.src = activeImgSrc;
    if (modalCaption) {
      modalCaption.innerHTML = `<strong>${project.title}</strong> — <span style="color: var(--gold);">${project.tag || 'Project Preview'}</span> (${currentIdx + 1}/${images.length})`;
    }
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
};

window.closeLightbox = function(event) {
  if (event && event.target && event.target.tagName === "IMG") {
    return; // Don't close if clicking directly on the image
  }
  const modal = document.getElementById("lightboxModal");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
};

// Close lightbox on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeLightbox();
  }
});

// ── CATEGORY FILTERING & VIEW SWITCHER ──
const GRID_INITIAL_LIMIT = 6;
let isGridExpanded = false;
let activeCategoryFilter = "all";
let currentViewMode = localStorage.getItem("fdlann_project_view_mode") || "grid";
let activeCoverflowIndex = 0;
let currentDisplayProjects = [];

window.setProjectViewMode = function(mode) {
  currentViewMode = mode;
  isGridExpanded = false;
  try {
    localStorage.setItem("fdlann_project_view_mode", mode);
  } catch (e) {
    console.warn("Could not save view mode:", e);
  }

  const btnGrid = document.getElementById("btnViewGrid");
  const btn3d = document.getElementById("btnView3d");
  if (btnGrid) btnGrid.classList.toggle("active", mode === "grid");
  if (btn3d) btn3d.classList.toggle("active", mode === "3d");

  applyCombinedProjectFilter();
};

window.filterByCategory = function(category, btnElement) {
  activeCategoryFilter = category;
  isGridExpanded = false;

  // Update button active states
  const allTabs = document.querySelectorAll(".cat-tab");
  allTabs.forEach(tab => tab.classList.remove("active"));
  if (btnElement) {
    btnElement.classList.add("active");
  }

  activeCoverflowIndex = 0;
  applyCombinedProjectFilter();
};

function applyCombinedProjectFilter() {
  const searchInput = document.getElementById("repoSearch");
  const query = searchInput ? searchInput.value.toLowerCase().trim() : "";

  let filtered = allProjects;

  // 1. Filter by category
  if (activeCategoryFilter !== "all") {
    filtered = filtered.filter(item => {
      const cat = (item.kategori || "").toLowerCase();
      const targetCat = activeCategoryFilter.toLowerCase();
      return cat === targetCat || (item.tag && item.tag.toLowerCase().includes(targetCat));
    });
  }

  // 2. Filter by search query
  if (query) {
    filtered = filtered.filter(item => {
      const titleMatch = (item.title || "").toLowerCase().includes(query);
      const descMatch = (item.deskripsi || "").toLowerCase().includes(query);
      const catMatch = (item.kategori || "").toLowerCase().includes(query);
      const tagMatch = (item.tag || "").toLowerCase().includes(query);
      const techMatch = Array.isArray(item.tech) && item.tech.some(t => t.toLowerCase().includes(query));
      return titleMatch || descMatch || catMatch || tagMatch || techMatch;
    });
  }

  renderProjectCards(filtered);
}

function filterRepos() {
  activeCoverflowIndex = 0;
  isGridExpanded = false;
  applyCombinedProjectFilter();
}

window.toggleLoadMoreProjects = function() {
  isGridExpanded = !isGridExpanded;
  renderProjectCards(currentDisplayProjects);

  // If collapsing back, smoothly scroll to top of works section
  if (!isGridExpanded) {
    const worksSection = document.getElementById("works");
    if (worksSection) {
      worksSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
};

// ── REUSABLE CARD INNER GENERATOR ──
function generateCardInner(item) {
  const isSoon = item.isComingSoon || item.tag === "Coming Soon";
  const techPills = (item.tech || [])
    .map(t => `<span class="project-tech-pill">${t}</span>`)
    .join("");

  const localizedDesc = (currentLang === "en" && item.deskripsi_en)
    ? item.deskripsi_en
    : (item.deskripsi || "");

  if (isSoon) {
    return `
      <div class="coming-soon-banner">
        <span class="project-badge-tag badge-coming-soon">
          <span class="pulse-beacon"></span> Next Project
        </span>
        <div class="coming-soon-icon-wrap">
          <i class="fas fa-rocket"></i>
        </div>
        <span class="coming-soon-title-preview">Cooking in Progress...</span>
      </div>

      <div class="project-content">
        <h3 class="project-title">
          <span>${item.title || "Secret Project 🚀"}</span>
          <i class="fas fa-sparkles text-gold" style="font-size: 0.95rem;"></i>
        </h3>
        <p class="project-desc">${localizedDesc || "Projek seru selanjutnya sedang dalam pengembangan. Stay tuned!"}</p>
        
        <div class="project-tech-pills">
          ${techPills}
        </div>

        <div class="project-footer">
          <span class="project-soon-btn">
            <span class="pulse-beacon"></span> Stay Tuned ✨
          </span>
          <span class="project-sub-link">
            <i class="fas fa-lock"></i> Top Secret
          </span>
        </div>
      </div>
    `;
  }

  // Determine Action Buttons & Secondary Link
  const hasPdfDoc = Boolean(item.pdfDoc);
  const isGithub = item.link && item.link.includes("github.com");
  const isExpired = (!item.link && !hasPdfDoc) || item.isExpired || item.link === "#";

  let actionButtonHTML = "";
  let subLinkHTML = "";

  if (hasPdfDoc) {
    const safeTitle = (item.title || "SDD Document").replace(/'/g, "\\'");
    actionButtonHTML = `
      <button type="button" class="project-pdf-btn" onclick="openModal('${item.pdfDoc}', '${safeTitle}'); event.stopPropagation();" title="${currentLang === "id" ? "Baca Dokumen SDD Lengkap (PDF)" : "Preview Full SDD Document (PDF)"}">
        <i class="fas fa-file-pdf"></i>
        <span>${currentLang === "id" ? "Lihat SDD (PDF)" : "View SDD (PDF)"}</span>
      </button>
    `;
    subLinkHTML = `
      <a href="${item.pdfDoc}" download class="project-sub-link" onclick="event.stopPropagation();" title="${currentLang === "id" ? "Unduh Dokumen Rancangan (PDF)" : "Download SDD PDF"}">
        <i class="fas fa-download"></i> ${currentLang === "id" ? "Unduh SDD" : "Download"}
      </a>
    `;
  } else if (isExpired) {
    actionButtonHTML = `
      <span class="project-archived-btn" title="Deployment server expired / Projek masa kuliah">
        <i class="fas fa-history"></i> ${currentLang === "id" ? "Demo Berakhir" : "Demo Expired"}
      </span>
    `;
    subLinkHTML = `
      <span class="project-sub-link" style="opacity: 0.75;" title="Karya Penulisan Ilmiah / Masa Kuliah">
        <i class="fas fa-graduation-cap"></i> College Work
      </span>
    `;
  } else if (isGithub) {
    actionButtonHTML = `
      <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="project-github-btn">
        <i class="fab fa-github"></i>
        <span>Repository</span>
      </a>
    `;
    subLinkHTML = `
      <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="project-sub-link" title="Open GitHub Repository">
        <i class="fas fa-code-branch"></i> Source Code
      </a>
    `;
  } else {
    actionButtonHTML = `
      <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="project-live-btn">
        <span>Live Demo</span>
        <i class="fas fa-external-link-alt"></i>
      </a>
    `;
    subLinkHTML = `
      <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="project-sub-link" title="Visit Live Application">
        <i class="fas fa-globe"></i> Visit Web
      </a>
    `;
  }

  const caseStudyBtnHTML = item.caseStudy ? `
    <button type="button" class="project-cs-btn" onclick="openCaseStudyModal('${item.id_projek}', event)" title="${currentLang === "id" ? "Lihat Analisis Sistem & Studi Kasus" : "View System Analysis & Case Study"}">
      <i class="fas fa-sitemap"></i>
      <span>${currentLang === "id" ? "Detail Sistem" : "Case Study"}</span>
    </button>
  ` : "";

  // Image & Slider Controls
  const images = item.images && item.images.length > 0 ? item.images : (item.gambar ? [item.gambar] : []);
  const initialImg = images.length > 0 ? images[0] : "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600";
  const hasMultipleImages = images.length > 1;
  const currentIdx = cardImageIndices[item.id_projek] || 0;

  let sliderControlsHTML = "";
  if (hasMultipleImages) {
    const dotsHTML = images
      .map((_, idx) => `<span class="card-dot ${idx === currentIdx ? 'active' : ''}" onclick="setCardImage('${item.id_projek}', ${idx}, event)"></span>`)
      .join("");

    sliderControlsHTML = `
      <button class="card-img-btn card-img-prev" onclick="slideCardImage('${item.id_projek}', -1, event)" aria-label="Foto Sebelumnya" title="Foto Sebelumnya">
        <i class="fas fa-chevron-left"></i>
      </button>
      <button class="card-img-btn card-img-next" onclick="slideCardImage('${item.id_projek}', 1, event)" aria-label="Foto Selanjutnya" title="Foto Selanjutnya">
        <i class="fas fa-chevron-right"></i>
      </button>
      <div class="card-img-counter" id="imgCounter-${item.id_projek}">
        <i class="fas fa-images"></i> <span class="cur-idx">${currentIdx + 1}</span>/<span class="total-idx">${images.length}</span>
      </div>
      <div class="card-img-dots" id="imgDots-${item.id_projek}">
        ${dotsHTML}
      </div>
    `;
  }

  // Badge configuration
  const isAcademic = (item.kategori && item.kategori.toLowerCase() === "academic") || item.tag === "College Project";
  const badgeClass = isAcademic ? "badge-academic" : "badge-personal";
  const badgeIcon = isAcademic ? "fa-graduation-cap" : "fa-user-astronaut";
  const badgeLabel = item.kategori ? item.kategori : (isAcademic ? "Academic" : "Personal");

  return `
    <div class="project-img-wrapper" onclick="openLightbox('${item.id_projek}')" title="${currentLang === "id" ? "Klik untuk memperbesar gambar" : "Click to enlarge image"}">
      <span class="project-badge-tag ${badgeClass}">
        <i class="fas ${badgeIcon}"></i> ${badgeLabel} • ${item.tag || "Project"}
      </span>
      <span class="project-zoom-hint">
        <i class="fas fa-search-plus"></i> ${currentLang === "id" ? "Perbesar" : "Zoom"}
      </span>
      <img 
        id="projectImg-${item.id_projek}"
        src="${initialImg}" 
        alt="${item.title}" 
        class="project-img" 
        loading="lazy"
        onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80';"
      />
      <div class="project-img-overlay"></div>
      ${sliderControlsHTML}
    </div>

    <div class="project-content">
      <h3 class="project-title">
        <span>${item.title}</span>
      </h3>
      <p class="project-desc">${localizedDesc}</p>
      
      <div class="project-tech-pills">
        ${techPills}
      </div>

      <div class="project-footer">
        <div class="project-actions-left">
          ${actionButtonHTML}
          ${caseStudyBtnHTML}
        </div>
        ${subLinkHTML}
      </div>
    </div>
  `;
}

// ── PROJECT CASE STUDY & SYSTEM ARCHITECTURE MODAL ──
window.openCaseStudyModal = function(projectId, event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  const project = allProjects.find(p => String(p.id_projek) === String(projectId));
  if (!project || !project.caseStudy) return;

  const cs = project.caseStudy;
  const isId = currentLang === "id";
  const modal = document.getElementById("caseStudyModal");
  const titleEl = document.getElementById("csTitle");
  const badgeEl = document.getElementById("csBadge");
  const bodyEl = document.getElementById("csModalBody");
  const footEl = document.getElementById("csModalFoot");

  if (!modal || !bodyEl) return;

  if (titleEl) titleEl.textContent = project.title;
  if (badgeEl) {
    badgeEl.textContent = isId
      ? `${project.kategori || "Projek"} • Analisis Sistem & Studi Kasus`
      : `${project.kategori || "Project"} • System Analysis & Case Study`;
  }

  const problemText = isId ? (cs.problem_id || cs.problem_en) : (cs.problem_en || cs.problem_id);
  const featuresList = isId ? (cs.features_id || cs.features_en || []) : (cs.features_en || cs.features_id || []);

  const featuresHTML = featuresList
    .map(f => `<li><i class="fas fa-check-circle"></i> <span>${f}</span></li>`)
    .join("");

  const archStepsHTML = (cs.architecture || [])
    .map((step, idx, arr) => `
      <span class="cs-arch-step">${step}</span>
      ${idx < arr.length - 1 ? '<i class="fas fa-arrow-right cs-arch-arrow"></i>' : ''}
    `)
    .join("");

  const techBadges = (project.tech || [])
    .map(t => `<span class="project-tech-pill">${t}</span>`)
    .join("");

  bodyEl.innerHTML = `
    <div class="cs-role-banner">
      <div class="cs-role-item">
        <strong><i class="fas fa-user-cog"></i> ${isId ? "Peran:" : "Role:"}</strong> ${cs.role || "Full-Stack Developer & System Analyst"}
      </div>
      <div class="cs-role-item">
        <strong><i class="fas fa-tag"></i> ${isId ? "Kategori:" : "Category:"}</strong> ${project.tag || "Web Application"}
      </div>
    </div>

    <div class="cs-section">
      <h6><i class="fas fa-bullseye"></i> ${isId ? "Latar Belakang Masalah (Problem Statement)" : "Problem Statement & Business Need"}</h6>
      <p>${problemText}</p>
    </div>

    <div class="cs-section">
      <h6><i class="fas fa-star"></i> ${isId ? "Fitur Utama & Solusi Sistem" : "Key Features & Solution"}</h6>
      <ul class="cs-feature-list">
        ${featuresHTML}
      </ul>
    </div>

    <div class="cs-section">
      <h6><i class="fas fa-project-diagram"></i> ${isId ? "Arsitektur Sistem & Skema Relasi Data (ERD)" : "System Architecture & Database Schema (ERD)"}</h6>
      <div class="cs-arch-flow">
        ${archStepsHTML}
      </div>
      ${cs.dbEntities ? `
        <div class="cs-db-box">
          <i class="fas fa-database"></i>
          <strong>${isId ? "Relasi Entitas:" : "Entity Flow:"}</strong>
          <span>${cs.dbEntities}</span>
        </div>
      ` : ""}
    </div>

    <div class="cs-section">
      <h6><i class="fas fa-code"></i> ${isId ? "Teknologi & Metodologi" : "Tech Stack & Methodology"}</h6>
      <div class="project-tech-pills" style="margin-bottom:0;">
        ${techBadges}
      </div>
    </div>
  `;

  if (footEl) {
    const hasLink = project.link && project.link !== "#" && !project.isExpired;
    const isGithub = hasLink && project.link.includes("github.com");
    const safeTitle = (project.title || "SDD Document").replace(/'/g, "\\'");
    footEl.innerHTML = `
      <button type="button" class="btn btn-ghost" onclick="closeCaseStudyModal()">${isId ? "Tutup" : "Close"}</button>
      ${project.pdfDoc ? `
        <button type="button" class="btn btn-gold" onclick="closeCaseStudyModal(); openModal('${project.pdfDoc}', '${safeTitle}');">
          <i class="fas fa-file-pdf"></i>
          <span>${isId ? "Buka Dokumen SDD Lengkap (PDF)" : "Open Full SDD Document (PDF)"}</span>
        </button>
      ` : ""}
      ${hasLink ? `
        <a href="${project.link}" target="_blank" rel="noopener noreferrer" class="btn btn-gold">
          <i class="${isGithub ? 'fab fa-github' : 'fas fa-external-link-alt'}"></i>
          <span>${isGithub ? (isId ? "Buka Repository" : "Open Repository") : (isId ? "Buka Live Demo" : "Open Live Demo")}</span>
        </a>
      ` : ""}
    `;
  }

  modal.classList.add("open");
  document.body.style.overflow = "hidden";
};

window.closeCaseStudyModal = function(event) {
  if (event && event.target && event.target.id !== "caseStudyModal") return;
  const modal = document.getElementById("caseStudyModal");
  if (modal) {
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }
};

// ── PROJECT RENDERER (GRID VS 3D COVERFLOW) ──
function renderProjectCards(projects) {
  currentDisplayProjects = projects || [];
  const container = document.getElementById("githubProjects") || document.getElementById("worksGrid");
  const loadMoreWrapper = document.getElementById("worksLoadMoreWrapper");
  const loadMoreIcon = document.getElementById("loadMoreIcon");
  const loadMoreText = document.getElementById("loadMoreText");
  if (!container) return;

  // Update tab counts & active buttons
  updateCategoryTabCounts();
  const btnGrid = document.getElementById("btnViewGrid");
  const btn3d = document.getElementById("btnView3d");
  if (btnGrid) btnGrid.classList.toggle("active", currentViewMode === "grid");
  if (btn3d) btn3d.classList.toggle("active", currentViewMode === "3d");

  // Empty state
  if (!projects || projects.length === 0) {
    if (loadMoreWrapper) loadMoreWrapper.style.display = "none";
    container.className = "works-grid";
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3.5rem 1rem; color: var(--muted);">
        <i class="fas fa-search" style="font-size: 2.2rem; margin-bottom: 1rem; color: var(--gold); display: block;"></i>
        <p style="font-size: 1.15rem; font-weight: 700; color: var(--white); margin-bottom: 0.5rem;">${currentLang === "id" ? "Tidak ada projek yang cocok" : "No matching projects found"}</p>
        <p style="font-size: 0.9rem; margin-bottom: 1.5rem;">${currentLang === "id" ? "Coba cari dengan kata kunci teknologi lain atau ganti filter kategori." : "Try searching with another technology keyword or switch category filters."}</p>
        <button onclick="filterByCategory('all', document.querySelector('.cat-tab[data-cat=all]'))" class="btn btn-outline-gold btn-sm">
          <i class="fas fa-redo"></i> Reset Filter
        </button>
      </div>
    `;
    return;
  }

  // 3D Coverflow Mode
  if (currentViewMode === "3d") {
    if (loadMoreWrapper) loadMoreWrapper.style.display = "none";
    render3DCoverflow(projects);
    return;
  }

  // Standard Grid Mode
  container.className = "works-grid";
  const shouldLimit = projects.length > GRID_INITIAL_LIMIT;
  const visibleProjects = (shouldLimit && !isGridExpanded)
    ? projects.slice(0, GRID_INITIAL_LIMIT)
    : projects;

  const html = visibleProjects.map(item => `
    <div class="project-card fade-in" data-tilt>
      ${generateCardInner(item)}
    </div>
  `).join("");

  container.innerHTML = html;

  // Update Load More Button State
  if (loadMoreWrapper) {
    if (shouldLimit) {
      loadMoreWrapper.style.display = "flex";
      if (isGridExpanded) {
        if (loadMoreIcon) loadMoreIcon.className = "fas fa-chevron-up";
        if (loadMoreText) loadMoreText.textContent = currentLang === "id" ? "Tampilkan Lebih Sedikit" : "Show Less Projects";
      } else {
        const remainingCount = projects.length - GRID_INITIAL_LIMIT;
        if (loadMoreIcon) loadMoreIcon.className = "fas fa-plus-circle";
        if (loadMoreText) {
          loadMoreText.textContent = currentLang === "id"
            ? `Muat Lebih Banyak (${remainingCount} Projek Lagi)`
            : `Load More (${remainingCount} More Project${remainingCount > 1 ? 's' : ''})`;
        }
      }
    } else {
      loadMoreWrapper.style.display = "none";
    }
  }

  // Re-observe animations & 3D tilt
  if (typeof fadeObserver !== "undefined") {
    document.querySelectorAll(".fade-in").forEach(el => fadeObserver.observe(el));
  }
  attachTiltEffect();
}

// ── 3D COVERFLOW ENGINE ──
function render3DCoverflow(projects) {
  const container = document.getElementById("githubProjects") || document.getElementById("worksGrid");
  if (!container) return;

  container.className = "coverflow-wrapper-full";

  if (activeCoverflowIndex >= projects.length) {
    activeCoverflowIndex = Math.max(0, projects.length - 1);
  }

  const itemsHTML = projects.map((item, idx) => {
    return `
      <div class="coverflow-item" id="cfItem-${idx}" onclick="handleCoverflowItemClick(${idx})">
        <div class="project-card">
          ${generateCardInner(item)}
        </div>
      </div>
    `;
  }).join("");

  const dotsHTML = projects.map((_, idx) => `
    <span class="coverflow-dot ${idx === activeCoverflowIndex ? 'active' : ''}" onclick="setCoverflowIndex(${idx})" title="Lihat Projek ${idx + 1}"></span>
  `).join("");

  const stageHTML = `
    <div class="coverflow-stage" id="coverflowStage">
      <button class="coverflow-nav-btn coverflow-nav-prev" onclick="navCoverflow(-1)" aria-label="Previous Project" title="Projek Sebelumnya">
        <i class="fas fa-chevron-left"></i>
      </button>
      
      <div class="coverflow-track" id="coverflowTrack">
        ${itemsHTML}
      </div>

      <button class="coverflow-nav-btn coverflow-nav-next" onclick="navCoverflow(1)" aria-label="Next Project" title="Projek Selanjutnya">
        <i class="fas fa-chevron-right"></i>
      </button>

      <div class="coverflow-controls">
        <div class="coverflow-pagination" id="cfPagination">
          ${dotsHTML}
        </div>
        <div class="coverflow-badge-info">
          <span class="badge-counter" id="cfBadgeCounter">
            <i class="fas fa-cube"></i> Projek ${activeCoverflowIndex + 1} dari ${projects.length}
          </span>
          <span class="badge-hint">
            <i class="fas fa-arrows-alt-h"></i> Geser / Klik kartu untuk navigasi
          </span>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = stageHTML;
  updateCoverflowPositions();
  bindCoverflowGestures();
}

function updateCoverflowPositions() {
  const total = currentDisplayProjects.length;
  if (total === 0) return;

  for (let i = 0; i < total; i++) {
    const el = document.getElementById(`cfItem-${i}`);
    if (!el) continue;

    el.classList.remove(
      "is-active",
      "is-left-1",
      "is-left-2",
      "is-left-3",
      "is-right-1",
      "is-right-2",
      "is-right-3",
      "is-hidden"
    );

    const diff = i - activeCoverflowIndex;

    if (diff === 0) {
      el.classList.add("is-active");
    } else if (diff === -1) {
      el.classList.add("is-left-1");
    } else if (diff === -2) {
      el.classList.add("is-left-2");
    } else if (diff <= -3) {
      el.classList.add("is-left-3", "is-hidden");
    } else if (diff === 1) {
      el.classList.add("is-right-1");
    } else if (diff === 2) {
      el.classList.add("is-right-2");
    } else if (diff >= 3) {
      el.classList.add("is-right-3", "is-hidden");
    }
  }

  // Update dots
  const dotsContainer = document.getElementById("cfPagination");
  if (dotsContainer) {
    const dots = dotsContainer.querySelectorAll(".coverflow-dot");
    dots.forEach((dot, idx) => {
      dot.classList.toggle("active", idx === activeCoverflowIndex);
    });
  }

  // Update counter badge
  const badgeCounter = document.getElementById("cfBadgeCounter");
  if (badgeCounter) {
    badgeCounter.innerHTML = `<i class="fas fa-cube"></i> Projek ${activeCoverflowIndex + 1} dari ${total}`;
  }
}

window.navCoverflow = function(step) {
  if (!currentDisplayProjects || currentDisplayProjects.length === 0) return;
  const total = currentDisplayProjects.length;
  activeCoverflowIndex = (activeCoverflowIndex + step + total) % total;
  updateCoverflowPositions();
};

window.setCoverflowIndex = function(index) {
  if (index < 0 || index >= currentDisplayProjects.length) return;
  activeCoverflowIndex = index;
  updateCoverflowPositions();
};

window.handleCoverflowItemClick = function(index) {
  if (index !== activeCoverflowIndex) {
    setCoverflowIndex(index);
  }
};

// ── TOUCH SWIPE & MOUSE DRAG GESTURES FOR COVERFLOW ──
function bindCoverflowGestures() {
  const stage = document.getElementById("coverflowStage");
  if (!stage) return;

  let startX = 0;
  let endX = 0;
  let isDragging = false;

  stage.addEventListener("touchstart", (e) => {
    startX = e.changedTouches[0].screenX;
  }, { passive: true });

  stage.addEventListener("touchend", (e) => {
    endX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  stage.addEventListener("mousedown", (e) => {
    // Avoid triggering drag on interactive buttons/links
    if (e.target.closest("button") || e.target.closest("a") || e.target.closest(".card-dot")) return;
    startX = e.screenX;
    isDragging = true;
  });

  stage.addEventListener("mouseup", (e) => {
    if (!isDragging) return;
    isDragging = false;
    endX = e.screenX;
    handleSwipe();
  });

  stage.addEventListener("mouseleave", () => {
    isDragging = false;
  });

  function handleSwipe() {
    const threshold = 40;
    const diff = endX - startX;
    if (Math.abs(diff) > threshold) {
      if (diff < 0) {
        navCoverflow(1); // Swipe left -> Next
      } else {
        navCoverflow(-1); // Swipe right -> Prev
      }
    }
  }
}

// Global keyboard arrow controls for 3D Coverflow
document.addEventListener("keydown", (e) => {
  if (currentViewMode !== "3d") return;
  
  // Ignore if user is currently typing in an input or textarea
  if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;
  
  // Ignore if modal is open
  const modal = document.getElementById("modal");
  const lightbox = document.getElementById("lightboxModal");
  if ((modal && modal.classList.contains("open")) || (lightbox && lightbox.classList.contains("active"))) return;

  if (e.key === "ArrowLeft") {
    navCoverflow(-1);
  } else if (e.key === "ArrowRight") {
    navCoverflow(1);
  }
});

function attachTiltEffect() {
  const tiltCards = document.querySelectorAll("[data-tilt]");
  tiltCards.forEach((card) => {
    card.onmousemove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 12;
      const rotateY = (centerX - x) / 12;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    };
    card.onmouseleave = () => {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    };
  });
}

// Load projects & language when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  setLanguage(currentLang);
  loadProjects();
});

// ── LIVE GOOGLE SHEETS MUSIC PLAYER ENGINE ──
const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS4zPi5MZ7AMzcWLqthWALBXNcF9O687hLaYOf25OFXTJ1-xL7QofjHczxI-Z9F_mS1FaAoJ0ZxrU6D/pub?gid=0&single=true&output=csv";

// Audio Instance & State
const audio = new Audio();
let playlist = [];
let currentTrackIndex = 0;
let isMuted = false;

// DOM Elements
const playerWidget = document.getElementById("musicPlayerWidget");
const playerToggle = document.getElementById("playerToggle");
const playerCover = document.getElementById("playerCover");
const playerTitle = document.getElementById("playerTitle");
const playerArtist = document.getElementById("playerArtist");
const playBtn = document.getElementById("playBtn");
const playIcon = document.getElementById("playIcon");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const muteBtn = document.getElementById("muteBtn");
const muteIcon = document.getElementById("muteIcon");
const progressBarBg = document.getElementById("progressBarBg");
const progressBarFill = document.getElementById("progressBarFill");
const currentTimeEl = document.getElementById("currentTime");
const totalTimeEl = document.getElementById("totalTime");
const equalizer = document.getElementById("equalizer");

// Toggle player collapsed / expanded view
if (playerToggle && playerWidget) {
  playerToggle.addEventListener("click", () => {
    playerWidget.classList.toggle("collapsed");
  });
}

// Fetch Google Sheets Playlist (NO autoplay - only loads metadata & waits for user play)
async function fetchMusicPlaylist() {
  try {
    const response = await fetch(SHEET_CSV_URL);
    if (!response.ok) throw new Error("Spreadsheet response not ok");
    const csvData = await response.text();

    const parsedTracks = parseMusicCSV(csvData);
    if (parsedTracks.length > 0) {
      playlist = parsedTracks;
    } else {
      loadFallbackPlaylist();
    }
  } catch (error) {
    console.warn("Using fallback music playlist due to sheet fetch issue:", error);
    loadFallbackPlaylist();
  }

  if (playlist.length > 0) {
    loadTrack(0); // Prepare track details without autoplaying
  }
}

// Parse CSV Rows manually
function parseMusicCSV(csvText) {
  const lines = csvText.split(/\r?\n/);
  if (lines.length < 2) return [];

  // Headers title,artist,audio_url,cover_url
  const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
  const titleIdx = headers.indexOf("title");
  const artistIdx = headers.indexOf("artist");
  const audioIdx = headers.indexOf("audio_url");
  const coverIdx = headers.indexOf("cover_url");

  const tracks = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const cells = splitCSVLine(line);
    if (cells.length < 3) continue;

    const track = {
      title: cells[titleIdx]?.trim() || "Untitled",
      artist: cells[artistIdx]?.trim() || "Unknown Artist",
      audio: cells[audioIdx]?.trim() || "",
      cover: cells[coverIdx]?.trim() || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=120"
    };

    if (track.audio) {
      tracks.push(track);
    }
  }
  return tracks;
}

// Split CSV line handling potential quotes
function splitCSVLine(line) {
  const result = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

// Fallback music playlist
function loadFallbackPlaylist() {
  playlist = [
    {
      title: "Neu Roses",
      artist: "Daniel Caesar",
      audio: "music/Neu-Roses-Transgressor-s-Song.mp3",
      cover: "https://i.pinimg.com/736x/d2/5e/67/d25e67e31e0064debddff70c555d0002.jpg"
    }
  ];
}

// Load track index
function loadTrack(index) {
  currentTrackIndex = index;
  const track = playlist[currentTrackIndex];

  if (playerTitle) playerTitle.textContent = track.title;
  if (playerArtist) playerArtist.textContent = track.artist;
  if (playerCover) playerCover.src = track.cover;
  audio.src = track.audio;
  audio.load();
}

// Audio controls
function playTrack() {
  audio.play().then(() => {
    playerWidget.classList.add("playing");
    if (playIcon) {
      playIcon.className = "fas fa-pause";
    }
  }).catch(err => {
    console.error("Audio playback error:", err);
    playerWidget.classList.remove("playing");
    if (playIcon) {
      playIcon.className = "fas fa-play";
    }

    if (err.name === "NotAllowedError") {
      showToast("Click the Play button to start audio.", "fas fa-play");
    } else {
      const errCode = audio.error ? ` (Code: ${audio.error.code})` : "";
      showToast(`Failed to load audio${errCode}. Verify link in Google Sheets.`, "fas fa-exclamation-triangle");
    }
  });
}

function pauseTrack() {
  audio.pause();
  playerWidget.classList.remove("playing");
  if (playIcon) {
    playIcon.className = "fas fa-play";
  }
}

function togglePlay() {
  if (audio.paused) {
    playTrack();
  } else {
    pauseTrack();
  }
}

function nextTrack() {
  let nextIdx = currentTrackIndex + 1;
  if (nextIdx >= playlist.length) {
    nextIdx = 0;
  }
  loadTrack(nextIdx);
  playTrack();
  showToast(`Playing: ${playlist[nextIdx].title}`);
}

function prevTrack() {
  let prevIdx = currentTrackIndex - 1;
  if (prevIdx < 0) {
    prevIdx = playlist.length - 1;
  }
  loadTrack(prevIdx);
  playTrack();
  showToast(`Playing: ${playlist[prevIdx].title}`);
}

function toggleMute() {
  isMuted = !isMuted;
  audio.muted = isMuted;
  if (muteIcon) {
    muteIcon.className = isMuted ? "fas fa-volume-mute" : "fas fa-volume-up";
  }
}

// Event Listeners
if (playBtn) playBtn.addEventListener("click", togglePlay);
if (prevBtn) prevBtn.addEventListener("click", prevTrack);
if (nextBtn) nextBtn.addEventListener("click", nextTrack);
if (muteBtn) muteBtn.addEventListener("click", toggleMute);

// Auto-advance when track ends
audio.addEventListener("ended", nextTrack);

// Update progress bar & duration timestamps
audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    const pct = (audio.currentTime / audio.duration) * 100;
    if (progressBarFill) progressBarFill.style.width = `${pct}%`;

    if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
    if (totalTimeEl) totalTimeEl.textContent = formatTime(audio.duration);
  }
});

// Click on progress bar to seek track position
if (progressBarBg) {
  progressBarBg.addEventListener("click", (e) => {
    const width = progressBarBg.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;

    if (duration) {
      audio.currentTime = (clickX / width) * duration;
    }
  });
}

function formatTime(secs) {
  const minutes = Math.floor(secs / 60);
  const seconds = Math.floor(secs % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

// ── LIVE VISITOR COUNTER ENGINE ──
async function initVisitorCounter() {
  const visitorCountEl = document.getElementById("visitorCount");
  if (!visitorCountEl) return;

  const STORAGE_KEY = "fdlann_portfolio_visits";
  const BASE_VISITS = 1240; // baseline aesthetic counter

  let localVisits = parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10);
  if (!sessionStorage.getItem("visited_this_session")) {
    localVisits += 1;
    localStorage.setItem(STORAGE_KEY, localVisits);
    sessionStorage.setItem("visited_this_session", "true");
  }

  try {
    const response = await fetch("https://api.counterapi.dev/v1/fdlann-portfolio/visits/up");
    if (response.ok) {
      const data = await response.json();
      if (data && typeof data.count === "number") {
        animateCounter(visitorCountEl, BASE_VISITS + data.count);
        return;
      }
    }
  } catch (err) {
    console.info("Using local visitor count:", err.message);
  }

  animateCounter(visitorCountEl, BASE_VISITS + localVisits);
}

function animateCounter(element, target) {
  const start = Math.max(0, target - 45);
  const duration = 1200;
  const startTime = performance.now();

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(start + (target - start) * easeProgress);

    element.textContent = current.toLocaleString("id-ID");

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target.toLocaleString("id-ID");
    }
  }

  requestAnimationFrame(update);
}

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  fetchMusicPlaylist();
  initVisitorCounter();
});


