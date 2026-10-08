const STORAGE_KEY = 'nexo-digital-wellbeing-v1';

const defaultState = {
  streak: 4,
  points: 280,
  minutes: 42,
  weekly: 2,
  creation: 1,
  saved: [],
  energy: null,
  intention: 'Quiero que mi tiempo en línea me deje con más ideas de las que tenía al entrar.',
  completedChallenges: []
};

let state = loadState();
let currentChallenge = 'pause';
let toastTimer;

const challengeData = {
  pause: {
    kicker: 'RETO DE HOY · 5 MIN',
    title: 'Haz espacio para lo que importa.',
    description: 'Antes de abrir otra app, pregúntate qué necesitas de verdad ahora. Después, elige una sola cosa y hazla durante cinco minutos, sin multitarea.',
    ornament: '✦',
    steps: ['Deja el teléfono boca abajo o activa “No molestar”.', 'Elige una acción pequeña que te acerque a lo que necesitas.', 'Al terminar, nota cómo cambió tu energía.'],
    minutes: 5
  },
  create: {
    kicker: 'RETO DE CREACIÓN · 10 MIN',
    title: 'Convierte tu scroll en una idea.',
    description: 'Encuentra algo que te inspire y transfórmalo en algo tuyo. No hace falta que quede perfecto: solo que empiece contigo.',
    ornament: '✎',
    steps: ['Elige una imagen, frase o sonido que te haya llamado la atención.', 'Cámbiale el contexto: escribe, dibuja o graba tu propia versión.', 'Ponle un nombre y decide si quieres compartirlo o guardarlo.'],
    minutes: 10,
    creation: true
  },
  breath: {
    kicker: 'PAUSA · 3 MIN',
    title: 'Respira en cuatro.',
    description: 'Cuando un mensaje te active, tu primera respuesta no tiene que ser inmediata. Dale a tu cuerpo tres minutos para bajar el volumen.',
    ornament: '◌',
    steps: ['Inhala durante 4 segundos.', 'Sostén el aire durante 4 segundos.', 'Exhala durante 4 segundos y repite cuatro veces.'],
    minutes: 3
  },
  microstory: {
    kicker: 'CREA · 10 MIN',
    title: 'Una foto, tres historias.',
    description: 'La tecnología también puede ser un laboratorio de imaginación. Elige una imagen y mira cuántas realidades nuevas caben en ella.',
    ornament: '✎',
    steps: ['Elige una foto de tu galería.', 'Inventa tres contextos distintos para la misma imagen.', 'Quédate con el que más te sorprenda y desarróllalo en cinco líneas.'],
    minutes: 10,
    creation: true
  },
  source: {
    kicker: 'PIENSA · 7 MIN',
    title: 'Detective de fuentes.',
    description: 'Antes de compartir una noticia, haz una pausa. Una fuente clara y una fecha visible son dos pistas para empezar a confiar.',
    ornament: '◈',
    steps: ['Busca quién firma o publica la información.', 'Comprueba la fecha y si otras fuentes independientes la mencionan.', 'Comparte solo aquello que también te parece responsable.'],
    minutes: 7
  },
  connect: {
    kicker: 'CONECTA · 5 MIN',
    title: 'Mensaje que sí suma.',
    description: 'Usa tu pantalla para acercarte de verdad. Un mensaje específico puede cambiarle el día a alguien.',
    ornament: '♡',
    steps: ['Piensa en alguien que haya hecho algo valioso últimamente.', 'Escribe qué notaste y por qué lo aprecias.', 'Envía el mensaje sin esperar una respuesta inmediata.'],
    minutes: 5
  }
};

