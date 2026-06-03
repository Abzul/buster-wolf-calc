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

## Stages

| # | Stage | Center KB | Ledge KB | Ceiling KB |
|---|-------|-----------|----------|------------|
| 1 | Final Destination | 200.0 | 150.2 | 190.0 |
| 2 | Battlefield | 198.0 | 149.2 | 203.0 |
| 3 | Small Battlefield | 200.0 | 150.0 | 190.0 |
| 4 | Pokémon Stadium 2 | 199.0 | 150.2 | 190.0 |
| 5 | Hollow Bastion | 200.0 | 150.2 | 190.0 |
| 6 | Yggdrasil's Altar | 199.0 | 149.2 | 190.0 |
| 7 | Smashville | 201.0 | 150.2 | 201.0 |
| 8 | Kalos Pokémon League | 197.0 | 148.2 | 203.0 |
| 9 | Town & City | 202.0 | 151.2 | 206.0 |
| 10 | Pokémon Stadium 1 | 195.0 | 145.0 | 190.0 |
| 11 | Dream Land (64) | 195.0 | 145.0 | 202.0 |
| 12 | Yoshi's Story | 206.0 | 156.0 | 190.0 |
| 13 | Lylat Cruise | 205.0 | 155.0 | 190.0 |
| 14 | Castle Siege | 210.0 | 160.0 | 190.0 |
| 15 | Midgar | 195.0 | 145.0 | 202.0 |
| 16 | Umbra Clock Tower | 195.0 | 145.0 | 202.0 |
| 17 | Unova Pokémon League | 202.0 | 152.0 | 200.0 |
| 18 | WarioWare Inc. | 210.0 | 160.0 | 220.0 |
| 19 | Northern Cave | 202.0 | 152.0 | 187.0 |
| 20 | Fountain of Dreams | 200.0 | 150.0 | 202.0 |
| 21 | Mementos | 190.0 | 140.0 | 200.0 |
| 22 | Spiral Mountain | 200.0 | 150.0 | 190.0 |
| 23 | King of Fighters Stadium | 210.0 | 160.0 | 215.0 |
| 24 | Spring Stadium | 190.0 | 140.0 | 212.0 |
| 25 | Minecraft World | 190.0 | 140.0 | 190.0 |
| 26 | Mishima Dojo | 210.0 | 160.0 | 175.0 |
| 27 | PictoChat 2 | 208.0 | 158.0 | 202.0 |
| 28 | Wily Castle | 196.0 | 146.0 | 220.0 |
| 29 | Yoshi's Island (Melee) | 210.0 | 160.0 | 190.0 |
| 30 | Halberd | 205.0 | 155.0 | 220.0 |
| 31 | Frigate Orpheon | 199.0 | 149.0 | 194.0 |
| 32 | Skyloft | 205.0 | 155.0 | 202.0 |
| 33 | Mushroom Kingdom U | 195.0 | 145.0 | 212.0 |
| 34 | Duck Hunt | 195.0 | 145.0 | 190.0 |
| 35 | Wuhu Island | 200.0 | 150.0 | 220.0 |
| 36 | Brinstar | 210.0 | 160.0 | 195.0 |
| 37 | Green Greens | 200.0 | 150.0 | 200.0 |
| 38 | Cloud Sea of Alrest | 194.0 | 144.0 | 190.0 |

> Values for the original 8 competitive stages (rows 1-9) are labbed data. Extended stages (rows 10-38) are estimated from blast zone coordinates and should be considered approximates.

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

