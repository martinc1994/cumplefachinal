/**
 * Cumpleaños de Mario - Folclore & Costillares
 * Script de interactividad: Cuenta Regresiva, Reproductor Criollo y Modal
 */

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initAudioPlayer();
  initEmbers();
  initModal();
});

/* ==========================================================================
   1. CUENTA REGRESIVA (Sábado 12 de Septiembre, 13:00 hs Argentina GMT-3)
   ========================================================================== */
function initCountdown() {
  const daysEl = document.getElementById('countDays');
  const hoursEl = document.getElementById('countHours');
  const minutesEl = document.getElementById('countMinutes');
  const secondsEl = document.getElementById('countSeconds');
  const countdownGrid = document.getElementById('countdownGrid');

  // Fecha del evento: 12 de Septiembre a las 13:00 hs (Horario de Argentina GMT-3)
  // Usamos el año 2026 o el próximo 12 de Septiembre
  const now = new Date();
  let targetYear = now.getFullYear();
  let targetDate = new Date(`${targetYear}-09-12T13:00:00-03:00`);

  // Si ya pasó este año, apunta al próximo
  if (now.getTime() > targetDate.getTime() + 86400000) {
    targetYear += 1;
    targetDate = new Date(`${targetYear}-09-12T13:00:00-03:00`);
  }

  function update() {
    const currentTime = new Date().getTime();
    const diff = targetDate.getTime() - currentTime;

    if (diff <= 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   2. REPRODUCTOR DE MÚSICA (track.mp3) CON MANEJO INTELIGENTE DE AUTOPLAY
   ========================================================================== */
function initAudioPlayer() {
  const audio = document.getElementById('bgAudio');
  const toggleBtn = document.getElementById('musicToggleBtn');
  const vinylDisc = document.getElementById('vinylDisc');
  const statusText = document.getElementById('musicStatusText');
  const audioWaves = document.getElementById('audioWaves');

  if (!audio || !toggleBtn) return;

  // Ajuste inicial de volumen cómodo
  audio.volume = 0.75;

  let isPlaying = false;

  function setPlayingState(playing) {
    isPlaying = playing;
    if (playing) {
      vinylDisc?.classList.add('spinning');
      audioWaves?.classList.add('playing');
      if (statusText) statusText.textContent = 'Sonando folclore 🎶';
    } else {
      vinylDisc?.classList.remove('spinning');
      audioWaves?.classList.remove('playing');
      if (statusText) statusText.textContent = 'Tocar para reproducir';
    }
  }

  // Intentar reproducir
  function playAudio() {
    const promise = audio.play();
    if (promise !== undefined) {
      promise.then(() => {
        setPlayingState(true);
      }).catch((err) => {
        // Bloqueado por política del navegador hasta la primera interacción
        setPlayingState(false);
      });
    }
  }

  // Alternar reproducción
  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (audio.paused) {
      playAudio();
    } else {
      audio.pause();
      setPlayingState(false);
    }
  });

  // Intentar reproducir al cargar
  playAudio();

  // Desbloqueo automático al primer click o tap en cualquier lugar de la pantalla
  const unlockAudio = () => {
    if (audio.paused && !isPlaying) {
      playAudio();
    }
    // Remover eventos una vez activado
    window.removeEventListener('click', unlockAudio);
    window.removeEventListener('touchstart', unlockAudio);
    window.removeEventListener('scroll', unlockAudio);
  };

  window.addEventListener('click', unlockAudio, { passive: true });
  window.addEventListener('touchstart', unlockAudio, { passive: true });
  window.addEventListener('scroll', unlockAudio, { passive: true, once: true });
}

/* ==========================================================================
   3. MODAL DEL AFICHE COMPLETO
   ========================================================================== */
function initModal() {
  const openBtn = document.getElementById('openImageModalBtn');
  const modal = document.getElementById('imageModal');
  const closeBtn = document.getElementById('modalCloseBtn');
  const backdrop = document.getElementById('modalBackdrop');

  if (!openBtn || !modal) return;

  function openModal() {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openBtn.addEventListener('click', openModal);
  closeBtn?.addEventListener('click', closeModal);
  backdrop?.addEventListener('click', closeModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   5. AMBIENTACIÓN: BRASAS FLOTANTES DE ASADO / FOGÓN
   ========================================================================== */
function initEmbers() {
  const container = document.getElementById('embersContainer');
  if (!container) return;

  const count = 18; // Cantidad equilibrada para no sobrecargar el CPU en móviles
  for (let i = 0; i < count; i++) {
    const ember = document.createElement('div');
    ember.className = 'ember';

    const size = Math.random() * 4 + 2; // entre 2px y 6px
    const left = Math.random() * 100;
    const duration = Math.random() * 7 + 6; // entre 6s y 13s
    const delay = Math.random() * 8;

    ember.style.width = `${size}px`;
    ember.style.height = `${size}px`;
    ember.style.left = `${left}%`;
    ember.style.animationDuration = `${duration}s`;
    ember.style.animationDelay = `${delay}s`;

    container.appendChild(ember);
  }
}
