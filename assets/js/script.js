const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- boot sequence ----------
const boot = document.getElementById('boot');
const bootText = document.getElementById('bootText');
const bootLines = [
  '[ OK ] loading systems operations module',
  '[ OK ] mounting PowerShell automation experience',
  '[ OK ] initializing ECE signal laboratory',
  '[ OK ] indexing projects + academic journey',
  '[ OK ] enabling interactive hobby playground',
  '[ OK ] portfolio interface ready'
];
if (boot) {
  if (reduceMotion || sessionStorage.getItem('ms_portfolio_boot')) {
    boot.remove();
  } else {
    let i = 0;
    const addLine = () => {
      if (i < bootLines.length) {
        bootText.textContent += bootLines[i++] + '\n';
        setTimeout(addLine, 190);
      } else {
        sessionStorage.setItem('ms_portfolio_boot', '1');
        setTimeout(() => {
          boot.classList.add('hide');
          setTimeout(() => boot.remove(), 500);
        }, 260);
      }
    };
    setTimeout(addLine, 120);
  }
}

// ---------- reveal / active navigation ----------
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const navLinks = [...document.querySelectorAll('.links a')];
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(a => {
      const href = a.getAttribute('href');
      if (href && href.startsWith('#')) a.classList.toggle('active', href === '#' + entry.target.id);
    });
  });
}, { rootMargin: '-35% 0px -55%' });
document.querySelectorAll('main section[id]').forEach(s => sectionObserver.observe(s));

// ---------- oscilloscope ----------
function drawScope(canvas, freq = 4, amp = .7, noise = .04, phase = 0) {
  if (!canvas) return;
  const c = canvas.getContext('2d'), w = canvas.width, h = canvas.height;
  c.clearRect(0, 0, w, h);
  c.fillStyle = '#061012'; c.fillRect(0, 0, w, h);
  c.strokeStyle = 'rgba(85,230,213,.11)'; c.lineWidth = 1;
  for (let x = 0; x < w; x += w / 12) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke(); }
  for (let y = 0; y < h; y += h / 8) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); }
  c.strokeStyle = '#55e6d5'; c.lineWidth = 2.2; c.shadowColor = '#55e6d5'; c.shadowBlur = 6; c.beginPath();
  for (let x = 0; x < w; x++) {
    const t = x / w * Math.PI * 2 * freq + phase;
    const n = (Math.random() - .5) * noise * h;
    const y = h / 2 - Math.sin(t) * (h * .35 * amp) + n;
    if (x === 0) c.moveTo(x, y); else c.lineTo(x, y);
  }
  c.stroke(); c.shadowBlur = 0;
}
let heroPhase = 0, ecePhase = 0;
const heroScope = document.getElementById('heroScope');
const eceScope = document.getElementById('eceScope');
const freq = document.getElementById('freq'), amp = document.getElementById('amp'), noise = document.getElementById('noise');
const freqVal = document.getElementById('freqVal'), ampVal = document.getElementById('ampVal'), noiseVal = document.getElementById('noiseVal');
let heroVisible = false, eceVisible = false, heroRAF = null, eceRAF = null;
function heroScopeLoop() {
  if (!heroScope || !heroVisible) { heroRAF = null; return; }
  drawScope(heroScope, 5, .7, .01, heroPhase); heroPhase += .08;
  if (!reduceMotion) heroRAF = requestAnimationFrame(heroScopeLoop); else heroRAF = null;
}
function eceScopeLoop() {
  if (!eceScope || !eceVisible || !freq || !amp || !noise) { eceRAF = null; return; }
  drawScope(eceScope, +freq.value, +amp.value / 100, +noise.value / 100, ecePhase); ecePhase += .045;
  if (!reduceMotion) eceRAF = requestAnimationFrame(eceScopeLoop); else eceRAF = null;
}
const scopeVisibility = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.target === heroScope) {
      heroVisible = entry.isIntersecting;
      if (heroVisible && heroRAF === null) heroScopeLoop();
      if (!heroVisible && heroRAF !== null) { cancelAnimationFrame(heroRAF); heroRAF = null; }
    }
    if (entry.target === eceScope) {
      eceVisible = entry.isIntersecting;
      if (eceVisible && eceRAF === null) eceScopeLoop();
      if (!eceVisible && eceRAF !== null) { cancelAnimationFrame(eceRAF); eceRAF = null; }
    }
  });
}, { threshold: 0.05 });
if (heroScope) { scopeVisibility.observe(heroScope); if (reduceMotion) drawScope(heroScope,5,.7,.01,heroPhase); }
if (eceScope) { scopeVisibility.observe(eceScope); if (reduceMotion && freq && amp && noise) drawScope(eceScope,+freq.value,+amp.value/100,+noise.value/100,ecePhase); }
function updateScopeValues() {
  if (freqVal && freq) freqVal.textContent = (+freq.value).toFixed(1) + ' Hz';
  if (ampVal && amp) ampVal.textContent = (+amp.value / 100).toFixed(2) + ' V';
  if (noiseVal && noise) noiseVal.textContent = noise.value + '%';
}
[freq, amp, noise].forEach(x => x && x.addEventListener('input', () => { updateScopeValues(); if (reduceMotion && eceScope && freq && amp && noise) drawScope(eceScope,+freq.value,+amp.value/100,+noise.value/100,ecePhase); }));

