// ==========================
// FEATURED ITEM
// ==========================
const featuredData = {
  name: "Zen New Tab",
  url: "https://chromewebstore.google.com/detail/chhlgdhacpabpphphdhjicnpbpklpdbk?utm_source=item-share-cb",
  icon: "assets/icons/128.svg",
  color: "#25D366", // soft green match for featured
  description: "Minimal, calm, distraction-free new tab experience. Download from the Chrome Web Store.",
  tagline: "A peaceful new tab for focus"
};

// ==========================
// LINK DATA WITH OPTIONAL STATS
// ==========================
const linkData = [
  { name:"Website & Portfolio", url:"https://geanpaulo.com", icon:"assets/icons/portfolio.svg", color:"#181717", description:"Check out my projects and work", stats: null },
  { name:"Facebook", url:"https://facebook.com/geanpaulofrancois", icon:"assets/icons/facebook.svg", color:"#0866FF", description:"Connect on Facebook", stats: "👥 4.5k" },
  { name:"Instagram", url:"https://instagram.com/geanpau.lo", icon:"assets/icons/instagram.svg", color:"#FF0069", description:"Follow me on Instagram", stats: "👥 644" },
  { name:"Threads", url:"https://www.threads.net/@geanpau.lo", icon:"assets/icons/threads.svg", color:"#000000", description:"Join the conversation", stats: "👥 200" },
  { name:"WhatsApp", url:"https://wa.me/639202652736", icon:"assets/icons/whatsapp.svg", color:"#25D366", description:"Chat with me on WhatsApp", stats: null },
  { name:"GitHub", url:"https://github.com/geanpaulo19", icon:"assets/icons/github.svg", color:"#181717", description:"Open-source projects & code", stats: "💻 3" },
  { name:"LinkedIn", url:"https://linkedin.com/in/gean-paulo-paguirigan-b391182aa", icon:"assets/icons/linkedin.svg", color:"#0077B5", description:"Connect on LinkedIn", stats: null },
  { name:"X", url:"https://x.com/geanpaulo_", icon:"assets/icons/x.svg", color:"#000000", description:"Follow me on X", stats: "👥 5k" }
];

// ==========================
// FEATURED CARD UNIQUE (CENTERED CONTENT)
// ==========================
const featuredContainer = document.getElementById("featured");

if (featuredContainer && featuredData) {
  const wrapper = document.createElement("div");
  wrapper.className = "featured-card-wrapper-unique";

  const card = document.createElement("a");
  card.href = featuredData.url;
  card.target = "_blank";
  card.className = "featured-card-unique";

  fetch(featuredData.icon)
    .then(r => r.text())
    .then(svg => {
      if (!/<svg[^>]*fill=/.test(svg)) {
        svg = svg.replace(
          /<svg /,
          `<svg fill="${featuredData.color}" width="56" height="56" `
        );
      } else {
        svg = svg.replace(
          /<svg /,
          `<svg width="56" height="56" `
        );
      }

      card.innerHTML = `
        <div class="featured-inner-unique featured-inner-centered">
          <div class="featured-icon-unique">${svg}</div>
          <div class="featured-text-unique">
            <span class="featured-pill-unique">Featured</span>
            <span class="featured-title-unique">${featuredData.name}</span>
            <span class="featured-tagline-unique">${featuredData.tagline}</span>
            <span class="featured-desc-unique">${featuredData.description}</span>
          </div>
        </div>
      `;
    })
    .catch(() => {
      card.innerHTML = `
        <div class="featured-inner-unique featured-inner-centered">
          <div class="featured-text-unique">
            <span class="featured-pill-unique">Featured</span>
            <span class="featured-title-unique">${featuredData.name}</span>
            <span class="featured-desc-unique">${featuredData.description}</span>
          </div>
        </div>
      `;
    });

  wrapper.appendChild(card);
  featuredContainer.appendChild(wrapper);
}

// ==========================
// LINK CARDS WITH STATS
// ==========================
const linksContainer = document.getElementById("links");

function createLinkCard(link) {
  const card = document.createElement("a");
  card.href = link.url;
  card.target = "_blank";
  card.className = "link-card";

  fetch(link.icon)
    .then(r => r.text())
    .then(svg => {
      let colored = svg;
      if(!/<svg[^>]*fill=/.test(svg)){
        colored = svg.replace(/<svg /, `<svg fill="${link.color}" width="36" height="36" style="display:block;margin:0 auto;" `);
      } else {
        colored = svg.replace(/<svg /, `<svg width="36" height="36" style="display:block;margin:0 auto;" `);
      }

      const iconClass = link.name === "Portfolio" ? "portfolio-icon" : "";

      // Place stats outside of .link-text
      card.innerHTML = `
        <div class="link-icon ${iconClass}">${colored}</div>
        <div class="link-text">
          <span class="link-title">${link.name}</span>
          <span class="link-desc">${link.description}</span>
        </div>
        ${link.stats ? `<span class="link-stats">${link.stats}</span>` : ''}
      `;
    })
    .catch(() => {
      card.innerHTML = `
        <div class="link-icon" style="font-size:36px;color:${link.color}">•</div>
        <div class="link-text">
          <span class="link-title">${link.name}</span>
          <span class="link-desc">${link.description}</span>
        </div>
        ${link.stats ? `<span class="link-stats">${link.stats}</span>` : ''}
      `;
    });

  linksContainer.appendChild(card);
}

linkData.forEach(createLinkCard);

// ==========================
// THEME TOGGLE
// ==========================
const themeToggleBtn = document.getElementById("theme-toggle");
const savedTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

if(savedTheme){
  document.body.classList.toggle("light", savedTheme === "light");
} else {
  document.body.classList.toggle("light", !prefersDark);
}

themeToggleBtn.addEventListener("click", ()=>{
  document.body.classList.toggle("light");
  localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark");
  updatePortfolioIcon();
});

function updatePortfolioIcon() {
  const icon = document.querySelector('.portfolio-icon svg');
  if(icon){
    icon.style.transition = "filter 0.3s ease";
    icon.style.filter = document.body.classList.contains('light') ? 'invert(1) brightness(1.2)' : 'none';
  }
}

// ==========================
// DYNAMIC GREETING (NO TYPING ANIMATION)
// ==========================
const greetingEl = document.getElementById("greeting");

function updateGreeting() {
  const hour = new Date().getHours();
  let greeting = "Hello!";
  let glow = "";

  if(hour >= 5 && hour < 11){ 
    greeting = "🌅 Good morning!"; 
    glow = "rgba(255,200,100,0.15)"; 
  }
  else if(hour >= 11 && hour < 17){ 
    greeting = "☀️ Good afternoon!"; 
    glow = "rgba(255,255,255,0.1)"; 
  }
  else{ 
    greeting = "🌙 Good evening!"; 
    glow = "rgba(100,200,255,0.15)"; 
  }

  greetingEl.style.setProperty("--dynamic-glow", glow);
  greetingEl.textContent = greeting; // instant update
}

// Initial update
updateGreeting();

// Refresh every minute
setInterval(updateGreeting, 60000);
