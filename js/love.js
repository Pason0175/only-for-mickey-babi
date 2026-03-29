const galaxy = document.getElementById('galaxy');
const flower = document.getElementById('flowerRoot');
const grass = document.getElementById('grass');
const butterfly = document.getElementById('butterfly');
const loveCopy = document.getElementById('loveCopy');
const musicBtn = document.getElementById('musicBtn');
const bgMusic = document.getElementById('bgMusic');
let playing = false;

async function startMusic() {
  if (!bgMusic || playing) return;
  try {
    await bgMusic.play();
    playing = true;
    if (musicBtn) musicBtn.textContent = '⏸ Pause music';
  } catch {
    if (musicBtn) musicBtn.textContent = '🎵 Tap to play music';
  }
}

function buildGrass() {
  if (!grass) return;
  grass.innerHTML = '';

  // Grass blades (inspired by provided component)
  const count = 150;
  for (let i = 0; i < count; i++) {
    const blade = document.createElement('div');
    blade.className = 'blade';
    const h = 20 + Math.random() * 40;
    const rot = -5 + Math.random() * 10;
    const dur = 2 + Math.random() * 2;
    const delay = Math.random() * 2;
    blade.style.height = `${h}px`;
    blade.style.setProperty('--rot', `${rot}deg`);
    blade.style.animation = `sway ${dur}s ease-in-out ${delay}s infinite alternate`;
    grass.appendChild(blade);
  }

  // Tiny flowers in grass
  const flowerColors = ['#FFB7B2', '#FFDAC1', '#E2F0CB', '#B5EAD7', '#C7CEEA'];
  const flowerCount = 15;
  for (let i = 0; i < flowerCount; i++) {
    const f = document.createElement('div');
    f.className = 'tiny-flower';
    const left = Math.random() * 100;
    const scale = 0.5 + Math.random() * 0.5;
    const delay = Math.random() * 3;
    const dur = 3 + Math.random() * 2;
    f.style.left = `${left}%`;
    f.style.setProperty('--scale', String(scale));
    f.style.animation = `float ${dur}s ease-in-out ${delay}s infinite`;

    const color = flowerColors[Math.floor(Math.random() * flowerColors.length)];
    [0, 60, 120, 180, 240, 300].forEach((deg) => {
      const p = document.createElement('div');
      p.className = 'tiny-petal';
      p.style.backgroundColor = color;
      p.style.transform = `rotate(${deg}deg) translateY(-2px)`;
      f.appendChild(p);
    });
    const c = document.createElement('div');
    c.className = 'tiny-center';
    f.appendChild(c);
    grass.appendChild(f);
  }
}

