import { toEthiopianDate, toEthiopianTime } from './ethiopianDate.js';

// Total Solar Eclipse Target Ephemeris
const TARGET_ECLIPSE = new Date("2027-08-02T13:42:00");
let isChronoSim = true;

document.addEventListener("DOMContentLoaded", () => {
  initSpaceEngineCanvas();
  initOrbitalStageCanvas();
  initCountdown();
  initChronologyConverter();
  updateReadouts(TARGET_ECLIPSE);
});

// Deep Void Space Background Engine (Multi-depth Particles + Dynamic Shooting Stars)
function initSpaceEngineCanvas() {
  const canvas = document.getElementById("spaceEngineCanvas");
  const ctx = canvas.getContext("2d");

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Multi-layered floating cosmic dust particles
  const particles = Array.from({ length: 140 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 1.5 + 0.2,
    alpha: Math.random() * 0.7 + 0.1,
    baseAlpha: Math.random() * 0.5 + 0.1,
    pulseSpeed: Math.random() * 0.02 + 0.005,
    pulseAngle: Math.random() * Math.PI * 2,
    vx: (Math.random() - 0.5) * 0.1,
    vy: (Math.random() - 0.5) * 0.1,
    layer: Math.random() < 0.2 ? 'gold' : 'silver'
  }));

  // Dynamic Shooting Stars Pool
  let shootingStars = [];

  function spawnShootingStar() {
    const startX = Math.random() * width * 1.2 - width * 0.1;
    const startY = Math.random() * height * 0.5;
    const length = Math.random() * 150 + 80;
    const speed = Math.random() * 12 + 8;
    const angle = (Math.PI / 180) * (Math.random() * 15 + 35); // 35 - 50 deg angle

    shootingStars.push({
      x: startX,
      y: startY,
      dx: Math.cos(angle) * speed,
      dy: Math.sin(angle) * speed,
      length: length,
      life: 1.0,
      decay: Math.random() * 0.015 + 0.01
    });
  }

  // Random shooting star scheduler (every 4-9 seconds)
  function scheduleShootingStar() {
    const delay = Math.random() * 5000 + 4000;
    setTimeout(() => {
      spawnShootingStar();
      scheduleShootingStar();
    }, delay);
  }

  scheduleShootingStar();

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // 1. Draw Organic Floating Void Dust
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      p.pulseAngle += p.pulseSpeed;
      p.alpha = p.baseAlpha + Math.sin(p.pulseAngle) * 0.25;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.layer === 'gold' 
        ? `rgba(229, 190, 107, ${Math.max(0, p.alpha)})`
        : `rgba(200, 210, 230, ${Math.max(0, p.alpha * 0.8)})`;
      ctx.fill();
    });

    // 2. Render Atmospheric Shooting Stars
    shootingStars.forEach((star, index) => {
      star.x += star.dx;
      star.y += star.dy;
      star.life -= star.decay;

      if (star.life <= 0) {
        shootingStars.splice(index, 1);
        return;
      }

      const tailX = star.x - (star.dx / Math.hypot(star.dx, star.dy)) * star.length;
      const tailY = star.y - (star.dy / Math.hypot(star.dx, star.dy)) * star.length;

      const gradient = ctx.createLinearGradient(star.x, star.y, tailX, tailY);
      gradient.addColorStop(0, `rgba(255, 245, 220, ${star.life})`);
      gradient.addColorStop(0.3, `rgba(229, 190, 107, ${star.life * 0.6})`);
      gradient.addColorStop(1, 'rgba(229, 190, 107, 0)');

      ctx.lineWidth = 1.5;
      ctx.strokeStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(star.x, star.y);
      ctx.lineTo(tailX, tailY);
      ctx.stroke();

      // Bright Head Flare
      ctx.fillStyle = `rgba(255, 255, 255, ${star.life})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, 1.2, 0, Math.PI * 2);
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

    // Corona Glow
    const coronaGradient = ctx.createRadialGradient(cX, cY, sunRadius * 0.8, cX, cY, sunRadius * 2.8);
    coronaGradient.addColorStop(0, 'rgba(255, 235, 180, 0.85)');
    coronaGradient.addColorStop(0.25, 'rgba(229, 190, 107, 0.22)');
    coronaGradient.addColorStop(0.6, 'rgba(90, 120, 190, 0.06)');
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

    // Dynamic Moon Position Offset
    let offsetRatio = isChronoSim ? Math.sin(animProgress) : 0;
    const moonX = cX + (offsetRatio * 90);
    const moonY = cY + (offsetRatio * 15);

    // Moon Disc
    ctx.fillStyle = '#020204';
    ctx.beginPath();
    ctx.arc(moonX, moonY, sunRadius + 0.5, 0, Math.PI * 2);
    ctx.fill();

    // Subtle Rim Light
    ctx.strokeStyle = 'rgba(229, 190, 107, 0.25)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Alignment Calculation
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