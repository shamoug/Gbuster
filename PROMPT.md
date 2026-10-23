# One-Shot Build Prompt

The specification below is the single prompt that defines this game. Give it to an AI coding agent to rebuild or extend the project in one pass.

---

Build a complete, production-ready, location-based AR ghost-hunting game for mobile phone browsers, in the spirit of catch-them-all GPS games, delivered as a static site deployable on GitHub Pages with zero build step and zero paid services.

## Product

Name: Ghost Buster GO. The player walks their real city, finds ghosts on a live map, walks within range, opens their phone camera, and captures ghosts by firing a sustained lightning stream at them. All characters must be original; no franchise names, logos, or recognizable characters.

## Deliverables

1. `play/index.html` — the entire game in one self-contained file (vanilla JS, no framework, no bundler).
2. `index.html` — a polished landing page: hero with animated mascot, how-to-play steps, full ghost roster with art, crew-play explanation, iOS and Android home-screen install instructions.
3. `README.md`, PWA `manifest.webmanifest`, minimal `sw.js`, generated PNG icons, MIT license note.

## Game systems

- **Map mode.** Leaflet with OpenStreetMap tiles, dark night styling, live `watchPosition` GPS, pulsing player marker, 75 m capture ring. Tapping a ghost outside the ring reports its distance; inside the ring it starts a hunt.
- **Deterministic spawning.** Partition the world into ~150 m lat/lng cells. Seed a PRNG with (cell, 2-hour epoch) so all players co-located see identical ghosts with no server. 1–2 ghosts per cell with rarity tiers; a boss at ~0.5% per cell; one special ghost that spawns only 06:00–11:00 local time.
- **AR hunt mode.** Fullscreen rear-camera feed (`getUserMedia`, graceful starfield fallback), ghost drawn as animated inline SVG floating with device-orientation parallax and dodge AI that reacts to being fired on. Aim by touching anywhere; hold a large BLAST button to fire a jagged, glowing, multi-pass canvas lightning stream from screen bottom to the aim point. Damage applies only while the stream endpoint overlaps the ghost. Heat gauge: ~3.5 s continuous fire overheats and locks the trigger until it cools. Haptics via `navigator.vibrate`. HP bar, retreat button, capture celebration screen with XP reward.
- **Roster.** 8 original species across Common/Uncommon/Rare/Special/Boss, each with distinct SVG art, personality blurb, HP, XP, speed, size. The boss is extra large, cute but a little scary, ~420 HP, realistically needs group play.
- **Crew play.** Players set a shared crew name. Each crewmate active within the last 10 minutes adds +0.5× beam damage, capped at ×2. Show the live multiplier in the HUD and hunt screen.
- **Persistence.** Player profile, XP, levels (`level = floor(sqrt(xp/50))+1`, beam damage scales with level), and Ghostdex capture counts in `localStorage`. Captured ghosts stay gone for the session via `sessionStorage`.
- **Free cloud sync.** Use jsonblob.com (free, keyless JSON storage, CORS-enabled) for a shared record holding a 50-entry leaderboard and crew activity pings. In-game flow: one player creates the record, shares its code, others join by pasting it; also honor a pinned ID from `play/config.js`. Merge-on-write (pull, update own entry, push), sync after each capture and every 90 s, fail silently offline.
- **Screens.** Intro/onboarding with name entry; Map; Ghostdex (locked entries show ???); Crew (name, crew, ledger management, leaderboard); Hunt; Capture celebration. Bottom tab bar.

## Quality bar

- Works on iPhone Safari and Android Chrome; safe-area insets respected; no horizontal scroll; touch-first.
- Distinct visual identity: deep night indigo palette with an ecto-teal glow accent, rounded arcade display font plus a rounded body font, original cute-but-spooky SVG ghost art everywhere. No generic template styling.
- Defensive coding: every permission (GPS, camera, orientation) can be denied and the game still runs with a fallback and a clear plain-language message. HTTPS-only APIs flagged to the user when served over HTTP.
- No external assets beyond Leaflet, OSM tiles, and Google Fonts. Everything else inline.

Then create a public GitHub repository, push all files, and enable GitHub Pages from the main branch root so the game is playable at the Pages URL immediately.
