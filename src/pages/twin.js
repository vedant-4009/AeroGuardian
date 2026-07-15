// Digital Twin Page Module

let selectedPart = 'turbines';
let simActive = false;
let simProgress = 0;
let simInterval = null;
let simLog = [];

export function render(container, state) {
  const comps = state.components;
  const t = state.telemetry;

  const renderPartDetails = () => {
    const part = comps[selectedPart];
    if (!part) return '';
    
    let dangerColor = 'var(--success)';
    if (part.life < 50) dangerColor = 'var(--critical)';
    else if (part.life < 80) dangerColor = 'var(--warning)';

    return `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">
          <h4 style="font-size: 1.15rem; color: var(--cyan-accent);">${part.name}</h4>
          <span style="font-size: 0.75rem; padding: 0.25rem 0.5rem; background: rgba(0, 242, 254, 0.08); border: 1px solid var(--border-color); border-radius: 4px; font-family: 'Orbitron';">ID: ${selectedPart.toUpperCase()}_01</span>
        </div>
        
        <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 1rem; font-size: 0.85rem;">
          <div>
            <div style="color: var(--text-secondary); margin-bottom: 0.25rem;">Sync Frequency:</div>
            <div style="font-weight: 600; font-family: 'Orbitron';">25 Hz (Real-time)</div>
          </div>
          <div>
            <div style="color: var(--text-secondary); margin-bottom: 0.25rem;">Telemetry Offset:</div>
            <div style="font-weight: 600; color: var(--success); font-family: 'Orbitron';"><i class="fas fa-check-circle"></i> +0.02s</div>
          </div>
          <div>
            <div style="color: var(--text-secondary); margin-bottom: 0.25rem;">Component Health:</div>
            <div style="font-weight: 700; color: ${dangerColor}; font-size: 1.1rem; font-family: 'Orbitron';">${Math.round(part.life)}% RUL</div>
          </div>
          <div>
            <div style="color: var(--text-secondary); margin-bottom: 0.25rem;">Wear Classification:</div>
            <div style="font-weight: 600; color: ${dangerColor}">${part.status}</div>
          </div>
        </div>

        <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); padding: 0.75rem; border-radius: 6px; font-size: 0.8rem; line-height: 1.4; color: var(--text-secondary);">
          ${getPartDescription(selectedPart)}
        </div>

        <!-- Simulation Run Panel -->
        <div style="border-top: 1px solid var(--border-color); padding-top: 1rem; margin-top: 0.5rem;">
          <h4 style="font-size: 0.95rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-microchip" style="color: var(--cyan-accent);"></i> Stress-Test Simulation Engine
          </h4>
          <p style="font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 1rem;">
            Run numerical stress simulations directly on this digital component using modeled airflow loads.
          </p>
          
          ${simActive ? `
            <div style="margin-bottom: 0.75rem;">
              <div style="display: flex; justify-content: space-between; font-size: 0.75rem; margin-bottom: 0.25rem; font-family: 'Orbitron';">
                <span>SIMULATING: Stress Loads...</span>
                <span>${simProgress}%</span>
              </div>
              <div class="progress-track">
                <div class="progress-fill" style="width: ${simProgress}%"></div>
              </div>
            </div>
            <div style="font-size: 0.7rem; font-family: 'Orbitron'; height: 80px; overflow-y: auto; background: rgba(0,0,0,0.3); border: 1px solid var(--border-color); padding: 0.5rem; border-radius: 4px;" id="sim-logs-container">
              ${simLog.map(l => `<div style="margin-bottom: 2px;">${l}</div>`).join('')}
            </div>
          ` : `
            <button class="btn-primary" id="run-sim-btn" style="width: 100%; justify-content: center; font-size: 0.85rem; padding: 0.6rem;">
              <i class="fas fa-play"></i> Run Virtual Stress Test
            </button>
          `}
        </div>
      </div>
    `;
  };

  container.innerHTML = `
    <div class="page-container">
      <div style="margin-bottom: 2.5rem;">
        <h2 class="gradient-text" style="font-size: 2rem; margin-bottom: 0.25rem;">Aircraft Digital Twin Synchronization</h2>
        <p style="color: var(--text-secondary); font-size: 0.9rem;">
          Cross-checking live flight sensor telemetry with 3D finite element mathematics.
        </p>
      </div>

      <div class="twin-container">
        <!-- Interactive 3D Plane Representation (Left) -->
        <div class="glass twin-visualization" style="flex-direction: column;">
          <div class="sync-bar" style="position: absolute; top: 15px; left: 15px;">
            <span class="pulse-dot"></span> Digital Twin Status: Synced
          </div>
          
          <div style="position: absolute; top: 15px; right: 15px; font-size: 0.75rem; color: var(--text-secondary); text-align: right;">
            Model Sync Offset: <span style="color: var(--cyan-accent); font-family: 'Orbitron';">0.02s</span><br>
            Simulation Cycle Rate: <span style="color: var(--cyan-accent); font-family: 'Orbitron';">60 Hz</span>
          </div>

          <!-- Top Down Wireframe Aircraft SVG -->
          <svg class="twin-svg-plane" viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="twin-glow" x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <!-- Background grid lines -->
            <path d="M 50,0 L 50,400 M 150,0 L 150,400 M 250,0 L 250,400 M 350,0 L 350,400 M 450,0 L 450,400 M 550,0 L 550,400" stroke="rgba(255,255,255,0.02)" stroke-width="1" />
            <path d="M 0,50 L 600,50 M 0,150 L 600,150 M 0,250 L 600,250 M 0,350 L 600,350" stroke="rgba(255,255,255,0.02)" stroke-width="1" />

            <g stroke="rgba(255, 255, 255, 0.1)" stroke-width="1">
              <!-- Grid circles -->
              <circle cx="300" cy="200" r="160" stroke-dasharray="4 8" />
              <circle cx="300" cy="200" r="80" stroke-dasharray="2 4" />
            </g>

            <!-- Airplane Silhouette Outline -->
            <path d="M300 30 L308 150 L303 330 L300 350 L297 330 L292 150 Z" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" />
            
            <!-- Left Wing -->
            <path d="M292 180 L100 280 L95 292 L130 292 L294 235" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" />
            <!-- Right Wing -->
            <path d="M308 180 L500 280 L505 292 L470 292 L306 235" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" />

            <!-- Stabilizers -->
            <path d="M296 320 L230 355 L232 362 L252 362 L296 342" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" />
            <path d="M304 320 L370 355 L368 362 L348 362 L304 342" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" />

            <!-- HOT SPOT INTERACTIVE ZONES -->
            <!-- 1. Cockpit Avionics -->
            <polygon class="interactive-part ${selectedPart === 'avionics' ? 'active' : ''}" 
                     points="295,45 305,45 308,80 300,100 292,80" 
                     id="hotspot-avionics" />
            
            <!-- 2. Engine Turbines Left & Right -->
            <rect class="interactive-part ${selectedPart === 'turbines' ? 'active' : ''}" 
                  x="185" y="210" width="22" height="48" rx="10" 
                  id="hotspot-turbines-left" />
            <rect class="interactive-part ${selectedPart === 'turbines' ? 'active' : ''}" 
                  x="393" y="210" width="22" height="48" rx="10" 
                  id="hotspot-turbines-right" />

            <!-- 3. Fuel System / Wings Tanks -->
            <polygon class="interactive-part ${comps.fuelSystem.life < 75 ? 'part-critical' : ''} ${selectedPart === 'fuelSystem' ? 'active' : ''}" 
                     points="240,230 285,215 285,245 220,260" 
                     id="hotspot-fuelsystem" />

            <!-- 4. Landing Gear Actuator -->
            <ellipse class="interactive-part ${selectedPart === 'landingGear' ? 'active' : ''}" 
                     cx="300" cy="210" rx="12" ry="16" 
                     id="hotspot-landinggear" />

            <!-- Interactive node overlay points -->
            <circle cx="300" cy="70" r="4" fill="${selectedPart === 'avionics' ? 'var(--cyan-accent)' : 'rgba(255,255,255,0.5)'}" />
            <circle cx="196" cy="234" r="4" fill="${selectedPart === 'turbines' ? 'var(--cyan-accent)' : 'rgba(255,255,255,0.5)'}" />
            <circle cx="404" cy="234" r="4" fill="${selectedPart === 'turbines' ? 'var(--cyan-accent)' : 'rgba(255,255,255,0.5)'}" />
            <circle cx="260" cy="238" r="4" fill="${selectedPart === 'fuelSystem' ? 'var(--critical)' : 'rgba(255,255,255,0.5)'}" />
            <circle cx="300" cy="210" r="4" fill="${selectedPart === 'landingGear' ? 'var(--cyan-accent)' : 'rgba(255,255,255,0.5)'}" />
          </svg>
          
          <div style="font-size: 0.8rem; color: var(--text-secondary); text-align: center; margin-top: 1rem;">
            Click on highlighted hotspots (Cockpit, Engines, Landing Gear, Wing Fuel Valve) to select.
          </div>
        </div>

        <!-- Details Panel (Right) -->
        <div class="glass twin-details-panel">
          ${renderPartDetails()}
        </div>
      </div>
    </div>
  `;

  // Bind hotspot click listeners
  const hotspots = {
    'hotspot-avionics': 'avionics',
    'hotspot-turbines-left': 'turbines',
    'hotspot-turbines-right': 'turbines',
    'hotspot-fuelsystem': 'fuelSystem',
    'hotspot-landinggear': 'landingGear'
  };

  Object.entries(hotspots).forEach(([elementId, partKey]) => {
    const el = document.getElementById(elementId);
    if (el) {
      el.addEventListener('click', () => {
        selectedPart = partKey;
        // stop any simulation if part changes
        stopSim();
        render(container, state);
      });
    }
  });

  const stopSim = () => {
    simActive = false;
    simProgress = 0;
    simLog = [];
    if (simInterval) clearInterval(simInterval);
  };

  const runSimulation = () => {
    simActive = true;
    simProgress = 0;
    simLog = ['Initializing Twin Finite Element Solver...', 'Reading telemetry from localized Edge AI...', 'Loading component stress weights...'];
    
    render(container, state);
    
    simInterval = setInterval(() => {
      simProgress += 10;
      
      // Add dynamic logs based on progress
      if (simProgress === 30) {
        simLog.push(`[30%] Mapping vibration spectrum: ${state.telemetry.vibration}g dynamic excitation`);
      } else if (simProgress === 50) {
        simLog.push(`[50%] Simulating CFD boundary layers at Mach 0.82`);
      } else if (simProgress === 80) {
        const wear = 100 - state.components[selectedPart].life;
        simLog.push(`[80%] Wear parameter calculation: +${wear.toFixed(2)}% dynamic micro-degradation`);
      } else if (simProgress === 100) {
        simLog.push(`[100%] Diagnostics complete. Failure probability: ${state.telemetry.faultProbability}%`);
        simLog.push(`Recommendation: ${stateManager.predictHealth().recommendations[0]}`);
        clearInterval(simInterval);
        simActive = false;
      }
      
      // Keep logs scrolled down
      render(container, state);
      const logContainer = document.getElementById('sim-logs-container');
      if (logContainer) logContainer.scrollTop = logContainer.scrollHeight;
    }, 400);
  };

  const simBtn = document.getElementById('run-sim-btn');
  if (simBtn) {
    simBtn.addEventListener('click', () => {
      runSimulation();
    });
  }
}

function getPartDescription(partKey) {
  const desc = {
    turbines: 'Double-row gas turbine assemblies generating axial propulsion. Diagnostic sensors track exhaust gas temperature (EGT), combustion vibrations, and oil feed pressure levels.',
    landingGear: 'Hydraulic extension cylinder actuators and shock absorbency units. Tracked parameters include extension cycle duration (s), structural impact excitation (g), and fluid chamber sealing indicators.',
    avionics: 'Redundant triple-module central computing processors hosting local Edge AI networks and primary flight control software. Monitored for chip thermal levels and core cycle status.',
    fuelSystem: 'Integrated wing main fuel tanks, valve distribution linkages, and high-pressure electric feed pumps. Monitored for pressure levels, flow balance matching, and valve friction margins.'
  };
  return desc[partKey] || '';
}
