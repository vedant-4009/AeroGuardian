// Reports Page Module

import { stateManager } from '../state.js';

export function render(container, state) {
  const prediction = stateManager.predictHealth();

  container.innerHTML = `
    <div class="page-container">
      <div style="margin-bottom: 2.5rem;">
        <h2 class="gradient-text" style="font-size: 2rem; margin-bottom: 0.25rem;">Flight Diagnostics & Reports</h2>
        <p style="color: var(--text-secondary); font-size: 0.9rem;">
          Generate airworthiness certificates, export Excel telemetry logs, and parse uploaded avionics blackbox records.
        </p>
      </div>

      <div class="reports-dashboard">
        <!-- Telemetry File Uploader & Template (Left) -->
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          <div class="glass" style="padding: 1.5rem;">
            <h3 style="font-size: 1.1rem; margin-bottom: 1rem; color: var(--text-primary);"><i class="fas fa-file-upload" style="color: var(--cyan-accent);"></i> Upload Flight Telemetry</h3>
            <p style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 1.5rem;">
              Drop flight recorder telemetry files (.csv) here to parse engine profiles, fuel rates, and micro-vibrations.
            </p>
            
            <div class="file-drop-zone" id="telemetry-drop-zone">
              <i class="fas fa-cloud-upload-alt"></i>
              <div style="font-weight: 600; margin-top: 0.5rem;">Drag & Drop Flight CSV here</div>
              <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.25rem;">or click to browse local storage</div>
              <input type="file" id="telemetry-file-input" style="display: none;" accept=".csv" />
            </div>

            <button class="btn-secondary" id="download-template-btn" style="width: 100%; margin-top: 1rem; justify-content: center; font-size: 0.8rem; padding: 0.5rem;">
              <i class="fas fa-file-code"></i> Download Test CSV Template
            </button>
          </div>

          <!-- Repair Recommendations (Predictive Engine output) -->
          <div class="glass" style="padding: 1.5rem;">
            <h3 style="font-size: 1.1rem; margin-bottom: 1rem; color: var(--text-primary);"><i class="fas fa-toolbox" style="color: var(--warning);"></i> Active Repair Recommendations</h3>
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              <div>
                <span style="font-size: 0.75rem; color: var(--text-secondary);">Risk Matrix Classification:</span>
                <div style="font-weight: 700; color: ${prediction.riskFactor === 'High' ? 'var(--critical)' : prediction.riskFactor === 'Moderate' ? 'var(--warning)' : 'var(--success)'}; font-family: 'Orbitron';">
                  ${prediction.riskFactor.toUpperCase()} RISK
                </div>
              </div>
              <div>
                <span style="font-size: 0.75rem; color: var(--text-secondary);">Remaining Safe Flight Duration (Est):</span>
                <div style="font-weight: 600; font-family: 'Orbitron';">${prediction.ttfDays} Flight Hours</div>
              </div>
              <div>
                <span style="font-size: 0.75rem; color: var(--text-secondary);">Recommended Actions:</span>
                <ul style="margin-left: 1.25rem; font-size: 0.8rem; line-height: 1.5; color: var(--text-secondary); margin-top: 0.25rem;">
                  ${prediction.recommendations.map(r => `<li style="margin-bottom: 4px;">${r}</li>`).join('')}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Export Actions & History Records (Right) -->
        <div class="glass reports-list">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; margin-bottom: 1rem;">
            <h3 style="font-size: 1.1rem;">Flight Safety History & Certificates</h3>
            <div style="display: flex; gap: 0.5rem;">
              <button class="btn-primary" id="btn-export-pdf" style="padding: 0.4rem 0.8rem; font-size: 0.75rem;">
                <i class="fas fa-file-pdf"></i> Export PDF
              </button>
              <button class="btn-secondary" id="btn-export-excel" style="padding: 0.4rem 0.8rem; font-size: 0.75rem;">
                <i class="fas fa-file-excel"></i> Export Excel
              </button>
            </div>
          </div>

          <!-- History List Table -->
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
              <thead>
                <tr style="border-bottom: 1.5px solid var(--border-color); color: var(--text-secondary);">
                  <th style="padding: 0.75rem 0.5rem;">Report ID</th>
                  <th style="padding: 0.75rem 0.5rem;">Sector / Flight</th>
                  <th style="padding: 0.75rem 0.5rem;">Date</th>
                  <th style="padding: 0.75rem 0.5rem;">Health Index</th>
                  <th style="padding: 0.75rem 0.5rem;">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom: 1px solid var(--border-color);">
                  <td style="padding: 0.75rem 0.5rem; font-weight: 600; color: var(--cyan-accent);">REP-2026-904</td>
                  <td style="padding: 0.75rem 0.5rem;">SIN -> HND (AG-402)</td>
                  <td style="padding: 0.75rem 0.5rem;">15 July 2026</td>
                  <td style="padding: 0.75rem 0.5rem; font-weight: 600;">94%</td>
                  <td style="padding: 0.75rem 0.5rem;"><span style="color: var(--success);">Released</span></td>
                </tr>
                <tr style="border-bottom: 1px solid var(--border-color);">
                  <td style="padding: 0.75rem 0.5rem; font-weight: 600; color: var(--cyan-accent);">REP-2026-891</td>
                  <td style="padding: 0.75rem 0.5rem;">LHR -> JFK (AG-101)</td>
                  <td style="padding: 0.75rem 0.5rem;">13 July 2026</td>
                  <td style="padding: 0.75rem 0.5rem; font-weight: 600;">96%</td>
                  <td style="padding: 0.75rem 0.5rem;"><span style="color: var(--success);">Released</span></td>
                </tr>
                <tr style="border-bottom: 1px solid var(--border-color);">
                  <td style="padding: 0.75rem 0.5rem; font-weight: 600; color: var(--cyan-accent);">REP-2026-874</td>
                  <td style="padding: 0.75rem 0.5rem;">DXB -> CDG (AG-090)</td>
                  <td style="padding: 0.75rem 0.5rem;">10 July 2026</td>
                  <td style="padding: 0.75rem 0.5rem; font-weight: 600;">88%</td>
                  <td style="padding: 0.75rem 0.5rem;"><span style="color: var(--warning);">Serviced</span></td>
                </tr>
                <tr style="border-bottom: 1px solid var(--border-color);">
                  <td style="padding: 0.75rem 0.5rem; font-weight: 600; color: var(--cyan-accent);">REP-2026-861</td>
                  <td style="padding: 0.75rem 0.5rem;">LAX -> SYD (AG-510)</td>
                  <td style="padding: 0.75rem 0.5rem;">08 July 2026</td>
                  <td style="padding: 0.75rem 0.5rem; font-weight: 600;">93%</td>
                  <td style="padding: 0.75rem 0.5rem;"><span style="color: var(--success);">Released</span></td>
                </tr>
                <tr style="border-bottom: 1px solid var(--border-color);">
                  <td style="padding: 0.75rem 0.5rem; font-weight: 600; color: var(--cyan-accent);">REP-2026-842</td>
                  <td style="padding: 0.75rem 0.5rem;">HND -> LHR (AG-088)</td>
                  <td style="padding: 0.75rem 0.5rem;">05 July 2026</td>
                  <td style="padding: 0.75rem 0.5rem; font-weight: 600;">74%</td>
                  <td style="padding: 0.75rem 0.5rem;"><span style="color: var(--critical);">Grounded</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;

  // Bind drag & drop file upload elements
  const dropZone = document.getElementById('telemetry-drop-zone');
  const fileInput = document.getElementById('telemetry-file-input');

  dropZone.addEventListener('click', () => {
    fileInput.click();
  });

  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  });

  fileInput.addEventListener('change', (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  });

  function handleFile(file) {
    if (!file.name.endsWith('.csv')) {
      alert("Error: Please select a valid CSV telemetry file.");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = function(evt) {
      const text = evt.target.result;
      const res = stateManager.processUploadedCSV(text);
      if (res.success) {
        alert(`Successfully imported flight log telemetry! Loaded ${res.count} rows of data. Go to Dashboard to check updated gauges.`);
      } else {
        alert(`Error importing CSV: ${res.error}`);
      }
    };
    reader.readAsText(file);
  }

  // Generate Template CSV
  document.getElementById('download-template-btn').addEventListener('click', () => {
    const csvContent = "healthScore,engineTemp,fuelEfficiency,vibration,faultProbability,status,turbines,landinggear,avionics,fuelsystem\n91,630,96.2,0.28,6,Healthy,90,85,98,71\n76,658,93.4,0.42,35,Warning,88,80,95,68\n";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "aeroguardian_flight_template.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  // Export CSV Data Sheets
  document.getElementById('btn-export-excel').addEventListener('click', () => {
    const history = state.telemetryHistory;
    let csv = 'Timestamp,Airframe Health Index,Engine Temperature (C),Fuel Efficiency (%),Vibrations (g),Fault Probability (%),Status\n';
    history.forEach(h => {
      csv += `${h.timestamp},${h.healthScore},${h.engineTemp},${h.fuelEfficiency},${h.vibration},${h.faultProbability},${h.status}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `aeroguardian_telemetry_${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    stateManager.addAlert('info', 'Reports', 'Telemetry Excel/CSV data spreadsheet exported successfully.');
  });

  // Export PDF Report (print-friendly popup style)
  document.getElementById('btn-export-pdf').addEventListener('click', () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>AeroGuardian Airworthiness Diagnostics Certificate</title>
          <style>
            body { font-family: sans-serif; color: #1e293b; padding: 40px; }
            .header { border-bottom: 2px solid #00f2fe; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; }
            h1 { margin: 0; color: #0f172a; font-size: 24px; }
            .meta { font-size: 14px; color: #64748b; line-height: 1.6; }
            .score-panel { display: flex; gap: 20px; margin-bottom: 30px; }
            .score-card { border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; flex: 1; text-align: center; }
            .score-val { font-size: 32px; font-weight: 800; color: #0284c7; }
            .recs { background: #f8fafc; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 4px; margin-bottom: 30px; }
            .recs ul { margin-left: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #e2e8f0; padding: 10px; font-size: 12px; text-align: left; }
            th { background: #f1f5f9; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1>AeroGuardian Airworthiness Certificate</h1>
              <div class="meta" style="margin-top: 5px;">Secure Flight Diagnostics & Edge Telemetry System</div>
            </div>
            <div class="meta" style="text-align: right;">
              Tail Number: <strong>N-787AG</strong><br>
              Date Generated: <strong>${new Date().toLocaleString()}</strong>
            </div>
          </div>
          
          <div class="score-panel">
            <div class="score-card">
              <div>Airframe Health Score</div>
              <div class="score-val">${state.telemetry.healthScore}%</div>
            </div>
            <div class="score-card">
              <div>Vibrations Exponents</div>
              <div class="score-val" style="color: #64748b;">${state.telemetry.vibration}g</div>
            </div>
            <div class="score-card">
              <div>Fault Margin</div>
              <div class="score-val" style="color: #64748b;">${state.telemetry.faultProbability}%</div>
            </div>
          </div>

          <div class="recs">
            <h3 style="margin-top: 0; color: #b45309;">Predictive System Diagnosis (${prediction.riskFactor.toUpperCase()} RISK)</h3>
            <p>AeroGuardian Agentic AI diagnostic sweeps indicate the following recommended maintenance routing:</p>
            <ul>
              ${prediction.recommendations.map(r => `<li>${r}</li>`).join('')}
            </ul>
          </div>

          <h3>Recent Flight Logs Telemetry Stream</h3>
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Health Score</th>
                <th>Engine Temp (°C)</th>
                <th>Fuel flow (%)</th>
                <th>Vibrations (g)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${state.telemetryHistory.slice(-5).map(h => `
                <tr>
                  <td>${h.timestamp}</td>
                  <td>${h.healthScore}%</td>
                  <td>${h.engineTemp}°C</td>
                  <td>${h.fuelEfficiency}%</td>
                  <td>${h.vibration}g</td>
                  <td>${h.status}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div style="margin-top: 50px; font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 10px;">
            AeroGuardian Cloud Infrastructure certification - Confirmed by Edge AI System
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    stateManager.addAlert('info', 'Reports', 'Airworthiness PDF certificate file created and sent to local printer spool.');
  });
}
