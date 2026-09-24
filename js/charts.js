/**
 * VALENCE FINANCIAL | CHARTS & DATA VISUALIZATIONS
 * Powered by Chart.js (v4.4+)
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroCashChart();
  initWaterfallChart();
});

// Chart Colors & Palettes
const CHART_THEME = {
  copper: '#B66A45',
  copperLight: 'rgba(182, 106, 69, 0.25)',
  gold: '#C5A15A',
  goldLight: 'rgba(197, 161, 90, 0.25)',
  carbon: '#17191B',
  slate: '#697178',
  slateLight: 'rgba(105, 113, 120, 0.2)',
  emerald: '#10B981',
  emeraldLight: 'rgba(16, 185, 129, 0.2)',
  crimson: '#EF4444',
  crimsonLight: 'rgba(239, 68, 68, 0.2)',
  fontFamily: "'JetBrains Mono', 'Plus Jakarta Sans', monospace"
};

/**
 * 01. Homepage Hero Cash Mini Chart
 */
function initHeroCashChart() {
  const ctx = document.getElementById('heroCashChart');
  if (!ctx) return;

  const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 180);
  gradient.addColorStop(0, 'rgba(197, 161, 90, 0.35)');
  gradient.addColorStop(1, 'rgba(197, 161, 90, 0.0)');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep (Current)'],
      datasets: [{
        label: 'Cash Position',
        data: [215000, 232000, 248500, 260200, 271400, 284620],
        borderColor: CHART_THEME.gold,
        borderWidth: 3,
        backgroundColor: gradient,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#fff',
        pointBorderColor: CHART_THEME.gold,
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1E2226',
          titleColor: '#C5A15A',
          bodyColor: '#fff',
          bodyFont: { family: CHART_THEME.fontFamily },
          callbacks: {
            label: (context) => ` Cash: $${context.raw.toLocaleString()}`
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#88929A', font: { family: CHART_THEME.fontFamily, size: 11 } }
        },
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: {
            color: '#88929A',
            font: { family: CHART_THEME.fontFamily, size: 10 },
            callback: (val) => `$${(val / 1000)}k`
          }
        }
      }
    }
  });
}

/**
 * 02. Homepage Signature UI Cash Flow Waterfall Chart
 */
function initWaterfallChart() {
  const ctx = document.getElementById('cashFlowWaterfallChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Gross Revenue', 'Operating Exp', 'Payroll & Benefits', 'Taxes & Compliance', 'Net Cash Added'],
      datasets: [{
        label: 'Monthly Movement ($)',
        data: [380000, -142000, -98000, -32000, 108000],
        backgroundColor: [
          '#10B981', // Inflow
          '#EF4444', // Opex
          '#B66A45', // Payroll
          '#EAB308', // Taxes
          '#C5A15A'  // Net Cash
        ],
        borderRadius: 6,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#17191B',
          titleColor: '#C5A15A',
          bodyColor: '#FFFFFF',
          padding: 12,
          bodyFont: { family: CHART_THEME.fontFamily },
          callbacks: {
            label: (ctx) => ` Movement: ${ctx.raw >= 0 ? '+' : ''}$${Math.abs(ctx.raw).toLocaleString()}`
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#E8E2D5', font: { family: "'Plus Jakarta Sans', sans-serif", size: 12 } }
        },
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.08)' },
          ticks: {
            color: '#9CA3AF',
            font: { family: CHART_THEME.fontFamily, size: 11 },
            callback: (val) => `${val < 0 ? '-' : ''}$${Math.abs(val / 1000)}k`
          }
        }
      }
    }
  });
}

/**
 * 03. Dashboard Charts Initializer
 */
window.initDashboardCharts = function() {
  initDashCashFlow();
  initDashRevenueTrend();
  initDashExpenseDonut();
  initForecastScenario();
};

