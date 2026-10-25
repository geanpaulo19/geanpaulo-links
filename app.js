/* ============================================================
   KINETIC LINKS - rendering + live data + interactions
   ============================================================ */

// ==========================
// SITE CONFIG - one-place edits for the things that change
// ==========================
const AVAILABILITY = {
  open: true,
  available: 'Available for projects',
  booked: 'Currently booked'
};

const CONTACT = {
  email: 'geanpaulo@mail.com',
  vcard: 'assets/gean-paulo.vcf'
};

// ==========================
// FEATURED ITEM
// ==========================
const featuredData = {
  name: 'Zen New Tab',
  url: 'https://chromewebstore.google.com/detail/chhlgdhacpabpphphdhjicnpbpklpdbk?utm_source=item-share-cb',
  icon: 'assets/icons/128.svg',
  description: 'Minimal, calm, distraction-free new tab experience. Download from the Chrome Web Store.',
  tagline: 'A peaceful new tab for focus'
};

const linkData = [
  { name: 'Website & Portfolio', url: 'https://geanpaulo.com', icon: 'assets/icons/portfolio.svg', color: 'var(--fg)', mono: true, description: 'Check out my projects and work', stat: null },
  { name: 'Facebook', url: 'https://facebook.com/geanpaulofrancois', icon: 'assets/icons/facebook.svg', color: '#0866FF', description: 'Connect on Facebook', stat: '4.5K' },
  { name: 'Instagram', url: 'https://instagram.com/geanpau.lo', icon: 'assets/icons/instagram.svg', color: '#FF0069', description: 'Follow me on Instagram', stat: '644' },
  { name: 'Threads', url: 'https://www.threads.net/@geanpau.lo', icon: 'assets/icons/threads.svg', color: 'var(--fg)', mono: true, description: 'Join the conversation', stat: '200' },
  { name: 'WhatsApp', url: 'https://wa.me/639202652736', icon: 'assets/icons/whatsapp.svg', color: '#25D366', description: 'Chat with me on WhatsApp', stat: null },
  { name: 'Email', action: 'copy-email', icon: 'ph-envelope-simple', color: 'var(--fg)', description: CONTACT.email, stat: null, arrow: 'ph-copy' },
  { name: 'Save my contact', action: 'download-vcard', icon: 'ph-user-circle-plus', color: 'var(--accent-text)', description: 'Add my details to your phone', stat: null, arrow: 'ph-download-simple' },
  { name: 'GitHub', url: 'https://github.com/geanpaulo19', icon: 'assets/icons/github.svg', color: 'var(--fg)', mono: true, description: 'Open-source projects & code', stat: '3 repos' },
  { name: 'LinkedIn', url: 'https://linkedin.com/in/gean-paulo-paguirigan-b391182aa', icon: 'assets/icons/linkedin.svg', color: '#0077B5', description: 'Connect on LinkedIn', stat: null },
  { name: 'X', url: 'https://x.com/geanpaulo_', icon: 'assets/icons/x.svg', color: 'var(--fg)', mono: true, description: 'Follow me on X', stat: '5K' }
];

// ==========================
// SVG ICON LOADING
// Inline the brand SVG and color it via currentColor so the
// row controls tone through CSS. Monochrome marks may ship
// with baked white fills; those are rewritten to currentColor
// so they invert with the theme (colored accent fills are kept).
// ==========================
function loadIcon(url, color, size, mono) {
  return fetch(url)
    .then((r) => r.text())
    .then((svg) => {
      let out = svg;
      if (mono) {
        out = out.replace(/fill="(white|#fff(?:fff)?)"/gi, 'fill="currentColor"');
      }
      if (!/<svg[^>]*fill=/.test(out)) {
        out = out.replace(/<svg /, `<svg fill="currentColor" `);
      }
      out = out.replace(/<svg /, `<svg width="${size}" height="${size}" style="display:block" `);
      return out;
    })
    .catch(() => `<span style="width:${size}px;height:${size}px;border-radius:50%;background:${color};display:block"></span>`);
}

// Phosphor glyphs for the non-brand rows (email, save contact)
function renderIcon(link, size) {
  if (link.icon.startsWith('ph-')) {
    return Promise.resolve(`<i class="ph ${link.icon}" aria-hidden="true"></i>`);
  }
  return loadIcon(link.icon, link.color, size, link.mono);
}

// ==========================
// TOAST + CLIPBOARD
// ==========================
let toastEl = null;
let toastTimer = 0;

function showToast(message) {
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.className = 'toast';
    toastEl.setAttribute('role', 'status');
    document.body.appendChild(toastEl);
  }
  toastEl.innerHTML = `<i class="ph ph-check-circle" aria-hidden="true"></i>${message}`;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
}

function copyText(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text);
  }
  // Older webviews: textarea + execCommand fallback
  return new Promise((resolve, reject) => {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy') ? resolve() : reject(new Error('copy failed'));
    } catch (err) {
      reject(err);
    } finally {
      ta.remove();
    }
  });
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
// Rows reveal as they enter the viewport; the arrow glyph
// reflects the row's action.
// ==========================
const linksContainer = document.getElementById('links');

linkData.forEach((link, i) => {
  let row;

  if (link.action === 'copy-email') {
    row = document.createElement('button');
    row.type = 'button';
    row.setAttribute('aria-label', `Copy email address ${CONTACT.email}`);
    row.addEventListener('click', () => {
      copyText(CONTACT.email)
        .then(() => showToast('Email copied to clipboard'))
        .catch(() => showToast(CONTACT.email));
    });
  } else if (link.action === 'download-vcard') {
    row = document.createElement('a');
    row.href = CONTACT.vcard;
    row.download = 'gean-paulo.vcf';
  } else {
    row = document.createElement('a');
    row.href = link.url;
    row.target = '_blank';
    row.rel = 'noopener';
  }

  row.className = 'link-row spotlight reveal';
  row.style.setProperty('--rd', `${(i % 3) * 80}ms`);

  const arrow = link.arrow || 'ph-arrow-up-right';
  renderIcon(link, 30).then((icon) => {
    row.innerHTML = `
      <span class="link-icon" style="color:${link.color}">${icon}</span>
      <span class="link-text">
        <span class="link-title">${link.name}</span>
        <span class="link-desc">${link.description}</span>
      </span>
      ${link.stat ? `<span class="link-stat">${link.stat}</span>` : ''}
      <i class="ph ${arrow} link-arrow" aria-hidden="true"></i>
    `;
  });

  linksContainer.appendChild(row);
});

// ==========================
// SCROLL REVEAL - rows and footer fade in on entry
// ==========================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// ==========================
// AVAILABILITY - driven by the SITE CONFIG flag
// ==========================
document.getElementById('availability').textContent = AVAILABILITY.open
  ? AVAILABILITY.available
  : AVAILABILITY.booked;
document.querySelector('.status-dot').classList.toggle('booked', !AVAILABILITY.open);

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
