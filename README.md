# Airplane Mode

A prototype of social media for flights with no wifi. Every account is a make-believe AI character, the
whole feed is packed before takeoff, and a storyline plays out in time with the length of your flight.

- **Harbor City** (grown-ups): a gossip mystery (who runs @overheard_hc changes every flight), a breakup
  with four endings, a live basketball game, rivals and fans who remember how you treat them, and replies
  that match your tone (snark gets snark back, rage bait gets taken).
- **Treetop Town** (kids, locked with a parent PIN): animal friends, a gentle mystery, a baby bird learning
  to fly, a drawing pad instead of photos, stars instead of like counts, and a word filter.
- **Learn tab**: a swipe-through deck of fact-checked facts, quizzes and myth-busters.

## Play it

The installable version lives at **https://mrvk64.github.io/airplane-mode/**. Open it once with a
connection, then use your browser's "Add to Home Screen" (on iPhone: Share → Add to Home Screen). After
that it opens with no internet at all, even after a refresh or a restart. Flights are saved on the phone.

## Build and try it

```bash
node tools/build.js
```

This bundles `src/` into:

- `dist/`, the GitHub Pages site: `index.html` (the whole app in one file), `sw.js` (the offline worker),
  `manifest.webmanifest` and `icons/`.
- `artifact/airplane-mode.html`, the claude.ai artifact page (not committed).

To try it locally:

```bash
node tools/serve.js
```

Then open http://localhost:8790/.

## Releasing an update

1. Run `node tools/build.js`. It stamps a new worker version automatically whenever the app changes, so
   installed phones pick up the update on their next launch with a connection.
2. Commit everything, including `dist/`.
3. Push from GitHub Desktop. The "Deploy to GitHub Pages" action publishes `dist/` in about a minute.

The icons come from `node tools/make-icons.js` (writes `site/icons/`); you only need it if the icon changes.

## Layout

| File | What it holds |
| --- | --- |
| `src/js/cast.js`, `story.js` | Harbor City characters and the timed storyline |
| `src/js/content-feed.js`, `content-replies.js`, `content-tone.js` | Everyday posts, topic replies, tone-matched replies and rivalries |
| `src/js/kids-story.js`, `kids-content.js` | Treetop Town, in the same shapes |
| `src/js/content-learn.js` | Learn cards (each has a `src` noting where the fact was checked) |
| `src/js/art.js`, `faces.js` | Illustrated photos and avatars, drawn in code |
| `src/js/app.js` | The engine and the app |
| `site/` | The offline worker, manifest and icons the build copies into `dist/` |

`__airplaneMode.skipTo(0.5)` in the browser console jumps the current flight to 50%, which is handy for testing.

In a real phone app, an on-device AI model would write replies live; this prototype picks them from a large
pre-written set.
