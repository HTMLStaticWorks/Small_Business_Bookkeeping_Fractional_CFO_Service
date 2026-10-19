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
  initPasswordToggles();
  initRunwayCalculator();
  initPricingToggle();
  initScopeEstimator();
  initResourcesFilter();
  initConsultationModal();
  initHealthAuditModal();
  initCloseTrackerInteraction();
  initResourceCalculators();
  initHowItWorksVisuals();
});

/**
 * 01. Sticky Header & Scroll Effects
 */
function initNavbarScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
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
 * 02b. Password Visibility Toggle
 */
function initPasswordToggles() {
  document.querySelectorAll('.password-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.closest('.password-field-wrapper')?.querySelector('input');
      if (!input) return;
      const isPass = input.type === 'password';
      input.type = isPass ? 'text' : 'password';
      btn.innerHTML = isPass 
        ? '<i data-lucide="eye-off" style="width: 17px; height: 17px;"></i>' 
        : '<i data-lucide="eye" style="width: 17px; height: 17px;"></i>';
      if (typeof lucide !== 'undefined') lucide.createIcons();
    });
  });
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
    });
  });

  // Attach event listeners to all RTL toggle buttons
  document.querySelectorAll('.rtl-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const activeDir = document.documentElement.getAttribute('dir') === 'rtl' ? 'ltr' : 'rtl';
      applyRTL(activeDir);
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

  // Dispatch theme change event for charts
  window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
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

/**
 * 12. Interactive Resource Hub Financial Modeling Suite
 */
function initResourceCalculators() {
  // Gross Margin Calculator
  const gmRev = document.getElementById('calcGmRevenue');
  const gmCogs = document.getElementById('calcGmCogs');
  const gmResult = document.getElementById('calcGmResult');
  const gmProfit = document.getElementById('calcGmProfit');

  function updateGm() {
    if (!gmRev || !gmCogs || !gmResult) return;
    const rev = Math.max(1, parseFloat(gmRev.value) || 0);
    const cogs = parseFloat(gmCogs.value) || 0;
    const profit = rev - cogs;
    const margin = (profit / rev) * 100;
    gmResult.textContent = `${margin.toFixed(1)}%`;
    if (gmProfit) gmProfit.textContent = `$${Math.round(profit).toLocaleString()}/mo`;
  }

  if (gmRev && gmCogs) {
    gmRev.addEventListener('input', updateGm);
    gmCogs.addEventListener('input', updateGm);
  }

  // Break-Even Calculator
  const beOverhead = document.getElementById('calcBeOverhead');
  const beMargin = document.getElementById('calcBeMarginPct');
  const beResult = document.getElementById('calcBeResult');
  const beAnnual = document.getElementById('calcBeAnnual');

  function updateBe() {
    if (!beOverhead || !beMargin || !beResult) return;
    const overhead = parseFloat(beOverhead.value) || 0;
    const marginPct = Math.max(1, parseFloat(beMargin.value) || 1) / 100;
    const breakEven = overhead / marginPct;
    beResult.textContent = `$${Math.round(breakEven).toLocaleString()}/mo`;
    if (beAnnual) beAnnual.textContent = `$${Math.round(breakEven * 12).toLocaleString()}/yr`;
  }

  if (beOverhead && beMargin) {
    beOverhead.addEventListener('input', updateBe);
    beMargin.addEventListener('input', updateBe);
  }

  // Burn Multiple Grader
  const bmBurn = document.getElementById('calcBmBurn');
  const bmArr = document.getElementById('calcBmArr');
  const bmResult = document.getElementById('calcBmResult');

  function updateBm() {
    if (!bmBurn || !bmArr || !bmResult) return;
    const burn = parseFloat(bmBurn.value) || 0;
    const arr = Math.max(1, parseFloat(bmArr.value) || 1);
    const multiple = burn / arr;
    let tier = 'Elite';
    if (multiple > 2.0) tier = 'High Burn';
    else if (multiple > 1.5) tier = 'Concerning';
    else if (multiple > 1.0) tier = 'Good';

    bmResult.textContent = `${multiple.toFixed(2)}x (${tier})`;
  }

  if (bmBurn && bmArr) {
    bmBurn.addEventListener('input', updateBm);
    bmArr.addEventListener('input', updateBm);
  }
}

/**
 * 12. How It Works Interactive Visuals (Runway Calculator & Multi-Metric Chart/Graph)
 */
function initHowItWorksVisuals() {
  // A. Interactive Cash Runway Calculator
  const cashSlider = document.getElementById('hiwCashSlider');
  const burnSlider = document.getElementById('hiwBurnSlider');
  const cashLabel = document.getElementById('hiwCashLabel');
  const burnLabel = document.getElementById('hiwBurnLabel');
  const runwayResult = document.getElementById('hiwRunwayResult');
  const healthBadge = document.getElementById('hiwHealthBadge');

  if (cashSlider && burnSlider) {
    function updateHiwCalculator() {
      const cash = parseFloat(cashSlider.value) || 0;
      const burn = parseFloat(burnSlider.value) || 1;
      const months = (cash / burn).toFixed(1);

      if (cashLabel) cashLabel.textContent = `$${cash.toLocaleString()}`;
      if (burnLabel) burnLabel.textContent = `$${burn.toLocaleString()}`;
      if (runwayResult) runwayResult.textContent = months;

      if (healthBadge) {
        if (months >= 18) {
          healthBadge.textContent = 'EXCELLENT RUNWAY';
          healthBadge.className = 'badge bg-success-subtle text-success font-mono mb-1';
        } else if (months >= 10) {
          healthBadge.textContent = 'HEALTHY RUNWAY';
          healthBadge.className = 'badge bg-success-subtle text-success font-mono mb-1';
        } else if (months >= 6) {
          healthBadge.textContent = 'MODERATE RUNWAY';
          healthBadge.className = 'badge bg-warning-subtle text-warning font-mono mb-1';
        } else {
          healthBadge.textContent = 'CRITICAL (CFO REVIEW)';
          healthBadge.className = 'badge bg-danger-subtle text-danger font-mono mb-1';
        }
      }
    }

    cashSlider.addEventListener('input', updateHiwCalculator);
    burnSlider.addEventListener('input', updateHiwCalculator);
    updateHiwCalculator();
  }

  // B. Dynamic Performance Chart & Graphs (Revenue, Expenses & Gross Margin)
  const chartCanvas = document.getElementById('howItWorksChart');
  if (chartCanvas && typeof Chart !== 'undefined') {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const tickColor = isDark ? '#94A3B8' : '#64748B';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)';

    const ctx = chartCanvas.getContext('2d');
    const hiwChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct (Proj)'],
        datasets: [
          {
            label: 'Income / Revenue',
            data: [135000, 148000, 162000, 178000, 194000, 210000, 235000],
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.08)',
            fill: true,
            borderWidth: 2.5,
            tension: 0.35,
            pointRadius: 3,
            pointBackgroundColor: '#10B981',
            yAxisID: 'y'
          },
          {
            label: 'Expenses & Payments',
            data: [92000, 96000, 104000, 108000, 114000, 119000, 124000],
            borderColor: '#E07A5F',
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderDash: [4, 4],
            tension: 0.35,
            pointRadius: 3,
            pointBackgroundColor: '#E07A5F',
            yAxisID: 'y'
          },
          {
            label: 'Gross Margin %',
            data: [68, 70, 71, 73, 75, 76, 78],
            borderColor: '#F59E0B',
            backgroundColor: 'transparent',
            borderWidth: 2,
            tension: 0.35,
            pointRadius: 3,
            pointBackgroundColor: '#F59E0B',
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#13161B',
            titleColor: '#FFFFFF',
            bodyColor: '#E2E8F0',
            borderColor: '#222730',
            borderWidth: 1,
            padding: 8,
            callbacks: {
              label: function(context) {
                if (context.dataset.yAxisID === 'y1') {
                  return ` Margin: ${context.parsed.y}%`;
                }
                return ` ${context.dataset.label}: $${context.parsed.y.toLocaleString()}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: tickColor, font: { size: 10 } }
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            grid: { color: gridColor },
            ticks: {
              color: tickColor,
              font: { size: 9 },
              callback: (v) => `$${v / 1000}k`
            }
          },
          y1: {
            type: 'linear',
            display: false,
            position: 'right',
            min: 50,
            max: 100
          }
        }
      }
    });

    // Theme change listener for chart axis colors
    window.addEventListener('themeChanged', () => {
      const darkNow = document.documentElement.getAttribute('data-theme') === 'dark';
      const c = darkNow ? '#94A3B8' : '#64748B';
      const g = darkNow ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)';
      hiwChart.options.scales.x.ticks.color = c;
      hiwChart.options.scales.y.ticks.color = c;
      hiwChart.options.scales.y.grid.color = g;
      hiwChart.update();
    });
  }
}



