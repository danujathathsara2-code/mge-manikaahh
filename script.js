'use strict';
const relationshipStart = new Date('2022-11-20T00:00:00+05:30');
const fourthAnniversary = new Date('2026-11-20T00:00:00+05:30');
const dayMs = 86400000;
function updateClock(now = new Date()) {
  const anniversaryReached = now >= fourthAnniversary;
  const elapsed = Math.max(0, now - relationshipStart);
  const difference = anniversaryReached ? elapsed : Math.max(0, fourthAnniversary - now);
  const totalSeconds = Math.floor(difference / 1000);
  const values = { days: Math.floor(totalSeconds / 86400), hours: Math.floor(totalSeconds / 3600) % 24, minutes: Math.floor(totalSeconds / 60) % 60, seconds: totalSeconds % 60 };
  Object.entries(values).forEach(([id, value]) => { document.getElementById(id).textContent = String(value).padStart(2, '0'); });
  document.getElementById('together-days').textContent = Math.floor(elapsed / dayMs).toLocaleString('en-US');
  document.getElementById('countdown-label').textContent = anniversaryReached ? 'FOUR YEARS, AND STILL COUNTING ♡' : 'COUNTING DOWN TO OUR FOURTH ♡';
  document.getElementById('countdown-note').textContent = anniversaryReached ? 'Every second with you is part of my favourite story.' : '20 November · midnight, Sri Lanka';
  document.querySelector('[role="timer"]').setAttribute('aria-label', anniversaryReached ? 'Our time together since November 20, 2022' : 'Time until our fourth anniversary');
}
updateClock(); setInterval(updateClock, 1000);
const memories = [
  [5, 'Anywhere, with you.'], [12, 'A little closer.'], [6, 'My favourite company.'],
  [8, 'You, me & little things.'], [10, 'Our kind of view.'], [15, 'My happy place.'],
  [1, 'That smile. Always.'], [2, 'One more of us.'], [3, 'Just being together.'],
  [4, 'A day made better.'], [7, 'Nights to remember.'], [9, 'Side by side.'],
  [11, 'A world for two.'], [13, 'A little sunshine.'], [14, 'The everyday magic.'],
  [16, 'Right where I belong.'], [17, 'Even the quiet moments.'], [18, 'Still my favourite.'], [19, 'More days like this.']
];
const photoDialog = document.getElementById('photo-dialog');
let activePhoto = 0;
function showPhoto(index) {
  activePhoto = (index + memories.length) % memories.length;
  const [number, caption] = memories[activePhoto];
  const image = document.getElementById('lightbox-image');
  image.src = `photos/img${number}.jpeg`; image.alt = `${caption} A photograph of us together.`;
  document.getElementById('lightbox-caption').textContent = `${caption} (${activePhoto + 1} / ${memories.length})`;
}
function createMemory([number, caption], index) {
  const button = document.createElement('button'); button.className = 'memory-card';
  button.setAttribute('aria-label', `Open photo ${index + 1}: ${caption}`);
  const img = document.createElement('img'); img.src = `photos/img${number}.jpeg`;
  img.alt = `A memory of us together: ${caption}`; img.loading = 'lazy'; img.width = 480; img.height = 540;
  const description = document.createElement('span'); description.className = 'memory-caption';
  const title = document.createElement('span'); title.textContent = caption;
  const count = document.createElement('small'); count.textContent = String(index + 1).padStart(2, '0');
  description.append(title, count); button.append(img, description);
  button.addEventListener('click', () => { showPhoto(index); photoDialog.showModal(); });
  return button;
}
memories.slice(0, 6).forEach((memory, index) => document.getElementById('memory-grid').append(createMemory(memory, index)));
let extraMemoriesCreated = false;
document.getElementById('more-memories').addEventListener('click', event => {
  const button = event.currentTarget; const extra = document.getElementById('extra-memories');
  if (!extraMemoriesCreated) { memories.slice(6).forEach((memory, index) => extra.append(createMemory(memory, index + 6))); extraMemoriesCreated = true; }
  extra.hidden = !extra.hidden; button.setAttribute('aria-expanded', String(!extra.hidden));
  button.innerHTML = extra.hidden ? 'There’s more of us <span>↓</span>' : 'Fold the album back <span>↑</span>';
});
document.getElementById('previous-photo').addEventListener('click', () => showPhoto(activePhoto - 1));
document.getElementById('next-photo').addEventListener('click', () => showPhoto(activePhoto + 1));
photoDialog.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') { event.preventDefault(); showPhoto(activePhoto - 1); }
  if (event.key === 'ArrowRight') { event.preventDefault(); showPhoto(activePhoto + 1); }
});
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });
});
const letterDialog = document.getElementById('letter-dialog');
document.getElementById('open-letter').addEventListener('click', () => letterDialog.showModal());
document.getElementById('send-love').addEventListener('click', event => {
  document.getElementById('love-reply').textContent = 'Every lifetime. Every version of us. I’d choose you. ♡';
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const bounds = event.currentTarget.getBoundingClientRect();
  for (let i = 0; i < 20; i++) {
    const heart = document.createElement('span'); heart.className = 'love-particle'; heart.textContent = '♡'; heart.setAttribute('aria-hidden', 'true');
    heart.style.left = `${bounds.left + bounds.width / 2}px`; heart.style.top = `${bounds.top}px`;
    heart.style.setProperty('--x', `${(Math.random() - .5) * 380}px`); heart.style.setProperty('--y', `${-90 - Math.random() * 300}px`); heart.style.setProperty('--r', `${(Math.random() - .5) * 80}deg`);
    letterDialog.append(heart); setTimeout(() => heart.remove(), 1600);
  }
});
const music = document.getElementById('bg-music'); const musicButton = document.getElementById('music-toggle');
const video = document.getElementById('memory-video'); const videoDialog = document.getElementById('video-dialog');
music.volume = .24;
function syncMusicButton() {
  const playing = !music.paused;
  musicButton.setAttribute('aria-pressed', String(playing)); musicButton.setAttribute('aria-label', playing ? 'Pause our background song' : 'Play our background song');
  document.getElementById('music-label').textContent = playing ? 'Our song is playing' : 'Our little soundtrack';
  document.getElementById('music-symbol').textContent = playing ? 'Ⅱ' : '▷';
}
music.addEventListener('play', syncMusicButton); music.addEventListener('pause', syncMusicButton);
musicButton.addEventListener('click', async () => {
  if (!music.paused) { music.pause(); return; }
  try { await music.play(); document.getElementById('media-status').textContent = ''; }
  catch { document.getElementById('media-status').textContent = 'The song could not start. Please try again.'; document.getElementById('music-label').textContent = 'Tap to try our song again'; }
});
let resumeMusic = false;
function openVideo() {
  resumeMusic = !music.paused; music.pause(); videoDialog.showModal();
  video.play().catch(() => { document.getElementById('media-status').textContent = 'Press play on the video to start our memory.'; });
}
document.getElementById('play-film').addEventListener('click', openVideo);
document.getElementById('watch-film').addEventListener('click', openVideo);
videoDialog.addEventListener('close', () => { video.pause(); if (resumeMusic) music.play().catch(() => {}); resumeMusic = false; });
