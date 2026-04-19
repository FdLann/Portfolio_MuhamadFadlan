// Navbar scroll
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 50);
  document.getElementById("btt").classList.toggle("show", window.scrollY > 300);
});

// Hamburger
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");
hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});
navLinks.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", () => navLinks.classList.remove("open"));
});

// Active nav link
const sections = document.querySelectorAll("section[id]");
const links = document.querySelectorAll(".nav-links a");
window.addEventListener("scroll", () => {
  let cur = "";
  sections.forEach((s) => {
    if (window.scrollY >= s.offsetTop - 120) cur = s.id;
  });
  links.forEach((l) => {
    l.classList.toggle("active", l.getAttribute("href") === "#" + cur);
  });
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const t = document.querySelector(a.getAttribute("href"));
    if (t) {
      e.preventDefault();
      t.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// Fade in observer
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add("visible"), i * 80);
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.1 },
);
document.querySelectorAll(".fade-in").forEach((el) => io.observe(el));

// Skill bars observer
const skillObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.querySelectorAll(".skill-bar-fill").forEach((bar) => {
          bar.style.width = bar.dataset.width + "%";
        });
        skillObs.unobserve(e.target);
      }
    });
  },
  { threshold: 0.2 },
);
document.querySelectorAll(".skills-panel").forEach((p) => skillObs.observe(p));

// Modal
function openModal(pdf, title) {
  document.getElementById("modalTitle").textContent = title;
  document.getElementById("modalFrame").src = pdf;
  document.getElementById("modalDownload").href = pdf;
  document.getElementById("modal").classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeModal() {
  document.getElementById("modal").classList.remove("open");
  document.getElementById("modalFrame").src = "";
  document.body.style.overflow = "";
}
document.getElementById("modal").addEventListener("click", function (e) {
  if (e.target === this) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

// Fetch GitHub Repositories
async function loadGithubProjects() {
  const githubUsername = "FdLann";
  const container = document.getElementById("githubProjects");

  try {
    const response = await fetch(
      `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=15`,
    );
    const repos = await response.json();

    if (!Array.isArray(repos)) {
      container.innerHTML = `<p style="color: var(--muted); grid-column: 1 / -1; text-align: center; padding: 3rem;">Failed to load projects</p>`;
      return;
    }

    // Exclude Portfolio_MuhamadFadlan repo
    const filteredRepos = repos.filter(
      (repo) => repo.name !== "Portfolio_MuhamadFadlan",
    );

    // Generate HTML for each repo
    const projectsHTML = filteredRepos
      .map(
        (repo) => `
      <div class="repo-card fade-in">
        <div class="repo-header">
          <i class="fas fa-code-branch"></i>
          <a href="${repo.html_url}" target="_blank" class="repo-name">${repo.name}</a>
        </div>
        <p class="repo-desc">${repo.description || "No description provided"}</p>
        <div class="repo-footer">
          ${repo.language ? `<span class="repo-lang"><i class="fas fa-circle"></i> ${repo.language}</span>` : ""}
          <span class="repo-stars"><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
        </div>
      </div>
    `,
      )
      .join("");

    container.innerHTML = projectsHTML;
    container.className = "repos-grid";

    // Re-apply fade-in observer to new elements
    document.querySelectorAll(".fade-in").forEach((el) => {
      if (!el.classList.contains("visible")) {
        io.observe(el);
      }
    });
  } catch (error) {
    console.error("Error loading GitHub projects:", error);
    container.innerHTML = `<p style="color: var(--muted); grid-column: 1 / -1; text-align: center; padding: 3rem;">Unable to load projects</p>`;
  }
}

// Load projects when DOM is ready
document.addEventListener("DOMContentLoaded", loadGithubProjects);
