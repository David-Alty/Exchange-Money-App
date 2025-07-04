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
    }, 10000);
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
      timer = setInterval(() => next(), 10000);
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


// Exchange photo slider with effects
document.addEventListener('DOMContentLoaded', function() {
  const slider = document.querySelector('.slider');
  if (!slider) return;
  const imgs = Array.from(slider.querySelectorAll('img'));
  const effects = ['effect-fade', 'effect-zoom', 'effect-slide'];
  let current = 0;
  let timer = null;
  let paused = false;
  let effectIdx = 0;

  // Duraklat/oynat butonunu slider'ın üst ortasına ekle (sabit)
  let pauseBtn = slider.querySelector('.slider-btn.pause');
  if (!pauseBtn) {
    pauseBtn = document.createElement('button');
    pauseBtn.className = 'slider-btn pause';
    pauseBtn.setAttribute('aria-label', 'Duraklat/Başlat');
    pauseBtn.style.position = 'absolute';
    pauseBtn.style.left = '50%';
    pauseBtn.style.top = '2vw';
    pauseBtn.style.transform = 'translateX(-50%)';
    pauseBtn.style.background = 'none';
    pauseBtn.style.border = 'none';
    pauseBtn.style.cursor = 'pointer';
    pauseBtn.style.zIndex = '10';
    pauseBtn.innerHTML = `
      <svg class="pause-icon" width="38" height="38" viewBox="0 0 28 28"><circle cx="14" cy="14" r="13" fill="#fff" stroke="#ff8c00" stroke-width="2"/><rect x="9" y="8" width="3" height="12" rx="1.2" fill="#ff8c00"/><rect x="16" y="8" width="3" height="12" rx="1.2" fill="#ff8c00"/></svg>
      <svg class="play-icon" width="38" height="38" viewBox="0 0 28 28" style="display:none"><circle cx="14" cy="14" r="13" fill="#fff" stroke="#ff8c00" stroke-width="2"/><polygon points="11,8 21,14 11,20" fill="#ff8c00"/></svg>
    `;
    slider.style.position = 'relative';
    slider.appendChild(pauseBtn);
  }
  const pauseIcon = pauseBtn.querySelector('.pause-icon');
  const playIcon = pauseBtn.querySelector('.play-icon');

  function show(idx, effect) {
    imgs.forEach(img => {
      img.classList.remove('active', ...effects, 'paused');
    });
    current = (idx + imgs.length) % imgs.length;
    imgs[current].classList.add('active', effect);
    if (paused) imgs[current].classList.add('paused');
  }

  function next() {
    effectIdx = (effectIdx + 1) % effects.length;
    show(current + 1, effects[effectIdx]);
  }

  function startAuto() {
    clearInterval(timer);
    timer = setInterval(() => {
      if (!paused) next();
    }, 10000);
  }

  // Başlangıçta ilk resmi göster
  show(0, effects[0]);
  startAuto();

  // Duraklat/oynat butonu işlevi
  pauseBtn.onclick = function() {
    paused = !paused;
    if (paused) {
      pauseIcon.style.display = 'none';
      playIcon.style.display = 'inline';
      clearInterval(timer);
    } else {
      pauseIcon.style.display = 'inline';
      playIcon.style.display = 'none';
      startAuto();
    }
  };

  // Tıklayınca durdur ve büyüt
  imgs.forEach(img => {
    img.addEventListener('click', function() {
      paused = !paused;
      imgs.forEach(i => i.classList.remove('paused'));
      if (paused) {
        this.classList.add('paused');
        clearInterval(timer);
      } else {
        startAuto();
      }
    });
  });

  // Responsive için resize'da tekrar göster
  window.addEventListener('resize', () => show(current, effects[effectIdx]));
});

