const BUSTER_WOLF = {
  damage: 20,
  baseDamage: 20,
  bkb: 73,
  kbg: 63,
  angle: 0
};

const POWER_GEYSER = {
  damage: 26,
  baseDamage: 26,
  bkb: 100,
  kbg: 41,
  angle: 70
};

const CENTER_KB_THRESHOLD = 200;
const LEDGE_KB_THRESHOLD = 150.2;
const CEILING_KB_THRESHOLD = 190;

function rawKnockback(preHitPercent, weight, move) {
  let p = preHitPercent + move.damage;
  let wf = 200 / (weight + 100);
  let raw = ((p / 10 + (p * move.baseDamage) / 20) * 1.4 * wf + 18) * (move.kbg / 100) + move.bkb;
  return raw;
}

function rageMultiplier(terryPercent) {
  if (terryPercent <= 35) return 1;
  if (terryPercent >= 150) return 1.1;
  return 1 + (terryPercent - 35) * (1.1 - 1) / (150 - 35);
}

function findKillPercent(weight, kbThreshold, rage, diFactor, move) {
  if (!move) move = BUSTER_WOLF;
  if (diFactor === undefined) diFactor = 1;
  if (rage === undefined) rage = 1;
  let lo = 0, hi = 200;
  for (let iter = 0; iter < 100; iter++) {
    let mid = (lo + hi) / 2;
    let kb = rawKnockback(mid, weight, move) * rage * diFactor;
    if (kb >= kbThreshold) {
      hi = mid;
    } else {
      lo = mid;
    }
  }
  return Math.round((lo + hi) / 2);
}

const STAGES = {
  fd:  { name:"Final Destination",    label:"Final Dest.",  centerKB:CENTER_KB_THRESHOLD, ledgeKB:LEDGE_KB_THRESHOLD, ceilingKB:CEILING_KB_THRESHOLD },
  bf:  { name:"Battlefield",          label:"Battlefield",  centerKB:CENTER_KB_THRESHOLD-2, ledgeKB:LEDGE_KB_THRESHOLD-1, ceilingKB:CEILING_KB_THRESHOLD+13 },
  sv:  { name:"Smashville",           label:"Smashville",   centerKB:CENTER_KB_THRESHOLD+1, ledgeKB:LEDGE_KB_THRESHOLD, ceilingKB:CEILING_KB_THRESHOLD+11 },
  tc:  { name:"Town & City",          label:"Town & City",  centerKB:CENTER_KB_THRESHOLD+2, ledgeKB:LEDGE_KB_THRESHOLD+1, ceilingKB:CEILING_KB_THRESHOLD+16 },
  ps2: { name:"Pokemon Stadium 2",    label:"Pokémon Stad.", centerKB:CENTER_KB_THRESHOLD-1, ledgeKB:LEDGE_KB_THRESHOLD, ceilingKB:CEILING_KB_THRESHOLD },
  kpl: { name:"Kalos Pokemon League", label:"Kalos League", centerKB:CENTER_KB_THRESHOLD-3, ledgeKB:LEDGE_KB_THRESHOLD-2, ceilingKB:CEILING_KB_THRESHOLD+13 },
  hb:  { name:"Hollow Bastion",       label:"Hollow Bastion", centerKB:CENTER_KB_THRESHOLD, ledgeKB:LEDGE_KB_THRESHOLD, ceilingKB:CEILING_KB_THRESHOLD },
  ya:  { name:"Yggdrasil's Altar",    label:"Yggdrasil",    centerKB:CENTER_KB_THRESHOLD-1, ledgeKB:LEDGE_KB_THRESHOLD-1, ceilingKB:CEILING_KB_THRESHOLD }
};

const RAGE_LEVELS = [
  { label: "100%", value: 100, mult: rageMultiplier(100) },
  { label: "110%", value: 110, mult: rageMultiplier(110) },
  { label: "120%", value: 120, mult: rageMultiplier(120) },
  { label: "130%", value: 130, mult: rageMultiplier(130) },
  { label: "140%", value: 140, mult: rageMultiplier(140) },
  { label: "150%", value: 150, mult: rageMultiplier(150) }
];

const DI_FACTORS = {
  none: 1.0,
  optimal: 0.87
};
