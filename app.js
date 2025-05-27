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

