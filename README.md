# Ghost Buster GO

An augmented-reality ghost-hunting game for your phone, in the spirit of location-based catch-them-all games. Walk your real streets, find ghosts on a live map, raise your camera, and trap them with a lightning stream. No app store, no account, no server to run.

**Play it:** https://shamoug.github.io/Gbuster/

## How it works

| System | Implementation |
|---|---|
| Map | MapLibre GL + OpenFreeMap dark vector tiles (free, no API key), live GPS tracking, 250 ft capture ring |
| Spawning | Deterministic ~150 m cells re-rolled every 2 hours (everyone co-located sees the same ghosts), snapped to walkable public places via OpenStreetMap Overpass: quiet streets, footpaths, parks. Water, highways, private and restricted land are excluded |
| AR capture | Rear camera feed via `getUserMedia`, ghost rendered as animated SVG with device-tilt parallax, dodging AI |
| Combat | Hold-to-fire lightning stream drawn on canvas, aim by dragging, heat gauge with overheat lockout |
| Crew play | Shared crew name; each crewmate active in the last 10 min stacks +0.5× beam damage (cap ×2). The boss is tuned for crews |
| Progression | XP, levels (beam power scales), Ghostdex collection of 8 original species |
| Storage | Player state in `localStorage`; shared leaderboard and crew pings in a free [jsonblob.com](https://jsonblob.com) record |
| Install | PWA: manifest + service worker, add to home screen on iOS and Android |

## The cast

Blinky Bloo, Snacker (common) · Grumble, Zappy (uncommon) · Professor Fog, Madame Shiver (rare) · **Myrtle** (special, mornings 6–11 am only) · **Gloombert the Grand** (boss, 420 HP, bring a crew).

All characters are original. No franchise affiliation.

## Shared leaderboard setup (optional, 1 minute)

One player opens **Crew → Create shared ledger**, then sends the code to everyone else, who paste it under **Join ledger**. That one JSON record (free, no signup) holds the leaderboard and crew activity.

To pin one ledger for every visitor of your fork, put the blob ID in `play/config.js`:

```js
window.GB_CONFIG = { blobId: "YOUR-BLOB-ID" };
```

Create one from a terminal:

```bash
curl -i -X POST https://jsonblob.com/api/jsonBlob \
  -H "Content-Type: application/json" \
  -d '{"leaderboard":[],"pings":[]}'
# copy the ID at the end of the Location: header
```

Note: jsonblob records expire after about 30 days without access; regular play keeps them alive.

## Requirements

- A phone with GPS and a camera
- HTTPS (GitHub Pages provides it); camera and location APIs refuse plain HTTP
- Location and camera permission when the browser asks

## Run locally

Any static server works:

```bash
python3 -m http.server 8000
# open http://localhost:8000 — localhost is allowed camera/GPS access
```

## Structure

```
index.html            landing page
play/index.html       the entire game (single file, no build step)
play/config.js        optional shared-ledger ID
manifest.webmanifest  PWA manifest
sw.js                 service worker (installability + shell cache)
icons/                app icons
PROMPT.md             the one-shot build prompt that specifies this game
```

## License

MIT. Map data © OpenStreetMap contributors.
