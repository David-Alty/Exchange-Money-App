const sideMenu = document.getElementById('sideMenu');
const openBtn = document.getElementById('openMenuBtn');
const closeBtn = document.getElementById('closeMenuBtn');
const overlay = document.getElementById('menuOverlay');
openBtn.onclick = () => {
  sideMenu.classList.add('open');
  overlay.classList.add('show');
};
closeBtn.onclick = overlay.onclick = () => {
  sideMenu.classList.remove('open');
  overlay.classList.remove('show');
};

// Smooth scroll for menu links
document.querySelectorAll('.side-menu a').forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if(href.startsWith('#')) {
      e.preventDefault();
      sideMenu.classList.remove('open');
      overlay.classList.remove('show');
      document.querySelector(href).scrollIntoView({behavior: 'smooth'});
    }
  });
});

// Fade-in animation for sections
function revealSectionsOnScroll() {
  document.querySelectorAll('section').forEach(sec => {
    const rect = sec.getBoundingClientRect();
    if(rect.top < window.innerHeight - 40) {
      sec.classList.add('visible');
    }
  });
}
window.addEventListener('scroll', revealSectionsOnScroll);
window.addEventListener('DOMContentLoaded', revealSectionsOnScroll);
// Smooth scroll to top button

// Dynamic favicon creation
window.addEventListener('DOMContentLoaded', function() {
  const img = new Image();
  img.src = 'images/1-logo.jpg';
  img.crossOrigin = 'anonymous';
  img.onload = function() {
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(size/2, size/2, size/2, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img, 0, 0, size, size);
    const favicon = document.querySelector('link[rel="shortcut icon"]') || document.createElement('link');
    favicon.type = 'image/png';
    favicon.rel = 'shortcut icon';
    favicon.href = canvas.toDataURL('image/png');
    document.head.appendChild(favicon);
  };
});

// Social icons jump animation in order (slower)
window.addEventListener('DOMContentLoaded', function() {
  const icons = document.querySelectorAll('.social-icons-horizontal a');
  let current = 0;
  setInterval(() => {
    icons.forEach((a, i) => a.classList.remove('jumping'));
    icons[current].classList.add('jumping');
    current = (current + 1) % icons.length;
  }, 1800); // Slower interval
  // Click-grow-then-open
  icons.forEach(a => {
    a.addEventListener('click', function(e) {
      e.preventDefault();
      icons.forEach(icon => icon.classList.remove('clicked'));
      this.classList.add('clicked');
      const url = this.href;
      setTimeout(() => {
        window.open(url, '_blank');
        this.classList.remove('clicked');
      }, 260); // Delay for grow effect
    });
  });
});

// Basit slider/carousel
window.addEventListener('DOMContentLoaded', function() {
  const slides = document.querySelectorAll('.slider img');
  const prevBtn = document.querySelector('.slider-btn.prev');
  const nextBtn = document.querySelector('.slider-btn.next');
  const pauseBtn = document.querySelector('.slider-btn.pause');
  const pauseIcon = pauseBtn.querySelector('.pause-icon');
  const playIcon = pauseBtn.querySelector('.play-icon');
  const effects = ['fade', 'zoom', 'slide'];
  let current = 0;
  let timer = null;
  let paused = false;
  let lastEffect = 0;

  function clearEffects() {
    slides.forEach(slide => {
      slide.classList.remove('fade', 'zoom', 'slide');
    });
  }

  function showSlide(idx, effectIdx = null) {
    slides[current].classList.remove('active', ...effects);
    current = (idx + slides.length) % slides.length;
    clearEffects();
    let effect = effectIdx !== null ? effects[effectIdx] : effects[Math.floor(Math.random()*effects.length)];
    slides[current].classList.add('active', effect);
    lastEffect = effects.indexOf(effect);
  }

  function nextSlide() {
    showSlide(current + 1, (lastEffect + 1) % effects.length);
  }
  function prevSlide() {
    showSlide(current - 1, (lastEffect + 2) % effects.length);
  }

  nextBtn.addEventListener('click', () => {
    nextSlide();
    restartAuto();
  });
  prevBtn.addEventListener('click', () => {
    prevSlide();
    restartAuto();
  });

  pauseBtn.addEventListener('click', () => {
    paused = !paused;
    if (paused) {
      clearInterval(timer);
      pauseIcon.style.display = "none";
      playIcon.style.display = "inline";
    } else {
      autoSlide();
      pauseIcon.style.display = "inline";
      playIcon.style.display = "none";
    }
  });

  function autoSlide() {
    clearInterval(timer);
    timer = setInterval(() => {
      if (!paused) nextSlide();
    }, 3000);
  }
  function restartAuto() {
    if (!paused) autoSlide();
  }

  // Başlangıçta ilk efekti uygula
  showSlide(0, 0);
  autoSlide();
});

