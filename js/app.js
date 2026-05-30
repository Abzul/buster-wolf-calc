let selectedChar = null;
let selectedRage = RAGE_LEVELS[4];
let selectedDI = 'none';
let selectedStage = 'fd';
let sortMode = 'name';
let sortAsc = true;
let searchQuery = '';

function init() {
  renderGrid();
  setupEventListeners();
}

function renderGrid() {
  let list = document.getElementById('character-list');
  let chars = getFilteredAndSortedChars();
  list.innerHTML = '';
  chars.forEach(c => {
    let box = document.createElement('div');
    box.className = 'character-box';
    box.dataset.name = c.name.toLowerCase();
    box.style.backgroundColor = c.bg;
    let textClass = c.textDark ? 'text-dark' : '';
    box.innerHTML = `
      <div class="characterImageContainer ${textClass}">
        <img class="char-portrait" src="${CDN_BASE}${c.cdn}.png" alt="${c.name}" loading="lazy">
        <div class="grid-percRange" id="perc-${c.id}">-</div>
        <div class="grid-weight">${c.weight}</div>
        <div class="characterName">${c.name}</div>
      </div>
      <div class="characterTitleBar">${c.name}</div>
    `;
    box.addEventListener('click', () => openCharacter(c));
    list.appendChild(box);
  });
  updateGridPercents();
}

function updateGridPercents() {
  let chars = getFilteredAndSortedChars();
  chars.forEach(c => {
    let el = document.getElementById('perc-' + c.id);
    if (!el) return;
    if (selectedChar && selectedChar.id === c.id) {
      el.textContent = '-';
      return;
    }

    let p = findKillPercent(c.weight, STAGES[selectedStage].centerKB, selectedRage.mult, DI_FACTORS[selectedDI]);
    el.textContent = p + '%';
  });
}

function getFilteredAndSortedChars() {
  let chars = [...CHARACTERS];
  if (searchQuery) {
    let q = searchQuery.toLowerCase();
    chars = chars.filter(c => c.name.toLowerCase().includes(q));
  }
  chars.sort((a, b) => {
    let cmp = 0;
    if (sortMode === 'name') cmp = a.name.localeCompare(b.name);
    else if (sortMode === 'weight') cmp = a.weight - b.weight;
    else if (sortMode === 'fallspeed') cmp = a.fallspeed - b.fallspeed;
    return sortAsc ? cmp : -cmp;
  });
  return chars;
}

function openCharacter(c) {
  selectedChar = c;
  document.getElementById('sidebar').classList.remove('open');
  renderGrid();

  let modal = document.getElementById('modal');
  let underlay = document.getElementById('underlay');
  let stage = STAGES[selectedStage];

  let centerPerc = findKillPercent(c.weight, stage.centerKB, selectedRage.mult, DI_FACTORS[selectedDI]);
  let ledgePerc = findKillPercent(c.weight, stage.ledgeKB, selectedRage.mult, DI_FACTORS[selectedDI]);
  let diff = computeDifficulty(ledgePerc, centerPerc);

  let header = document.getElementById('modal-header');
  header.style.background = `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(${CDN_BASE}${c.cdn}.png) center/cover no-repeat, ${c.bg}`;
  header.classList.remove('text-dark');

  document.getElementById('modal-name').textContent = c.name;
  document.getElementById('modal-name').classList.remove('text-dark');

  document.getElementById('modal-weight').textContent = c.weight;
  document.getElementById('modal-fallspeed').textContent = c.fallspeed.toFixed(3);
  document.getElementById('modal-gravity').textContent = c.gravity.toFixed(3);

  document.getElementById('modal-center').textContent = centerPerc + '%';
  document.getElementById('modal-ledge').textContent = ledgePerc + '%';

  let diffEl = document.getElementById('modal-difficulty');
  diffEl.textContent = diff.label;
  diffEl.className = 'diff-badge ' + diff.class;

  let stagesContainer = document.getElementById('modal-stages');
  let html = '<table class="stages-table"><thead><tr><th>Stage</th><th>Center</th><th>Ledge</th><th>Diff</th></tr></thead><tbody>';
  for (let [key, s] of Object.entries(STAGES)) {
    let ctr = findKillPercent(c.weight, s.centerKB, selectedRage.mult, DI_FACTORS[selectedDI]);
    let ldg = findKillPercent(c.weight, s.ledgeKB, selectedRage.mult, DI_FACTORS[selectedDI]);
    let d = computeDifficulty(ldg, ctr);
    html += `<tr><td class="stg">${s.label}</td><td class="ctr">${ctr}%</td><td class="ldg">${ldg}%</td><td><span class="diff-badge ${d.class}" style="font-size:10px">${d.label}</span></td></tr>`;
  }
  html += '</tbody></table>';
  stagesContainer.innerHTML = html;

  modal.classList.add('active');
  underlay.classList.add('active');
  document.body.classList.add('no-scroll');
}

