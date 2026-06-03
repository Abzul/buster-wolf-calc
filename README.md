# Terry % Reference

Interactive kill percent calculator for Terry Bogard's **Super Special Moves** in Super Smash Bros. Ultimate. Switch between **Buster Wolf** (horizontal) and **Power Geyser** (vertical/ceiling). Shows exact KO percents for every character across **38 stages**, with configurable rage and DI.

▶ **[https://abzul.github.io/buster-wolf-calc/](https://abzul.github.io/buster-wolf-calc/)**

## Features

- **Two moves** — Buster Wolf (horizontal, center/ledge) and Power Geyser (vertical, ceiling)
- **All 88 characters** with weight, fallspeed, and gravity stats
- **SSBU knockback formula** — precise binary search calculation
- **Rage slider** — Terry's rage multiplier from 100% to 150% (10% steps)
- **DI toggle** — No DI vs optimal DI (0.87x)
- **8 competitive stages** — FD, BF, SV, TC, PS2, KPL, HB, YA — each with precisely labbed blast zone thresholds
- **+30 extended stages** — drop down to any other legal stage; thresholds estimated from blast zone coordinates
- **Stage search** — filter the extended dropdown to quickly find any stage
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

