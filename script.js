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

// ── GITHUB REPOSITORIES FETCH & FILTER ──
let allRepos = [];

async function loadGithubProjects() {
  const githubUsername = "FdLann";
  const container = document.getElementById("githubProjects");

  try {
    const response = await fetch(
      `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=5`
    );

    if (!response.ok) throw new Error("GitHub API response not ok");

    const repos = await response.json();

    if (!Array.isArray(repos) || repos.length === 0) {
      renderFallbackProjects(container);
      return;
    }

    // Exclude portfolio repo itself
    allRepos = repos.filter(
      (repo) => repo.name !== "Portfolio_MuhamadFadlan"
    );

    renderRepoCards(allRepos);

  } catch (error) {
    console.warn("Using fallback portfolio project list due to API limit/error:", error);
    renderFallbackProjects(container);
  }
}

function renderRepoCards(repos) {
  const container = document.getElementById("githubProjects");
  if (!container) return;

  if (repos.length === 0) {
    container.innerHTML = `<p style="color: var(--muted); grid-column: 1 / -1; text-align: center; padding: 2rem;">No matching projects found.</p>`;
    return;
  }

  const projectsHTML = repos
    .map(
      (repo) => `
    <div class="repo-card fade-in" data-tilt>
      <div class="repo-header">
        <i class="fas fa-folder"></i>
        <a href="${repo.html_url}" target="_blank" class="repo-name">${repo.name}</a>
      </div>
      <p class="repo-desc">${repo.description || "Interactive web project & code repository built with clean architecture."}</p>
      <div class="repo-footer">
        ${repo.language ? `<span class="repo-lang"><i class="fas fa-circle"></i> ${repo.language}</span>` : `<span class="repo-lang"><i class="fas fa-code"></i> Web System</span>`}
        <span class="repo-stars"><i class="fas fa-star"></i> ${repo.stargazers_count || 0}</span>
        <a href="${repo.html_url}" target="_blank" style="margin-left: auto; color: var(--gold); font-size: 0.9rem;" title="View Code">
          <i class="fas fa-external-link-alt"></i>
        </a>
      </div>
    </div>
  `
    )
    .join("");

  container.innerHTML = projectsHTML;

  // Re-observe fade-in and re-apply tilt
  document.querySelectorAll(".fade-in").forEach((el) => {
    fadeObserver.observe(el);
  });
}

function filterRepos() {
  const searchInput = document.getElementById("repoSearch");
  if (!searchInput) return;
  const query = searchInput.value.toLowerCase().trim();

  const filtered = allRepos.filter((repo) => {
    const nameMatch = repo.name.toLowerCase().includes(query);
    const descMatch = (repo.description || "").toLowerCase().includes(query);
    const langMatch = (repo.language || "").toLowerCase().includes(query);
    return nameMatch || descMatch || langMatch;
  });

  renderRepoCards(filtered);
}

function renderFallbackProjects(container) {
  const fallbackData = [
    {
      name: "Product-Catalog-System",
      html_url: "https://github.com/FdLann",
      description: "E-Commerce product catalog system integrated with admin panel controls and automated WhatsApp ordering flow.",
      language: "PHP / MySQL",
      stargazers_count: 5
    },
    {
      name: "UI-UX-Design-Prototypes",
      html_url: "https://github.com/FdLann",
      description: "Interactive Figma prototypes and design systems focused on user-centered web applications.",
      language: "Figma / UIUX",
      stargazers_count: 3
    },
    {
      name: "Database-Management-Oracle",
      html_url: "https://github.com/FdLann",
      description: "Relational database schema designs, optimized SQL queries, and DBMS architecture implementations.",
      language: "SQL / Oracle",
      stargazers_count: 4
    }
  ];
  allRepos = fallbackData;
  renderRepoCards(fallbackData);
}

// Load GitHub projects when DOM is ready
document.addEventListener("DOMContentLoaded", loadGithubProjects);

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

// Fetch Google Sheets Playlist
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
    loadTrack(0);
    enableAutoplayOnInteraction();
  }
}

// Autoplay on first user interaction (click, touch, keydown)
function enableAutoplayOnInteraction() {
  const startPlay = () => {
    if (audio.paused) {
      playTrack();
    }
    // Clean up listeners
    document.removeEventListener("click", startPlay);
    document.removeEventListener("touchstart", startPlay);
    document.removeEventListener("keydown", startPlay);
  };

  document.addEventListener("click", startPlay);
  document.addEventListener("touchstart", startPlay, { passive: true });
  document.addEventListener("keydown", startPlay);
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

    // Distinguish between browser autoplay block and broken audio links
    if (err.name === "NotAllowedError") {
      showToast("Click anywhere on the page first to enable audio.", "fas fa-volume-mute");
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

