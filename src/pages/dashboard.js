// AI Dashboard Page Module

export function render(container, state) {
  const t = state.telemetry;
  const comps = state.components;

  // Set up dashboard grid
  container.innerHTML = `
    <div class="page-container">
      <div style="margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h2 class="gradient-text" style="font-size: 2rem;">Real-Time Diagnostic Panel</h2>
          <p style="color: var(--text-secondary); font-size: 0.9rem;">Tail Unit: <strong>N-787AG</strong> | Sync status: <strong>Aero-Synchronized</strong></p>
        </div>
        <div style="display: flex; gap: 0.75rem;">
          <div class="status-capsule ${t.status.toLowerCase()}">
            <span class="pulse-dot"></span> System Status: ${t.status}
          </div>
          <button class="btn-secondary" id="trigger-sweep-btn" style="padding: 0.5rem 1rem; font-size: 0.85rem;">
            <i class="fas fa-sync"></i> Recalibrate Sensors
          </button>
        </div>
      </div>

      <!-- KPI Summary Cards Row -->
      <div class="kpi-row">
        <div class="glass kpi-card">
          <div>
            <div style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 600; text-transform: uppercase;">Engine Temp</div>
            <div class="kpi-value ${t.engineTemp > 645 ? 'warning' : ''}" style="color: ${t.engineTemp > 645 ? 'var(--warning)' : 'var(--text-primary)'}">${t.engineTemp} °C</div>
            <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.25rem;">Nominal: 600-640°C</div>
          </div>
          <div class="kpi-icon"><i class="fas fa-thermometer-high"></i></div>
        </div>

        <div class="glass kpi-card">
          <div>
            <div style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 600; text-transform: uppercase;">Fuel Flow Efficiency</div>
            <div class="kpi-value" style="color: var(--success)">${t.fuelEfficiency}%</div>
            <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.25rem;">Target: >95.0%</div>
          </div>
          <div class="kpi-icon"><i class="fas fa-gas-pump"></i></div>
        </div>

        <div class="glass kpi-card">
          <div>
            <div style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 600; text-transform: uppercase;">Vibration Index</div>
            <div class="kpi-value ${t.vibration > 0.35 ? 'critical' : ''}" style="color: ${t.vibration > 0.35 ? 'var(--critical)' : 'var(--text-primary)'}">${t.vibration} g</div>
            <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.25rem;">Tolerance: 0.40g max</div>
          </div>
          <div class="kpi-icon"><i class="fas fa-wave-square"></i></div>
        </div>

        <div class="glass kpi-card">
          <div>
            <div style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 600; text-transform: uppercase;">Fault Probability</div>
            <div class="kpi-value" style="color: ${t.faultProbability > 25 ? 'var(--warning)' : 'var(--cyan-accent)'}">${t.faultProbability}%</div>
            <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.25rem;">Safety threshold: 15%</div>
          </div>
          <div class="kpi-icon"><i class="fas fa-calculator"></i></div>
        </div>
      </div>

      <!-- Core Telemetry Visualizations -->
      <div class="dashboard-grid">
        <!-- Main charts left side -->
        <div>
          <!-- Chart panel: Temp & vibration -->
          <div class="glass chart-wrapper">
            <h3 style="font-size: 1.1rem; margin-bottom: 1rem; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;">
              <i class="fas fa-sliders-h" style="color: var(--cyan-accent)"></i> Propulsion Thermal History & Vibration
            </h3>
            <canvas id="telemetry-chart" class="chart-canvas"></canvas>
            <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.5rem;">
              <span>-2.0 min</span>
              <span>-1.5 min</span>
              <span>-1.0 min</span>
              <span>-0.5 min</span>
              <span>Live Sensor Sync</span>
            </div>
          </div>

          <!-- Component Wear List -->
          <div class="glass life-bars-container">
            <h3 style="font-size: 1.1rem; margin-bottom: 0.5rem; color: var(--text-primary);">
              <i class="fas fa-hourglass-half" style="color: var(--cyan-accent)"></i> Remaining Component Service Life (RUL)
            </h3>
            
            ${Object.entries(comps).map(([key, item]) => {
              const lifeVal = Math.round(item.life);
              let statusClass = 'normal';
              if (lifeVal < 50) statusClass = 'critical';
              else if (lifeVal < 80) statusClass = 'warning';

              return `
                <div class="life-bar-item">
                  <div class="life-bar-header">
                    <span>${item.name}</span>
                    <span style="font-weight: 700; color: ${statusClass === 'critical' ? 'var(--critical)' : statusClass === 'warning' ? 'var(--warning)' : 'var(--cyan-accent)'}">${lifeVal}% RUL</span>
                  </div>
                  <div class="progress-track">
                    <div class="progress-fill ${statusClass}" style="width: ${lifeVal}%"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Sidebar telemetry metrics (Right side) -->
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          <!-- Health Score Gauge -->
          <div class="glass health-gauge-container">
            <h3 style="font-size: 1.1rem; margin-bottom: 1rem;">Fleet Safety Index</h3>
            
            <div style="position: relative; display: flex; align-items: center; justify-content: center;">
              <svg class="gauge-svg">
                <!-- Outer Track -->
                <circle class="gauge-track" cx="90" cy="90" r="75"></circle>
                <!-- Fill stroke dash calculation: 2 * PI * r = 471.2 -->
                <circle class="gauge-fill" id="health-gauge-fill" cx="90" cy="90" r="75"
                  stroke-dasharray="471.2" stroke-dashoffset="${471.2 - (471.2 * t.healthScore) / 100}"
                  stroke="url(#gauge-gradient)"></circle>
                
                <defs>
                  <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#0066ff" />
                    <stop offset="100%" stop-color="#00f2fe" />
                  </linearGradient>
                </defs>
                
                <text class="gauge-text" x="90" y="95" text-anchor="middle">${t.healthScore}</text>
                <text class="gauge-subtext" x="90" y="125" text-anchor="middle">Airframe</text>
              </svg>
            </div>
            
            <p style="font-size: 0.85rem; color: var(--text-secondary); text-align: center; margin-top: 1.5rem; line-height: 1.5;">
              Safety score is computed via real-time telemetry cross-reference with digital twins and flight stress loads.
            </p>
          </div>

          <!-- Real-Time Activity Log / Small Alert Feed -->
          <div class="glass" style="padding: 1.5rem; flex-grow: 1;">
            <h3 style="font-size: 1.1rem; margin-bottom: 1rem;">Recent Anomalies</h3>
            <div style="display: flex; flex-direction: column; gap: 0.75rem;" id="dash-anomalies-list">
              ${state.alerts.slice(0, 3).map(a => `
                <div style="display: flex; gap: 0.5rem; font-size: 0.8rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">
                  <span style="color: ${a.type === 'critical' ? 'var(--critical)' : a.type === 'warning' ? 'var(--warning)' : 'var(--blue-accent)'}">●</span>
                  <div>
                    <span style="font-weight: 600;">${a.component}</span>: ${a.message}
                    <div style="color: var(--text-secondary); font-size: 0.7rem; margin-top: 2px;">${a.timestamp}</div>
                  </div>
                </div>
              `).join('')}
            </div>
            <button class="btn-secondary" id="dash-view-alerts" style="width: 100%; padding: 0.4rem; font-size: 0.8rem; margin-top: 1rem;">
              View Alert Console
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Draw the real-time canvas chart
  drawChart(state.telemetryHistory);

  // Bind actions
  document.getElementById('trigger-sweep-btn').addEventListener('click', () => {
    window.appState.addAlert('info', 'Calibrator', 'Self-recalibrating sensory telemetry offsets... Digital Twin synchronized successfully.');
    window.appState.setState({
      telemetry: {
        ...window.appState.state.telemetry,
        healthScore: Math.min(98, window.appState.state.telemetry.healthScore + 2),
        vibration: parseFloat((window.appState.state.telemetry.vibration * 0.9).toFixed(2)),
        engineTemp: Math.max(600, window.appState.state.telemetry.engineTemp - 5)
      }
    });
  });

  document.getElementById('dash-view-alerts').addEventListener('click', () => {
    window.appState.setState({ activeView: 'alerts' });
  });
}