// Galeri modal açma ve animasyon sırası
window.addEventListener('DOMContentLoaded', function() {
  // Animasyon sırası için index ayarla
  document.querySelectorAll('.gallery-grid img').forEach((img, i) => {
    img.style.setProperty('--i', i);
    img.addEventListener('click', function() {
      document.getElementById('modalImg').src = this.src;
      document.getElementById('galleryModal').classList.add('active');
    });
  });
  document.getElementById('closeModal').onclick = function() {
    document.getElementById('galleryModal').classList.remove('active');
  };
  document.getElementById('galleryModal').onclick = function(e) {
    if(e.target === this) this.classList.remove('active');
  };
});

window.addEventListener('DOMContentLoaded', function() {
  const galleryImgs = Array.from(document.querySelectorAll('.gallery-grid img'));
  const modal = document.getElementById('galleryModal');
  const modalImg = document.getElementById('modalImg');
  const closeModal = document.getElementById('closeModal');
  const prevBtn = document.querySelector('.gallery-modal-btn.prev');
  const nextBtn = document.querySelector('.gallery-modal-btn.next');
  const pauseBtn = document.querySelector('.gallery-modal-btn.pause');
  const pauseIcon = pauseBtn.querySelector('.pause-icon');
  const playIcon = pauseBtn.querySelector('.play-icon');
  let current = 0;
  let timer = null;
  let paused = false;
  const effects = ['fade', 'zoom-in', 'slide-left', 'slide-right'];

  function showModal(idx, effect) {
    current = (idx + galleryImgs.length) % galleryImgs.length;
    // Geçiş efekti uygula
    modalImg.className = '';
    if (effect) {
      modalImg.classList.add(effect);
      setTimeout(() => {
        modalImg.className = '';
        modalImg.src = galleryImgs[current].src;
      }, 200);
      setTimeout(() => {
        modalImg.classList.add('show');
      }, 220);
    } else {
      modalImg.src = galleryImgs[current].src;
    }
    modal.classList.add('active');
    startAuto();
    updatePauseIcon();
  }
  function closeModalFunc() {
    modal.classList.remove('active');
    stopAuto();
  }
  function next(effect) { showModal(current + 1, effect || randomEffect()); }
  function prev(effect) { showModal(current - 1, effect || randomEffect()); }
  function startAuto() {
    stopAuto();
    if (!paused) {
      timer = setInterval(() => next(), 2500);
    }
  }
  function stopAuto() {
    clearInterval(timer);
  }
  function togglePause() {
    paused = !paused;
    updatePauseIcon();
    if (paused) stopAuto();
    else startAuto();
  }
  function updatePauseIcon() {
    if (pauseIcon && playIcon) {
      pauseIcon.style.display = paused ? "none" : "inline";
      playIcon.style.display = paused ? "inline" : "none";
    }
  }
  function randomEffect() {
    return effects[Math.floor(Math.random() * effects.length)];
  }

  galleryImgs.forEach((img, i) => {
    img.style.setProperty('--i', i);
    img.addEventListener('click', () => showModal(i, randomEffect()));
  });
  closeModal.onclick = closeModalFunc;
  modal.onclick = function(e) { if(e.target === modal) closeModalFunc(); };
  nextBtn.onclick = (e) => { e.stopPropagation(); next(); };
  prevBtn.onclick = (e) => { e.stopPropagation(); prev(); };
  pauseBtn.onclick = (e) => { e.stopPropagation(); togglePause(); };
});