// ---------- experience control room ----------
const opsData = {
  automation: { code: 'AUTOMATION.RUN', title: 'Automation — PowerShell & Batch', body: 'Designed and used PowerShell and Batch scripts to reduce repetitive manual work, support administrative workflows and improve day-to-day operational efficiency.' },
  supervisor: { code: 'SUPERVISOR.LEAD', title: 'Supervisor — 6-Member Team', body: 'Supervised a team of 6, allocated daily tasks, monitored progress, supported technical queries and helped keep operational work on schedule.' },
  rnd: { code: 'RND.BUILD', title: 'Research & Development', body: 'Contributed to R&D activities through feature evaluation, coding exposure, product improvements and coordination with development teams.' },
  qa: { code: 'QA.VALIDATE', title: 'Quality Assurance / Testing', body: 'Performed manual functional, regression and validation testing, documented findings and supported root-cause analysis to improve product quality.' }
};
const opsDetail = document.getElementById('opsDetail');
document.querySelectorAll('.ops-node').forEach(btn => {
  btn.addEventListener('click', () => {
    const d = opsData[btn.dataset.ops]; if (!d || !opsDetail) return;
    document.querySelectorAll('.ops-node').forEach(b => b.classList.toggle('active', b === btn));
    opsDetail.innerHTML = `<span>${d.code}</span><h4>${d.title}</h4><p>${d.body}</p>`;
    opsDetail.classList.remove('flash'); void opsDetail.offsetWidth; opsDetail.classList.add('flash');
  });
});

