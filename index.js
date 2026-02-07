let currentYears = null;
let fireworksInterval = null;
let galleryAuto = null;
let galleryIndex = 0;

const counterElement = document.getElementById('counter');
const galleryTrack = document.querySelector('.gallery-slide-track');
const galleryWrapper = document.querySelector('.gallery-wrapper');
const galleryOriginalSlides = Array.from(galleryTrack?.querySelectorAll('.gallery-slide') || []);
const galleryIndicator = document.getElementById('galleryIndicator');
const galleryPrev = document.getElementById('galleryPrev');
const galleryNext = document.getElementById('galleryNext');
const galleryLightbox = document.getElementById('galleryLightbox');
const galleryLightboxClose = document.getElementById('galleryLightboxClose');
const galleryLightboxImage = document.getElementById('lightboxImage');
const galleryLightboxCaption = document.getElementById('lightboxCaption');
const timelineTrack = document.querySelector('.timeline-slide-track');
const timelineWrapper = document.querySelector('.timeline-wrapper');
const timelineOriginalNodes = Array.from(timelineTrack?.querySelectorAll('.timeline-node') || []);
const timelineIndicator = document.getElementById('timelineIndicator');
const timelinePrev = document.getElementById('timelinePrev');
const timelineNext = document.getElementById('timelineNext');
const siteHeartsContainer = document.querySelector('.site-hearts');
const floatingHeartsContainer = document.querySelector('.floating-hearts');
const playlistHeartsContainer = document.querySelector('.playlist-hearts');
const heartPalette = ['#ff6ea1', '#ff9bc3', '#ffb4cf', '#ff8da1', '#ff5d84'];
let floatingHeartTimer = null;

if (galleryTrack && galleryOriginalSlides.length) {
  const galleryCloneNode = (node) => {
    const clone = node.cloneNode(true);
    clone.dataset.clone = 'true';
    clone.setAttribute('aria-hidden', 'true');
    return clone;
  };

  galleryTrack.prepend(galleryCloneNode(galleryOriginalSlides[galleryOriginalSlides.length - 1]));
  galleryTrack.appendChild(galleryCloneNode(galleryOriginalSlides[0]));
}

const gallerySlides = galleryOriginalSlides;
const startDate = new Date('2024-05-01T00:00:00');
const visibleSlides = 1;
if (timelineTrack && timelineOriginalNodes.length) {
  const cloneTimelineNode = (node) => {
    const clone = node.cloneNode(true);
    clone.dataset.clone = 'true';
    clone.setAttribute('aria-hidden', 'true');
    return clone;
  };

  timelineTrack.prepend(cloneTimelineNode(timelineOriginalNodes[timelineOriginalNodes.length - 1]));
  timelineTrack.appendChild(cloneTimelineNode(timelineOriginalNodes[0]));
}

const timelineNodes = timelineOriginalNodes;
const visibleTimelineSlots = Math.min(5, timelineNodes.length);
let timelineIndex = 0;

function goToGallerySlide(targetIndex, resetTimer = false) {
  if (!gallerySlides.length || !galleryTrack) return;
  const total = gallerySlides.length;
  const normalizedIndex = ((targetIndex % total) + total) % total;
  const previousIndex = galleryIndex;
  galleryIndex = normalizedIndex;

  const computedStyle = getComputedStyle(galleryTrack);
  const gapValue = parseFloat(computedStyle.gap) || parseFloat(computedStyle.columnGap) || 0;
  const baseWidth = gallerySlides[0]?.offsetWidth || 0;
  const slideWidth = baseWidth + gapValue;
  const wrapperWidth = galleryWrapper?.clientWidth || galleryTrack.parentElement.clientWidth;
  const shiftIndex = galleryIndex + 1;
  const needsInstantLoop =
    (previousIndex === total - 1 && normalizedIndex === 0) ||
    (previousIndex === 0 && normalizedIndex === total - 1);

  if (baseWidth && wrapperWidth) {
    const centerOffset = (wrapperWidth - baseWidth) / 2;
    const targetTransform = `translateX(${centerOffset - shiftIndex * slideWidth}px)`;
    if (needsInstantLoop) {
      galleryTrack.classList.add('no-transition');
      galleryTrack.style.transform = targetTransform;
      void galleryTrack.offsetWidth;
      galleryTrack.classList.remove('no-transition');
    } else {
      galleryTrack.classList.remove('no-transition');
      galleryTrack.style.transform = targetTransform;
    }
  }

  if (galleryIndicator) {
    galleryIndicator.textContent = `${galleryIndex + 1} / ${total}`;
  }
  if (resetTimer) {
    resetGalleryAuto();
  }
}

