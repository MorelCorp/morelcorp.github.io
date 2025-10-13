const STORAGE_KEY = 'supermemo2_concept_trainer_v1';
const MASTERED_INTERVAL_DAYS = 21;

const defaultCardState = () => ({
  repetition: 0,
  interval: 0,
  ef: 2.5,
  due: Date.now(),
  lastReviewed: null,
  active: false,
  mastered: false,
  lapses: 0,
  history: []
});

const state = {
  sourceUrl: '',
  maxActive: 20,
  cards: {},
  order: [],
  lastRowCount: 0,
  lastSynced: null
};

let currentCardId = null;
let showingAnswer = false;

const elements = {
  promptText: document.getElementById('promptText'),
  answerText: document.getElementById('answerText'),
  cardType: document.getElementById('cardType'),
  revealWrapper: document.getElementById('revealButtonWrapper'),
  showAnswerButton: document.getElementById('showAnswerButton'),
  actionButtons: document.getElementById('actionButtons'),
  studyPanel: document.getElementById('studyPanel'),
  historyList: document.getElementById('historyList'),
  activeCount: document.getElementById('activeCount'),
  dueCount: document.getElementById('dueCount'),
  masteredCount: document.getElementById('masteredCount'),
  totalCount: document.getElementById('totalCount'),
  sourceMeta: document.getElementById('sourceMeta'),
  activeLimitNote: document.getElementById('activeLimitNote'),
  nextDueNote: document.getElementById('nextDueNote'),
  configDialog: document.getElementById('configDialog'),
  sourceInput: document.getElementById('sourceInput'),
  maxActiveInput: document.getElementById('maxActiveInput'),
  syncNote: document.getElementById('syncNote'),
  statusBanner: document.getElementById('statusBanner'),
  syncButton: document.getElementById('syncButton'),
  configButton: document.getElementById('configButton'),
  applySettingsButton: document.getElementById('applySettingsButton'),
  resetButton: document.getElementById('resetButton'),
  actionButtonContainer: document.getElementById('actionButtons'),
  revealButton: document.getElementById('showAnswerButton')
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      Object.assign(state, parsed);
    }
  } catch (err) {
    console.error('Failed to load saved state', err);
  }
}

function persistState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save state', err);
  }
}

function resetProgress() {
  Object.keys(state.cards).forEach((id) => {
    const saved = state.cards[id];
    const fresh = defaultCardState();
    saved.repetition = fresh.repetition;
    saved.interval = fresh.interval;
    saved.ef = fresh.ef;
    saved.due = fresh.due;
    saved.lastReviewed = fresh.lastReviewed;
    saved.active = fresh.active;
    saved.mastered = fresh.mastered;
    saved.lapses = fresh.lapses;
    saved.history = [];
  });
  state.lastSynced = Date.now();
  persistState();
  showStatus('Progress reset. All cards are new again.');
  prepareNextCard();
  updateStats();
}

function showStatus(message) {
  elements.statusBanner.textContent = message;
  elements.statusBanner.classList.add('visible');
  setTimeout(() => {
    elements.statusBanner.classList.remove('visible');
  }, 2600);
}

function parseCsv(text) {
  const rows = [];
  let current = [];
  let value = '';
  let inQuotes = false;
  let i = 0;
  while (i < text.length) {
    const char = text[i];
    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          value += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        value += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        current.push(value.trim());
        value = '';
      } else if (char === '\n' || char === '\r') {
        if (char === '\r' && text[i + 1] === '\n') {
          i += 1;
        }
        current.push(value.trim());
        rows.push(current);
        current = [];
        value = '';
      } else {
        value += char;
      }
    }
    i += 1;
  }
  if (value.length > 0 || current.length > 0) {
    current.push(value.trim());
    rows.push(current);
  }
  return rows.filter(row => row.some(cell => cell && cell.length));
}

