/* ============================================================
   KINETIC LINKS - rendering + live data + interactions
   Dark-only: no theme toggle, no icon inversion.
   ============================================================ */

// ==========================
// DATA
// ==========================
const featuredData = {
  name: 'Zen New Tab',
  url: 'https://chromewebstore.google.com/detail/chhlgdhacpabpphphdhjicnpbpklpdbk?utm_source=item-share-cb',
  icon: 'assets/icons/128.svg',
  description: 'Minimal, calm, distraction-free new tab experience. Download from the Chrome Web Store.',
  tagline: 'A peaceful new tab for focus'
};

const linkData = [
  { name: 'Website & Portfolio', url: 'https://geanpaulo.com', icon: 'assets/icons/portfolio.svg', color: 'var(--fg)', description: 'Check out my projects and work', stat: null },
  { name: 'Facebook', url: 'https://facebook.com/geanpaulofrancois', icon: 'assets/icons/facebook.svg', color: '#0866FF', description: 'Connect on Facebook', stat: '4.5K' },
  { name: 'Instagram', url: 'https://instagram.com/geanpau.lo', icon: 'assets/icons/instagram.svg', color: '#FF0069', description: 'Follow me on Instagram', stat: '644' },
  { name: 'Threads', url: 'https://www.threads.net/@geanpau.lo', icon: 'assets/icons/threads.svg', color: 'var(--fg)', description: 'Join the conversation', stat: '200' },
  { name: 'WhatsApp', url: 'https://wa.me/639202652736', icon: 'assets/icons/whatsapp.svg', color: '#25D366', description: 'Chat with me on WhatsApp', stat: null },
  { name: 'GitHub', url: 'https://github.com/geanpaulo19', icon: 'assets/icons/github.svg', color: 'var(--fg)', description: 'Open-source projects & code', stat: '3 repos' },
  { name: 'LinkedIn', url: 'https://linkedin.com/in/gean-paulo-paguirigan-b391182aa', icon: 'assets/icons/linkedin.svg', color: '#0077B5', description: 'Connect on LinkedIn', stat: null },
  { name: 'X', url: 'https://x.com/geanpaulo_', icon: 'assets/icons/x.svg', color: 'var(--fg)', description: 'Follow me on X', stat: '5K' }
];

// ==========================
// SVG ICON LOADING
// Inline the brand SVG and color it via currentColor so the
// row controls tone through CSS.
// ==========================
function loadIcon(url, color, size) {
  return fetch(url)
    .then((r) => r.text())
    .then((svg) => {
      let out = svg;
      if (!/<svg[^>]*fill=/.test(out)) {
        out = out.replace(/<svg /, `<svg fill="currentColor" `);
      }
      out = out.replace(/<svg /, `<svg width="${size}" height="${size}" style="display:block" `);
      return out;
    })
    .catch(() => `<span style="width:${size}px;height:${size}px;border-radius:50%;background:${color};display:block"></span>`);
}

// ==========================
// FEATURED CARD
// ==========================
const featuredContainer = document.getElementById('featured');

if (featuredContainer) {
  const card = document.createElement('a');
  card.className = 'featured-card spotlight rise';
  card.style.setProperty('--d', '0.4s');
  card.href = featuredData.url;
  card.target = '_blank';
  card.rel = 'noopener';
  card.setAttribute('aria-label', `${featuredData.name} - ${featuredData.tagline}`);

  loadIcon(featuredData.icon, featuredData.color || 'var(--accent)', 56).then((svg) => {
    card.innerHTML = `
      <span class="featured-icon">${svg}</span>
      <span class="featured-copy">
        <span class="featured-tag">Featured</span>
        <span class="featured-title">${featuredData.name}</span>
        <span class="featured-tagline">${featuredData.tagline}</span>
        <span class="featured-desc">${featuredData.description}</span>
      </span>
      <i class="ph ph-arrow-up-right featured-arrow" aria-hidden="true"></i>
    `;
  });

  featuredContainer.appendChild(card);
}

// ==========================
// LINK ROWS
// ==========================
const linksContainer = document.getElementById('links');

