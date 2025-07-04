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


// --- EKLE: Tümünü Sil ve Düzenle (Ayarla) butonları için kod ---

// Admin panelindeysek tabloya butonları ekle
if (window.location.pathname.endsWith('admin-panel.html')) {
  document.addEventListener('DOMContentLoaded', function() {
    const kabulTableElem = document.getElementById('exchangeRatesTable');
    const kabulTbody = kabulTableElem ? kabulTableElem.querySelector('tbody') : null;
    if (!kabulTbody) return;

    function loadKabulRates() {
      try {
        return JSON.parse(localStorage.getItem('exchangeRates') || '[]');
      } catch {
        return [];
      }
    }

    function saveKabulRates(rows) {
      localStorage.setItem('exchangeRates', JSON.stringify(rows));
      // Force update in other tabs/windows
      window.dispatchEvent(new Event('storage'));
      // Force update in current tab
      renderKabulTable();
    }

    function renderKabulTable() {
      const rows = loadKabulRates();
      kabulTbody.innerHTML = '';
      
      rows.forEach((r, i) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>
            <img src="${r.flag || ''}" alt="" style="width:28px;height:28px;border-radius:50%;object-fit:cover;border:1px solid #e3e3e3;">
            <span>${r.currency}</span>
          </td>
          <td>${r.buy}</td>
          <td>${r.sell}</td>
          <td>
            <button class="edit-rate-btn" data-index="${i}" style="background:#1976d2;color:#fff;border:none;border-radius:6px;padding:0.2em 0.8em;margin-left:0.3em;cursor:pointer;">تنظیم</button>
            <button class="delete-rate-btn" data-index="${i}" style="background:#d32f2f;color:#fff;border:none;border-radius:6px;padding:0.2em 0.8em;cursor:pointer;">حذف</button>
          </td>
        `;
        kabulTbody.appendChild(tr);
      });

      // Silme butonu işlemleri
      kabulTbody.querySelectorAll('.delete-rate-btn').forEach(btn => {
        btn.onclick = function() {
          const idx = +this.dataset.index;
          if (confirm('این نرخ حذف شود؟')) {
            const rows = loadKabulRates();
            rows.splice(idx, 1);
            saveKabulRates(rows);
          }
        };
      });

      // Düzenleme butonu işlemleri  
      kabulTbody.querySelectorAll('.edit-rate-btn').forEach(btn => {
        btn.onclick = function() {
          const idx = +this.dataset.index;
          const rows = loadKabulRates();
          const row = rows[idx];

          const newCurrency = prompt('واحد پولی:', row.currency);
          if (newCurrency === null) return;
          const newBuy = prompt('خرید:', row.buy);
          if (newBuy === null) return;
          const newSell = prompt('فروش:', row.sell);
          if (newSell === null) return;

          rows[idx] = { ...row, currency: newCurrency, buy: newBuy, sell: newSell };
          saveKabulRates(rows);
        };
      });
    }

    // İlk yükleme
    renderKabulTable();

    // Diğer sekmelerde değişiklik olursa güncelle
    window.addEventListener('storage', function(e) {
      if (e.key === 'exchangeRates') {
        renderKabulTable();
      }
    });
  });
}

// --- Kabul tablosu zaten mevcut ---

// --- Herat tablosu yönetimi ---
if (window.location.pathname.endsWith('admin-panel.html')) {
  document.addEventListener('DOMContentLoaded', function() {
    // Herat tablosu:
    const heratForm = document.getElementById('heratExchangeForm');
    if (!heratForm) return;
    let rows = [];
    const currency = document.getElementById('heratCurrency');
    const buy = document.getElementById('heratBuy');
    const sell = document.getElementById('heratSell');
    const flagSelect = document.getElementById('heratFlagSelect');
    const table = document.getElementById('heratExchangeTable') 
      ? document.getElementById('heratExchangeTable').querySelector('tbody')
      : null;
    const addRowBtn = document.getElementById('addHeratRowBtn');
    const saveBtn = document.getElementById('saveHeratExchangeBtn');
    const msg = document.getElementById('heratExchangeMsg');

    if (!table) return; // Eğer tablo yoksa devam etme

    function loadRows() {
      rows = [];
      const saved = localStorage.getItem('heratExchangeRates');
      if (saved) {
        try { rows = JSON.parse(saved); } catch {}
      }
    }
    function renderTable() {
      table.innerHTML = '';
      rows.forEach((r, i) => {
        const tr = document.createElement('tr');
        if (r._editing) {
          tr.innerHTML = `
            <td><img src="${r.flag || ''}" alt="" style="width:32px;height:32px;border-radius:50%;object-fit:cover;border:1.5px solid #ccc;background:#fff;"></td>
            <td><input type="text" value="${r.currency}" style="width:90px"></td>
            <td><input type="number" value="${r.buy}" style="width:60px"></td>
            <td><input type="number" value="${r.sell}" style="width:60px"></td>
            <td>
              <button type="button" data-i="${i}" class="save-edit-btn" style="color:#388e3c;background:none;border:none;font-size:1.1rem;cursor:pointer;transition:background 0.18s;">ذخیره</button>
              <button type="button" data-i="${i}" class="cancel-edit-btn" style="color:#d32f2f;background:none;border:none;font-size:1.1rem;cursor:pointer;transition:background 0.18s;">لغو</button>
            </td>
          `;
        } else {
          tr.innerHTML = `
            <td><img src="${r.flag || ''}" alt="" style="width:32px;height:32px;border-radius:50%;object-fit:cover;border:1.5px solid #ccc;background:#fff;"></td>
            <td>${r.currency}</td>
            <td>${r.buy}</td>
            <td>${r.sell}</td>
            <td>
              <button type="button" data-i="${i}" class="edit-row-btn" style="color:#1976d2;background:none;border:none;font-size:1.1rem;cursor:pointer;transition:background 0.18s;">تنظیم</button>
              <button type="button" data-i="${i}" class="delete-row-btn" style="color:#d32f2f;background:none;border:none;font-size:1.2rem;cursor:pointer;transition:background 0.18s;">✖</button>
            </td>
          `;
        }
        table.appendChild(tr);
      });
    }
    function saveRows() {
      // Remove _editing flags before save
      const cleanRows = rows.map(r => {
        const { _editing, ...rest } = r;
        return rest;
      });
      localStorage.setItem('heratExchangeRates', JSON.stringify(cleanRows));
    }
    // Initial load
    loadRows();
    renderTable();

    // Add row
    addRowBtn.onclick = function() {
      if (!currency.value.trim() || !buy.value.trim() || !sell.value.trim() || !flagSelect.value) {
        msg.textContent = "لطفاً همه فیلدها و پرچم را وارد کنید.";
        return;
      }
      rows.push({flag: flagSelect.value, currency: currency.value, buy: buy.value, sell: sell.value});
      currency.value = buy.value = sell.value = '';
      flagSelect.selectedIndex = 0;
      renderTable();
      msg.textContent = "";
    };

    // Table events
    table.onclick = function(e) {
      const i = +e.target.getAttribute('data-i');
      if (e.target.classList.contains('delete-row-btn')) {
        rows.splice(i, 1);
        renderTable();
      }
      if (e.target.classList.contains('edit-row-btn')) {
        rows.forEach(r => delete r._editing);
        rows[i]._editing = true;
        renderTable();
      }
      if (e.target.classList.contains('cancel-edit-btn')) {
        delete rows[i]._editing;
        renderTable();
      }
      if (e.target.classList.contains('save-edit-btn')) {
        const tr = e.target.closest('tr');
        const inputs = tr.querySelectorAll('input');
        rows[i].currency = inputs[0].value;
        rows[i].buy = inputs[1].value;
        rows[i].sell = inputs[2].value;
        delete rows[i]._editing;
        renderTable();
        saveRows();
        msg.textContent = "تغییرات ذخیره شد.";
        setTimeout(()=>{msg.textContent="";}, 2000);
      }
    };

    // Save all
    saveBtn.onclick = function() {
      saveRows();
      msg.textContent = "نرخ‌های هرات ذخیره شد. در صفحه اصلی نمایش داده خواهد شد.";
      setTimeout(()=>{msg.textContent="";}, 3000);
    };
  });
}

// --- Kabul tablosu bilgilerini kaydetme ---
if (window.location.pathname.endsWith('admin-panel.html')) {
  document.addEventListener('DOMContentLoaded', function() {
    const kabulInfoInput = document.getElementById('kabulTableInfo');
    const saveKabulInfoBtn = document.getElementById('saveKabulInfoBtn');
    const clearKabulInfoBtn = document.getElementById('clearKabulInfoBtn');

    const heratInfoInput = document.getElementById('heratTableInfo');
    const saveHeratInfoBtn = document.getElementById('saveHeratInfoBtn');
    const clearHeratInfoBtn = document.getElementById('clearHeratInfoBtn');

    function showMessage(btn, text) {
      const msg = document.createElement('div');
      msg.textContent = text;
      msg.style.cssText = 'color:#388e3c;font-size:0.9rem;margin-top:0.5rem;';
      btn.parentNode.appendChild(msg);
      setTimeout(() => msg.remove(), 3000);
    }

    // Load existing info from localStorage
    kabulInfoInput.value = localStorage.getItem('kabulTableInfo') || '';
    heratInfoInput.value = localStorage.getItem('heratTableInfo') || '';

    // Save Kabul table info
    saveKabulInfoBtn.onclick = function() {
      const info = kabulInfoInput.value.trim();
      if (info) {
        localStorage.setItem('kabulTableInfo', info);
        showMessage(saveKabulInfoBtn, 'اطلاعات جدول کابل ذخیره شد');
        // Force update
        window.dispatchEvent(new Event('storage'));
      }
    };

    // Clear Kabul table info
    clearKabulInfoBtn.onclick = function() {
      kabulInfoInput.value = '';
      localStorage.removeItem('kabulTableInfo');
      showMessage(clearKabulInfoBtn, 'اطلاعات جدول کابل پاک شد');
    };

    // Save Herat table info  
    saveHeratInfoBtn.onclick = function() {
      const info = heratInfoInput.value.trim();
      if (info) {
        localStorage.setItem('heratTableInfo', info);
        showMessage(saveHeratInfoBtn, 'اطلاعات جدول هرات ذخیره شد');
        // Force update
        window.dispatchEvent(new Event('storage'));
      }
    };

    // Clear Herat table info
    clearHeratInfoBtn.onclick = function() {
      heratInfoInput.value = '';
      localStorage.removeItem('heratTableInfo');
      showMessage(clearHeratInfoBtn, 'اطلاعات جدول هرات پاک شد');
    };
  });
}

