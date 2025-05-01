let currentIndex = 0;
let currentYears = null; // Para monitorar quando o ano muda
let fireworksInterval = null; // Para controlar o efeito contínuo

const images = document.querySelectorAll('.carousel-image');
const counterElement = document.getElementById('counter');

// Cria dinamicamente a mensagem de aniversário se não existir ainda
let anniversaryMsg = document.getElementById('anniversaryMessage');
if (!anniversaryMsg) {
  anniversaryMsg = document.createElement('p');
  anniversaryMsg.id = 'anniversaryMessage';
  anniversaryMsg.className = 'romantic-text';
  anniversaryMsg.style.display = 'none';
  anniversaryMsg.style.color = '#d6336c';
  anniversaryMsg.style.fontWeight = 'bold';
  anniversaryMsg.textContent = '🎉 Feliz Aniversário de Relacionamento! +1 ano 🎉';
  counterElement.insertAdjacentElement('afterend', anniversaryMsg);
}

// Carrossel
function showNextImage() {
  images[currentIndex].classList.remove('active');
  currentIndex = (currentIndex + 1) % images.length;
  images[currentIndex].classList.add('active');
}

function startCarousel() {
  setInterval(showNextImage, 3000);
}

// Garantir que todas as imagens estejam carregadas antes de iniciar o carrossel
function preloadImages() {
  let loadedImages = 0;
  const totalImages = images.length;

  images.forEach((img) => {
    if (img.complete) {
      loadedImages++;
    } else {
      img.onload = () => {
        loadedImages++;
        if (loadedImages === totalImages) {
          startCarousel();
        }
      };
    }
  });

  // Caso todas as imagens já estejam carregadas
  if (loadedImages === totalImages) {
    startCarousel();
  }
}

// Iniciar o preload das imagens
preloadImages();

// Contador de tempo juntos
const startDate = new Date('2024-05-01T00:00:00'); // Data inicial do relacionamento
function updateCounter() {
  const now = new Date();
  const difference = now - startDate;

  const years = Math.floor(difference / (1000 * 60 * 60 * 24 * 365));
  const months = Math.floor((difference % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30.44)); // Média de dias por mês
  const days = Math.floor((difference % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  counterElement.textContent = `${years} anos, ${months} meses, ${days} dias, ${hours} horas, ${minutes} minutos e ${seconds} segundos`;

  // 🚀 Checar se o ano mudou ou se está no momento "cheio" (X anos, 0 meses, 0 dias)
  if (years > 0 && months === 0 && days === 0) {
    if (currentYears !== years) {
      currentYears = years;
      startFireworks(years); // Passa o ano atual para mostrar na animação
    }
  } else {
    stopFireworks(); // Não está em "aniversário" de anos, para fogos
    currentYears = null; // Reseta
  }
}
updateCounter();
setInterval(updateCounter, 1000);

// Atualizar o ano no footer
document.getElementById('year').textContent = new Date().getFullYear();

// Mostrar o gráfico ao clicar no botão
document.getElementById('plotButton').addEventListener('click', () => {
  const equationDetails = document.getElementById('equationDetails');
  equationDetails.style.display = 'block';

  const canvas = document.getElementById('loveCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 600;
  canvas.height = 400;
  animateHeart(ctx, canvas);
});

// Função para desenhar o coração
function animateHeart(ctx, canvas) {
  const a = 6.5; // Coeficiente da equação
  const centerX = canvas.width / 2; // Centro horizontal do canvas
  const centerY = canvas.height / 2 + 50; // Centro vertical ajustado para baixo
  const scaleX = 130; // Escala horizontal para largura do coração
  const scaleY = 100; // Escala vertical para altura do coração

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();

  let x = -2; // Valor inicial de x
  const interval = setInterval(() => {
    if (x > 2) {
      clearInterval(interval);
      ctx.closePath();
      return;
    }

    // Cálculo de y baseado na equação fornecida
    const y =
      Math.pow(Math.abs(x), 2 / 3) +
      (Math.E / 3) * Math.pow(Math.PI - Math.pow(x, 2), 1 / 2) * Math.sin(a * Math.PI * x);

    // Conversão para coordenadas do canvas centralizadas e esticadas
    const canvasX = centerX + x * scaleX; // Alongamento lateral
    const canvasY = centerY - y * scaleY; // Ajuste vertical para arredondar o topo

    if (x === -2) {
      ctx.moveTo(canvasX, canvasY); // Início do traço
    } else {
      ctx.lineTo(canvasX, canvasY); // Traçando a curva
    }

    ctx.strokeStyle = '#d6336c';
    ctx.lineWidth = 2;
    ctx.stroke();
    x += 0.01; // Incremento pequeno para suavizar o desenho
  }, 10); // Intervalo para fluidez
}

function startFireworks(years) {
  if (fireworksInterval) return; // Já está rodando

  // Mostra a mensagem de aniversário
  const msg = document.getElementById('anniversaryMessage');
  if (msg) {
    msg.textContent = `🎉 Feliz Aniversário de Relacionamento! +${years} ano${years > 1 ? 's' : ''} 🎉`;
    msg.style.display = 'block';
  }

  const duration = 15 * 1000; // 30 segundos
  const endTime = Date.now() + duration;

  fireworksInterval = setInterval(() => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      ticks: 200,
      scalar: 1.2,
      shapes: ['circle'],
      colors: ['#ff4081', '#f50057', '#c51162'] // tons rosa/romântico ❤️
    });

    // Se já passaram 30 segundos, para automaticamente
    if (Date.now() > endTime) {
      stopFireworks();
    }
  }, 1000);
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

// Tela de carregamento
window.addEventListener('load', () => {
  const loadingScreen = document.getElementById('loading-screen');
  const mainContent = document.getElementById('main-content');

  setTimeout(() => {
    loadingScreen.style.display = 'none'; // Esconde a tela de carregamento
    mainContent.style.display = 'block'; // Mostra o conteúdo principal
  }, 1000); // Garante o tempo de carregamento
});
