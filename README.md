# Terry % Reference

Interactive kill percent calculator for Terry Bogard's **Super Special Moves** in Super Smash Bros. Ultimate. Switch between **Buster Wolf** (horizontal) and **Power Geyser** (vertical/ceiling). Shows exact KO percents for every character across 8 legal stages, with configurable rage and DI.

## Features

- **Two moves** — Buster Wolf (horizontal, center/ledge) and Power Geyser (vertical, ceiling)
- **All 88 characters** with weight, fallspeed, and gravity stats
- **SSBU knockback formula** — precise binary search calculation
- **Rage slider** — Terry's rage multiplier from 100% to 150% (10% steps)
- **DI toggle** — No DI vs optimal DI (0.87x)
- **8 legal stages** — FD, BF, SV, TC, PS2, KPL, HB, YA — each with individually adjusted blast zone thresholds
- **Sort & search** — by name, weight, or fallspeed; live character search
- **Kill percents** — center stage and ledge (BW), ceiling (PG), plus full per-stage breakdown
- **Difficulty rating** — based on the center-to-ledge range (VERY HARD → VERY EASY)
- **Keyboard shortcuts** — ← → to navigate characters, ESC to close modal
- **Responsive** — desktop and mobile

## Move data

### Buster Wolf
- **Input:** `↓ ↘ → ↓ ↘ → + A/B` (simplified `↓ → ↓ → + A/B`)
- **Damage:** 40% (5+20+15)
- **BKB:** 73 | **KBG:** 63 | **Angle:** 0° (horizontal hitgrab)
- **Confirms:** Dtilt, Ftilt, Jab 1+2

### Power Geyser
- **Input:** `→ ↘ ↓ ↙ ← + A/B` (simplified `→ ← ↓ → + A/B`)
- **Damage:** 26% (clean), 23% (mid), 20% (far)
- **BKB:** 100 | **KBG:** 41 | **Angle:** 70° (vertical launcher)
- **Confirms:** Dtilt, Ftilt, Jab 1+2

> Both moves require Terry at **100%+** (GO! meter active).

## How it works

The calculator uses the exact SSBU knockback formula:

```
raw = ((p/10 + p*dmg/20) * 1.4 * 200/(w+100) + 18) * KBG/100 + BKB
```

Kill percent is found via binary search over `[0, 200]` until the knockback exceeds the stage's blast zone threshold (center/ledge for BW, ceiling for PG).

## Usage

1. Open the sidebar (☰)
2. Select **Buster Wolf** or **Power Geyser** via the tabs in the header
3. Set Terry's current **rage %** (only ≥100% matters)
4. Toggle **DI** if you expect optimal DI
5. Select the **stage** you're playing on
6. Click any character to see their kill percents
7. Sort by name/weight/fallspeed using the sidebar buttons

## Tech

Vanilla HTML, CSS, JavaScript — no frameworks, no build tools.

Character portraits loaded from Nintendo's [Smash Bros. CDN](https://www.smashbros.com/).

Data and formula extracted from [rubendal/SSBU-Calculator](https://github.com/rubendal/SSBU-Calculator) and calibrated against SmashWiki community data.

## Live site

[https://abzul.github.io/buster-wolf-calc/](https://abzul.github.io/buster-wolf-calc/)

## v1.1.0 — Power Geyser + Rebrand

- **Power Geyser** — new tab to calculate ceiling KO percents (BKB=100, KBG=41, 26% damage, 70°)
- **Move tabs** — switch between Buster Wolf and Power Geyser in the header
- **Color themes** — gold accents for BW, orange accents for PG
- **Contextual FAQ** — separate accordion content for each move
- **Page rebrand** — renamed from "Buster Wolf %" to "Terry %"

## v1.0.2 — Changelog

- **HUD Minimalism** — compact header (no subtitle), cleaner character cards
- **Percent badge** — dark semisolid background, white text, colored border; always readable
- **Title bar** — no visible gradient, heavy text-shadow only, sits over portrait
- **Duck Hunt portrait** — fixed `object-position` to properly show the dog
- **Sidebar pills** — pill-shaped buttons (border-radius 20px), hover background accent
- **Smooth transitions** — all animations bumped to 0.25-0.35s with cubic-bezier
- **Modal stats** — unicode icons, tighter padding, Oswald 22px values
- **Kill percent** — arcade-style 36px Oswald
- **Fade-in animation** — cards animate in on grid load
- **Selected character highlight** — colored border + glow on active card
- **Slide animation** — when navigating between characters with arrow keys
- **OG Image** — Terry visual preview when sharing on social media
- **Responsive rage buttons** — more compact layout on mobile
- **Flicker-free navigation** — no DOM recreation on open/close/navigate; only text updates

## v1.0.1 — Changelog

- **Dark/Light mode** — toggle ☾/☀ with localStorage persistence
- **FAQ / About** — accordion modal explaining Buster Wolf, formula, rage, DI, blast zones, kill confirms, and the "Are you OK?" origin
- **Modal header redesign** — solid character color background + spray thumbnail by the name
- **Favicon** — Terry spray in the browser tab
- **Accessibility** — skip to content, focus trap in modals, ARIA labels/pressed, roles
- **Search debounce** — 150ms to avoid unnecessary re-renders
- **Empty state** — message when no search results found
- **Image fallback** — character first letter if CDN fails
- **Social links** — X and Discord in sidebar + credits
- **Responsive** — sidebar full-width on mobile
- **OG meta tags** — social preview
