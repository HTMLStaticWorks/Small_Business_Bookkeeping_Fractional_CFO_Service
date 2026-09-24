/**
 * VALENCE FINANCIAL | PUBLIC APPLICATION CORE JAVASCRIPT
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Theme & RTL first
  initThemeAndRTL();

  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Initialize Core Features
  initNavbarScroll();
  initMobileDrawer();
  initRunwayCalculator();
  initPricingToggle();
  initScopeEstimator();
  initResourcesFilter();
  initConsultationModal();
  initHealthAuditModal();
  initCloseTrackerInteraction();
});

/**
 * 01. Sticky Header & Scroll Effects
 */
function initNavbarScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/**
 * 02. Responsive Mobile Drawer (At <= 1024px: Logo + Hamburger Only)
 */
function initMobileDrawer() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');

  if (!hamburgerBtn || !mobileDrawer || !drawerOverlay) return;

  function openDrawer() {
    mobileDrawer.classList.add('active');
    drawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('active');
    drawerOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburgerBtn.addEventListener('click', openDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
  drawerOverlay.addEventListener('click', closeDrawer);
}

/**
 * 03. Interactive Cash Runway Calculator (Found on Resources & Home)
 */
function initRunwayCalculator() {
  const cashInput = document.getElementById('calcCashBalance');
  const burnInput = document.getElementById('calcMonthlyBurn');
  const revInput = document.getElementById('calcMonthlyRev');
  const runwayDisplay = document.getElementById('calcRunwayResult');
  const healthBadge = document.getElementById('calcHealthStatus');
  const cashValLabel = document.getElementById('calcCashValLabel');
  const burnValLabel = document.getElementById('calcBurnValLabel');

  if (!cashInput || !burnInput) return;

  function calculate() {
    const cash = parseFloat(cashInput.value) || 0;
    const burn = parseFloat(burnInput.value) || 1;
    const rev = revInput ? (parseFloat(revInput.value) || 0) : 0;

    const netBurn = Math.max(1000, burn - rev);
    const months = (cash / netBurn).toFixed(1);

    if (cashValLabel) cashValLabel.textContent = `$${cash.toLocaleString()}`;
    if (burnValLabel) burnValLabel.textContent = `$${burn.toLocaleString()}`;

    if (runwayDisplay) {
      runwayDisplay.textContent = `${months} Months`;
    }

    if (healthBadge) {
      if (months >= 18) {
        healthBadge.textContent = 'Excellent Runway (Capital Efficient)';
        healthBadge.className = 'badge-executive badge-emerald';
      } else if (months >= 9) {
        healthBadge.textContent = 'Healthy Runway (Standard Cushion)';
        healthBadge.className = 'badge-executive badge-gold';
      } else if (months >= 4) {
        healthBadge.textContent = 'Moderate Runway (Action Recommended)';
        healthBadge.className = 'badge-executive badge-copper';
      } else {
        healthBadge.textContent = 'Critical Runway (Immediate CFO Review)';
        healthBadge.className = 'badge-executive text-crimson bg-crimson-bg';
      }
    }
  }

  cashInput.addEventListener('input', calculate);
  burnInput.addEventListener('input', calculate);
  if (revInput) revInput.addEventListener('input', calculate);
  calculate();
}

/**
 * 04. Pricing Plans Billing Toggle (Monthly vs Quarterly)
 */
function initPricingToggle() {
  const billingToggle = document.getElementById('billingPeriodToggle');
  const priceValues = document.querySelectorAll('.dynamic-price-value');
  const periodLabels = document.querySelectorAll('.dynamic-price-period');

  if (!billingToggle || !priceValues.length) return;

  billingToggle.addEventListener('change', () => {
    const isQuarterly = billingToggle.checked;
    priceValues.forEach(el => {
      const monthlyPrice = parseInt(el.getAttribute('data-monthly'), 10);
      if (isQuarterly) {
        const discounted = Math.round(monthlyPrice * 0.88); // 12% quarterly savings
        el.textContent = `$${discounted.toLocaleString()}`;
      } else {
        el.textContent = `$${monthlyPrice.toLocaleString()}`;
      }
    });

    periodLabels.forEach(el => {
      el.textContent = isQuarterly ? '/mo (billed quarterly)' : '/month';
    });
  });
}

/**
 * 05. Interactive Service Scope Estimator (Pricing Page)
 */
function initScopeEstimator() {
  const revRange = document.getElementById('scopeRevenueRange');
  const txRange = document.getElementById('scopeTxRange');
  const scopeCfoAddon = document.getElementById('scopeCfoAddon');
  const estimatedPlanName = document.getElementById('scopePlanRecommendation');
  const estimatedPrice = document.getElementById('scopeEstimatedTotal');

  if (!revRange || !txRange || !estimatedPrice) return;

  function updateEstimate() {
    const annualRev = parseInt(revRange.value, 10); // in thousands
    const txVolume = parseInt(txRange.value, 10);
    const hasCfo = scopeCfoAddon ? scopeCfoAddon.checked : false;

    let base = 1250;
    let plan = 'Early Stage Bookkeeping';

    if (annualRev > 3000 || txVolume > 350 || hasCfo) {
      plan = 'Scale Fractional CFO & Advisory';
      base = 4850;
      if (annualRev > 6000) base = 6900;
    } else if (annualRev > 1000 || txVolume > 150) {
      plan = 'Growth Bookkeeping + Controller';
      base = 2450;
    }

    if (hasCfo && plan !== 'Scale Fractional CFO & Advisory') {
      base += 2000;
      plan += ' + Fractional CFO';
    }

    if (estimatedPlanName) estimatedPlanName.textContent = plan;
    estimatedPrice.textContent = `$${base.toLocaleString()}/mo`;

    const revLabel = document.getElementById('scopeRevVal');
    const txLabel = document.getElementById('scopeTxVal');
    if (revLabel) revLabel.textContent = `$${(annualRev / 1000).toFixed(1)}M`;
    if (txLabel) txLabel.textContent = `${txVolume} tx/mo`;
  }

  revRange.addEventListener('input', updateEstimate);
  txRange.addEventListener('input', updateEstimate);
  if (scopeCfoAddon) scopeCfoAddon.addEventListener('change', updateEstimate);
  updateEstimate();
}

/**
 * 06. Filterable Resources & Insight Search
 */
function initResourcesFilter() {
  const filterBtns = document.querySelectorAll('.resource-filter-btn');
  const resourceCards = document.querySelectorAll('.resource-item-card');
  const searchInput = document.getElementById('resourceSearchInput');

  if (!filterBtns.length && !searchInput) return;

  function filterCards() {
    const activeCategory = document.querySelector('.resource-filter-btn.active')?.dataset.category || 'all';
    const query = (searchInput ? searchInput.value : '').toLowerCase().trim();

    resourceCards.forEach(card => {
      const cardCategory = card.dataset.category || '';
      const cardTitle = (card.querySelector('.resource-card-title')?.textContent || '').toLowerCase();
      const cardDesc = (card.querySelector('.resource-card-desc')?.textContent || '').toLowerCase();

      const matchesCat = (activeCategory === 'all' || cardCategory === activeCategory);
      const matchesSearch = (!query || cardTitle.includes(query) || cardDesc.includes(query));

      if (matchesCat && matchesSearch) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active', 'btn-cfo-primary'));
      filterBtns.forEach(b => b.classList.add('btn-cfo-outline'));
      btn.classList.add('active', 'btn-cfo-primary');
      btn.classList.remove('btn-cfo-outline');
      filterCards();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', filterCards);
  }
}

/**
 * 07. Schedule CFO Consultation Modal Handler
 */
function initConsultationModal() {
  const form = document.getElementById('consultationForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const modalEl = document.getElementById('consultationModal');
    if (modalEl && typeof bootstrap !== 'undefined') {
      const modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
    }
    showToast('Consultation Request Received! A Partner CFO will contact you within 2 business hours.');
    form.reset();
  });
}

/**
 * 08. Free Financial Health Audit Modal
 */
function initHealthAuditModal() {
  const form = document.getElementById('healthAuditForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const modalEl = document.getElementById('healthAuditModal');
    if (modalEl && typeof bootstrap !== 'undefined') {
      const modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
    }
    showToast('Your Custom Financial Health Scorecard & P&L Benchmark has been prepared!');
    form.reset();
  });
}

/**
 * 09. Close Tracker Interactive Demonstration
 */
function initCloseTrackerInteraction() {
  const steps = document.querySelectorAll('.close-step');
  if (!steps.length) return;

  steps.forEach((step, idx) => {
    step.style.cursor = 'pointer';
    step.addEventListener('click', () => {
      steps.forEach((s, i) => {
        s.classList.remove('active', 'completed');
        if (i < idx) s.classList.add('completed');
        if (i === idx) s.classList.add('active');
      });
      const labels = [
        'Step 1: Automated bank feeds & receipt matching synced (Day 1-2)',
        'Step 2: Balance sheet & ledger reconciliations completed (Day 3-4)',
        'Step 3: Variance review & gross margin audit finalized (Day 5)',
        'Step 4: GAAP-compliant monthly financial pack delivered (Day 6)',
        'Step 5: 45-min Strategic CFO review & scenario adjustment (Day 7)'
      ];
      const descBox = document.getElementById('closeStepDetailText');
      if (descBox) descBox.textContent = labels[idx];
    });
  });
}

/**
 * Toast Notification Helper
 */
window.showToast = function(message) {
  let toast = document.getElementById('cfoToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'cfoToast';
    toast.className = 'cfo-toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `
    <i data-lucide="check-circle-2" style="color: var(--color-emerald); width: 22px; height: 22px;"></i>
    <div>
      <div style="font-weight: 700; font-size: 0.9rem;">VALENCE Executive Desk</div>
      <div style="font-size: 0.825rem; color: #D1D5DB;">${message}</div>
    </div>
  `;
  if (typeof lucide !== 'undefined') lucide.createIcons();
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
};

/**
 * ==========================================================================
 * THEME & RTL STATE ENGINE
 * ==========================================================================
 */
function initThemeAndRTL() {
  const currentTheme = localStorage.getItem('valence_theme') || 'light';
  const currentDir = localStorage.getItem('valence_dir') || 'ltr';

  applyTheme(currentTheme);
  applyRTL(currentDir);

  // Attach event listeners to all theme toggle buttons
  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(activeTheme);
      showToast(activeTheme === 'dark' ? 'Switched to Deep Black Dark Mode' : 'Switched to Clean Light Mode');
    });
  });

  // Attach event listeners to all RTL toggle buttons
  document.querySelectorAll('.rtl-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const activeDir = document.documentElement.getAttribute('dir') === 'rtl' ? 'ltr' : 'rtl';
      applyRTL(activeDir);
      showToast(activeDir === 'rtl' ? 'RTL Layout Activated (Right-to-Left)' : 'LTR Layout Activated (Left-to-Right)');
    });
  });
}

function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.body.classList.add('theme-dark');
    localStorage.setItem('valence_theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
    document.body.classList.remove('theme-dark');
    localStorage.setItem('valence_theme', 'light');
  }

  // Update icons on toggle buttons
  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    if (theme === 'dark') {
      btn.innerHTML = '<i data-lucide="sun" style="width: 17px; height: 17px;"></i>';
      btn.setAttribute('title', 'Switch to Light Theme');
      btn.classList.add('active');
    } else {
      btn.innerHTML = '<i data-lucide="moon" style="width: 17px; height: 17px;"></i>';
      btn.setAttribute('title', 'Switch to Dark Black Theme');
      btn.classList.remove('active');
    }
  });

  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

function applyRTL(dir) {
  if (dir === 'rtl') {
    document.documentElement.setAttribute('dir', 'rtl');
    document.body.setAttribute('dir', 'rtl');
    localStorage.setItem('valence_dir', 'rtl');
  } else {
    document.documentElement.removeAttribute('dir');
    document.body.removeAttribute('dir');
    localStorage.setItem('valence_dir', 'ltr');
  }

  // Update icons on toggle buttons
  document.querySelectorAll('.rtl-toggle-btn').forEach(btn => {
    btn.innerHTML = '<i data-lucide="arrow-left-right" style="width: 17px; height: 17px;"></i>';
    if (dir === 'rtl') {
      btn.setAttribute('title', 'Switch to LTR Layout');
      btn.classList.add('active');
    } else {
      btn.setAttribute('title', 'Switch to RTL Layout');
      btn.classList.remove('active');
    }
  });

  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