// ---------- PowerShell portfolio terminal ----------
const terminalScreen = document.getElementById('termScreen');
const terminalInput = document.getElementById('termInput');
const commands = {
  'help': `Available commands:\n  Get-Experience     professional systems experience\n  Get-Skills         technical stack\n  Get-Team           team management highlight\n  Get-Projects       engineering projects\n  Get-Education      academic summary\n  Get-Hobbies        personal interests\n  Get-Availability   current job-search status\n  clear              clear terminal`,
  'get-experience': `Role        : Previously worked as System Engineer\nCompany     : Winman Software India LLP\nExperience  : 2 years 6 months\nPriority    : Automation → Supervision → R&D → QA\nSystems     : Windows, IT infrastructure, Task Scheduler, AD/DC\nLeadership  : Supervised a 6-member technical team`,
  'get-skills': `Systems     : Windows Administration, IT Support, AD / Domain Controller\nAutomation  : PowerShell, Batch (.bat), Task Scheduler\nProgramming : Python, Java, SQL — basic understanding\nProjects    : OpenCV, pandas, scikit-learn — academic/project exposure\nSoft Skills : Communication, team management\nLearning    : Linux, Networking, Git/GitHub, AWS, DevOps`,
  'get-team': `TeamSize : 6\nRole     : Team management, task allocation, coordination and support`,
  'get-projects': `[01] PowerShell / Batch Automation\n[02] Arecanut Classification — ~2,000 image dataset\n[03] Smart Wheelchair — ATmega32 + sensors\n[04] Android Controlled Robot — 8051 + HC-05\n[05] Linux Administration Practice\n[06] Networking Practice`,
  'get-education': `School   : SDM English Medium School, Ujire — CGPA 8.6\nPUC      : SDM PU College, Ujire — PCMS aggregate 98\nDegree   : BE in ECE, NMAMIT Nitte — CGPA 8.46`,
  'get-hobbies': `Hobbies  : Playing chess, carrom, reading manhwa / web comics, watching movies, solving Rubik's Cube`,
  'get-availability': `Status     : Open to work\nTarget     : System Engineer / IT Support / System Administration / IT Infrastructure\nLocation   : Open to UAE opportunities\nJoining    : Immediate\nStrengths  : Automation + team management + ECE foundation`
};
function printTerminal(text, cls = 'term-info') {
  if (!terminalScreen) return;
  const d = document.createElement('div'); d.className = 'term-line ' + cls; d.textContent = text;
  terminalScreen.appendChild(d); terminalScreen.scrollTop = terminalScreen.scrollHeight;
}
function runCommand(cmd) {
  const clean = cmd.trim(); if (!clean) return;
  printTerminal('PS C:\\Shamreed> ' + clean, 'term-command');
  if (clean.toLowerCase() === 'clear') { terminalScreen.innerHTML = ''; return; }
  const out = commands[clean.toLowerCase()];
  printTerminal(out || `Command not found: ${clean}\nType "help" for available portfolio commands.`, out ? 'term-info' : 'term-warn');
}
if (terminalScreen) {
  printTerminal('Windows PowerShell — Portfolio Session', 'term-ok');
  printTerminal('Type "help" to inspect my profile.', 'term-info');
}
if (terminalInput) terminalInput.addEventListener('keydown', e => { if (e.key === 'Enter') { runCommand(terminalInput.value); terminalInput.value = ''; } });
document.querySelectorAll('[data-cmd]').forEach(b => b.addEventListener('click', () => { runCommand(b.dataset.cmd); document.getElementById('psTerminal')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }));
document.getElementById('openTerminal')?.addEventListener('click', () => { document.getElementById('lab')?.scrollIntoView({ behavior: 'smooth' }); setTimeout(() => terminalInput?.focus(), 500); });

// ---------- projects: activate flow on tap ----------
document.querySelectorAll('.workbench-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.workbench-card').forEach(c => c.classList.remove('focus-project'));
    card.classList.add('focus-project');
    setTimeout(() => card.classList.remove('focus-project'), 1800);
  });
});