document.addEventListener('DOMContentLoaded', function() {
  // Kabul için arka planlar
  const kabulBox = document.querySelector('.contact-box.kabul');
  const kabulImages = [
    "images/27-mazar.jpg",   // Uzantı eklendi!
    "images/26-kabul.jpg"
  ];
  // Herat için arka planlar
  const heratBox = document.querySelector('.contact-box.herat');
  const heratImages = [
    "images/25-herat.jpg",
    "images/29-herat.jpg"
  ];
  function createBgDivs(box, images) {
    images.forEach((img, i) => {
      const div = document.createElement('div');
      div.className = 'contact-bg-anim' + (i === 0 ? ' active fade' : '');
      div.style.backgroundImage = `linear-gradient(rgba(0,78,143,0.60), rgba(0,78,143,0.60)), url('${img}')`;
      box.prepend(div);
    });
  }
  if (kabulBox && kabulImages.length > 0) createBgDivs(kabulBox, kabulImages);
  if (heratBox && heratImages.length > 0) createBgDivs(heratBox, heratImages);

  function startBgAnim(box, effectList = ['fade', 'zoom'], interval = 5000) {
    const bgDivs = box.querySelectorAll('.contact-bg-anim');
    let idx = 0, eff = 0;
    setInterval(() => {
      bgDivs.forEach(div => div.classList.remove('active', ...effectList));
      idx = (idx + 1) % bgDivs.length;
      eff = (eff + 1) % effectList.length;
      bgDivs[idx].classList.add('active', effectList[eff]);
    }, interval);
  }
  if (kabulBox) startBgAnim(kabulBox, ['fade', 'zoom'], 5000);
  if (heratBox) startBgAnim(heratBox, ['zoom', 'fade'], 5000);
});

// Smooth scroll for menu links
document.querySelectorAll('.side-menu a').forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if(href.startsWith('#')) {
      e.preventDefault();
      document.querySelector(href).scrollIntoView({behavior: "smooth"});
      sideMenu.classList.remove('open');
      overlay.classList.remove('show');
    }
  });
});