function drawChart(history) {
  const canvas = document.getElementById('telemetry-chart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  
  // Set dimensions correctly (retina scaling support)
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * window.devicePixelRatio;
  canvas.height = rect.height * window.devicePixelRatio;
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

  const w = rect.width;
  const h = rect.height;

  // Clear
  ctx.clearRect(0, 0, w, h);

  // Render baseline grid lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  for (let i = 1; i < 4; i++) {
    const y = (h / 4) * i;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  if (history.length < 2) return;

  // Values definitions
  const tempMin = 580;
  const tempMax = 680;
  const vibMin = 0.0;
  const vibMax = 0.6;

  const getX = (index) => (w / (history.length - 1)) * index;
  const getTempY = (val) => h - ((val - tempMin) / (tempMax - tempMin)) * (h - 20) - 10;
  const getVibY = (val) => h - ((val - vibMin) / (vibMax - vibMin)) * (h - 20) - 10;

  // 1. Draw Temperature Area under the line (Glowing cyan gradient)
  const gradTemp = ctx.createLinearGradient(0, 0, 0, h);
  gradTemp.addColorStop(0, 'rgba(0, 242, 254, 0.25)');
  gradTemp.addColorStop(1, 'rgba(0, 242, 254, 0.00)');

  ctx.fillStyle = gradTemp;
  ctx.beginPath();
  ctx.moveTo(getX(0), h);
  for (let i = 0; i < history.length; i++) {
    ctx.lineTo(getX(i), getTempY(history[i].engineTemp));
  }
  ctx.lineTo(getX(history.length - 1), h);
  ctx.closePath();
  ctx.fill();

  // 2. Draw Temperature Line (Cyan Accent)
  ctx.strokeStyle = '#00f2fe';
  ctx.lineWidth = 2.5;
  ctx.shadowColor = 'rgba(0, 242, 254, 0.5)';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.moveTo(getX(0), getTempY(history[0].engineTemp));
  for (let i = 1; i < history.length; i++) {
    ctx.lineTo(getX(i), getTempY(history[i].engineTemp));
  }
  ctx.stroke();
  ctx.shadowBlur = 0; // reset shadow

  // 3. Draw Vibration Line (Violet/Blue Accent)
  ctx.strokeStyle = '#9d4edd';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(getX(0), getVibY(history[0].vibration));
  for (let i = 1; i < history.length; i++) {
    ctx.lineTo(getX(i), getVibY(history[i].vibration));
  }
  ctx.stroke();

  // Draw values labels
  ctx.fillStyle = '#00f2fe';
  ctx.font = '10px Orbitron';
  ctx.fillText('TEMP LINE (°C)', 10, 20);

  ctx.fillStyle = '#9d4edd';
  ctx.fillText('VIB LINE (g)', 120, 20);
}
