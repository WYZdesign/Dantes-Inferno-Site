# The Dante's Inferno — Official Site

**Fusion from hell.** The official website for The Dante's Inferno — a fusion / funk / jazz project from Los Angeles, led by drummer Dante Newcombe-Kenealy, on Vermont Avenue Records.

## Stack

Static site, zero build step — deploys instantly to Vercel:

- **HTML / CSS / vanilla JS** (no framework)
- **GSAP + ScrollTrigger** — scroll orchestration, pinning, the Nine Circles horizontal descent
- **Lenis** — buttery smooth scroll
- **Raw WebGL** — an inferno fragment shader (fbm domain-warped noise) driving the fire background
- **Canvas particle sprites** — rising embers + cursor spark trail
- **Gyroscope / device-orientation** parallax on mobile

## The experience

- Fire preloader counting down the **Nine Circles of Hell**
- WebGL hellfire hero with per-character flicker + mouse/gyroscope parallax
- Magnetic buttons, custom ember cursor, text-scramble nav
- Interactive band roster (3D tilt + cursor-tracked glow)
- Discography with 3D-tilting covers, sliding vinyl, and track-by-track modal
- Pinned horizontal **Descent** through the Nine Circles (fire intensifies as you fall)
- Tabbed streaming player (Spotify + Bandcamp embeds)

## Local dev

```bash
npx serve .          # or any static server
# or just open index.html
```

## Deploy

The repo is wired for Vercel. Connect `WYZdesign/Dantes-Inferno-Site` in the Vercel dashboard — no build settings needed (static output at root).

## Credits

- Content: The Dante's Inferno / Vermont Avenue Records (Bandcamp, Spotify, Instagram)
- Site: WYZ Design™