// ---------- skills capability dashboard ----------
const capData = {
  systems: { code: 'SYSTEMS.MODE', title: 'Windows & IT Support', text: 'Windows administration, IT support, troubleshooting, software environments, Task Scheduler and Active Directory / Domain Controller exposure.', tags: ['Windows', 'IT Support', 'Troubleshooting', 'AD / Domain Controller'] },
  automation: { code: 'AUTOMATION.MODE', title: 'PowerShell & Batch Automation', text: 'Professional scripting exposure focused on automating repetitive administrative tasks and making Windows workflows more dependable.', tags: ['PowerShell', 'Batch', 'Task Scheduler', 'Automation'] },
  engineering: { code: 'ECE.MODE', title: 'Engineering Foundation', text: 'Engineer in ECE with project exposure to embedded systems, microcontrollers, sensors, robotics and image-based machine learning.', tags: ['ECE', '8051', 'ATmega32', 'Embedded Systems'] },
  communication: { code: 'COMM.MODE', title: 'Communication', text: 'Used clear communication to coordinate tasks, explain technical issues, document findings and collaborate with developers, testers and other stakeholders.', tags: ['Communication', 'Documentation', 'Stakeholders', 'Collaboration'] },
  team: { code: 'TEAM.MODE', title: 'Team Management', text: 'Supervised 6 team members, allocated daily work, monitored progress and supported technical coordination to keep deliverables on track.', tags: ['Supervision', 'Task Allocation', 'Coordination', 'Team Support'] }
};
const capReadout = document.getElementById('capReadout');
document.querySelectorAll('.tool-chip').forEach(btn => {
  btn.addEventListener('click', () => {
    const d = capData[btn.dataset.cap]; if (!d || !capReadout) return;
    document.querySelectorAll('.tool-chip').forEach(b => b.classList.toggle('active', b === btn));
    const toolkitCode = document.getElementById('toolkitCode'); if (toolkitCode) toolkitCode.textContent = d.code;
    capReadout.innerHTML = `<span>${d.code}</span><h3>${d.title}</h3><p>${d.text}</p><div class="cap-tags">${d.tags.map(t => `<b>${t}</b>`).join('')}</div>`;
    capReadout.classList.remove('flash'); void capReadout.offsetWidth; capReadout.classList.add('flash');
  });
});

// ---------- education: character growth + academic signal ----------
const educationData = {
  school: { label: '01 / SCHOOL', title: 'SDM English Medium School, Ujire', desc: 'Completed my schooling with a strong academic foundation before moving into the PCMS stream.', score: '8.6', unit: 'CGPA', needle: 84, stage: 'stage-school', world: 'FOUNDATION' },
  pu: { label: '02 / PRE-UNIVERSITY', title: 'SDM PU College, Ujire', desc: 'Completed Pre-University in the PCMS stream with an aggregate of 98.', score: '98', unit: 'PCMS', needle: 96, stage: 'stage-pu', world: 'SCIENCE PATH · PCMS' },
  engineering: { label: '03 / ENGINEERING', title: 'BE — Electronics & Communication Engineering', desc: 'NMAM Institute of Technology (NMAMIT), Nitte — graduated as an Engineer in ECE with a CGPA of 8.46.', score: '8.46', unit: 'CGPA', needle: 85, stage: 'stage-engineering', world: 'ENGINEER IN ECE' }
};
const growthCharacter = document.getElementById('growthCharacter');
const growthLabel = document.getElementById('growthLabel');
const eduStageLabel = document.getElementById('eduStageLabel');
const eduTitle = document.getElementById('eduTitle');
const eduDesc = document.getElementById('eduDesc');
const eduScore = document.getElementById('eduScore');
const academicNeedle = document.getElementById('academicNeedle');
function setEducation(key) {
  const d = educationData[key]; if (!d) return;
  if (growthCharacter) {
    growthCharacter.classList.remove('stage-school','stage-pu','stage-engineering');
    growthCharacter.classList.add(d.stage);
    growthCharacter.dataset.stage = key;
  }
  if (growthLabel) growthLabel.textContent = d.world;
  if (eduStageLabel) eduStageLabel.textContent = d.label;
  if (eduTitle) eduTitle.textContent = d.title;
  if (eduDesc) eduDesc.textContent = d.desc;
  if (eduScore) eduScore.innerHTML = `${d.score} <small id="eduUnit">${d.unit}</small>`;
  if (academicNeedle) academicNeedle.style.left = d.needle + '%';
  document.querySelectorAll('.growth-tab').forEach(b => b.classList.toggle('active', b.dataset.edu === key));
  document.querySelectorAll('.journey-node').forEach(b => b.classList.toggle('active', b.dataset.edu === key));
}
document.querySelectorAll('.growth-tab,.journey-node').forEach(b => b.addEventListener('click', () => setEducation(b.dataset.edu)));
setEducation('school');