// Büyük ekranda yatay menüde smooth scroll
document.querySelectorAll('.main-nav a[href^="#"]').forEach(link => {
  link.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


// Saat dilimine göre selamla
document.addEventListener('DOMContentLoaded', function() {
  const titleDiv = document.querySelector('.card .title');
  if (titleDiv) {
    const now = new Date();
    const hour = now.getHours();
    let greeting = "صبح بخیر!";
    if (hour >= 12 && hour < 17) {
      greeting = "ظهر بخیر!";
    } else if (hour >= 17 && hour < 20) {
      greeting = "عصر بخیر!";
    } else if (hour >= 20 || hour < 5) {
      greeting = "شب بخیر!";
    }
    titleDiv.textContent = greeting;
  }

  const today = new Date();
  const weekDaysFa = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'];
  document.getElementById('dayName').textContent = 'روز: ' + weekDaysFa[today.getDay()];

  // Miladi
  document.getElementById('miladi').textContent = `میلادی: ${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`;

  // Shamsi
  const jDate = jalaali.toJalaali(today);
  document.getElementById('shamsi').textContent = `هجری شمسی: ${jDate.jy}/${jDate.jm}/${jDate.jd}`;

  // Hijri (Qamari)
  function gregorianToHijri(gDate) {
    const g2h = new Intl.DateTimeFormat('ar-TN-u-ca-islamic', {
      day: 'numeric', month: 'numeric', year: 'numeric'
    }).format(gDate);
    return g2h.replace(/\s?هـ$/, ''); // Remove "هـ"
  }
  document.getElementById('qamari').textContent = `هجری قمری: ${gregorianToHijri(today)}`;
});

// Kart arka planını localStorage'dan uygula
document.addEventListener('DOMContentLoaded', function() {
  const customBg = localStorage.getItem('customCardBg');
  if (customBg) {
    const style = document.createElement('style');
    style.innerHTML = `
      .card::before {
        background: linear-gradient(0deg, #fff8 60%, #fff9 100%), url('${customBg}') center center/cover no-repeat !important;
      }
    `;
    document.head.appendChild(style);
  }
});

// Kart arka planını sunucudan uygula (herkes için)
document.addEventListener('DOMContentLoaded', function() {
  fetch('/card-bg-url')
    .then(r => r.ok ? r.text() : null)
    .then(url => {
      if (url && url.startsWith('http')) {
        const style = document.createElement('style');
        style.innerHTML = `
          .card::before {
            background: linear-gradient(0deg, #fff8 60%, #fff9 100%), url('${url}') center center/cover no-repeat !important;
          }
        `;
        document.head.appendChild(style);
      }
    });
});

// Kabul döviz tablosu (zaten vardı)
document.addEventListener('DOMContentLoaded', function() {
  const table = document.getElementById('exchangeRatesTable');
  if (!table) return;
  const tbody = table.querySelector('tbody');
  tbody.innerHTML = '';
  let rows = [];
  try {
    rows = JSON.parse(localStorage.getItem('exchangeRates') || '[]');
  } catch {}
  if (rows.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;color:#888;">هیچ نرخ ثبت نشده است.</td></tr>';
  } else {
    rows.forEach(r => {
      tbody.innerHTML += `
        <tr>
          <td>
            <div style="display:flex;align-items:center;gap:0.5em;justify-content:right">
              <img src="${r.flag || ''}" alt="" style="width:28px;height:28px;border-radius:50%;object-fit:cover;border:1px solid #e3e3e3;">
              <span>${r.currency}</span>
            </div>
          </td>
          <td>${r.buy}</td>
          <td>${r.sell}</td>
        </tr>
      `;
    });
  }
});

// Herat döviz tablosu
document.addEventListener('DOMContentLoaded', function() {
  const table = document.getElementById('heratExchangeRatesTable');
  if (!table) return;
  const tbody = table.querySelector('tbody');
  tbody.innerHTML = '';
  let rows = [];
  try {
    rows = JSON.parse(localStorage.getItem('heratExchangeRates') || '[]');
  } catch {}
  if (rows.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;color:#888;">هیچ نرخ ثبت نشده است.</td></tr>';
  } else {
    rows.forEach(r => {
      tbody.innerHTML += `
        <tr>
          <td>
            <div>
              <img src="${r.flag || ''}" alt="">
              <span>${r.currency}</span>
            </div>
          </td>
          <td>${r.buy}</td>
          <td>${r.sell}</td>
        </tr>
      `;
    });
  }
});

// Kabul döviz tablosu
document.addEventListener('DOMContentLoaded', function() {
  function updateKabulTable() {
    const table = document.getElementById('exchangeRatesTable');
    if (!table) return;
    const tbody = table.querySelector('tbody');
    tbody.innerHTML = '';
    let rows = [];
    try {
      rows = JSON.parse(localStorage.getItem('exchangeRates') || '[]');
    } catch {}
    if (rows.length === 0) {
      tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;color:#888;">هیچ نرخ ثبت نشده است.</td></tr>';
    } else {
      rows.forEach(r => {
        tbody.innerHTML += `
          <tr>
            <td>
              <div style="display:flex;align-items:center;gap:0.5em;justify-content:right">
                <img src="${r.flag || ''}" alt="" style="width:28px;height:28px;border-radius:50%;object-fit:cover;border:1px solid #e3e3e3;">
                <span>${r.currency}</span>
              </div>
            </td>
            <td>${r.buy}</td>
            <td>${r.sell}</td>
          </tr>
        `;
      });
    }
  }

  // Initial load
  updateKabulTable();

  // Listen for changes
  window.addEventListener('storage', function(e) {
    if (e.key === 'exchangeRates') {
      updateKabulTable();
    }
  });

  // Also listen for custom event
  window.addEventListener('exchangeRatesUpdated', function() {
    updateKabulTable();
  });
});

// Add Herat table update function similar to Kabul
document.addEventListener('DOMContentLoaded', function() {
  function updateHeratTable() {
    const table = document.getElementById('heratExchangeRatesTable');
    if (!table) return;
    const tbody = table.querySelector('tbody');
    tbody.innerHTML = '';
    let rows = [];
    try {
      rows = JSON.parse(localStorage.getItem('heratExchangeRates') || '[]');
    } catch {}
    if (rows.length === 0) {
      tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;color:#888;">هیچ نرخ ثبت نشده است.</td></tr>';
    } else {
      rows.forEach(r => {
        tbody.innerHTML += `
          <tr>
            <td>
              <div style="display:flex;align-items:center;gap:0.5em;justify-content:right">
                <img src="${r.flag || ''}" alt="" style="width:28px;height:28px;border-radius:50%;object-fit:cover;border:1px solid #e3e3e3;">
                <span>${r.currency}</span>
              </div>
            </td>
            <td>${r.buy}</td>
            <td>${r.sell}</td>
          </tr>
        `;
      });
    }
  }

  // Initial load for Herat
  updateHeratTable();

  // Listen for Herat changes
  window.addEventListener('storage', function(e) {
    if (e.key === 'heratExchangeRates') {
      updateHeratTable();
    }
  });

  // Also listen for custom event for Herat
  window.addEventListener('heratExchangeRatesUpdated', function() {
    updateHeratTable();
  });
});

document.addEventListener('DOMContentLoaded', function() {
  // For Kabul exchange rates info
  const kabulInfo = localStorage.getItem('kabulTableInfo');
  if (kabulInfo && kabulInfo.trim()) {
    const kabulInfoDiv = document.createElement('div');
    kabulInfoDiv.textContent = kabulInfo;
    kabulInfoDiv.style.cssText = 'margin-top:1rem;padding:0.8rem;border:1px solid #ccc;border-radius:5px;background:#f9f9fb;color:#004080;font-size:1.1rem;line-height:1.8;text-align:right;';
    const kabulSection = document.querySelector('#exchange-rates');
    if (kabulSection) {
      const kabulTable = kabulSection.querySelector('table');
      if (kabulTable) {
        kabulTable.parentNode.insertBefore(kabulInfoDiv, kabulTable.nextSibling);
      }
    }
  }

  // For Herat exchange rates info
  const heratInfo = localStorage.getItem('heratTableInfo');
  if (heratInfo && heratInfo.trim()) {
    const heratInfoDiv = document.createElement('div');
    heratInfoDiv.textContent = heratInfo;
    heratInfoDiv.style.cssText = 'margin-top:1rem;padding:0.8rem;border:1px solid #ccc;border-radius:5px;background:#f9f9fb;color:#004080;font-size:1.1rem;line-height:1.8;text-align:right;';
    const heratSection = document.querySelector('#herat-exchange-rates');
    if (heratSection) {
      const heratTable = heratSection.querySelector('table');
      if (heratTable) {
        heratTable.parentNode.insertBefore(heratInfoDiv, heratTable.nextSibling);
      }
    }
  }
});

// Update both Kabul and Herat tables when storage changes
document.addEventListener('DOMContentLoaded', function() {
  function updateTablesInfo() {
    // For Kabul table info
    const kabulInfo = localStorage.getItem('kabulTableInfo');
    const kabulSection = document.querySelector('#exchange-rates');
    if (kabulSection) {
      // Remove existing info div if any
      const existingKabulInfo = kabulSection.querySelector('.table-info');
      if (existingKabulInfo) {
        existingKabulInfo.remove();
      }
      
      // Add new info if exists
      if (kabulInfo && kabulInfo.trim()) {
        const kabulInfoDiv = document.createElement('div');
        kabulInfoDiv.className = 'table-info';
        kabulInfoDiv.textContent = kabulInfo;
        kabulInfoDiv.style.cssText = 'margin-top:1rem;padding:0.8rem;border:1px solid #ccc;border-radius:5px;background:#f9f9fb;color:#004080;font-size:1.1rem;line-height:1.8;text-align:right;';
        const kabulTable = kabulSection.querySelector('table');
        if (kabulTable) {
          kabulTable.parentNode.insertBefore(kabulInfoDiv, kabulTable.nextSibling);
        }
      }
    }

    // For Herat table info
    const heratInfo = localStorage.getItem('heratTableInfo');
    const heratSection = document.querySelector('#herat-exchange-rates');
    if (heratSection) {
      // Remove existing info div if any
      const existingHeratInfo = heratSection.querySelector('.table-info');
      if (existingHeratInfo) {
        existingHeratInfo.remove();
      }
      
      // Add new info if exists
      if (heratInfo && heratInfo.trim()) {
        const heratInfoDiv = document.createElement('div');
        heratInfoDiv.className = 'table-info';
        heratInfoDiv.textContent = heratInfo;
        heratInfoDiv.style.cssText = 'margin-top:1rem;padding:0.8rem;border:1px solid #ccc;border-radius:5px;background:#f9f9fb;color:#004080;font-size:1.1rem;line-height:1.8;text-align:right;';
        const heratTable = heratSection.querySelector('table');
        if (heratTable) {
          heratTable.parentNode.insertBefore(heratInfoDiv, heratTable.nextSibling);
        }
      }
    }
  }

  // Initial update
  updateTablesInfo();

  // Listen for storage changes
  window.addEventListener('storage', function(e) {
    if (e.key === 'kabulTableInfo' || e.key === 'heratTableInfo') {
      updateTablesInfo();
    }
  });
});

// Finans Slider Fonksiyonları
function initFinanceSlider() {
  const slider = document.querySelector('.exchange-photo-slider');
  if (!slider) return;

  const imgs = Array.from(slider.querySelectorAll('img'));
  const prevBtn = slider.querySelector('.finance-prev');
  const nextBtn = slider.querySelector('.finance-next');
  let current = 0;
  let timer = null;

  function show(idx) {
    imgs[current].classList.remove('active');
    current = (idx + imgs.length) % imgs.length;
    imgs[current].classList.add('active');
  }

  function next() {
    show(current + 1);
  }

  function prev() {
    show(current - 1);
  }

  function startAutoPlay() {
    timer = setInterval(next, 10000); // 10 saniye
  }

  prevBtn?.addEventListener('click', () => {
    prev();
    clearInterval(timer);
    startAutoPlay();
  });

  nextBtn?.addEventListener('click', () => {
    next();
    clearInterval(timer);
    startAutoPlay();
  });

  show(0);
  startAutoPlay();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initFinanceSlider();
});

// ...existing code...

// --- REMOVE or COMMENT OUT these blocks ---
// The blocks that fill #exchangeRatesTable and #heratExchangeRatesTable from localStorage

// --- ADD THIS CODE at the end of app.js or after DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', function() {
  // Helper to fetch and render a table
  async function fetchAndRenderRates(apiUrl, tableId) {
    try {
      const res = await fetch(apiUrl);
      const data = await res.json();
      const tbody = document.querySelector(`#${tableId} tbody`);
      if (!tbody) return;
      tbody.innerHTML = '';
      data.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>
            ${row.flag ? `<img src="${row.flag}" alt="" style="width:28px;height:20px;vertical-align:middle;margin-left:6px;border-radius:4px;border:1px solid #eee;">` : ''}
            ${row.currency || ''}
          </td>
          <td>${row.buy || ''}</td>
          <td>${row.sell || ''}</td>
        `;
        tbody.appendChild(tr);
      });
    } catch (err) {
      console.error('Error fetching rates:', err);
    }
  }

  // Example usage for your tables (make sure table IDs and API URLs are correct)
  fetchAndRenderRates('/api/rates/sarai-shazada', 'exchangeRatesTable');
  fetchAndRenderRates('/api/rates/other-currencies', 'otherCurrenciesTable');
  fetchAndRenderRates('/api/rates/da-afg-bank', 'afgBankExchangeRatesTable');
});

//this is only for herat exchange rates
document.addEventListener('DOMContentLoaded', async () => {
  const apiUrl = '/api/rates/khorasan-market'; // Your API endpoint

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    const firstRow = data.firstRow;
    const remainingRows = data.remainingRows;

    // Target the table for the first row (assuming you've added this new table in HTML)
    const specialFirstRateTableBody = document.querySelector('#specialFirstRateTable tbody');
    if (specialFirstRateTableBody && firstRow) {
      specialFirstRateTableBody.innerHTML = `
        <tr>
          <td>
            ${firstRow.flag ? `<img src="${firstRow.flag}" alt="" style="width:28px;height:20px;vertical-align:middle;margin-left:6px;border-radius:4px;border:1px solid #eee;">` : ''}
            ${firstRow.currency || ''}
          </td>
          <td>${firstRow.buy || ''}</td>
          <td>${firstRow.sell || ''}</td>
        </tr>
      `;
    }

    // Target your existing Herat table for the remaining rows
    const heratExchangeRatesTableBody = document.querySelector('#heratExchangeRatesTable tbody');
    if (heratExchangeRatesTableBody) {
      heratExchangeRatesTableBody.innerHTML = ''; // Clear existing content
      remainingRows.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>
            ${row.flag ? `<img src="${row.flag}" alt="" style="width:28px;height:20px;vertical-align:middle;margin-left:6px;border-radius:4px;border:1px solid #eee;">` : ''}
            ${row.currency || ''}
          </td>
          <td>${row.buy || ''}</td>
          <td>${row.sell || ''}</td>
        `;
        heratExchangeRatesTableBody.appendChild(tr);
      });
    }

  } catch (error) {
    console.error("Error fetching currency data:", error);
    // Handle error display on page
  }
});


