(() => {
  if (window.__LUNEX_PATCH_LOADED__) return;
  window.__LUNEX_PATCH_LOADED__ = true;

  // ======================
  //  UI ANIMATIONS & CSS INJECTION 
  // ======================
  const style = document.createElement('style');
  style.innerHTML = `
    .chat-msg { animation: slideUpFade 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; opacity: 0; transform: translateY(15px); }
    @keyframes slideUpFade { to { opacity: 1; transform: translateY(0); } }
    .typing-dot { display: inline-block; width: 6px; height: 6px; background: var(--brand1, #8b5cf6); border-radius: 50%; margin: 0 2px; animation: pulseDot 1.4s infinite cubic-bezier(0.4, 0, 0.6, 1); }
    .typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .typing-dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes pulseDot { 0%, 100% { transform: scale(0.5); opacity: 0.5; } 50% { transform: scale(1.2); opacity: 1; } }
    .card { transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.3s ease; }
    .card:hover { transform: translateY(-6px) scale(1.02); box-shadow: 0 12px 24px rgba(0,0,0,0.4); }
    .view { transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1); }
    .view:not(.active) { opacity: 0; transform: scale(0.97); pointer-events: none; position: absolute; width: 100%; }
    .view.active { opacity: 1; transform: scale(1); position: relative; }
    @keyframes blinkCaret { 50% { border-color: transparent; } }
  `;
  document.head.appendChild(style);

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      for(let registration of registrations) { registration.unregister(); }
    });
  }

  const DISCORD_LINK = "https://discord.gg/5Nw5sd7qTB"; 
  const MOTD_TITLE = "Lunex V2.2 is Online 🚀";
  const MOTD_TEXT = "Welcome to the ultimate stealth experience. Check out the new Settings panel to set up your Panic Key and Tab Disguise!";

  const $ = (q, root = document) => root.querySelector(q);
  const $$ = (q, root = document) => Array.from(root.querySelectorAll(q));

  // ======================
  //  TERMINAL BOOT SEQUENCE (BULLETPROOF CACHE FIX)
  // ======================
  function runBootSequence() {
    const boot = $("#bootScreen");
    
    if (!boot || sessionStorage.getItem("lunex_booted")) {
      if(boot) boot.style.display = "none";
      return;
    }

    boot.style.display = "flex";

    const lines = [
      "[INITIATING SECURE CONNECTION...]",
      "[BYPASSING FIREWALL PROTOCOLS...]",
      "[LOADING LUNEX V2.2 KERNEL...]",
      "[ACCESS GRANTED]"
    ];
    
    const textDiv = $("#bootText");
    let delay = 0;
    
    lines.forEach((line) => {
      setTimeout(() => { textDiv.innerHTML += line + "<br>"; }, delay);
      delay += 400 + Math.random() * 300;
    });
    
    setTimeout(() => {
      boot.style.opacity = "0";
      setTimeout(() => boot.remove(), 600);
      sessionStorage.setItem("lunex_booted", "true");
    }, delay + 400);
  }

  // ======================
  //  V2 STEALTH SYSTEMS 
  // ======================
  let panicKey = localStorage.getItem("lunex_panic_key") || "`";
  let panicTarget = localStorage.getItem("lunex_panic_target") || "https://classroom.google.com";
  let disguiseActive = localStorage.getItem("lunex_disguise") === "true";

  window.addEventListener("keydown", (e) => {
    if (e.key === panicKey) { window.location.replace(panicTarget); }
    if (e.key === "Escape" && $("#overlay")?.classList.contains("open")) { closeGame(); }
  });

  const defaultTitle = "Lunex";
  const defaultIcon = $("#dynamic-favicon")?.href || "";
  const disguiseTitle = "Classes";
  const disguiseIcon = "https://ssl.gstatic.com/classroom/favicon.png";

  document.addEventListener("visibilitychange", () => {
    if (disguiseActive) {
      if (document.hidden) {
        document.title = disguiseTitle;
        if($("#dynamic-favicon")) $("#dynamic-favicon").href = disguiseIcon;
      } else {
        document.title = defaultTitle;
        if($("#dynamic-favicon")) $("#dynamic-favicon").href = defaultIcon;
      }
    }
  });

  function initSettings() {
    const bindBtn = $("#panicBindBtn");
    const targetSelect = $("#panicTargetSelect");
    const disguiseToggle = $("#disguiseToggle");
    
    if(!bindBtn) return;
    bindBtn.textContent = panicKey;
    targetSelect.value = panicTarget;
    disguiseToggle.checked = disguiseActive;

    bindBtn.addEventListener("click", () => {
      bindBtn.textContent = "Press any key...";
      bindBtn.classList.add("listening");
      const listener = (e) => {
        e.preventDefault();
        panicKey = e.key;
        localStorage.setItem("lunex_panic_key", panicKey);
        bindBtn.textContent = panicKey;
        bindBtn.classList.remove("listening");
        pulseToast(`Panic Key set to: ${panicKey}`);
        window.removeEventListener("keydown", listener);
      };
      window.addEventListener("keydown", listener);
    });

    targetSelect.addEventListener("change", (e) => {
      panicTarget = e.target.value;
      localStorage.setItem("lunex_panic_target", panicTarget);
      pulseToast("Cloak target updated.");
    });

    disguiseToggle.addEventListener("change", (e) => {
      disguiseActive = e.target.checked;
      localStorage.setItem("lunex_disguise", disguiseActive);
      pulseToast(disguiseActive ? "Auto-Disguise Armed 🛡️" : "Auto-Disguise Disabled");
    });
  }

  // ======================
  //  PREMIUM PARTICLE ENGINE (UPGRADED DUAL-COLOR EFFECT)
  // ======================
  const pCanvas = document.getElementById('particles-canvas');
  const ctx = pCanvas?.getContext('2d');
  let width, height, particles;

  function initParticles() {
      if(!pCanvas) return;
      width = pCanvas.width = window.innerWidth;
      height = pCanvas.height = window.innerHeight;
      particles = [];
      for (let i = 0; i < 75; i++) { 
          let color = Math.random() > 0.5 ? '139, 92, 246' : '14, 165, 233';
          particles.push({
              x: Math.random() * width, y: Math.random() * height,
              r: Math.random() * 2 + 1.5, speed: Math.random() * 0.4 + 0.1, 
              angle: Math.random() * Math.PI * 2, alpha: Math.random() * 0.7 + 0.3,
              color: color
          });
      }
  }

  function drawParticles() {
      if(!ctx) return;
      ctx.clearRect(0, 0, width, height);
      
      for (let i = 0; i < particles.length; i++) {
          let p = particles[i];
          p.y -= p.speed; p.x += Math.sin(p.angle) * 0.5; p.angle += 0.01;
          if (p.y < -10) { p.y = height + 10; p.x = Math.random() * width; }
          
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`; 
          ctx.shadowBlur = 15; ctx.shadowColor = `rgba(${p.color}, 0.8)`; 
          ctx.fill();

          for (let j = i + 1; j < particles.length; j++) {
              let p2 = particles[j];
              let dist = Math.hypot(p.x - p2.x, p.y - p2.y);
              if (dist < 120) {
                  ctx.beginPath();
                  ctx.moveTo(p.x, p.y);
                  ctx.lineTo(p2.x, p2.y);
                  ctx.strokeStyle = `rgba(139, 92, 246, ${(1 - dist/120) * 0.3})`;
                  ctx.lineWidth = 0.8;
                  ctx.stroke();
              }
          }
      }
      requestAnimationFrame(drawParticles);
  }
  if(pCanvas){ window.addEventListener('resize', initParticles); initParticles(); drawParticles(); }

  // ======================
  //  UI & Tabs
  // ======================
  function checkDailyPopup() {
    const today = new Date().toDateString();
    if (localStorage.getItem("lunex_last_motd") !== today) {
      const modal = $("#motdModal");
      if (modal) {
        $("#motdTitle").textContent = MOTD_TITLE; $("#motdText").textContent = MOTD_TEXT;
        modal.classList.add("open");
        $("#motdDoneBtn").addEventListener("click", () => { localStorage.setItem("lunex_last_motd", today); modal.classList.remove("open"); }, { once: true });
      }
    }
  }

  let currentView = "play";
  function setView(key) {
    currentView = key;
    $$(".sb-tab").forEach(b => b.classList.toggle("active", b.dataset.view === key));
    $$(".view").forEach(v => v.classList.toggle("active", v.id === `view-${key}`));
    addXP(1);
  }

  // ======================
  //  XP, PLAYTIME & TOAST
  // ======================
  const LS = { XP: "lunex_xp", LV: "lunex_lv", NAME: "lunex_name", CHAT: "lunex_chat", PLAYTIME: "lunex_playtime" };
  function getInt(key, d = 0) { const v = Number(localStorage.getItem(key)); return Number.isFinite(v) ? v : d; }
  function setInt(key, v) { localStorage.setItem(key, String(v | 0)); }
  function xpNeedForLevel(lv) { return 40 + (lv - 1) * 25 + Math.floor((lv - 1) * (lv - 1) * 2.2); }

  function syncLevelUI() {
    const lv = getInt(LS.LV, 1), xp = getInt(LS.XP, 0);
    if ($("#lv")) $("#lv").textContent = String(lv);
    if ($("#xp")) $("#xp").textContent = String(xp);
    if ($("#levelPill")) $("#levelPill").title = `Next level in ${Math.max(0, xpNeedForLevel(lv) - xp)} XP`;
  }
  function addXP(amount) {
    let lv = getInt(LS.LV, 1), xp = getInt(LS.XP, 0) + amount;
    let leveled = false;
    while (xp >= xpNeedForLevel(lv)) { xp -= xpNeedForLevel(lv); lv += 1; leveled = true; }
    setInt(LS.LV, lv); setInt(LS.XP, xp); syncLevelUI();
    if (leveled) pulseToast(`Level up! You’re Lv ${lv} ✨`);
  }

  let toastTimer = null;
  function pulseToast(text) {
    let t = $("#lunexToast");
    if (!t) {
      t = document.createElement("div"); t.id = "lunexToast";
      t.style.cssText = `position:fixed; left:50%; bottom:30px; transform:translateX(-50%) translateY(20px); z-index:99999; padding:14px 24px; border-radius:999px; border:1px solid rgba(255,255,255,.15); background:rgba(15, 20, 35, 0.95); color:rgba(255,255,255,.95); box-shadow:0 20px 40px rgba(0,0,0,.8); backdrop-filter:blur(12px); font-weight:700; font-size: 14px; opacity:0; transition: all .4s cubic-bezier(0.2, 0.8, 0.2, 1); pointer-events:none;`;
      document.body.appendChild(t);
    }
    t.textContent = text; void t.offsetWidth; t.style.opacity = "1"; t.style.transform = "translateX(-50%) translateY(0)";
    clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.style.opacity = "0"; t.style.transform = "translateX(-50%) translateY(15px)"; }, 2500);
  }

  let ptTimer = null;
  function startPlaytime() {
    if(ptTimer) return;
    ptTimer = setInterval(() => {
      let mins = getInt(LS.PLAYTIME, 0) + 1;
      setInt(LS.PLAYTIME, mins);
      if($("#ptDisplay")) $("#ptDisplay").innerText = formatPT(mins);
    }, 60000); 
  }
  function stopPlaytime() { clearInterval(ptTimer); ptTimer = null; }
  function formatPT(mins) {
    if(mins < 60) return `${mins} mins`;
    return `${Math.floor(mins/60)}h ${mins%60}m`;
  }

  // ======================
  //  Game Player Controls
  // ======================
  function openGame(game) { 
    const overlay = $("#overlay"); const frame = $("#playerFrame"); const pTitle = $("#playerTitle");
    if (!overlay || !frame) return; 
    pTitle.textContent = game.name; 
    frame.src = game.url; 
    const nTabBtn = $("#newTabBtn"); if(nTabBtn) nTabBtn.href = game.url; 
    overlay.classList.add("open"); 
    addXP(3); 
    startPlaytime(); 
  }

  function closeGame() { 
    const overlay = $("#overlay"); const frame = $("#playerFrame");
    if(overlay) overlay.classList.remove("open"); 
    if(frame) frame.src = ""; 
    stopPlaytime(); 
  }

  function makeCard(item, type) {
    const card = document.createElement("div"); card.className = "card";
    const img = document.createElement("img"); img.className = "thumb"; img.loading = "lazy"; img.alt = item.name; 
    img.src = thumbFor(item.name); 
    img.onerror = function() { this.onerror = null; this.style.opacity = '0'; }; 
    const body = document.createElement("div"); body.className = "cBody";
    const name = document.createElement("div"); name.className = "cName"; name.textContent = item.name;
    const desc = document.createElement("p"); desc.className = "cDesc"; desc.textContent = item.desc || "";
    const meta = document.createElement("div"); meta.className = "cMeta";
    const badge = document.createElement("span"); badge.className = "badge"; badge.textContent = type === "game" ? item.tag : item.category;
    meta.appendChild(badge); body.append(name, desc, meta); card.append(img, body);
    if (type === "game") { card.addEventListener("click", () => openGame(item), { passive: true }); } 
    else { card.addEventListener("click", () => { window.open(item.url, "_blank", "noopener"); addXP(2); }, { passive: true }); }
    return card;
  }

  // ======================
  //  Game Data & Dynamic Engine
  // ======================
  const BASE_GAMES = [
    { name:"2048", url:"https://ultima-10b.pages.dev/", tag:"Puzzle", desc:"Combine tiles to reach 2048." },
    { name:"A Small World Cup", url:"games/a-small-world-cup.html", tag:"Football", desc:"Funny ragdoll world cup physics." },
    { name:"Backfire", url:"https://backfire-b2j.pages.dev/", tag:"Shooter", desc:"Thrust backwards and blast enemies." },
    { name:"Basketball Bros", url:"https://b-b-aps.pages.dev/", tag:"Sports", desc:"1v1 arcade basketball fun." },
    { name:"Basketball Stars", url:"https://b-stars.pages.dev/", tag:"Sports", desc:"1v1 online basketball duels." },
    { name:"BitLife", url:"https://csk-1mm.pages.dev/", tag:"Simulation", desc:"Life choices, chaos, and storylines." },
    { name:"Blackjack Pays", url:"https://bj-p.pages.dev/", tag:"Cards", desc:"Try your luck in a classic blackjack game." },
    { name:"Blumgi Slime", url:"https://b-s-7r8.pages.dev/", tag:"Puzzle", desc:"Slingshot the slime to the portal." },
    { name:"Body Drop 3D", url:"https://bd3d.pages.dev/", tag:"Physics", desc:"Floppy ragdoll falling chaos." },
    { name:"Bottle Flip", url:"https://b-f.pages.dev/", tag:"Skill", desc:"Flip the bottle and land it perfectly." },
    { name:"BuildNowGG", url:"games/buildnowgg.html", tag:"Shooter", desc:"Fast-paced building and shooting arena." },
    { name:"Chrome Dino", url:"https://cdino.pages.dev/", tag:"Runner", desc:"Jump the cactus. You know the vibes." },
    { name:"Clash Royale", url:"games/clash-royale.html", tag:"Strategy", desc:"Real-time lane battle with spells and troops." },
    { name:"Crossy Road", url:"https://cr-cd1.pages.dev/", tag:"Arcade", desc:"Cross roads and rivers without dying." },
    { name:"CSGO Clicker", url:"https://cgc-ccz.pages.dev/", tag:"Idle", desc:"Idle clicker with crate-opening vibes." },
    { name:"Dadish", url:"https://d-d-b5h.pages.dev/", tag:"Platformer", desc:"Radish dad platformer." },
    { name:"Dadish 2", url:"https://d2-4nh.pages.dev/", tag:"Platformer", desc:"More radish dad chaos." },
    { name:"Dreadhead Parkour", url:"https://dh-p-rcg.pages.dev/", tag:"Platformer", desc:"Parkour through tricky obstacle courses." },
    { name:"Drift Boss", url:"https://d-b-7jj.pages.dev/", tag:"Cars", desc:"Tap to drift at the perfect time." },
    { name:"Drive Mad", url:"https://dms-5fz.pages.dev/", tag:"Cars", desc:"Insane bridge driving and flipping." },
    { name:"Duck Cricket", url:"https://dcricket.pages.dev/", tag:"Sports", desc:"Cricket with a twist… and ducks." },
    { name:"Eggy Car", url:"https://e-c.pages.dev/", tag:"Arcade", desc:"Balance the egg and don’t let it break." },
    { name:"Elastic Face", url:"https://e-f.pages.dev/", tag:"Sandbox", desc:"Stretch and deform faces for fun." },
    { name:"Factory Balls", url:"https://fb-5p5.pages.dev/", tag:"Logic", desc:"Paint the ball to match the target design." },
    { name:"FNAF 1", url:"games/fnaf1.html", tag:"Horror", desc:"Survive five nights at Freddy Fazbear’s." },
    { name:"FNAF 2", url:"games/fnaf2.html", tag:"Horror", desc:"New animatronics and a broken old pizzeria." },
    { name:"FNAF 3", url:"games/fnaf3.html", tag:"Horror", desc:"Haunted horror attraction with Springtrap." },
    { name:"FNAF 4", url:"games/fnaf4.html", tag:"Horror", desc:"Nightmare animatronics in a child’s bedroom." },
    { name:"Geometry Dash Lite", url:"https://g-d.pages.dev/", tag:"Platformer", desc:"Jump and fly through rhythm-based levels." },
    { name:"Hextris", url:"https://hextris-5cu.pages.dev/", tag:"Puzzle", desc:"Rotate the hexagon and match falling blocks." },
    { name:"Jelly Jump", url:"https://j-j-8j3.pages.dev/", tag:"Arcade", desc:"Jump up, stay alive, and chase scores." },
    { name:"Minesweeper", url:"https://minesweeper-qmp.pages.dev/", tag:"Puzzle", desc:"Classic puzzle — don’t click the mines." },
    { name:"Paper.io 2", url:"https://pio2.pages.dev/", tag:".io", desc:"Capture territory without getting cut off." },
    { name:"Parking Fury 3", url:"https://pf3.pages.dev/", tag:"Cars", desc:"Park perfectly without crashing." },
    { name:"Polytrack", url:"https://pt-7zu.pages.dev/", tag:"Racing", desc:"Low-poly racing with smooth drift." },
    { name:"Raft Wars", url:"https://r-w.pages.dev/", tag:"Strategy", desc:"Classic turn-based shooting fun." },
    { name:"Retro Bowl", url:"https://r-b.pages.dev/", tag:"Sports", desc:"Retro American football manager." },
    { name:"Rooftop Snipers 2", url:"https://rts-2.pages.dev/", tag:"Versus", desc:"One-button sniping duels on rooftops." },
    { name:"Run 3", url:"https://r3-b0y.pages.dev/", tag:"Runner", desc:"Run through space tunnels and rotate walls." },
    { name:"Slope", url:"https://sl-6j4.pages.dev/", tag:"Runner", desc:"Roll down an endless neon slope." },
    { name:"Snow Rider 3D", url:"https://sr3d.pages.dev/", tag:"Winter", desc:"Sled down the snowy hillside dodging obstacles." },
    { name:"Space Waves", url:"games/space-waves.html", tag:"Arcade", desc:"Fast reaction game through neon corridors." },
    { name:"Spacebar Clicker", url:"https://sp-c.pages.dev/", tag:"Clicker", desc:"Spam the spacebar and watch numbers rise." },
    { name:"Stack", url:"https://stack-7xe.pages.dev/", tag:"Arcade", desc:"Stack blocks as high as you can." },
    { name:"Stickman Hook", url:"https://stickman-hook.io/iframe/index.html", tag:"Physics", desc:"Swing through levels with perfect timing." },
    { name:"Subway Surfers Tokyo", url:"https://ss-tokyo.pages.dev/", tag:"Runner", desc:"Surf the rails and dodge obstacles." },
    { name:"Super Liquid Soccer", url:"https://sls-44g.pages.dev/", tag:"Football", desc:"Fluid, arcade-style football." },
    { name:"Supercold", url:"https://sc-8sl.pages.dev/", tag:"Shooter", desc:"Time moves when you move." },
    { name:"Tag", url:"https://t-9h6.pages.dev/", tag:"Multiplayer", desc:"Dodge and chase in crazy arenas." },
    { name:"Tap Tap Shots", url:"https://tts-57d.pages.dev/", tag:"Arcade", desc:"Time your taps to sink the ball." },
    { name:"Temple Run 2", url:"https://tempr2.pages.dev/", tag:"Runner", desc:"Sprint, dodge, and collect as you run." },
    { name:"Tennis Physics", url:"https://tp-7k1.pages.dev/", tag:"Sports", desc:"Wobbly ragdoll tennis." },
    { name:"Tower Crash 3D", url:"https://tc3d.pages.dev/", tag:"Arcade", desc:"Smash the coloured tower segments." },
    { name:"Under the Red Sky", url:"https://utrs.pages.dev/", tag:"Adventure", desc:"Atmospheric story-driven experience." },
    { name:"Wordle Unlimited", url:"https://w-u.pages.dev/", tag:"Word", desc:"Guess the word with unlimited rounds." },
    { name:"World’s Hardest Game", url:"https://whg-6h1.pages.dev/", tag:"Hard", desc:"Dodge the dots and reach the goal." }
  ];

  const EXTRA_GAMES = [
    { name:"Sky Riders", url:"https://studyquick.lbry.ru/storage/ag/g2/sky-riders/", tag:"Cars", desc:"High-speed stunts and airborne racing." },
    { name:"Highway Racer", url:"https://studyquick.lbry.ru/storage/ag/g/highway-racer", tag:"Cars", desc:"Weave through traffic and push top speed." },
    { name:"Super Star Car", url:"https://studyquick.lbry.ru/storage/ag/g/superstarcar/", tag:"Cars", desc:"Arcade driving with quick upgrades and speed." },
    { name:"Block Blast", url:"https://studyquick.lbry.ru/pages/other/interpreter/index.html?url=https://cdn.jsdelivr.net/gh/gn-math/html@main/6.html", tag:"Puzzle", desc:"Clear blocks, chain combos, beat your best." },
    { name:"Geometry Dash Full", url:"https://studyquick.lbry.ru/pages/other/interpreter/index.html?url=https://cdn.jsdelivr.net/gh/gn-math/html@main/27.html", tag:"Platformer", desc:"Rhythm platforming with tight timing jumps." },
    { name:"Cookie Clicker", url:"https://studyquick.lbry.ru/pages/other/interpreter/index.html?url=https://cdn.jsdelivr.net/gh/gn-math/html@main/82-aa.html", tag:"Idle", desc:"Click, upgrade, and let the numbers explode." },
    { name:"Angry Birds", url:"https://studyquick.lbry.ru/pages/other/interpreter/index.html?url=https://cdn.jsdelivr.net/gh/gn-math/html@main/63.html", tag:"Puzzle", desc:"Slingshot physics destruction with perfect shots." },
    { name:"Run 2", url:"https://studyquick.lbry.ru/pages/other/interpreter/index.html?url=https://cdn.jsdelivr.net/gh/gn-math/html@main/176.html", tag:"Runner", desc:"Classic tunnel-running platformer challenge." },
    { name:"Smashy Roads", url:"https://studyquick.lbry.ru/storage/ag/originals/smashyroad/", tag:"Cars", desc:"Cause chaos and escape the chase." },
    { name:"Bank Robbery", url:"https://studyquick.lbry.ru/storage/ag/arsenic/bank-robbery/", tag:"Action", desc:"Pull off the ultimate heist and escape." },
    { name:"Crazy Cattle", url:"https://studyquick.lbry.ru/storage/ag/arsenic/crazy-cattle-3d/", tag:"Arcade", desc:"Cause chaotic destruction with crazy cows." },
    { name:"Just Fall.lol", url:"https://studyquick.lbry.ru/storage/ag/arsenic/justfalllol/", tag:"Multiplayer", desc:"Competitive penguin falling battle royale." },
    { name:"Master Chess", url:"https://studyquick.lbry.ru/storage/ag/arsenic/master-chess/", tag:"Board", desc:"Classic strategic chess against AI or friends." },
    { name:"Battle Wheels", url:"https://studyquick.lbry.ru/storage/ag/arsenic/battle-wheels/", tag:"Action", desc:"Head-to-head vehicular combat arena." },
    { name:"Race Survival", url:"https://studyquick.lbry.ru/storage/ag/arsenic/race-survival-arena-king/", tag:"Racing", desc:"Survive the arena king race chaos." },
    { name:"Doors Online", url:"https://studyquick.lbry.ru/storage/ag/arsenic/doors-online/", tag:"Horror", desc:"Survive the haunted hotel rooms and entities." },
    { name:"Five Nights At Epstein's", url:"https://studyquick.lbry.ru/pages/other/interpreter/index.html?url=https://cdn.jsdelivr.net/gh/gn-math/html@main/710-fix.html", tag:"Horror", desc:"Survive the very strange people and escape the island!" },
    { name:"Soccer Skills World Cup", url:"https://studyquick.lbry.ru/storage/ag/arsenic/soccer-skills-world-cup/", tag:"Sports", desc:"Compete in the 3D soccer world cup tournament." },
    { name:"Stickman Bike", url:"https://studyquick.lbry.ru/storage/ag/arsenic/stickman-bike/", tag:"Racing", desc:"Ride your bike through difficult stickman tracks." },
    { name:"Table Tennis World Tour", url:"https://studyquick.lbry.ru/storage/ag/arsenic/table-tennis-world-tour/", tag:"Sports", desc:"Fast-paced global ping pong tournament." },
    { name:"FNAF Sister Location", url:"https://studyquick.lbry.ru/storage/ag/gn/185.html", tag:"Horror", desc:"Survive the terrifying underground facility." },
    { name:"Armed Forces.io", url:"https://studyquick.lbry.ru/storage/ag/arsenic/armed-forces-io/", tag:".io", desc:"Fast-paced 3D multiplayer military shooter." },
    { name:"Boxing Random", url:"https://studyquick.lbry.ru/storage/ag/echo/boxing-random/", tag:"Sports", desc:"Hilarious physics-based boxing with random rules." },
    { name:"Bullet Bros", url:"https://studyquick.lbry.ru/storage/ag/arsenic/bullet-bros/", tag:"Shooter", desc:"Physics-based platforming shooter with chaotic gunplay." },
    { name:"Crazy Bikes", url:"https://studyquick.lbry.ru/storage/ag/arsenic/crazy-bikes/", tag:"Racing", desc:"Perform stunts and race dirt bikes on crazy obstacle courses." },
    { name:"Crazy Cars", url:"https://studyquick.lbry.ru/storage/ag/arsenic/crazy-cars/", tag:"Cars", desc:"Drive fast, jump ramps, and collect stars in a 3D arena." },
    { name:"Ragdoll Hit", url:"https://studyquick.lbry.ru/storage/ag/originals/ragdoll-hit/", tag:"Physics", desc:"Beat down enemies using floppy ragdoll physics and weapons." },
    { name:"Voxiom.io", url:"https://studyquick.lbry.ru/storage/ag/arsenic/voxiom-io/", tag:".io", desc:"Voxel battle royale and crafting survival." },
    { name:"Bacon May Die", url:"https://studyquick.lbry.ru/storage/ag/arsenic/bacon-may-die/", tag:"Action", desc:"Pig fighting game with tons of weapons." },
    { name:"Moto X3M", url:"https://studyquick.lbry.ru/storage/ag/arsenic/moto-x3m/", tag:"Racing", desc:"Classic motorcycle stunt and racing game." },
    { name:"Vex 7", url:"https://studyquick.lbry.ru/storage/ag/arsenic/vex-7/", tag:"Platformer", desc:"Action platformer filled with deadly traps." },
    { name:"Time Shooter 2", url:"https://studyquick.lbry.ru/storage/ag/arsenic/time-shooter-2/", tag:"Shooter", desc:"Time only moves when you move, similar to Superhot." },
    { name:"EvoWorld.io", url:"https://studyquick.lbry.ru/storage/ag/arsenic/evoworld-io/", tag:".io", desc:"Evolve and survive in a multiplayer world." },
    { name:"Rocket Soccer Derby", url:"https://studyquick.lbry.ru/storage/ag/arsenic/rocket-soccer-derby/", tag:"Sports", desc:"Rocket League style car soccer action." },
    { name:"Tunnel Rush", url:"https://studyquick.lbry.ru/storage/ag/arsenic/tunnel-rush/", tag:"Arcade", desc:"Dodge obstacles at high speed through neon tunnels." },
    { name:"OvO", url:"https://studyquick.lbry.ru/storage/ag/arsenic/ovo/", tag:"Platformer", desc:"Fast-paced parkour platforming." }
  ];

  function mergeByName(base, extra) {
    const map = new Map(base.map(x => [x.name.toLowerCase(), x]));
    for (const x of extra) map.set(x.name.toLowerCase(), x);
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }

  let GAMES = [];
  let gameList = [];
  let gameFilterTag = "All";
  let gameQuery = "";
  const GITHUB_JSON_URL = "https://raw.githubusercontent.com/SibbOnE3/lunex-v2upd1/main/games.json";

  function slugify(name) { return name.toLowerCase().replace(/&/g, " and ").replace(/['"]/g, "").replace(/\./g, "").replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, ""); }
  function thumbFor(name) { return `thumbs/${slugify(name)}.png`; }

  function uniqueTags(list) { return ["All", ...Array.from(new Set(list.map(x => x.tag))).sort((a, b) => a.localeCompare(b))]; }
  
  function renderChips(container, tags, active, onPick) {
    if (!container) return; container.innerHTML = "";
    tags.forEach(t => {
      const c = document.createElement("button"); c.className = "chip" + (t === active ? " active" : "");
      c.textContent = t; c.onclick = () => onPick(t); container.appendChild(c);
    });
  }

  let onGamePick = (t) => { 
    gameFilterTag = t; 
    renderChips($("#gameChips"), uniqueTags(GAMES), gameFilterTag, onGamePick); 
    renderGames(); 
  };

  function renderGames() {
    const gameGrid = $("#gameGrid");
    if (!gameGrid) return; 
    gameGrid.innerHTML = ""; 
    const q = gameQuery.trim().toLowerCase();
    const filtered = gameList.filter(g => (gameFilterTag === "All" || g.tag === gameFilterTag) && (!q || (g.name + " " + g.tag + " " + g.desc).toLowerCase().includes(q)));
    const frag = document.createDocumentFragment();
    filtered.forEach(g => frag.appendChild(makeCard(g, "game")));
    gameGrid.appendChild(frag);
  }

  async function syncDatabase() {
    try {
      const response = await fetch(GITHUB_JSON_URL + "?nocache=" + Date.now());
      if (response.ok) {
        const remoteGames = await response.json();
        GAMES = mergeByName(BASE_GAMES, remoteGames); 
      } else {
        throw new Error("Network error");
      }
    } catch (e) {
      GAMES = mergeByName(BASE_GAMES, EXTRA_GAMES);
    }
    gameList = [...GAMES];
    if($("#gameChips")) renderChips($("#gameChips"), uniqueTags(GAMES), gameFilterTag, onGamePick);
    renderGames();
  }

  const APPS = [
    { name:"ChatGPT", url:"https://studyquick.lbry.ru/storage/ag/apps/chatgpt/", category:"AI", desc:"Ask, write, learn, and explore." },
    { name:"CrazyGames", url:"https://studyquick.lbry.ru/storage/ag/apps/crazygames/", category:"Games", desc:"Find and play browser games." },
    { name:"Discord", url:"https://studyquick.lbry.ru/storage/ag/apps/discord/", category:"Chat", desc:"Servers, voice, and communities." },
    { name:"Facebook", url:"https://studyquick.lbry.ru/storage/ag/apps/facebook/", category:"Social", desc:"Connect with friends, family, and communities." },
    { name:"GeForce NOW", url:"https://studyquick.lbry.ru/storage/ag/apps/geforce/", category:"Gaming", desc:"Cloud gaming from the browser." },
    { name:"GitHub", url:"https://studyquick.lbry.ru/storage/ag/apps/github/", category:"Dev", desc:"Code hosting and collaboration." },
    { name:"Google", url:"https://studyquick.lbry.ru/storage/ag/apps/google/", category:"Search", desc:"Search, docs, and everyday tools." },
    { name:"Kick", url:"/kick/", category:"Streaming", desc:"Live streams, gaming, and chatting." },
    { name:"Netflix", url:"https://studyquick.lbry.ru/storage/ag/apps/netflix/", category:"Streaming", desc:"Shows and movies to watch." },
    { name:"now.gg", url:"https://studyquick.lbry.ru/storage/ag/apps/nowgg/", category:"Gaming", desc:"Mobile games in your browser." },
    { name:"Reddit", url:"https://studyquick.lbry.ru/storage/ag/apps/reddit/", category:"Social", desc:"Communities, posts, and discussions." },
    { name:"Scratch", url:"https://studyquick.lbry.ru/storage/ag/apps/scratch/", category:"Dev", desc:"Create stories, games, and animations." },
    { name:"Snapchat", url:"https://studyquick.lbry.ru/storage/ag/apps/snapchat/", category:"Social", desc:"Messages, stories, and friends." },
    { name:"SoundCloud", url:"https://studyquick.lbry.ru/storage/ag/apps/soundcloud/", category:"Music", desc:"Discover and play tracks." },
    { name:"TikTok", url:"https://studyquick.lbry.ru/storage/ag/apps/tiktok/", category:"Social", desc:"Short-form videos and trends." },
    { name:"Twitch", url:"https://studyquick.lbry.ru/storage/ag/apps/twitch/", category:"Streaming", desc:"Live streams with chat." },
    { name:"X", url:"https://studyquick.lbry.ru/storage/ag/apps/x/", category:"Social", desc:"Posts, trends, and messages." },
    { name:"YouTube", url:"https://studyquick.lbry.ru/static/google-embed.html#https://youtube.com", category:"Video", desc:"Watch videos, creators, and clips." }
  ].sort((a, b) => a.name.localeCompare(b.name));

  let appFilter = "All"; let appQuery = "";
  function uniqueCats(list) { return ["All", ...Array.from(new Set(list.map(x => x.category))).sort((a, b) => a.localeCompare(b))]; }
  
  function renderApps() {
    const appGrid = $("#appGrid");
    if (!appGrid) return; 
    appGrid.innerHTML = ""; 
    const q = appQuery.trim().toLowerCase();
    const list = APPS.filter(a => (appFilter === "All" || a.category === appFilter) && (!q || (a.name + " " + a.category + " " + a.desc).toLowerCase().includes(q)));
    const frag = document.createDocumentFragment(); list.forEach(a => frag.appendChild(makeCard(a, "app"))); appGrid.appendChild(frag);
  }

  // Webhook Requests
  function openReqModal() { 
      const reqModal = $("#reqModal");
      if(reqModal) { 
          $("#reqFormArea").style.display = "block"; 
          $("#reqSuccessArea").style.display = "none"; 
          reqModal.classList.add("open"); 
      } 
  }
  
  // Profile System
  function renderProfile() {
    const profileBox = $("#profileBox"); if (!profileBox) return;
    const name = localStorage.getItem(LS.NAME) || "Player";
    const playtime = formatPT(getInt(LS.PLAYTIME, 0));
    profileBox.innerHTML = `
      <div style="display:flex; align-items:center; gap:16px; margin-bottom: 20px;">
        <div style="width:60px; height:60px; border-radius:16px; display:grid; place-items:center; background:linear-gradient(135deg, var(--brand1), var(--brand3)); font-weight:900; font-size: 24px;">${String(name).slice(0, 1).toUpperCase()}</div>
        <div>
          <div style="font-weight:800; font-size:20px;">${escapeHtml(name)}</div>
          <div style="color:var(--muted); font-size:13px; margin-top:2px;">
            Level ${getInt(LS.LV, 1)} • ${getInt(LS.XP, 0)} XP <br>
            <span style="color: var(--brand2); font-weight:600;">⏱️ <span id="ptDisplay">${playtime}</span> Playtime</span>
          </div>
        </div>
      </div>
      <div style="display:flex; gap:12px; align-items:center;">
        <input id="nameInput" class="search" style="margin:0; padding:10px 14px;" placeholder="Set nickname..." value="${escapeAttr(name)}" />
        <button class="btn" id="saveName" style="padding: 10px 16px;">Save</button>
      </div>
    `;
    $("#saveName")?.addEventListener("click", () => { localStorage.setItem(LS.NAME, ($("#nameInput")?.value || "").trim().slice(0, 24) || "Player"); pulseToast("Profile Saved!"); renderProfile(); });
  }
  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m])); }
  function escapeAttr(s) { return escapeHtml(s).replace(/"/g, "&quot;"); }

  // ======================
  //  THE LUNA AI ENGINE
  // ======================
  function formatMarkdown(content) {
    return escapeHtml(content)
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');
  }

  function appendBubble(role, content, animateTyping = false) {
    const log = $("#chatLog"); if (!log) return;
    const row = document.createElement("div"); 
    row.className = `chat-msg ${role}`;
    log.appendChild(row);
    
    if (animateTyping) {
        let i = 0; let speed = 15;
        let interval = setInterval(() => {
            row.innerHTML = formatMarkdown(content.substring(0, i)) + "<span style='border-right: 2px solid var(--brand1); margin-left:2px; animation: blinkCaret 0.8s infinite;'></span>";
            log.scrollTop = log.scrollHeight;
            i++;
            if (i > content.length) { clearInterval(interval); row.innerHTML = formatMarkdown(content); }
        }, speed);
    } else {
        row.innerHTML = formatMarkdown(content);
        log.scrollTop = log.scrollHeight;
    }
  }

  function refreshChatLog() {
    const log = $("#chatLog"); if (!log) return; 
    const bubbles = log.querySelectorAll('.chat-msg');
    bubbles.forEach(b => b.remove());
    const history = JSON.parse(localStorage.getItem(LS.CHAT) || "[]");
    if (history.length > 0 && $("#aiPrompts")) { $("#aiPrompts").style.display = "none"; }
    if (history.length === 0) { appendBubble("assistant", "Hi there! I am Luna, your AI assistant for the Lunex Network. How can I help you today? ✨"); } 
    else { history.forEach(m => appendBubble(m.role, m.content)); }
  }

  async function handleChatSend(overrideText = null) {
    const input = $("#chatInput"); 
    const text = (overrideText || input.value || "").trim(); 
    if (!text) return; 
    
    input.value = "";
    if ($("#aiPrompts")) $("#aiPrompts").style.display = "none"; 
    
    const h = JSON.parse(localStorage.getItem(LS.CHAT) || "[]"); 
    h.push({ role: "user", content: text });
    appendBubble("user", text); 
    addXP(2); 

    const log = $("#chatLog");
    const typingId = "typing-" + Date.now();
    const typingDiv = document.createElement("div");
    typingDiv.id = typingId;
    typingDiv.className = "chat-msg bot";
    typingDiv.innerHTML = `<div style="display:flex; align-items:center; height:18px;"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div>`;
    log.appendChild(typingDiv);
    log.scrollTop = log.scrollHeight;

    try {
      const selectedModel = $("#lunaModelSelect")?.value || "openai"; 
      const res = await fetch("https://text.pollinations.ai/", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "You are Luna, the cool AI mascot for Lunex V2. Keep responses short, helpful, and chill." },
            ...h.map(msg => ({ role: msg.role, content: msg.content }))
          ],
          model: selectedModel
        })
      });

      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      const reply = await res.text(); 
      document.getElementById(typingId)?.remove();
      h.push({ role: "assistant", content: reply });
      localStorage.setItem(LS.CHAT, JSON.stringify(h.slice(-20))); 
      appendBubble("assistant", reply, true);
    } catch (e) {
      console.error("🔴 LUNA AI CRASH REPORT:", e); 
      document.getElementById(typingId)?.remove();
      appendBubble("assistant", `Oops! My brain crashed. **Error:** \`${e.message}\`. (Check the Console!) 😵`);
    }
  }

  // ======================
  //  THE MASTER INIT (Race Condition Fix)
  // ======================
  function init() {
    runBootSequence(); 
    syncLevelUI(); checkDailyPopup(); initSettings(); setTimeout(mountAds, 2000);

    $$(".sb-tab").forEach(btn => btn.addEventListener("click", () => setView(btn.dataset.view)));
    $$(".discord-link-btn").forEach(btn => btn.addEventListener("click", () => window.open(DISCORD_LINK, "_blank")));

    $("#closeBtn")?.addEventListener("click", closeGame);
    $("#overlay")?.addEventListener("click", (e) => { if (e.target === $("#overlay")) closeGame(); });
    $("#fsBtn")?.addEventListener("click", async () => { try { if ($("#playerFrame")?.requestFullscreen) await $("#playerFrame").requestFullscreen(); } catch { } });
    
    $("#shuffleGames")?.addEventListener("click", () => {
      for (let i = gameList.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [gameList[i], gameList[j]] = [gameList[j], gameList[i]]; }
      renderGames(); addXP(1);
    });
    
    $("#boredBtn")?.addEventListener("click", () => { const pick = GAMES[Math.floor(Math.random() * GAMES.length)]; pulseToast(`Try: ${pick.name}`); openGame(pick); });
    
    $("#gameSearch")?.addEventListener("input", (e) => { gameQuery = e.target.value; renderGames(); });
    $("#appSearch")?.addEventListener("input", (e) => { appQuery = e.target.value; renderApps(); });

    $("#openReqBtnPlay")?.addEventListener("click", openReqModal);
    $("#cancelReq")?.addEventListener("click", () => { $("#reqModal")?.classList.remove("open"); });
    $("#closeReqSuccessBtn")?.addEventListener("click", () => { $("#reqModal")?.classList.remove("open"); });
    
    $("#submitReq")?.addEventListener("click", async () => {
      const WEBHOOK_URL = "https://discord.com/api/webhooks/1479177395582799882/nF3uzNjp9flRFDmleaDZ6BzEXZ14uqjH3xGZTf0Bd01TU6UsnYoLPNZADNeXCTX7EsSI"; 
      const name = $("#reqGameName").value.trim(); const notes = $("#reqGameDesc").value.trim();
      if (!name) return pulseToast("Please enter a game name!");
      const now = Date.now();
      if (localStorage.getItem("lastGameRequest") && now - localStorage.getItem("lastGameRequest") < 300000) return pulseToast("You are doing that too fast.");
      
      $("#submitReq").innerText = "Sending...";
      try {
        const res = await fetch(WEBHOOK_URL, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ embeds: [{ title: "🔔 Game Request", description: `**Game:** ${name}\n**Details:** ${notes || "None"}`, color: 9133238 }]})
        });
        if (res.ok) {
            $("#reqGameName").value = ""; $("#reqGameDesc").value = "";
            $("#reqFormArea").style.display = "none"; $("#reqSuccessArea").style.display = "block";
            localStorage.setItem("lastGameRequest", now);
        } else pulseToast("Network error.");
      } catch(e) { pulseToast("Error sending request."); }
      $("#submitReq").innerText = "Send Request";
    });

    refreshChatLog();
    $("#chatSend")?.addEventListener("click", () => handleChatSend());
    $("#chatInput")?.addEventListener("keydown", (e) => { if (e.key === "Enter") handleChatSend(); });
    $$(".prompt-pill").forEach(btn => { btn.addEventListener("click", () => handleChatSend(btn.innerText)); });

    syncDatabase(); 
    const onAppPick = (t) => { appFilter = t; renderChips($("#appChips"), uniqueCats(APPS), appFilter, onAppPick); renderApps(); };
    if($("#appChips")) renderChips($("#appChips"), uniqueCats(APPS), appFilter, onAppPick); 
    renderApps();
    renderProfile(); 
  }
  
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();