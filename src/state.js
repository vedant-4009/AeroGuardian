// State Management for AeroGuardian
// Handles authentication, live sensor simulation, CSV uploading, alerts, and prediction engine.

const DEFAULT_COMPONENTS = {
  turbines: { name: 'HP Turbine Blades', life: 92, rate: 0.02, status: 'Healthy' },
  landingGear: { name: 'Main Landing Gear Actuator', life: 87, rate: 0.01, status: 'Healthy' },
  avionics: { name: 'Avionics Central Processor', life: 99, rate: 0.005, status: 'Healthy' },
  fuelSystem: { name: 'High-Pressure Fuel Pump', life: 74, rate: 0.03, status: 'Warning' }
};

class StateManager {
  constructor() {
    this.listeners = [];
    this.state = {
      user: null,
      activeView: 'home',
      theme: localStorage.getItem('ag-theme') || 'dark',
      telemetry: {
        healthScore: 94,
        engineTemp: 612,
        fuelEfficiency: 95.8,
        vibration: 0.22,
        faultProbability: 4,
        status: 'Healthy',
        timestamp: new Date().toLocaleTimeString()
      },
      telemetryHistory: [],
      components: { ...DEFAULT_COMPONENTS },
      alerts: [
        { id: 1, type: 'warning', component: 'Fuel System', message: 'High-Pressure Fuel Pump showing anomalous pressure oscillation.', timestamp: new Date(Date.now() - 3600000).toLocaleTimeString(), read: false },
        { id: 2, type: 'info', component: 'Avionics', message: 'System boot diagnostics clean. Avionics sync complete.', timestamp: new Date(Date.now() - 7200000).toLocaleTimeString(), read: true }
      ],
      roiCalculator: {
        fleetSize: 15,
        downtimeIncidents: 8,
        costPerHour: 12000
      },
      voiceActive: false
    };

    // Prepopulate history
    this.initHistory();
    this.startSimulation();
    this.loadUserFromStorage();
  }

  // Subscribe to state changes
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  notify() {
    this.listeners.forEach(callback => callback(this.state));
  }

  setState(updates) {
    this.state = { ...this.state, ...updates };
    this.notify();
  }

  initHistory() {
    let now = Date.now();
    for (let i = 19; i >= 0; i--) {
      const time = new Date(now - i * 5000);
      const randFactor = Math.sin(i / 3) * 5 + (Math.random() - 0.5) * 4;
      this.state.telemetryHistory.push({
        healthScore: Math.round(94 + randFactor / 3),
        engineTemp: Math.round(610 + randFactor * 2),
        fuelEfficiency: parseFloat((95.5 + randFactor / 10).toFixed(1)),
        vibration: parseFloat((0.21 + randFactor / 50).toFixed(2)),
        faultProbability: Math.max(0, Math.round(4 - randFactor / 2)),
        status: 'Healthy',
        timestamp: time.toLocaleTimeString()
      });
    }
  }

