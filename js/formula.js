const BUSTER_WOLF = {
  damage: 20,
  baseDamage: 20,
  bkb: 73,
  kbg: 63,
  angle: 0
};

const CENTER_KB_THRESHOLD = 200;
const LEDGE_KB_THRESHOLD = 150.2;

function rawKnockback(preHitPercent, weight) {
  let p = preHitPercent + BUSTER_WOLF.damage;
  let wf = 200 / (weight + 100);
  let raw = ((p / 10 + (p * BUSTER_WOLF.baseDamage) / 20) * 1.4 * wf + 18) * (BUSTER_WOLF.kbg / 100) + BUSTER_WOLF.bkb;
  return raw;
}

function rageMultiplier(terryPercent) {
  if (terryPercent <= 35) return 1;
  if (terryPercent >= 150) return 1.1;
  return 1 + (terryPercent - 35) * (1.1 - 1) / (150 - 35);
}

function findKillPercent(weight, kbThreshold, rage, diFactor) {
  if (diFactor === undefined) diFactor = 1;
  if (rage === undefined) rage = 1;
  let lo = 0, hi = 200;
  for (let iter = 0; iter < 100; iter++) {
    let mid = (lo + hi) / 2;
    let kb = rawKnockback(mid, weight) * rage * diFactor;
    if (kb >= kbThreshold) {
      hi = mid;
    } else {
      lo = mid;
    }
  }
  return Math.round((lo + hi) / 2);
}

const STAGES = {
  fd:  { name: "Final Destination",      label: "FD",  centerKB: CENTER_KB_THRESHOLD, ledgeKB: LEDGE_KB_THRESHOLD },
  bf:  { name: "Battlefield",            label: "BF",  centerKB: CENTER_KB_THRESHOLD - 2, ledgeKB: LEDGE_KB_THRESHOLD - 1 },
  sv:  { name: "Smashville",             label: "SV",  centerKB: CENTER_KB_THRESHOLD + 1, ledgeKB: LEDGE_KB_THRESHOLD },
  tc:  { name: "Town & City",            label: "TC",  centerKB: CENTER_KB_THRESHOLD + 2, ledgeKB: LEDGE_KB_THRESHOLD + 1 },
  ps2: { name: "Pokemon Stadium 2",      label: "PS2", centerKB: CENTER_KB_THRESHOLD - 1, ledgeKB: LEDGE_KB_THRESHOLD },
  kpl: { name: "Kalos Pokemon League",   label: "KPL", centerKB: CENTER_KB_THRESHOLD - 3, ledgeKB: LEDGE_KB_THRESHOLD - 2 },
  hb:  { name: "Hollow Bastion",         label: "HB",  centerKB: CENTER_KB_THRESHOLD, ledgeKB: LEDGE_KB_THRESHOLD },
  ya:  { name: "Yggdrasil's Altar",      label: "YA",  centerKB: CENTER_KB_THRESHOLD - 1, ledgeKB: LEDGE_KB_THRESHOLD - 1 }
};

const RAGE_LEVELS = [
  { label: "0%",   value: 0,   mult: 1.0 },
  { label: "50%",  value: 50,  mult: rageMultiplier(50) },
  { label: "60%",  value: 60,  mult: rageMultiplier(60) },
  { label: "80%",  value: 80,  mult: rageMultiplier(80) },
  { label: "100%", value: 100, mult: rageMultiplier(100) },
  { label: "125%", value: 125, mult: rageMultiplier(125) },
  { label: "150%", value: 150, mult: rageMultiplier(150) }
];

const DI_FACTORS = {
  none: 1.0,
  optimal: 0.87
};
