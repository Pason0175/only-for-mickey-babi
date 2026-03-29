const wrap = document.getElementById('envelopeWrap');
const flap = document.getElementById('flap');
const letter = document.getElementById('letter');
const hint = document.getElementById('tapHint');
const galaxy = document.getElementById('galaxy');
let opened = false;

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
  const count = Math.min(520, Math.floor((w * h) / 4200));
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.5 + 0.3,
      a: Math.random() * 0.8 + 0.2,
    });
  }

  let t = 0;
  function frame() {
    t += 0.0014;
    ctx.clearRect(0, 0, w, h);

    // subtle rotating nebula feel
    const cx = w / 2;
    const cy = h / 2;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(t);
    const g = ctx.createRadialGradient(0, 0, 20, 0, 0, Math.max(w, h) * 0.8);
    g.addColorStop(0, 'rgba(138,92,246,0.05)');
    g.addColorStop(0.6, 'rgba(96,165,250,0.03)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, Math.max(w, h) * 0.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    for (const s of stars) {
      const tw = 0.65 + Math.sin((s.x + s.y) * 0.02 + t * 40) * 0.35;
      ctx.globalAlpha = s.a * tw;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(s.x + Math.sin(t * 4 + s.y) * 0.22, s.y + Math.cos(t * 4 + s.x) * 0.22, s.r, s.r);
    }

    requestAnimationFrame(frame);
  }
  frame();
}

drawGalaxy();
window.addEventListener('resize', drawGalaxy);

if (window.gsap) {
  gsap.set(letter, { y: 120, opacity: 0 }); // inside envelope
  gsap.to(wrap, { y: -5, repeat: -1, yoyo: true, duration: 2.8, ease: 'sine.inOut' });
  gsap.to(hint, { opacity: 0.35, y: 3, repeat: -1, yoyo: true, duration: 1.1, ease: 'sine.inOut' });
}

function openLetter() {
  if (opened) return;
  opened = true;
  const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
  tl.to(hint, { opacity: 0, duration: 0.2 }, 0)
    .to(flap, { rotateX: -178, duration: 0.85, ease: 'power3.inOut' }, 0)
    .to(letter, { y: -8, opacity: 1, duration: 1.15, ease: 'power3.out' }, 0.2)
    .to({}, { duration: 1.5 })
    .to('body', {
      opacity: 0,
      duration: 0.55,
      onComplete: () => (window.location.href = '/love/'),
    });
}

wrap?.addEventListener('click', openLetter);
wrap?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    openLetter();
  }
});
