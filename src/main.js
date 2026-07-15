// Core Bootstrapper & Router for AeroGuardian Single Page Application

import './index.css';
import { stateManager } from './state.js';
import { voiceProcessor } from './voice.js';
import { chatAssistant } from './chat.js';

// Import Page Renderers
import * as HomeView from './pages/home.js';
import * as AboutView from './pages/about.js';
import * as FeaturesView from './pages/features.js';
import * as DashboardView from './pages/dashboard.js';
import * as TwinView from './pages/twin.js';
import * as ReportsView from './pages/reports.js';
import * as AlertsView from './pages/alerts.js';
import * as CostView from './pages/cost.js';
import * as ContactView from './pages/contact.js';

const viewMap = {
  home: HomeView,
  about: AboutView,
  features: FeaturesView,
  dashboard: DashboardView,
  twin: TwinView,
  reports: ReportsView,
  alerts: AlertsView,
  cost: CostView,
  contact: ContactView
};

// Expose state globally for event listener hooks inside rendered components
window.appState = stateManager;

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  const viewport = document.getElementById('content-viewport');
  const themeToggle = document.getElementById('theme-toggle');
  const voiceToggle = document.getElementById('voice-toggle');
  const chatBubble = document.getElementById('chat-bubble-trigger');
  const chatPanel = document.getElementById('chat-panel');
  const chatClose = document.getElementById('chat-close');
  const chatSendBtn = document.getElementById('chat-send-btn');
  const chatInput = document.getElementById('chat-input');
  const chatMessages = document.getElementById('chat-messages');
  
  // Auth Elements
  const authBadge = document.getElementById('auth-profile-badge');
  const loginModal = document.getElementById('login-modal');
  const loginForm = document.getElementById('login-form');
  const signupLink = document.getElementById('signup-link');
  const loginLink = document.getElementById('login-link');
  const authTitle = document.getElementById('auth-title');
  const authSubmitBtn = document.getElementById('auth-submit-btn');
  let isSignupMode = false;

  // Demo Elements
  const demoModal = document.getElementById('demo-modal');
  const demoForm = document.getElementById('demo-form');

  // Sidebar Links
  const navItems = document.querySelectorAll('.nav-item');

  // 1. Core State Synchronization Loop
  stateManager.subscribe((state) => {
    // A. Sync Theme on root HTML element
    document.documentElement.setAttribute('data-theme', state.theme);
    themeToggle.innerHTML = state.theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';

    // B. Sync Voice mic state
    if (state.voiceActive) {
      voiceToggle.innerHTML = '<i class="fas fa-microphone" style="color: var(--critical);"></i>';
      voiceToggle.classList.add('pulse-warning');
    } else {
      voiceToggle.innerHTML = '<i class="fas fa-microphone-slash"></i>';
      voiceToggle.classList.remove('pulse-warning');
    }

    // C. Sync Notification badge
    const unreadAlerts = state.alerts.filter(a => !a.read).length;
    const badge = document.getElementById('notification-badge');
    if (unreadAlerts > 0) {
      badge.style.display = 'flex';
      badge.textContent = unreadAlerts;
    } else {
      badge.style.display = 'none';
    }

    // D. Sync Global System status caps indicator
    const statusCaps = document.getElementById('system-status-capsule');
    statusCaps.className = `status-capsule ${state.telemetry.status.toLowerCase()}`;
    statusCaps.innerHTML = `<span class="pulse-dot"></span> Sys: ${state.telemetry.status}`;

    // E. Sync Navigation Active status
    navItems.forEach(item => {
      if (item.getAttribute('data-view') === state.activeView) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // F. Sync User profile elements
    const avatar = document.getElementById('profile-avatar-lbl');
    const nameLbl = document.getElementById('profile-name-lbl');
    if (state.user) {
      avatar.textContent = state.user.avatar;
      nameLbl.textContent = state.user.name;
    } else {
      avatar.textContent = '?';
      nameLbl.textContent = 'Guest Engineer';
    }

    // G. Render dynamic view page content
    const renderer = viewMap[state.activeView];
    if (renderer && viewport) {
      renderer.render(viewport, state);
    }
  });

  // 2. Navigation Click Events
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const view = item.getAttribute('data-view');
      stateManager.setState({ activeView: view });
    });
  });

  // Bell icon navigates to Alerts Page
  document.getElementById('alerts-bell-btn').addEventListener('click', () => {
    stateManager.setState({ activeView: 'alerts' });
  });

  // 3. Theme Toggle event
  themeToggle.addEventListener('click', () => {
    stateManager.toggleTheme();
  });

  // 4. Voice Mic click activation
  voiceToggle.addEventListener('click', () => {
    voiceProcessor.toggleListening();
  });

  // 5. Chat Panel Operations
  chatBubble.addEventListener('click', () => {
    chatPanel.classList.toggle('active');
  });

  chatClose.addEventListener('click', () => {
    chatPanel.classList.remove('active');
  });

  const sendChatMessage = () => {
    const text = chatInput.value;
    if (!text.trim()) return;
    
    // Send user message
    chatAssistant.sendMessage(text);
    chatInput.value = '';
  };

  chatSendBtn.addEventListener('click', sendChatMessage);
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      sendChatMessage();
    }
  });

  // Chat message subscriber to re-render bubbles
  chatAssistant.subscribe((messages) => {
    chatMessages.innerHTML = messages.map(msg => `
      <div class="chat-bubble ${msg.sender}">
        ${msg.text}
        <div style="font-size: 0.65rem; opacity: 0.6; text-align: right; margin-top: 4px;">${msg.timestamp}</div>
      </div>
    `).join('');
    // Auto Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
  });

  // 6. User Profile Authentication Dialogs
  authBadge.addEventListener('click', () => {
    if (stateManager.state.user) {
      // User is logged in, clicking logs them out
      if (confirm('Do you want to sign out of the secure flight diagnostics session?')) {
        stateManager.logout();
      }
    } else {
      // Show login dialog
      loginModal.classList.add('active');
    }
  });

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const userVal = document.getElementById('login-username').value;
    const emailVal = document.getElementById('login-email-input').value;
    const passVal = document.getElementById('login-password').value;

    if (isSignupMode) {
      stateManager.signup(userVal, emailVal, passVal);
    } else {
      stateManager.login(userVal, passVal);
    }

    loginForm.reset();
    loginModal.classList.remove('active');
  });

  signupLink.addEventListener('click', (e) => {
    e.preventDefault();
    isSignupMode = true;
    authTitle.textContent = 'AeroGuardian Registry';
    document.getElementById('email-form-group').style.display = 'block';
    document.getElementById('login-email-input').setAttribute('required', 'required');
    authSubmitBtn.textContent = 'Register Credentials';
    signupLink.parentNode.style.display = 'none';
    loginLink.parentNode.style.display = 'block';
  });

  loginLink.addEventListener('click', (e) => {
    e.preventDefault();
    isSignupMode = false;
    authTitle.textContent = 'Avionics Authentication';
    document.getElementById('email-form-group').style.display = 'none';
    document.getElementById('login-email-input').removeAttribute('required');
    authSubmitBtn.textContent = 'Validate Token';
    signupLink.parentNode.style.display = 'block';
    loginLink.parentNode.style.display = 'none';
  });

  // Close modals clicking outside or close buttons
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      loginModal.classList.remove('active');
      demoModal.classList.remove('active');
    });
  });

  window.addEventListener('click', (e) => {
    if (e.target === loginModal) loginModal.classList.remove('active');
    if (e.target === demoModal) demoModal.classList.remove('active');
  });

  // Demo Submission
  demoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('AeroGuardian integration request queued! Our flight intelligence engineers will contact your operations team within 2 hours.');
    demoForm.reset();
    demoModal.classList.remove('active');
  });

  // Trigger state initialization trigger (forces first render)
  stateManager.setState({});
}
