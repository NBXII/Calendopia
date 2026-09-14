/**
 * CALENDOPIA VOID ENGINE - ACCESSIBLE MONTH GRID & ROTARY DIAL
 */

document.addEventListener('DOMContentLoaded', () => {

  // Engine State
  let currentYear = 2019;
  let activeMonthIndex = 0;
  let selectedDay = 1;
  let rotationAngle = 0;

  const totalMonths = 13;
  const angleStep = 360 / totalMonths;

  // Ethiopian Calendar Data
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

  const EVANGELISTS = ["Zemen Yohannes", "Zemen Matewos", "Zemen Markos", "Zemen Lukas"];
  const GEEZ_NUMERALS = ['', '፩', '፪', '፫', '፬', '፭', '፮', '፯', '፰', '፱', '፲', 
    '፲፩', '፲፪', '፲፫', '፲፬', '፲፭', '፲፮', '፲፯', '፲፰', '፲፱', '፪፰', 
    '፪፩', '፪፪', '፪፫', '፪፬', '፪፭', '፪፮', '፪፯', '፪፰', '፪፱', '፴'];

  // DOM Handles
  const dialWheel = document.getElementById('dialWheel');
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
  // 1. Particle Canvas Engine
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
      this.opacity = Math.random() * 0.4 + 0.1;
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
  // 2. Rotary Dial Mechanics
  // ==========================================
  function buildDialNodes() {
    dialWheel.innerHTML = '';
    const radius = 42;

    ETHIO_MONTHS.forEach((m, idx) => {
      const angle = idx * angleStep;
      const rad = (angle * Math.PI) / 180;
      
      const x = 50 + radius * Math.sin(rad);
      const y = 50 - radius * Math.cos(rad);

      const node = document.createElement('div');
      node.className = 'month-node';
      node.id = `node-${idx}`;
      node.textContent = m.geez;
      node.style.left = `${x}%`;
      node.style.top = `${y}%`;
      node.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;

      dialWheel.appendChild(node);
    });
  }

  function updateWheelView() {
    dialWheel.style.transform = `rotate(${rotationAngle}deg)`;

    let normalized = (-rotationAngle % 360 + 360) % 360;
    activeMonthIndex = Math.round(normalized / angleStep) % totalMonths;

    const currentMonth = ETHIO_MONTHS[activeMonthIndex];

    // Highlight active node on the wheel
    document.querySelectorAll('.month-node').forEach((n, idx) => {
      n.classList.toggle('active-node', idx === activeMonthIndex);
    });

    // Update Hub Displays
    hubGeezMonth.textContent = currentMonth.geez;
    hubEnMonth.textContent = currentMonth.en.toUpperCase();
    hubYearLabel.textContent = `${currentYear} E.C.`;
    hubMonthIndex.textContent = `${(activeMonthIndex + 1).toString().padStart(2, '0')} / 13`;

    // Update Inspector & Calendar Titles
    calTitle.textContent = `${currentMonth.en.toUpperCase()} (${currentMonth.geez})`;
    document.getElementById('infoSeason').textContent = currentMonth.season;
    document.getElementById('infoHolidays').textContent = currentMonth.holidays;
    
    let daysCount = (activeMonthIndex === 12 && (currentYear + 1) % 4 === 0) ? 6 : currentMonth.days;
    document.getElementById('infoDaysCount').textContent = `${daysCount} Days`;
    document.getElementById('evangelistBadge').textContent = EVANGELISTS[currentYear % 4];
    yearReadout.textContent = `${currentYear} E.C.`;

    renderFullMonthGrid(daysCount);
  }

  // ==========================================
  // 3. Full Month Calendar Grid Generator
  // ==========================================
  function renderFullMonthGrid(daysCount) {
    daysGrid.innerHTML = '';
    
    // Default selected day bounds check
    if (selectedDay > daysCount) selectedDay = daysCount;

    for (let d = 1; d <= daysCount; d++) {
      const cell = document.createElement('div');
      cell.className = `day-cell ${d === selectedDay ? 'active-day' : ''}`;
      
      const geezVal = GEEZ_NUMERALS[d] || d;
      cell.innerHTML = `
        <span class="cell-geez">${geezVal}</span>
        <span class="cell-num">${d}</span>
      `;

      cell.addEventListener('click', () => {
        selectedDay = d;
        document.querySelectorAll('.day-cell').forEach(c => c.classList.remove('active-day'));
        cell.classList.add('active-day');
        
        const m = ETHIO_MONTHS[activeMonthIndex];
        selectedDayLabel.textContent = `SELECTED DAY: ${d.toString().padStart(2, '0')} ${m.en} ${currentYear} E.C.`;
      });

      daysGrid.appendChild(cell);
    }

    const currentMonth = ETHIO_MONTHS[activeMonthIndex];
    holidayNotice.textContent = currentMonth.holidays;
    selectedDayLabel.textContent = `SELECTED DAY: ${selectedDay.toString().padStart(2, '0')} ${currentMonth.en} ${currentYear} E.C.`;
  }

  // Pointer Physics for Wheel
  let isDragging = false;
  let startAngle = 0;

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
    startAngle = getAngleFromCenter(e) - rotationAngle;
  });

  window.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    rotationAngle = getAngleFromCenter(e) - startAngle;
    updateWheelView();
  });

  window.addEventListener('pointerup', () => {
    if (!isDragging) return;
    isDragging = false;
    rotationAngle = Math.round(rotationAngle / angleStep) * angleStep;
    updateWheelView();
  });

  // Buttons
  document.getElementById('prevYearBtn').addEventListener('click', () => { currentYear--; updateWheelView(); });
  document.getElementById('nextYearBtn').addEventListener('click', () => { currentYear++; updateWheelView(); });
  document.getElementById('todayBtn').addEventListener('click', () => {
    currentYear = 2019;
    rotationAngle = 0;
    selectedDay = 1;
    updateWheelView();
  });

  // Tab Switcher
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      document.getElementById(tab.dataset.tab).classList.add('active');
    });
  });

  // Clock Engine
  setInterval(() => {
    const now = new Date();
    document.getElementById('gregTimeVal').textContent = now.toLocaleTimeString();
    document.getElementById('gregDateVal').textContent = now.toDateString();

    let ethHour = (now.getHours() + 6) % 12 || 12;
    let ethPeriod = (now.getHours() >= 6 && now.getHours() < 18) ? 'ቀን' : 'ሌሊት';
    document.getElementById('ethioTimeVal').textContent = `${ethHour}:${now.getMinutes().toString().padStart(2, '0')} ${ethPeriod}`;
  }, 1000);

  // Init
  buildDialNodes();
  updateWheelView();
});