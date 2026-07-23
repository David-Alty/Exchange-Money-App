/* =============================================
   PARWAN EXCHANGE — CONVERTER WIDGET v1.0
   فارسی · RTL · نرخ محلی + جهانی
   ============================================= */

(function () {
  'use strict';

  /* ─── DATA ─────────────────────────────── */
  const CURRENCIES = [
    { code: 'USD', flag: '🇺🇸', name: 'دالر امریکایی' },
    { code: 'AFN', flag: '🇦🇫', name: 'افغانی' },
    { code: 'EUR', flag: '🇪🇺', name: 'یورو' },
    { code: 'GBP', flag: '🇬🇧', name: 'پوند انگلیس' },
    { code: 'IRR', flag: '🇮🇷', name: 'ریال ایران' },
    { code: 'SAR', flag: '🇸🇦', name: 'ریال سعودی' },
    { code: 'AED', flag: '🇦🇪', name: 'درهم امارات' },
    { code: 'PKR', flag: '🇵🇰', name: 'روپیه پاکستان' },
    { code: 'TRY', flag: '🇹🇷', name: 'لیره ترکیه' },
    { code: 'CNY', flag: '🇨🇳', name: 'یوان چین' },
    { code: 'INR', flag: '🇮🇳', name: 'روپیه هند' },
    { code: 'CAD', flag: '🇨🇦', name: 'دالر کانادا' },
    { code: 'AUD', flag: '🇦🇺', name: 'دالر استرالیا' },
    { code: 'CHF', flag: '🇨🇭', name: 'فرانک سویس' },
    { code: 'JPY', flag: '🇯🇵', name: 'ین جاپان' },
    { code: 'KWD', flag: '🇰🇼', name: 'دینار کویت' },
    { code: 'QAR', flag: '🇶🇦', name: 'ریال قطر' },
  ];

  const POPULAR_PAIRS = [
    { from: 'USD', to: 'AFN' },
    { from: 'EUR', to: 'AFN' },
    { from: 'USD', to: 'IRR' },
    { from: 'AED', to: 'AFN' },
    { from: 'USD', to: 'SAR' },
    { from: 'GBP', to: 'AFN' },
    { from: 'PKR', to: 'AFN' },
    { from: 'USD', to: 'TRY' },
  ];

  const getCurrency = (code) => CURRENCIES.find(c => c.code === code) || { code, flag: '💱', name: code };

  /* ─── STATE ─────────────────────────────── */
  let mode = 'local';          // 'local' | 'global'
  let market = 'kabul';        // 'kabul' | 'herat'
  let localRates = {};         // { USD: { buy: 71, sell: 71.5 } }
  let globalRates = null;      // { USD: 1, AFN: 71.5, ... }
  let fromCode = 'USD';
  let toCode = 'AFN';
  let amount = 100;
  let localLoaded = false;
  let globalLoaded = false;
  let localUpdateTime = null;

  /* ─── BUILD HTML ─────────────────────────── */
  function buildWidget() {
    // Trigger button in header
    const trigger = document.createElement('button');
    trigger.className = 'conv-trigger';
    trigger.id = 'convTrigger';
    trigger.setAttribute('aria-label', 'تبدیل اسعار');
    trigger.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/>
      </svg>
      تبدیل اسعار`;

    const nav = document.querySelector('.main-nav');
    const header = document.querySelector('.header-inner');
    if (nav) nav.insertBefore(trigger, nav.firstChild);
    else if (header) header.appendChild(trigger);

    // Backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'conv-backdrop';
    backdrop.id = 'convBackdrop';
    document.body.appendChild(backdrop);

    // Panel
    const panel = document.createElement('div');
    panel.className = 'conv-panel';
    panel.id = 'convPanel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'تبدیل اسعار');
    panel.innerHTML = buildPanelHTML();
    document.body.appendChild(panel);
  }

  function buildPanelHTML() {
    const fromC = getCurrency(fromCode);
    const toC   = getCurrency(toCode);
    const selectOptions = CURRENCIES.map(c =>
      `<option value="${c.code}" ${c.code === fromCode ? 'selected' : ''}>${c.flag} ${c.name} (${c.code})</option>`
    ).join('');
    const selectOptionsTo = CURRENCIES.map(c =>
      `<option value="${c.code}" ${c.code === toCode ? 'selected' : ''}>${c.flag} ${c.name} (${c.code})</option>`
    ).join('');

    const pairsHTML = POPULAR_PAIRS.map(p => {
      const f = getCurrency(p.from);
      const t = getCurrency(p.to);
      return `<div class="conv-pair-card" data-from="${p.from}" data-to="${p.to}">
        <div class="conv-pair-name">${f.code}/${t.code}</div>
        <div class="conv-pair-rate" id="pair-${p.from}-${p.to}">...</div>
      </div>`;
    }).join('');

    return `
      <div class="conv-head">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/></svg>
        <span class="conv-head-title">تبدیل اسعار</span>
        <button class="conv-head-close" id="convClose" aria-label="بستن">×</button>
      </div>

      <div class="conv-tabs">
        <button class="conv-tab active" data-mode="local">🏪 نرخ محلی</button>
        <button class="conv-tab" data-mode="global">🌐 نرخ جهانی</button>
      </div>

      <div class="conv-body">

        <!-- Market selector (local only) -->
        <div class="conv-market-row" id="convMarketRow">
          <button class="conv-market-btn active" data-market="kabul">🏙️ کابل</button>
          <button class="conv-market-btn" data-market="herat">🕌 هرات</button>
        </div>

        <!-- FROM -->
        <div class="conv-box">
          <div class="conv-box-label">از</div>
          <div class="conv-box-row">
            <div class="conv-currency-select">
              <span class="conv-currency-flag" id="fromFlag">${fromC.flag}</span>
              <div class="conv-currency-info">
                <div class="conv-currency-code" id="fromCode">${fromC.code}</div>
                <div class="conv-currency-name" id="fromName">${fromC.name}</div>
              </div>
              <span class="conv-currency-arrow">▼</span>
              <select id="convFromSelect" aria-label="ارز مبدا">${selectOptions}</select>
            </div>
            <input class="conv-amount-input" id="convAmount" type="number" value="${amount}" min="0" step="any" aria-label="مقدار">
          </div>
        </div>

        <!-- SWAP -->
        <div class="conv-swap-row">
          <button class="conv-swap-btn" id="convSwap" aria-label="جابجا کردن ارزها">⇄</button>
        </div>

        <!-- TO -->
        <div class="conv-box">
          <div class="conv-box-label">به</div>
          <div class="conv-box-row">
            <div class="conv-currency-select">
              <span class="conv-currency-flag" id="toFlag">${toC.flag}</span>
              <div class="conv-currency-info">
                <div class="conv-currency-code" id="toCode">${toC.code}</div>
                <div class="conv-currency-name" id="toName">${toC.name}</div>
              </div>
              <span class="conv-currency-arrow">▼</span>
              <select id="convToSelect" aria-label="ارز مقصد">${selectOptionsTo}</select>
            </div>
            <div class="conv-amount-result" id="convResult">—</div>
          </div>
        </div>

        <!-- Rate badge -->
        <div class="conv-rate-badge" id="convRateBadge">
          <div class="conv-rate-loading"><span class="conv-spinner"></span> در حال بارگذاری نرخ‌ها...</div>
        </div>

        <!-- Quick amounts -->
        <div class="conv-quick">
          <span>سریع:</span>
          <button class="conv-quick-btn" data-q="50">۵۰</button>
          <button class="conv-quick-btn" data-q="100">۱۰۰</button>
          <button class="conv-quick-btn" data-q="500">۵۰۰</button>
          <button class="conv-quick-btn" data-q="1000">۱٬۰۰۰</button>
          <button class="conv-quick-btn" data-q="10000">۱۰٬۰۰۰</button>
        </div>

        <!-- Update time -->
        <div class="conv-update" id="convUpdateTime"></div>

      </div>

      <!-- Popular pairs -->
      <div class="conv-footer">
        <div class="conv-pairs-title">⭐ جفت‌های پرکاربرد</div>
        <div class="conv-pairs-grid" id="convPairsGrid">${pairsHTML}</div>
      </div>`;
  }

  /* ─── EVENT LISTENERS ───────────────────── */
  function attachEvents() {
    const $ = id => document.getElementById(id);

    // Open / close
    const triggerBtn = document.getElementById('convTrigger');
    if (triggerBtn) triggerBtn.onclick = openWidget;
    
    const backdropEl = document.getElementById('convBackdrop');
    if (backdropEl) backdropEl.onclick = closeWidget;
    
    if ($('convClose')) $('convClose').onclick = closeWidget;

    // ESC key
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeWidget(); });

    // Mode tabs
    document.querySelectorAll('.conv-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        mode = btn.dataset.mode;
        document.querySelectorAll('.conv-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        $('convMarketRow').style.display = mode === 'local' ? 'flex' : 'none';

        if (mode === 'global' && !globalLoaded) loadGlobalRates();
        calculate();
      });
    });

    // Market buttons
    document.querySelectorAll('.conv-market-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        market = btn.dataset.market;
        document.querySelectorAll('.conv-market-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        localRates = {};
        localLoaded = false;
        loadLocalRates();
      });
    });

    // Currency selects
    if ($('convFromSelect')) {
      $('convFromSelect').onchange = function () {
        fromCode = this.value;
        const c = getCurrency(fromCode);
        $('fromFlag').textContent = c.flag;
        $('fromCode').textContent = c.code;
        $('fromName').textContent = c.name;
        calculate();
      };
    }

    if ($('convToSelect')) {
      $('convToSelect').onchange = function () {
        toCode = this.value;
        const c = getCurrency(toCode);
        $('toFlag').textContent = c.flag;
        $('toCode').textContent = c.code;
        $('toName').textContent = c.name;
        calculate();
      };
    }

    // Amount input
    if ($('convAmount')) {
      $('convAmount').oninput = function () {
        amount = parseFloat(this.value) || 0;
        calculate();
      };
    }

    // Swap
    if ($('convSwap')) {
      $('convSwap').onclick = () => {
        [fromCode, toCode] = [toCode, fromCode];
        $('convFromSelect').value = fromCode;
        $('convToSelect').value   = toCode;
        
        let c = getCurrency(fromCode);
        $('fromFlag').textContent = c.flag; $('fromCode').textContent = c.code; $('fromName').textContent = c.name;
        c = getCurrency(toCode);
        $('toFlag').textContent = c.flag; $('toCode').textContent = c.code; $('toName').textContent = c.name;
        calculate();
      };
    }

    // Quick amounts
    document.querySelectorAll('.conv-quick-btn').forEach(btn => {
      btn.onclick = () => {
        amount = parseFloat(btn.dataset.q);
        $('convAmount').value = amount;
        calculate();
      };
    });

    // Popular pair cards
    if ($('convPairsGrid')) {
      $('convPairsGrid').addEventListener('click', e => {
        const card = e.target.closest('.conv-pair-card');
        if (!card) return;
        fromCode = card.dataset.from;
        toCode   = card.dataset.to;
        $('convFromSelect').value = fromCode;
        $('convToSelect').value   = toCode;
        let c = getCurrency(fromCode);
        $('fromFlag').textContent = c.flag; $('fromCode').textContent = c.code; $('fromName').textContent = c.name;
        c = getCurrency(toCode);
        $('toFlag').textContent = c.flag; $('toCode').textContent = c.code; $('toName').textContent = c.name;
        calculate();
      });
    }

    // Side-menu trigger connection
    const openSideLink = document.getElementById('openConverterSide');
    if (openSideLink) {
      openSideLink.addEventListener('click', (e) => {
        e.preventDefault();
        const side = document.getElementById('sideMenu');
        const ov = document.getElementById('menuOverlay');
        if (side && side.classList.contains('open')) side.classList.remove('open');
        if (ov && ov.classList.contains('show')) ov.classList.remove('show');
        
        openWidget();
      });
    }
  }

  /* ─── OPEN / CLOSE ──────────────────────── */
  function openWidget() {
    const backdrop = document.getElementById('convBackdrop');
    const panel = document.getElementById('convPanel');
    if (backdrop) backdrop.classList.add('open');
    if (panel) panel.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (!localLoaded) loadLocalRates();
  }

  function closeWidget() {
    const backdrop = document.getElementById('convBackdrop');
    const panel = document.getElementById('convPanel');
    if (backdrop) backdrop.classList.remove('open');
    if (panel) panel.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ─── LOCAL RATES ───────────────────────── */
  function parseRate(str) {
    if (!str) return null;
    const n = parseFloat(String(str).replace(/,/g, '').trim());
    return isNaN(n) ? null : n;
  }

  function extractCode(label) {
    if (!label) return null;
    const m = String(label).match(/\b([A-Z]{3})\b/);
    return m ? m[1] : null;
  }

  async function loadLocalRates() {
    const endpoint = market === 'kabul'
      ? '/api/rates/sarai-shazada'
      : '/api/rates/khorasan-market';

    setBadgeLoading();
    try {
      const res  = await fetch(endpoint);
      const data = await res.json();
      const rows = Array.isArray(data) ? data : [...(data.firstRow ? [data.firstRow] : []), ...(data.remainingRows || [])];

      localRates = { AFN: { buy: 1, sell: 1 } };
      rows.forEach(r => {
        const code = extractCode(r.currency);
        const buy  = parseRate(r.buy);
        const sell = parseRate(r.sell);
        if (code && buy !== null && sell !== null) {
          localRates[code] = { buy, sell };
        }
      });

      localLoaded = true;
      localUpdateTime = new Date();
      const timeEl = document.getElementById('convUpdateTime');
      if (timeEl) {
        timeEl.textContent = '🕐 بروزرسانی: ' + localUpdateTime.toLocaleTimeString('fa-IR');
      }

      calculate();
      updatePairRates();
    } catch {
      setBadgeError('خطا در بارگذاری نرخ‌های محلی');
    }
  }

  /* ─── GLOBAL RATES ──────────────────────── */
  async function loadGlobalRates() {
    setBadgeLoading();
    try {
      const res  = await fetch('https://open.er-api.com/v6/latest/USD');
      const data = await res.json();
      if (data.result !== 'success') throw new Error();
      globalRates = data.rates;
      globalLoaded = true;
      const timeEl = document.getElementById('convUpdateTime');
      if (timeEl) {
        timeEl.textContent = '🕐 منبع: ExchangeRate-API';
      }
      calculate();
      updatePairRates();
    } catch {
      setBadgeError('خطا در دریافت نرخ جهانی');
    }
  }

  /* ─── CALCULATE ─────────────────────────── */
  function fmtNum(n) {
    if (n === null || n === undefined || isNaN(n)) return '—';
    if (Math.abs(n) >= 1000000) return (n / 1000000).toFixed(2) + 'M';
    return new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 4 }).format(n);
  }

  function calculate() {
    const result = document.getElementById('convResult');
    const badge  = document.getElementById('convRateBadge');
    if (!result || !badge) return;

    if (!amount || amount <= 0) { 
      result.textContent = '—'; 
      badge.innerHTML = '<span style="color:#94a3b8;font-size:.8rem">مقدار را وارد کنید</span>'; 
      return; 
    }
    if (fromCode === toCode) { 
      result.textContent = fmtNum(amount); 
      badge.innerHTML = `<span>ارز یکسان</span>`; 
      return; 
    }

    if (mode === 'local') {
      if (!localLoaded) { setBadgeLoading(); return; }
      calcLocal(result, badge);
    } else {
      if (!globalLoaded) { setBadgeLoading(); return; }
      calcGlobal(result, badge);
    }
  }

  function calcLocal(result, badge) {
    let converted, rateText;

    if (fromCode === 'AFN') {
      const r = localRates[toCode];
      if (!r) { result.textContent = '—'; setBadgeError(`نرخ ${toCode} یافت نشد`); return; }
      converted = amount / r.buy;
      rateText = `۱ ${toCode} = ${fmtNum(r.buy)} AFN (نرخ خرید)`;
    } else if (toCode === 'AFN') {
      const r = localRates[fromCode];
      if (!r) { result.textContent = '—'; setBadgeError(`نرخ ${fromCode} یافت نشد`); return; }
      converted = amount * r.sell;
      rateText = `۱ ${fromCode} = ${fmtNum(r.sell)} AFN (نرخ فروش)`;
    } else {
      const rf = localRates[fromCode];
      const rt = localRates[toCode];
      if (!rf || !rt) { result.textContent = '—'; setBadgeError('نرخ یافت نشد'); return; }
      converted = (amount * rf.sell) / rt.buy;
      rateText = `از طریق AFN · بازار ${market === 'kabul' ? 'کابل' : 'هرات'}`;
    }

    result.textContent = fmtNum(converted) + ' ' + toCode;
    badge.className = 'conv-rate-badge';
    badge.innerHTML = `<span>${rateText}</span><span style="font-size:.7rem;opacity:.7">${market === 'kabul' ? '🏙️ کابل' : '🕌 هرات'}</span>`;
  }

  function calcGlobal(result, badge) {
    const rf = globalRates[fromCode];
    const rt = globalRates[toCode];
    if (!rf || !rt) { setBadgeError('نرخ یافت نشد'); return; }
    const converted = (amount / rf) * rt;
    const rate = rt / rf;
    result.textContent = fmtNum(converted) + ' ' + toCode;
    badge.className = 'conv-rate-badge';
    badge.innerHTML = `<span>۱ ${fromCode} = ${fmtNum(rate)} ${toCode}</span><span style="font-size:.7rem;opacity:.7">🌐 جهانی</span>`;
  }

  function updatePairRates() {
    POPULAR_PAIRS.forEach(p => {
      const el = document.getElementById(`pair-${p.from}-${p.to}`);
      if (!el) return;
      let rate = null;
      if (mode === 'local' && localLoaded) {
        if (p.to === 'AFN' && localRates[p.from]) rate = localRates[p.from].sell;
        else if (p.from === 'AFN' && localRates[p.to]) rate = localRates[p.to].buy;
      } else if (mode === 'global' && globalLoaded && globalRates[p.from] && globalRates[p.to]) {
        rate = globalRates[p.to] / globalRates[p.from];
      }
      el.textContent = rate !== null ? fmtNum(rate) : '—';
    });
  }

  /* ─── BADGE HELPERS ─────────────────────── */
  function setBadgeLoading() {
    const badge = document.getElementById('convRateBadge');
    if (!badge) return;
    badge.className = 'conv-rate-badge';
    badge.innerHTML = '<div class="conv-rate-loading"><span class="conv-spinner"></span> در حال بارگذاری...</div>';
  }

  function setBadgeError(msg) {
    const badge = document.getElementById('convRateBadge');
    if (!badge) return;
    badge.className = 'conv-rate-badge error';
    badge.innerHTML = `<span>⚠️ ${msg}</span>`;
  }

  /* ─── INIT ───────────────────────────────── */
  function init() {
    buildWidget();
    attachEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