function generateVariations(entry) {
  const { acronym, fullName, explanation, rowIndex } = entry;
  const variations = [];
  const baseId = `row-${rowIndex}`;

  const addVariation = (type, prompt, answer) => {
    if (!prompt || !answer) return;
    const id = `${baseId}-${type}`;
    if (!state.cards[id]) {
      state.cards[id] = {
        id,
        rowIndex,
        prompt,
        answer,
        type,
        ...defaultCardState()
      };
      state.order.push(id);
    } else {
      state.cards[id].prompt = prompt;
      state.cards[id].answer = answer;
      state.cards[id].type = type;
    }
    variations.push(id);
  };

  if (acronym && fullName) {
    addVariation('acronym-fullName', `What does "${acronym}" stand for?`, fullName);
    addVariation('fullName-acronym', `Which acronym refers to "${fullName}"?`, acronym);
  }
  if (acronym && explanation) {
    addVariation('acronym-explanation', `Explain the concept behind "${acronym}"`, explanation);
    addVariation('explanation-acronym', `Which acronym matches this explanation?`, `${explanation}\n\nAnswer expected: ${acronym}`);
  }
  if (fullName && explanation) {
    addVariation('fullName-explanation', `What is the explanation for "${fullName}"?`, explanation);
    addVariation('explanation-fullName', `Which term fits this description?`, `${explanation}\n\nAnswer expected: ${fullName}`);
  }

  return variations;
}