  startSimulation() {
    setInterval(() => {
      const t = this.state.telemetry;
      const comps = { ...this.state.components };
      
      // Simulate slow degradation
      for (let key in comps) {
        comps[key].life = parseFloat((comps[key].life - comps[key].rate * (Math.random() * 1.5)).toFixed(3));
        if (comps[key].life <= 0) comps[key].life = 100; // Reset for loop simulation
        
        if (comps[key].life < 50) comps[key].status = 'Critical';
        else if (comps[key].life < 80) comps[key].status = 'Warning';
        else comps[key].status = 'Healthy';
      }

      // Dynamic fluctuations
      const tempDrift = Math.sin(Date.now() / 60000) * 15;
      const vibDrift = Math.cos(Date.now() / 30000) * 0.08;
      
      const nextTemp = Math.round(615 + tempDrift + (Math.random() - 0.5) * 6);
      const nextVib = parseFloat((0.23 + vibDrift + (Math.random() - 0.5) * 0.04).toFixed(2));
      const nextFuel = parseFloat((95.8 - Math.abs(vibDrift) * 2 + (Math.random() - 0.5) * 0.5).toFixed(1));
      
      // Compute status based on parameters
      let nextStatus = 'Healthy';
      let nextFault = 4;
      let scoreReduction = 0;

      if (nextTemp > 645) {
        nextStatus = 'Warning';
        nextFault += 20;
        scoreReduction += 12;
      }
      if (nextVib > 0.35) {
        nextStatus = 'Warning';
        nextFault += 15;
        scoreReduction += 10;
      }
      if (comps.fuelSystem.life < 73) {
        nextFault += 10;
        scoreReduction += 5;
      }

      if (nextTemp > 665 || nextVib > 0.42) {
        nextStatus = 'Critical';
        nextFault += 45;
        scoreReduction += 30;
      }

      const nextHealth = Math.max(10, 98 - scoreReduction - Math.round(Math.random() * 2));
      
      const newTelemetry = {
        healthScore: nextHealth,
        engineTemp: nextTemp,
        fuelEfficiency: nextFuel,
        vibration: nextVib,
        faultProbability: Math.min(99, nextFault),
        status: nextStatus,
        timestamp: new Date().toLocaleTimeString()
      };

      // Handle Warning alerts generation
      if (nextStatus === 'Warning' && t.status === 'Healthy') {
        this.addAlert('warning', 'Telemetry Drift', `Anomalous drift detected: Engine Temperature (${nextTemp}°C) and Vibrations (${nextVib}g) exceeding nominal levels.`);
      } else if (nextStatus === 'Critical' && t.status !== 'Critical') {
        this.addAlert('critical', 'Propulsion Unit', `CRITICAL Alert: Engine thermal threshold violated. Current reading: ${nextTemp}°C. Flight controller dispatching local telemetry.`);
      }

      const history = [...this.state.telemetryHistory.slice(1), newTelemetry];

      this.setState({
        telemetry: newTelemetry,
        telemetryHistory: history,
        components: comps
      });
    }, 4000); // 4 seconds ticks to feel live but not spam rendering
  }

  addAlert(type, component, message) {
    const newAlert = {
      id: Date.now(),
      type,
      component,
      message,
      timestamp: new Date().toLocaleTimeString(),
      read: false
    };
    
    // Play alert sound if audio context available
    this.playAlertSound(type);

    this.setState({
      alerts: [newAlert, ...this.state.alerts]
    });
  }

  playAlertSound(type) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = type === 'critical' ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(type === 'critical' ? 880 : 440, ctx.currentTime);
      
