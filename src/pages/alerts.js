// Alerts & Notifications Page Module

import { stateManager } from '../state.js';

let activeFilter = 'all';

export function render(container, state) {
  const alerts = state.alerts;

  const filteredAlerts = alerts.filter(a => {
    if (activeFilter === 'all') return true;
    return a.type === activeFilter;
  });

  const alertCards = filteredAlerts.length > 0 ? filteredAlerts.map(a => {
    let cardClass = `${a.type}-card`;
    let iconName = 'fa-info-circle';
    
    if (a.type === 'critical') iconName = 'fa-skull-crossbones';
    else if (a.type === 'warning') iconName = 'fa-exclamation-triangle';

    return `
      <div class="glass alert-feed-card ${cardClass}" style="opacity: ${a.read ? 0.6 : 1}">
        <div class="alert-feed-icon ${a.type}"><i class="fas ${iconName}"></i></div>
        <div class="alert-feed-content">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
            <h4 style="font-size: 0.95rem; font-family: 'Orbitron';">${a.component.toUpperCase()}</h4>
            <span class="alert-feed-time">${a.timestamp}</span>
          </div>
          <p style="color: var(--text-primary); font-size: 0.88rem; line-height: 1.4; margin-bottom: 0.5rem;">${a.message}</p>
          
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.75rem; font-weight: 600; text-transform: uppercase; color: ${a.type === 'critical' ? 'var(--critical)' : a.type === 'warning' ? 'var(--warning)' : 'var(--blue-accent)'}">
              ${a.type} status
            </span>
            ${!a.read ? `
              <button class="btn-secondary ack-btn" data-id="${a.id}" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; border-radius: 4px;">
                <i class="fas fa-check"></i> Acknowledge
              </button>
            ` : `
              <span style="color: var(--text-secondary); font-size: 0.75rem;"><i class="fas fa-check-double"></i> Checked</span>
            `}
          </div>
        </div>
      </div>
    `;
  }).join('') : `
    <div class="glass" style="padding: 3rem; text-align: center; color: var(--text-secondary);">
      <i class="fas fa-check-circle" style="font-size: 3rem; color: var(--success); margin-bottom: 1rem;"></i>
      <h3>No Alerts Flagged</h3>
      <p style="font-size: 0.85rem; margin-top: 0.25rem;">Sensors match normal parameters across all flight clusters.</p>
    </div>
  `;

  container.innerHTML = `
    <div class="page-container">
      <div class="alerts-header">
        <div>
          <h2 class="gradient-text" style="font-size: 2rem; margin-bottom: 0.25rem;">Alert Console & Log</h2>
          <p style="color: var(--text-secondary); font-size: 0.9rem;">
            Real-time sensory warning buffer. Connected to Edge AI local telemetry feeds.
          </p>
        </div>
        
        <button class="btn-secondary" id="clear-all-alerts-btn" style="padding: 0.5rem 1rem; font-size: 0.85rem;">
          <i class="fas fa-trash"></i> Clear History
        </button>
      </div>

      <!-- Filters Bar -->
      <div style="margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center;">
        <div class="alerts-filter-bar">
          <button class="filter-btn ${activeFilter === 'all' ? 'active' : ''}" data-filter="all">All Alerts</button>
          <button class="filter-btn ${activeFilter === 'critical' ? 'active' : ''}" data-filter="critical">
            <span style="color: var(--critical)">●</span> Critical
          </button>
          <button class="filter-btn ${activeFilter === 'warning' ? 'active' : ''}" data-filter="warning">
            <span style="color: var(--warning)">●</span> Warning
          </button>
          <button class="filter-btn ${activeFilter === 'info' ? 'active' : ''}" data-filter="info">
            <span style="color: var(--blue-accent)">●</span> Info
          </button>
        </div>
        <div style="font-size: 0.8rem; color: var(--text-secondary);">
          Total Logged: <strong style="color: var(--text-primary); font-family: 'Orbitron';">${alerts.length}</strong>
        </div>
      </div>

      <!-- Feed List -->
      <div class="alerts-feed-list">
        ${alertCards}
      </div>
    </div>
  `;

  // Bind click actions to filters
  const filterBtns = container.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      activeFilter = btn.getAttribute('data-filter');
      render(container, state);
    });
  });

  // Bind click to Acknowledge buttons
  const ackBtns = container.querySelectorAll('.ack-btn');
  ackBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.getAttribute('data-id'));
      stateManager.acknowledgeAlert(id);
      render(container, stateManager.state);
    });
  });

  // Bind click to Clear All
  document.getElementById('clear-all-alerts-btn').addEventListener('click', () => {
    stateManager.clearAlerts();
    render(container, stateManager.state);
  });
}