function drawGalaxy() {
  if (!galaxy) return;
  const ctx = galaxy.getContext('2d');
  if (!ctx) return;
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const w = window.innerWidth;
  const h = window.innerHeight;
  galaxy.width = w * dpr;
  galaxy.height = h * dpr;
  galaxy.style.width = w + 'px';
  galaxy.style.height = h + 'px';
  ctx.scale(dpr, dpr);

  const stars = [];
  const cx = w * 0.5;
  const cy = h * 0.48;
  const maxOrbit = Math.hypot(w, h) * 0.65;
  const tones = ['#ffffff', '#ffe4ef', '#ffd7e8', '#ffeef8', '#ffd1dc'];
  const count = Math.min(1400, Math.floor((w * h) / 1700));
  const moon = {
    x: w * 0.87,
    y: h * 0.08,
    r: Math.min(w, h) * 0.07,
  };
  const shootingStars = [];
  let nextShotAt = 0;

  function spawnShootingStar(now) {
    const fromLeft = Math.random() > 0.5;
    const startX = fromLeft ? -120 : w + 120;
    const startY = h * (0.05 + Math.random() * 0.25);
    const vx = fromLeft ? 14 + Math.random() * 8 : -(14 + Math.random() * 8);
    const vy = 5 + Math.random() * 3;
    shootingStars.push({
      x: startX,
      y: startY,
      vx,
      vy,
      len: 85 + Math.random() * 85,
      life: 0,
      maxLife: 28 + Math.random() * 18,
      a: 0.75 + Math.random() * 0.2,
    });
    nextShotAt = now + 1400 + Math.random() * 2600;
  }
  for (let i = 0; i < count; i++) {
    stars.push({
      orbit: Math.random() * maxOrbit,
      theta: Math.random() * Math.PI * 2,
      speed: 0.38 + Math.random() * 1.35,
      r: Math.random() * 1.9 + 0.25,
      a: Math.random() * 0.9 + 0.2,
      drift: Math.random() * 2.2 + 0.3,
      p: Math.random() * Math.PI * 2,
      c: tones[(Math.random() * tones.length) | 0],
    });
  }

  let t = 0;
  nextShotAt = 1000 + Math.random() * 1800;
  function frame() {
    t += 0.00108;
    ctx.clearRect(0, 0, w, h);

    const g = ctx.createRadialGradient(cx, cy - h * 0.18, 14, cx, cy, Math.max(w, h) * 0.88);
    g.addColorStop(0, 'rgba(255,182,212,0.24)');
    g.addColorStop(0.35, 'rgba(244,114,182,0.12)');
    g.addColorStop(0.7, 'rgba(56,189,248,0.07)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    // Romantic moon with soft halo and slight pulse.
    const moonPulse = 0.92 + Math.sin(t * 8) * 0.08;
    const moonGlow = ctx.createRadialGradient(moon.x, moon.y, moon.r * 0.2, moon.x, moon.y, moon.r * 2.8);
    moonGlow.addColorStop(0, `rgba(255, 252, 240, ${0.3 * moonPulse})`);
    moonGlow.addColorStop(0.5, 'rgba(255, 233, 204, 0.14)');
    moonGlow.addColorStop(1, 'rgba(255, 233, 204, 0)');
    ctx.fillStyle = moonGlow;
    ctx.beginPath();
    ctx.arc(moon.x, moon.y, moon.r * 2.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fff6dd';
    ctx.shadowColor = '#fff1cc';
    ctx.shadowBlur = moon.r * 0.7;
    ctx.beginPath();
    ctx.arc(moon.x, moon.y, moon.r, 0, Math.PI * 2);
    ctx.fill();

    // Small crater shading for depth.
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = '#d6cbb1';
    ctx.beginPath();
    ctx.arc(moon.x - moon.r * 0.24, moon.y - moon.r * 0.05, moon.r * 0.18, 0, Math.PI * 2);
    ctx.arc(moon.x + moon.r * 0.15, moon.y + moon.r * 0.18, moon.r * 0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    for (const s of stars) {
      const theta = s.theta + t * s.speed;
      const orbitX = Math.cos(theta) * s.orbit;
      const orbitY = Math.sin(theta) * s.orbit * 0.58;
      const driftX = Math.cos(t * 1.6 + s.p) * s.drift;
      const driftY = Math.sin(t * 2.2 + s.p) * s.drift;
      const x = cx + orbitX + driftX;
      const y = cy + orbitY + driftY;

      const tw = 0.72 + Math.sin(t * 52 + s.p) * 0.28;
      const alpha = Math.min(1, s.a * tw);

      ctx.globalAlpha = alpha;
      ctx.fillStyle = s.c;
      ctx.shadowColor = s.c;
      ctx.shadowBlur = s.r * 6.5;
      ctx.beginPath();
      ctx.arc(x, y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Shooting stars
    if (t * 1000 >= nextShotAt && shootingStars.length < 3) {
      spawnShootingStar(t * 1000);
    }
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const s = shootingStars[i];
      s.x += s.vx;
      s.y += s.vy;
      s.life += 1;
      const lifeRatio = 1 - s.life / s.maxLife;
      if (lifeRatio <= 0) {
        shootingStars.splice(i, 1);
        continue;
      }

      const tailX = s.x - (s.vx > 0 ? 1 : -1) * s.len;
      const tailY = s.y - s.vy * 1.6;
      const trail = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
      trail.addColorStop(0, `rgba(255,255,255,${0.95 * lifeRatio})`);
      trail.addColorStop(0.35, `rgba(255,221,238,${0.55 * lifeRatio})`);
      trail.addColorStop(1, 'rgba(255,221,238,0)');

      ctx.strokeStyle = trail;
      ctx.lineWidth = 2.1;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(tailX, tailY);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffe4ef';
      ctx.shadowBlur = 8;
      ctx.globalAlpha = s.a * lifeRatio;
      ctx.beginPath();
      ctx.arc(s.x, s.y, 1.9, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    requestAnimationFrame(frame);
  }
  frame();
}

drawGalaxy();
buildGrass();
window.addEventListener('resize', () => {
  drawGalaxy();
  buildGrass();
});

// Try autoplay as soon as /love opens.
startMusic();

// If autoplay is blocked, retry on first user interaction anywhere.
['pointerdown', 'touchstart', 'keydown'].forEach((eventName) => {
  window.addEventListener(eventName, startMusic, { once: true });
});

if (window.gsap) {
  gsap.set(loveCopy, { y: -26, opacity: 0 });
  gsap.set(flower, { y: 0, opacity: 0.2, scale: 0.78 });
  gsap.set(grass, { y: 120, opacity: 0 });

  gsap.timeline()
    .to(loveCopy, { y: 0, opacity: 1, duration: 1.05, ease: 'power3.out' }, 0)
    .to(flower, { opacity: 1, scale: 1.0, duration: 1.7, ease: 'back.out(1.1)' }, 0.12)
    .to(grass, { y: 0, opacity: 1, duration: 1.25, ease: 'power2.out' }, 0.22);

  // flower & grass wind sway
  gsap.to(flower, {
    rotation: 2.6,
    transformOrigin: 'bottom center',
    yoyo: true,
    repeat: -1,
    duration: 2.8,
    ease: 'sine.inOut',
  });

  // smoother butterfly: continuous periodic motion (loop start=end seamlessly)
  gsap.to(butterfly.querySelector('.left'), { rotateY: 38, yoyo: true, repeat: -1, duration: 0.16, ease: 'sine.inOut' });
  gsap.to(butterfly.querySelector('.right'), { rotateY: -38, yoyo: true, repeat: -1, duration: 0.16, ease: 'sine.inOut' });

  const orbit = { t: 0 };
  gsap.to(orbit, {
    t: Math.PI * 2,
    duration: 9,
    repeat: -1,
    ease: 'none',
    onUpdate: () => {
      const x = Math.cos(orbit.t) * 210 + Math.cos(orbit.t * 2.2) * 35;
      const y = Math.sin(orbit.t) * 55 - 18 + Math.sin(orbit.t * 1.6) * 12;
      gsap.set(butterfly, { x, y, rotation: Math.sin(orbit.t) * 10 });
    },
  });
}

musicBtn?.addEventListener('click', async () => {
  if (!bgMusic) return;
  if (!playing) {
    await startMusic();
  } else {
    bgMusic.pause();
    if (musicBtn) musicBtn.textContent = '🎵 Tap to play music';
    playing = false;
  }
});
