const galaxy = document.getElementById('galaxy');
const flower = document.getElementById('flowerRoot');
const grass = document.getElementById('grass');
const butterfly = document.getElementById('butterfly');
const loveCopy = document.getElementById('loveCopy');
const musicBtn = document.getElementById('musicBtn');
const bgMusic = document.getElementById('bgMusic');
let playing = false;

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
  const count = Math.min(900, Math.floor((w * h) / 2600));
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.4 + 0.2,
      a: Math.random() * 0.8 + 0.15,
      p: Math.random() * Math.PI * 2,
    });
  }

  let t = 0;
  function frame() {
    t += 0.0011;
    ctx.clearRect(0, 0, w, h);

    const g = ctx.createRadialGradient(w * 0.72, h * 0.12, 12, w * 0.72, h * 0.12, Math.max(w, h) * 0.9);
    g.addColorStop(0, 'rgba(168,85,247,0.13)');
    g.addColorStop(0.45, 'rgba(59,130,246,0.06)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    for (const s of stars) {
      const tw = 0.65 + Math.sin(t * 28 + s.p) * 0.35;
      ctx.globalAlpha = s.a * tw;
      ctx.fillStyle = '#fff';
      const dx = Math.cos(t * 2 + s.p) * 0.35;
      const dy = Math.sin(t * 2 + s.p) * 0.35;
      ctx.fillRect(s.x + dx, s.y + dy, s.r, s.r);
    }
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

if (window.gsap) {
  gsap.set(loveCopy, { y: -26, opacity: 0 });
  gsap.set(flower, { y: 170, opacity: 0.2, scale: 0.78 });
  gsap.set(grass, { y: 120, opacity: 0 });

  gsap.timeline()
    .to(loveCopy, { y: 0, opacity: 1, duration: 1.05, ease: 'power3.out' }, 0)
    .to(flower, { y: 0, opacity: 1, scale: 1.0, duration: 1.7, ease: 'back.out(1.1)' }, 0.12)
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
    try {
      await bgMusic.play();
      musicBtn.textContent = '⏸ Pause music';
      playing = true;
    } catch {
      musicBtn.textContent = '⚠️ Tap again to play';
    }
  } else {
    bgMusic.pause();
    musicBtn.textContent = '🎵 Tap to play music';
    playing = false;
  }
});