linkData.forEach((link, i) => {
  const row = document.createElement('a');
  row.className = 'link-row spotlight rise';
  row.style.setProperty('--d', `${0.5 + i * 0.06}s`);
  row.href = link.url;
  row.target = '_blank';
  row.rel = 'noopener';

  loadIcon(link.icon, link.color, 30).then((svg) => {
    row.innerHTML = `
      <span class="link-icon" style="color:${link.color}">${svg}</span>
      <span class="link-text">
        <span class="link-title">${link.name}</span>
        <span class="link-desc">${link.description}</span>
      </span>
      ${link.stat ? `<span class="link-stat">${link.stat}</span>` : ''}
      <i class="ph ph-arrow-up-right link-arrow" aria-hidden="true"></i>
    `;
  });

  linksContainer.appendChild(row);
});

// ==========================
// GREETING - visitor's local time, like the portfolio hero
// ==========================
const greetingEl = document.getElementById('greeting-text');
const hour = new Date().getHours();
greetingEl.textContent = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

// ==========================
// MANILA CLOCK - live, 30s tick
// ==========================
const timeEl = document.getElementById('mnl-time');

function tickClock() {
  timeEl.textContent = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Manila',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(new Date());
}

tickClock();
setInterval(tickClock, 30000);

// ==========================
// WEATHER - Open-Meteo, keyless, silent fail
// ==========================
const WMO = {
  0: ['ph-sun', 'Clear'], 1: ['ph-sun', 'Mainly clear'], 2: ['ph-cloud-sun', 'Partly cloudy'],
  3: ['ph-cloud', 'Overcast'], 45: ['ph-cloud-fog', 'Fog'], 48: ['ph-cloud-fog', 'Fog'],
  51: ['ph-cloud-rain', 'Drizzle'], 53: ['ph-cloud-rain', 'Drizzle'], 55: ['ph-cloud-rain', 'Drizzle'],
  61: ['ph-cloud-rain', 'Rain'], 63: ['ph-cloud-rain', 'Rain'], 65: ['ph-cloud-rain', 'Rain'],
  71: ['ph-snowflake', 'Snow'], 73: ['ph-snowflake', 'Snow'], 75: ['ph-snowflake', 'Snow'],
  80: ['ph-cloud-rain', 'Showers'], 81: ['ph-cloud-rain', 'Showers'], 82: ['ph-cloud-rain', 'Showers'],
  95: ['ph-cloud-lightning', 'Storm'], 96: ['ph-cloud-lightning', 'Storm'], 99: ['ph-cloud-lightning', 'Storm']
};

fetch('https://api.open-meteo.com/v1/forecast?latitude=14.5995&longitude=120.9842&current_weather=true')
  .then((r) => r.json())
  .then((data) => {
    const code = data.current_weather.weathercode;
    const temp = Math.round(data.current_weather.temperature);
    const [icon] = WMO[code] || ['ph-cloud'];
    const weatherEl = document.getElementById('weather');
    document.getElementById('weather-icon').className = `ph ${icon}`;
    document.getElementById('weather-text').textContent = `${temp}\u00B0C`;
    weatherEl.hidden = false;
    document.querySelector('.weather-sep').hidden = false;
  })
  .catch(() => {
    /* weather is a bonus; the status row works without it */
  });

// ==========================
// THEME TOGGLE - dark default, light optional, persisted.
// The inline script at the top of <body> applies the saved
// class pre-paint; this handles the button + browser chrome.
// ==========================
const themeToggle = document.getElementById('theme-toggle');
const themeColorMeta = document.querySelector('meta[name="theme-color"]');

function syncThemeChrome() {
  const light = document.body.classList.contains('light');
  if (themeToggle) {
    themeToggle.querySelector('i').className = light ? 'ph ph-moon' : 'ph ph-sun';
  }
  if (themeColorMeta) {
    themeColorMeta.setAttribute('content', light ? '#f2f1ec' : '#0e0e10');
  }
}

syncThemeChrome();

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light');
    localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
    syncThemeChrome();
  });
}

// ==========================
// SPOTLIGHT - cards track the cursor for the border ring
// ==========================
document.addEventListener('mousemove', (e) => {
  const card = e.target.closest('.spotlight');
  if (!card) return;
  const r = card.getBoundingClientRect();
  card.style.setProperty('--mx', `${e.clientX - r.left}px`);
  card.style.setProperty('--my', `${e.clientY - r.top}px`);
});