function initDashCashFlow() {
  const ctx = document.getElementById('dashCashFlowChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Oct 25', 'Nov 25', 'Dec 25', 'Jan 26', 'Feb 26', 'Mar 26', 'Apr 26', 'May 26', 'Jun 26', 'Jul 26', 'Aug 26', 'Sep 26'],
      datasets: [
        {
          label: 'Inflows',
          data: [142000, 155000, 168000, 160000, 175000, 189000, 194000, 210000, 225000, 238000, 252000, 268400],
          backgroundColor: '#10B981',
          borderRadius: 4
        },
        {
          label: 'Outflows',
          data: [110000, 118000, 126000, 122000, 130000, 138000, 142000, 151000, 159000, 166000, 174000, 183780],
          backgroundColor: '#B66A45',
          borderRadius: 4
        },
        {
          type: 'line',
          label: 'Net Cash Flow',
          data: [32000, 37000, 42000, 38000, 45000, 51000, 52000, 59000, 66000, 72000, 78000, 84620],
          borderColor: '#C5A15A',
          borderWidth: 3,
          pointBackgroundColor: '#C5A15A',
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: { color: '#9CA3AF', font: { family: CHART_THEME.fontFamily, size: 11 } }
        },
        tooltip: {
          backgroundColor: '#121518',
          bodyFont: { family: CHART_THEME.fontFamily }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.04)' },
          ticks: { color: '#88929A', font: { family: CHART_THEME.fontFamily, size: 10 } }
        },
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.06)' },
          ticks: {
            color: '#88929A',
            font: { family: CHART_THEME.fontFamily, size: 10 },
            callback: (val) => `$${(val / 1000)}k`
          }
        }
      }
    }
  });
}

function initDashRevenueTrend() {
  const ctx = document.getElementById('dashRevenueTrendChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Q1 25', 'Q2 25', 'Q3 25', 'Q4 25', 'Q1 26', 'Q2 26', 'Q3 26 (Actual)', 'Q4 26 (Target)', 'Q1 27 (Target)'],
      datasets: [
        {
          label: 'Actual Revenue',
          data: [210000, 245000, 280000, 315000, 360000, 410000, 478400, null, null],
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          fill: true,
          borderWidth: 3,
          tension: 0.3
        },
        {
          label: 'CFO Model Forecast',
          data: [null, null, null, null, null, null, 478400, 540000, 615000],
          borderColor: '#C5A15A',
          borderDash: [6, 6],
          borderWidth: 2,
          pointRadius: 4,
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: '#9CA3AF', font: { family: CHART_THEME.fontFamily, size: 11 } }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.04)' },
          ticks: { color: '#88929A', font: { family: CHART_THEME.fontFamily, size: 11 } }
        },
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.06)' },
          ticks: {
            color: '#88929A',
            font: { family: CHART_THEME.fontFamily, size: 11 },
            callback: (val) => `$${(val / 1000)}k`
          }
        }
      }
    }
  });
}

function initDashExpenseDonut() {
  const ctx = document.getElementById('dashExpenseDonutChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Payroll & Wages', 'Sales & Marketing', 'Cloud & Tech Stack', 'Ops & Office', 'Legal & Professional'],
      datasets: [{
        data: [185000, 85000, 54000, 42000, 19500],
        backgroundColor: [
          '#B66A45', // Copper
          '#C5A15A', // Gold
          '#3B82F6', // Blue
          '#10B981', // Emerald
          '#8B5CF6'  // Purple
        ],
        borderWidth: 0,
        hoverOffset: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: { color: '#D1D5DB', font: { family: "'Plus Jakarta Sans', sans-serif", size: 12 } }
        },
        tooltip: {
          callbacks: {
            label: (context) => ` ${context.label}: $${context.raw.toLocaleString()}`
          }
        }
      },
      cutout: '70%'
    }
  });
}

function initForecastScenario() {
  const ctx = document.getElementById('forecastScenarioChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Month 1', 'Month 3', 'Month 6', 'Month 9', 'Month 12', 'Month 15', 'Month 18'],
      datasets: [
        {
          label: 'Plan A: Base Case (Runway 18.2m)',
          data: [284000, 310000, 365000, 420000, 490000, 560000, 640000],
          borderColor: '#10B981',
          borderWidth: 2.5,
          tension: 0.3
        },
        {
          label: 'Plan B: Aggressive Growth (Runway 11.4m)',
          data: [284000, 240000, 190000, 180000, 260000, 380000, 520000],
          borderColor: '#C5A15A',
          borderWidth: 2.5,
          tension: 0.3
        },
        {
          label: 'Plan C: Downturn Buffer (Runway 24.5m)',
          data: [284000, 320000, 360000, 400000, 440000, 480000, 530000],
          borderColor: '#3B82F6',
          borderWidth: 2.5,
          borderDash: [5, 5],
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: { color: '#9CA3AF', font: { family: CHART_THEME.fontFamily, size: 11 } }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.04)' },
          ticks: { color: '#88929A', font: { family: CHART_THEME.fontFamily, size: 10 } }
        },
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.06)' },
          ticks: {
            color: '#88929A',
            font: { family: CHART_THEME.fontFamily, size: 10 },
            callback: (val) => `$${val / 1000}k`
          }
        }
      }
    }
  });
}