// ---------- compact hobby mini-playground ----------
const arenaMessage = document.getElementById('arenaMessage');
function hobbyMessage(msg){ if(arenaMessage) arenaMessage.textContent=msg; }
function dragInside(el, box, onEnd){
  if(!el||!box)return; let dragging=false;
  const move=e=>{ if(!dragging)return; const r=box.getBoundingClientRect(); const x=Math.max(18,Math.min(r.width-18,e.clientX-r.left)); const y=Math.max(24,Math.min(r.height-18,e.clientY-r.top)); el.style.left=x+'px'; el.style.top=y+'px'; };
  el.addEventListener('pointerdown',e=>{dragging=true;el.classList.add('dragging');el.setPointerCapture(e.pointerId);move(e)});
  el.addEventListener('pointermove',move);
  el.addEventListener('pointerup',e=>{if(!dragging)return;dragging=false;el.classList.remove('dragging');onEnd?.(e,box.getBoundingClientRect())});
  el.addEventListener('pointercancel',()=>{dragging=false;el.classList.remove('dragging')});
}
const chessZone=document.getElementById('chessZone'),dragKing=document.getElementById('dragKing'),chessResult=document.getElementById('chessResult');
dragInside(dragKing,chessZone,(e,r)=>{const y=e.clientY-r.top;if(y>r.height*.66){dragKing.classList.add('fallen');if(chessResult)chessResult.textContent='CHECKMATE ♛';hobbyMessage('CHESS · king down · CHECKMATE');setTimeout(()=>{dragKing.classList.remove('fallen');dragKing.style.left='50%';dragKing.style.top='46%';if(chessResult)chessResult.textContent=''},1900)}else{hobbyMessage('CHESS · king repositioned · game continues')}});
document.querySelectorAll('.chess-piece').forEach(piece=>dragInside(piece,chessZone,()=>hobbyMessage('CHESS · piece repositioned')));
const carrom=document.getElementById('miniCarrom'),striker=document.getElementById('striker'),carromResult=document.getElementById('carromResult');
if(carrom&&striker){let drag=false,prev=null,v={x:0,y:0},raf=null;const coins=[...carrom.querySelectorAll('.coin')];const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));const center=el=>{const cr=carrom.getBoundingClientRect(),er=el.getBoundingClientRect();return{x:er.left-cr.left+er.width/2,y:er.top-cr.top+er.height/2}};const set=(el,x,y)=>{el.style.left=x+'px';el.style.top=y+'px'};const pockets=()=>{const r=carrom.getBoundingClientRect();return[{x:5,y:5},{x:r.width-5,y:5},{x:5,y:r.height-5},{x:r.width-5,y:r.height-5}]};function animate(){const r=carrom.getBoundingClientRect();let p=center(striker);p.x+=v.x;p.y+=v.y;if(p.x<10||p.x>r.width-10){v.x*=-.75;p.x=clamp(p.x,10,r.width-10)}if(p.y<10||p.y>r.height-10){v.y*=-.75;p.y=clamp(p.y,10,r.height-10)}set(striker,p.x,p.y);coins.forEach(coin=>{if(coin.dataset.pocketed)return;let c=center(coin),dx=c.x-p.x,dy=c.y-p.y,d=Math.hypot(dx,dy);if(d<22){const len=Math.max(1,d);set(coin,clamp(c.x+dx/len*28,7,r.width-7),clamp(c.y+dy/len*28,7,r.height-7));v.x*=.55;v.y*=.55}c=center(coin);const hit=pockets().some(pk=>Math.hypot(c.x-pk.x,c.y-pk.y)<18);if(hit){coin.dataset.pocketed='1';coin.style.opacity='0';if(carromResult)carromResult.textContent='POCKET! +1';hobbyMessage('CARROM · coin pocketed · +1');setTimeout(()=>{coin.dataset.pocketed='';coin.style.opacity='1';coin.removeAttribute('style')},2200)}});v.x*=.978;v.y*=.978;if(Math.hypot(v.x,v.y)>.12)raf=requestAnimationFrame(animate)}striker.addEventListener('pointerdown',e=>{if(raf)cancelAnimationFrame(raf);drag=true;striker.setPointerCapture(e.pointerId);prev={x:e.clientX,y:e.clientY,t:performance.now()};hobbyMessage('CARROM · aim and flick')});striker.addEventListener('pointermove',e=>{if(!drag)return;const r=carrom.getBoundingClientRect(),now=performance.now();set(striker,clamp(e.clientX-r.left,11,r.width-11),clamp(e.clientY-r.top,11,r.height-11));const dt=Math.max(8,now-prev.t);v={x:(e.clientX-prev.x)/dt*14,y:(e.clientY-prev.y)/dt*14};prev={x:e.clientX,y:e.clientY,t:now}});striker.addEventListener('pointerup',()=>{if(!drag)return;drag=false;if(Math.hypot(v.x,v.y)<.8)v={x:0,y:-4};raf=requestAnimationFrame(animate)});}
const comicWrap=document.getElementById('comicWrap'),comicPanel=document.getElementById('comicPanel'),panelNo=document.getElementById('panelNo'),panelTitle=document.getElementById('panelTitle'),comicResult=document.getElementById('comicResult');
const panelTitles=['Swipe into the next scene...','A new panel drops in.','The story takes a turn.','Next episode energy.','One more panel...'];
let panel=1,comicStartX=null;
function advanceComic(){
  if(!comicPanel)return; panel=panel%panelTitles.length+1; comicPanel.classList.add('turn');
  if(comicResult)comicResult.textContent='PANEL '+String(panel).padStart(2,'0'); hobbyMessage('WEB COMICS · MANHWA · panel '+String(panel).padStart(2,'0'));
  setTimeout(()=>{if(panelNo)panelNo.textContent=String(panel).padStart(2,'0');if(panelTitle)panelTitle.textContent=panelTitles[panel-1];comicPanel.classList.remove('turn')},230)
}
if(comicWrap){comicWrap.addEventListener('pointerdown',e=>{comicStartX=e.clientX;comicWrap.setPointerCapture(e.pointerId)});comicWrap.addEventListener('pointerup',()=>{if(comicStartX===null)return;comicStartX=null;advanceComic()})}