function closeModal() {
  selectedChar = null;
  document.getElementById('modal').classList.remove('active');
  document.getElementById('underlay').classList.remove('active');
  document.body.classList.remove('no-scroll');
  renderGrid();
}

function computeDifficulty(minP, maxP) {
  let range = maxP - minP;
  if (range <= 6)  return { label: 'VERY HARD', class: 'very-hard' };
  if (range <= 11) return { label: 'HARD', class: 'hard' };
  if (range <= 22) return { label: 'AVERAGE', class: 'average' };
  if (range <= 30) return { label: 'EASY', class: 'easy' };
  return { label: 'VERY EASY', class: 'very-easy' };
}

function navigateChar(dir) {
  if (!selectedChar) return;
  let chars = getFilteredAndSortedChars();
  let idx = chars.findIndex(c => c.id === selectedChar.id);
  let newIdx = idx + dir;
  if (newIdx >= 0 && newIdx < chars.length) openCharacter(chars[newIdx]);
}

function setupEventListeners() {
  document.getElementById('underlay').addEventListener('click', closeModal);
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('prev-char').addEventListener('click', () => navigateChar(-1));
  document.getElementById('next-char').addEventListener('click', () => navigateChar(1));

  document.getElementById('search').addEventListener('input', e => {
    searchQuery = e.target.value;
    let box = document.getElementById('search-box');
    if (searchQuery) box.classList.add('active'); else box.classList.remove('active');
    renderGrid();
  });
  document.getElementById('search-clear').addEventListener('click', () => {
    document.getElementById('search').value = '';
    searchQuery = '';
    document.getElementById('search-box').classList.remove('active');
    renderGrid();
  });

  document.querySelectorAll('#rage-group .rage-btn, .sticky-settings .rage-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      let group = this.closest('.btn-row') || this.parentElement;
      group.querySelectorAll('.rage-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      let allRageBtns = document.querySelectorAll('.rage-btn');
      allRageBtns.forEach(b => {
        if (b.dataset.rage === this.dataset.rage) b.classList.add('active');
        else b.classList.remove('active');
      });
      selectedRage = RAGE_LEVELS[parseInt(this.dataset.rage)];
      if (selectedChar) { let c = selectedChar; selectedChar = null; openCharacter(c); }
      else updateGridPercents();
    });
  });

  document.querySelectorAll('.di-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.di-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      selectedDI = this.dataset.di;
      if (selectedChar) { let c = selectedChar; selectedChar = null; openCharacter(c); }
      else updateGridPercents();
    });
  });

  document.querySelectorAll('.stage-sel-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.stage-sel-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      selectedStage = this.dataset.stage;
      if (selectedChar) { let c = selectedChar; selectedChar = null; openCharacter(c); }
      else updateGridPercents();
    });
  });

  document.querySelectorAll('.sort-option').forEach(opt => {
    opt.addEventListener('click', function() {
      let mode = this.dataset.sort;
      if (mode === sortMode) { sortAsc = !sortAsc; }
      else { sortMode = mode; sortAsc = true; }
      document.querySelectorAll('.sort-option').forEach(o => {
        o.classList.remove('active');
        let arrow = o.querySelector('.sort-arrow');
        if (arrow) arrow.textContent = '';
      });
      this.classList.add('active');
      let arrow = this.querySelector('.sort-arrow');
      if (arrow) arrow.textContent = sortAsc ? ' ▲' : ' ▼';
      if (selectedChar) { let c = selectedChar; selectedChar = null; openCharacter(c); }
      else renderGrid();
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && selectedChar) closeModal();
    if (e.key === 'ArrowLeft' && selectedChar) navigateChar(-1);
    if (e.key === 'ArrowRight' && selectedChar) navigateChar(1);
  });

  document.getElementById('sidebar-toggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });
}
