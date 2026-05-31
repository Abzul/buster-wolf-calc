let selectedChar = null;
let selectedRage = RAGE_LEVELS[0];
let selectedDI = 'none';
let selectedStage = 'fd';
let sortMode = 'name';
let sortAsc = true;
let searchQuery = '';
let focusableElements = [];
let lastFocusedEl = null;

function debounce(fn, ms) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
}

function showToast(msg) {
  let el = document.getElementById('notification');
  el.textContent = msg;
  el.style.display = 'block';
  clearTimeout(el._hide);
  el._hide = setTimeout(() => { el.style.display = 'none'; }, 2000);
}

function init() {
  renderGrid();
  setupEventListeners();
  applyTheme();
}

function renderGrid() {
  let list = document.getElementById('character-list');
  let chars = getFilteredAndSortedChars();
  list.innerHTML = '';
  if (chars.length === 0) {
    let empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.innerHTML = '<span class="empty-icon">&#x1F50D;</span>No characters match "<strong>' + searchQuery + '</strong>"';
    list.appendChild(empty);
    return;
  }
  chars.forEach(c => {
    let box = document.createElement('div');
    box.className = 'character-box';
    box.dataset.name = c.name.toLowerCase();
    box.style.backgroundColor = c.bg;
    let textClass = c.textDark ? 'text-dark' : '';
    let pos = c.portraitPos || 'center';
    box.innerHTML = `
      <div class="characterImageContainer ${textClass}">
        <img class="char-portrait" src="${CDN_BASE}${c.cdn}.png" alt="${c.name}" loading="lazy" style="object-position:${pos}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
        <div class="char-img-fallback" style="display:none">${c.name.charAt(0)}</div>
        <div class="grid-percRange" id="perc-${c.id}">-</div>
        <div class="characterName">${c.name}</div>
      </div>
      <div class="characterTitleBar">${c.name}</div>
    `;
    box.addEventListener('click', () => openCharacter(c));
    box.setAttribute('tabindex', '0');
    box.setAttribute('role', 'button');
    box.setAttribute('aria-label', c.name + ', weight ' + c.weight);
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

function updateModalContent(c) {
  let stage = STAGES[selectedStage];
  let centerPerc = findKillPercent(c.weight, stage.centerKB, selectedRage.mult, DI_FACTORS[selectedDI]);
  let ledgePerc = findKillPercent(c.weight, stage.ledgeKB, selectedRage.mult, DI_FACTORS[selectedDI]);
  let diff = computeDifficulty(ledgePerc, centerPerc);

  let header = document.getElementById('modal-header');
  header.style.background = c.bg;

  document.getElementById('modal-thumb').src = `${CDN_BASE_PICT}${c.cdn}.png`;
  document.getElementById('modal-thumb').alt = c.name;

  let nameEl = document.getElementById('modal-name');
  nameEl.textContent = c.name;
  nameEl.className = 'char-name' + (c.textDark ? ' text-dark' : '');

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
}

function openCharacter(c) {
  selectedChar = c;
  document.getElementById('sidebar').classList.remove('open');
  renderGrid();
  setSelectedChar(c);
  updateModalContent(c);

  let modal = document.getElementById('modal');
  let underlay = document.getElementById('underlay');
  modal.classList.add('active');
  underlay.classList.add('active');
  document.body.classList.add('no-scroll');
  modal.setAttribute('aria-hidden', 'false');
  underlay.setAttribute('aria-hidden', 'false');
  trapFocus(modal);
  document.getElementById('modal-close').focus();
}

function setSelectedChar(c) {
  document.querySelectorAll('.character-box').forEach(b => b.classList.remove('selected'));
  let box = document.querySelector(`.character-box[data-name="${c.name.toLowerCase()}"]`);
  if (box) box.classList.add('selected');
}

function closeModal() {
  selectedChar = null;
  document.querySelectorAll('.character-box').forEach(b => b.classList.remove('selected'));
  let modal = document.getElementById('modal');
  let underlay = document.getElementById('underlay');
  modal.classList.remove('active');
  underlay.classList.remove('active');
  document.body.classList.remove('no-scroll');
  modal.setAttribute('aria-hidden', 'true');
  underlay.setAttribute('aria-hidden', 'true');
  releaseFocus();
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
  if (newIdx >= 0 && newIdx < chars.length) {
    let body = document.querySelector('.modal-body');
    body.classList.add('slide-out');
    setTimeout(() => {
      selectedChar = chars[newIdx];
      setSelectedChar(selectedChar);
      updateGridPercents();
      updateModalContent(selectedChar);
      body.classList.remove('slide-out');
    }, 80);
  }
}

function trapFocus(container) {
  let focusable = container.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  focusableElements = Array.from(focusable);
  lastFocusedEl = document.activeElement;
  function handler(e) {
    if (e.key === 'Tab') {
      let first = focusableElements[0];
      let last = focusableElements[focusableElements.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }
  container._trapHandler = handler;
  document.addEventListener('keydown', handler);
}

function releaseFocus() {
  ['modal', 'faq-modal'].forEach(id => {
    let el = document.getElementById(id);
    if (el && el._trapHandler) {
      document.removeEventListener('keydown', el._trapHandler);
      el._trapHandler = null;
    }
  });
  if (lastFocusedEl) lastFocusedEl.focus();
}

function applyTheme() {
  let saved = localStorage.getItem('bw-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  document.getElementById('theme-toggle').textContent = saved === 'dark' ? '\u263E' : '\u2600';
}

function toggleTheme() {
  let current = document.documentElement.getAttribute('data-theme');
  let next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('bw-theme', next);
  document.getElementById('theme-toggle').textContent = next === 'dark' ? '\u263E' : '\u2600';
  showToast(next === 'dark' ? 'Dark mode' : 'Light mode');
}

function openFAQ() {
  let modal = document.getElementById('faq-modal');
  let underlay = document.getElementById('underlay');
  modal.classList.add('active');
  underlay.classList.add('active');
  document.body.classList.add('no-scroll');
  modal.setAttribute('aria-hidden', 'false');
  underlay.setAttribute('aria-hidden', 'false');
  trapFocus(modal);
  document.getElementById('faq-close').focus();
}

function closeFAQ() {
  let modal = document.getElementById('faq-modal');
  let underlay = document.getElementById('underlay');
  modal.classList.remove('active');
  underlay.classList.remove('active');
  document.body.classList.remove('no-scroll');
  modal.setAttribute('aria-hidden', 'true');
  underlay.setAttribute('aria-hidden', 'true');
  releaseFocus();
}

function toggleAccordion(btn) {
  let panel = btn.nextElementSibling;
  let isOpen = panel.classList.contains('open');
  document.querySelectorAll('.accordion-panel.open, .accordion-btn.open').forEach(el => {
    el.classList.remove('open');
    if (el.classList.contains('accordion-btn')) el.setAttribute('aria-expanded', 'false');
  });
  if (!isOpen) {
    panel.classList.add('open');
    btn.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
  }
}

function setupEventListeners() {
  document.getElementById('underlay').addEventListener('click', () => {
    if (document.getElementById('modal').classList.contains('active')) closeModal();
    if (document.getElementById('faq-modal').classList.contains('active')) closeFAQ();
  });

  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
  document.getElementById('faq-toggle').addEventListener('click', openFAQ);
  document.getElementById('faq-close').addEventListener('click', closeFAQ);

  document.getElementById('modal').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
  });
  document.getElementById('faq-modal').addEventListener('click', function(e) {
    if (e.target === this) closeFAQ();
  });
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('prev-char').addEventListener('click', () => navigateChar(-1));
  document.getElementById('next-char').addEventListener('click', () => navigateChar(1));

  document.querySelectorAll('.accordion-btn').forEach(btn => {
    btn.addEventListener('click', function() { toggleAccordion(this); });
  });

  let debouncedSearch = debounce(function() {
    renderGrid();
  }, 150);

  document.getElementById('search').addEventListener('input', e => {
    searchQuery = e.target.value;
    let box = document.getElementById('search-box');
    if (searchQuery) box.classList.add('active'); else box.classList.remove('active');
    debouncedSearch();
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
      if (selectedChar) { updateModalContent(selectedChar); updateGridPercents(); }
      else updateGridPercents();
    });
  });

  document.querySelectorAll('.di-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.di-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      selectedDI = this.dataset.di;
      if (selectedChar) { updateModalContent(selectedChar); updateGridPercents(); }
      else updateGridPercents();
    });
  });

  document.querySelectorAll('.stage-sel-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.stage-sel-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      selectedStage = this.dataset.stage;
      if (selectedChar) { updateModalContent(selectedChar); updateGridPercents(); }
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
      if (selectedChar) { let c = selectedChar; renderGrid(); setSelectedChar(c); updateGridPercents(); }
      else renderGrid();
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && selectedChar) closeModal();
    if (e.key === 'Escape' && document.getElementById('faq-modal').classList.contains('active')) closeFAQ();
    if (e.key === 'ArrowLeft' && selectedChar) navigateChar(-1);
    if (e.key === 'ArrowRight' && selectedChar) navigateChar(1);
  });

  document.getElementById('sidebar-toggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });

  document.querySelectorAll('.rage-btn, .di-btn, .stage-sel-btn').forEach(btn => {
    if (btn.classList.contains('active')) btn.setAttribute('aria-pressed', 'true');
    btn.addEventListener('click', function() {
      let group = this.closest('.btn-row') || this.parentElement;
      group.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', 'false'));
      this.setAttribute('aria-pressed', 'true');
    });
    btn.setAttribute('role', 'button');
  });
}
