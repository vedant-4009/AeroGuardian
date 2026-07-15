// Features Page Module

const featuresData = [
  {
    icon: 'fa-tv',
    title: 'Real-Time Aircraft Monitoring',
    desc: 'High-frequency telemetry ingestion mapping thousands of sensor parameters (temperature, pressure, vibration) per second onto state dashboards.'
  },
  {
    icon: 'fa-wrench',
    title: 'Predictive Maintenance',
    desc: 'Deep learning classifiers evaluate thermal decay and bearing wear profiles, forecasting maintenance windows up to 50 hours in advance.'
  },
  {
    icon: 'fa-cubes',
    title: 'Digital Twin Simulation',
    desc: 'Synthesise telemetry with mathematical computational fluid dynamics (CFD) model replicas to isolate airframe load stresses in real time.'
  },
  {
    icon: 'fa-microchip',
    title: 'Edge AI Analytics',
    desc: 'Lightweight models compiled for specialized edge processors run onboard diagnostic sweeps without relying on remote satellite communication.'
  },
  {
    icon: 'fa-brain',
    title: 'Agentic AI Decision Support',
    desc: 'Autonomous agent loops schedule servicing, reserve mechanical replacement parts, and calculate safe flight rerouting recommendations.'
  },
  {
    icon: 'fa-exclamation-triangle',
    title: 'Fault Detection & Diagnostics',
    desc: 'Multi-parameter correlation logic isolates transient anomalies and prevents false alarm cascades from individual faulty sensors.'
  },
  {
    icon: 'fa-chart-line',
    title: 'Risk Assessment Matrices',
    desc: 'Combines age metrics, current environmental temperatures, and history datasets to compute safety risk percentages for fleet lines.'
  },
  {
    icon: 'fa-calendar-alt',
    title: 'Maintenance Scheduling',
    desc: 'Generates optimal maintenance schedules to prevent aircraft downtime at major hubs and coordinates local mechanics.'
  },
  {
    icon: 'fa-server',
    title: 'Fleet Health Management',
    desc: 'Consolidated overview of overall airline health statistics, tail number status, fuel burn trends, and upcoming inspections.'
  },
  {
    icon: 'fa-file-pdf',
    title: 'Automated Reporting',
    desc: 'Generates thorough compliance documentation, telemetry logs, and maintenance logs available in PDF and Excel formats.'
  }
];

export function render(container, state) {
  let cardsHtml = featuresData.map(f => `
    <div class="glass feature-card">
      <i class="fas ${f.icon}"></i>
      <h3 class="neon-text" style="font-size: 1.15rem; margin-top: 0.5rem; margin-bottom: 0.25rem;">${f.title}</h3>
      <p style="color: var(--text-secondary); font-size: 0.88rem; line-height: 1.5;">${f.desc}</p>
    </div>
  `).join('');

  container.innerHTML = `
    <div class="page-container">
      <div style="margin-bottom: 3rem; text-align: center;">
        <h2 class="gradient-text" style="font-size: 2.5rem; margin-bottom: 0.5rem;">System Features</h2>
        <p style="color: var(--text-secondary); max-width: 600px; margin: 0 auto;">
          An enterprise-grade SaaS technology suite for real-time diagnostics, structural twins, and autonomous scheduling.
        </p>
      </div>

      <div class="features-grid">
        ${cardsHtml}
      </div>
    </div>
  `;
}
