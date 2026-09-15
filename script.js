/**
 * CALENDOPIA ORBITAL ENGINE - ISOLATED ROTATING RINGS
 * Alternating Anti-Clockwise & Clockwise Ambient Motion (Visual Only)
 */

document.addEventListener('DOMContentLoaded', () => {

  // Engine State Variables
  let currentYear = 2019;
  let activeMonthIndex = 0;
  let selectedDay = 1;
  let selectedWeekdayIndex = 0;

  // Independent Rotational Angles for Each Ring
  let monthRotation = 0;
  let daysRotation = 0;
  let weekdaysRotation = 0;

  // Alternating Ambient Spin Directions:
  // Month: Anti-Clockwise (-), Middle Day: Clockwise (+), Inner Weekday: Anti-Clockwise (-)
  const AMBIENT_MONTH_SPEED = -0.08;      // Anti-Clockwise
  const AMBIENT_DAY_SPEED = 0.12;         // Clockwise
  const AMBIENT_WEEKDAY_SPEED = -0.06;    // Anti-Clockwise

  let liveEthioToday = { year: 2019, monthIndex: 0, day: 1 };

  const totalMonths = 13;
  const monthAngleStep = 360 / totalMonths;

  const totalDaysInTier = 30;
  const dayAngleStep = 360 / totalDaysInTier;

  const totalWeekdays = 7;
  const weekdayAngleStep = 360 / totalWeekdays;

  // Reference Data
  const ETHIO_MONTHS = [
    { en: "Meskerem", geez: "መስከረም", days: 30, season: "Tsedey (Spring)", holidays: "Enkutatash (New Year)" },
    { en: "Tikimt", geez: "ጥቅምት", days: 30, season: "Tsedey (Spring)", holidays: "Meskel Festival" },
    { en: "Hidar", geez: "ኅዳር", days: 30, season: "Tsedey (Spring)", holidays: "Hidar Zion" },
    { en: "Tahsas", geez: "ታኅሣሥ", days: 30, season: "Bega (Winter)", holidays: "Kulubi Gabriel" },
    { en: "Tir", geez: "ጥር", days: 30, season: "Bega (Winter)", holidays: "Genna, Timkat" },
    { en: "Yakatit", geez: "የካቲት", days: 30, season: "Bega (Winter)", holidays: "Adwa Victory Day" },
    { en: "Magabit", geez: "መጋቢት", days: 30, season: "Belg (Autumn)", holidays: "Fasika (Easter)" },
    { en: "Miyazya", geez: "ሚያዝያ", days: 30, season: "Belg (Autumn)", holidays: "Patriots Day" },
    { en: "Ginbot", geez: "ግንቦት", days: 30, season: "Belg (Autumn)", holidays: "Ginbot 20" },
    { en: "Sene", geez: "ሰኔ", days: 30, season: "Kiremt (Summer)", holidays: "Kiremt Solstice" },
    { en: "Hamle", geez: "ሐምሌ", days: 30, season: "Kiremt (Summer)", holidays: "Hamle Gabriel" },
    { en: "Nahase", geez: "ነሐሴ", days: 30, season: "Kiremt (Summer)", holidays: "Buhe / Ashenda" },
    { en: "Pagume", geez: "ጳጉሜ", days: 5, season: "Intercalary", holidays: "Year Transition" }
  ];

  const WEEKDAYS_GEEZ = ["እሁድ", "ሰኞ", "ማክሰኞ", "ረቡዕ", "ሐሙስ", "ዓርብ", "ቅዳሜ"];
  const WEEKDAYS_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const EVANGELISTS = ["Zemen Yohannes", "Zemen Matewos", "Zemen Markos", "Zemen Lukas"];
  
  // Ethiopian Ge'ez Numeral Lookup System
  const GEEZ_NUMERALS = ['', '፩', '፪', '፫', '፬', '፭', '፮', '፯', '፰', '፱', '፲', 
    '፲፩', '፲፪', '፲፫', '፲፬', '፲፭', '፲፮', '፲፯', '፲፰', '፲፱', '፪፰', 
    '፪፩', '፪፪', '፪፫', '፪፬', '፪፭', '፪፮', '፪፯', '፪፰', '፪፱', '፴'];

  function toGeezNumber(num) {
    if (num <= 30) return GEEZ_NUMERALS[num] || num;
    let tens = Math.floor(num / 10) * 10;
    let ones = num % 10;
    let tensGeez = tens === 10 ? '፲' : tens === 20 ? '፪፰' : tens === 30 ? '፴' : tens === 40 ? '፬፰' : tens === 50 ? '፭፰' : '';
    return tensGeez + (GEEZ_NUMERALS[ones] || '');
  }

  // DOM Handles
  const dialWheel = document.getElementById('dialWheel');
  const daysWheel = document.getElementById('daysWheel');
  const weekdaysWheel = document.getElementById('weekdaysWheel');
  const wheelStage = document.getElementById('wheelStage');
  
  const hubGeezMonth = document.getElementById('hubGeezMonth');
  const hubEnMonth = document.getElementById('hubEnMonth');
  const hubYearLabel = document.getElementById('hubYearLabel');
  const hubMonthIndex = document.getElementById('hubMonthIndex');
  
  const calTitle = document.getElementById('calTitle');
  const daysGrid = document.getElementById('daysGrid');
  const selectedDayLabel = document.getElementById('selectedDayLabel');
  const holidayNotice = document.getElementById('holidayNotice');
  const yearReadout = document.getElementById('yearReadout');

  // ==========================================
  // 1. Julian Day Number Real-Time Engine
  // ==========================================
  function gregorianToJDN(year, month, day) {
    let a = Math.floor((14 - month) / 12);
    let y = year + 4800 - a;
    let m = month + 12 * a - 3;
    return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  }

  function jdnToEthiopian(jdn) {
    let r = (jdn - 1723856) % 1461;
    let n = (r % 365) + 365 * Math.floor(r / 1460);
    let year = 4 * Math.floor((jdn - 1723856) / 1461) + Math.floor(r / 365) - Math.floor(r / 1460);
    let monthIndex = Math.floor(n / 30);
    let day = (n % 30) + 1;

    return { year, monthIndex, day };
  }

  function gregorianToEthiopian(gYear, gMonth, gDay) {
    let jdn = gregorianToJDN(gYear, gMonth, gDay);
    return jdnToEthiopian(jdn);
  }

  // ==========================================
  // 2. Realtime Ticking Clock Engine
  // ==========================================
  function tickRealtimeClocks() {
    const now = new Date();
    
    document.getElementById('gregTimeVal').textContent = now.toLocaleTimeString();
    document.getElementById('gregDateVal').textContent = now.toDateString();

    const ethNow = gregorianToEthiopian(now.getFullYear(), now.getMonth() + 1, now.getDate());
    liveEthioToday = ethNow;

    const ethMonthObj = ETHIO_MONTHS[ethNow.monthIndex];
    document.getElementById('ethioDateVal').textContent = `${toGeezNumber(ethNow.day)} (${ethNow.day}) ${ethMonthObj.geez}, ${ethNow.year} E.C.`;

    let gHour = now.getHours();
    let gMin = now.getMinutes();
    let gSec = now.getSeconds();

    let eHour = (gHour + 6) % 12 || 12;
    let ePeriod = (gHour >= 6 && gHour < 18) ? 'ቀን' : 'ሌሊት';

    let eHourGeez = toGeezNumber(eHour);
    let eMinGeez = toGeezNumber(gMin) || '፨';
    let eSecGeez = toGeezNumber(gSec) || '፨';

    document.getElementById('ethioTimeVal').textContent = `${eHourGeez}:${eMinGeez}:${eSecGeez} ${ePeriod}`;

    let currentJDN = gregorianToJDN(now.getFullYear(), now.getMonth() + 1, now.getDate());
    document.getElementById('jdnVal').textContent = currentJDN.toLocaleString();
  }

  setInterval(tickRealtimeClocks, 1000);
  tickRealtimeClocks();

  // ==========================================
  // 3. Stardust Background Particles
  // ==========================================
  const canvas = document.getElementById('stardustCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.5 + 0.5;
      this.speedY = -Math.random() * 0.15 - 0.05;
      this.opacity = Math.random() * 0.35 + 0.1;
    }
    update() {
      this.y += this.speedY;
      if (this.y < 0) { this.reset(); this.y = canvas.height; }
    }
    draw() {
      ctx.fillStyle = `rgba(201, 169, 110, ${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < Math.floor(canvas.width / 18); i++) {
      particles.push(new Particle());
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
  }
  initParticles();
  animateParticles();

  // ==========================================
  // 4. Perfect Circle Nodes Setup
  // ==========================================
  function buildVaultNodes() {
    // 1. Build Outer Tier (13 Months)
    dialWheel.innerHTML = '';
    const outerRadius = 42;
    ETHIO_MONTHS.forEach((m, idx) => {
      const angle = idx * monthAngleStep;
      const rad = (angle * Math.PI) / 180;
      const x = 50 + outerRadius * Math.sin(rad);
      const y = 50 - outerRadius * Math.cos(rad);

      const node = document.createElement('div');
      node.className = 'vault-node';
      node.id = `month-node-${idx}`;
      node.textContent = m.geez;
      node.style.left = `${x}%`;
      node.style.top = `${y}%`;
      node.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
      dialWheel.appendChild(node);
    });

    // 2. Build Middle Tier (30 Numerical Days)
    daysWheel.innerHTML = '';
    const midRadius = 38;
    for (let d = 1; d <= 30; d++) {
      const angle = (d - 1) * dayAngleStep;
      const rad = (angle * Math.PI) / 180;
      const x = 50 + midRadius * Math.sin(rad);
      const y = 50 - midRadius * Math.cos(rad);

      const node = document.createElement('div');
      node.className = 'vault-node';
      node.id = `day-node-${d}`;
      node.textContent = GEEZ_NUMERALS[d] || d;
      node.style.left = `${x}%`;
      node.style.top = `${y}%`;
      node.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
      daysWheel.appendChild(node);
    }

    // 3. Build Inner Tier (7 Weekdays)
    weekdaysWheel.innerHTML = '';
    const innerRadius = 35;
    WEEKDAYS_GEEZ.forEach((w, idx) => {
      const angle = idx * weekdayAngleStep;
      const rad = (angle * Math.PI) / 180;
      const x = 50 + innerRadius * Math.sin(rad);
      const y = 50 - innerRadius * Math.cos(rad);

      const node = document.createElement('div');
      node.className = 'vault-node';
      node.id = `weekday-node-${idx}`;
      node.textContent = w;
      node.style.left = `${x}%`;
      node.style.top = `${y}%`;
      node.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
      weekdaysWheel.appendChild(node);
    });
  }

  // Render Visual Rotation Transforms
  function applyWheelTransforms() {
    dialWheel.style.transform = `translate(-50%, -50%) rotate(${monthRotation}deg)`;
    daysWheel.style.transform = `translate(-50%, -50%) rotate(${daysRotation}deg)`;
    weekdaysWheel.style.transform = `translate(-50%, -50%) rotate(${weekdaysRotation}deg)`;
  }

  // Update State & Synchronize Calendar Only On User Drag
  function updateVaultStateFromRotation() {
    let normalizedMonth = (-monthRotation % 360 + 360) % 360;
    activeMonthIndex = Math.round(normalizedMonth / monthAngleStep) % totalMonths;

    let normalizedDay = (-daysRotation % 360 + 360) % 360;
    selectedDay = (Math.round(normalizedDay / dayAngleStep) % totalDaysInTier) + 1;

    let normalizedWeekday = (-weekdaysRotation % 360 + 360) % 360;
    selectedWeekdayIndex = Math.round(normalizedWeekday / weekdayAngleStep) % totalWeekdays;

    syncCalendarUI();
  }

  // Pure UI Synchronizer
  function syncCalendarUI() {
    applyWheelTransforms();

    const currentMonth = ETHIO_MONTHS[activeMonthIndex];

    // Highlight Active Nodes Under Reticle
    dialWheel.querySelectorAll('.vault-node').forEach((n, idx) => {
      n.classList.toggle('active-node', idx === activeMonthIndex);
    });

    daysWheel.querySelectorAll('.vault-node').forEach((n, idx) => {
      n.classList.toggle('active-node', (idx + 1) === selectedDay);
    });

    weekdaysWheel.querySelectorAll('.vault-node').forEach((n, idx) => {
      n.classList.toggle('active-node', idx === selectedWeekdayIndex);
    });

    // Central Core Hub Update
    hubGeezMonth.textContent = currentMonth.geez;
    hubEnMonth.textContent = currentMonth.en.toUpperCase();
    hubYearLabel.textContent = `${currentYear} E.C.`;
    hubMonthIndex.textContent = `${(activeMonthIndex + 1).toString().padStart(2, '0')} / 13`;

    calTitle.textContent = `${currentMonth.en.toUpperCase()} (${currentMonth.geez})`;
    document.getElementById('infoSeason').textContent = currentMonth.season;
    document.getElementById('infoHolidays').textContent = currentMonth.holidays;
    
    let daysCount = (activeMonthIndex === 12 && (currentYear + 1) % 4 === 0) ? 6 : currentMonth.days;
    document.getElementById('infoDaysCount').textContent = `${daysCount} Days`;
    document.getElementById('evangelistBadge').textContent = EVANGELISTS[currentYear % 4];
    yearReadout.textContent = `${currentYear} E.C.`;

    renderFullMonthGrid(daysCount);
  }

  function renderFullMonthGrid(daysCount) {
    daysGrid.innerHTML = '';
    if (selectedDay > daysCount) selectedDay = daysCount;

    for (let d = 1; d <= daysCount; d++) {
      const cell = document.createElement('div');
      
      let isToday = (currentYear === liveEthioToday.year && 
                     activeMonthIndex === liveEthioToday.monthIndex && 
                     d === liveEthioToday.day);

      cell.className = `day-cell ${d === selectedDay ? 'active-day' : ''} ${isToday ? 'is-today' : ''}`;
      
      const geezVal = GEEZ_NUMERALS[d] || d;
      cell.innerHTML = `
        <span class="cell-geez">${geezVal}</span>
        <span class="cell-num">${d}</span>
      `;

      cell.addEventListener('click', () => {
        selectedDay = d;
        daysRotation = -(selectedDay - 1) * dayAngleStep;
        
        document.querySelectorAll('.day-cell').forEach(c => c.classList.remove('active-day'));
        cell.classList.add('active-day');
        
        const m = ETHIO_MONTHS[activeMonthIndex];
        selectedDayLabel.textContent = `SELECTED DAY: ${d.toString().padStart(2, '0')} ${m.en} ${currentYear} E.C.`;
        syncCalendarUI();
      });

      daysGrid.appendChild(cell);
    }

    const currentMonth = ETHIO_MONTHS[activeMonthIndex];
    holidayNotice.textContent = currentMonth.holidays;
    selectedDayLabel.textContent = `SELECTED DAY: ${selectedDay.toString().padStart(2, '0')} ${currentMonth.en} ${currentYear} E.C.`;
  }

  // ==========================================
  // 5. Isolated Ring Rotation & Ambient Spin
  // ==========================================
  let isDragging = false;
  let activeRing = null;
  let startAngle = 0;
  let initialRingRotation = 0;
  let zoomTimeout = null;

  function triggerZoomIn() {
    wheelStage.classList.add('zoomed');
    clearTimeout(zoomTimeout);
  }

  function triggerZoomOut() {
    zoomTimeout = setTimeout(() => {
      wheelStage.classList.remove('zoomed');
    }, 1200);
  }

  function getAngleFromCenter(e) {
    const rect = wheelStage.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
  }

  wheelStage.addEventListener('pointerdown', (e) => {
    isDragging = true;
    triggerZoomIn();

    const target = e.target;
    if (target.closest('.tier-inner')) {
      activeRing = 'inner';
      initialRingRotation = weekdaysRotation;
    } else if (target.closest('.tier-middle')) {
      activeRing = 'middle';
      initialRingRotation = daysRotation;
    } else {
      activeRing = 'outer';
      initialRingRotation = monthRotation;
    }

    const currentAngle = getAngleFromCenter(e);
    startAngle = currentAngle;
  });

  window.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const currentAngle = getAngleFromCenter(e);
    const deltaAngle = currentAngle - startAngle;

    // Rotate ONLY the clicked ring
    if (activeRing === 'outer') {
      monthRotation = initialRingRotation + deltaAngle;
    } else if (activeRing === 'middle') {
      daysRotation = initialRingRotation + deltaAngle;
    } else if (activeRing === 'inner') {
      weekdaysRotation = initialRingRotation + deltaAngle;
    }

    // Update active state and date dynamically during user drag
    updateVaultStateFromRotation();
  });

  window.addEventListener('pointerup', () => {
    if (!isDragging) return;
    isDragging = false;

    // Snap ONLY the dragged ring to its nearest notch
    if (activeRing === 'outer') {
      monthRotation = Math.round(monthRotation / monthAngleStep) * monthAngleStep;
    } else if (activeRing === 'middle') {
      daysRotation = Math.round(daysRotation / dayAngleStep) * dayAngleStep;
    } else if (activeRing === 'inner') {
      weekdaysRotation = Math.round(weekdaysRotation / weekdayAngleStep) * weekdayAngleStep;
    }

    activeRing = null;
    updateVaultStateFromRotation();
    triggerZoomOut();
  });

  // Pure Visual Ambient Motion Loop (Does NOT alter date selection)
  function runAmbientSpin() {
    if (!isDragging) {
      monthRotation += AMBIENT_MONTH_SPEED;        // Anti-Clockwise
      daysRotation += AMBIENT_DAY_SPEED;           // Clockwise
      weekdaysRotation += AMBIENT_WEEKDAY_SPEED;    // Anti-Clockwise
      
      applyWheelTransforms();
    }
    requestAnimationFrame(runAmbientSpin);
  }

  // Align Vault Wheels to Live Present Time
  function alignToLivePresent() {
    const now = new Date();
    const ethToday = gregorianToEthiopian(now.getFullYear(), now.getMonth() + 1, now.getDate());

    currentYear = ethToday.year;
    activeMonthIndex = ethToday.monthIndex;
    selectedDay = ethToday.day;

    monthRotation = -activeMonthIndex * monthAngleStep;
    daysRotation = -(selectedDay - 1) * dayAngleStep;
    weekdaysRotation = -now.getDay() * weekdayAngleStep;

    triggerZoomIn();
    syncCalendarUI();
    triggerZoomOut();
  }

  document.getElementById('prevYearBtn').addEventListener('click', () => { currentYear--; syncCalendarUI(); });
  document.getElementById('nextYearBtn').addEventListener('click', () => { currentYear++; syncCalendarUI(); });
  document.getElementById('todayBtn').addEventListener('click', alignToLivePresent);

  // Dashboard Tabs
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      document.getElementById(tab.dataset.tab).classList.add('active');
    });
  });

  // Converter Engine
  const gregInput = document.getElementById('gregInput');
  const ethResultGeez = document.getElementById('ethioResultGeez');
  const ethResultEn = document.getElementById('ethioResultEn');
  const ethResultWeekday = document.getElementById('ethioResultWeekday');

  const todayStr = new Date().toISOString().split('T')[0];
  gregInput.value = todayStr;

  function handleConverterChange() {
    if (!gregInput.value) return;
    const parts = gregInput.value.split('-');
    const gY = parseInt(parts[0], 10);
    const gM = parseInt(parts[1], 10);
    const gD = parseInt(parts[2], 10);

    const ethRes = gregorianToEthiopian(gY, gM, gD);
    const mObj = ETHIO_MONTHS[ethRes.monthIndex];
    const dGeez = toGeezNumber(ethRes.day);
    
    const dateObj = new Date(gY, gM - 1, gD);
    const dayIdx = dateObj.getDay();

    ethResultGeez.textContent = `${mObj.geez} ${dGeez}, ${ethRes.year}`;
    ethResultEn.textContent = `${mObj.en} ${ethRes.day.toString().padStart(2, '0')}, ${ethRes.year} E.C.`;
    ethResultWeekday.textContent = `${WEEKDAYS_GEEZ[dayIdx]} (${WEEKDAYS_EN[dayIdx]})`;
  }

  gregInput.addEventListener('change', handleConverterChange);
  handleConverterChange();

  // Initial Engine Boot & Ambient Spin Trigger
  buildVaultNodes();
  alignToLivePresent();
  runAmbientSpin();
});