(() => {
  "use strict";

  const SAVE_KEY = "neon-empire-save-v1";
  const OFFLINE_CAP = 8 * 3600;
  const SPEED_MILESTONES = [10, 25, 50, 100, 200, 300, 400, 500, 750, 1000];
  const PAY_MILESTONES = [600, 700, 800, 900, 1100, 1200, 1500, 2000];
  const SUFFIXES = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc", "Ud", "Dd", "Td", "Qad", "Qid", "Sxd", "Spd", "Ocd", "Nod", "Vg"];

  const ICONS = {
    stall: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M4 14h24l-2 10H6L4 14Z"/><path d="M6 14V8l4-3h12l4 3v6"/><path d="M12 18v6M20 18v6"/></svg>`,
    arcade: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="8" y="4" width="16" height="12" rx="2"/><rect x="6" y="16" width="20" height="12" rx="2"/><circle cx="12" cy="22" r="1.4"/><circle cx="17" cy="22" r="1.4"/><path d="M12 8h8v4h-8z"/></svg>`,
    club: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M16 5l3 8h8l-6.5 5 2.5 8L16 21l-7 5 2.5-8L5 13h8z"/></svg>`,
    cafe: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M7 10h14v10a6 6 0 0 1-6 6h-2a6 6 0 0 1-6-6V10z"/><path d="M21 12h3a3 3 0 0 1 0 6h-3"/><path d="M11 5c0 2 2 2 2 4M16 5c0 2 2 2 2 4"/></svg>`,
    casino: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="16" cy="16" r="11"/><path d="M16 7l2.4 6.2H25l-5.2 3.8 2 6.2L16 19.6 10.2 23.2l2-6.2L7 13.2h6.6z"/></svg>`,
    factory: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 28V14l8 4V14l8 4V10l8-4v22z"/><path d="M8 28v-4M14 28v-4M20 28v-4M26 28v-4"/></svg>`,
    mall: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 28V12l12-6 12 6v16z"/><path d="M12 28V18h8v10"/><path d="M10 14h2M16 12h2M22 14h2"/></svg>`,
    port: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M16 4l6 14H10L16 4z"/><path d="M8 22h16l2 6H6z"/><path d="M16 18v4"/></svg>`,
    bank: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M5 13l11-7 11 7v3H5v-3z"/><path d="M8 16v8M16 16v8M24 16v8"/><path d="M5 24h22v3H5z"/></svg>`,
    lab: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="16" cy="16" r="3"/><ellipse cx="16" cy="16" rx="12" ry="5"/><ellipse cx="16" cy="16" rx="12" ry="5" transform="rotate(60 16 16)"/><ellipse cx="16" cy="16" rx="12" ry="5" transform="rotate(-60 16 16)"/></svg>`
  };

  const RANKS = [
    { at: 0, name: "ALLEY RAT" },
    { at: 10, name: "BLOCK BOSS" },
    { at: 40, name: "NEON LANDLORD" },
    { at: 100, name: "DISTRICT CHAIR" },
    { at: 250, name: "MEGACORP" },
    { at: 600, name: "SKYLINE KING" },
    { at: 1200, name: "SINGULARITY" }
  ];

  const CITY_SLOTS = [
    { id: "stall", x: -310, z: 50, w: 28 },
    { id: "arcade", x: -250, z: 10, w: 32 },
    { id: "club", x: -185, z: 40, w: 34 },
    { id: "cafe", x: -120, z: -10, w: 30 },
    { id: "casino", x: -50, z: 30, w: 40 },
    { id: "factory", x: 25, z: 5, w: 42 },
    { id: "mall", x: 100, z: 35, w: 46 },
    { id: "port", x: 175, z: -5, w: 38 },
    { id: "bank", x: 245, z: 25, w: 44 },
    { id: "lab", x: 320, z: 8, w: 36 }
  ];

  const BUSINESSES = [
    { id: "stall", name: "Street Stall", tag: "Noodles after midnight", baseCost: 3, costMult: 1.07, baseTime: 0.5, basePayout: 1, color: "#ff7a45" },
    { id: "arcade", name: "Holo Arcade", tag: "Cabinets that never sleep", baseCost: 45, costMult: 1.14, baseTime: 2.4, basePayout: 50, color: "#00e5ff" },
    { id: "club", name: "Pulse Club", tag: "Bass you can bill", baseCost: 520, costMult: 1.14, baseTime: 5, basePayout: 420, color: "#ff2bd6" },
    { id: "cafe", name: "Crypto Cafe", tag: "Caffeine and hash rates", baseCost: 8640, costMult: 1.13, baseTime: 12, basePayout: 4320, color: "#7cff6b" },
    { id: "casino", name: "Chrome Casino", tag: "The house always compounds", baseCost: 103680, costMult: 1.12, baseTime: 24, basePayout: 51840, color: "#ffd166" },
    { id: "factory", name: "Drone Works", tag: "Assembly in the clouds", baseCost: 1.24416e6, costMult: 1.13, baseTime: 48, basePayout: 622080, color: "#5b8cff" },
    { id: "mall", name: "Sky Mall", tag: "Luxury on level 240", baseCost: 1.492992e7, costMult: 1.12, baseTime: 96, basePayout: 7.46496e6, color: "#c77dff" },
    { id: "port", name: "Orbital Port", tag: "Freight to the dark side", baseCost: 1.7915904e8, costMult: 1.11, baseTime: 192, basePayout: 8.957952e7, color: "#4cc9f0" },
    { id: "bank", name: "Quantum Bank", tag: "Interest in superposition", baseCost: 2.14990848e9, costMult: 1.1, baseTime: 384, basePayout: 1.07495424e9, color: "#80ffdb" },
    { id: "lab", name: "Singularity Lab", tag: "Where the city dreams", baseCost: 2.579890176e10, costMult: 1.1, baseTime: 768, basePayout: 1.289945088e10, color: "#f72585" }
  ];

  const MANAGERS = [
    { id: "stall", name: "Mei Lin", title: "Night Chef", cost: 250, flavor: "Never drops the shutter. Broth on a closed loop." },
    { id: "arcade", name: "Rex Volt", title: "High Score", cost: 8000, flavor: "Keeps every cabinet humming past dawn." },
    { id: "club", name: "Nyx Halo", title: "Door Queen", cost: 100000, flavor: "The line never dies. Neither does the till." },
    { id: "cafe", name: "Ada Hash", title: "Barista-Miner", cost: 500000, flavor: "Double shot, double hash, zero downtime." },
    { id: "casino", name: "Silas Gild", title: "Pit Boss", cost: 2.5e6, flavor: "Luck is a spreadsheet if you own the floor." },
    { id: "factory", name: "Kite-7", title: "Foreman Drone", cost: 1.2e7, flavor: "A swarm that clocks itself in." },
    { id: "mall", name: "Vera Lux", title: "Concierge", cost: 6e7, flavor: "Every floor open. Every bag full." },
    { id: "port", name: "Captain Voss", title: "Harbor Ghost", cost: 3e8, flavor: "Ships leave before the paperwork exists." },
    { id: "bank", name: "Q. Sterling", title: "Actuary", cost: 1.5e9, flavor: "Interest collected in every timeline." },
    { id: "lab", name: "Dr. Ione", title: "Prime Mover", cost: 8e9, flavor: "The lab runs itself. Then it runs you." }
  ];

  const UPGRADES = [
    { id: "tap1", name: "Calibrated Tap", desc: "Core clicks pay ×2.", cost: 25, kind: "click", mult: 2 },
    { id: "tap2", name: "Servo Fist", desc: "Core clicks ×2 again.", cost: 400, kind: "click", mult: 2, req: "tap1" },
    { id: "tap3", name: "Neural Trigger", desc: "Core clicks ×3.", cost: 5000, kind: "click", mult: 3, req: "tap2" },
    { id: "tap4", name: "Quantum Finger", desc: "Core clicks ×5.", cost: 2e5, kind: "click", mult: 5, req: "tap3" },
    { id: "tap5", name: "God Mode Input", desc: "Core clicks ×10.", cost: 5e7, kind: "click", mult: 10, req: "tap4" },
    { id: "stall1", name: "Secret Broth", desc: "Street Stall ×3.", cost: 80, kind: "biz", biz: "stall", mult: 3 },
    { id: "stall2", name: "All-Night Permit", desc: "Street Stall ×3.", cost: 2500, kind: "biz", biz: "stall", mult: 3, req: "stall1" },
    { id: "arcade1", name: "Token Flood", desc: "Holo Arcade ×3.", cost: 2000, kind: "biz", biz: "arcade", mult: 3 },
    { id: "arcade2", name: "Free Play Fridays", desc: "Holo Arcade ×3.", cost: 25000, kind: "biz", biz: "arcade", mult: 3, req: "arcade1" },
    { id: "club1", name: "Velvet Rope", desc: "Pulse Club ×3.", cost: 18000, kind: "biz", biz: "club", mult: 3 },
    { id: "club2", name: "Headliner Drop", desc: "Pulse Club ×3.", cost: 2.2e5, kind: "biz", biz: "club", mult: 3, req: "club1" },
    { id: "cafe1", name: "Cold Brew Rigs", desc: "Crypto Cafe ×3.", cost: 1.2e5, kind: "biz", biz: "cafe", mult: 3 },
    { id: "casino1", name: "Loaded Dice", desc: "Chrome Casino ×3.", cost: 8e5, kind: "biz", biz: "casino", mult: 3 },
    { id: "factory1", name: "Swarm Firmware", desc: "Drone Works ×3.", cost: 6e6, kind: "biz", biz: "factory", mult: 3 },
    { id: "mall1", name: "Duty-Free Orbit", desc: "Sky Mall ×3.", cost: 5e7, kind: "biz", biz: "mall", mult: 3 },
    { id: "port1", name: "Darkside Lanes", desc: "Orbital Port ×3.", cost: 4e8, kind: "biz", biz: "port", mult: 3 },
    { id: "bank1", name: "Superposition Fees", desc: "Quantum Bank ×3.", cost: 3e9, kind: "biz", biz: "bank", mult: 3 },
    { id: "lab1", name: "Recursive Grant", desc: "Singularity Lab ×3.", cost: 2.5e10, kind: "biz", biz: "lab", mult: 3 },
    { id: "global1", name: "District Grid", desc: "All ventures ×2.", cost: 25000, kind: "global", mult: 2 },
    { id: "global2", name: "Citywide Franchise", desc: "All ventures ×2.", cost: 2e6, kind: "global", mult: 2, req: "global1" },
    { id: "global3", name: "Megacorp Charter", desc: "All ventures ×3.", cost: 5e8, kind: "global", mult: 3, req: "global2" },
    { id: "speed1", name: "Fiber Overclock", desc: "All timers 25% faster.", cost: 50000, kind: "speed", mult: 1.25 },
    { id: "speed2", name: "Light-Pipe Logistics", desc: "All timers 25% faster.", cost: 8e6, kind: "speed", mult: 1.25, req: "speed1" },
    { id: "crit1", name: "Lucky Wiring", desc: "Critical click chance +8%.", cost: 15000, kind: "crit", add: 0.08 },
    { id: "crit2", name: "Jackpot Fingers", desc: "Critical click chance +10%.", cost: 1.5e6, kind: "crit", add: 0.1, req: "crit1" }
  ];

  const CORE_SHOP = [
    { id: "start1", name: "Golden Start", desc: "Begin each run with $1,000.", cost: 1, kind: "start", value: 1000 },
    { id: "start2", name: "Vault Seed", desc: "Begin each run with $100,000.", cost: 8, kind: "start", value: 1e5, req: "start1" },
    { id: "ctap", name: "Twin Core", desc: "Permanent core click ×3.", cost: 2, kind: "click", mult: 3 },
    { id: "cfast", name: "Fast Lane", desc: "Permanent speed ×1.5.", cost: 3, kind: "speed", mult: 1.5 },
    { id: "cgrid", name: "Angel Grid", desc: "Permanent production ×2.", cost: 5, kind: "global", mult: 2 },
    { id: "cdisc", name: "Union Card", desc: "Managers cost 50% less.", cost: 4, kind: "mgrDisc", value: 0.5 },
    { id: "cauto", name: "Auto-Tap", desc: "The Core ticks once per second.", cost: 8, kind: "auto" },
    { id: "clucky", name: "Loaded Neon", desc: "Critical chance +12%.", cost: 6, kind: "crit", add: 0.12 },
    { id: "cgrid2", name: "Halo Charter", desc: "Permanent production ×3.", cost: 20, kind: "global", mult: 3, req: "cgrid" }
  ];

  const FEATS = [
    { id: "click1", name: "First Spark", desc: "Tap the Core.", test: (s) => s.totalClicks >= 1 },
    { id: "click100", name: "Callus", desc: "Tap the Core 100 times.", test: (s) => s.totalClicks >= 100 },
    { id: "click1k", name: "Machine", desc: "Tap the Core 1,000 times.", test: (s) => s.totalClicks >= 1000 },
    { id: "stall1", name: "Open for Business", desc: "Buy a Street Stall.", test: (s) => s.biz.stall.owned >= 1 },
    { id: "stall25", name: "Noodle Cartel", desc: "Own 25 Street Stalls.", test: (s) => s.biz.stall.owned >= 25 },
    { id: "arcade1", name: "Insert Coin", desc: "Open a Holo Arcade.", test: (s) => s.biz.arcade.owned >= 1 },
    { id: "all1", name: "Full Stack", desc: "Own at least one of every venture.", test: (s) => BUSINESSES.every((b) => s.biz[b.id].owned >= 1) },
    { id: "mgr1", name: "Delegation", desc: "Hire your first manager.", test: (s) => Object.values(s.biz).some((b) => b.manager) },
    { id: "mgrAll", name: "Ghost Shift", desc: "Hire every manager.", test: (s) => BUSINESSES.every((b) => s.biz[b.id].manager) },
    { id: "earn1k", name: "Four Figures", desc: "Earn $1,000 lifetime.", test: (s) => s.lifetimeEarned >= 1e3 },
    { id: "earn1m", name: "Millionaire", desc: "Earn $1,000,000 lifetime.", test: (s) => s.lifetimeEarned >= 1e6 },
    { id: "earn1b", name: "District Whale", desc: "Earn $1,000,000,000 lifetime.", test: (s) => s.lifetimeEarned >= 1e9 },
    { id: "crit10", name: "Hot Streak", desc: "Land 10 critical taps.", test: (s) => s.crits >= 10 },
    { id: "prestige1", name: "Ashes", desc: "Ascend once.", test: (s) => s.prestiges >= 1 },
    { id: "prestige3", name: "Phoenix Grid", desc: "Ascend 3 times.", test: (s) => s.prestiges >= 3 },
    { id: "combo10", name: "Rhythm", desc: "Reach a 10× combo.", test: (s) => s.stats.maxCombo >= 10 },
    { id: "play5", name: "Night Shift", desc: "Play for 5 minutes.", test: (s) => s.playTime >= 300 },
    { id: "upg5", name: "Spec Sheet", desc: "Buy 5 cash upgrades.", test: (s) => Object.values(s.upgrades).filter(Boolean).length >= 5 },
    { id: "boost", name: "Juice", desc: "Fire Overclock or Neon Surge.", test: (s) => s.stats.boosts >= 1 },
    { id: "lab1", name: "Event Horizon", desc: "Found the Singularity Lab.", test: (s) => s.biz.lab.owned >= 1 },
    { id: "orb1", name: "Catch a Star", desc: "Click a lucky neon orb.", test: (s) => (s.stats.orbs || 0) >= 1 },
    { id: "job1", name: "Contractor", desc: "Clear 3 contracts.", test: (s) => (s.stats.contracts || 0) >= 3 }
  ];

  const NEWS = [
    "Rain on Level 12. Street stall steam becomes a landmark.",
    "Holo Arcade reports a new world record. Tokens sold out by dawn.",
    "Pulse Club bass cracked a window in District 04. They sent flowers and an invoice.",
    "Crypto Cafe wifi now mines while you blink.",
    "Chrome Casino denies the dice are loaded. The dice decline comment.",
    "Drone Works unionized. The drones voted unanimously.",
    "Sky Mall opened a store that sells stores.",
    "Orbital Port lost a crate. It landed as a nightclub.",
    "Quantum Bank paid interest yesterday, today, and last Thursday at once.",
    "Singularity Lab asked for more power. The grid said please.",
    "Anonymous investor: 'The Core hummed at me. I hummed back.'",
    "City council tried to tax neon. The neon taxed them first.",
    "A manager clocked in so hard the till filed a complaint.",
    "Word on the wire: someone just bought the whole block with tap residue."
  ];

  const $ = (id) => document.getElementById(id);
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

  function formatNum(n, notation) {
    if (!isFinite(n)) return "∞";
    const sign = n < 0 ? "-" : "";
    n = Math.abs(n);
    if (notation === "sci") {
      if (n < 1000) return sign + (n < 10 ? n.toFixed(2) : n < 100 ? n.toFixed(1) : Math.floor(n).toString());
      return sign + n.toExponential(2).replace("+", "");
    }
    if (n < 1000) {
      if (n < 10) return sign + n.toFixed(2);
      if (n < 100) return sign + n.toFixed(1);
      return sign + Math.floor(n).toString();
    }
    const exp = Math.floor(Math.log10(n) / 3);
    const idx = Math.min(exp, SUFFIXES.length - 1);
    const val = n / Math.pow(1000, idx);
    let s = val >= 100 ? val.toFixed(1) : val >= 10 ? val.toFixed(2) : val.toFixed(3);
    s = s.replace(/\.?0+$/, "");
    return sign + s + SUFFIXES[idx];
  }
  const money = (n) => "$" + formatNum(n, state.notation);

  function emptyBiz() {
    const biz = {};
    for (const b of BUSINESSES) biz[b.id] = { owned: 0, timer: 0, running: false, manager: false, claim: 0 };
    return biz;
  }

  function newState() {
    return {
      version: 1,
      money: 0,
      runEarned: 0,
      lifetimeEarned: 0,
      totalClicks: 0,
      crits: 0,
      cores: 0,
      prestiges: 0,
      playTime: 0,
      lastSave: Date.now(),
      buyMult: 1,
      sound: true,
      particles: true,
      notation: "standard",
      tutorial: 0,
      combo: 0,
      lastClick: 0,
      biz: emptyBiz(),
      upgrades: {},
      coreUpgrades: {},
      feats: {},
      stats: { bought: 0, boosts: 0, maxCombo: 0, collected: 0, orbs: 0, contracts: 0 },
      boosts: {
        overclock: { until: 0, cd: 0 },
        surge: { until: 0, cd: 0 }
      },
      event: null,
      nextEventAt: 28,
      frenzyUntil: 0,
      nextOrbAt: 14,
      orb: null,
      contract: null
    };
  }

  let state = newState();
  let displayMoney = 0;
  let dirty = { ventures: true, upgrades: true, managers: true, prestige: true, feats: true };
  let lastTs = performance.now();
  let tab = "ventures";
  let audio;
  let fx;
  let comboTimer = 0;
  let moneyPopAt = 0;
  let cityDirty = true;
  let citySig = "";

  /* ---------- audio ---------- */
  const AudioEng = {
    ctx: null,
    ensure() {
      if (!state.sound) return null;
      if (!this.ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        this.ctx = new AC();
      }
      if (this.ctx.state === "suspended") this.ctx.resume();
      return this.ctx;
    },
    tone(freq, dur, type, gain, delay) {
      const ctx = this.ensure();
      if (!ctx) return;
      const t0 = ctx.currentTime + (delay || 0);
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type || "square";
      o.frequency.setValueAtTime(freq, t0);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(gain || 0.05, t0 + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      o.connect(g).connect(ctx.destination);
      o.start(t0);
      o.stop(t0 + dur + 0.02);
    },
    click() { this.tone(660, 0.06, "square", 0.04); },
    crit() { this.tone(880, 0.08, "square", 0.05); this.tone(1320, 0.1, "triangle", 0.04, 0.04); },
    buy() { this.tone(520, 0.08, "triangle", 0.05); this.tone(780, 0.1, "square", 0.03, 0.05); },
    collect() { this.tone(740, 0.07, "sine", 0.035); },
    unlock() { this.tone(440, 0.1, "square", 0.04); this.tone(554, 0.1, "square", 0.04, 0.08); this.tone(659, 0.16, "square", 0.05, 0.16); },
    bad() { this.tone(110, 0.12, "sawtooth", 0.04); },
    prestige() {
      [261, 329, 392, 523].forEach((f, i) => this.tone(f, 0.35, "triangle", 0.05, i * 0.08));
    }
  };

  /* ---------- particles ---------- */
  const Particles = {
    list: [],
    spawn(x, y, color, n) {
      if (!state.particles) return;
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = 60 + Math.random() * 180;
        this.list.push({
          x, y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp - 40,
          life: 0.45 + Math.random() * 0.35,
          age: 0,
          r: 1.5 + Math.random() * 2.5,
          color
        });
      }
    },
    tick(dt) {
      const c = fx.getContext("2d");
      const dpr = fx._dpr || 1;
      c.clearRect(0, 0, fx.width, fx.height);
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      for (let i = this.list.length - 1; i >= 0; i--) {
        const p = this.list[i];
        p.age += dt;
        if (p.age >= p.life) { this.list.splice(i, 1); continue; }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 240 * dt;
        const a = 1 - p.age / p.life;
        c.globalAlpha = a;
        c.fillStyle = p.color;
        c.beginPath();
        c.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        c.fill();
      }
      c.globalAlpha = 1;
    }
  };

  function resizeFx() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    fx.width = innerWidth * dpr;
    fx.height = innerHeight * dpr;
    fx.style.width = innerWidth + "px";
    fx.style.height = innerHeight + "px";
    fx._dpr = dpr;
  }

  function floatText(x, y, text, color) {
    const el = document.createElement("div");
    el.className = "float-num";
    el.textContent = text;
    el.style.left = x + "px";
    el.style.top = y + "px";
    el.style.color = color || "#3dff9a";
    $("floats").appendChild(el);
    setTimeout(() => el.remove(), 900);
  }

  function toast(title, body) {
    const el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = `<b>${title}</b>${body || ""}`;
    $("toasts").appendChild(el);
    setTimeout(() => el.remove(), 3000);
  }

  /* ---------- economy ---------- */
  function ownedUpgrade(id) { return !!state.upgrades[id]; }
  function ownedCore(id) { return !!state.coreUpgrades[id]; }

  function clickPower() {
    let p = 1;
    for (const u of UPGRADES) if (u.kind === "click" && ownedUpgrade(u.id)) p *= u.mult;
    for (const u of CORE_SHOP) if (u.kind === "click" && ownedCore(u.id)) p *= u.mult;
    const combo = 1 + Math.max(0, state.combo - 1) * 0.05;
    let m = p * combo * prestigeMult();
    if (nowSec() < (state.frenzyUntil || 0)) m *= 77;
    return m;
  }

  function critChance() {
    let c = 0.08;
    for (const u of UPGRADES) if (u.kind === "crit" && ownedUpgrade(u.id)) c += u.add;
    for (const u of CORE_SHOP) if (u.kind === "crit" && ownedCore(u.id)) c += u.add;
    return c;
  }

  function featBonus() {
    const n = Object.values(state.feats).filter(Boolean).length;
    return 1 + Math.floor(n / 5) * 0.01;
  }

  function prestigeMult() {
    return 1 + state.cores * 0.05;
  }

  function globalProd() {
    let m = prestigeMult() * featBonus();
    for (const u of UPGRADES) if (u.kind === "global" && ownedUpgrade(u.id)) m *= u.mult;
    for (const u of CORE_SHOP) if (u.kind === "global" && ownedCore(u.id)) m *= u.mult;
    if (nowSec() < state.boosts.surge.until) m *= 3;
    if (state.event && state.event.type === "gold" && nowSec() < state.event.until) m *= 2;
    return m;
  }

  function speedMult() {
    let m = 1;
    for (const u of UPGRADES) if (u.kind === "speed" && ownedUpgrade(u.id)) m *= u.mult;
    for (const u of CORE_SHOP) if (u.kind === "speed" && ownedCore(u.id)) m *= u.mult;
    if (nowSec() < state.boosts.overclock.until) m *= 5;
    if (state.event && state.event.type === "speed" && nowSec() < state.event.until) m *= 2;
    return m;
  }

  function bizMult(id) {
    let m = 1;
    for (const u of UPGRADES) if (u.kind === "biz" && u.biz === id && ownedUpgrade(u.id)) m *= u.mult;
    if (state.event && state.event.type === "biz" && state.event.biz === id && nowSec() < state.event.until) m *= 7;
    return m;
  }

  function halvings(owned) {
    let h = 0;
    for (const m of SPEED_MILESTONES) if (owned >= m) h++;
    return h;
  }

  function cycleTime(biz) {
    const owned = state.biz[biz.id].owned;
    let t = biz.baseTime * Math.pow(0.5, halvings(owned));
    t /= speedMult();
    return Math.max(0.05, t);
  }

  function payout(biz) {
    const owned = state.biz[biz.id].owned;
    if (owned <= 0) return 0;
    let p = biz.basePayout * owned;
    for (const m of PAY_MILESTONES) if (owned >= m) p *= 2;
    p *= bizMult(biz.id);
    p *= globalProd();
    return p;
  }

  function firstCost(biz) {
    return biz.baseCost * Math.pow(biz.costMult, state.biz[biz.id].owned);
  }

  function costFor(biz, n) {
    const first = firstCost(biz);
    if (n <= 1) return first;
    return first * (Math.pow(biz.costMult, n) - 1) / (biz.costMult - 1);
  }

  function maxAffordable(biz) {
    const first = firstCost(biz);
    if (state.money < first) return 0;
    const n = Math.floor(Math.log(1 + state.money * (biz.costMult - 1) / first) / Math.log(biz.costMult));
    return Math.max(1, n);
  }

  function nextMilestone(owned) {
    for (const m of SPEED_MILESTONES) if (owned < m) return m;
    for (const m of PAY_MILESTONES) if (owned < m) return m;
    return owned + 50;
  }

  function buyCount(biz) {
    if (state.buyMult === -1) return maxAffordable(biz);
    if (state.buyMult === -2) {
      const owned = state.biz[biz.id].owned;
      const need = nextMilestone(owned) - owned;
      const max = maxAffordable(biz);
      return Math.min(need, max);
    }
    const n = state.buyMult;
    return costFor(biz, n) <= state.money ? n : 0;
  }

  function totalClaim() {
    return BUSINESSES.reduce((a, b) => a + (state.biz[b.id].claim || 0), 0);
  }

  function districtRank() {
    const owned = BUSINESSES.reduce((a, b) => a + state.biz[b.id].owned, 0);
    let name = RANKS[0].name;
    for (const r of RANKS) if (owned >= r.at) name = r.name;
    return name;
  }

  function isUnlocked(i) {
    if (i === 0) return true;
    const prev = BUSINESSES[i - 1];
    if (state.biz[prev.id].owned >= 1) return true;
    if (state.lifetimeEarned >= BUSINESSES[i].baseCost * 0.4) return true;
    return false;
  }

  function addMoney(amount, source) {
    if (amount <= 0) return;
    state.money += amount;
    state.runEarned += amount;
    state.lifetimeEarned += amount;
    if (source === "collect") state.stats.collected++;
    moneyPopAt = performance.now();
  }

  function nowSec() { return state.playTime; }

  function pendingCores() {
    return Math.floor(Math.sqrt(state.runEarned / 1e6));
  }

  function startMoney() {
    let v = 0;
    for (const u of CORE_SHOP) if (u.kind === "start" && ownedCore(u.id)) v = Math.max(v, u.value);
    return v;
  }

  function mgrCost(m) {
    let c = m.cost;
    if (ownedCore("cdisc")) c *= 0.5;
    return c;
  }

  /* ---------- actions ---------- */
  function clickCore(x, y) {
    const now = performance.now();
    if (now - state.lastClick < 40) return;
    if (now - state.lastClick < 420) state.combo = Math.min(25, state.combo + 1);
    else state.combo = 1;
    state.lastClick = now;
    comboTimer = 0.45;
    if (state.combo > state.stats.maxCombo) state.stats.maxCombo = state.combo;
    state.totalClicks++;

    let gain = clickPower();
    let crit = false;
    if (Math.random() < critChance()) {
      gain *= 10;
      crit = true;
      state.crits++;
      document.body.classList.remove("shake");
      void document.body.offsetWidth;
      document.body.classList.add("shake");
      AudioEng.crit();
    } else AudioEng.click();

    addMoney(gain, "click");
    floatText(x, y, (crit ? "CRIT " : "+") + money(gain), crit ? "#ffd166" : "#3dff9a");
    Particles.spawn(x, y, crit ? "#ffd166" : "#00f5ff", crit ? 18 : 8);
    $("core").classList.add("hit");
    setTimeout(() => $("core").classList.remove("hit"), 90);
    if (state.tutorial === 0) state.tutorial = 1;
    dirty.feats = true;
    checkFeats();
    updateCoach();
  }

  function buyBiz(id) {
    const biz = BUSINESSES.find((b) => b.id === id);
    const i = BUSINESSES.indexOf(biz);
    if (!isUnlocked(i)) return;
    const n = buyCount(biz);
    if (n <= 0) { AudioEng.bad(); return; }
    const cost = costFor(biz, n);
    state.money -= cost;
    const s = state.biz[id];
    const wasZero = s.owned === 0;
    s.owned += n;
    state.stats.bought += n;
    if (wasZero) {
      AudioEng.unlock();
      toast("VENTURE ONLINE", biz.name);
      s.running = true;
      s.timer = 0;
    } else AudioEng.buy();
    if (s.manager) s.running = true;
    if (state.tutorial === 1 && id === "stall") state.tutorial = 2;
    if (state.contract && state.contract.type === "buy") {
      state.contract.progress += n;
    }
    dirty.ventures = true;
    dirty.upgrades = true;
    dirty.managers = true;
    dirty.feats = true;
    cityDirty = true;
    checkFeats();
    updateCoach();
  }

  function runBiz(id) {
    const s = state.biz[id];
    if (s.owned <= 0) return;
    if (s.claim > 0) { collectBiz(id); return; }
    if (s.running || s.manager) return;
    s.running = true;
    s.timer = 0;
    AudioEng.click();
    if (state.tutorial === 2) state.tutorial = 3;
    updateCoach();
  }

  function collectBiz(id, silent) {
    const s = state.biz[id];
    const gain = s.claim || 0;
    if (gain <= 0) return 0;
    s.claim = 0;
    addMoney(gain, "collect");
    if (state.contract && state.contract.type === "collect") state.contract.progress += 1;
    if (!silent) {
      AudioEng.collect();
      const plot = document.querySelector(`.plot[data-biz="${id}"]`);
      if (plot) {
        const r = plot.getBoundingClientRect();
        floatText(r.left + r.width / 2, r.top, "+" + money(gain), "#3dff9a");
        Particles.spawn(r.left + r.width / 2, r.top, "#3dff9a", 10);
      }
    }
    if (s.owned > 0) s.running = true;
    if (state.tutorial === 2) state.tutorial = 3;
    return gain;
  }

  function collectAll() {
    let total = 0;
    for (const b of BUSINESSES) total += collectBiz(b.id, true);
    if (total <= 0) return;
    AudioEng.collect();
    toast("COLLECTED", money(total));
    const el = $("collect-all");
    if (el) {
      const r = el.getBoundingClientRect();
      floatText(r.left + r.width / 2, r.top, "+" + money(total), "#3dff9a");
    }
  }

  function tapCity(id) {
    const s = state.biz[id];
    if (!s) return;
    if (s.claim > 0) collectBiz(id);
    else if (s.owned > 0 && !s.running) runBiz(id);
    else {
      setTab("ventures");
      const card = document.querySelector(`article[data-biz="${id}"]`);
      if (card) card.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  function hireManager(id) {
    const m = MANAGERS.find((x) => x.id === id);
    const s = state.biz[id];
    if (s.manager) return;
    const cost = mgrCost(m);
    if (state.money < cost) { AudioEng.bad(); return; }
    state.money -= cost;
    s.manager = true;
    if (s.owned > 0) s.running = true;
    if (s.claim > 0) { addMoney(s.claim, "collect"); s.claim = 0; }
    AudioEng.unlock();
    toast("MANAGER HIRED", m.name + " · " + m.title);
    dirty.managers = true;
    dirty.ventures = true;
    dirty.feats = true;
    checkFeats();
  }

  function buyUpgrade(id) {
    const u = UPGRADES.find((x) => x.id === id);
    if (!u || ownedUpgrade(id)) return;
    if (u.req && !ownedUpgrade(u.req)) return;
    if (state.money < u.cost) { AudioEng.bad(); return; }
    state.money -= u.cost;
    state.upgrades[id] = true;
    AudioEng.buy();
    toast("UPGRADE", u.name);
    dirty.upgrades = true;
    dirty.ventures = true;
    dirty.feats = true;
    checkFeats();
  }

  function buyCoreUpgrade(id) {
    const u = CORE_SHOP.find((x) => x.id === id);
    if (!u || ownedCore(id)) return;
    if (u.req && !ownedCore(u.req)) return;
    if (state.cores < u.cost) { AudioEng.bad(); return; }
    state.cores -= u.cost;
    state.coreUpgrades[id] = true;
    AudioEng.buy();
    toast("CORE TECH", u.name);
    dirty.prestige = true;
    dirty.ventures = true;
  }

  function fireBoost(kind) {
    const b = state.boosts[kind];
    const t = nowSec();
    if (t < b.cd) return;
    if (kind === "overclock") {
      b.until = t + 10;
      b.cd = t + 90;
    } else {
      b.until = t + 20;
      b.cd = t + 120;
    }
    state.stats.boosts++;
    AudioEng.unlock();
    toast(kind === "overclock" ? "OVERCLOCK" : "NEON SURGE", "The district screams.");
    dirty.feats = true;
    checkFeats();
  }

  function doPrestige() {
    const gain = pendingCores();
    if (gain < 1) return;
    state.cores += gain;
    state.prestiges++;
    const keep = {
      cores: state.cores,
      prestiges: state.prestiges,
      lifetimeEarned: state.lifetimeEarned,
      totalClicks: state.totalClicks,
      crits: state.crits,
      playTime: state.playTime,
      sound: state.sound,
      particles: state.particles,
      notation: state.notation,
      feats: state.feats,
      coreUpgrades: state.coreUpgrades,
      stats: state.stats
    };
    state = newState();
    Object.assign(state, keep);
    state.money = startMoney();
    state.tutorial = 4;
    AudioEng.prestige();
    toast("ASCENDED", "+" + gain + " Neon Cores");
    dirty = { ventures: true, upgrades: true, managers: true, prestige: true, feats: true };
    cityDirty = true;
    hideModal("modal-prestige");
    $("district-label").textContent = "District " + String(state.prestiges + 1).padStart(2, "0");
    rebuildAll();
    checkFeats();
    save();
  }

  function checkFeats() {
    let any = false;
    for (const f of FEATS) {
      if (!state.feats[f.id] && f.test(state)) {
        state.feats[f.id] = true;
        toast("FEAT", f.name);
        AudioEng.unlock();
        any = true;
      }
    }
    if (any) dirty.feats = true;
  }

  /* ---------- tick ---------- */
  function tick(dt) {
    state.playTime += dt;
    comboTimer -= dt;
    if (comboTimer <= 0) state.combo = 0;

    if (ownedCore("cauto")) {
      state._autoAcc = (state._autoAcc || 0) + dt;
      if (state._autoAcc >= 1) {
        state._autoAcc -= 1;
        addMoney(clickPower(), "auto");
      }
    }

    for (const biz of BUSINESSES) {
      const s = state.biz[biz.id];
      if (s.owned <= 0) continue;
      if (s.manager) s.running = true;
      if (!s.running) continue;
      const t = cycleTime(biz);
      s.timer += dt;
      if (s.timer >= t) {
        const cycles = Math.max(1, Math.floor(s.timer / t));
        const gain = payout(biz) * cycles;
        if (s.manager) addMoney(gain, "collect");
        else s.claim = (s.claim || 0) + gain;
        s.timer = s.timer % t;
        s.running = true;
      }
    }

    if (state.event && nowSec() >= state.event.until) {
      state.event = null;
      $("event-bar").classList.add("hidden");
    }
    if (!state.event && nowSec() >= state.nextEventAt) spawnEvent();
    if (state.orb && nowSec() >= state.orb.until) hideOrb();
    if (!state.orb && nowSec() >= (state.nextOrbAt || 14)) spawnOrb();
    tickContract();

    checkFeats();
  }

  function spawnEvent() {
    const owned = BUSINESSES.filter((b) => state.biz[b.id].owned > 0);
    const roll = Math.random();
    if (roll < 0.4 && owned.length) {
      const b = owned[Math.floor(Math.random() * owned.length)];
      state.event = { type: "biz", biz: b.id, until: nowSec() + 20, name: b.name + " ×7" };
    } else if (roll < 0.7) {
      state.event = { type: "gold", until: nowSec() + 25, name: "GOLD RUSH · all payout ×2" };
    } else {
      state.event = { type: "speed", until: nowSec() + 20, name: "TIME PIPE · all speed ×2" };
    }
    state.nextEventAt = nowSec() + 55 + Math.random() * 70;
    const bar = $("event-bar");
    bar.textContent = "EVENT · " + state.event.name;
    bar.classList.remove("hidden");
    AudioEng.unlock();
  }

  function spawnOrb() {
    const types = ["frenzy", "lucky", "storm"];
    const type = types[Math.floor(Math.random() * types.length)];
    state.orb = { type, until: nowSec() + 13 };
    const el = $("lucky-orb");
    if (!el) return;
    el.classList.remove("hidden");
    el.style.left = (8 + Math.random() * 70) + "vw";
    el.style.top = (18 + Math.random() * 40) + "vh";
    AudioEng.unlock();
  }

  function hideOrb() {
    state.orb = null;
    state.nextOrbAt = nowSec() + 22 + Math.random() * 40;
    const el = $("lucky-orb");
    if (el) el.classList.add("hidden");
  }

  function clickOrb() {
    if (!state.orb) return;
    const type = state.orb.type;
    hideOrb();
    state.stats.orbs = (state.stats.orbs || 0) + 1;
    if (type === "frenzy") {
      state.frenzyUntil = nowSec() + 13;
      toast("CLICK FRENZY", "Core taps ×77 for 13s");
    } else if (type === "lucky") {
      const r = rates();
      const gain = Math.max(25, (r.active || clickPower()) * 30);
      addMoney(gain, "lucky");
      toast("LUCKY NEON", "+" + money(gain));
    } else {
      state.boosts.overclock.until = nowSec() + 12;
      toast("TIME STORM", "All ventures 5× speed");
    }
    AudioEng.prestige();
    const el = $("lucky-orb");
    if (el) {
      const r = el.getBoundingClientRect();
      Particles.spawn(r.left + 27, r.top + 27, "#ffd166", 28);
    }
    checkFeats();
  }

  function ensureContract() {
    if (state.contract) return;
    const r = rates();
    const roll = Math.random();
    if (roll < 0.4) {
      const target = Math.max(20, Math.floor((r.active || 2) * 25 + state.money * 0.4));
      state.contract = { type: "earn", target, progress: 0, startMoney: state.runEarned, reward: target * 0.35 };
    } else if (roll < 0.7) {
      state.contract = { type: "collect", target: 8, progress: 0, reward: Math.max(15, (r.active || 1) * 12) };
    } else {
      state.contract = { type: "buy", target: 5, progress: 0, reward: Math.max(20, (r.active || 1) * 15) };
    }
  }

  function tickContract() {
    ensureContract();
    const c = state.contract;
    if (!c) return;
    if (c.type === "earn") c.progress = Math.max(0, state.runEarned - (c.startMoney || 0));
    if (c.progress >= c.target) {
      addMoney(c.reward, "contract");
      state.stats.contracts = (state.stats.contracts || 0) + 1;
      toast("CONTRACT CLEAR", "+" + money(c.reward));
      AudioEng.unlock();
      state.contract = null;
    }
  }

  function cityCopies(owned) {
    if (owned <= 0) return 0;
    if (owned < 10) return 1;
    if (owned < 25) return 2;
    if (owned < 50) return 3;
    return 4;
  }

  function renderCity(force) {
    const world = $("city-world");
    if (!world) return;
    const sig = BUSINESSES.map((b) => state.biz[b.id].owned).join(",") + "|" + BUSINESSES.map((b, i) => isUnlocked(i) ? 1 : 0).join("");
    if (!force && !cityDirty && sig === citySig) {
      updateCityClaims();
      return;
    }
    citySig = sig;
    cityDirty = false;
    let html = "";
    CITY_SLOTS.forEach((slot, idx) => {
      const biz = BUSINESSES.find((b) => b.id === slot.id);
      const s = state.biz[slot.id];
      const unlocked = isUnlocked(idx);
      const copies = unlocked ? cityCopies(s.owned) : 0;
      const h = s.owned > 0 ? 34 + Math.min(s.owned, 80) * 1.8 : 26;
      const n = Math.max(copies, unlocked ? 0 : 0);
      if (copies === 0) {
        html += `<div class="plot empty ${unlocked ? "" : "ghost"}" data-biz="${slot.id}" style="--x:${slot.x}px;--z:${slot.z}px;--c:${biz.color};--w:${slot.w}px;--h:26px;--lit:0.15">
          <div class="tower" style="--h:26px;--w:${slot.w}px;--c:${biz.color}">
            <div class="tower-side"></div>
            <div class="tower-front"><span class="tower-sign">${unlocked ? "LOT" : "??"}</span></div>
            <div class="tower-top"></div>
          </div>
        </div>`;
        return;
      }
      for (let k = 0; k < copies; k++) {
        const dx = slot.x + k * 18;
        const dz = slot.z - k * 16;
        const hk = h + k * 10;
        html += `<div class="plot" data-biz="${slot.id}" style="--x:${dx}px;--z:${dz}px;--c:${biz.color};--w:${slot.w}px;--h:${hk}px;--lit:${clamp(0.25 + s.owned / 80, 0.25, 0.95)}">
          <div class="tower" style="--h:${hk}px;--w:${slot.w}px;--c:${biz.color};--lit:${clamp(0.25 + s.owned / 80, 0.25, 0.95)}">
            <div class="tower-side"></div>
            <div class="tower-front"><span class="tower-sign">${k === copies - 1 ? biz.name.slice(0, 8).toUpperCase() : ""}</span></div>
            <div class="tower-top"></div>
          </div>
          <div class="claim-bubble hidden" data-claim="${slot.id}"></div>
        </div>`;
      }
    });
    world.innerHTML = html;
    world.querySelectorAll(".plot").forEach((p) => {
      p.addEventListener("click", (e) => {
        e.stopPropagation();
        tapCity(p.dataset.biz);
      });
    });
    updateCityClaims();
  }

  function updateCityClaims() {
    document.querySelectorAll(".plot").forEach((p) => {
      const id = p.dataset.biz;
      const s = state.biz[id];
      if (!s) return;
      p.classList.toggle("hot", !!(s.running && s.owned));
      const bubble = p.querySelector(".claim-bubble");
      if (!bubble) return;
      if (s.claim > 0) {
        bubble.classList.remove("hidden");
        bubble.textContent = "+" + money(s.claim);
      } else bubble.classList.add("hidden");
    });
    const all = $("collect-all");
    if (all) all.classList.toggle("hidden", totalClaim() <= 0);
    const rank = $("rank-tag");
    if (rank) rank.textContent = districtRank();
  }

  function updateGoal() {
    const label = $("goal-label");
    const fill = $("goal-fill");
    const eta = $("goal-eta");
    if (!label) return;
    let text = "Keep the district humming";
    let p = 0;
    let extra = "";
    if (state.tutorial === 0) { text = "Tap the Core"; p = Math.min(1, state.totalClicks / 1); }
    else if (state.biz.stall.owned < 1) { text = "Buy a Street Stall — your skyline starts here"; p = clamp(state.money / 3, 0, 1); extra = money(Math.max(0, 3 - state.money)); }
    else if (!state.biz.stall.manager && state.biz.stall.owned > 0) {
      const cost = mgrCost(MANAGERS[0]);
      text = "Hire Mei Lin — go idle";
      p = clamp(state.money / cost, 0, 1);
      extra = money(Math.max(0, cost - state.money));
    } else {
      let best = null;
      for (const biz of BUSINESSES) {
        const s = state.biz[biz.id];
        if (s.owned <= 0) continue;
        const ms = nextMilestone(s.owned);
        const need = ms - s.owned;
        const c = costFor(biz, need);
        if (!best || c < best.c) best = { biz, ms, need, c };
      }
      if (best) {
        text = `${best.biz.name} ${state.biz[best.biz.id].owned}/${best.ms} · next 2× speed`;
        p = state.biz[best.biz.id].owned / best.ms;
        extra = money(best.c) + " to NEXT";
      }
      const pc = pendingCores();
      const nextNeed = Math.pow(pc + 1, 2) * 1e6;
      if (state.runEarned > nextNeed * 0.35) {
        text = "Neon Core in reach — earn toward Ascend";
        p = clamp(state.runEarned / nextNeed, 0, 1);
        extra = money(Math.max(0, nextNeed - state.runEarned));
      }
    }
    label.textContent = text;
    if (fill) fill.style.transform = `scaleX(${clamp(p, 0, 1)})`;
    if (eta) eta.textContent = extra;
  }

  function simulateOffline(seconds) {
    seconds = Math.min(OFFLINE_CAP, Math.max(0, seconds));
    let earned = 0;
    for (const biz of BUSINESSES) {
      const s = state.biz[biz.id];
      if (!s.manager || s.owned <= 0) continue;
      const t = cycleTime(biz);
      const cycles = Math.floor(seconds / t);
      earned += payout(biz) * cycles;
      s.timer = (s.timer + seconds) % t;
      s.running = true;
    }
    return { seconds, earned };
  }

  /* ---------- UI ---------- */
  function setTab(name) {
    tab = name;
    document.querySelectorAll(".tab").forEach((el) => el.classList.toggle("on", el.dataset.tab === name));
    document.querySelectorAll(".view").forEach((el) => el.classList.toggle("on", el.id === "view-" + name));
    $("ventures-toolbar").style.display = name === "ventures" ? "flex" : "none";
    if (name === "upgrades") { dirty.upgrades = true; renderUpgrades(); }
    if (name === "managers") { dirty.managers = true; renderManagers(); }
    if (name === "prestige") { dirty.prestige = true; renderPrestige(); }
    if (name === "feats") { dirty.feats = true; renderFeats(); }
  }

  function renderVentures(force) {
    const root = $("view-ventures");
    if (force || dirty.ventures) {
      let html = '<div class="biz-list">';
      BUSINESSES.forEach((biz, i) => {
        const unlocked = isUnlocked(i);
        const show = unlocked || (i > 0 && isUnlocked(i - 1));
        if (!show) return;
        const s = state.biz[biz.id];
        html += `<article class="biz ${unlocked ? "" : "locked"}" data-biz="${biz.id}" style="--accent:${biz.color}">
          <div class="biz-icon">${ICONS[biz.id]}</div>
          <div class="biz-body">
            <div class="biz-top">
              <div>
                <div class="biz-name">${unlocked ? biz.name : "Classified"}</div>
                <div class="biz-tag">${unlocked ? biz.tag : "Acquire the previous venture"}</div>
              </div>
              <div class="biz-owned">×${s.owned}</div>
            </div>
            <div class="bar"><div class="bar-fill" data-bar="${biz.id}"></div></div>
            <div class="biz-meta">
              <span class="pay" data-pay="${biz.id}">${money(payout(biz))}</span>
              <span data-time="${biz.id}">${cycleTime(biz).toFixed(2)}s</span>
            </div>
            <div class="ms-row" data-ms="${biz.id}"></div>
          </div>
          <div class="biz-actions">
            <button class="btn btn-buy" data-buy="${biz.id}" ${unlocked ? "" : "disabled"}></button>
            <button class="btn btn-run" data-run="${biz.id}">Run</button>
          </div>
        </article>`;
      });
      html += "</div>";
      root.innerHTML = html;
      root.querySelectorAll("[data-buy]").forEach((btn) => btn.addEventListener("click", () => buyBiz(btn.dataset.buy)));
      root.querySelectorAll("[data-run]").forEach((btn) => btn.addEventListener("click", () => runBiz(btn.dataset.run)));
      dirty.ventures = false;
    }

    BUSINESSES.forEach((biz) => {
      const s = state.biz[biz.id];
      const card = document.querySelector(`[data-biz="${biz.id}"]`);
      if (!card) return;
      const t = cycleTime(biz);
      const p = s.running && s.owned ? clamp(s.timer / t, 0, 1) : 0;
      const bar = card.querySelector("[data-bar]");
      if (bar) bar.style.transform = `scaleX(${p})`;
      const pay = card.querySelector("[data-pay]");
      if (pay) pay.textContent = money(payout(biz));
      const time = card.querySelector("[data-time]");
      if (time) time.textContent = t.toFixed(2) + "s";
      const owned = card.querySelector(".biz-owned");
      if (owned) owned.textContent = "×" + s.owned;
      const buy = card.querySelector("[data-buy]");
      if (buy) {
        const n = buyCount(biz);
        const c = n > 0 ? costFor(biz, n) : firstCost(biz);
        const can = n > 0 && state.money >= c;
        const tag = state.buyMult === -2 ? "Next" : (state.buyMult === -1 ? "Max" : "×" + (n || state.buyMult));
        buy.textContent = n > 0 ? `Buy ${tag}  ${money(c)}` : `Buy  ${money(firstCost(biz))}`;
        buy.classList.toggle("can", can);
        buy.disabled = !isUnlocked(BUSINESSES.indexOf(biz)) || !can;
      }
      const ms = card.querySelector("[data-ms]");
      if (ms && s.owned > 0) {
        const m = nextMilestone(s.owned);
        ms.innerHTML = `<span>Next 2× at <b>${m}</b></span><span>${s.owned}/${m}</span>`;
      } else if (ms) ms.textContent = "";
      card.classList.toggle("claimable", (s.claim || 0) > 0);
      const run = card.querySelector("[data-run]");
      if (run) {
        if (s.manager) {
          run.textContent = "AUTO";
          run.disabled = true;
          run.classList.remove("pulse");
        } else if (s.owned <= 0) {
          run.textContent = "RUN";
          run.disabled = true;
          run.classList.remove("pulse");
        } else if (s.claim > 0) {
          run.textContent = "COLLECT " + money(s.claim);
          run.disabled = false;
          run.classList.add("pulse");
        } else if (s.running) {
          run.textContent = "RUNNING";
          run.disabled = true;
          run.classList.remove("pulse");
        } else {
          run.textContent = "RUN";
          run.disabled = false;
          run.classList.add("pulse");
        }
      }
    });
  }

  function renderUpgrades() {
    if (!dirty.upgrades && tab !== "upgrades") return;
    const root = $("view-upgrades");
    let html = '<div class="card-grid">';
    for (const u of UPGRADES) {
      const locked = u.req && !ownedUpgrade(u.req);
      const have = ownedUpgrade(u.id);
      if (locked && !have) continue;
      html += `<article class="ucard ${have ? "owned" : ""}">
        <h3>${u.name}</h3>
        <p>${u.desc}</p>
        <div class="cost">${have ? "" : money(u.cost)}</div>
        ${have ? '<div class="owned-flag">Installed</div>' : `<button class="btn btn-cyan" data-upg="${u.id}" ${state.money >= u.cost ? "" : "disabled"}>Install</button>`}
      </article>`;
    }
    html += "</div>";
    root.innerHTML = html;
    root.querySelectorAll("[data-upg]").forEach((btn) => btn.addEventListener("click", () => {
      buyUpgrade(btn.dataset.upg);
      dirty.upgrades = true;
      renderUpgrades();
    }));
    dirty.upgrades = false;
  }

  function renderManagers() {
    const root = $("view-managers");
    let html = '<div class="card-grid">';
    for (const m of MANAGERS) {
      const s = state.biz[m.id];
      const biz = BUSINESSES.find((b) => b.id === m.id);
      html += `<article class="mcard">
        <div class="who">${m.title}</div>
        <h3>${m.name}</h3>
        <p>Runs <b style="color:${biz.color}">${biz.name}</b> on a closed loop. ${m.flavor}</p>
        ${s.manager ? '<div class="owned-flag">On payroll</div>' : `<div class="cost">${money(mgrCost(m))}</div>
        <button class="btn btn-cyan" data-hire="${m.id}" ${state.money >= mgrCost(m) ? "" : "disabled"}>Hire</button>`}
      </article>`;
    }
    html += "</div>";
    root.innerHTML = html;
    root.querySelectorAll("[data-hire]").forEach((btn) => btn.addEventListener("click", () => {
      hireManager(btn.dataset.hire);
      renderManagers();
    }));
    dirty.managers = false;
  }

  function renderPrestige() {
    const gain = pendingCores();
    const nextNeed = Math.pow(gain + 1, 2) * 1e6;
    const root = $("view-prestige");
    root.innerHTML = `
      <div class="prestige-view">
        <div class="prestige-hero"><img src="assets/prestige.jpg" alt="Neon Cores"></div>
        <div class="prestige-copy">
          <p class="kicker">ASCENSION PROTOCOL</p>
          <h2>Trade the city for light.</h2>
          <p class="muted">Reset ventures, cash upgrades, and managers. Keep feats, cores, and core tech. Each core is a permanent +5% to everything.</p>
          <p>This run earned <b>${money(state.runEarned)}</b>. Pending cores: <b style="color:var(--gold)">${gain}</b></p>
          <p class="muted">Next core at ${money(nextNeed)} earned this run. Current bonus ${((prestigeMult() - 1) * 100).toFixed(0)}%.</p>
          <button id="btn-ascend" class="btn btn-lg btn-gold" ${gain < 1 ? "disabled" : ""}>Ascend for ${gain} core${gain === 1 ? "" : "s"}</button>
          <div class="core-shop">
            <p class="kicker">CORE SHOP · ${state.cores} owned</p>
            <div class="card-grid">
              ${CORE_SHOP.map((u) => {
                const have = ownedCore(u.id);
                const locked = u.req && !ownedCore(u.req);
                if (locked && !have) return "";
                return `<article class="ucard ${have ? "owned" : ""}">
                  <h3>${u.name}</h3>
                  <p>${u.desc}</p>
                  <div class="cost">${have ? "" : u.cost + " cores"}</div>
                  ${have ? '<div class="owned-flag">Bound</div>' : `<button class="btn btn-gold" data-core="${u.id}" ${state.cores >= u.cost ? "" : "disabled"}>Bind</button>`}
                </article>`;
              }).join("")}
            </div>
          </div>
        </div>
      </div>`;
    const btn = $("btn-ascend");
    if (btn) btn.addEventListener("click", () => {
      $("prestige-gain").textContent = `Gain ${gain} Neon Cores · production +${((state.cores + gain) * 5).toFixed(0)}% after.`;
      showModal("modal-prestige");
    });
    root.querySelectorAll("[data-core]").forEach((b) => b.addEventListener("click", () => {
      buyCoreUpgrade(b.dataset.core);
      renderPrestige();
    }));
    dirty.prestige = false;
  }

  function renderFeats() {
    const root = $("view-feats");
    const got = Object.values(state.feats).filter(Boolean).length;
    root.innerHTML = `<p class="hint" style="margin-bottom:10px">${got}/${FEATS.length} feats · +${Math.floor(got / 5)}% production</p>
      <div class="card-grid">${FEATS.map((f) => {
        const on = !!state.feats[f.id];
        return `<article class="fcard ${on ? "on" : ""}">
          <div class="icon">${on ? "◆" : "◇"}</div>
          <h3>${f.name}</h3>
          <p>${f.desc}</p>
          ${on ? '<div class="owned-flag">Logged</div>' : ""}
        </article>`;
      }).join("")}</div>`;
    dirty.feats = false;
  }

  function rebuildAll() {
    dirty = { ventures: true, upgrades: true, managers: true, prestige: true, feats: true };
    renderVentures(true);
    cityDirty = true;
    renderCity(true);
    if (tab === "upgrades") renderUpgrades();
    if (tab === "managers") renderManagers();
    if (tab === "prestige") renderPrestige();
    if (tab === "feats") renderFeats();
  }

  function rates() {
    let idle = 0, active = 0;
    for (const b of BUSINESSES) {
      const s = state.biz[b.id];
      if (s.owned <= 0) continue;
      const r = payout(b) / cycleTime(b);
      active += r;
      if (s.manager) idle += r;
    }
    return { idle, active };
  }

  function fmtTime(sec) {
    sec = Math.floor(sec);
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    if (h) return h + ":" + String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
    return m + ":" + String(s).padStart(2, "0");
  }

  function renderHud(dt) {
    displayMoney += (state.money - displayMoney) * Math.min(1, dt * 10);
    if (Math.abs(state.money - displayMoney) < 0.01) displayMoney = state.money;
    const moneyEl = $("money");
    moneyEl.textContent = money(displayMoney);
    if (performance.now() - moneyPopAt < 180) moneyEl.classList.add("pop");
    else moneyEl.classList.remove("pop");

    const r = rates();
    $("rate-active").textContent = money(r.active) + "/s active";
    $("rate-idle").textContent = money(r.idle) + "/s idle";
    $("cores-count").textContent = formatNum(state.cores, "standard");
    $("core-power").textContent = "+" + money(clickPower());
    $("stat-clicks").textContent = formatNum(state.totalClicks, "standard");
    const owned = BUSINESSES.reduce((a, b) => a + state.biz[b.id].owned, 0);
    $("stat-owned").textContent = owned;
    const mgr = BUSINESSES.filter((b) => state.biz[b.id].manager).length;
    $("stat-mgr").textContent = mgr + "/10";
    $("stat-time").textContent = fmtTime(state.playTime);

    const combo = $("combo");
    if (state.combo >= 2) {
      combo.classList.remove("hidden");
      combo.textContent = "COMBO ×" + state.combo;
    } else combo.classList.add("hidden");

    updateBoost("overclock", 10, 90);
    updateBoost("surge", 20, 120);

    if (state.event) {
      const left = Math.max(0, state.event.until - nowSec());
      $("event-bar").textContent = "EVENT · " + state.event.name + " · " + left.toFixed(0) + "s";
    }

    const nextNeed = Math.pow(pendingCores() + 1, 2) * 1e6;
    const cpf = $("core-progress-fill");
    if (cpf) cpf.style.width = (clamp(state.runEarned / nextNeed, 0, 1) * 100) + "%";

    if (nowSec() < (state.frenzyUntil || 0)) {
      $("core-power").textContent = "FRENZY +" + money(clickPower());
    }

    const c = state.contract;
    const cd = $("contract-desc");
    const cf = $("contract-fill");
    if (c && cd) {
      const names = { earn: "Earn " + money(c.target), collect: "Collect " + c.target + " piles", buy: "Buy " + c.target + " buildings" };
      cd.textContent = names[c.type] + " · +" + money(c.reward);
      if (cf) cf.style.transform = `scaleX(${clamp(c.progress / c.target, 0, 1)})`;
    } else if (cd) cd.textContent = "New contract incoming…";

    updateGoal();
  }

  function updateBoost(kind, dur, cd) {
    const el = $("boost-" + kind);
    const b = state.boosts[kind];
    const t = nowSec();
    const cdEl = el.querySelector(".boost-cd");
    el.classList.remove("hot", "ready");
    if (t < b.until) {
      el.disabled = true;
      el.classList.add("hot");
      const p = (b.until - t) / dur;
      cdEl.style.width = (p * 100) + "%";
      el.querySelector(".boost-meta").textContent = "LIVE " + (b.until - t).toFixed(1) + "s";
    } else if (t < b.cd) {
      el.disabled = true;
      const left = b.cd - t;
      cdEl.style.width = ((1 - left / cd) * 100) + "%";
      el.querySelector(".boost-meta").textContent = "CD " + fmtTime(left);
    } else {
      el.disabled = false;
      el.classList.add("ready");
      cdEl.style.width = "0";
      el.querySelector(".boost-meta").textContent = kind === "overclock" ? "5× speed · 10s" : "3× payout · 20s";
    }
  }

  function updateCoach() {
    const el = $("coach");
    const steps = [
      { t: 0, text: "Tap the Core to mint your first credits.", attach: "#core" },
      { t: 1, text: "Buy a Street Stall — your first venture.", attach: "[data-biz='stall'] [data-buy]" },
      { t: 2, text: "When the stall lights up, COLLECT — or tap the building.", attach: "[data-biz='stall'] [data-run]" },
      { t: 3, text: "Hire managers to go idle. Ascend later for Neon Cores.", attach: ".tab[data-tab='managers']" }
    ];
    const step = steps.find((s) => s.t === state.tutorial);
    if (!step || state.tutorial >= 4) { el.classList.add("hidden"); return; }
    const target = document.querySelector(step.attach);
    if (!target) { el.classList.add("hidden"); return; }
    const r = target.getBoundingClientRect();
    el.textContent = step.text;
    el.classList.remove("hidden");
    let left = r.left;
    let top = r.top - el.offsetHeight - 14;
    if (top < 8) top = r.bottom + 12;
    left = clamp(left, 8, innerWidth - 280);
    el.style.left = left + "px";
    el.style.top = top + "px";
  }

  function showModal(id) { $(id).classList.remove("hidden"); }
  function hideModal(id) { $(id).classList.add("hidden"); }

  /* ---------- save ---------- */
  function save() {
    try {
      state.lastSave = Date.now();
      localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    } catch (e) { /* ignore quota */ }
  }

  function load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return false;
      const data = JSON.parse(raw);
      const base = newState();
      state = Object.assign(base, data);
      state.biz = Object.assign(emptyBiz(), data.biz || {});
      for (const b of BUSINESSES) {
        state.biz[b.id] = Object.assign({ owned: 0, timer: 0, running: false, manager: false, claim: 0 }, state.biz[b.id]);
      }
      state.stats = Object.assign({ bought: 0, boosts: 0, maxCombo: 0, collected: 0, orbs: 0, contracts: 0 }, state.stats || {});
      displayMoney = state.money;
      return true;
    } catch (e) {
      return false;
    }
  }

  function hardReset() {
    if (!confirm("Wipe the district? This cannot be undone.")) return;
    localStorage.removeItem(SAVE_KEY);
    state = newState();
    displayMoney = 0;
    dirty = { ventures: true, upgrades: true, managers: true, prestige: true, feats: true };
    $("district-label").textContent = "District 01";
    rebuildAll();
    toast("WIPED", "A new license is issued.");
    hideModal("modal-settings");
  }

  function exportSave() {
    const raw = btoa(unescape(encodeURIComponent(JSON.stringify(state))));
    navigator.clipboard.writeText(raw).then(() => {
      $("settings-msg").textContent = "Save copied to clipboard.";
    }).catch(() => {
      prompt("Copy this save:", raw);
    });
  }

  function importSave() {
    const raw = prompt("Paste a Neon Empire save:");
    if (!raw) return;
    try {
      const data = JSON.parse(decodeURIComponent(escape(atob(raw.trim()))));
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
      load();
      rebuildAll();
      $("settings-msg").textContent = "Save imported.";
      hideModal("modal-settings");
    } catch (e) {
      $("settings-msg").textContent = "Could not read that save.";
    }
  }

  /* ---------- loop ---------- */
  function frame(ts) {
    const dt = Math.min(0.1, (ts - lastTs) / 1000);
    lastTs = ts;
    if (!$("game").classList.contains("hidden")) {
      tick(dt);
      renderHud(dt);
      renderVentures(false);
      renderCity(false);
      Particles.tick(dt);
      if (tab === "upgrades") {
        document.querySelectorAll("[data-upg]").forEach((btn) => {
          const u = UPGRADES.find((x) => x.id === btn.dataset.upg);
          if (u) btn.disabled = state.money < u.cost;
        });
      }
      if (tab === "managers") {
        document.querySelectorAll("[data-hire]").forEach((btn) => {
          const m = MANAGERS.find((x) => x.id === btn.dataset.hire);
          if (m) btn.disabled = state.money < mgrCost(m);
        });
      }
      if (ts % 8 < 2) updateCoach();
    }
    requestAnimationFrame(frame);
  }

  function enterGame(isContinue) {
    $("title").classList.add("hidden");
    $("game").classList.remove("hidden");
    $("district-label").textContent = "District " + String(state.prestiges + 1).padStart(2, "0");
    rebuildAll();
    lastTs = performance.now();
    updateCoach();
    AudioEng.ensure();

    if (isContinue) {
      const away = (Date.now() - (state.lastSave || Date.now())) / 1000;
      if (away > 15) {
        const off = simulateOffline(away);
        if (off.earned > 0) {
          addMoney(off.earned, "offline");
          $("offline-time").textContent = "Away " + fmtTime(off.seconds) + " (capped at 8 hours).";
          $("offline-payout").textContent = money(off.earned);
          showModal("modal-offline");
        }
      }
    }
    save();
  }

  function bind() {
    $("btn-new").addEventListener("click", () => {
      if (localStorage.getItem(SAVE_KEY) && !confirm("Start a new district? Current save will be overwritten.")) return;
      state = newState();
      displayMoney = 0;
      enterGame(false);
    });
    $("btn-continue").addEventListener("click", () => enterGame(true));

    $("core").addEventListener("pointerdown", (e) => {
      e.preventDefault();
      clickCore(e.clientX, e.clientY);
    });

    document.querySelectorAll(".tab").forEach((el) => el.addEventListener("click", () => setTab(el.dataset.tab)));
    document.querySelectorAll(".mult").forEach((el) => el.addEventListener("click", () => {
      state.buyMult = Number(el.dataset.mult);
      document.querySelectorAll(".mult").forEach((m) => m.classList.toggle("on", m === el));
      dirty.ventures = true;
    }));

    $("boost-overclock").addEventListener("click", () => fireBoost("overclock"));
    $("boost-surge").addEventListener("click", () => fireBoost("surge"));

    $("btn-settings").addEventListener("click", () => {
      $("opt-sound").checked = state.sound;
      $("opt-particles").checked = state.particles;
      $("opt-notation").value = state.notation;
      $("settings-msg").textContent = "";
      showModal("modal-settings");
    });
    $("btn-settings-close").addEventListener("click", () => hideModal("modal-settings"));
    $("opt-sound").addEventListener("change", (e) => { state.sound = e.target.checked; AudioEng.ensure(); });
    $("opt-particles").addEventListener("change", (e) => { state.particles = e.target.checked; });
    $("opt-notation").addEventListener("change", (e) => { state.notation = e.target.value; dirty.ventures = true; });
    $("btn-export").addEventListener("click", exportSave);
    $("btn-import").addEventListener("click", importSave);
    $("btn-reset").addEventListener("click", hardReset);

    $("btn-offline").addEventListener("click", () => hideModal("modal-offline"));
    $("btn-prestige-cancel").addEventListener("click", () => hideModal("modal-prestige"));
    $("btn-prestige-confirm").addEventListener("click", doPrestige);
    $("cores-chip").addEventListener("click", () => setTab("prestige"));

    window.addEventListener("keydown", (e) => {
      if (e.code === "Space" && !$("game").classList.contains("hidden")) {
        e.preventDefault();
        const r = $("core").getBoundingClientRect();
        clickCore(r.left + r.width / 2, r.top + r.height / 2);
      }
      if (e.key === "c" || e.key === "C") collectAll();
      if (e.key === "1") setTab("ventures");
      if (e.key === "2") setTab("upgrades");
      if (e.key === "3") setTab("managers");
    });

    document.querySelectorAll(".modal").forEach((m) => m.addEventListener("click", (e) => {
      if (e.target === m) m.classList.add("hidden");
    }));

    $("ticker").textContent = NEWS.join("   ◆   ") + "   ◆   " + NEWS.join("   ◆   ");

    window.addEventListener("resize", () => { resizeFx(); updateCoach(); });
    document.addEventListener("visibilitychange", () => { if (document.hidden) save(); });
    setInterval(save, 8000);
  }

  function boot() {
    fx = $("fx");
    resizeFx();
    bind();
    const has = !!localStorage.getItem(SAVE_KEY);
    if (has) {
      $("btn-continue").classList.remove("hidden");
      load();
    }
    requestAnimationFrame(frame);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
