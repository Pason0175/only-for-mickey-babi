const galaxy = document.getElementById('galaxy');
const flower = document.getElementById('flowerRoot');
const grass = document.getElementById('grass');
const butterfly = document.getElementById('butterfly');
const loveCopy = document.getElementById('loveCopy');
const musicBtn = document.getElementById('musicBtn');
let player;
let playing = false;

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
window.addEventListener('resize', drawGalaxy);

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
  gsap.to(grass, {
    x: 10,
    yoyo: true,
    repeat: -1,
    duration: 3.2,
    ease: 'sine.inOut',
  });

  // smoother butterfly path
  gsap.set(butterfly, { x: -260, y: 0 });
  gsap.to(butterfly.querySelector('.left'), { rotateY: 36, yoyo: true, repeat: -1, duration: 0.18, ease: 'sine.inOut' });
  gsap.to(butterfly.querySelector('.right'), { rotateY: -36, yoyo: true, repeat: -1, duration: 0.18, ease: 'sine.inOut' });

  const path = [
    { x: -240, y: 0 },
    { x: -120, y: -55 },
    { x: 10, y: -20 },
    { x: 140, y: -78 },
    { x: 260, y: -36 },
    { x: 80, y: 30 },
    { x: -90, y: -5 },
    { x: -240, y: 0 },
  ];
  const fly = gsap.timeline({ repeat: -1, defaults: { duration: 1.45, ease: 'sine.inOut' } });
  path.forEach((p) => fly.to(butterfly, { x: p.x, y: p.y }, '+=0.01'));
}

window.onYouTubeIframeAPIReady = function () {
  player = new YT.Player('yt-player', {
    height: '0',
    width: '0',
    videoId: 'tyKu0uZS86Q',
    playerVars: {
      autoplay: 0,
      controls: 0,
      disablekb: 1,
      modestbranding: 1,
      rel: 0,
      loop: 1,
      playlist: 'tyKu0uZS86Q',
    },
  });
};

musicBtn?.addEventListener('click', () => {
  if (!player) return;
  if (!playing) {
    player.playVideo();
    musicBtn.textContent = '⏸ Pause music';
    playing = true;
  } else {
    player.pauseVideo();
    musicBtn.textContent = '🎵 Tap to play music';
    playing = false;
  }
});
