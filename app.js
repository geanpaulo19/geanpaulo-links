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

const linkData = [
  { name:"Portfolio", url:"https://geanpaulo.com", icon:"assets/icons/portfolio.svg", color:"#181717", description:"Check out my projects and work" },
  { name:"Facebook", url:"https://facebook.com/geanpaulofrancois", icon:"assets/icons/facebook.svg", color:"#0866FF", description:"Connect on Facebook" },
  { name:"Instagram", url:"https://instagram.com/geanpau.lo", icon:"assets/icons/instagram.svg", color:"#FF0069", description:"Follow me on Instagram" },
  { name:"Threads", url:"https://www.threads.net/@geanpau.lo", icon:"assets/icons/threads.svg", color:"#000000", description:"Join the conversation" },
  { name:"WhatsApp", url:"https://wa.me/639202652736", icon:"assets/icons/whatsapp.svg", color:"#25D366", description:"Chat with me on WhatsApp" },
  { name:"GitHub", url:"https://github.com/geanpaulo19", icon:"assets/icons/github.svg", color:"#181717", description:"Open-source projects & code" },
  { name:"LinkedIn", url:"https://linkedin.com/in/gean-paulo-paguirigan-b391182aa", icon:"assets/icons/linkedin.svg", color:"#0077B5", description:"Connect on LinkedIn" },
  { name:"X", url:"https://x.com/geanpaulo_", icon:"assets/icons/x.svg", color:"#000000", description:"Follow me on X" }
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
      // Apply color if no fill
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
        <div class="featured-inner-unique">
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
        <div class="featured-inner-unique">
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
// LINK CARDS
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
      card.innerHTML = `<div class="link-icon ${iconClass}">${colored}</div>
                        <div class="link-text">
                          <span class="link-title">${link.name}</span>
                          <span class="link-desc">${link.description}</span>
                        </div>`;
    })
    .catch(() => {
      card.innerHTML = `<div class="link-icon" style="font-size:36px;color:${link.color}">•</div>
                        <div class="link-text">
                          <span class="link-title">${link.name}</span>
                          <span class="link-desc">${link.description}</span>
                        </div>`;
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
// DYNAMIC GREETING
// ==========================
const greetingEl = document.getElementById("greeting");

function updateGreeting() {
  const hour = new Date().getHours();
  let greeting = "Hello!";
  let glow = "";

  if(hour >= 5 && hour < 11){ greeting="🌅 Good morning!"; glow="rgba(255,200,100,0.15)"; }
  else if(hour >= 11 && hour < 17){ greeting="☀️ Good afternoon!"; glow="rgba(255,255,255,0.1)"; }
  else{ greeting="🌙 Good evening!"; glow="rgba(100,200,255,0.15)"; }

  greetingEl.style.setProperty("--dynamic-glow", glow);
  typeGreeting(greeting);
}

function typeGreeting(text){
  greetingEl.textContent = "";
  let i = 0;
  const interval = setInterval(()=>{
    greetingEl.textContent += text.charAt(i);
    i++;
    if(i >= text.length) clearInterval(interval);
  }, 100);
}

updateGreeting();
setInterval(updateGreeting, 60000);
