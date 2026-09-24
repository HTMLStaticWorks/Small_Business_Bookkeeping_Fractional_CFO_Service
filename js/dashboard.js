/**
 * VALENCE FINANCIAL | CLIENT CFO DASHBOARD & CONTROL ROOM LOGIC
 */

document.addEventListener('DOMContentLoaded', () => {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  initDashboardNavigation();
  initSidebarToggle();
  initPeriodSelector();
  initDataTableBudget();
  initCfoMessenger();
  initWhatChangedSelector();
  initInvoiceDownloader();

  // Initialize Charts once DOM is ready
  if (typeof window.initDashboardCharts === 'function') {
    window.initDashboardCharts();
  }
});

/**
 * 01. Sidebar Tab View Switching
 */
function initDashboardNavigation() {
  const navLinks = document.querySelectorAll('.dash-nav-link[data-target]');
  const tabPanes = document.querySelectorAll('.dash-tab-pane');
  const viewTitle = document.getElementById('dashViewTitle');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('data-target');
      const targetTitle = link.getAttribute('data-title') || 'Overview';

      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      tabPanes.forEach(pane => {
        pane.classList.remove('active');
        if (pane.id === targetId) {
          pane.classList.add('active');
        }
      });

      if (viewTitle) {
        viewTitle.textContent = targetTitle;
      }

      // Close mobile sidebar if open
      const sidebar = document.getElementById('dashSidebar');
      if (sidebar && window.innerWidth <= 1024) {
        sidebar.classList.remove('active');
      }

      if (typeof lucide !== 'undefined') lucide.createIcons();
    });
  });
}

/**
 * 02. Responsive Sidebar Toggle for Dashboard
 */
function initSidebarToggle() {
  const toggleBtn = document.getElementById('sidebarToggleBtn');
  const sidebar = document.getElementById('dashSidebar');

  if (!toggleBtn || !sidebar) return;

  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('active');
  });

  // Close when clicking outside on mobile
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 1024) {
      if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target) && sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
      }
    }
  });
}

/**
 * 03. Dynamic Period Selector (MTD, Q3 2026, YTD)
 */
function initPeriodSelector() {
  const periodBtns = document.querySelectorAll('.period-option');
  const currentPeriodLabel = document.getElementById('currentPeriodLabel');

  const periodData = {
    'MTD': {
      rev: '$268,400',
      revVar: '+8.4% vs target',
      cash: '+$24,620',
      cashVar: '+14.2% MoM',
      invoices: '$18,200',
      runway: '8.4 Months'
    },
    'Q3 2026': {
      rev: '$784,200',
      revVar: '+11.2% vs target',
      cash: '+$84,620',
      cashVar: '+18.5% QoQ',
      invoices: '$28,400',
      runway: '8.4 Months'
    },
    'YTD 2026': {
      rev: '$1,248,400',
      revVar: '+16.8% vs plan',
      cash: '+$192,400',
      cashVar: '+22.4% YoY',
      invoices: '$28,400',
      runway: '8.4 Months'
    }
  };

  periodBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const periodKey = btn.getAttribute('data-period');
      if (currentPeriodLabel) currentPeriodLabel.textContent = periodKey;

      const data = periodData[periodKey] || periodData['Q3 2026'];
      
      const revEl = document.getElementById('kpiRevenue');
      const cashEl = document.getElementById('kpiCashFlow');
      const invEl = document.getElementById('kpiInvoices');
      const runwayEl = document.getElementById('kpiRunway');

      if (revEl) revEl.textContent = data.rev;
      if (cashEl) cashEl.textContent = data.cash;
      if (invEl) invEl.textContent = data.invoices;
      if (runwayEl) runwayEl.textContent = data.runway;

      showToast(`Dashboard updated for period: ${periodKey}`);
    });
  });
}

/**
 * 04. Initialize Budget vs Actual Interactive DataTable
 */
function initDataTableBudget() {
  if (typeof $ !== 'undefined' && $.fn.DataTable && $('#budgetActualDataTable').length) {
    $('#budgetActualDataTable').DataTable({
      pageLength: 8,
      ordering: true,
      searching: true,
      info: false,
      lengthChange: false,
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Search account or category..."
      }
    });
  }
}

/**
 * 05. Interactive "What Changed This Month?" AI Flash Switcher
 */
