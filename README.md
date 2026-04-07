# Marathon Training Plan — Sub 4:00

An interactive 10-week marathon training tracker. Log workouts, track progress, and follow a science-backed plan to break 4 hours.

## Live App

**[kaiwhitaker.github.io/marathon-training-app](https://kaiwhitaker.github.io/marathon-training-app)**

## Features

- **10-week structured plan** — Base → Build → Peak → Taper → Race
- **Workout logging** — Distance, pace, effort level, and notes for every session
- **Progress tracking** — Total miles run, workouts completed, % of plan done
- **Visual mileage chart** — Planned vs. actual volume per week
- **Fueling protocol** — Science-backed nutrition strategy for long runs and race day
- **Race day pacing plan** — Mile-by-mile strategy for sub-4:00
- **Persistent storage** — Logs save to your browser's localStorage (no account needed)
- **Mobile-friendly** — Designed for phone use, add to home screen for app-like experience

## Files

- `index.html` — The entire app in a single file (React via CDN, no build step)
- `marathon-training-plan.jsx` — Claude artifact version (for use inside Claude.ai)

## Usage

Open `index.html` in any browser, or visit the GitHub Pages link above. Your workout logs persist in localStorage on that device/browser.

### Deploy to GitHub Pages

The app is a single `index.html` file. To enable GitHub Pages:

1. Go to **Settings → Pages** in this repo
2. Set source to **Deploy from a branch**
3. Select **main** branch, **/ (root)** folder
4. Save — your app will be live at `https://kaiwhitaker.github.io/marathon-training-app`

## Target Races (June 2026)

- Utah Valley Marathon — Sat, June 6 (Provo, UT)
- Wicked Fast Marathon — Sat, June 13 (El Cajon, CA)

## Built With

React 18 (CDN), vanilla JS, localStorage. No build tools, no dependencies to install.
