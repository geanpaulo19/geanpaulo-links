const linkData = [
  {
    name: "Portfolio",
    url: "https://geanpaulo.com",
    icon: "assets/icons/portfolio.svg",
    color: "#181717",
    description: "Check out my projects and work"
  },
  {
    name: "Facebook",
    url: "https://facebook.com/geanpaulofrancois",
    icon: "assets/icons/facebook.svg",
    color: "#0866FF",
    description: "Connect on Facebook"
  },
  {
    name: "Instagram",
    url: "https://instagram.com/geanpau.lo",
    icon: "assets/icons/instagram.svg",
    color: "#FF0069",
    description: "Follow me on Instagram"
  },
  {
    name: "Threads",
    url: "https://www.threads.net/@geanpau.lo",
    icon: "assets/icons/threads.svg",
    color: "#000000",
    description: "Join the conversation"
  },
  {
    name: "WhatsApp",
    url: "https://wa.me/639202652736",
    icon: "assets/icons/whatsapp.svg",
    color: "#25D366",
    description: "Chat with me on WhatsApp"
  },
  {
    name: "GitHub",
    url: "https://github.com/geanpaulo19",
    icon: "assets/icons/github.svg",
    color: "#181717",
    description: "Open-source projects & code"
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/gean-paulo-paguirigan-b391182aa",
    icon: "assets/icons/linkedin.svg",
    color: "#0077B5",
    description: "Connect on LinkedIn"
  },
  {
    name: "X",
    url: "https://x.com/geanpaulo_",
    icon: "assets/icons/x.svg",
    color: "#000000",
    description: "Follow me on X"
  }
];

const linksContainer = document.getElementById("links");

function createLinkCard(link) {
  const card = document.createElement("a");
  card.href = link.url;
  card.target = "_blank";
  card.className = "link-card";

  fetch(link.icon)
    .then(res => res.text())
    .then(svgText => {
      let coloredSVG = svgText;

      // Apply brand color if no fill exists
      if (!/<svg[^>]*fill=/.test(svgText)) {
        coloredSVG = svgText.replace(
          /<svg /,
          `<svg fill="${link.color}" width="36" height="36" style="display:block;margin:0 auto;" `
        );
      } else {
        coloredSVG = svgText.replace(
          /<svg /,
          `<svg width="36" height="36" style="display:block;margin:0 auto;" `
        );
      }

      // Add a class for Portfolio to allow inversion in light mode
      let iconClass = link.name === "Portfolio" ? 'portfolio-icon' : '';

      card.innerHTML = `
        <div class="link-icon ${iconClass}">
          ${coloredSVG}
        </div>
        <div class="link-text">
          <span class="link-title">${link.name}</span>
          <span class="link-desc">${link.description}</span>
        </div>
      `;
    })
    .catch(err => {
      console.error(`Error loading SVG for ${link.name}:`, err);
      // Fallback: simple colored dot
      card.innerHTML = `
        <div class="link-icon" style="font-size:36px;color:${link.color}">•</div>
        <div class="link-text">
          <span class="link-title">${link.name}</span>
          <span class="link-desc">${link.description}</span>
        </div>
      `;
    });

  linksContainer.appendChild(card);
}

// Generate all link cards
linkData.forEach(link => createLinkCard(link));

// ==========================
// THEME TOGGLE
// ==========================
const themeToggleBtn = document.getElementById("theme-toggle");

// Detect system preference on first load
const userPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const savedTheme = localStorage.getItem("theme");

// Apply saved theme or system preference
if (savedTheme) {
  document.body.classList.toggle("light", savedTheme === "light");
} else {
  document.body.classList.toggle("light", !userPrefersDark);
}

// Toggle theme manually
themeToggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
  const currentTheme = document.body.classList.contains("light") ? "light" : "dark";
  localStorage.setItem("theme", currentTheme);
});

// ==========================
// Invert Portfolio icon on light mode with smooth transition
// ==========================
function updatePortfolioIcon() {
  const portfolioIcon = document.querySelector('.portfolio-icon svg');
  if (portfolioIcon) {
    portfolioIcon.style.transition = "filter 0.3s ease"; // animate inversion
    if (document.body.classList.contains('light')) {
      portfolioIcon.style.filter = 'invert(1) brightness(1.2)';
    } else {
      portfolioIcon.style.filter = 'none';
    }
  }
}

// Run on load and on theme toggle
updatePortfolioIcon();
themeToggleBtn.addEventListener("click", updatePortfolioIcon);

// ==========================
// DYNAMIC TIME-BASED GREETING
// ==========================
const greetingEl = document.getElementById("greeting");

function updateGreeting() {
  const now = new Date();
  const hour = now.getHours();
  let greeting = "Hello!"; // default
  let glowColor = "";

  if (hour >= 5 && hour < 11) {
    greeting = "🌅 Good morning!";
    glowColor = "rgba(255, 200, 100, 0.15)"; // warm glow
  } else if (hour >= 11 && hour < 17) {
    greeting = "☀️ Good afternoon!";
    glowColor = "rgba(255, 255, 255, 0.1)"; // neutral glow
  } else {
    greeting = "🌙 Good evening!";
    glowColor = "rgba(100, 200, 255, 0.15)"; // cool glow
  }

  // Apply glow color for animation
  greetingEl.style.setProperty("--dynamic-glow", glowColor);

  // Typing effect
  typeGreeting(greeting);
}

function typeGreeting(text) {
  greetingEl.textContent = ""; // reset
  let i = 0;
  const interval = setInterval(() => {
    greetingEl.textContent += text.charAt(i);
    i++;
    if (i >= text.length) clearInterval(interval);
  }, 100); // typing speed in ms
}

// Initialize greeting
updateGreeting();
setInterval(updateGreeting, 60000); // update every minute