const savedDefinitions = {
  pause: { category: 'PAUSA', className: 'idea-yellow', symbol: '◌', title: 'Haz espacio para<br /><em>lo que importa.</em>', description: 'Antes de abrir otra app, pregúntate qué necesitas de verdad ahora.', minutes: '5 min' },
  create: { category: 'CREA', className: 'idea-blue', symbol: '✎', title: 'Convierte tu scroll<br /><em>en una idea.</em>', description: 'Encuentra algo que te inspire y transfórmalo en algo tuyo.', minutes: '10 min' },
  breath: { category: 'PAUSA', className: 'idea-yellow', symbol: '◌', title: 'Respira<br /><em>en cuatro.</em>', description: 'Una pausa breve antes de responder puede cambiar la conversación.', minutes: '3 min' },
  microstory: { category: 'CREA', className: 'idea-blue', symbol: '✎', title: 'Una foto,<br /><em>tres historias.</em>', description: 'Mira una imagen de tu galería desde tres realidades distintas.', minutes: '10 min' },
  source: { category: 'PIENSA', className: 'idea-coral', symbol: '◈', title: 'Detective<br /><em>de fuentes.</em>', description: 'Una pista para saber si una noticia merece tu confianza.', minutes: '7 min' },
  connect: { category: 'CONECTA', className: 'idea-lilac', symbol: '♡', title: 'Mensaje que<br /><em>sí suma.</em>', description: 'Escribe una nota específica sobre algo que admiras de alguien.', minutes: '5 min' }
};

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved ? { ...defaultState, ...saved } : { ...defaultState };
  } catch (error) {
    return { ...defaultState };
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    // The experience remains usable when storage is unavailable.
  }
}

function $(selector, parent = document) {
  return parent.querySelector(selector);
}

function $$(selector, parent = document) {
  return [...parent.querySelectorAll(selector)];
}

function showToast(message) {
  const toast = $('#toast');
  $('#toastMessage').textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

function updateDate() {
  const now = new Date();
  const formatted = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: '2-digit', month: 'long' }).format(now);
  $('#currentDate').textContent = formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

function updateStats() {
  const percent = Math.min(100, Math.round((state.weekly / 5) * 100));
  const creationPercent = Math.min(100, Math.round((state.creation / 3) * 100));
  $('#streakValue').textContent = state.streak;
  $('#progressStreak').textContent = state.streak;
  $('#profileStreakCopy').textContent = `${state.streak} ${state.streak === 1 ? 'día' : 'días'}`;
  $('#intentMinutes').textContent = state.minutes;
  $('#chartTotal').textContent = state.minutes;
  $('#pointsValue').textContent = state.points;
  $('#weeklyValue').textContent = Math.min(state.weekly, 5);
  $('#creationProgress').textContent = Math.min(state.creation, 3);
  $('#creationProgressBar').style.width = `${creationPercent}%`;
  $('#weeklyCircle').style.background = `conic-gradient(var(--purple) 0 ${percent}%, #e7e6f0 ${percent}% 100%)`;
  $('#weeklyCircle').setAttribute('aria-label', `${state.weekly} de 5 retos completados`);
  $('#bigProgressPercent').textContent = `${percent}%`;
  $('.big-progress-ring').style.background = `conic-gradient(var(--purple-deep) 0 ${percent}%, #e9e6f1 ${percent}% 100%)`;

  const chart = $$('.bar', $('#weeklyBars'));
  const current = Math.min(29, Math.max(0, state.minutes - 32));
  if (chart[2]) {
    const height = Math.max(5, Math.round((current / 30) * 100));
    chart[2].style.height = `${height}%`;
    chart[2].querySelector('span').textContent = current;
  }
}

function updateIntention() {
  $('#intentionQuote').textContent = `“${state.intention}”`;
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add('open');
  modal.inert = false;
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  const focusable = $('button, textarea', modal);
  if (focusable) setTimeout(() => focusable.focus(), 80);
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove('open');
  modal.inert = true;
  modal.setAttribute('aria-hidden', 'true');
  if (!$$('.modal-backdrop.open').length) document.body.style.overflow = '';
}