function goToTimelineSlide(targetIndex) {
  if (!timelineTrack || !timelineNodes.length) return;
  const total = timelineNodes.length;
  const normalizedIndex = ((targetIndex % total) + total) % total;
  const previousIndex = timelineIndex;
  timelineIndex = normalizedIndex;

  const computedStyle = getComputedStyle(timelineTrack);
  const gapValue = parseFloat(computedStyle.gap) || parseFloat(computedStyle.columnGap) || 0;
  const baseWidth = timelineNodes[0]?.offsetWidth || 0;
  const nodeWidth = baseWidth + gapValue;
  const wrapperWidth = timelineWrapper?.clientWidth || timelineTrack.parentElement.clientWidth;
  const shiftIndex = timelineIndex + 1;
  const needsInstantLoop =
    (previousIndex === total - 1 && normalizedIndex === 0) ||
    (previousIndex === 0 && normalizedIndex === total - 1);

  if (baseWidth && wrapperWidth) {
    const centerOffset = (wrapperWidth - baseWidth) / 2;
    const targetTransform = `translateX(${centerOffset - shiftIndex * nodeWidth}px)`;
    if (needsInstantLoop) {
      timelineTrack.classList.add('no-transition');
      timelineTrack.style.transform = targetTransform;
      void timelineTrack.offsetWidth;
      timelineTrack.classList.remove('no-transition');
    } else {
      timelineTrack.classList.remove('no-transition');
      timelineTrack.style.transform = targetTransform;
    }
  }

  if (timelineIndicator) {
    timelineIndicator.textContent = `${timelineIndex + 1} / ${total}`;
  }
}

function nextGallerySlide(resetTimer = true) {
  goToGallerySlide(galleryIndex + 1, resetTimer);
}

function startGalleryAuto() {
  if (galleryAuto) clearInterval(galleryAuto);
  galleryAuto = setInterval(() => nextGallerySlide(false), 4500);
}

function resetGalleryAuto() {
  if (galleryAuto) {
    clearInterval(galleryAuto);
  }
  startGalleryAuto();
}

if (gallerySlides.length) {
  goToGallerySlide(0);
  startGalleryAuto();
}

galleryPrev?.addEventListener('click', () => goToGallerySlide(galleryIndex - 1, true));
galleryNext?.addEventListener('click', () => goToGallerySlide(galleryIndex + 1, true));
timelinePrev?.addEventListener('click', () => goToTimelineSlide(timelineIndex - 1));
timelineNext?.addEventListener('click', () => goToTimelineSlide(timelineIndex + 1));

function toggleBodyScroll(lock) {
  document.body.classList.toggle('modal-open', lock);
}

function createFloatingHeart() {
  if (!floatingHeartsContainer) return;

  const heart = document.createElement('span');
  heart.className = 'floating-heart';
  const size = Math.random() * 18 + 12;
  heart.style.width = `${size}px`;
  heart.style.height = `${size}px`;
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.animationDuration = `${4 + Math.random() * 2.5}s`;
  heart.style.opacity = `${0.45 + Math.random() * 0.5}`;

  floatingHeartsContainer.appendChild(heart);
  heart.addEventListener('animationend', () => heart.remove());
}

let siteHeartTimer = null;

