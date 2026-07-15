// About Page Module

export function render(container, state) {
  container.innerHTML = `
    <div class="page-container">
      <div style="margin-bottom: 3rem; text-align: center;">
        <h2 class="gradient-text" style="font-size: 2.5rem; margin-bottom: 0.5rem;">About AeroGuardian</h2>
        <p style="color: var(--text-secondary); max-width: 600px; margin: 0 auto;">
          An advanced avionics diagnostic framework combining localized machine intelligence with mathematical flight simulations.
        </p>
      </div>

      <div class="about-grid">
        <!-- Edge AI -->
        <div class="glass about-card">
          <div class="about-icon"><i class="fas fa-microchip"></i></div>
          <h3 class="neon-text">Edge AI Analytics</h3>
          <p style="color: var(--text-secondary); line-height: 1.6;">
            By running lightweight deep learning models directly on localized aircraft gateway processors, AeroGuardian processes high-frequency sensor streams (vibration, acoustics) directly at the source. This eliminates the latency of cloud links and allows rapid detection of anomalies like turbine blade flutter within 5ms.
          </p>
        </div>

        <!-- Digital Twin -->
        <div class="glass about-card">
          <div class="about-icon"><i class="fas fa-clone"></i></div>
          <h3 class="neon-text">Digital Twin Simulations</h3>
          <p style="color: var(--text-secondary); line-height: 1.6;">
            Every aircraft tail number corresponds to a high-fidelity virtual twin running in our secure simulation cloud. Real-time telemetry is continuously mirrored onto the twin, allowing our physics-informed neural network to forecast structural stresses, simulate hypothetical flight loads, and calculate individual component deterioration curves.
          </p>
        </div>

        <!-- Agentic AI -->
        <div class="glass about-card">
          <div class="about-icon"><i class="fas fa-brain"></i></div>
          <h3 class="neon-text">Agentic AI Decision Support</h3>
          <p style="color: var(--text-secondary); line-height: 1.6;">
            AeroGuardian doesn't just display chart data; it deploys active agents that make logical system determinations. Our agentic frameworks automatically cross-reference parts inventories, schedule maintenance slots at destinations, issue work orders, and recommend flight route alterations to avoid thermal stresses.
          </p>
        </div>

        <!-- Aircraft Safety Benefits -->
        <div class="glass about-card">
          <div class="about-icon"><i class="fas fa-shield-alt"></i></div>
          <h3 class="neon-text">Aviation Safety & Operations</h3>
          <p style="color: var(--text-secondary); line-height: 1.6;">
            By moving from reactive maintenance cycles to continuous health projections, AeroGuardian drives unexpected fleet groundings down by 35%. Flight crews are equipped with real-time risk index summaries, ensuring total situational awareness and preventing in-flight engine anomalies.
          </p>
        </div>
      </div>

      <!-- Innovation & Objectives Panel -->
      <div class="glass objectives-panel">
        <h3 class="gradient-text" style="font-size: 1.6rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.75rem;">
          Project Objectives & Core Metrics
        </h3>
        
        <ul class="objectives-list">
          <li>
            <i class="fas fa-check-circle"></i>
            <div>
              <strong>99.4% Critical Failure Prediction</strong>
              <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.25rem;">
                Accurately identify thermal anomalies and bearing wear up to 50 flight hours before structural violation occurs.
              </p>
            </div>
          </li>
          <li>
            <i class="fas fa-check-circle"></i>
            <div>
              <strong>Zero-Latency Edge Isolation</strong>
              <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.25rem;">
                Process vibrations exceeding critical bounds and notify flight decks regardless of satellite or network connectivity.
              </p>
            </div>
          </li>
          <li>
            <i class="fas fa-check-circle"></i>
            <div>
              <strong>Automated Logistics Routing</strong>
              <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.25rem;">
                Directly connect critical engine anomalies with maintenance bays and parts inventories at airport terminals automatically.
              </p>
            </div>
          </li>
          <li>
            <i class="fas fa-check-circle"></i>
            <div>
              <strong>35% Reduction in AOG (Aircraft on Ground)</strong>
              <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.25rem;">
                Minimize scheduling disruptions and unscheduled flight delays by executing quick component changeouts.
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  `;
}