function openChallenge(id) {
  const data = challengeData[id] || challengeData.pause;
  currentChallenge = id;
  $('#modalKicker').textContent = data.kicker;
  $('#modalTitle').textContent = data.title;
  $('#modalDescription').textContent = data.description;
  $('#modalOrnament').textContent = data.ornament;
  $('#modalSteps').innerHTML = data.steps.map((step, index) => `<div class="modal-step"><span>${index + 1}</span><p>${step}</p></div>`).join('');
  const completeButton = $('#completeChallengeButton');
  const alreadyCompleted = state.completedChallenges.includes(id);
  completeButton.innerHTML = alreadyCompleted ? 'Completado <span>✓</span>' : 'Lo hice <span>✓</span>';
  completeButton.disabled = alreadyCompleted;
  completeButton.style.opacity = alreadyCompleted ? '.6' : '1';
  openModal('challengeModal');
}

function completeCurrentChallenge() {
  const data = challengeData[currentChallenge] || challengeData.pause;
  if (state.completedChallenges.includes(currentChallenge)) return;
  state.completedChallenges.push(currentChallenge);
  state.weekly = Math.min(5, state.weekly + 1);
  state.points += 40;
  state.minutes += data.minutes;
  if (data.creation) state.creation = Math.min(3, state.creation + 1);
  if (currentChallenge === 'pause' || currentChallenge === 'create') state.streak += 1;
  persist();
  updateStats();
  renderCompletedCards();
  closeModal($('#challengeModal'));
  showToast('Reto completado. Tu atención suma ✦');
}

function renderCompletedCards() {
  $$('[data-challenge]').forEach(card => {
    const id = card.dataset.challenge;
    const isComplete = state.completedChallenges.includes(id);
    card.classList.toggle('completed', isComplete);
    const button = $('[data-open-challenge]', card);
    if (button && isComplete) button.innerHTML = 'Completado <span>✓</span>';
  });
}

function toggleSave(id, sourceButton) {
  const isSaved = state.saved.includes(id);
  state.saved = isSaved ? state.saved.filter(item => item !== id) : [...state.saved, id];
  persist();
  renderSaved();
  renderSaveButtons();
  showToast(isSaved ? 'Idea quitada de tus guardados' : 'Idea guardada en tu colección ♡');
}

function renderSaveButtons() {
  $$('[data-save]').forEach(button => {
    const isSaved = state.saved.includes(button.dataset.save);
    button.classList.toggle('saved', isSaved);
    button.textContent = isSaved ? '♥' : '♡';
    button.setAttribute('aria-label', isSaved ? 'Quitar de guardados' : 'Guardar idea');
  });
}

function renderSaved() {
  const grid = $('#savedGrid');
  if (!grid) return;
  grid.innerHTML = state.saved.map(id => {
    const item = savedDefinitions[id];
    if (!item) return '';
    return `<article class="idea-card ${item.className}" data-category="${item.category.toLowerCase()}"><div class="idea-card-top"><span class="idea-symbol">${item.symbol}</span><button class="save-button saved" aria-label="Quitar de guardados" data-save="${id}">♥</button></div><span class="tag tag-dark">${item.category}</span><h3>${item.title}</h3><p>${item.description}</p><div class="idea-meta"><span>${item.minutes}</span><button class="round-arrow" data-open-challenge="${id}">↗</button></div></article>`;
  }).join('');
  grid.classList.toggle('has-items', state.saved.length > 0);
  $('#savedEmpty').classList.toggle('hidden', state.saved.length > 0);
  renderSaveButtons();
  bindDynamicButtons();
}