function createSiteHeart() {
  if (!siteHeartsContainer) return;

  const heart = document.createElement('span');
  heart.className = 'floating-heart';
  const size = Math.random() * 30 + 20;
  heart.style.width = `${size}px`;
  heart.style.height = `${size}px`;
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.animationDuration = `${7 + Math.random() * 3}s`;
  heart.style.opacity = `${0.35 + Math.random() * 0.6}`;

  siteHeartsContainer.appendChild(heart);
  heart.addEventListener('animationend', () => heart.remove());
}

function startFloatingHearts() {
  if (!floatingHeartsContainer) return;
  if (floatingHeartTimer) clearInterval(floatingHeartTimer);
  floatingHeartTimer = setInterval(createFloatingHeart, 700);
  createFloatingHeart();
}

function startSiteHearts() {
  if (!siteHeartsContainer) return;
  if (siteHeartTimer) clearInterval(siteHeartTimer);
  siteHeartTimer = setInterval(createSiteHeart, 900);
  createSiteHeart();
}

let playlistHeartTimer = null;

function createPlaylistHeart() {
  if (!playlistHeartsContainer) return;

  const heart = document.createElement('span');
  heart.className = 'playlist-heart';
  const size = Math.random() * 16 + 14;
  heart.style.width = `${size}px`;
  heart.style.height = `${size}px`;
  heart.style.left = `${Math.random() * 90 + 5}%`;
  heart.style.animationDuration = `${4 + Math.random() * 3}s`;

  playlistHeartsContainer.appendChild(heart);
  heart.addEventListener('animationend', () => heart.remove());
}

function startPlaylistHearts() {
  if (!playlistHeartsContainer) return;
  if (playlistHeartTimer) clearInterval(playlistHeartTimer);
  playlistHeartTimer = setInterval(createPlaylistHeart, 900);
  createPlaylistHeart();
}

let equationHeartTimer = null;

function createEquationHeart() {
  if (!equationHeartsContainer) return;

  const heart = document.createElement('span');
  heart.className = 'equation-heart';
  heart.style.left = `${Math.random() * 80 + 10}%`;
  heart.style.animationDuration = `${4 + Math.random() * 3}s`;

  equationHeartsContainer.appendChild(heart);
  heart.addEventListener('animationend', () => heart.remove());
}

function startEquationHearts() {
  if (!equationHeartsContainer) return;
  if (equationHeartTimer) clearInterval(equationHeartTimer);
  equationHeartTimer = setInterval(createEquationHeart, 800);
  createEquationHeart();
}
function stopFloatingHearts() {
  if (floatingHeartTimer) {
    clearInterval(floatingHeartTimer);
    floatingHeartTimer = null;
  }
}
// Contador de tempo juntos
function updateCounter() {
  const now = new Date();
  const difference = now - startDate;

  const years = Math.floor(difference / (1000 * 60 * 60 * 24 * 365));
  const months = Math.floor((difference % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30.44));
  const days = Math.floor((difference % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  if (counterElement) {
    counterElement.textContent = `${years} anos, ${months} meses, ${days} dias, ${hours} horas, ${minutes} minutos e ${seconds} segundos`;
  }

  if (years > 0 && months === 0 && days === 0) {
    if (currentYears !== years) {
      currentYears = years;
      startFireworks(years);
    }
  } else {
    stopFireworks();
    currentYears = null;
  }
}

updateCounter();
setInterval(updateCounter, 1000);

document.getElementById('year').textContent = new Date().getFullYear();

const equationDetails = document.getElementById('equationDetails');
const equationReveal = document.getElementById('equationReveal');
const equationHeartsContainer = document.getElementById('equationHearts');

document.getElementById('plotButton').addEventListener('click', () => {
  if (equationDetails) {
    equationDetails.style.display = 'block';
  }

  if (equationReveal) {
    equationReveal.classList.add('is-expanded');
  }
  startEquationHearts();

  const canvas = document.getElementById('loveCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = 600;
  canvas.height = 400;
  animateHeart(ctx, canvas);
});

function animateHeart(ctx, canvas) {
  const a = 6.5;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2 + 50;
  const scaleX = 130;
  const scaleY = 100;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();

  let x = -2;
  const interval = setInterval(() => {
    if (x > 2) {
      clearInterval(interval);
      ctx.closePath();
      return;
    }

    const y =
      Math.pow(Math.abs(x), 2 / 3) +
      (Math.E / 3) * Math.pow(Math.PI - Math.pow(x, 2), 1 / 2) * Math.sin(a * Math.PI * x);

    const canvasX = centerX + x * scaleX;
    const canvasY = centerY - y * scaleY;

    if (x === -2) {
      ctx.moveTo(canvasX, canvasY);
    } else {
      ctx.lineTo(canvasX, canvasY);
    }

    ctx.strokeStyle = '#d6336c';
    ctx.lineWidth = 2;
    ctx.stroke();
    x += 0.01;
  }, 10);
}

function startFireworks(years) {
  if (fireworksInterval) return;

  const msg = document.getElementById('anniversaryMessage');
  if (msg) {
    msg.textContent = `🎉 Feliz Aniversário de Relacionamento! +${years} ano${years > 1 ? 's' : ''} 🎉`;

    setTimeout(() => {
      msg.style.display = 'block';
      msg.style.animation = 'none';
      msg.offsetHeight;
      msg.style.animation = '';
    }, 3000);
  }

  const duration = 15 * 1000;
  const endTime = Date.now() + duration;

  fireworksInterval = setInterval(() => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      ticks: 200,
      scalar: 1.2,
      shapes: ['circle'],
      colors: ['#ff4081', '#f50057', '#c51162']
    });

    if (Date.now() > endTime) {
      stopFireworks();
    }
  }, 2000);
}

