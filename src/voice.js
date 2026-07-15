// Voice Command Processor for AeroGuardian
// Leverages Web Speech API with a robust textual CLI fallback

import { stateManager } from './state.js';

class VoiceProcessor {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.setupRecognition();
  }

  setupRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.isListening = true;
        stateManager.setState({ voiceActive: true });
        stateManager.addAlert('info', 'Voice Control', 'Voice command listener active. Try saying "show dashboard" or "check engines".');
      };

      this.recognition.onend = () => {
        this.isListening = false;
        stateManager.setState({ voiceActive: false });
      };

      this.recognition.onresult = (event) => {
        const resultIndex = event.resultIndex;
        const transcript = event.results[resultIndex][0].transcript.toLowerCase().trim();
        console.log('Voice Command Received:', transcript);
        this.executeCommand(transcript, true);
      };

      this.recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          stateManager.addAlert('warning', 'Voice Control', 'Microphone access denied. Falling back to Command Interface.');
        }
        this.isListening = false;
        stateManager.setState({ voiceActive: false });
      };
    }
  }

  toggleListening() {
    if (!this.recognition) {
      stateManager.addAlert('warning', 'Voice Control', 'Web Speech API is not supported in this browser. Please use the Command Terminal in the AI Chatbot.');
      return;
    }

    if (this.isListening) {
      this.recognition.stop();
    } else {
      try {
        this.recognition.start();
      } catch (e) {
        console.error(e);
      }
    }
  }

  executeCommand(text, fromVoice = false) {
    const cleanText = text.toLowerCase().trim();
    let actionTriggered = false;
    let feedback = '';

    const routes = {
      'home': ['home', 'go home', 'show home', 'main page', 'landing page'],
      'about': ['about', 'show about', 'go to about', 'about project', 'innovation'],
      'features': ['features', 'show features', 'go to features', 'capabilities'],
      'dashboard': ['dashboard', 'show dashboard', 'go to dashboard', 'analytics', 'telemetry'],
      'twin': ['twin', 'digital twin', 'show twin', 'go to twin', '3d model', 'aircraft model'],
      'reports': ['reports', 'show reports', 'go to reports', 'maintenance records', 'logs'],
      'alerts': ['alerts', 'show alerts', 'go to alerts', 'warnings', 'notifications'],
      'cost': ['cost', 'cost analysis', 'roi', 'roi calculator', 'savings'],
      'contact': ['contact', 'show contact', 'contact us', 'support']
    };

    // 1. Navigation Commands
    for (const [view, keywords] of Object.entries(routes)) {
      if (keywords.some(kw => cleanText.includes(kw))) {
        stateManager.setState({ activeView: view });
        feedback = `Navigating to ${view.charAt(0).toUpperCase() + view.slice(1)} view.`;
        actionTriggered = true;
        break;
      }
    }

    // 2. Action Commands
    if (!actionTriggered) {
      if (cleanText.includes('toggle theme') || cleanText.includes('dark mode') || cleanText.includes('light mode') || cleanText.includes('change theme')) {
        stateManager.toggleTheme();
        feedback = 'System appearance theme toggled.';
        actionTriggered = true;
      } else if (cleanText.includes('check engine') || cleanText.includes('engine status') || cleanText.includes('diagnose')) {
        stateManager.setState({ activeView: 'dashboard' });
        stateManager.addAlert('info', 'Diagnostics', 'Agentic AI Voice Trigger: Running turbine diagnostic sweep... All subsystems matching digital twin profiles.');
        feedback = 'Running engine diagnostics... Dashboard active.';
        actionTriggered = true;
      } else if (cleanText.includes('clear alert') || cleanText.includes('clear warnings')) {
        stateManager.clearAlerts();
        feedback = 'Clearing alert console logs.';
        actionTriggered = true;
      } else if (cleanText.includes('logout') || cleanText.includes('sign out')) {
        stateManager.logout();
        feedback = 'Logging out flight engineer.';
        actionTriggered = true;
      }
    }

    if (actionTriggered) {
      stateManager.addAlert('info', 'Voice Control', `${fromVoice ? 'Vocal Command' : 'Terminal Command'} Executed: "${text}". ${feedback}`);
      this.speakFeedback(feedback);
    } else {
      stateManager.addAlert('warning', 'Voice Control', `Command not recognized: "${text}". Try "show dashboard" or "check engines".`);
      this.speakFeedback("Command not recognized.");
    }
  }

  speakFeedback(text) {
    if (window.speechSynthesis) {
      // Speak back feedback
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.1;
      // Filter for a professional voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Natural') || v.lang.startsWith('en'));
      if (preferVoice) utterance.voice = preferVoice;
      
      window.speechSynthesis.speak(utterance);
    }
  }
}

export const voiceProcessor = new VoiceProcessor();