function initWhatChangedSelector() {
  const monthSelector = document.getElementById('whatChangedMonthSelect');
  const summaryContainer = document.getElementById('whatChangedBullets');

  if (!monthSelector || !summaryContainer) return;

  const scenarios = {
    'sep26': `
      <div class="insight-bullet">
        <div class="insight-icon emerald"><i data-lucide="trending-up"></i></div>
        <div>
          <div style="font-weight: 700; color: #fff;">Revenue increased 8.4% MoM</div>
          <div style="font-size: 0.85rem; color: var(--dash-slate);">Expansion in Tier-2 enterprise contracts delivered +$22,400 net new ARR.</div>
        </div>
      </div>
      <div class="insight-bullet">
        <div class="insight-icon copper"><i data-lucide="arrow-up-right"></i></div>
        <div>
          <div style="font-weight: 700; color: #fff;">Marketing expenses increased 5.2%</div>
          <div style="font-size: 0.85rem; color: var(--dash-slate);">Targeted CAC experiments ran $3,100 above baseline with payback period of 3.8 months.</div>
        </div>
      </div>
      <div class="insight-bullet">
        <div class="insight-icon gold"><i data-lucide="shield-check"></i></div>
        <div>
          <div style="font-weight: 700; color: #fff;">Operating margin improved by 2.1%</div>
          <div style="font-size: 0.85rem; color: var(--dash-slate);">Cloud infrastructure renegotiation yielded $4,200/mo ongoing margin expansion.</div>
        </div>
      </div>
    `,
    'aug26': `
      <div class="insight-bullet">
        <div class="insight-icon emerald"><i data-lucide="trending-up"></i></div>
        <div>
          <div style="font-weight: 700; color: #fff;">Gross margin reached all-time high of 65.4%</div>
          <div style="font-size: 0.85rem; color: var(--dash-slate);">Direct delivery costs trimmed by 4.8% due to automated onboarding pipelines.</div>
        </div>
      </div>
      <div class="insight-bullet">
        <div class="insight-icon gold"><i data-lucide="clock"></i></div>
        <div>
          <div style="font-weight: 700; color: #fff;">Cash runway expanded from 7.2 to 8.4 Months</div>
          <div style="font-size: 0.85rem; color: var(--dash-slate);">Working capital cycle accelerated; DSO reduced from 42 days to 28 days.</div>
        </div>
      </div>
    `
  };

  monthSelector.addEventListener('change', () => {
    const val = monthSelector.value;
    summaryContainer.innerHTML = scenarios[val] || scenarios['sep26'];
    if (typeof lucide !== 'undefined') lucide.createIcons();
  });
}

/**
 * 06. Interactive CFO Chat Inbox
 */
function initCfoMessenger() {
  const sendBtn = document.getElementById('btnSendChatMessage');
  const chatInput = document.getElementById('chatMessageInput');
  const chatMessagesArea = document.getElementById('chatMessagesArea');

  if (!sendBtn || !chatInput || !chatMessagesArea) return;

  function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    // Append outgoing bubble
    const userBubble = document.createElement('div');
    userBubble.className = 'chat-bubble outgoing';
    userBubble.innerHTML = `
      <div>${text}</div>
      <div style="font-size: 0.68rem; opacity: 0.8; margin-top: 4px; text-align: right;">Just now</div>
    `;
    chatMessagesArea.appendChild(userBubble);
    chatInput.value = '';
    chatMessagesArea.scrollTop = chatMessagesArea.scrollHeight;

    // Simulated CFO response after 1.2s
    setTimeout(() => {
      const cfoBubble = document.createElement('div');
      cfoBubble.className = 'chat-bubble incoming';
      cfoBubble.innerHTML = `
        <div style="font-size: 0.72rem; color: var(--dash-gold); font-weight: 700; margin-bottom: 4px;">Eleanor Vance (Partner CFO)</div>
        <div>I've received this. I am running a quick sensitivity model against our Q4 cash buffer and will update your board presentation deck accordingly before 3:00 PM today.</div>
        <div style="font-size: 0.68rem; color: var(--dash-slate); margin-top: 4px;">Just now</div>
      `;
      chatMessagesArea.appendChild(cfoBubble);
      chatMessagesArea.scrollTop = chatMessagesArea.scrollHeight;
    }, 1200);
  }

  sendBtn.addEventListener('click', sendMessage);
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  });
}

/**
 * 07. Invoice Download & Print Simulation
 */
function initInvoiceDownloader() {
  window.downloadInvoiceModal = function(invoiceNum, date, amount) {
    const modalEl = document.getElementById('invoicePreviewModal');
    if (!modalEl) return;

    document.getElementById('invModalNumber').textContent = invoiceNum;
    document.getElementById('invModalDate').textContent = date;
    document.getElementById('invModalAmount').textContent = amount;

    if (typeof bootstrap !== 'undefined') {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  };
}
