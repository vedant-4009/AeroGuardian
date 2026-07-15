(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))r(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const n of i.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&r(n)}).observe(document,{childList:!0,subtree:!0});function e(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(a){if(a.ep)return;a.ep=!0;const i=e(a);fetch(a.href,i)}})();const j={turbines:{name:"HP Turbine Blades",life:92,rate:.02,status:"Healthy"},landingGear:{name:"Main Landing Gear Actuator",life:87,rate:.01,status:"Healthy"},avionics:{name:"Avionics Central Processor",life:99,rate:.005,status:"Healthy"},fuelSystem:{name:"High-Pressure Fuel Pump",life:74,rate:.03,status:"Warning"}};class N{constructor(){this.listeners=[],this.state={user:null,activeView:"home",theme:localStorage.getItem("ag-theme")||"dark",telemetry:{healthScore:94,engineTemp:612,fuelEfficiency:95.8,vibration:.22,faultProbability:4,status:"Healthy",timestamp:new Date().toLocaleTimeString()},telemetryHistory:[],components:{...j},alerts:[{id:1,type:"warning",component:"Fuel System",message:"High-Pressure Fuel Pump showing anomalous pressure oscillation.",timestamp:new Date(Date.now()-36e5).toLocaleTimeString(),read:!1},{id:2,type:"info",component:"Avionics",message:"System boot diagnostics clean. Avionics sync complete.",timestamp:new Date(Date.now()-72e5).toLocaleTimeString(),read:!0}],roiCalculator:{fleetSize:15,downtimeIncidents:8,costPerHour:12e3},voiceActive:!1},this.initHistory(),this.startSimulation(),this.loadUserFromStorage()}subscribe(t){return this.listeners.push(t),()=>{this.listeners=this.listeners.filter(e=>e!==t)}}notify(){this.listeners.forEach(t=>t(this.state))}setState(t){this.state={...this.state,...t},this.notify()}initHistory(){let t=Date.now();for(let e=19;e>=0;e--){const r=new Date(t-e*5e3),a=Math.sin(e/3)*5+(Math.random()-.5)*4;this.state.telemetryHistory.push({healthScore:Math.round(94+a/3),engineTemp:Math.round(610+a*2),fuelEfficiency:parseFloat((95.5+a/10).toFixed(1)),vibration:parseFloat((.21+a/50).toFixed(2)),faultProbability:Math.max(0,Math.round(4-a/2)),status:"Healthy",timestamp:r.toLocaleTimeString()})}}startSimulation(){setInterval(()=>{const t=this.state.telemetry,e={...this.state.components};for(let c in e)e[c].life=parseFloat((e[c].life-e[c].rate*(Math.random()*1.5)).toFixed(3)),e[c].life<=0&&(e[c].life=100),e[c].life<50?e[c].status="Critical":e[c].life<80?e[c].status="Warning":e[c].status="Healthy";const r=Math.sin(Date.now()/6e4)*15,a=Math.cos(Date.now()/3e4)*.08,i=Math.round(615+r+(Math.random()-.5)*6),n=parseFloat((.23+a+(Math.random()-.5)*.04).toFixed(2)),s=parseFloat((95.8-Math.abs(a)*2+(Math.random()-.5)*.5).toFixed(1));let o="Healthy",d=4,u=0;i>645&&(o="Warning",d+=20,u+=12),n>.35&&(o="Warning",d+=15,u+=10),e.fuelSystem.life<73&&(d+=10,u+=5),(i>665||n>.42)&&(o="Critical",d+=45,u+=30);const h={healthScore:Math.max(10,98-u-Math.round(Math.random()*2)),engineTemp:i,fuelEfficiency:s,vibration:n,faultProbability:Math.min(99,d),status:o,timestamp:new Date().toLocaleTimeString()};o==="Warning"&&t.status==="Healthy"?this.addAlert("warning","Telemetry Drift",`Anomalous drift detected: Engine Temperature (${i}°C) and Vibrations (${n}g) exceeding nominal levels.`):o==="Critical"&&t.status!=="Critical"&&this.addAlert("critical","Propulsion Unit",`CRITICAL Alert: Engine thermal threshold violated. Current reading: ${i}°C. Flight controller dispatching local telemetry.`);const v=[...this.state.telemetryHistory.slice(1),h];this.setState({telemetry:h,telemetryHistory:v,components:e})},4e3)}addAlert(t,e,r){const a={id:Date.now(),type:t,component:e,message:r,timestamp:new Date().toLocaleTimeString(),read:!1};this.playAlertSound(t),this.setState({alerts:[a,...this.state.alerts]})}playAlertSound(t){try{const e=window.AudioContext||window.webkitAudioContext;if(!e)return;const r=new e,a=r.createOscillator(),i=r.createGain();a.type=t==="critical"?"sawtooth":"sine",a.frequency.setValueAtTime(t==="critical"?880:440,r.currentTime),t==="critical"&&(a.frequency.setValueAtTime(880,r.currentTime),a.frequency.setValueAtTime(660,r.currentTime+.15)),i.gain.setValueAtTime(.08,r.currentTime),i.gain.exponentialRampToValueAtTime(.01,r.currentTime+.3),a.connect(i),i.connect(r.destination),a.start(),a.stop(r.currentTime+.3)}catch(e){console.warn("Audio feedback not permitted or supported yet.",e)}}acknowledgeAlert(t){const e=this.state.alerts.map(r=>r.id===t?{...r,read:!0}:r);this.setState({alerts:e})}clearAlerts(){this.setState({alerts:[]})}login(t,e){if(t.trim()&&e.trim()){const r={name:t,role:"Chief Flight Engineer",airline:"AeroGlobe Airways",avatar:"CE",email:`${t.toLowerCase().replace(/\s/g,"")}@aeroglobe.com`};return localStorage.setItem("ag-user",JSON.stringify(r)),this.setState({user:r}),this.addAlert("info","Auth System",`User ${t} successfully authenticated as Flight Engineer.`),!0}return!1}signup(t,e,r){if(t.trim()&&e.trim()&&r.trim()){const a={name:t,role:"Maintenance Inspector",airline:"AeroGlobe Airways",avatar:t.substring(0,2).toUpperCase(),email:e};return localStorage.setItem("ag-user",JSON.stringify(a)),this.setState({user:a}),this.addAlert("info","Auth System",`New account registered for ${t}. Profile initialised.`),!0}return!1}logout(){localStorage.removeItem("ag-user"),this.setState({user:null}),this.addAlert("info","Auth System","Logged out from secure AeroGuardian session.")}loadUserFromStorage(){const t=localStorage.getItem("ag-user");if(t)try{const e=JSON.parse(t);this.state.user=e}catch{localStorage.removeItem("ag-user")}}processUploadedCSV(t){try{const e=t.split(`
`);if(e.length<2)throw new Error("File empty or headers missing.");const r=[],a=e[0].split(",").map(i=>i.trim().toLowerCase());for(let i=1;i<e.length;i++){if(!e[i].trim())continue;const n=e[i].split(",").map(o=>o.trim()),s={};a.forEach((o,d)=>{s[o]=n[d]}),r.push(s)}if(r.length>0){const i=r[r.length-1],n={healthScore:Math.round(Number(i.health||i.healthscore||90)),engineTemp:Math.round(Number(i.temperature||i.enginetemp||620)),fuelEfficiency:parseFloat(Number(i.fuel||i.fuelefficiency||95).toFixed(1)),vibration:parseFloat(Number(i.vibration||i.vibrations||.25).toFixed(2)),faultProbability:Math.round(Number(i.fault||i.faultprobability||5)),status:i.status||"Healthy",timestamp:new Date().toLocaleTimeString()},s=[...this.state.telemetryHistory.slice(1),n],o={...this.state.components};return i.turbines&&(o.turbines.life=Number(i.turbines)),i.landinggear&&(o.landingGear.life=Number(i.landinggear)),i.avionics&&(o.avionics.life=Number(i.avionics)),i.fuelsystem&&(o.fuelSystem.life=Number(i.fuelsystem)),this.setState({telemetry:n,telemetryHistory:s,components:o}),this.addAlert("info","Telemetry Processor",`Telemetry CSV file imported successfully. Parsed ${r.length} records.`),{success:!0,count:r.length}}}catch(e){return console.error(e),this.addAlert("critical","Telemetry Processor",`CSV Parsing failed: ${e.message}`),{success:!1,error:e.message}}}updateRoiParams(t,e,r){this.setState({roiCalculator:{fleetSize:t,downtimeIncidents:e,costPerHour:r}})}predictHealth(){const t=this.state.telemetry,e=this.state.components;let r="Low",a=["Proceed with scheduled line checks.","Perform standard pre-flight sensory check."],i=45;const n=Math.min(e.turbines.life,e.landingGear.life,e.avionics.life,e.fuelSystem.life);return(t.healthScore<80||n<75)&&(r="Moderate",i=Math.round(n/2),a=["Initiate pre-emptive borescope inspection on fuel injectors.","Schedule shop visit for Engine Group within 25 flight hours.","Calibrate fuel valve actuator flow sensor."]),(t.healthScore<70||t.engineTemp>650||n<50)&&(r="High",i=Math.round(n/4),a=["CRITICAL: Restrict flight operations to short-haul segments.","Execute immediate engine vibration spectrum diagnostics.","Replace High-Pressure Fuel Pump assembly at next hub stop.","AeroGuardian Agentic AI suggests swapping tail routes to avoid high-temperature routes."]),{riskFactor:r,ttfDays:i,recommendations:a,score:t.healthScore,updatedAt:t.timestamp}}toggleTheme(){const t=this.state.theme==="dark"?"light":"dark";localStorage.setItem("ag-theme",t),this.setState({theme:t})}}const m=new N;class _{constructor(){this.recognition=null,this.isListening=!1,this.setupRecognition()}setupRecognition(){const t=window.SpeechRecognition||window.webkitSpeechRecognition;t&&(this.recognition=new t,this.recognition.continuous=!0,this.recognition.interimResults=!1,this.recognition.lang="en-US",this.recognition.onstart=()=>{this.isListening=!0,m.setState({voiceActive:!0}),m.addAlert("info","Voice Control",'Voice command listener active. Try saying "show dashboard" or "check engines".')},this.recognition.onend=()=>{this.isListening=!1,m.setState({voiceActive:!1})},this.recognition.onresult=e=>{const r=e.resultIndex,a=e.results[r][0].transcript.toLowerCase().trim();console.log("Voice Command Received:",a),this.executeCommand(a,!0)},this.recognition.onerror=e=>{console.error("Speech recognition error:",e.error),e.error==="not-allowed"&&m.addAlert("warning","Voice Control","Microphone access denied. Falling back to Command Interface."),this.isListening=!1,m.setState({voiceActive:!1})})}toggleListening(){if(!this.recognition){m.addAlert("warning","Voice Control","Web Speech API is not supported in this browser. Please use the Command Terminal in the AI Chatbot.");return}if(this.isListening)this.recognition.stop();else try{this.recognition.start()}catch(t){console.error(t)}}executeCommand(t,e=!1){const r=t.toLowerCase().trim();let a=!1,i="";const n={home:["home","go home","show home","main page","landing page"],about:["about","show about","go to about","about project","innovation"],features:["features","show features","go to features","capabilities"],dashboard:["dashboard","show dashboard","go to dashboard","analytics","telemetry"],twin:["twin","digital twin","show twin","go to twin","3d model","aircraft model"],reports:["reports","show reports","go to reports","maintenance records","logs"],alerts:["alerts","show alerts","go to alerts","warnings","notifications"],cost:["cost","cost analysis","roi","roi calculator","savings"],contact:["contact","show contact","contact us","support"]};for(const[s,o]of Object.entries(n))if(o.some(d=>r.includes(d))){m.setState({activeView:s}),i=`Navigating to ${s.charAt(0).toUpperCase()+s.slice(1)} view.`,a=!0;break}a||(r.includes("toggle theme")||r.includes("dark mode")||r.includes("light mode")||r.includes("change theme")?(m.toggleTheme(),i="System appearance theme toggled.",a=!0):r.includes("check engine")||r.includes("engine status")||r.includes("diagnose")?(m.setState({activeView:"dashboard"}),m.addAlert("info","Diagnostics","Agentic AI Voice Trigger: Running turbine diagnostic sweep... All subsystems matching digital twin profiles."),i="Running engine diagnostics... Dashboard active.",a=!0):r.includes("clear alert")||r.includes("clear warnings")?(m.clearAlerts(),i="Clearing alert console logs.",a=!0):(r.includes("logout")||r.includes("sign out"))&&(m.logout(),i="Logging out flight engineer.",a=!0)),a?(m.addAlert("info","Voice Control",`${e?"Vocal Command":"Terminal Command"} Executed: "${t}". ${i}`),this.speakFeedback(i)):(m.addAlert("warning","Voice Control",`Command not recognized: "${t}". Try "show dashboard" or "check engines".`),this.speakFeedback("Command not recognized."))}speakFeedback(t){if(window.speechSynthesis){const e=new SpeechSynthesisUtterance(t);e.rate=1,e.pitch=1.1;const a=window.speechSynthesis.getVoices().find(i=>i.name.includes("Google")||i.name.includes("Natural")||i.lang.startsWith("en"));a&&(e.voice=a),window.speechSynthesis.speak(e)}}}const W=new _;class U{constructor(){this.messages=[{sender:"ai",text:"Welcome to AeroGuardian secure console. I am your Agentic Copilot. How can I assist with aircraft health monitoring today?",timestamp:new Date().toLocaleTimeString()}],this.listeners=[]}subscribe(t){return this.listeners.push(t),()=>{this.listeners=this.listeners.filter(e=>e!==t)}}notify(){this.listeners.forEach(t=>t(this.messages))}sendMessage(t){if(!t.trim())return;const e={sender:"user",text:t,timestamp:new Date().toLocaleTimeString()};this.messages.push(e),this.notify(),setTimeout(()=>{const r=this.generateResponse(t),a={sender:"ai",text:r,timestamp:new Date().toLocaleTimeString()};if(this.messages.push(a),this.notify(),m.state.voiceActive&&window.speechSynthesis){const i=r.replace(/<[^>]*>/g,""),n=new SpeechSynthesisUtterance(i);n.rate=1.05,window.speechSynthesis.speak(n)}},800)}generateResponse(t){const e=t.toLowerCase(),r=m.state.telemetry,a=m.state.components;if(e.includes("engine")||e.includes("temp")||e.includes("heat")||e.includes("propulsion"))return`Current Engine telemetry: <strong>${r.engineTemp}°C</strong> with vibration at <strong>${r.vibration}g</strong>. Status is <strong>${r.status}</strong>. Thermal sensors are synchronized. HP Turbine Blades life estimation: <strong>${a.turbines.life}%</strong>.`;if(e.includes("vibration")||e.includes("shake")||e.includes("oscillation"))return`Vibration sensors report <strong>${r.vibration}g</strong> peak-to-peak. Maximum safety threshold is <strong>0.40g</strong>. Status: <strong>${r.vibration>.35?"Warning: High structural excitation":"Nominal"}</strong>.`;if(e.includes("health")||e.includes("score")||e.includes("status"))return`AeroGuardian Fleet Health index is <strong>${r.healthScore}%</strong>. The airframe status is currently marked as <strong>${r.status}</strong>. Predictive failure margin: <strong>${r.faultProbability}%</strong>.`;if(e.includes("predict")||e.includes("recommend")||e.includes("maintenance")||e.includes("failure")||e.includes("fault")){const i=m.predictHealth();let n=i.recommendations.map(s=>`<li>${s}</li>`).join("");return`<strong>AeroGuardian AI Prediction Engine Report:</strong><br>
              • Risk Level: <strong>${i.riskFactor}</strong><br>
              • Estimated Time-to-Failure (TTF): <strong>${i.ttfDays} flight hours</strong><br>
              • Critical Recommendations:<br>
              <ul style="margin-left: 15px; margin-top: 5px;">${n}</ul>`}if(e.includes("edge ai")||e.includes("edge"))return"<strong>Edge AI</strong> enables AeroGuardian to run neural networks locally on the aircraft's gateway processors. By analyzing sensor telemetry at the source, we isolate anomalies (like micro-vibrations) within 5ms without needing an active satellite cloud link.";if(e.includes("digital twin")||e.includes("twin"))return"A <strong>Digital Twin</strong> is a real-time mathematical replica of the physical aircraft. AeroGuardian feeds real sensor streams into this virtual model to simulate stress factors, estimate component wear, and predict failure configurations before they occur on the airframe.";if(e.includes("agentic ai")||e.includes("agent"))return"<strong>Agentic AI</strong> refers to autonomous software agents that don't just alert engineers—they take actions. AeroGuardian's agent can auto-schedule repairs, dispatch parts to the next hub, export reports, and adjust routes to avoid turbulence and extreme temperatures.";if(e.includes("roi")||e.includes("cost")||e.includes("saving")||e.includes("money")){const i=m.state.roiCalculator,n=i.fleetSize*i.downtimeIncidents*i.costPerHour*4,s=Math.round(n*.35);return`Based on your fleet configuration (<strong>${i.fleetSize}</strong> aircraft, average <strong>${i.downtimeIncidents}</strong> incidents/year, costing <strong>$${i.costPerHour.toLocaleString()}/hour</strong>), AeroGuardian's Predictive Maintenance saves approximately <strong>$${s.toLocaleString()} annually</strong> (representing a 35% reduction in unscheduled downtime).`}return e.includes("hello")||e.includes("hi")||e.includes("hey")?'Hello! Flight Engineer. Systems are online. You can ask me about "engine health", "predictive maintenance", "savings ROI", "digital twin synchronization", or type voice commands directly.':e.includes("help")||e.includes("command")?`You can prompt me with queries like:<br>
              - <em>"Explain digital twin technology"</em><br>
              - <em>"What is the engine temperature?"</em><br>
              - <em>"Give me maintenance recommendations"</em><br>
              - <em>"Show ROI cost savings"</em><br>
              - <em>"Show dashboard"</em> (moves navigation)`:`I've analyzed your query regarding "${t}". Under secure Flight Safety guidelines, I recommend reviewing the active <strong>Digital Twin Page</strong> or running a <strong>Predictive Diagnostics sweep</strong>. Let me know if you want me to navigate there.`}}const B=new U;function q(l,t){l.innerHTML=`
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
  `,document.getElementById("hero-demo-btn").addEventListener("click",()=>{const e=document.getElementById("demo-modal");e&&e.classList.add("active")}),document.getElementById("hero-dashboard-btn").addEventListener("click",()=>{window.appState.setState({activeView:"dashboard"})})}const Z=Object.freeze(Object.defineProperty({__proto__:null,render:q},Symbol.toStringTag,{value:"Module"}));function J(l,t){l.innerHTML=`
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
  `}const Q=Object.freeze(Object.defineProperty({__proto__:null,render:J},Symbol.toStringTag,{value:"Module"})),Y=[{icon:"fa-tv",title:"Real-Time Aircraft Monitoring",desc:"High-frequency telemetry ingestion mapping thousands of sensor parameters (temperature, pressure, vibration) per second onto state dashboards."},{icon:"fa-wrench",title:"Predictive Maintenance",desc:"Deep learning classifiers evaluate thermal decay and bearing wear profiles, forecasting maintenance windows up to 50 hours in advance."},{icon:"fa-cubes",title:"Digital Twin Simulation",desc:"Synthesise telemetry with mathematical computational fluid dynamics (CFD) model replicas to isolate airframe load stresses in real time."},{icon:"fa-microchip",title:"Edge AI Analytics",desc:"Lightweight models compiled for specialized edge processors run onboard diagnostic sweeps without relying on remote satellite communication."},{icon:"fa-brain",title:"Agentic AI Decision Support",desc:"Autonomous agent loops schedule servicing, reserve mechanical replacement parts, and calculate safe flight rerouting recommendations."},{icon:"fa-exclamation-triangle",title:"Fault Detection & Diagnostics",desc:"Multi-parameter correlation logic isolates transient anomalies and prevents false alarm cascades from individual faulty sensors."},{icon:"fa-chart-line",title:"Risk Assessment Matrices",desc:"Combines age metrics, current environmental temperatures, and history datasets to compute safety risk percentages for fleet lines."},{icon:"fa-calendar-alt",title:"Maintenance Scheduling",desc:"Generates optimal maintenance schedules to prevent aircraft downtime at major hubs and coordinates local mechanics."},{icon:"fa-server",title:"Fleet Health Management",desc:"Consolidated overview of overall airline health statistics, tail number status, fuel burn trends, and upcoming inspections."},{icon:"fa-file-pdf",title:"Automated Reporting",desc:"Generates thorough compliance documentation, telemetry logs, and maintenance logs available in PDF and Excel formats."}];function K(l,t){let e=Y.map(r=>`
    <div class="glass feature-card">
      <i class="fas ${r.icon}"></i>
      <h3 class="neon-text" style="font-size: 1.15rem; margin-top: 0.5rem; margin-bottom: 0.25rem;">${r.title}</h3>
      <p style="color: var(--text-secondary); font-size: 0.88rem; line-height: 1.5;">${r.desc}</p>
    </div>
  `).join("");l.innerHTML=`
    <div class="page-container">
      <div style="margin-bottom: 3rem; text-align: center;">
        <h2 class="gradient-text" style="font-size: 2.5rem; margin-bottom: 0.5rem;">System Features</h2>
        <p style="color: var(--text-secondary); max-width: 600px; margin: 0 auto;">
          An enterprise-grade SaaS technology suite for real-time diagnostics, structural twins, and autonomous scheduling.
        </p>
      </div>

      <div class="features-grid">
        ${e}
      </div>
    </div>
  `}const X=Object.freeze(Object.defineProperty({__proto__:null,render:K},Symbol.toStringTag,{value:"Module"}));function ee(l,t){const e=t.telemetry,r=t.components;l.innerHTML=`
    <div class="page-container">
      <div style="margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h2 class="gradient-text" style="font-size: 2rem;">Real-Time Diagnostic Panel</h2>
          <p style="color: var(--text-secondary); font-size: 0.9rem;">Tail Unit: <strong>N-787AG</strong> | Sync status: <strong>Aero-Synchronized</strong></p>
        </div>
        <div style="display: flex; gap: 0.75rem;">
          <div class="status-capsule ${e.status.toLowerCase()}">
            <span class="pulse-dot"></span> System Status: ${e.status}
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
            <div class="kpi-value ${e.engineTemp>645?"warning":""}" style="color: ${e.engineTemp>645?"var(--warning)":"var(--text-primary)"}">${e.engineTemp} °C</div>
            <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.25rem;">Nominal: 600-640°C</div>
          </div>
          <div class="kpi-icon"><i class="fas fa-thermometer-high"></i></div>
        </div>

        <div class="glass kpi-card">
          <div>
            <div style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 600; text-transform: uppercase;">Fuel Flow Efficiency</div>
            <div class="kpi-value" style="color: var(--success)">${e.fuelEfficiency}%</div>
            <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.25rem;">Target: >95.0%</div>
          </div>
          <div class="kpi-icon"><i class="fas fa-gas-pump"></i></div>
        </div>

        <div class="glass kpi-card">
          <div>
            <div style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 600; text-transform: uppercase;">Vibration Index</div>
            <div class="kpi-value ${e.vibration>.35?"critical":""}" style="color: ${e.vibration>.35?"var(--critical)":"var(--text-primary)"}">${e.vibration} g</div>
            <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.25rem;">Tolerance: 0.40g max</div>
          </div>
          <div class="kpi-icon"><i class="fas fa-wave-square"></i></div>
        </div>

        <div class="glass kpi-card">
          <div>
            <div style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 600; text-transform: uppercase;">Fault Probability</div>
            <div class="kpi-value" style="color: ${e.faultProbability>25?"var(--warning)":"var(--cyan-accent)"}">${e.faultProbability}%</div>
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
            
            ${Object.entries(r).map(([a,i])=>{const n=Math.round(i.life);let s="normal";return n<50?s="critical":n<80&&(s="warning"),`
                <div class="life-bar-item">
                  <div class="life-bar-header">
                    <span>${i.name}</span>
                    <span style="font-weight: 700; color: ${s==="critical"?"var(--critical)":s==="warning"?"var(--warning)":"var(--cyan-accent)"}">${n}% RUL</span>
                  </div>
                  <div class="progress-track">
                    <div class="progress-fill ${s}" style="width: ${n}%"></div>
                  </div>
                </div>
              `}).join("")}
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
                  stroke-dasharray="471.2" stroke-dashoffset="${471.2-471.2*e.healthScore/100}"
                  stroke="url(#gauge-gradient)"></circle>
                
                <defs>
                  <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#0066ff" />
                    <stop offset="100%" stop-color="#00f2fe" />
                  </linearGradient>
                </defs>
                
                <text class="gauge-text" x="90" y="95" text-anchor="middle">${e.healthScore}</text>
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
              ${t.alerts.slice(0,3).map(a=>`
                <div style="display: flex; gap: 0.5rem; font-size: 0.8rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">
                  <span style="color: ${a.type==="critical"?"var(--critical)":a.type==="warning"?"var(--warning)":"var(--blue-accent)"}">●</span>
                  <div>
                    <span style="font-weight: 600;">${a.component}</span>: ${a.message}
                    <div style="color: var(--text-secondary); font-size: 0.7rem; margin-top: 2px;">${a.timestamp}</div>
                  </div>
                </div>
              `).join("")}
            </div>
            <button class="btn-secondary" id="dash-view-alerts" style="width: 100%; padding: 0.4rem; font-size: 0.8rem; margin-top: 1rem;">
              View Alert Console
            </button>
          </div>
        </div>
      </div>
    </div>
  `,te(t.telemetryHistory),document.getElementById("trigger-sweep-btn").addEventListener("click",()=>{window.appState.addAlert("info","Calibrator","Self-recalibrating sensory telemetry offsets... Digital Twin synchronized successfully."),window.appState.setState({telemetry:{...window.appState.state.telemetry,healthScore:Math.min(98,window.appState.state.telemetry.healthScore+2),vibration:parseFloat((window.appState.state.telemetry.vibration*.9).toFixed(2)),engineTemp:Math.max(600,window.appState.state.telemetry.engineTemp-5)}})}),document.getElementById("dash-view-alerts").addEventListener("click",()=>{window.appState.setState({activeView:"alerts"})})}function te(l){const t=document.getElementById("telemetry-chart");if(!t)return;const e=t.getContext("2d"),r=t.getBoundingClientRect();t.width=r.width*window.devicePixelRatio,t.height=r.height*window.devicePixelRatio,e.scale(window.devicePixelRatio,window.devicePixelRatio);const a=r.width,i=r.height;e.clearRect(0,0,a,i),e.strokeStyle="rgba(255, 255, 255, 0.05)",e.lineWidth=1;for(let c=1;c<4;c++){const A=i/4*c;e.beginPath(),e.moveTo(0,A),e.lineTo(a,A),e.stroke()}if(l.length<2)return;const n=580,s=680,o=0,d=.6,u=c=>a/(l.length-1)*c,p=c=>i-(c-n)/(s-n)*(i-20)-10,h=c=>i-(c-o)/(d-o)*(i-20)-10,v=e.createLinearGradient(0,0,0,i);v.addColorStop(0,"rgba(0, 242, 254, 0.25)"),v.addColorStop(1,"rgba(0, 242, 254, 0.00)"),e.fillStyle=v,e.beginPath(),e.moveTo(u(0),i);for(let c=0;c<l.length;c++)e.lineTo(u(c),p(l[c].engineTemp));e.lineTo(u(l.length-1),i),e.closePath(),e.fill(),e.strokeStyle="#00f2fe",e.lineWidth=2.5,e.shadowColor="rgba(0, 242, 254, 0.5)",e.shadowBlur=8,e.beginPath(),e.moveTo(u(0),p(l[0].engineTemp));for(let c=1;c<l.length;c++)e.lineTo(u(c),p(l[c].engineTemp));e.stroke(),e.shadowBlur=0,e.strokeStyle="#9d4edd",e.lineWidth=1.5,e.beginPath(),e.moveTo(u(0),h(l[0].vibration));for(let c=1;c<l.length;c++)e.lineTo(u(c),h(l[c].vibration));e.stroke(),e.fillStyle="#00f2fe",e.font="10px Orbitron",e.fillText("TEMP LINE (°C)",10,20),e.fillStyle="#9d4edd",e.fillText("VIB LINE (g)",120,20)}const ie=Object.freeze(Object.defineProperty({__proto__:null,render:ee},Symbol.toStringTag,{value:"Module"}));let f="turbines",$=!1,w=0,C=null,x=[];function z(l,t){const e=t.components;t.telemetry;const r=()=>{const o=e[f];if(!o)return"";let d="var(--success)";return o.life<50?d="var(--critical)":o.life<80&&(d="var(--warning)"),`
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">
          <h4 style="font-size: 1.15rem; color: var(--cyan-accent);">${o.name}</h4>
          <span style="font-size: 0.75rem; padding: 0.25rem 0.5rem; background: rgba(0, 242, 254, 0.08); border: 1px solid var(--border-color); border-radius: 4px; font-family: 'Orbitron';">ID: ${f.toUpperCase()}_01</span>
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
            <div style="font-weight: 700; color: ${d}; font-size: 1.1rem; font-family: 'Orbitron';">${Math.round(o.life)}% RUL</div>
          </div>
          <div>
            <div style="color: var(--text-secondary); margin-bottom: 0.25rem;">Wear Classification:</div>
            <div style="font-weight: 600; color: ${d}">${o.status}</div>
          </div>
        </div>

        <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); padding: 0.75rem; border-radius: 6px; font-size: 0.8rem; line-height: 1.4; color: var(--text-secondary);">
          ${re(f)}
        </div>

        <!-- Simulation Run Panel -->
        <div style="border-top: 1px solid var(--border-color); padding-top: 1rem; margin-top: 0.5rem;">
          <h4 style="font-size: 0.95rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-microchip" style="color: var(--cyan-accent);"></i> Stress-Test Simulation Engine
          </h4>
          <p style="font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 1rem;">
            Run numerical stress simulations directly on this digital component using modeled airflow loads.
          </p>
          
          ${$?`
            <div style="margin-bottom: 0.75rem;">
              <div style="display: flex; justify-content: space-between; font-size: 0.75rem; margin-bottom: 0.25rem; font-family: 'Orbitron';">
                <span>SIMULATING: Stress Loads...</span>
                <span>${w}%</span>
              </div>
              <div class="progress-track">
                <div class="progress-fill" style="width: ${w}%"></div>
              </div>
            </div>
            <div style="font-size: 0.7rem; font-family: 'Orbitron'; height: 80px; overflow-y: auto; background: rgba(0,0,0,0.3); border: 1px solid var(--border-color); padding: 0.5rem; border-radius: 4px;" id="sim-logs-container">
              ${x.map(u=>`<div style="margin-bottom: 2px;">${u}</div>`).join("")}
            </div>
          `:`
            <button class="btn-primary" id="run-sim-btn" style="width: 100%; justify-content: center; font-size: 0.85rem; padding: 0.6rem;">
              <i class="fas fa-play"></i> Run Virtual Stress Test
            </button>
          `}
        </div>
      </div>
    `};l.innerHTML=`
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
            <polygon class="interactive-part ${f==="avionics"?"active":""}" 
                     points="295,45 305,45 308,80 300,100 292,80" 
                     id="hotspot-avionics" />
            
            <!-- 2. Engine Turbines Left & Right -->
            <rect class="interactive-part ${f==="turbines"?"active":""}" 
                  x="185" y="210" width="22" height="48" rx="10" 
                  id="hotspot-turbines-left" />
            <rect class="interactive-part ${f==="turbines"?"active":""}" 
                  x="393" y="210" width="22" height="48" rx="10" 
                  id="hotspot-turbines-right" />

            <!-- 3. Fuel System / Wings Tanks -->
            <polygon class="interactive-part ${e.fuelSystem.life<75?"part-critical":""} ${f==="fuelSystem"?"active":""}" 
                     points="240,230 285,215 285,245 220,260" 
                     id="hotspot-fuelsystem" />

            <!-- 4. Landing Gear Actuator -->
            <ellipse class="interactive-part ${f==="landingGear"?"active":""}" 
                     cx="300" cy="210" rx="12" ry="16" 
                     id="hotspot-landinggear" />

            <!-- Interactive node overlay points -->
            <circle cx="300" cy="70" r="4" fill="${f==="avionics"?"var(--cyan-accent)":"rgba(255,255,255,0.5)"}" />
            <circle cx="196" cy="234" r="4" fill="${f==="turbines"?"var(--cyan-accent)":"rgba(255,255,255,0.5)"}" />
            <circle cx="404" cy="234" r="4" fill="${f==="turbines"?"var(--cyan-accent)":"rgba(255,255,255,0.5)"}" />
            <circle cx="260" cy="238" r="4" fill="${f==="fuelSystem"?"var(--critical)":"rgba(255,255,255,0.5)"}" />
            <circle cx="300" cy="210" r="4" fill="${f==="landingGear"?"var(--cyan-accent)":"rgba(255,255,255,0.5)"}" />
          </svg>
          
          <div style="font-size: 0.8rem; color: var(--text-secondary); text-align: center; margin-top: 1rem;">
            Click on highlighted hotspots (Cockpit, Engines, Landing Gear, Wing Fuel Valve) to select.
          </div>
        </div>

        <!-- Details Panel (Right) -->
        <div class="glass twin-details-panel">
          ${r()}
        </div>
      </div>
    </div>
  `,Object.entries({"hotspot-avionics":"avionics","hotspot-turbines-left":"turbines","hotspot-turbines-right":"turbines","hotspot-fuelsystem":"fuelSystem","hotspot-landinggear":"landingGear"}).forEach(([o,d])=>{const u=document.getElementById(o);u&&u.addEventListener("click",()=>{f=d,i(),z(l,t)})});const i=()=>{$=!1,w=0,x=[],C&&clearInterval(C)},n=()=>{$=!0,w=0,x=["Initializing Twin Finite Element Solver...","Reading telemetry from localized Edge AI...","Loading component stress weights..."],z(l,t),C=setInterval(()=>{if(w+=10,w===30)x.push(`[30%] Mapping vibration spectrum: ${t.telemetry.vibration}g dynamic excitation`);else if(w===50)x.push("[50%] Simulating CFD boundary layers at Mach 0.82");else if(w===80){const d=100-t.components[f].life;x.push(`[80%] Wear parameter calculation: +${d.toFixed(2)}% dynamic micro-degradation`)}else w===100&&(x.push(`[100%] Diagnostics complete. Failure probability: ${t.telemetry.faultProbability}%`),x.push(`Recommendation: ${stateManager.predictHealth().recommendations[0]}`),clearInterval(C),$=!1);z(l,t);const o=document.getElementById("sim-logs-container");o&&(o.scrollTop=o.scrollHeight)},400)},s=document.getElementById("run-sim-btn");s&&s.addEventListener("click",()=>{n()})}function re(l){return{turbines:"Double-row gas turbine assemblies generating axial propulsion. Diagnostic sensors track exhaust gas temperature (EGT), combustion vibrations, and oil feed pressure levels.",landingGear:"Hydraulic extension cylinder actuators and shock absorbency units. Tracked parameters include extension cycle duration (s), structural impact excitation (g), and fluid chamber sealing indicators.",avionics:"Redundant triple-module central computing processors hosting local Edge AI networks and primary flight control software. Monitored for chip thermal levels and core cycle status.",fuelSystem:"Integrated wing main fuel tanks, valve distribution linkages, and high-pressure electric feed pumps. Monitored for pressure levels, flow balance matching, and valve friction margins."}[l]||""}const ae=Object.freeze(Object.defineProperty({__proto__:null,render:z},Symbol.toStringTag,{value:"Module"}));function se(l,t){const e=m.predictHealth();l.innerHTML=`
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
                <div style="font-weight: 700; color: ${e.riskFactor==="High"?"var(--critical)":e.riskFactor==="Moderate"?"var(--warning)":"var(--success)"}; font-family: 'Orbitron';">
                  ${e.riskFactor.toUpperCase()} RISK
                </div>
              </div>
              <div>
                <span style="font-size: 0.75rem; color: var(--text-secondary);">Remaining Safe Flight Duration (Est):</span>
                <div style="font-weight: 600; font-family: 'Orbitron';">${e.ttfDays} Flight Hours</div>
              </div>
              <div>
                <span style="font-size: 0.75rem; color: var(--text-secondary);">Recommended Actions:</span>
                <ul style="margin-left: 1.25rem; font-size: 0.8rem; line-height: 1.5; color: var(--text-secondary); margin-top: 0.25rem;">
                  ${e.recommendations.map(n=>`<li style="margin-bottom: 4px;">${n}</li>`).join("")}
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
  `;const r=document.getElementById("telemetry-drop-zone"),a=document.getElementById("telemetry-file-input");r.addEventListener("click",()=>{a.click()}),r.addEventListener("dragover",n=>{n.preventDefault(),r.classList.add("dragover")}),r.addEventListener("dragleave",()=>{r.classList.remove("dragover")}),r.addEventListener("drop",n=>{n.preventDefault(),r.classList.remove("dragover");const s=n.dataTransfer.files;s.length>0&&i(s[0])}),a.addEventListener("change",n=>{const s=n.target.files;s.length>0&&i(s[0])});function i(n){if(!n.name.endsWith(".csv")){alert("Error: Please select a valid CSV telemetry file.");return}const s=new FileReader;s.onload=function(o){const d=o.target.result,u=m.processUploadedCSV(d);u.success?alert(`Successfully imported flight log telemetry! Loaded ${u.count} rows of data. Go to Dashboard to check updated gauges.`):alert(`Error importing CSV: ${u.error}`)},s.readAsText(n)}document.getElementById("download-template-btn").addEventListener("click",()=>{const n=`healthScore,engineTemp,fuelEfficiency,vibration,faultProbability,status,turbines,landinggear,avionics,fuelsystem
91,630,96.2,0.28,6,Healthy,90,85,98,71
76,658,93.4,0.42,35,Warning,88,80,95,68
`,s=new Blob([n],{type:"text/csv;charset=utf-8;"}),o=document.createElement("a"),d=URL.createObjectURL(s);o.setAttribute("href",d),o.setAttribute("download","aeroguardian_flight_template.csv"),o.style.visibility="hidden",document.body.appendChild(o),o.click(),document.body.removeChild(o)}),document.getElementById("btn-export-excel").addEventListener("click",()=>{const n=t.telemetryHistory;let s=`Timestamp,Airframe Health Index,Engine Temperature (C),Fuel Efficiency (%),Vibrations (g),Fault Probability (%),Status
`;n.forEach(p=>{s+=`${p.timestamp},${p.healthScore},${p.engineTemp},${p.fuelEfficiency},${p.vibration},${p.faultProbability},${p.status}
`});const o=new Blob([s],{type:"text/csv;charset=utf-8;"}),d=document.createElement("a"),u=URL.createObjectURL(o);d.setAttribute("href",u),d.setAttribute("download",`aeroguardian_telemetry_${Date.now()}.csv`),d.style.visibility="hidden",document.body.appendChild(d),d.click(),document.body.removeChild(d),m.addAlert("info","Reports","Telemetry Excel/CSV data spreadsheet exported successfully.")}),document.getElementById("btn-export-pdf").addEventListener("click",()=>{const n=window.open("","_blank");n.document.write(`
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
              <div class="score-val">${t.telemetry.healthScore}%</div>
            </div>
            <div class="score-card">
              <div>Vibrations Exponents</div>
              <div class="score-val" style="color: #64748b;">${t.telemetry.vibration}g</div>
            </div>
            <div class="score-card">
              <div>Fault Margin</div>
              <div class="score-val" style="color: #64748b;">${t.telemetry.faultProbability}%</div>
            </div>
          </div>

          <div class="recs">
            <h3 style="margin-top: 0; color: #b45309;">Predictive System Diagnosis (${e.riskFactor.toUpperCase()} RISK)</h3>
            <p>AeroGuardian Agentic AI diagnostic sweeps indicate the following recommended maintenance routing:</p>
            <ul>
              ${e.recommendations.map(s=>`<li>${s}</li>`).join("")}
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
              ${t.telemetryHistory.slice(-5).map(s=>`
                <tr>
                  <td>${s.timestamp}</td>
                  <td>${s.healthScore}%</td>
                  <td>${s.engineTemp}°C</td>
                  <td>${s.fuelEfficiency}%</td>
                  <td>${s.vibration}g</td>
                  <td>${s.status}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
          
          <div style="margin-top: 50px; font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 10px;">
            AeroGuardian Cloud Infrastructure certification - Confirmed by Edge AI System
          </div>
        </body>
      </html>
    `),n.document.close(),n.print(),m.addAlert("info","Reports","Airworthiness PDF certificate file created and sent to local printer spool.")})}const ne=Object.freeze(Object.defineProperty({__proto__:null,render:se},Symbol.toStringTag,{value:"Module"}));let L="all";function I(l,t){const e=t.alerts,r=e.filter(s=>L==="all"?!0:s.type===L),a=r.length>0?r.map(s=>{let o=`${s.type}-card`,d="fa-info-circle";return s.type==="critical"?d="fa-skull-crossbones":s.type==="warning"&&(d="fa-exclamation-triangle"),`
      <div class="glass alert-feed-card ${o}" style="opacity: ${s.read?.6:1}">
        <div class="alert-feed-icon ${s.type}"><i class="fas ${d}"></i></div>
        <div class="alert-feed-content">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
            <h4 style="font-size: 0.95rem; font-family: 'Orbitron';">${s.component.toUpperCase()}</h4>
            <span class="alert-feed-time">${s.timestamp}</span>
          </div>
          <p style="color: var(--text-primary); font-size: 0.88rem; line-height: 1.4; margin-bottom: 0.5rem;">${s.message}</p>
          
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.75rem; font-weight: 600; text-transform: uppercase; color: ${s.type==="critical"?"var(--critical)":s.type==="warning"?"var(--warning)":"var(--blue-accent)"}">
              ${s.type} status
            </span>
            ${s.read?`
              <span style="color: var(--text-secondary); font-size: 0.75rem;"><i class="fas fa-check-double"></i> Checked</span>
            `:`
              <button class="btn-secondary ack-btn" data-id="${s.id}" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; border-radius: 4px;">
                <i class="fas fa-check"></i> Acknowledge
              </button>
            `}
          </div>
        </div>
      </div>
    `}).join(""):`
    <div class="glass" style="padding: 3rem; text-align: center; color: var(--text-secondary);">
      <i class="fas fa-check-circle" style="font-size: 3rem; color: var(--success); margin-bottom: 1rem;"></i>
      <h3>No Alerts Flagged</h3>
      <p style="font-size: 0.85rem; margin-top: 0.25rem;">Sensors match normal parameters across all flight clusters.</p>
    </div>
  `;l.innerHTML=`
    <div class="page-container">
      <div class="alerts-header">
        <div>
          <h2 class="gradient-text" style="font-size: 2rem; margin-bottom: 0.25rem;">Alert Console & Log</h2>
          <p style="color: var(--text-secondary); font-size: 0.9rem;">
            Real-time sensory warning buffer. Connected to Edge AI local telemetry feeds.
          </p>
        </div>
        
        <button class="btn-secondary" id="clear-all-alerts-btn" style="padding: 0.5rem 1rem; font-size: 0.85rem;">
          <i class="fas fa-trash"></i> Clear History
        </button>
      </div>

      <!-- Filters Bar -->
      <div style="margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center;">
        <div class="alerts-filter-bar">
          <button class="filter-btn ${L==="all"?"active":""}" data-filter="all">All Alerts</button>
          <button class="filter-btn ${L==="critical"?"active":""}" data-filter="critical">
            <span style="color: var(--critical)">●</span> Critical
          </button>
          <button class="filter-btn ${L==="warning"?"active":""}" data-filter="warning">
            <span style="color: var(--warning)">●</span> Warning
          </button>
          <button class="filter-btn ${L==="info"?"active":""}" data-filter="info">
            <span style="color: var(--blue-accent)">●</span> Info
          </button>
        </div>
        <div style="font-size: 0.8rem; color: var(--text-secondary);">
          Total Logged: <strong style="color: var(--text-primary); font-family: 'Orbitron';">${e.length}</strong>
        </div>
      </div>

      <!-- Feed List -->
      <div class="alerts-feed-list">
        ${a}
      </div>
    </div>
  `,l.querySelectorAll(".filter-btn").forEach(s=>{s.addEventListener("click",()=>{L=s.getAttribute("data-filter"),I(l,t)})}),l.querySelectorAll(".ack-btn").forEach(s=>{s.addEventListener("click",()=>{const o=Number(s.getAttribute("data-id"));m.acknowledgeAlert(o),I(l,m.state)})}),document.getElementById("clear-all-alerts-btn").addEventListener("click",()=>{m.clearAlerts(),I(l,m.state)})}const oe=Object.freeze(Object.defineProperty({__proto__:null,render:I},Symbol.toStringTag,{value:"Module"}));function G(l,t){const e=t.roiCalculator,r=4.5,a=e.fleetSize*e.downtimeIncidents*e.costPerHour*r,i=Math.round(a*.35),n=Math.round(e.fleetSize*9600),s=i+n,o=e.fleetSize*1500*12,d=s-o,u=Math.round(d/o*100);l.innerHTML=`
    <div class="page-container">
      <div style="margin-bottom: 2.5rem;">
        <h2 class="gradient-text" style="font-size: 2rem; margin-bottom: 0.25rem;">Financial Cost Analysis & ROI</h2>
        <p style="color: var(--text-secondary); font-size: 0.9rem;">
          Estimate operational savings achieved by migrating from reactive inspections to Edge AI predictive health monitoring.
        </p>
      </div>

      <div class="cost-calculator-section">
        <!-- Sliders Configurations (Left) -->
        <div class="glass calculator-panel">
          <h3 style="font-size: 1.15rem; color: var(--text-primary); border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; margin-bottom: 1rem;">
            <i class="fas fa-sliders-h" style="color: var(--cyan-accent);"></i> Fleet Specifications
          </h3>

          <div class="slider-group">
            <div class="slider-header">
              <span>Aircraft Fleet Size:</span>
              <strong style="color: var(--cyan-accent); font-family: 'Orbitron';">${e.fleetSize} planes</strong>
            </div>
            <input type="range" id="fleet-size-slider" min="1" max="100" value="${e.fleetSize}" class="roi-slider" />
          </div>

          <div class="slider-group">
            <div class="slider-header">
              <span>Unscheduled Downtime Events:</span>
              <strong style="color: var(--cyan-accent); font-family: 'Orbitron';">${e.downtimeIncidents} / plane-year</strong>
            </div>
            <input type="range" id="downtime-events-slider" min="1" max="50" value="${e.downtimeIncidents}" class="roi-slider" />
            <span style="font-size: 0.7rem; color: var(--text-secondary);">Avg Incident duration: ${r} hours (AOG)</span>
          </div>

          <div class="slider-group">
            <div class="slider-header">
              <span>Average Cost of Delay / Hour:</span>
              <strong style="color: var(--cyan-accent); font-family: 'Orbitron';">$${e.costPerHour.toLocaleString()}</strong>
            </div>
            <input type="range" id="cost-per-hour-slider" min="1000" max="50000" step="1000" value="${e.costPerHour}" class="roi-slider" />
            <span style="font-size: 0.7rem; color: var(--text-secondary);">Includes passenger compensation, gate penalties, and engineering overtime.</span>
          </div>
        </div>

        <!-- Dynamic Results Panel (Right) -->
        <div class="glass cost-results-panel">
          <div class="saving-kpi">
            <div style="font-size: 0.85rem; color: var(--text-secondary); text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px; margin-bottom: 0.5rem;">
              Estimated Annual Savings
            </div>
            <div class="saving-kpi-val">$${s.toLocaleString()}</div>
            <span style="font-size: 0.8rem; color: var(--text-secondary);">
              Downtime Savings: <strong>$${i.toLocaleString()}</strong> | Fuel Optimizer: <strong>$${n.toLocaleString()}</strong>
            </span>
          </div>

          <!-- ROI Metrics Matrix -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; border-top: 1px solid var(--border-color); padding-top: 1.5rem;">
            <div>
              <div style="font-size: 0.75rem; color: var(--text-secondary);">SaaS Subscription (Est):</div>
              <div style="font-size: 1.15rem; font-weight: 700; font-family: 'Orbitron';">$${o.toLocaleString()}/yr</div>
            </div>
            <div>
              <div style="font-size: 0.75rem; color: var(--text-secondary);">Net Return (ROI):</div>
              <div style="font-size: 1.15rem; font-weight: 700; color: var(--success); font-family: 'Orbitron';">+${u}%</div>
            </div>
            <div>
              <div style="font-size: 0.75rem; color: var(--text-secondary);">Downtime Cost (Before AI):</div>
              <div style="font-size: 1.15rem; font-weight: 700; color: var(--critical); font-family: 'Orbitron';">$${a.toLocaleString()}</div>
            </div>
            <div>
              <div style="font-size: 0.75rem; color: var(--text-secondary);">Operational Payback:</div>
              <div style="font-size: 1.15rem; font-weight: 700; font-family: 'Orbitron';">3.4 Months</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;const p=document.getElementById("fleet-size-slider"),h=document.getElementById("downtime-events-slider"),v=document.getElementById("cost-per-hour-slider"),c=()=>{m.updateRoiParams(Number(p.value),Number(h.value),Number(v.value)),G(l,m.state)};p.addEventListener("input",c),h.addEventListener("input",c),v.addEventListener("input",c)}const le=Object.freeze(Object.defineProperty({__proto__:null,render:G},Symbol.toStringTag,{value:"Module"}));let b="seattle";const ce={seattle:{name:"Seattle HQ (Americas)",address:"1200 Boeing Field Way, Seattle, WA 98108",phone:"+1 (206) 555-0142",email:"us.support@aeroguardian.com"},london:{name:"London Office (Europe)",address:"44 Terminal 5 Boulevard, Heathrow, London TW6 2GA",phone:"+44 (20) 7946 0192",email:"eu.support@aeroguardian.com"},singapore:{name:"Singapore Tech Hub (APAC)",address:"80 Changi Coast Road, Changi Airport 819830",phone:"+65 6789 0111",email:"sg.support@aeroguardian.com"},dubai:{name:"Dubai Station (MEA)",address:"AeroCenter Floor 12, DAFZA, Dubai",phone:"+971 4 206 1234",email:"me.support@aeroguardian.com"}};function V(l,t){const e=ce[b];l.innerHTML=`
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
                <circle cx="75" cy="65" r="${b==="seattle"?7:4}" fill="${b==="seattle"?"var(--cyan-accent)":"#0066ff"}" class="map-hub" data-hub="seattle" style="cursor:pointer;" />
                <text x="60" y="52" fill="white" font-family="Orbitron" font-size="8">Seattle</text>

                <!-- London Hub -->
                <circle cx="185" cy="60" r="${b==="london"?7:4}" fill="${b==="london"?"var(--cyan-accent)":"#0066ff"}" class="map-hub" data-hub="london" style="cursor:pointer;" />
                <text x="175" y="48" fill="white" font-family="Orbitron" font-size="8">London</text>

                <!-- Dubai Hub -->
                <circle cx="230" cy="95" r="${b==="dubai"?7:4}" fill="${b==="dubai"?"var(--cyan-accent)":"#0066ff"}" class="map-hub" data-hub="dubai" style="cursor:pointer;" />
                <text x="235" y="93" fill="white" font-family="Orbitron" font-size="8">Dubai</text>

                <!-- Singapore Hub -->
                <circle cx="295" cy="130" r="${b==="singapore"?7:4}" fill="${b==="singapore"?"var(--cyan-accent)":"#0066ff"}" class="map-hub" data-hub="singapore" style="cursor:pointer;" />
                <text x="302" y="128" fill="white" font-family="Orbitron" font-size="8">Singapore</text>
              </svg>
            </div>
            
            <div style="font-size: 0.75rem; color: var(--text-secondary); text-align: center; margin-top: 0.5rem;">
              Click dots on map to display hub location metrics.
            </div>
          </div>

          <!-- Hub Address Details -->
          <div class="glass" style="padding: 1.5rem; flex-grow: 1; display: flex; flex-direction: column; gap: 0.75rem;">
            <h4 style="color: var(--cyan-accent); font-size: 1.05rem;" id="hub-name">${e.name}</h4>
            
            <div>
              <span style="font-size: 0.75rem; color: var(--text-secondary);"><i class="fas fa-map-marker-alt"></i> Address:</span>
              <div style="font-size: 0.85rem; font-weight: 500;" id="hub-address">${e.address}</div>
            </div>

            <div>
              <span style="font-size: 0.75rem; color: var(--text-secondary);"><i class="fas fa-phone-alt"></i> Hotline support:</span>
              <div style="font-size: 0.85rem; font-weight: 500;" id="hub-phone">${e.phone}</div>
            </div>

            <div>
              <span style="font-size: 0.75rem; color: var(--text-secondary);"><i class="fas fa-envelope"></i> Email dispatcher:</span>
              <div style="font-size: 0.85rem; font-weight: 500;" id="hub-email"><a href="mailto:${e.email}" style="color:var(--cyan-accent); text-decoration:none;">${e.email}</a></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,l.querySelectorAll(".map-hub").forEach(i=>{i.addEventListener("click",()=>{b=i.getAttribute("data-hub"),V(l)})});const a=document.getElementById("contact-form");a.addEventListener("submit",()=>{document.getElementById("contact-name").value,alert(`Transmission complete! Secure message sent. AeroGuardian Support has registered the docket under ID: ACT-${Math.round(Math.random()*89999)+1e4}.`),a.reset()})}const de=Object.freeze(Object.defineProperty({__proto__:null,render:V},Symbol.toStringTag,{value:"Module"})),me={home:Z,about:Q,features:X,dashboard:ie,twin:ae,reports:ne,alerts:oe,cost:le,contact:de};window.appState=m;document.addEventListener("DOMContentLoaded",()=>{ge()});function ge(){const l=document.getElementById("content-viewport"),t=document.getElementById("theme-toggle"),e=document.getElementById("voice-toggle"),r=document.getElementById("chat-bubble-trigger"),a=document.getElementById("chat-panel"),i=document.getElementById("chat-close"),n=document.getElementById("chat-send-btn"),s=document.getElementById("chat-input"),o=document.getElementById("chat-messages"),d=document.getElementById("auth-profile-badge"),u=document.getElementById("login-modal"),p=document.getElementById("login-form"),h=document.getElementById("signup-link"),v=document.getElementById("login-link"),c=document.getElementById("auth-title"),A=document.getElementById("auth-submit-btn");let M=!1;const T=document.getElementById("demo-modal"),D=document.getElementById("demo-form"),R=document.querySelectorAll(".nav-item");m.subscribe(g=>{document.documentElement.setAttribute("data-theme",g.theme),t.innerHTML=g.theme==="dark"?'<i class="fas fa-sun"></i>':'<i class="fas fa-moon"></i>',g.voiceActive?(e.innerHTML='<i class="fas fa-microphone" style="color: var(--critical);"></i>',e.classList.add("pulse-warning")):(e.innerHTML='<i class="fas fa-microphone-slash"></i>',e.classList.remove("pulse-warning"));const y=g.alerts.filter(E=>!E.read).length,S=document.getElementById("notification-badge");y>0?(S.style.display="flex",S.textContent=y):S.style.display="none";const k=document.getElementById("system-status-capsule");k.className=`status-capsule ${g.telemetry.status.toLowerCase()}`,k.innerHTML=`<span class="pulse-dot"></span> Sys: ${g.telemetry.status}`,R.forEach(E=>{E.getAttribute("data-view")===g.activeView?E.classList.add("active"):E.classList.remove("active")});const P=document.getElementById("profile-avatar-lbl"),H=document.getElementById("profile-name-lbl");g.user?(P.textContent=g.user.avatar,H.textContent=g.user.name):(P.textContent="?",H.textContent="Guest Engineer");const O=me[g.activeView];O&&l&&O.render(l,g)}),R.forEach(g=>{g.addEventListener("click",y=>{y.preventDefault();const S=g.getAttribute("data-view");m.setState({activeView:S})})}),document.getElementById("alerts-bell-btn").addEventListener("click",()=>{m.setState({activeView:"alerts"})}),t.addEventListener("click",()=>{m.toggleTheme()}),e.addEventListener("click",()=>{W.toggleListening()}),r.addEventListener("click",()=>{a.classList.toggle("active")}),i.addEventListener("click",()=>{a.classList.remove("active")});const F=()=>{const g=s.value;g.trim()&&(B.sendMessage(g),s.value="")};n.addEventListener("click",F),s.addEventListener("keydown",g=>{g.key==="Enter"&&F()}),B.subscribe(g=>{o.innerHTML=g.map(y=>`
      <div class="chat-bubble ${y.sender}">
        ${y.text}
        <div style="font-size: 0.65rem; opacity: 0.6; text-align: right; margin-top: 4px;">${y.timestamp}</div>
      </div>
    `).join(""),o.scrollTop=o.scrollHeight}),d.addEventListener("click",()=>{m.state.user?confirm("Do you want to sign out of the secure flight diagnostics session?")&&m.logout():u.classList.add("active")}),p.addEventListener("submit",g=>{g.preventDefault();const y=document.getElementById("login-username").value,S=document.getElementById("login-email-input").value,k=document.getElementById("login-password").value;M?m.signup(y,S,k):m.login(y,k),p.reset(),u.classList.remove("active")}),h.addEventListener("click",g=>{g.preventDefault(),M=!0,c.textContent="AeroGuardian Registry",document.getElementById("email-form-group").style.display="block",document.getElementById("login-email-input").setAttribute("required","required"),A.textContent="Register Credentials",h.parentNode.style.display="none",v.parentNode.style.display="block"}),v.addEventListener("click",g=>{g.preventDefault(),M=!1,c.textContent="Avionics Authentication",document.getElementById("email-form-group").style.display="none",document.getElementById("login-email-input").removeAttribute("required"),A.textContent="Validate Token",h.parentNode.style.display="block",v.parentNode.style.display="none"}),document.querySelectorAll(".modal-close").forEach(g=>{g.addEventListener("click",()=>{u.classList.remove("active"),T.classList.remove("active")})}),window.addEventListener("click",g=>{g.target===u&&u.classList.remove("active"),g.target===T&&T.classList.remove("active")}),D.addEventListener("submit",g=>{g.preventDefault(),alert("AeroGuardian integration request queued! Our flight intelligence engineers will contact your operations team within 2 hours."),D.reset(),T.classList.remove("active")}),m.setState({})}
