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
  ya:  { name:"Yggdrasil's Altar",    label:"Yggdrasil",    centerKB:CENTER_KB_THRESHOLD-1, ledgeKB:LEDGE_KB_THRESHOLD-1, ceilingKB:CEILING_KB_THRESHOLD },
  sbf: { name:"Small Battlefield",    label:"Small BF",     centerKB:200, ledgeKB:150, ceilingKB:190 },
  ps1: { name:"Pokemon Stadium 1",    label:"Pokémon Stad.1", centerKB:195, ledgeKB:145, ceilingKB:190 },
  dl:  { name:"Dream Land (64)",      label:"Dream Land",   centerKB:195, ledgeKB:145, ceilingKB:202 },
  ys:  { name:"Yoshi's Story",        label:"Yoshi's Story",centerKB:206, ledgeKB:156, ceilingKB:190 },
  lc:  { name:"Lylat Cruise",         label:"Lylat Cruise", centerKB:205, ledgeKB:155, ceilingKB:190 },
  cs:  { name:"Castle Siege",         label:"Castle Siege", centerKB:210, ledgeKB:160, ceilingKB:190 },
  mg:  { name:"Midgar",               label:"Midgar",       centerKB:195, ledgeKB:145, ceilingKB:202 },
  uc:  { name:"Umbra Clock Tower",    label:"Umbra Clock",  centerKB:195, ledgeKB:145, ceilingKB:202 },
  upl: { name:"Unova Pokemon League", label:"Unova League", centerKB:202, ledgeKB:152, ceilingKB:200 },
  ww:  { name:"WarioWare Inc.",       label:"WarioWare",    centerKB:210, ledgeKB:160, ceilingKB:220 },
  nc:  { name:"Northern Cave",        label:"Northern Cave",centerKB:202, ledgeKB:152, ceilingKB:187 },
  fod: { name:"Fountain of Dreams",   label:"Fountain",     centerKB:200, ledgeKB:150, ceilingKB:202 },
  mm:  { name:"Mementos",             label:"Mementos",     centerKB:190, ledgeKB:140, ceilingKB:200 },
  spm: { name:"Spiral Mountain",      label:"Spiral Mt.",   centerKB:200, ledgeKB:150, ceilingKB:190 },
  kof: { name:"King of Fighters Stadium", label:"KOF Stadium", centerKB:210, ledgeKB:160, ceilingKB:215 },
  ss:  { name:"Spring Stadium",       label:"Spring Stad.", centerKB:190, ledgeKB:140, ceilingKB:212 },
  mc:  { name:"Minecraft World",      label:"Minecraft",    centerKB:190, ledgeKB:140, ceilingKB:190 },
  mjd: { name:"Mishima Dojo",         label:"Mishima Dojo", centerKB:210, ledgeKB:160, ceilingKB:175 },
  pc2: { name:"PictoChat 2",          label:"PictoChat 2",  centerKB:208, ledgeKB:158, ceilingKB:202 },
  wc:  { name:"Wily Castle",          label:"Wily Castle",  centerKB:196, ledgeKB:146, ceilingKB:220 },
  yi:  { name:"Yoshi's Island (Melee)",label:"Yoshi Isl.",  centerKB:210, ledgeKB:160, ceilingKB:190 },
  hal: { name:"Halberd",              label:"Halberd",      centerKB:205, ledgeKB:155, ceilingKB:220 },
  fo:  { name:"Frigate Orpheon",      label:"Frigate Orph.",centerKB:199, ledgeKB:149, ceilingKB:194 },
  sk:  { name:"Skyloft",              label:"Skyloft",      centerKB:205, ledgeKB:155, ceilingKB:202 },
  mku: { name:"Mushroom Kingdom U",   label:"Mushroom U",   centerKB:195, ledgeKB:145, ceilingKB:212 },
  dh:  { name:"Duck Hunt",            label:"Duck Hunt",    centerKB:195, ledgeKB:145, ceilingKB:190 },
  wu:  { name:"Wuhu Island",          label:"Wuhu Island",  centerKB:200, ledgeKB:150, ceilingKB:220 },
  br:  { name:"Brinstar",             label:"Brinstar",     centerKB:210, ledgeKB:160, ceilingKB:195 },
  gg:  { name:"Green Greens",         label:"Green Greens", centerKB:200, ledgeKB:150, ceilingKB:200 },
  csa: { name:"Cloud Sea of Alrest",  label:"Cloud Sea",    centerKB:194, ledgeKB:144, ceilingKB:190 }
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
