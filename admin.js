const ADMIN_PASSWORD = "parwan2024"; // Şifrenizi değiştirin

// Şifre giriş formu için
const loginForm = document.getElementById('adminLoginForm');
if (loginForm) {
  loginForm.onsubmit = function(e) {
    e.preventDefault();
    const pass = document.getElementById('adminPassword').value;
    const errorDiv = document.getElementById('loginError');
    if (pass === ADMIN_PASSWORD) {
      errorDiv.textContent = "";
      sessionStorage.setItem('admin-auth', 'ok');
      window.open("admin-panel.html", "_blank");
    } else {
      errorDiv.textContent = "رمز عبور اشتباه است!";
    }
  };
}

// admin-panel.html'ye şifresiz erişimi engelle
if (window.location.pathname.endsWith('admin-panel.html')) {
  if (sessionStorage.getItem('admin-auth') !== 'ok') {
    window.location.replace("admin-login.html");
  }
}

// --- EKLE: Tümünü Sil ve Düzenle (Ayarla) butonları için kod ---

// Admin panelindeysek tabloya butonları ekle
if (window.location.pathname.endsWith('admin-panel.html')) {
  document.addEventListener('DOMContentLoaded', function() {
    // Tabloya "تنظیم" (düzenle) butonu ekle
    const table = document.querySelector('table');
    const tbody = table ? table.querySelector('tbody') : null;
    if (!tbody) return;

    // Her satırda "حذف" ve "تنظیم" butonlarını güncelle
    function renderTable() {
      let rows = [];
      try {
        rows = JSON.parse(localStorage.getItem('exchangeRates') || '[]');
      } catch {}
      tbody.innerHTML = '';
      rows.forEach((r, i) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><img src="${r.flag || ''}" alt="" style="width:28px;height:28px;border-radius:50%;object-fit:cover;border:1px solid #e3e3e3;"> <span>${r.currency}</span></td>
          <td>${r.buy}</td>
          <td>${r.sell}</td>
          <td>
            <button class="edit-rate-btn" data-index="${i}" style="background:#1976d2;color:#fff;border:none;border-radius:6px;padding:0.2em 0.8em;margin-left:0.3em;cursor:pointer;">تنظیم</button>
            <button class="delete-rate-btn" data-index="${i}" style="background:#d32f2f;color:#fff;border:none;border-radius:6px;padding:0.2em 0.8em;cursor:pointer;">حذف</button>
          </td>
        `;
        tbody.appendChild(tr);
      });

      // Silme işlemi
      tbody.querySelectorAll('.delete-rate-btn').forEach(btn => {
        btn.onclick = function() {
          const idx = +this.dataset.index;
          if (confirm('این نرخ حذف شود؟')) {
            rows.splice(idx, 1);
            localStorage.setItem('exchangeRates', JSON.stringify(rows));
            renderTable();
          }
        };
      });

      // Düzenleme işlemi
      tbody.querySelectorAll('.edit-rate-btn').forEach(btn => {
        btn.onclick = function() {
          const idx = +this.dataset.index;
          const row = rows[idx];
          // Basit prompt ile düzenleme (gelişmiş form için ayrı kod gerekir)
          const newCurrency = prompt('واحد پولی:', row.currency);
          if (newCurrency === null) return;
          const newBuy = prompt('خرید:', row.buy);
          if (newBuy === null) return;
          const newSell = prompt('فروش:', row.sell);
          if (newSell === null) return;
          rows[idx] = { ...row, currency: newCurrency, buy: newBuy, sell: newSell };
          localStorage.setItem('exchangeRates', JSON.stringify(rows));
          renderTable();
        };
      });
    }

    renderTable();
  });
}
