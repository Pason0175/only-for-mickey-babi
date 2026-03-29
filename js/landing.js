const wrap = document.getElementById('envelopeWrap');
const flap = document.getElementById('flap');
const letter = document.getElementById('letter');
const hint = document.getElementById('tapHint');

let opened = false;

if (window.gsap) {
  gsap.set(letter, { y: 72, opacity: 0.02 });
  gsap.to(wrap, { y: -6, repeat: -1, yoyo: true, duration: 2.5, ease: 'sine.inOut' });
  gsap.to(hint, { opacity: 0.35, y: 4, repeat: -1, yoyo: true, duration: 1.2, ease: 'sine.inOut' });
}

function openLetter() {
  if (opened) return;
  opened = true;

  const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
  tl.to(hint, { opacity: 0, duration: 0.2 })
    .to(flap, { rotateX: -178, duration: 0.9, ease: 'power3.inOut' }, 0)
    .to(letter, { y: -34, opacity: 1, duration: 1.15, ease: 'power3.out' }, 0.2)
    .to(wrap, { scale: 1.02, duration: 0.35, yoyo: true, repeat: 1 }, 0.25)
    .to({}, { duration: 1.25 })
    .to('body', {
      opacity: 0,
      duration: 0.6,
      onComplete: () => {
        window.location.href = '/love/';
      },
    });
}

wrap?.addEventListener('click', openLetter);
wrap?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    openLetter();
  }
});