function setView(view) {
  $$('.nav-item').forEach(item => {
    const active = item.dataset.view === view;
    item.classList.toggle('active', active);
    item.setAttribute('aria-current', active ? 'page' : 'false');
  });
  $$('[data-view-panel]').forEach(panel => panel.classList.toggle('active', panel.dataset.viewPanel === view));
  const labels = { inicio: 'Inicio', ideas: 'Ideas para ti', progreso: 'Mi progreso', intencion: 'Mi intención', guardados: 'Guardados' };
  $('#breadcrumbCurrent').textContent = labels[view] || 'Inicio';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function bindDynamicButtons() {
  $$('[data-open-challenge]').forEach(button => {
    button.onclick = () => openChallenge(button.dataset.openChallenge);
  });
  $$('[data-save]').forEach(button => {
    button.onclick = () => toggleSave(button.dataset.save, button);
  });
}

function bindEvents() {
  $$('.nav-item').forEach(item => item.addEventListener('click', () => setView(item.dataset.view)));
  $$('[data-go-view]').forEach(item => item.addEventListener('click', () => setView(item.dataset.goView)));

  $('#startChallengeButton').addEventListener('click', () => openChallenge('pause'));
  $('#seeAllIdeasButton').addEventListener('click', () => setView('ideas'));
  $('#completeChallengeButton').addEventListener('click', completeCurrentChallenge);
  $('#editIntentionButton').addEventListener('click', () => {
    $('#intentionInput').value = state.intention;
    $('#characterCount').textContent = state.intention.length;
    openModal('intentionModal');
  });
  $('#saveIntentionButton').addEventListener('click', () => {
    const value = $('#intentionInput').value.trim();
    if (!value) {
      showToast('Escribe una frase que se sienta tuya');
      $('#intentionInput').focus();
      return;
    }
    state.intention = value;
    persist();
    updateIntention();
    closeModal($('#intentionModal'));
    showToast('Tu intención quedó guardada ✦');
  });
  $('#intentionInput').addEventListener('input', event => {
    $('#characterCount').textContent = event.target.value.length;
  });

  $$('.energy-option').forEach(option => option.addEventListener('click', () => {
    const energy = option.dataset.energy;
    const messages = {
      enfocado: 'Aprovecha tu claridad: elige una cosa y llévala hasta el final.',
      curioso: 'Tu curiosidad está despierta: busca una pregunta, no solo una respuesta.',
      saturado: 'Baja el ritmo: dos minutos sin pantalla también cuentan como avance.',
      tranquilo: 'Quédate ahí un momento: puedes usar esta calma para crear algo.'
    };
    $$('.energy-option').forEach(item => item.classList.toggle('selected', item === option));
    $('.energy-response span:last-child').textContent = messages[energy];
    state.energy = energy;
    persist();
  }));

  $$('.filter-button').forEach(button => button.addEventListener('click', () => {
    $$('.filter-button').forEach(item => item.classList.toggle('active', item === button));
    const filter = button.dataset.filter;
    $$('.ideas-grid .idea-card').forEach(card => {
      card.style.display = filter === 'todos' || card.dataset.category === filter ? '' : 'none';
    });
  }));

  $$('.copy-prompt').forEach(button => button.addEventListener('click', () => {
    $('#intentionInput').value = button.dataset.prompt;
    $('#characterCount').textContent = button.dataset.prompt.length;
    openModal('intentionModal');
  }));

  $('#profileButton').addEventListener('click', () => openModal('profileModal'));
  $('#notificationButton').addEventListener('click', () => showToast('No tienes notificaciones nuevas'));
  $('#helpButton').addEventListener('click', () => showToast('Explora una idea, hazla tuya y vuelve cuando quieras'));

  $$('[data-close-modal]').forEach(button => button.addEventListener('click', () => closeModal(button.closest('.modal-backdrop'))));
  $$('.modal-backdrop').forEach(backdrop => backdrop.addEventListener('click', event => {
    if (event.target === backdrop) closeModal(backdrop);
  }));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      const open = $('.modal-backdrop.open');
      if (open) closeModal(open);
    }
  });

  bindDynamicButtons();
}

function restoreSelections() {
  if (state.energy) {
    const option = $(`[data-energy="${state.energy}"]`);
    if (option) option.click();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateDate();
  updateStats();
  updateIntention();
  renderSaved();
  renderCompletedCards();
  bindEvents();
  restoreSelections();
});
