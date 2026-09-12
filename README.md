# Interior Studio — A Real House, Scrolled Through

A scroll-driven architectural walkthrough built with Next.js and GSAP
ScrollTrigger — the "3D room" is real footage. Scrolling seeks through an
actual client walkthrough video frame-by-frame, room by room, with
typography that changes to match whatever room is on screen. Beyond the
walkthrough itself, the site includes a chat assistant, a call-booking
flow, an interactive map, an ambient sound toggle, and a layer of motion
polish (magnetic buttons, animated counters, a marquee, film grain).

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. First load fetches Fraunces/Work Sans from
Google Fonts, so you'll need normal internet access once.

```bash
npm run build && npm run start   # production build
```

## Feature guide

### Chat assistant ("Maya")
`components/chat/ChatWidget.tsx` is a real floating chat widget — message
thread, typing indicator, suggested questions, a generated avatar with an
"online" pulse. It posts to `app/api/chat/route.ts`, which works two ways:

- **No API key set** — replies come from the rule-based engine in
  `lib/chatResponses.ts` (pricing, timelines, process, locations, the two
  portfolio projects). Fully functional, zero configuration.
- **`ANTHROPIC_API_KEY` set** — the route calls the real Claude API instead,
  with a system prompt describing the studio, and falls back to the canned
  engine if the API call ever fails. Copy `.env.local.example` to
  `.env.local` and add your key from https://console.anthropic.com to turn
  this on. Uses `claude-haiku-4-5` (fast/cheap) — change the model string
  in the route if you want a different one.

### Book a call
`components/call/CallModal.tsx` — triggered from the nav, the hero, and
the contact section (all via a tiny event bus in `lib/callModalBus.ts`, so
any component can open it with `openCallModal()`). The form posts to
`app/api/call-request/route.ts`, which currently just logs the request
server-side. **Wire the TODO in that file to real delivery** — e.g.
Resend/SendGrid for email, or a Slack/CRM webhook — before relying on it.
Real click-to-call (`tel:`) and WhatsApp (`wa.me`) links are included as an
immediate fallback; update the phone number constants at the top of
`CallModal.tsx` (`PHONE_DISPLAY`, `PHONE_TEL`, `WHATSAPP_NUMBER`).

### Map
`components/map/StudioMap.tsx` — a real interactive Leaflet map (dark
CARTO/OpenStreetMap tiles, no API key required) pinning Bengaluru, Mumbai
and Goa. Scroll-zoom only activates once you click into the map, so page
scrolling is never accidentally captured. Update the `CITIES` array with
your real coordinates/blurbs.

### Ambient sound
`components/ui/SoundToggle.tsx` (bottom-left) synthesizes a soft ambient
pad entirely in-browser with the Web Audio API — two detuned oscillators,
a slow filter sweep, and filtered noise for an airy "room tone." No audio
file to go missing, and it only ever starts on a direct user click, per
browser autoplay rules. Swap in a real recorded ambience by replacing the
body of `buildAmbience()` with an `<audio>` loop if you'd prefer.

### Avatar
`components/chat/ChatAvatar.tsx` — a generated SVG mark (not a stock
photo) used as the chat assistant's persona, with a pulsing "online"
indicator.

### Motion/visual polish
- `components/animations/Magnetic.tsx` — wraps a button so it eases toward
  the cursor within a radius (desktop only; skipped on touch).
- `components/animations/StatCounter.tsx` — counts up once scrolled into
  view.
- `components/animations/Marquee.tsx` — infinite CSS-driven scrolling
  ticker of room names, between the walkthrough and the Projects section.
- `components/ui/GrainOverlay.tsx` — a fixed, very low-opacity film-grain
  layer (inline SVG turbulence filter, no image asset) over the whole site.

## How the video-scroll system works

- `public/videos/parekh-walkthrough.mp4` is the real walkthrough footage
  (trimmed to 202.5s, downscaled/recompressed, small GOP for smooth
  seeking).