// movie reel: drag or press Enter/Space to spin
const movieZone=document.getElementById('movieZone'),filmReel=document.getElementById('filmReel'),movieScene=document.getElementById('movieScene'),movieResult=document.getElementById('movieResult');
if(movieZone&&filmReel){
  let movieDown=false,lastMovieX=0,reelRot=0;
  const scenes=['READY ▶','NOW PLAYING','SCENE CHANGE','CREDITS ✦'];let sceneIndex=0;
  const renderReel=()=>filmReel.style.transform=`rotate(${reelRot}deg)`;
  const finishMovie=()=>{if(!movieDown)return;movieDown=false;filmReel.classList.remove('dragging');reelRot+=180;renderReel();sceneIndex=(sceneIndex+1)%scenes.length;if(movieScene)movieScene.textContent=scenes[sceneIndex];if(movieResult)movieResult.textContent='ROLLING 🎬';hobbyMessage('MOVIES · reel spinning · scene '+(sceneIndex+1));setTimeout(()=>{if(movieResult)movieResult.textContent=''},1200)};
  filmReel.addEventListener('pointerdown',e=>{movieDown=true;lastMovieX=e.clientX;filmReel.classList.add('dragging');filmReel.setPointerCapture(e.pointerId)});
  filmReel.addEventListener('pointermove',e=>{if(!movieDown)return;const dx=e.clientX-lastMovieX;reelRot+=dx*2.4;lastMovieX=e.clientX;renderReel()});
  filmReel.addEventListener('pointerup',finishMovie);filmReel.addEventListener('pointercancel',finishMovie);
  filmReel.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();movieDown=true;finishMovie()}})
}
const cubeScene=document.getElementById('cubeScene'),rubik=document.getElementById('rubik'),fireworks=document.getElementById('fireworks'),cubeResult=document.getElementById('cubeResult');
if(cubeScene&&rubik){
  let down=false,lastX=0,lastY=0,rotX=-24,rotY=38,solved=false,solveTimer=null;
  const renderCube=()=>{rubik.style.transform=`rotateX(${rotX}deg) rotateY(${rotY}deg)`};
  renderCube();
  const burst=()=>{
    if(!fireworks)return;fireworks.innerHTML='';
    const colors=['#ffc85c','#55e6d5','#ff746c','#62e291','#a99cff','#e8f3f1'];
    for(let i=0;i<34;i++){
      const s=document.createElement('i');s.className='spark';
      const a=Math.PI*2*i/34,d=48+Math.random()*65;
      s.style.setProperty('--x',(Math.cos(a)*d)+'px');s.style.setProperty('--y',(Math.sin(a)*d)+'px');s.style.setProperty('--spark',colors[i%colors.length]);
      fireworks.appendChild(s)
    }
  };
  cubeScene.addEventListener('pointerdown',e=>{
    if(solveTimer){clearTimeout(solveTimer);solveTimer=null}
    down=true;lastX=e.clientX;lastY=e.clientY;rubik.classList.add('dragging');
    cubeScene.setPointerCapture(e.pointerId);hobbyMessage('RUBIK · rotate freely in 360°')
  });
  cubeScene.addEventListener('pointermove',e=>{
    if(!down)return;
    const dx=e.clientX-lastX,dy=e.clientY-lastY;
    rotY+=dx*.8;rotX-=dy*.8;lastX=e.clientX;lastY=e.clientY;
    renderCube()
  });
  const finishCube=()=>{
    if(!down)return;down=false;rubik.classList.remove('dragging');
    if(!solved){
      solved=true;
      solveTimer=setTimeout(()=>{
        rubik.classList.add('solved');if(cubeResult)cubeResult.textContent='SOLVED! ✦';
        hobbyMessage('RUBIK · solved · celebration!');burst();
        setTimeout(()=>{solved=false;rubik.classList.remove('solved');if(cubeResult)cubeResult.textContent='';if(fireworks)fireworks.innerHTML=''},2600)
      },260)
    }
  };
  cubeScene.addEventListener('pointerup',finishCube);cubeScene.addEventListener('pointercancel',finishCube)
}

