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

// ── COPY EMAIL TO CLIPBOARD ──
function copyEmail() {
  const email = "muhamadfadlan.fa@gmail.com";
  navigator.clipboard.writeText(email).then(() => {
    showToast("Email address copied to clipboard!");
  }).catch(() => {
    showToast("Failed to copy email.", "fas fa-exclamation-triangle");
  });
}

// ── DIRECT QUICK EMAIL CONTACT ──
function handleContactSubmit(event) {
  event.preventDefault();
  const name = document.getElementById("senderName").value;
  const subject = document.getElementById("senderSubject").value;
  const message = document.getElementById("senderMessage").value;

  const mailtoUrl = `mailto:muhamadfadlan.fa@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("Name: " + name + "\n\nMessage:\n" + message)}`;

  showToast("Opening default mail application...", "fas fa-paper-plane");
  setTimeout(() => {
    window.location.href = mailtoUrl;
  }, 800);
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
  if (e.key === "Escape") closeModal();
});

// ── PROJECTS SHOWCASE & FILTER (FROM DATA-PROJEK.JSON) ──
let allProjects = [];
const cardImageIndices = {};

const FALLBACK_PROJECTS = [
  {
    id_projek: "1",
    gambar: ["gambar/Projek1.png"],
    title: "Ultimate Football Manager",
    deskripsi: "Permainan strategi bola sepak yang mengasah kemampuan taktik dan manajemen tim sebagai manager secara interaktif.",
    link: "https://football-manager-idle.vercel.app/",
    kategori: "Personal",
    tag: "Web Game",
    tech: ["HTML5", "JavaScript", "CSS3", "Vercel", "Idle Game"]
  },
  {
    id_projek: "2",
    gambar: ["gambar/Projek2.png"],
    title: "EA FC Scouting Tool",
    deskripsi: "Sebuah web yang didedikasikan untuk membantu para pemain EA FC mencari dan menganalisis potensi pemain dengan lebih efektif.",
    link: "https://ea-fc24-scouting-tool.vercel.app/scouting",
    kategori: "Personal",
    tag: "Web App",
    tech: ["React", "Analytics Tool", "REST API", "Vercel"]
  },
  {
    id_projek: "3",
    gambar: ["gambar/Projek3.png"],
    title: "Galeri Foto & Komunitas Chat",
    deskripsi: "Sebuah web yang menyimpan galeri foto dan komunitas chat hasil karya penulisan ilmiah masa perkuliahan.",
    link: "",
    kategori: "Academic",
    tag: "College Project",
    tech: ["PHP", "HTML5", "CSS3", "MySQL", "phpMyAdmin", "JavaScript"],
    isExpired: true
  },
  {
    id_projek: "4",
    gambar: ["gambar/Projek4.png", "gambar/Projek4-a.png"],
    title: "Match Me - Outfit Matcher",
    deskripsi: "Sebuah web yang membantu mahasiswa/i untuk mencari rekomendasi kombinasi outfit yang serasi dan stylish.",
    link: "https://github.com/FdLann/Projek-MatchingBaju-PHP-NATIVE",
    kategori: "Academic",
    tag: "College Project",
    tech: ["PHP", "HTML5", "CSS3", "MySQL", "phpMyAdmin", "JavaScript"]
  },
  {
    id_projek: "5",
    gambar: [
      "gambar/Projek5-a.png",
      "gambar/Projek5-b.png",
      "gambar/Projek5-c.png"
    ],
    title: "Sistem Informasi Administrasi Akademik",
    deskripsi: "Web Sistem Informasi Administrasi Akademik adalah sebuah website yang dirancang untuk mengelola data penulisan dan pengajuan surat magang bagi mahasiswa fakultas ilmu komputer dan Teknologi Informasi.",
    link: "https://github.com/FdLann/sistem-administrasi-sistem-informasi",
    kategori: "Academic",
    tag: "College Project",
    tech: ["PHP", "HTML5", "CSS3", "MySQL", "phpMyAdmin", "JavaScript"]
  },
  {
    id_projek: "6",
    gambar: [
      "gambar/Projek6-a.png",
      "gambar/Projek6-b.png",
      "gambar/Projek6-c.png"
    ],
    title: "MedTrack - Portal Pasien",
    deskripsi: "Aplikasi web health-tech untuk membantu pasien melihat hasil pemeriksaan medis dan rekam kesehatan tanpa harus kembali ke rumah sakit.",
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
    ]
  },
  {
    id_projek: "7",
    gambar: [],
    title: "Secret Next Project 🚀",
    deskripsi: "Projek selanjutnya yang masih dalam tahap perancangan rahasia & riset inovatif. Masih misterius tapi bakal seru banget! Tunggu tanggal mainnya! 🤫✨",
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
          isExpired: Boolean(item.isExpired || (!item.link && !isComingSoon))
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

// ── CATEGORY FILTERING & SEARCH ──
let activeCategoryFilter = "all";

window.filterByCategory = function(category, btnElement) {
  activeCategoryFilter = category;

  // Update button active states
  const allTabs = document.querySelectorAll(".cat-tab");
  allTabs.forEach(tab => tab.classList.remove("active"));
  if (btnElement) {
    btnElement.classList.add("active");
  }

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
  applyCombinedProjectFilter();
}

function renderProjectCards(projects) {
  const container = document.getElementById("githubProjects") || document.getElementById("worksGrid");
  if (!container) return;

  // Update tab counts
  updateCategoryTabCounts();

  if (!projects || projects.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3.5rem 1rem; color: var(--muted);">
        <i class="fas fa-search" style="font-size: 2.2rem; margin-bottom: 1rem; color: var(--gold); display: block;"></i>
        <p style="font-size: 1.15rem; font-weight: 700; color: var(--white); margin-bottom: 0.5rem;">Tidak ada projek yang cocok</p>
        <p style="font-size: 0.9rem; margin-bottom: 1.5rem;">Coba cari dengan kata kunci teknologi lain atau ganti filter kategori.</p>
        <button onclick="filterByCategory('all', document.querySelector('.cat-tab[data-cat=all]'))" class="btn btn-outline-gold btn-sm">
          <i class="fas fa-redo"></i> Reset Filter
        </button>
      </div>
    `;
    return;
  }

  const html = projects.map(item => {
    const isSoon = item.isComingSoon || item.tag === "Coming Soon";
    const techPills = (item.tech || [])
      .map(t => `<span class="project-tech-pill">${t}</span>`)
      .join("");

    if (isSoon) {
      return `
        <div class="project-card fade-in" data-tilt>
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
            <p class="project-desc">${item.deskripsi || "Projek seru selanjutnya sedang dalam pengembangan. Stay tuned!"}</p>
            
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
        </div>
      `;
    }

    // Determine Action Buttons & Secondary Link
    const isGithub = item.link && item.link.includes("github.com");
    const isExpired = !item.link || item.isExpired || item.link === "#";

    let actionButtonHTML = "";
    let subLinkHTML = "";

    if (isExpired) {
      actionButtonHTML = `
        <span class="project-archived-btn" title="Deployment server expired / Projek masa kuliah">
          <i class="fas fa-history"></i> Demo Expired
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

    // Standard Project Card with Clickable Image for Lightbox
    return `
      <div class="project-card fade-in" data-tilt>
        <div class="project-img-wrapper" onclick="openLightbox('${item.id_projek}')" title="Klik untuk memperbesar gambar">
          <span class="project-badge-tag ${badgeClass}">
            <i class="fas ${badgeIcon}"></i> ${badgeLabel} • ${item.tag || "Project"}
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
          <p class="project-desc">${item.deskripsi}</p>
          
          <div class="project-tech-pills">
            ${techPills}
          </div>

          <div class="project-footer">
            ${actionButtonHTML}
            ${subLinkHTML}
          </div>
        </div>
      </div>
    `;
  }).join("");

  container.innerHTML = html;

  // Re-observe animations
  if (typeof fadeObserver !== "undefined") {
    document.querySelectorAll(".fade-in").forEach(el => fadeObserver.observe(el));
  }
}

// Load projects when DOM is ready
document.addEventListener("DOMContentLoaded", loadProjects);

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

// Load music on DOM ready
document.addEventListener("DOMContentLoaded", fetchMusicPlaylist);

