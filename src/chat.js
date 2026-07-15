// AI Chat Assistant Logic for AeroGuardian
// Processes conversational messages and answers questions using current telemetry state

import { stateManager } from './state.js';

class ChatAssistant {
  constructor() {
    this.messages = [
      { sender: 'ai', text: 'Welcome to AeroGuardian secure console. I am your Agentic Copilot. How can I assist with aircraft health monitoring today?', timestamp: new Date().toLocaleTimeString() }
    ];
    this.listeners = [];
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  notify() {
    this.listeners.forEach(cb => cb(this.messages));
  }

  sendMessage(text) {
    if (!text.trim()) return;

    const userMsg = {
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString()
    };

    this.messages.push(userMsg);
    this.notify();

    // Trigger AI response with a slight delay to simulate processing
    setTimeout(() => {
      const responseText = this.generateResponse(text);
      const aiMsg = {
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString()
      };
      this.messages.push(aiMsg);
      this.notify();
      
      // Also speak if voice synthesis is active
      if (stateManager.state.voiceActive && window.speechSynthesis) {
        const synthText = responseText.replace(/<[^>]*>/g, ''); // strip any formatting
        const utterance = new SpeechSynthesisUtterance(synthText);
        utterance.rate = 1.05;
        window.speechSynthesis.speak(utterance);
      }
    }, 800);
  }

  generateResponse(query) {
    const q = query.toLowerCase();
    const t = stateManager.state.telemetry;
    const comps = stateManager.state.components;
    
    // 1. Check for specific dashboard queries
    if (q.includes('engine') || q.includes('temp') || q.includes('heat') || q.includes('propulsion')) {
      return `Current Engine telemetry: <strong>${t.engineTemp}°C</strong> with vibration at <strong>${t.vibration}g</strong>. Status is <strong>${t.status}</strong>. Thermal sensors are synchronized. HP Turbine Blades life estimation: <strong>${comps.turbines.life}%</strong>.`;
    }

    if (q.includes('vibration') || q.includes('shake') || q.includes('oscillation')) {
      return `Vibration sensors report <strong>${t.vibration}g</strong> peak-to-peak. Maximum safety threshold is <strong>0.40g</strong>. Status: <strong>${t.vibration > 0.35 ? 'Warning: High structural excitation' : 'Nominal'}</strong>.`;
    }

    if (q.includes('health') || q.includes('score') || q.includes('status')) {
      return `AeroGuardian Fleet Health index is <strong>${t.healthScore}%</strong>. The airframe status is currently marked as <strong>${t.status}</strong>. Predictive failure margin: <strong>${t.faultProbability}%</strong>.`;
    }

    if (q.includes('predict') || q.includes('recommend') || q.includes('maintenance') || q.includes('failure') || q.includes('fault')) {
      const prediction = stateManager.predictHealth();
      let recs = prediction.recommendations.map(r => `<li>${r}</li>`).join('');
      return `<strong>AeroGuardian AI Prediction Engine Report:</strong><br>
              • Risk Level: <strong>${prediction.riskFactor}</strong><br>
              • Estimated Time-to-Failure (TTF): <strong>${prediction.ttfDays} flight hours</strong><br>
              • Critical Recommendations:<br>
              <ul style="margin-left: 15px; margin-top: 5px;">${recs}</ul>`;
    }

    // 2. Explanations of Technologies
    if (q.includes('edge ai') || q.includes('edge')) {
      return `<strong>Edge AI</strong> enables AeroGuardian to run neural networks locally on the aircraft's gateway processors. By analyzing sensor telemetry at the source, we isolate anomalies (like micro-vibrations) within 5ms without needing an active satellite cloud link.`;
    }

    if (q.includes('digital twin') || q.includes('twin')) {
      return `A <strong>Digital Twin</strong> is a real-time mathematical replica of the physical aircraft. AeroGuardian feeds real sensor streams into this virtual model to simulate stress factors, estimate component wear, and predict failure configurations before they occur on the airframe.`;
    }

    if (q.includes('agentic ai') || q.includes('agent')) {
      return `<strong>Agentic AI</strong> refers to autonomous software agents that don't just alert engineers—they take actions. AeroGuardian's agent can auto-schedule repairs, dispatch parts to the next hub, export reports, and adjust routes to avoid turbulence and extreme temperatures.`;
    }

    if (q.includes('roi') || q.includes('cost') || q.includes('saving') || q.includes('money')) {
      const roi = stateManager.state.roiCalculator;
      const annualDowntimeCost = roi.fleetSize * roi.downtimeIncidents * roi.costPerHour * 4; // average 4 hours per incident
      const savings = Math.round(annualDowntimeCost * 0.35); // 35% reduction
      return `Based on your fleet configuration (<strong>${roi.fleetSize}</strong> aircraft, average <strong>${roi.downtimeIncidents}</strong> incidents/year, costing <strong>$${roi.costPerHour.toLocaleString()}/hour</strong>), AeroGuardian's Predictive Maintenance saves approximately <strong>$${savings.toLocaleString()} annually</strong> (representing a 35% reduction in unscheduled downtime).`;
    }

    // 3. Fallbacks
    if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
      return `Hello! Flight Engineer. Systems are online. You can ask me about "engine health", "predictive maintenance", "savings ROI", "digital twin synchronization", or type voice commands directly.`;
    }

    if (q.includes('help') || q.includes('command')) {
      return `You can prompt me with queries like:<br>
              - <em>"Explain digital twin technology"</em><br>
              - <em>"What is the engine temperature?"</em><br>
              - <em>"Give me maintenance recommendations"</em><br>
              - <em>"Show ROI cost savings"</em><br>
              - <em>"Show dashboard"</em> (moves navigation)`;
    }

    return `I've analyzed your query regarding "${query}". Under secure Flight Safety guidelines, I recommend reviewing the active <strong>Digital Twin Page</strong> or running a <strong>Predictive Diagnostics sweep</strong>. Let me know if you want me to navigate there.`;
  }
}

export const chatAssistant = new ChatAssistant();
