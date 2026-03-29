const openBtn = document.getElementById('openBtn');
const flap = document.getElementById('flap');
const letter = document.getElementById('letter');
const wrap = document.getElementById('envelopeWrap');

if (window.gsap) {
  gsap.set(letter, { y: 80, opacity: 0 });
}

openBtn?.addEventListener('click', () => {
  if (!window.gsap) {
    window.location.href = '/love/';
    return;
  }
  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
  tl.to(flap, { rotateX: -180, duration: 0.8 })
    .to(letter, { y: -20, opacity: 1, duration: 0.7 }, '-=0.3')
    .to(wrap, { y: -8, duration: 0.2, yoyo: true, repeat: 1 }, '-=0.2')
    .to('.envelope-wrap', { scale: 0.94, duration: 0.35 }, '+=0.35')
    .to('.stage', { opacity: 0, duration: 0.45, onComplete: () => { window.location.href = '/love/'; } });
});
