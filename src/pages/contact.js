// Contact & Support Module

let activeHub = 'seattle';
const hubs = {
  seattle: { name: 'Seattle HQ (Americas)', address: '1200 Boeing Field Way, Seattle, WA 98108', phone: '+1 (206) 555-0142', email: 'us.support@aeroguardian.com' },
  london: { name: 'London Office (Europe)', address: '44 Terminal 5 Boulevard, Heathrow, London TW6 2GA', phone: '+44 (20) 7946 0192', email: 'eu.support@aeroguardian.com' },
  singapore: { name: 'Singapore Tech Hub (APAC)', address: '80 Changi Coast Road, Changi Airport 819830', phone: '+65 6789 0111', email: 'sg.support@aeroguardian.com' },
  dubai: { name: 'Dubai Station (MEA)', address: 'AeroCenter Floor 12, DAFZA, Dubai', phone: '+971 4 206 1234', email: 'me.support@aeroguardian.com' }
};

export function render(container, state) {
  const currentHub = hubs[activeHub];

  container.innerHTML = `
    <div class="page-container">
      <div style="margin-bottom: 2.5rem; text-align: center;">
        <h2 class="gradient-text" style="font-size: 2rem; margin-bottom: 0.25rem;">Contact Flight Support</h2>
        <p style="color: var(--text-secondary); font-size: 0.9rem;">
          Connect with our global aircraft safety engineering hubs and request custom integrations.
        </p>
      </div>

      <div class="contact-grid">
        <!-- Contact Form (Left) -->
        <div class="glass" style="padding: 2rem;">
          <h3 style="font-size: 1.15rem; margin-bottom: 1.5rem; color: var(--text-primary);"><i class="fas fa-envelope-open-text" style="color: var(--cyan-accent);"></i> Secure Communications Link</h3>
          
          <form id="contact-form" onsubmit="event.preventDefault();">
            <div class="form-group">
              <label for="contact-name">Full Name</label>
              <input type="text" id="contact-name" class="form-control" placeholder="Flight Operations Officer..." required />
            </div>

            <div class="form-group">
              <label for="contact-email">Corporate Email</label>
              <input type="email" id="contact-email" class="form-control" placeholder="officer@airline.com" required />
            </div>

            <div class="form-group">
              <label for="contact-subject">System Node / Subject</label>
              <select id="contact-subject" class="form-control">
                <option value="demo">Request System Demo Integration</option>
                <option value="integration">Avionics Sensor Hook Integration</option>
                <option value="billing">Enterprise SaaS Licensing Quote</option>
                <option value="support">Active Flight Incident Support</option>
              </select>
            </div>

            <div class="form-group">
              <label for="contact-message">Communication Details</label>
              <textarea id="contact-message" class="form-control" rows="4" placeholder="Detail your airframe specifications, fleet size, or integration requirements here..." required></textarea>
            </div>

            <button type="submit" class="btn-primary" style="width: 100%; justify-content: center; margin-top: 0.5rem;">
              <i class="fas fa-paper-plane"></i> Transmit Message
            </button>
          </form>
        </div>

        <!-- Global Map & Hub Addresses (Right) -->
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          <!-- SVG Map Representation -->
          <div class="glass" style="padding: 1.5rem;">
            <h3 style="font-size: 1.15rem; margin-bottom: 1rem; color: var(--text-primary);">
              <i class="fas fa-globe-americas" style="color: var(--cyan-accent);"></i> Global Support Hubs
            </h3>

            <div class="support-map-placeholder">
              <svg viewBox="0 0 400 220" fill="none" style="width: 100%; height: 100%;" xmlns="http://www.w3.org/2000/svg">
                <!-- Abstract world contours -->
                <rect width="400" height="220" fill="rgba(0,0,0,0.4)" />
                <path d="M40 70 Q70 60 90 70 T120 70 Q130 90 150 110 T170 140 L160 170 Q150 180 130 170 Z" fill="rgba(255,255,255,0.03)" />
                <path d="M180 50 Q210 40 230 50 T260 70 T280 100 Q270 120 280 140 T310 160 Z" fill="rgba(255,255,255,0.03)" />
                <path d="M260 110 Q280 120 300 110 T320 130 Q330 150 310 170 Z" fill="rgba(255,255,255,0.03)" />
                <path d="M70 110 Q90 120 80 140 T90 170 L70 180 Z" fill="rgba(255,255,255,0.03)" />

                <!-- Map Grid Lines -->
                <line x1="0" y1="110" x2="400" y2="110" stroke="rgba(255,255,255,0.04)" stroke-width="0.8" stroke-dasharray="2 2" />
                <line x1="200" y1="0" x2="200" y2="220" stroke="rgba(255,255,255,0.04)" stroke-width="0.8" stroke-dasharray="2 2" />

                <!-- Seattle Hub -->
                <circle cx="75" cy="65" r="${activeHub === 'seattle' ? 7 : 4}" fill="${activeHub === 'seattle' ? 'var(--cyan-accent)' : '#0066ff'}" class="map-hub" data-hub="seattle" style="cursor:pointer;" />
                <text x="60" y="52" fill="white" font-family="Orbitron" font-size="8">Seattle</text>

                <!-- London Hub -->
                <circle cx="185" cy="60" r="${activeHub === 'london' ? 7 : 4}" fill="${activeHub === 'london' ? 'var(--cyan-accent)' : '#0066ff'}" class="map-hub" data-hub="london" style="cursor:pointer;" />
                <text x="175" y="48" fill="white" font-family="Orbitron" font-size="8">London</text>

                <!-- Dubai Hub -->
                <circle cx="230" cy="95" r="${activeHub === 'dubai' ? 7 : 4}" fill="${activeHub === 'dubai' ? 'var(--cyan-accent)' : '#0066ff'}" class="map-hub" data-hub="dubai" style="cursor:pointer;" />
                <text x="235" y="93" fill="white" font-family="Orbitron" font-size="8">Dubai</text>

                <!-- Singapore Hub -->
                <circle cx="295" cy="130" r="${activeHub === 'singapore' ? 7 : 4}" fill="${activeHub === 'singapore' ? 'var(--cyan-accent)' : '#0066ff'}" class="map-hub" data-hub="singapore" style="cursor:pointer;" />
                <text x="302" y="128" fill="white" font-family="Orbitron" font-size="8">Singapore</text>
              </svg>
            </div>
            
            <div style="font-size: 0.75rem; color: var(--text-secondary); text-align: center; margin-top: 0.5rem;">
              Click dots on map to display hub location metrics.
            </div>
          </div>

          <!-- Hub Address Details -->
          <div class="glass" style="padding: 1.5rem; flex-grow: 1; display: flex; flex-direction: column; gap: 0.75rem;">
            <h4 style="color: var(--cyan-accent); font-size: 1.05rem;" id="hub-name">${currentHub.name}</h4>
            
            <div>
              <span style="font-size: 0.75rem; color: var(--text-secondary);"><i class="fas fa-map-marker-alt"></i> Address:</span>
              <div style="font-size: 0.85rem; font-weight: 500;" id="hub-address">${currentHub.address}</div>
            </div>

            <div>
              <span style="font-size: 0.75rem; color: var(--text-secondary);"><i class="fas fa-phone-alt"></i> Hotline support:</span>
              <div style="font-size: 0.85rem; font-weight: 500;" id="hub-phone">${currentHub.phone}</div>
            </div>

            <div>
              <span style="font-size: 0.75rem; color: var(--text-secondary);"><i class="fas fa-envelope"></i> Email dispatcher:</span>
              <div style="font-size: 0.85rem; font-weight: 500;" id="hub-email"><a href="mailto:${currentHub.email}" style="color:var(--cyan-accent); text-decoration:none;">${currentHub.email}</a></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Bind map hub selections
  const hubsElements = container.querySelectorAll('.map-hub');
  hubsElements.forEach(h => {
    h.addEventListener('click', () => {
      activeHub = h.getAttribute('data-hub');
      render(container, state);
    });
  });

  // Bind form submission response
  const form = document.getElementById('contact-form');
  form.addEventListener('submit', () => {
    const name = document.getElementById('contact-name').value;
    alert(`Transmission complete! Secure message sent. AeroGuardian Support has registered the docket under ID: ACT-${Math.round(Math.random()*89999)+10000}.`);
    form.reset();
  });
}