- `lib/videoTimeline.ts` hand-maps that footage's actual timestamps to
  rooms and exposes `roomVh(key)`, converting each room's real duration
  into a proportional scroll height (`vh`) — the single source of truth
  for both video timing and section heights in `ScrollContent.tsx`.
- `lib/useScrollDriver.ts` wires Lenis + a GSAP `ScrollTrigger` pinned to
  the room-sections wrapper, writing scroll progress (0→1) into
  `lib/scrollStore.ts` (a plain mutable object, not React state).
- `lib/useScrollScrub.ts` eases the `<video>`'s `currentTime` toward
  `progress * duration` every frame.
- `components/video/ScrollVideoHero.tsx` is the fixed, full-viewport video
  itself. `Navigation.tsx`/`ProgressIndicator.tsx` call
  `roomAtProgress(progress)` from the same timeline file so nav labels can
  never drift out of sync with the section headings.
- Past ~94% progress the fixed video fades out and normal document scroll
  takes over for Projects/Studio/Contact.

## Placeholders you should replace before publishing

- **Phone/WhatsApp numbers** — `components/call/CallModal.tsx`
  (`PHONE_DISPLAY`, `PHONE_TEL`, `WHATSAPP_NUMBER` are dummy values).
- **Call-request delivery** — `app/api/call-request/route.ts` only logs to
  the server console right now.
- **Team names/roles** — `components/sections/TeamStrip.tsx` is entirely
  placeholder.
- **Stats** — `STATS` array in `ScrollContent.tsx` (120+ projects, 12
  years, etc.) are placeholder figures.
- **Project location/year** — `PROJECTS` array in `ScrollContent.tsx`.
- **Map coordinates/blurbs** — `CITIES` array in `StudioMap.tsx`.
- **Contact email** — `studio@interiorstudio.in` in `ScrollContent.tsx`.

## Project structure

```
app/
  api/chat/route.ts          Chat backend (real Claude if keyed, canned fallback otherwise)
  api/call-request/route.ts  Callback request endpoint (logs server-side)
components/
  Experience.tsx             Orchestrates video + scroll content + loader + all widgets
  video/ScrollVideoHero.tsx  The fixed, scroll-scrubbed <video> background
  chat/                      ChatWidget, ChatAvatar
  call/CallModal.tsx         Book-a-call modal + click-to-call/WhatsApp
  map/StudioMap.tsx          Leaflet map
  sections/
    ScrollContent.tsx         Room sections + Projects/Studio/Contact
    ProjectCard.tsx            Clip-path reveal, parallax, video-or-image cards
    TeamStrip.tsx              Team avatar row
  animations/
    TextReveal.tsx, Magnetic.tsx, StatCounter.tsx, Marquee.tsx
  ui/
    Loader.tsx, Navigation.tsx, CustomCursor.tsx, ProgressIndicator.tsx,
    SoundToggle.tsx, GrainOverlay.tsx
lib/
  scrollStore.ts, videoTimeline.ts, useScrollScrub.ts, useScrollDriver.ts,
  gsap.ts, splitText.ts, chatResponses.ts, callModalBus.ts
public/
  videos/   parekh-walkthrough.mp4 (hero), johnson-office-loop.mp4 (project card)
  images/   poster frames + the Parekh project thumbnail
```

## Performance / mobile

- Chat widget, call modal, and map are all client-only and load lazily
  (map via `next/dynamic` with `ssr: false`, since Leaflet touches
  `window`).
- The Projects section's video card only plays while scrolled into view
  (`IntersectionObserver`-gated).
- Magnetic buttons and the custom cursor are skipped on coarse/touch
  pointers.
- `prefers-reduced-motion` disables all CSS transitions/animations
  globally, including the marquee.

## Replacing the walkthrough footage

```bash
ffmpeg -i input.mp4 -vf "scale=960:-2" -an \
  -c:v libx264 -preset veryfast -crf 26 \
  -g 5 -keyint_min 5 -sc_threshold 0 \
  -pix_fmt yuv420p -movflags +faststart \
  public/videos/your-walkthrough.mp4
```

Then re-time `VIDEO_ROOMS` in `lib/videoTimeline.ts` to match the new
footage's actual content.
# Designkriya
