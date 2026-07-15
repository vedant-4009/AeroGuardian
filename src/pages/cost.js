// Cost Analysis / ROI Calculator Module

import { stateManager } from '../state.js';

export function render(container, state) {
  const roi = state.roiCalculator;

  // Compute values
  const avgIncidentHours = 4.5;
  const currentTotalDowntimeCost = roi.fleetSize * roi.downtimeIncidents * roi.costPerHour * avgIncidentHours;
  
  // AeroGuardian delivers 35% reduction in downtime incidents
  const downtimeSavings = Math.round(currentTotalDowntimeCost * 0.35);
  
  // Fuel burn savings: ~1.2% fuel efficiency improvement. 
  // Let's assume average plane burns $800k in fuel annually. 1.2% of 800k = $9,600 per plane
  const fuelSavings = Math.round(roi.fleetSize * 9600);
  
  // Total Savings
  const totalSavings = downtimeSavings + fuelSavings;
  
  // Estimated Subscription cost (SaaS price: $1,500 per plane per month)
  const annualSubscription = roi.fleetSize * 1500 * 12;
  const netRoiValue = totalSavings - annualSubscription;
  const roiPercent = Math.round((netRoiValue / annualSubscription) * 100);

  container.innerHTML = `
    <div class="page-container">
      <div style="margin-bottom: 2.5rem;">
        <h2 class="gradient-text" style="font-size: 2rem; margin-bottom: 0.25rem;">Financial Cost Analysis & ROI</h2>
        <p style="color: var(--text-secondary); font-size: 0.9rem;">
          Estimate operational savings achieved by migrating from reactive inspections to Edge AI predictive health monitoring.
        </p>
      </div>

      <div class="cost-calculator-section">
        <!-- Sliders Configurations (Left) -->
        <div class="glass calculator-panel">
          <h3 style="font-size: 1.15rem; color: var(--text-primary); border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; margin-bottom: 1rem;">
            <i class="fas fa-sliders-h" style="color: var(--cyan-accent);"></i> Fleet Specifications
          </h3>

          <div class="slider-group">
            <div class="slider-header">
              <span>Aircraft Fleet Size:</span>
              <strong style="color: var(--cyan-accent); font-family: 'Orbitron';">${roi.fleetSize} planes</strong>
            </div>
            <input type="range" id="fleet-size-slider" min="1" max="100" value="${roi.fleetSize}" class="roi-slider" />
          </div>

          <div class="slider-group">
            <div class="slider-header">
              <span>Unscheduled Downtime Events:</span>
              <strong style="color: var(--cyan-accent); font-family: 'Orbitron';">${roi.downtimeIncidents} / plane-year</strong>
            </div>
            <input type="range" id="downtime-events-slider" min="1" max="50" value="${roi.downtimeIncidents}" class="roi-slider" />
            <span style="font-size: 0.7rem; color: var(--text-secondary);">Avg Incident duration: ${avgIncidentHours} hours (AOG)</span>
          </div>

          <div class="slider-group">
            <div class="slider-header">
              <span>Average Cost of Delay / Hour:</span>
              <strong style="color: var(--cyan-accent); font-family: 'Orbitron';">$${roi.costPerHour.toLocaleString()}</strong>
            </div>
            <input type="range" id="cost-per-hour-slider" min="1000" max="50000" step="1000" value="${roi.costPerHour}" class="roi-slider" />
            <span style="font-size: 0.7rem; color: var(--text-secondary);">Includes passenger compensation, gate penalties, and engineering overtime.</span>
          </div>
        </div>

        <!-- Dynamic Results Panel (Right) -->
        <div class="glass cost-results-panel">
          <div class="saving-kpi">
            <div style="font-size: 0.85rem; color: var(--text-secondary); text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px; margin-bottom: 0.5rem;">
              Estimated Annual Savings
            </div>
            <div class="saving-kpi-val">$${totalSavings.toLocaleString()}</div>
            <span style="font-size: 0.8rem; color: var(--text-secondary);">
              Downtime Savings: <strong>$${downtimeSavings.toLocaleString()}</strong> | Fuel Optimizer: <strong>$${fuelSavings.toLocaleString()}</strong>
            </span>
          </div>

          <!-- ROI Metrics Matrix -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; border-top: 1px solid var(--border-color); padding-top: 1.5rem;">
            <div>
              <div style="font-size: 0.75rem; color: var(--text-secondary);">SaaS Subscription (Est):</div>
              <div style="font-size: 1.15rem; font-weight: 700; font-family: 'Orbitron';">$${annualSubscription.toLocaleString()}/yr</div>
            </div>
            <div>
              <div style="font-size: 0.75rem; color: var(--text-secondary);">Net Return (ROI):</div>
              <div style="font-size: 1.15rem; font-weight: 700; color: var(--success); font-family: 'Orbitron';">+${roiPercent}%</div>
            </div>
            <div>
              <div style="font-size: 0.75rem; color: var(--text-secondary);">Downtime Cost (Before AI):</div>
              <div style="font-size: 1.15rem; font-weight: 700; color: var(--critical); font-family: 'Orbitron';">$${currentTotalDowntimeCost.toLocaleString()}</div>
            </div>
            <div>
              <div style="font-size: 0.75rem; color: var(--text-secondary);">Operational Payback:</div>
              <div style="font-size: 1.15rem; font-weight: 700; font-family: 'Orbitron';">3.4 Months</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Bind slider controls change
  const fleetSlider = document.getElementById('fleet-size-slider');
  const downtimeSlider = document.getElementById('downtime-events-slider');
  const costSlider = document.getElementById('cost-per-hour-slider');

  const updateCalculations = () => {
    stateManager.updateRoiParams(
      Number(fleetSlider.value),
      Number(downtimeSlider.value),
      Number(costSlider.value)
    );
    render(container, stateManager.state);
  };

  fleetSlider.addEventListener('input', updateCalculations);
  downtimeSlider.addEventListener('input', updateCalculations);
  costSlider.addEventListener('input', updateCalculations);
}
