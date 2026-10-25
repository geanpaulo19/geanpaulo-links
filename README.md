# Gean Paulo | Links

Personal link hub at **links.geanpaulo.com**, designed in the same Kinetic Type
system as [geanpaulo.com](https://geanpaulo.com): Archivo display type, lime
accent, choreographed entrances.

## Features

- **Light & Dark Mode**
  - Dark by default, respects system preference
  - Toggle persists via `localStorage`; cat and 404 pages follow the choice
- **Live status row**
  - Time-aware greeting, availability dot, live Manila clock, and Manila
    weather via Open-Meteo (keyless, fails silently)
- **Featured project panel**
  - Highlighted card for the current featured work
- **Spotlight link rows**
  - Border ring that lights up around the cursor, lift-on-hover motion
- **Cat page** (`cat.html`)
  - Meet Curiosity & Ming Ming, with PayPal / Wise support buttons

## Tech Stack

- HTML
- CSS
- Vanilla JavaScript

No frameworks. No build step. Fast and lightweight.

## Project Structure

```txt
.
├── assets/
│   ├── icons/          # brand SVG marks for each link
│   └── images/         # avatar, cats, OG image, favicon
├── index.html          # links page
├── cat.html            # the cats
├── 404.html            # not-found page
├── style.css
├── app.js
├── CNAME               # links.geanpaulo.com
├── sitemap.xml
└── robots.txt
```
