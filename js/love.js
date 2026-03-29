const card = document.getElementById('loveCard');
const flower = document.getElementById('flowerRoot');
const butterfly = document.getElementById('butterfly');
const grass = document.getElementById('grass');
const musicBtn = document.getElementById('musicBtn');
let player;
let playing = false;

// intro
if (window.gsap) {
  gsap.set(card, { y: 26, opacity: 0 });
  gsap.set(flower, { y: 190, opacity: 0.2, scale: 0.65 });
  gsap.from('.love-title,.love-sub,.love-text,.love-sign', { y: 14, opacity: 0, stagger: 0.08, duration: 0.8, delay: 0.45 });

  gsap.timeline()
    .to(card, { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out' }, 0)
    .to(flower, { y: 0, opacity: 1, scale: 1, duration: 1.7, ease: 'back.out(1.35)' }, 0.18)
    .to(grass, { y: 0, opacity: 1, duration: 1.2, ease: 'power2.out' }, 0.25);

  // wind sway
  gsap.to(flower, {
    rotation: 2.8,
    transformOrigin: 'bottom center',
    duration: 2.6,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });
  gsap.to(grass, {
    x: 8,
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });

  // butterfly looping flight
  const path = [
    { x: -180, y: 20 },
    { x: -80, y: -30 },
    { x: 20, y: -10 },
    { x: 120, y: -60 },
    { x: 210, y: -20 },
    { x: 70, y: 40 },
    { x: -120, y: 0 },
    { x: -180, y: 20 },
  ];

  gsap.set(butterfly, { left: '50%', bottom: '31vh' });
  const tlFly = gsap.timeline({ repeat: -1, defaults: { duration: 1.4, ease: 'sine.inOut' } });
  path.forEach((p) => tlFly.to(butterfly, { x: p.x, y: p.y }, '+=0.01'));
  gsap.to(butterfly, { scaleX: 0.75, repeat: -1, yoyo: true, duration: 0.24, ease: 'power1.inOut' });
}

// music
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
