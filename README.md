# Buster Wolf % Reference

Interactive kill percent calculator for Terry Bogard's **Buster Wolf** in Super Smash Bros. Ultimate. Shows the exact percentage at which Buster Wolf kills every character in the roster, across 8 legal stages, with configurable rage and DI.

## Features

- **All 88 characters** with weight, fallspeed, and gravity stats
- **SSBU knockback formula** — precise binary search calculation
- **Rage slider** — Terry's rage multiplier from 100% to 150% (10% steps)
- **DI toggle** — No DI vs optimal DI (0.87x)
- **8 legal stages** — FD, BF, SV, TC, PS2, KPL, HB, YA — each with individually adjusted blast zone thresholds
- **Sort & search** — by name, weight, or fallspeed; live character search
- **Kill percents** — center stage and ledge, plus a full per-stage breakdown
- **Difficulty rating** — based on the center-to-ledge range (VERY HARD → VERY EASY)
- **Keyboard shortcuts** — ← → to navigate characters, ESC to close modal
- **Responsive** — desktop and mobile

## Kill confirms

- **Dtilt → Buster Wolf** (true ~60-90% depending on weight)
- **Ftilt → Buster Wolf** (pre-tumble, DI-dependent)
- **Jab1+Jab2 → Buster Wolf**

> Buster Wolf is only available when Terry is at **100%+** (GO! meter active).

## How it works

The calculator uses the exact SSBU knockback formula:

```
raw = ((p/10 + p*dmg/20) * 1.4 * 200/(w+100) + 18) * KBG/100 + BKB
```

Where `p` = pre-hit% + 20 (Buster Wolf damage), `w` = target weight, `KBG` = 63, `BKB` = 73.

Kill percent is found via binary search over `[0, 200]` until the knockback exceeds the stage's center or ledge threshold.

## Usage

1. Open the sidebar (☰)
2. Set Terry's current **rage %** (only ≥100% matters)
3. Toggle **DI** if you expect optimal DI
4. Select the **stage** you're playing on
5. Click any character to see their kill percents
6. Sort by name/weight/fallspeed using the sidebar buttons

## Tech

Vanilla HTML, CSS, JavaScript — no frameworks, no build tools.

Character portraits loaded from Nintendo's [Smash Bros. CDN](https://www.smashbros.com/).

Data and formula extracted from [rubendal/SSBU-Calculator](https://github.com/rubendal/SSBU-Calculator) and calibrated against SmashWiki community data.

## Live site

[https://abzul.github.io/buster-wolf-calc/](https://abzul.github.io/buster-wolf-calc/)

## v1.0.1 — Changelog

- **Dark/Light mode** — toggle ☾/☀ con persistencia en localStorage
- **FAQ / About** — modal con acordeón explicando Buster Wolf, fórmula, rage, DI, blast zones, kill confirms y el origen de "Are you OK?"
- **Modal header redesign** — color sólido del personaje + spray thumbnail al lado del nombre
- **Favicon** — spray de Terry en el tab del navegador
- **Accessibility** — skip to content, focus trap en modals, ARIA labels/pressed, roles
- **Search debounce** — 150ms para evitar re-renders innecesarios
- **Empty state** — mensaje cuando no hay resultados de búsqueda
- **Image fallback** — inicial del personaje si la CDN falla
- **Social links** — X y Discord en sidebar + créditos
- **Responsive** — sidebar full-width en mobile
- **Meta tags OG** — preview en redes sociales
