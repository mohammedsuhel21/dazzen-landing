# Dazzen — Landing Page

A scroll-driven, cinematic pre-launch waitlist experience for Dazzen.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build
npm start
```

## Where to place your assets

| Asset | Path |
|---|---|
| Hero video (Section 1) | `public/videos/hero.mp4` |
| Video 2 — the problem (Section 2) | `public/videos/problem.mp4` |
| Video 3 — the belief (Section 3) | `public/videos/belief.mp4` |
| Video 4 — the beginning (Section 4) | `public/videos/beginning.mp4` |
| Dazzen logo | `public/logo/dazzen-logo.png` |

Videos should be compressed (H.264 MP4, ~1080p, no audio track needed since they autoplay muted) for best performance.

## Waitlist form

Submissions POST JSON (`name`, `email`, `phone`) to the Google Apps Script endpoint configured in `src/components/WaitlistForm.tsx`.

## Structure

- `src/app` — root layout, global styles, page composition
- `src/components/sections` — the four cinematic scroll sections (`Hero`, `Problem`, `Belief`, `Beginning`) built on a shared `CinematicSection` primitive (video background + scroll-scrubbed zoom/blur + text reveal)
- `src/components/canvas` — the R3F golden particle field
- `src/components/WaitlistForm.tsx` — the frosted-glass waitlist card
- `src/lib/SmoothScroll.tsx` — Lenis + GSAP ScrollTrigger wiring
- `src/store` — Zustand app state (loader, navbar visibility)
