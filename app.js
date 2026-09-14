import { toEthiopianDate, toEthiopianTime } from './ethiopianDate.js';

// Total Solar Eclipse Target Ephemeris
const TARGET_ECLIPSE = new Date("2027-08-02T13:42:00");
let isChronoSim = true;
let simulatedDate = new Date(TARGET_ECLIPSE);

document.addEventListener("DOMContentLoaded", () => {
  initStardustCanvas();
  initOrbitalStageCanvas();
  initCountdown();
  initChronologyConverter();
  updateReadouts(TARGET_ECLIPSE);
});

// Ambient Floating Stardust & Deep Space Particle Field
function initStardustCanvas() {
  const canvas = document.getElementById("dustCanvas");
  const ctx = canvas.getContext("2d");

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = Array.from({ length: 90 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 1.2 + 0.3,
    alpha: Math.random() * 0.6 + 0.1,
    vx: (Math.random() - 0.5) * 0.15,
    vy: (Math.random() - 0.5) * 0.15
  }));

  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.fillStyle = `rgba(229, 190, 107, ${p.alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

// Realistic Orbital & Eclipse Canvas
function initOrbitalStageCanvas() {
  const canvas = document.getElementById("eclipseStageCanvas");
  const ctx = canvas.getContext("2d");
  const toggleBtn = document.getElementById("toggleOrbitalMode");
  const phaseReadout = document.getElementById("phaseReadout");

  let animProgress = 0;

  function drawStage() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cX = canvas.width / 2;
    const cY = canvas.height / 2;
    const sunRadius = 65;

    // Atmospheric Solar Corona Glow
    const coronaGradient = ctx.createRadialGradient(cX, cY, sunRadius * 0.8, cX, cY, sunRadius * 2.8);
    coronaGradient.addColorStop(0, 'rgba(255, 235, 180, 0.85)');
    coronaGradient.addColorStop(0.25, 'rgba(229, 190, 107, 0.25)');
    coronaGradient.addColorStop(0.6, 'rgba(120, 150, 220, 0.08)');
    coronaGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = coronaGradient;
    ctx.beginPath();
    ctx.arc(cX, cY, sunRadius * 2.8, 0, Math.PI * 2);
    ctx.fill();

    // Photosphere Core
    ctx.fillStyle = '#FFF8E7';
    ctx.shadowColor = 'rgba(229, 190, 107, 0.8)';
    ctx.shadowBlur = 25;
    ctx.beginPath();
    ctx.arc(cX, cY, sunRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Dynamic Moon Positioning (Calculated by Simulation Mode)
    let offsetRatio = isChronoSim ? Math.sin(animProgress) : 0; // 0 = Totality Alignment
    const moonX = cX + (offsetRatio * 90);
    const moonY = cY + (offsetRatio * 15);

    // Moon Disc
    ctx.fillStyle = '#030306';
    ctx.beginPath();
    ctx.arc(moonX, moonY, sunRadius + 0.5, 0, Math.PI * 2);
    ctx.fill();

    // Atmosphere Rim Glow on Moon Shadow
    ctx.strokeStyle = 'rgba(229, 190, 107, 0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Calculate Totality Percentage
    const alignmentPercent = Math.max(0, (100 - (Math.abs(offsetRatio) * 100))).toFixed(1);
    phaseReadout.textContent = `ALIGNMENT: ${alignmentPercent}% OVER EAST AFRICA`;

    if (isChronoSim) {
      animProgress += 0.006;
    }

    requestAnimationFrame(drawStage);
  }

  drawStage();

  toggleBtn.addEventListener("click", () => {
    isChronoSim = !isChronoSim;
    toggleBtn.querySelector("span").textContent = isChronoSim ? "LOCK TOTALITY" : "CHRONO SIMULATION";
  });
}

function updateReadouts(date) {
  const ethDate = toEthiopianDate(date);
  const ethTime = toEthiopianTime(date);

  document.getElementById("ethiopianDateReadout").textContent = ethDate.formatted;
  document.getElementById("ethiopianTimeReadout").textContent = ethTime;
}

function initCountdown() {
  const days = document.getElementById("cdDays");
  const hours = document.getElementById("cdHours");
  const mins = document.getElementById("cdMins");
  const secs = document.getElementById("cdSecs");

  function update() {
    const now = new Date();
    const diff = TARGET_ECLIPSE - now;

    if (diff <= 0) return;

    days.textContent = String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(3, '0');
    hours.textContent = String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, '0');
    mins.textContent = String(Math.floor((diff / 1000 / 60) % 60)).padStart(2, '0');
    secs.textContent = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

function initChronologyConverter() {
  const dateInput = document.getElementById("dateInput");
  const output = document.getElementById("convertedOutput");

  dateInput.addEventListener("change", (e) => {
    const selDate = new Date(e.target.value);
    if (!isNaN(selDate)) {
      const converted = toEthiopianDate(selDate);
      output.textContent = converted.formatted;
      updateReadouts(selDate);
    }
  });
}