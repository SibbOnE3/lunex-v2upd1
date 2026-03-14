(() => {
  if (window.__LUNEX_PATCH_LOADED__) return;
  window.__LUNEX_PATCH_LOADED__ = true;

  const style = document.createElement('style');
  style.innerHTML = `
    .chat-msg { animation: slideUpFade 0.3s ease forwards; opacity: 0; transform: translateY(10px); }
    @keyframes slideUpFade { to { opacity: 1; transform: translateY(0); } }
    .typing-dot { display: inline-block; width: 6px; height: 6px; background: var(--brand1, #8b5cf6); border-radius: 50%; margin: 0 2px; animation: pulseDot 1.4s infinite; }
    .typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .typing-dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes pulseDot { 0%, 100% { transform: scale(0.5); opacity: 0.5; } 50% { transform: scale(1.2); opacity: 1; } }
    .card { animation: fadeInCard 0.3s ease forwards; opacity: 0; }
    @keyframes fadeInCard { to { opacity: 1; } }
    #gameScrollSentinel { transition: opacity 0.3s; }
  `;
  document.head.appendChild(style);

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      for(let registration of registrations) { registration.unregister(); }
    });
  }

  const DISCORD_LINK = "https://discord.gg/5Nw5sd7qTB"; 
  const MOTD_TITLE = "Lunex V2.6 is Online ⚡";
  const MOTD_TEXT = "Welcome to the Stealth & Speed update. The entire engine has been optimized for maximum performance.";

  const $ = (q, root = document) => root.querySelector(q);
  const $$ = (q, root = document) => Array.from(root.querySelectorAll(q));

  // Base64 Decoders for Evasion
  const getProxyUrl = () => atob("aHR0cHM6Ly8zZC5tYW5pY3Jlc2luLmNvbS8=");
  const getMusicUrl = () => atob("aHR0cHM6Ly9tb25vY2hyb21lLnRmLw==");
  const getWebhook = () => atob("aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3MvMTQ3OTE3NzM5NTU4Mjc5OTg4Mi9uRjN1ek5qcDlmbFJGRG1sZWFEejZCekVYWjE0dXFqSDN4R1pUZjBCZDAxVFU2VXNuWW9MUE5aQUROZVhDVFg3RXNTSQ==");

  window.resetProxy = () => { $("#lunex-proxy-frame").src = getProxyUrl(); };
  window.reloadProxy = () => { const f = $("#lunex-proxy-frame"); f.src = f.src; };

  function runBootSequence() {
    const boot = $("#bootScreen");
    if (!boot || sessionStorage.getItem("lunex_booted")) {
      if(boot) boot.style.display = "none";
      return;
    }
    boot.style.display = "flex";

    const lines = [
      "Initializing core subsystems...",
      "Bypassing network firewalls...",
      "Loading Fast Particle Engine...",
      "Injecting modules...",
      "ACCESS GRANTED."
    ];
    
    const textDiv = $("#bootText");
    let delay = 0;
    
    lines.forEach((line, index) => {
      setTimeout(() => {
        if(textDiv) textDiv.innerHTML += `> ${line}<br>`;
        if(index === lines.length - 1) {
            const cursor = $("#bootCursor");
            if(cursor) cursor.style.display = "none";
            setTimeout(() => {
                boot.style.opacity = "0";
                setTimeout(() => boot.remove(), 400);
                sessionStorage.setItem("lunex_booted", "true");
            }, 600);
        }
      }, delay);
      delay += 200 + Math.random() * 150; // Sped up boot
    });
  }

  let panicKey = localStorage.getItem("lunex_panic_key") || "`";
  let panicTarget = localStorage.getItem("lunex_panic_target") || "https://classroom.google.com";
  let disguiseActive = localStorage.getItem("lunex_disguise") === "true";

  window.addEventListener("keydown", (e) => {
    if (e.key === panicKey) { window.location.replace(panicTarget); }
    if (e.key === "Escape" && $("#overlay")?.classList.contains("open")) { closeGame(); }
  });

  const defaultTitle = "Dashboard";
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
    if(targetSelect) targetSelect.value = panicTarget;
    if(disguiseToggle) disguiseToggle.checked = disguiseActive;

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

    targetSelect?.addEventListener("change", (e) => {
      panicTarget = e.target.value;
      localStorage.setItem("lunex_panic_target", panicTarget);
      pulseToast("Cloak target updated.");
    });

    disguiseToggle?.addEventListener("change", (e) => {
      disguiseActive = e.target.checked;
      localStorage.setItem("lunex_disguise", disguiseActive);
      pulseToast(disguiseActive ? "Auto-Disguise Armed 🛡️" : "Auto-Disguise Disabled");
    });
  }

  // OPTIMIZED PARTICLE ENGINE (No shadowBlur, highly performant)
  function initParticles() {
      const pCanvas = document.getElementById('particles-canvas');
      if (!pCanvas) return;
      const ctx = pCanvas.getContext('2d', { alpha: false }); // Optimization
      let w = pCanvas.width = window.innerWidth;
      let h = pCanvas.height = window.innerHeight;
      let particles = [];

      for (let i = 0; i < 50; i++) { // Reduced count for speed
          particles.push({
              x: Math.random() * w,
              y: Math.random() * h,
              r: Math.random() * 2 + 1,
              dx: (Math.random() - 0.5) * 0.5,
              dy: (Math.random() - 0.5) * 0.5,
              color: Math.random() > 0.5 ? '139, 92, 246' : '14, 165, 233', 
              alpha: Math.random() * 0.4 + 0.1
          });
      }

      function draw() {
          // Fast clear
          ctx.fillStyle = '#03050a';
          ctx.fillRect(0, 0, w, h);
          
          particles.forEach((p) => {
              p.x += p.dx;
              p.y += p.dy;
              if (p.x < 0 || p.x > w) p.dx *= -1;
              if (p.y < 0 || p.y > h) p.dy *= -1;

              ctx.beginPath();
              ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
              // Removed shadowBlur to fix lag
              ctx.fill();
          });
          requestAnimationFrame(draw);
      }
      
      draw();
      window.addEventListener('resize', () => {
          w = pCanvas.width = window.innerWidth;
          h = pCanvas.height = window.innerHeight;
      });
  }

  function checkDailyPopup() {
    const today = new Date().toDateString();
    if (localStorage.getItem("lunex_last_motd") !== today) {
      const modal = $("#motdModal");
      if (modal) {
        if($("#motdTitle")) $("#motdTitle").textContent = MOTD_TITLE; 
        if($("#motdText")) $("#motdText").textContent = MOTD_TEXT;
        modal.classList.add("open");
        $("#motdDoneBtn")?.addEventListener("click", () => { localStorage.setItem("lunex_last_motd", today); modal.classList.remove("open"); }, { once: true });
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

  function getInt(key, d = 0) { const v = Number(localStorage.getItem(key)); return Number.isFinite(v) ? v : d; }
  function setInt(key, v) { localStorage.setItem(key, String(v | 0)); }
  function xpNeedForLevel(lv) { return 40 + (lv - 1) * 25 + Math.floor((lv - 1) * (lv - 1) * 2.2); }

  function syncLevelUI() {
    const lv = getInt("lunex_lv", 1), xp = getInt("lunex_xp", 0);
    if ($("#lv")) $("#lv").textContent = String(lv);
    if ($("#xp")) $("#xp").textContent = String(xp);
    if ($("#levelPill")) $("#levelPill").title = `Next level in ${Math.max(0, xpNeedForLevel(lv) - xp)} XP`;
  }
  function addXP(amount) {
    let lv = getInt("lunex_lv", 1), xp = getInt("lunex_xp", 0) + amount;
    let leveled = false;
    while (xp >= xpNeedForLevel(lv)) { xp -= xpNeedForLevel(lv); lv += 1; leveled = true; }
    setInt("lunex_lv", lv); setInt("lunex_xp", xp); syncLevelUI();
    if (leveled) pulseToast(`Level up! You’re Lv ${lv} ✨`);
  }

  let toastTimer = null;
  function pulseToast(text) {
    let t = $("#lunexToast");
    if (!t) {
      t = document.createElement("div"); t.id = "lunexToast";
      t.style.cssText = `position:fixed; left:50%; bottom:30px; transform:translateX(-50%) translateY(20px); z-index:99999; padding:14px 24px; border-radius:999px; border:1px solid rgba(255,255,255,.15); background:rgba(15, 20, 35, 0.95); color:rgba(255,255,255,.95); box-shadow:0 20px 40px rgba(0,0,0,.8); backdrop-filter:blur(12px); font-weight:700; font-size: 14px; opacity:0; transition: all .3s ease; pointer-events:none;`;
      document.body.appendChild(t);
    }
    t.textContent = text; void t.offsetWidth; t.style.opacity = "1"; t.style.transform = "translateX(-50%) translateY(0)";
    clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.style.opacity = "0"; t.style.transform = "translateX(-50%) translateY(15px)"; }, 2500);
  }

  let ptTimer = null;
  function startPlaytime() {
    if(ptTimer) return;
    ptTimer = setInterval(() => {
      let mins = getInt("lunex_playtime", 0) + 1;
      setInt("lunex_playtime", mins);
      if($("#ptDisplay")) $("#ptDisplay").innerText = formatPT(mins);
    }, 60000); 
  }
  function stopPlaytime() { clearInterval(ptTimer); ptTimer = null; }
  function formatPT(mins) {
    if(mins < 60) return `${mins} mins`;
    return `${Math.floor(mins/60)}h ${mins%60}m`;
  }

  let secretBuffer = "";
  window.addEventListener("keydown", (e) => {
    if (e.key.length === 1 || e.key === "!") {
      secretBuffer += e.key.toLowerCase();
      if (secretBuffer.length > 15) secretBuffer = secretBuffer.slice(-15);
      if (secretBuffer.endsWith("qwerty!")) { localStorage.setItem("lunex_no_ads", (Date.now() + 86400000).toString()); pulseToast("Ads disabled for 24 hours! 🤫"); secretBuffer = ""; }
    }
  });

  function mountAds() {
    if (localStorage.getItem("lunex_no_ads") && Date.now() < parseInt(localStorage.getItem("lunex_no_ads"))) return;
    try {
        const s1 = document.createElement("script"); s1.src = atob("aHR0cHM6Ly9wbDI4Njg0NTY1LmVmZmVjdGl2ZWdhdGVjcG0uY29tLzdiLzAyLzRkLzdiMDI0ZDY4YzZlN2Y3ZWQ0YTUxMjAxZGEyNzhhMjk0Lmpz"); s1.async = true; document.head.appendChild(s1);
        const s2 = document.createElement("script"); s2.src = atob("aHR0cHM6Ly9wbDI4Njg0NTY4LmVmZmVjdGl2ZWdhdGVjcG0uY29tL2Y4LzY4L2JlL2Y4NjhiZTExODQ2ZDlmOWU0ZmM5ZDAwYjI2MWIzY2QzLmpz"); s2.async = true; document.head.appendChild(s2);
    } catch(e) {}
  }

  // --- CORE CLOAKING FUNCTION ---
  // Opens links in a stealthy about:blank full-screen iframe
  function openInAboutBlank(url) {
    const win = window.open('about:blank');
    if (!win) {
      pulseToast("Popup blocked! Allow popups to use the new tab feature.");
      return;
    }
    const doc = win.document;
    
    // Inherit disguise if active
    doc.title = disguiseActive ? disguiseTitle : defaultTitle;
    const iconUrl = disguiseActive ? disguiseIcon : defaultIcon;
    const link = doc.createElement('link');
    link.rel = 'icon';
    link.href = iconUrl;
    doc.head.appendChild(link);

    // Style the body to eliminate whitespace/scrollbars
    doc.body.style.margin = '0';
    doc.body.style.height = '100vh';
    doc.body.style.overflow = 'hidden';
    doc.body.style.backgroundColor = '#000';
    
    // Create the iframe payload
    const iframe = doc.createElement('iframe');
    iframe.style.border = 'none';
    iframe.style.width = '100vw';
    iframe.style.height = '100vh';
    iframe.style.margin = '0';
    iframe.src = url;
    
    doc.body.appendChild(iframe);
  }

  function openGame(game) { 
    const overlay = $("#overlay"); const frame = $("#playerFrame"); const pTitle = $("#playerTitle");
    if (!overlay || !frame) return; 
    pTitle.textContent = game.name; 
    frame.src = game.url; 
    
    // Setup New Tab button using cloaking script
    const nTabBtn = $("#newTabBtn"); 
    if(nTabBtn) {
      nTabBtn.onclick = (e) => {
        e.preventDefault();
        openInAboutBlank(game.url);
        closeGame(); // Automatically close the overlay since they opened it in a new window
      };
    } 
    
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
    try {
        const card = document.createElement("div"); card.className = "card";
        const img = document.createElement("img"); img.className = "thumb"; 
        img.loading = "lazy"; img.decoding = "async"; // Speed optimization
        img.alt = item.name; 
        img.src = `thumbs/${(item.name || "").toLowerCase().replace(/&/g, " and ").replace(/['"]/g, "").replace(/\./g, "").replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "")}.png`; 
        img.onerror = function() { this.onerror = null; this.style.opacity = '0'; }; 
        const body = document.createElement("div"); body.className = "cBody";
        const name = document.createElement("div"); name.className = "cName"; name.textContent = item.name || "Unknown";
        const desc = document.createElement("p"); desc.className = "cDesc"; desc.textContent = item.desc || "";
        const meta = document.createElement("div"); meta.className = "cMeta";
        
        // Obfuscate UI tags slightly
        let uiTag = item.tag || "Module";
        if(type !== "game") uiTag = item.category || "App";
        
        const badge = document.createElement("span"); badge.className = "badge"; badge.textContent = uiTag;
        meta.appendChild(badge); body.append(name, desc, meta); card.append(img, body);
        
        // Use about:blank cloaking for apps as well
        if (type === "game") { card.addEventListener("click", () => openGame(item), { passive: true }); } 
        else { card.addEventListener("click", () => { openInAboutBlank(item.url); addXP(2); }); }
        return card;
    } catch(e) {
        return document.createElement("div");
    }
  }

  // ======================
  //  Game Data
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
    try {
        const map = new Map(base.map(x => [(x.name || "").toLowerCase(), x]));
        for (const x of extra) map.set((x.name || "").toLowerCase(), x);
        return Array.from(map.values()).sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } catch(e) {
        return base;
    }
  }

  let GAMES = [];
  let gameList = [];
  let gameFilterTag = "All";
  let gameQuery = "";
  
  let gamesLoaded = 0;
  const BATCH_SIZE = 30;

  const GITHUB_JSON_URL = "https://raw.githubusercontent.com/SibbOnE3/lunex-v2upd1/main/games.json";

  function uniqueTags(list) { return ["All", ...Array.from(new Set(list.map(x => x.tag || "Misc"))).sort((a, b) => a.localeCompare(b))]; }
  
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
    renderGames(true); 
  };

  function renderGames(reset = false) {
    const gameGrid = $("#gameGrid");
    if (!gameGrid) return; 

    const q = gameQuery.trim().toLowerCase();
    const filtered = gameList.filter(g => (gameFilterTag === "All" || g.tag === gameFilterTag) && (!q || ((g.name||"") + " " + (g.tag||"") + " " + (g.desc||"")).toLowerCase().includes(q)));

    if (reset) {
        gameGrid.innerHTML = "";
        gamesLoaded = 0;
    }

    const nextBatch = filtered.slice(gamesLoaded, gamesLoaded + BATCH_SIZE);
    
    const frag = document.createDocumentFragment();
    nextBatch.forEach(g => frag.appendChild(makeCard(g, "game")));
    gameGrid.appendChild(frag);

    gamesLoaded += nextBatch.length;

    const sentinel = $("#gameScrollSentinel");
    if (sentinel) {
        if (gamesLoaded < filtered.length) {
            sentinel.style.display = "flex";
        } else {
            sentinel.style.display = "none";
        }
    }
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
    renderGames(true);
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
  function uniqueCats(list) { return ["All", ...Array.from(new Set(list.map(x => x.category || "Misc"))).sort((a, b) => a.localeCompare(b))]; }
  
  function renderApps() {
    const appGrid = $("#appGrid");
    if (!appGrid) return; 
    appGrid.innerHTML = ""; 
    const q = appQuery.trim().toLowerCase();
    const list = APPS.filter(a => (appFilter === "All" || a.category === appFilter) && (!q || ((a.name||"") + " " + (a.category||"") + " " + (a.desc||"")).toLowerCase().includes(q)));
    const frag = document.createDocumentFragment(); list.forEach(a => frag.appendChild(makeCard(a, "app"))); appGrid.appendChild(frag);
  }
  
  function renderProfile() {
    const profileBox = $("#profileBox"); if (!profileBox) return;
    const name = localStorage.getItem("lunex_name") || "Player";
    const playtime = formatPT(getInt("lunex_playtime", 0));
    
    profileBox.innerHTML = `
      <div style="display:flex; align-items:center; gap:16px; margin-bottom: 20px;">
        <div style="width:64px; height:64px; border-radius:16px; display:grid; place-items:center; background:rgba(255,255,255,0.05); box-shadow: 0 4px 15px rgba(0,0,0,0.5);">
          <img src="lunex-logo.png" style="width: 36px; height: 36px; object-fit: contain;" onerror="this.outerHTML='<span style=\\'font-weight:900; font-size:24px; color:white;\\'>L</span>'">
        </div>
        <div>
          <div style="font-weight:800; font-size:20px; color:white;">${escapeHtml(name)}</div>
          <div style="color:var(--muted); font-size:13px; margin-top:2px;">
            Level ${getInt("lunex_lv", 1)} • ${getInt("lunex_xp", 0)} XP <br>
            <span style="color: var(--brand2); font-weight:600;">⏱️ <span id="ptDisplay">${playtime}</span> Playtime</span>
          </div>
        </div>
      </div>
      <div style="display:flex; gap:12px; align-items:center;">
        <input id="nameInput" class="search" style="margin:0; padding:12px 16px;" placeholder="Set nickname..." value="${escapeAttr(name)}" />
        <button class="btn" id="saveName" style="padding: 12px 20px;">Save</button>
      </div>
    `;
    $("#saveName")?.addEventListener("click", () => { localStorage.setItem("lunex_name", ($("#nameInput")?.value || "").trim().slice(0, 24) || "Player"); pulseToast("Profile Saved!"); renderProfile(); });
  }
  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m])); }
  function escapeAttr(s) { return escapeHtml(s).replace(/"/g, "&quot;"); }

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
    
    let history = [];
    try { history = JSON.parse(localStorage.getItem("lunex_chat") || "[]"); } catch(e) { localStorage.removeItem("lunex_chat"); }

    if (history.length > 0 && $("#aiPrompts")) { $("#aiPrompts").style.display = "none"; }
    if (history.length === 0) { appendBubble("assistant", "System active. How can I assist you on the network? ✨"); } 
    else { history.forEach(m => appendBubble(m.role, m.content)); }
  }

  async function handleChatSend(overrideText = null) {
    const input = $("#chatInput"); 
    const text = (overrideText || input.value || "").trim(); 
    if (!text) return; 
    
    if(input) input.value = "";
    if ($("#aiPrompts")) $("#aiPrompts").style.display = "none"; 
    
    let h = [];
    try { h = JSON.parse(localStorage.getItem("lunex_chat") || "[]"); } catch(e) { h = []; }
    
    h.push({ role: "user", content: text });
    appendBubble("user", text); 
    addXP(2); 

    const log = $("#chatLog");
    const typingId = "typing-" + Date.now();
    const typingDiv = document.createElement("div");
    typingDiv.id = typingId;
    typingDiv.className = "chat-msg bot";
    typingDiv.innerHTML = `<div style="display:flex; align-items:center; height:18px;"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div>`;
    if(log) { log.appendChild(typingDiv); log.scrollTop = log.scrollHeight; }

    try {
      const selectedModel = $("#lunaModelSelect")?.value || "openai"; 
      const res = await fetch("https://text.pollinations.ai/", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "You are the AI assistant for the Lunex Network. Keep responses short and helpful." },
            ...h.map(msg => ({ role: msg.role, content: msg.content }))
          ],
          model: selectedModel
        })
      });

      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      const reply = await res.text(); 
      document.getElementById(typingId)?.remove();
      h.push({ role: "assistant", content: reply });
      localStorage.setItem("lunex_chat", JSON.stringify(h.slice(-20))); 
      appendBubble("assistant", reply, true);
    } catch (e) {
      document.getElementById(typingId)?.remove();
      appendBubble("assistant", `Oops! Connection error. **Error:** \`${e.message}\`. 😵`);
    }
  }

  // ======================
  //  Clips Feed Engine (Mega Feed & Anti-Block)
  // ======================
  async function initClipsFeed() {
    const feed = document.getElementById("clipsFeed");
    const loading = document.getElementById("clipsLoading");
    if (!feed) return;

    // We fetch from a combination of subreddits to get a massive variety of videos
    const targetUrl = "https://www.reddit.com/r/TikTokCringe+gaming+dankvideos/hot.json?limit=100";
    
    // We wrap the URL in a public proxy so school Wi-Fi doesn't know you're hitting Reddit
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;

    let videoData = [];

    try {
      const res = await fetch(proxyUrl);
      if (!res.ok) throw new Error("Proxy fetch failed");
      
      // AllOrigins returns the raw text inside a 'contents' key
      const proxyData = await res.json();
      const redditJson = JSON.parse(proxyData.contents);
      
      // Filter for posts that are explicitly videos
      const posts = redditJson.data.children.filter(p => p.data.is_video && p.data.secure_media && p.data.secure_media.reddit_video);
      
      // Shuffle the array so it's a random mix of gaming, memes, etc.
      const shuffledPosts = posts.sort(() => 0.5 - Math.random());

      videoData = shuffledPosts.map(p => ({
        title: p.data.title,
        subreddit: p.data.subreddit_name_prefixed,
        url: p.data.secure_media.reddit_video.fallback_url 
      }));

    } catch (err) {
      console.error("Feed generation failed:", err);
      if (loading) {
          loading.innerHTML = `<div style="color: #fca5a5;">Failed to connect to media proxy. Network strictness too high.</div>`;
      }
      return;
    }

    if (loading) loading.remove();

    // Render the massive feed
    videoData.forEach((vid) => {
      const container = document.createElement("div");
      container.style.cssText = "height: 100%; width: 100%; scroll-snap-align: start; position: relative; display: flex; justify-content: center; align-items: center; background: #000;";
      
      container.innerHTML = `
        <video src="${vid.url}" loop muted playsinline style="height: 100%; width: 100%; object-fit: cover; cursor: pointer;"></video>
        
        <div style="position: absolute; bottom: 30px; left: 20px; right: 80px; text-shadow: 0 2px 4px rgba(0,0,0,0.8);">
          <div class="badge" style="display: inline-block; background: rgba(139, 92, 246, 0.3); color: #ddd; margin-bottom: 8px;">${vid.subreddit}</div>
          <h3 style="margin: 0; font-size: 15px; color: #fff; font-family: Inter; line-height: 1.4;">${escapeHtml(vid.title)}</h3>
          <p style="margin: 6px 0 0; font-size: 12px; color: rgba(255,255,255,0.6);">Tap to unmute / Pause</p>
        </div>
      `;

      const videoEl = container.querySelector("video");
      
      // Tap interaction
      videoEl.addEventListener("click", () => {
        if (videoEl.muted) videoEl.muted = false; 
        if (videoEl.paused) { videoEl.play(); } 
        else { videoEl.pause(); }
      });

      feed.appendChild(container);
    });

    // Intersection Observer to auto-play ONLY the video currently on screen
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const vid = entry.target.querySelector("video");
        if (!vid) return;
        
        if (entry.isIntersecting) {
          vid.play().catch(e => console.log("Autoplay blocked:", e));
        } else {
          vid.pause();
          vid.currentTime = 0; // Reset video when scrolled away
        }
      });
    }, { threshold: 0.6 });

    feed.querySelectorAll("div[style*='scroll-snap-align']").forEach(cont => observer.observe(cont));
  }

  function init() {
    try { initParticles(); } catch(e) { console.error("Particle Init Error:", e); }
    try { runBootSequence(); } catch(e) {}
    try { syncLevelUI(); checkDailyPopup(); initSettings(); } catch(e) {}
    
    // Inject proxy URLs dynamically to hide them from heuristic scanners
    setTimeout(() => { 
        try { mountAds(); } catch(e) {}
        const pFrame = document.getElementById('lunex-proxy-frame');
        if(pFrame && !pFrame.src) pFrame.src = getProxyUrl();
        const mFrame = document.getElementById('lunex-music-frame');
        if(mFrame && !mFrame.src) mFrame.src = getMusicUrl();
    }, 2000);

    try {
      $$(".sb-tab").forEach(btn => btn.addEventListener("click", () => setView(btn.dataset.view)));
      $$(".discord-link-btn").forEach(btn => btn.addEventListener("click", () => window.open(DISCORD_LINK, "_blank")));
      $("#closeBtn")?.addEventListener("click", closeGame);
      $("#overlay")?.addEventListener("click", (e) => { if (e.target === $("#overlay")) closeGame(); });
      $("#fsBtn")?.addEventListener("click", async () => { try { if ($("#playerFrame")?.requestFullscreen) await $("#playerFrame").requestFullscreen(); } catch { } });
      
      $("#shuffleGames")?.addEventListener("click", () => {
        for (let i = gameList.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [gameList[i], gameList[j]] = [gameList[j], gameList[i]]; }
        renderGames(true); addXP(1); 
      });
      
      $("#boredBtn")?.addEventListener("click", () => { const pick = GAMES[Math.floor(Math.random() * GAMES.length)]; pulseToast(`Running: ${pick.name}`); openGame(pick); });
      
      // SEARCH DEBOUNCE - Fixes lag when typing fast
      let searchTimeout;
      $("#gameSearch")?.addEventListener("input", (e) => { 
          clearTimeout(searchTimeout);
          searchTimeout = setTimeout(() => {
              gameQuery = e.target.value; 
              renderGames(true); 
          }, 150);
      });
      
      $("#appSearch")?.addEventListener("input", (e) => { appQuery = e.target.value; renderApps(); });

      $("#openReqBtnPlay")?.addEventListener("click", () => { 
        if($("#reqModal")) { $("#reqFormArea").style.display = "block"; $("#reqSuccessArea").style.display = "none"; $("#reqModal").classList.add("open"); } 
      });
      $("#cancelReq")?.addEventListener("click", () => { $("#reqModal")?.classList.remove("open"); });
      $("#closeReqSuccessBtn")?.addEventListener("click", () => { $("#reqModal")?.classList.remove("open"); });
      
      $("#submitReq")?.addEventListener("click", async () => {
        const name = $("#reqGameName")?.value.trim(); const notes = $("#reqGameDesc")?.value.trim();
        if (!name) return pulseToast("Please enter a name!");
        const now = Date.now();
        if (localStorage.getItem("lastGameRequest") && now - localStorage.getItem("lastGameRequest") < 300000) return pulseToast("You are doing that too fast.");
        
        $("#submitReq").innerText = "Sending...";
        try {
          const res = await fetch(getWebhook(), {
              method: "POST", headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ embeds: [{ title: "🔔 Module Request", description: `**Target:** ${name}\n**Details:** ${notes || "None"}`, color: 9133238 }]})
          });
          if (res.ok) {
              if($("#reqGameName")) $("#reqGameName").value = ""; 
              if($("#reqGameDesc")) $("#reqGameDesc").value = "";
              if($("#reqFormArea")) $("#reqFormArea").style.display = "none"; 
              if($("#reqSuccessArea")) $("#reqSuccessArea").style.display = "block";
              localStorage.setItem("lastGameRequest", now);
          } else pulseToast("Network error.");
        } catch(e) { pulseToast("Error sending request."); }
        if($("#submitReq")) $("#submitReq").innerText = "Send";
      });

      refreshChatLog();
      $("#chatSend")?.addEventListener("click", () => handleChatSend());
      $("#chatInput")?.addEventListener("keydown", (e) => { if (e.key === "Enter") handleChatSend(); });
      $$(".prompt-pill").forEach(btn => { btn.addEventListener("click", () => handleChatSend(btn.innerText)); });
    } catch(e) {}

    try {
      syncDatabase(); 
      const onAppPick = (t) => { appFilter = t; renderChips($("#appChips"), uniqueCats(APPS), appFilter, onAppPick); renderApps(); };
      if($("#appChips")) renderChips($("#appChips"), uniqueCats(APPS), appFilter, onAppPick); 
      renderApps();
      renderProfile(); 
      initClipsFeed(); // Mega-feed initialized here
      
      let sentinel = document.createElement("div");
      sentinel.id = "gameScrollSentinel";
      sentinel.innerHTML = `<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div> <span style="margin-left:12px; font-family:'Space Grotesk'; font-size: 15px;">Loading Network Modules...</span>`;
      sentinel.style.cssText = "display:none; justify-content:center; align-items:center; padding:40px; width:100%; color:var(--brand1); font-weight:800; opacity: 0.8;";
      
      const glassPanel = document.querySelector("#view-play .glass-panel");
      if (glassPanel) glassPanel.appendChild(sentinel);

      const observer = new IntersectionObserver((entries) => {
          if(entries[0].isIntersecting) {
              setTimeout(() => renderGames(false), 300);
          }
      }, { root: document.querySelector(".main-wrap"), rootMargin: "100px" });

      observer.observe(sentinel);

    } catch(e) {}
  }
  
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();