function stopFireworks() {
  if (fireworksInterval) {
    clearInterval(fireworksInterval);
    fireworksInterval = null;
  }
  const msg = document.getElementById('anniversaryMessage');
  if (msg) {
    msg.style.display = 'none';
  }
}

const revealTargets = [
  ...Array.from(document.querySelectorAll('[data-animate]')).filter((el) => !el.dataset.clone),
  ...gallerySlides,
  ...timelineNodes
];

function setupRevealObserver() {
  if (!revealTargets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        } else {
          entry.target.classList.remove('is-visible');
        }
      });
    },
    { threshold: 0.35, rootMargin: '0px 0px -90px 0px' }
  );

  revealTargets.forEach((target) => observer.observe(target));
}

setupRevealObserver();

goToTimelineSlide(0);

window.addEventListener('resize', () => goToGallerySlide(galleryIndex));

gallerySlides.forEach((slide) => {
  slide.addEventListener('click', () => {
    openGalleryLightbox(slide);
  });
});

galleryLightboxClose?.addEventListener('click', closeGalleryLightbox);
galleryLightbox?.addEventListener('click', (event) => {
  if (event.target === galleryLightbox) {
    closeGalleryLightbox();
  }
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeGalleryLightbox();
  }
});

function openGalleryLightbox(imageElement) {
  if (!galleryLightbox || !galleryLightboxImage) return;
  const src = imageElement.src;
  const caption = imageElement.dataset.caption || imageElement.alt || '';
  galleryLightboxImage.src = src;
  galleryLightboxImage.alt = caption || 'Foto do casal';
  if (galleryLightboxCaption) {
    galleryLightboxCaption.textContent = caption;
  }
  galleryLightbox.classList.add('is-open');
  toggleBodyScroll(true);
}

function closeGalleryLightbox() {
  if (!galleryLightbox) return;
  galleryLightbox.classList.remove('is-open');
  toggleBodyScroll(false);
}

window.addEventListener('load', () => {
  const loadingScreen = document.getElementById('loading-screen');
  const mainContent = document.getElementById('main-content');

  setTimeout(() => {
    loadingScreen.style.display = 'none';
    mainContent.style.display = 'block';
    startFloatingHearts();
    goToGallerySlide(galleryIndex);
    startPlaylistHearts();
    startSiteHearts();
  }, 1000);
});