      if (type === 'critical') {
        // Double pulse
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.setValueAtTime(660, ctx.currentTime + 0.15);
      }

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      console.warn("Audio feedback not permitted or supported yet.", e);
    }
  }

  acknowledgeAlert(id) {
    const updated = this.state.alerts.map(a => a.id === id ? { ...a, read: true } : a);
    this.setState({ alerts: updated });
  }

  clearAlerts() {
    this.setState({ alerts: [] });
  }

  // Authentication Mock
  login(username, password) {
    if (username.trim() && password.trim()) {
      const user = {
        name: username,
        role: 'Chief Flight Engineer',
        airline: 'AeroGlobe Airways',
        avatar: 'CE',
        email: `${username.toLowerCase().replace(/\s/g, '')}@aeroglobe.com`
      };
      localStorage.setItem('ag-user', JSON.stringify(user));
      this.setState({ user });
      this.addAlert('info', 'Auth System', `User ${username} successfully authenticated as Flight Engineer.`);
      return true;
    }
    return false;
  }

  signup(username, email, password) {
    if (username.trim() && email.trim() && password.trim()) {
      const user = {
        name: username,
        role: 'Maintenance Inspector',
        airline: 'AeroGlobe Airways',
        avatar: username.substring(0,2).toUpperCase(),
        email: email
      };
      localStorage.setItem('ag-user', JSON.stringify(user));
      this.setState({ user });
      this.addAlert('info', 'Auth System', `New account registered for ${username}. Profile initialised.`);
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem('ag-user');
    this.setState({ user: null });
    this.addAlert('info', 'Auth System', 'Logged out from secure AeroGuardian session.');
  }

  loadUserFromStorage() {
    const userStr = localStorage.getItem('ag-user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.state.user = user;
      } catch (e) {
        localStorage.removeItem('ag-user');
      }
    }
  }

  // Upload CSV Telemetry
  processUploadedCSV(text) {
    try {
      const lines = text.split('\n');
      if (lines.length < 2) throw new Error("File empty or headers missing.");
      
      const parsedData = [];
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const cols = lines[i].split(',').map(c => c.trim());
        const entry = {};
        headers.forEach((h, index) => {
          entry[h] = cols[index];
        });
        parsedData.push(entry);
      }

      // Check validation
      if (parsedData.length > 0) {
        // Take the latest entry and push it into state as telemetry
        const latest = parsedData[parsedData.length - 1];
        const loadedTelemetry = {
          healthScore: Math.round(Number(latest.health || latest.healthscore || 90)),
          engineTemp: Math.round(Number(latest.temperature || latest.enginetemp || 620)),
          fuelEfficiency: parseFloat(Number(latest.fuel || latest.fuelefficiency || 95).toFixed(1)),
          vibration: parseFloat(Number(latest.vibration || latest.vibrations || 0.25).toFixed(2)),
          faultProbability: Math.round(Number(latest.fault || latest.faultprobability || 5)),
          status: latest.status || 'Healthy',
          timestamp: new Date().toLocaleTimeString()
        };

        // Append to history
        const newHistory = [...this.state.telemetryHistory.slice(1), loadedTelemetry];
        
        // Update components
        const updatedComps = { ...this.state.components };
        if (latest.turbines) updatedComps.turbines.life = Number(latest.turbines);
        if (latest.landinggear) updatedComps.landingGear.life = Number(latest.landinggear);
        if (latest.avionics) updatedComps.avionics.life = Number(latest.avionics);
        if (latest.fuelsystem) updatedComps.fuelSystem.life = Number(latest.fuelsystem);

        this.setState({
          telemetry: loadedTelemetry,
          telemetryHistory: newHistory,
          components: updatedComps
        });

        this.addAlert('info', 'Telemetry Processor', `Telemetry CSV file imported successfully. Parsed ${parsedData.length} records.`);
        return { success: true, count: parsedData.length };
      }
    } catch (e) {
      console.error(e);
      this.addAlert('critical', 'Telemetry Processor', `CSV Parsing failed: ${e.message}`);
      return { success: false, error: e.message };
    }
  }

  // ROI Cost calculation
  updateRoiParams(fleetSize, downtimeIncidents, costPerHour) {
    this.setState({
      roiCalculator: { fleetSize, downtimeIncidents, costPerHour }
    });
  }

  // Health Prediction Engine
  predictHealth() {
    const t = this.state.telemetry;
    const comps = this.state.components;
    
    // Core engine prediction rules
    let riskFactor = 'Low';
    let recommendations = ['Proceed with scheduled line checks.', 'Perform standard pre-flight sensory check.'];
    let ttfDays = 45; // Time to Failure standard

    const minCompLife = Math.min(comps.turbines.life, comps.landingGear.life, comps.avionics.life, comps.fuelSystem.life);
    
    if (t.healthScore < 80 || minCompLife < 75) {
      riskFactor = 'Moderate';
      ttfDays = Math.round(minCompLife / 2);
      recommendations = [
        'Initiate pre-emptive borescope inspection on fuel injectors.',
        'Schedule shop visit for Engine Group within 25 flight hours.',
        'Calibrate fuel valve actuator flow sensor.'
      ];
    }

    if (t.healthScore < 70 || t.engineTemp > 650 || minCompLife < 50) {
      riskFactor = 'High';
      ttfDays = Math.round(minCompLife / 4);
      recommendations = [
        'CRITICAL: Restrict flight operations to short-haul segments.',
        'Execute immediate engine vibration spectrum diagnostics.',
        'Replace High-Pressure Fuel Pump assembly at next hub stop.',
        'AeroGuardian Agentic AI suggests swapping tail routes to avoid high-temperature routes.'
      ];
    }

    return {
      riskFactor,
      ttfDays,
      recommendations,
      score: t.healthScore,
      updatedAt: t.timestamp
    };
  }

  toggleTheme() {
    const nextTheme = this.state.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('ag-theme', nextTheme);
    this.setState({ theme: nextTheme });
  }
}

export const stateManager = new StateManager();