async function fetchAndMergeCsv(url) {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Failed to download CSV: ${response.status} ${response.statusText}`);
  }
  const text = await response.text();
  const rows = parseCsv(text);
  if (!rows.length) {
    throw new Error('CSV file is empty.');
  }
  const dataRows = rows.slice(1); // skip header
  let newVariations = 0;
  state.order = state.order.filter((id) => state.cards[id]);
  dataRows.forEach((columns, idx) => {
    const rowIndex = idx;
    const [acronym = '', fullName = '', explanation = ''] = columns;
    const entry = {
      rowIndex,
      acronym: (acronym || '').trim(),
      fullName: (fullName || '').trim(),
      explanation: (explanation || '').trim()
    };
    if (!entry.acronym && !entry.fullName && !entry.explanation) {
      return;
    }
    const beforeCount = state.order.length;
    const ids = generateVariations(entry);
    const afterCount = state.order.length;
    newVariations += Math.max(0, afterCount - beforeCount);
    ids.forEach((id) => {
      const card = state.cards[id];
      card.sourceSnapshot = entry;
    });
  });
  state.lastRowCount = dataRows.length;
  state.lastSynced = Date.now();
  persistState();
  return { totalRows: dataRows.length, newVariations };
}

function getActiveCards() {
  return Object.values(state.cards).filter(card => card.active && !card.mastered);
}

function getDueCards(now = Date.now()) {
  return Object.values(state.cards).filter(card => card.active && card.due <= now);
}

function getNewCards() {
  return state.order.map(id => state.cards[id]).filter(card => !card.active);
}

function determineNextCard() {
  const now = Date.now();
  const dueCards = getDueCards(now);
  if (dueCards.length) {
    dueCards.sort((a, b) => a.due - b.due || a.rowIndex - b.rowIndex);
    return dueCards[0];
  }
  const activeCount = getActiveCards().length;
  if (activeCount < state.maxActive) {
    const newCards = getNewCards();
    if (newCards.length) {
      newCards.sort((a, b) => a.rowIndex - b.rowIndex);
      return newCards[0];
    }
  }
  const futureCards = Object.values(state.cards)
    .filter(card => card.active)
    .sort((a, b) => a.due - b.due);
  return futureCards[0] || null;
}

function updateStats() {
  const activeCards = getActiveCards();
  const dueCards = getDueCards();
  const masteredCards = Object.values(state.cards).filter(card => card.mastered);
  const nextCard = determineNextCard();

  elements.activeCount.textContent = activeCards.length.toString();
  elements.dueCount.textContent = dueCards.length.toString();
  elements.masteredCount.textContent = masteredCards.length.toString();
  elements.totalCount.textContent = state.order.length.toString();
  elements.activeLimitNote.textContent = `Max ${state.maxActive}`;

  if (!nextCard) {
    elements.nextDueNote.textContent = 'No cards available yet';
  } else if (nextCard.active && nextCard.due > Date.now()) {
    const diffMinutes = Math.round((nextCard.due - Date.now()) / 60000);
    elements.nextDueNote.textContent = diffMinutes <= 0 ? 'Next review imminently' : `Next review in ${diffMinutes} min`;
  } else if (!nextCard.active) {
    elements.nextDueNote.textContent = 'Ready to introduce a new card';
  } else {
    elements.nextDueNote.textContent = 'Next card ready now';
  }

  if (state.sourceUrl) {
    const date = state.lastSynced ? new Date(state.lastSynced) : null;
    elements.sourceMeta.textContent = date
      ? `Source: ${state.sourceUrl} (synced ${date.toLocaleString()})`
      : `Source: ${state.sourceUrl}`;
  } else {
    elements.sourceMeta.textContent = 'No source loaded';
  }
}

function renderHistory() {
  const historyItems = [];
  Object.values(state.cards).forEach(card => {
    card.history.slice(-5).forEach(entry => {
      historyItems.push({
        card,
        entry
      });
    });
  });
  historyItems.sort((a, b) => b.entry.reviewedAt - a.entry.reviewedAt);
  const limited = historyItems.slice(0, 6);
  elements.historyList.innerHTML = '';
  limited.forEach(({ card, entry }) => {
    const li = document.createElement('li');
    const gradeMap = {
      0: 'Again',
      1: 'Fail',
      2: 'Retry',
      3: 'Hard',
      4: 'Good',
      5: 'Easy'
    };
    li.innerHTML = `
      <span><strong>${card.prompt}</strong></span>
      <span class="label">${gradeMap[entry.grade] || entry.grade} · ${new Date(entry.reviewedAt).toLocaleTimeString()}</span>
    `;
    elements.historyList.appendChild(li);
  });
  if (!limited.length) {
    const li = document.createElement('li');
    li.textContent = 'No reviews yet.';
    elements.historyList.appendChild(li);
  }
}

function renderCard(card) {
  if (!card) {
    elements.promptText.textContent = 'Nothing to review right now.';
    elements.answerText.textContent = '';
    elements.answerText.classList.remove('visible');
    elements.cardType.textContent = '';
    elements.revealWrapper.style.display = 'none';
    elements.actionButtons.style.display = 'none';
    return;
  }
  const now = Date.now();
  if (card.active && card.due > now) {
    const diffMinutes = Math.round((card.due - now) / 60000);
    const diffHours = Math.round((card.due - now) / 3600000);
    const waitMessage = diffMinutes < 60
      ? `All caught up! Next review unlocks in about ${Math.max(diffMinutes, 1)} minute(s).`
      : `All caught up! Next review unlocks in about ${Math.max(diffHours, 1)} hour(s).`;
    elements.promptText.textContent = waitMessage;
    elements.answerText.textContent = '';
    elements.answerText.classList.remove('visible');
    elements.cardType.textContent = '';
    elements.revealWrapper.style.display = 'none';
    elements.actionButtons.style.display = 'none';
    currentCardId = null;
    showingAnswer = false;
    return;
  }
  currentCardId = card.id;
  showingAnswer = false;
  elements.promptText.textContent = card.prompt;
  elements.answerText.textContent = card.answer;
  elements.answerText.classList.remove('visible');
  elements.cardType.textContent = card.type.replace(/[-_]/g, ' ');
  elements.revealWrapper.style.display = 'flex';
  elements.actionButtons.style.display = 'none';
}

function prepareNextCard() {
  const card = determineNextCard();
  renderCard(card);
  updateStats();
}

function showAnswer() {
  if (!currentCardId) return;
  elements.answerText.classList.add('visible');
  elements.revealWrapper.style.display = 'none';
  elements.actionButtons.style.display = 'flex';
  showingAnswer = true;
}

function applySm2(card, grade) {
  const now = Date.now();
  if (grade < 3) {
    card.repetition = 0;
    card.interval = 1;
    card.due = now + 24 * 60 * 60 * 1000;
    card.ef = Math.max(1.3, card.ef + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02)));
    card.mastered = false;
    card.lapses += 1;
  } else {
    card.repetition += 1;
    if (card.repetition === 1) {
      card.interval = 1;
    } else if (card.repetition === 2) {
      card.interval = 6;
    } else {
      card.interval = Math.round(card.interval * card.ef);
    }
    card.ef = Math.max(1.3, card.ef + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02)));
    card.due = now + card.interval * 24 * 60 * 60 * 1000;
    card.mastered = card.interval >= MASTERED_INTERVAL_DAYS;
  }
  card.active = true;
  card.lastReviewed = now;
  card.history.push({ grade, reviewedAt: now });
  if (card.history.length > 20) {
    card.history = card.history.slice(-20);
  }
}

function gradeCard(grade) {
  if (!currentCardId || !showingAnswer) {
    return;
  }
  const card = state.cards[currentCardId];
  if (!card) {
    prepareNextCard();
    return;
  }
  applySm2(card, grade);
  persistState();
  renderHistory();
  prepareNextCard();
}

function attachEventListeners() {
  elements.showAnswerButton.addEventListener('click', showAnswer);
  elements.actionButtonContainer.addEventListener('click', (event) => {
    const grade = event.target?.dataset?.grade;
    if (grade === undefined) return;
    gradeCard(Number(grade));
  });
  elements.configButton.addEventListener('click', () => {
    if (typeof elements.configDialog.showModal === 'function') {
      elements.configDialog.showModal();
    }
    elements.sourceInput.value = state.sourceUrl || '';
    elements.maxActiveInput.value = state.maxActive;
    elements.syncNote.textContent = state.lastSynced
      ? `Last synced ${new Date(state.lastSynced).toLocaleString()}`
      : 'No sync performed yet';
  });
  elements.syncButton.addEventListener('click', async () => {
    if (!state.sourceUrl) {
      showStatus('Set a CSV source first.');
      return;
    }
    try {
      await syncCsv(state.sourceUrl);
    } catch (err) {
      console.warn('Sync failed', err);
    }
  });
  elements.applySettingsButton.addEventListener('click', async () => {
    const url = elements.sourceInput.value.trim();
    const maxActive = Number(elements.maxActiveInput.value) || state.maxActive;
    if (!url) {
      showStatus('Please provide a CSV URL.');
      return;
    }
    state.maxActive = Math.max(1, Math.min(200, Math.round(maxActive)));
    try {
      await syncCsv(url);
      state.sourceUrl = url;
      persistState();
      elements.configDialog.close();
    } catch (err) {
      showStatus(err.message);
    }
  });
  elements.resetButton.addEventListener('click', () => {
    const confirmed = window.confirm('Reset all progress? This keeps your source but restarts all scheduling.');
    if (confirmed) {
      resetProgress();
    }
  });
}

async function syncCsv(url) {
  try {
    showStatus('Syncing CSV…');
    const results = await fetchAndMergeCsv(url);
    state.sourceUrl = url;
    persistState();
    renderHistory();
    prepareNextCard();
    updateStats();
    elements.syncNote.textContent = `Last synced ${new Date(state.lastSynced).toLocaleString()}`;
    showStatus(`Sync complete: ${results.totalRows} rows (${results.newVariations} new variations).`);
    return results;
  } catch (err) {
    console.error(err);
    showStatus(err.message);
    throw err;
  }
}

function bootstrap() {
  loadState();
  elements.maxActiveInput.value = state.maxActive;
  elements.activeLimitNote.textContent = `Max ${state.maxActive}`;
  if (state.sourceUrl) {
    elements.sourceMeta.textContent = `Source: ${state.sourceUrl}`;
    syncCsv(state.sourceUrl).catch(() => {
      // ignore error, stay offline with cached data
      prepareNextCard();
      updateStats();
      renderHistory();
    });
  } else {
    prepareNextCard();
    updateStats();
    renderHistory();
  }
}

attachEventListeners();
bootstrap();
