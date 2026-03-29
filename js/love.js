function spawnFlower() {
  const el = document.createElement('div');
  el.className = 'flower';
  el.textContent = '✿';
  el.style.left = Math.random() * 100 + 'vw';
  document.body.appendChild(el);
  const dur = 6 + Math.random() * 6;
  gsap.to(el, {
    y: window.innerHeight + 60,
    x: (Math.random() - .5) * 160,
    rotation: Math.random() * 360,
    opacity: .2,
    duration: dur,
    ease: 'none',
    onComplete: () => el.remove(),
  });
}

setInterval(spawnFlower, 500);
for (let i = 0; i < 10; i++) setTimeout(spawnFlower, i * 160);

const btn = document.getElementById('musicBtn');
let player;
let playing = false;

window.onYouTubeIframeAPIReady = function () {
  player = new YT.Player('yt-player', {
    height: '0',
    width: '0',
    videoId: 'tyKu0uZS86Q',
    playerVars: { autoplay: 0, controls: 0, loop: 1, playlist: 'tyKu0uZS86Q' },
  });
};

btn?.addEventListener('click', () => {
  if (!player) return;
  if (!playing) {
    player.playVideo();
    btn.textContent = '⏸ Pause music';
    playing = true;
  } else {
    player.pauseVideo();
    btn.textContent = '🎵 Play music';
    playing = false;
  }
});
