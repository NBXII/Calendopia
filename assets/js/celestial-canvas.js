/**
 * Astropia Starfield & Eclipse Visual Simulator
 */
class CelestialCanvas {
  constructor(starfieldId, eclipseSimId) {
    this.starCanvas = document.getElementById(starfieldId);
    this.simCanvas = document.getElementById(eclipseSimId);
    this.starCtx = this.starCanvas.getContext('2d');
    this.simCtx = this.simCanvas.getContext('2d');
    
    this.stars = [];
    this.initStarfield();
    window.addEventListener('resize', () => this.initStarfield());
  }

  initStarfield() {
    this.starCanvas.width = window.innerWidth;
    this.starCanvas.height = window.innerHeight;
    this.stars = [];
    for (let i = 0; i < 150; i++) {
      this.stars.push({
        x: Math.random() * this.starCanvas.width,
        y: Math.random() * this.starCanvas.height,
        size: Math.random() * 1.5,
        alpha: Math.random()
      });
    }
    this.renderStarfield();
  }

  renderStarfield() {
    this.starCtx.clearRect(0, 0, this.starCanvas.width, this.starCanvas.height);
    this.starCtx.fillStyle = '#ffffff';
    this.stars.forEach(s => {
      this.starCtx.globalAlpha = s.alpha * 0.7;
      this.starCtx.fillRect(s.x, s.y, s.size, s.size);
    });
    requestAnimationFrame(() => this.renderStarfield());
  }

  renderEclipseSimulation(obscurationRatio) {
    const ctx = this.simCtx;
    const w = this.simCanvas.width;
    const h = this.simCanvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const radius = 55;

    ctx.clearRect(0, 0, w, h);

    // 1. Solar Corona Glow
    const coronaGlow = ctx.createRadialGradient(cx, cy, radius - 5, cx, cy, radius + 35);
    coronaGlow.addColorStop(0, 'rgba(245, 158, 11, 0.9)');
    coronaGlow.addColorStop(0.5, 'rgba(245, 158, 11, 0.2)');
    coronaGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = coronaGlow;
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 35, 0, Math.PI * 2);
    ctx.fill();

    // 2. The Sun Disc
    ctx.fillStyle = '#FFF5EA';
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    // 3. The Moon Disc (Offset calculated based on obscuration ratio)
    const moonOffsetX = (1 - obscurationRatio) * (radius * 2.2);
    ctx.fillStyle = '#030712';
    ctx.beginPath();
    ctx.arc(cx - moonOffsetX, cy, radius - 0.5, 0, Math.PI * 2);
    ctx.fill();

    // Crosshair Alignment Markings
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - radius - 20, cy); ctx.lineTo(cx + radius + 20, cy);
    ctx.moveTo(cx, cy - radius - 20); ctx.lineTo(cx, cy + radius + 20);
    ctx.stroke();
  }
}