// ---------- command palette ----------
const palette = document.getElementById('palette'), paletteInput = document.getElementById('paletteInput'), paletteList = document.getElementById('paletteList');
const destinations = [['Profile Snapshot','#profile'],['Professional Experience','#experience'],['Engineering + PowerShell Lab','#lab'],['Projects Workbench','#projects'],['Technical Toolkit','#skills'],['Education Journey','#education'],['Contact','#contact'],['Off-duty Sign-off','#hobbies']];
function renderPalette(q = '') {
  if (!paletteList) return; paletteList.innerHTML = '';
  destinations.filter(x => x[0].toLowerCase().includes(q.toLowerCase())).forEach(([name, id]) => {
    const b = document.createElement('button'); b.innerHTML = `<span>${name}</span><span>${id}</span>`;
    b.addEventListener('click', () => { palette?.classList.remove('show'); document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' }); });
    paletteList.appendChild(b);
  });
}
function openPalette() { if (!palette) return; palette.classList.add('show'); renderPalette(); setTimeout(() => paletteInput?.focus(), 30); }
document.getElementById('cmdBtn')?.addEventListener('click', openPalette);
if (paletteInput) paletteInput.addEventListener('input', () => renderPalette(paletteInput.value));
if (palette) palette.addEventListener('click', e => { if (e.target === palette) palette.classList.remove('show'); });
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openPalette(); }
  if (e.key === 'Escape') palette?.classList.remove('show');
});