document.addEventListener('DOMContentLoaded', function() {
  const selector = document.getElementById('tableSelector');
  const sectionIds = [
    'exchange-rates',
    'herat-exchange-rates',
    'afg-bank',
    'other-currencies',
    'khorasan-usd-rates'
  ];

  selector.addEventListener('change', function() {
    sectionIds.forEach(id => {
      const section = document.getElementById(id);
      if (section) {
        section.style.display = (id === selector.value) ? '' : 'none';
      }
    });
  });

  // Hide all except the first on load
  sectionIds.forEach((id, idx) => {
    const section = document.getElementById(id);
    if (section) section.style.display = idx === 0 ? '' : 'none';
  });
});

function showLoading(tableId) {
  const tbody = document.querySelector(`#${tableId} tbody`);
  if (tbody) {
    tbody.innerHTML = `<tr><td colspan="3" style="text-align:center;">در حال بارگذاری...</td></tr>`;
  }
}

// Example usage for Kabul exchange rates
async function loadKabulRates() {
  showLoading('exchangeRatesTable');
  try {
    const res = await fetch('/api/exchange/kabul');
    const data = await res.json();
    const tbody = document.querySelector('#exchangeRatesTable tbody');
    if (!Array.isArray(data) || data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="3" style="text-align:center;">داده‌ای یافت نشد.</td></tr>`;
      return;
    }
    tbody.innerHTML = '';
    data.forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${row.currency}</td>
        <td>${row.buy}</td>
        <td>${row.sell}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    const tbody = document.querySelector('#exchangeRatesTable tbody');
    tbody.innerHTML = `<tr><td colspan="3" style="text-align:center;"> در بارگذاری داده‌ها.</td></tr>`;
  }
}

// Call this function on page load or when needed
loadKabulRates();

