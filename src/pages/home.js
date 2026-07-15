// Home Page Module

export function render(container, state) {
  container.innerHTML = `
    <div class="page-container">
      <div class="hero-section">
        <div>
          <div class="hero-tag">
            <i class="fas fa-satellite-dish"></i> Next-Gen Aircraft Intelligence
          </div>
          <h1 class="hero-title gradient-text">
            Predict Aircraft Failures <br>
            <span class="neon-text">Before They Happen</span>
          </h1>
          <p class="hero-subtitle">
            AeroGuardian combines Edge AI, Digital Twin Technology, and Agentic AI to monitor aircraft health in real time, reduce maintenance downtime, and improve global flight safety standards.
          </p>
          <div class="hero-actions">
            <button class="btn-primary" id="hero-demo-btn">
              <i class="fas fa-paper-plane"></i> Request Demo
            </button>
            <button class="btn-secondary" id="hero-dashboard-btn">
              <i class="fas fa-chart-line"></i> View Dashboard
            </button>
          </div>
          
          <div class="tech-badges-strip">
            <span class="tech-badge"><i class="fas fa-microchip"></i> Edge AI Analytics</span>
            <span class="tech-badge"><i class="fas fa-clone"></i> Digital Twin Dynamics</span>
            <span class="tech-badge"><i class="fas fa-brain"></i> Agentic AI Copilot</span>
            <span class="tech-badge"><i class="fas fa-wifi"></i> IoT Sensor Mesh</span>
            <span class="tech-badge"><i class="fas fa-shield-alt"></i> Predictive Safety</span>
          </div>
        </div>
        
        <div class="hero-viz-container">
          <!-- Glowing high-tech wireframe SVG aircraft -->
          <svg class="aircraft-wireframe" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="plane-glow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#00f2fe" />
                <stop offset="100%" stop-color="#0066ff" />
              </linearGradient>
              <filter id="glow-effect" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            
            <!-- Radar concentric circles -->
            <circle cx="250" cy="250" r="180" stroke="rgba(0, 242, 254, 0.08)" stroke-width="1.5" stroke-dasharray="5 5" />
            <circle cx="250" cy="250" r="120" stroke="rgba(0, 242, 254, 0.05)" stroke-width="1" />
            <circle cx="250" cy="250" r="60" stroke="rgba(0, 242, 254, 0.03)" stroke-width="1" />
            
            <!-- Radar sweep lines -->
            <line x1="250" y1="20" x2="250" y2="480" stroke="rgba(0, 242, 254, 0.05)" stroke-width="0.8" />
            <line x1="20" y1="250" x2="480" y2="250" stroke="rgba(0, 242, 254, 0.05)" stroke-width="0.8" />

            <!-- Dynamic Rotating Scanner Grid -->
            <g transform="rotate(45 250 250)">
              <circle cx="250" cy="250" r="210" stroke="rgba(0, 242, 254, 0.1)" stroke-width="1.5" stroke-dasharray="100 20" />
            </g>

            <!-- Detailed Isometric Jet Wireframe -->
            <g filter="url(#glow-effect)" stroke="url(#plane-glow)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <!-- Fuselage main structure -->
              <path d="M250 80 L260 210 L257 410 L250 430 L243 410 L240 210 Z" />
              <!-- Cockpit window lines -->
              <path d="M246 120 L250 110 L254 120 Z" />
              <path d="M242 135 L250 128 L258 135 Z" />
              
              <!-- Left Wing -->
              <path d="M240 210 L80 320 L75 330 L110 330 L243 270" />
              <!-- Right Wing -->
              <path d="M260 210 L420 320 L425 330 L390 330 L257 270" />
              
              <!-- Tail wings (Horizontal stabilizers) -->
              <path d="M244 380 L180 415 L178 420 L198 420 L244 402" />
              <path d="M256 380 L320 415 L322 420 L302 420 L256 402" />
              
              <!-- Vertical stabilizer -->
              <path d="M250 370 L250 415 L247 425 L250 422 L253 425 L250 415" stroke-width="2" />
              
              <!-- Left Engine -->
              <rect x="155" y="240" width="16" height="42" rx="8" fill="var(--bg-primary)" stroke-width="1.5" />
              <path d="M155 261 H171" stroke-width="1" />
              <!-- Right Engine -->
              <rect x="329" y="240" width="16" height="42" rx="8" fill="var(--bg-primary)" stroke-width="1.5" />
              <path d="M329 261 H345" stroke-width="1" />
            </g>

            <!-- Sensor Telemetry Nodes -->
            <g>
              <!-- Left engine node -->
              <circle cx="163" cy="261" r="5" fill="#ffb300" filter="url(#glow-effect)" />
              <line x1="163" y1="261" x2="110" y2="230" stroke="rgba(255,179,0,0.6)" stroke-width="1" />
              <text x="50" y="222" fill="#ffb300" font-family="Orbitron" font-size="10">ENG_1: T_ALRT</text>

              <!-- Nose Avionics Node -->
              <circle cx="250" cy="90" r="5" fill="#00e676" filter="url(#glow-effect)" />
              <line x1="250" y1="90" x2="350" y2="60" stroke="rgba(0,230,118,0.6)" stroke-width="1" />
              <text x="355" y="60" fill="#00e676" font-family="Orbitron" font-size="10">AVIONICS_OK</text>

              <!-- Fuel system node -->
              <circle cx="250" cy="300" r="5" fill="#00f2fe" filter="url(#glow-effect)" />
              <line x1="250" y1="300" x2="360" y2="340" stroke="rgba(0,242,254,0.6)" stroke-width="1" />
              <text x="365" y="344" fill="#00f2fe" font-family="Orbitron" font-size="10">FUEL_SYS: SYNC</text>
            </g>
          </svg>
        </div>
      </div>
    </div>
  `;

  // Bind actions
  document.getElementById('hero-demo-btn').addEventListener('click', () => {
    // Dispatch demo request modal trigger
    const modal = document.getElementById('demo-modal');
    if (modal) modal.classList.add('active');
  });

  document.getElementById('hero-dashboard-btn').addEventListener('click', () => {
    // Direct navigate to dashboard
    window.appState.setState({ activeView: 'dashboard' });
  });
}
