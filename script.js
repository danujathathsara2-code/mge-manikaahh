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
  ['6334628393244104743_121.jpg', 'A frame I’d keep forever.'],
  ['6334628393244104741_121.jpg', 'Dressed up. Loved, always.'],
  ['6334628393244104742_121.jpg', 'A kiss, and my whole world.'],
  ['6334628393244104746_121.jpg', 'My favourite kind of sunshine.'],
  ['6334628393244104744_121.jpg', 'Every road, with you.'],
  ['6334628393244104745_121.jpg', 'A little world of our own.'],
  ['6334628393244104747_121.jpg', 'Never too serious with you.'],
  ['6334628393244104748_121.jpg', 'You make the ordinary magic.'],
  ['6334628393244104749_121.jpg', 'That look. That smile. You.'],
  ['6334628393244104750_121.jpg', 'Collecting our little moments.'],
  ['6334628393244104751_121.jpg', 'Happiness looks a lot like us.'],
  ['6334628393244104752_121.jpg', 'My person, in every picture.'],
  ['6334628393244104753_121.jpg', 'More of these days, please.'],
  [5, 'Anywhere, with you.'], [12, 'A little closer.'], [6, 'My favourite company.'],
  [8, 'You, me & little things.'], [10, 'Our kind of view.'], [15, 'My happy place.'],
  [1, 'That smile. Always.'], [2, 'One more of us.'], [3, 'Just being together.'],
  [4, 'A day made better.'], [7, 'Nights to remember.'], [9, 'Side by side.'],
  [11, 'A world for two.'], [13, 'A little sunshine.'], [14, 'The everyday magic.'],
  [16, 'Right where I belong.'], [17, 'Even the quiet moments.'], [18, 'Still my favourite.'], [19, 'More days like this.']
].map(([file, caption]) => ({ file: typeof file === 'number' ? `img${file}.jpeg` : file, caption }));
const photoDialog = document.getElementById('photo-dialog');
let activePhoto = 0;
function showPhoto(index) {
  activePhoto = (index + memories.length) % memories.length;
  const { file, caption } = memories[activePhoto];
  const image = document.getElementById('lightbox-image');
  image.src = `photos/${file}`; image.alt = `${caption} A photograph of us together.`;
  document.getElementById('lightbox-caption').textContent = `${caption} (${activePhoto + 1} / ${memories.length})`;
}
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const slideshow = document.getElementById('slideshow');
const slideImage = document.getElementById('slide-image');
const slideBackdrop = document.getElementById('slide-backdrop');
const thumbnailStrip = document.getElementById('slide-thumbnails');
const playSlides = document.getElementById('slide-play');
const slideProgress = document.getElementById('slide-progress');
let slideIndex = 0, requestedSlide = 0, slideRequest = 0, slideTimer;
let autoPlay = !reducedMotion.matches, inView = false, hovering = false;
const slideDuration = 5500;

function scheduleSlide() {
  clearTimeout(slideTimer);
  slideProgress.classList.remove('is-running');
  if (!autoPlay || !inView || hovering || document.hidden || document.querySelector('dialog[open]')) return;
  // Restart the visual timer with the same duration as the next transition.
  void slideProgress.offsetWidth;
  slideProgress.classList.add('is-running');
  slideTimer = setTimeout(() => selectSlide(slideIndex + 1), slideDuration);
}
function syncPlayback() {
  playSlides.textContent = autoPlay ? 'Ⅱ' : '▷';
  playSlides.setAttribute('aria-label', autoPlay ? 'Pause slideshow' : 'Play slideshow');
  playSlides.setAttribute('aria-pressed', String(autoPlay));
  scheduleSlide();
}
function pauseSlides() { autoPlay = false; syncPlayback(); }
async function selectSlide(index, manual = false) {
  if (manual) pauseSlides();
  requestedSlide = (index + memories.length) % memories.length;
  const selected = requestedSlide, request = ++slideRequest;
  const memory = memories[selected];
  clearTimeout(slideTimer); slideProgress.classList.remove('is-running');
  const nextImage = new Image(); nextImage.src = `photos/${memory.file}`;
  try { await nextImage.decode(); }
  catch {
    if (request === slideRequest) {
      pauseSlides();
      document.getElementById('slide-status').textContent = 'This photo could not load. Choose another memory or try again.';
    }
    return;
  }
  if (request !== slideRequest) return;
  slideIndex = selected;
  slideImage.src = nextImage.src; slideImage.alt = `${memory.caption} A photograph of us together.`;
  slideBackdrop.src = nextImage.src;
  slideImage.classList.remove('slide-arriving'); void slideImage.offsetWidth; slideImage.classList.add('slide-arriving');
  document.getElementById('slide-caption').textContent = memory.caption;
  document.getElementById('slide-count').textContent = `${String(selected + 1).padStart(2, '0')} / ${memories.length}`;
  document.getElementById('slide-chapter').textContent = selected < 13 ? 'OUR NEWEST LITTLE MEMORIES' : 'FROM OUR SCRAPBOOK';
  const thumbnails = [...thumbnailStrip.children];
  thumbnails.forEach((button, i) => button.setAttribute('aria-pressed', String(i === selected)));
  const thumbnail = thumbnails[selected];
  thumbnailStrip.scrollTo({left: thumbnail.offsetLeft - (thumbnailStrip.clientWidth - thumbnail.clientWidth) / 2, behavior: reducedMotion.matches ? 'instant' : 'smooth'});
  if (manual) document.getElementById('slide-status').textContent = `Photo ${selected + 1} of ${memories.length}. ${memory.caption}`;
  scheduleSlide();
}
memories.forEach(({file, caption}, index) => {
  const button = document.createElement('button'); button.className = 'slide-thumb';
  button.setAttribute('aria-label', `Show memory ${index + 1}: ${caption}`);
  button.setAttribute('aria-pressed', String(index === 0));
  const img = document.createElement('img'); img.src = `photos/${file}`; img.alt = ''; img.loading = 'lazy'; img.width = 90; img.height = 75;
  button.append(img); button.addEventListener('click', () => selectSlide(index, true)); thumbnailStrip.append(button);
});
document.getElementById('slide-prev').addEventListener('click', () => selectSlide(requestedSlide - 1, true));
document.getElementById('slide-next').addEventListener('click', () => selectSlide(requestedSlide + 1, true));
playSlides.addEventListener('click', () => { autoPlay = !autoPlay; syncPlayback(); });
slideshow.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault(); selectSlide(requestedSlide + (event.key === 'ArrowRight' ? 1 : -1), true);
  }
});
slideshow.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') { hovering = true; scheduleSlide(); } });
slideshow.addEventListener('pointerleave', () => { hovering = false; scheduleSlide(); });
slideshow.addEventListener('focusin', event => { if (event.target !== playSlides) pauseSlides(); });
new IntersectionObserver(entries => { inView = entries[0].isIntersecting; scheduleSlide(); }, {threshold: .2}).observe(slideshow);
document.addEventListener('visibilitychange', scheduleSlide);
reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) pauseSlides(); });
syncPlayback();
let touchStart = null, suppressPhotoClick = false;
const slideStage = document.getElementById('slide-stage');
slideStage.addEventListener('pointerdown', event => { if (event.pointerType !== 'mouse') touchStart = {x: event.clientX, y: event.clientY}; });
slideStage.addEventListener('pointercancel', () => { touchStart = null; });
slideStage.addEventListener('pointerup', event => {
  if (!touchStart) return;
  const x = event.clientX - touchStart.x, y = event.clientY - touchStart.y;
  touchStart = null;
  if (Math.abs(x) > 45 && Math.abs(x) > Math.abs(y)) {
    suppressPhotoClick = true; selectSlide(requestedSlide + (x < 0 ? 1 : -1), true);
    setTimeout(() => { suppressPhotoClick = false; }, 400);
  }
});
document.getElementById('open-slide').addEventListener('click', () => {
  if (suppressPhotoClick) return;
  pauseSlides(); showPhoto(slideIndex); photoDialog.showModal();
});
document.getElementById('open-portrait').addEventListener('click', () => { pauseSlides(); showPhoto(0); photoDialog.showModal(); });
document.getElementById('previous-photo').addEventListener('click', () => showPhoto(activePhoto - 1));
document.getElementById('next-photo').addEventListener('click', () => showPhoto(activePhoto + 1));
photoDialog.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') { event.preventDefault(); showPhoto(activePhoto - 1); }
  if (event.key === 'ArrowRight') { event.preventDefault(); showPhoto(activePhoto + 1); }
});
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.addEventListener('close', scheduleSlide);
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });
});
const letterDialog = document.getElementById('letter-dialog');
document.getElementById('open-letter').addEventListener('click', () => { pauseSlides(); letterDialog.showModal(); });
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

// A brief, silent welcome: the page stays usable, and all animation stops after 5 seconds.
const celebration = document.getElementById('celebration');
const celebrationCanvas = document.getElementById('celebration-canvas');
let celebrationFrame = 0, celebrationTimeout = 0;
function stopCelebration() {
  cancelAnimationFrame(celebrationFrame); clearTimeout(celebrationTimeout);
  celebration.hidden = true; celebration.classList.remove('is-celebrating');
}
function celebrate() {
  stopCelebration(); celebration.hidden = false;
  void celebration.offsetWidth; celebration.classList.add('is-celebrating');
  celebrationTimeout = setTimeout(stopCelebration, 5200);
  if (reducedMotion.matches) return;
  const context = celebrationCanvas.getContext('2d');
  if (!context) return;
  const width = innerWidth, height = innerHeight, ratio = Math.min(devicePixelRatio || 1, 2);
  celebrationCanvas.width = width * ratio; celebrationCanvas.height = height * ratio;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  const colours = ['#b75a75', '#d4a85a', '#7d283d', '#e5b9ad'];
  const burstPlan = [[120,.17,.3],[650,.82,.37],[1400,.32,.52],[2200,.73,.24],[3000,.5,.4]];
  const particles = []; let burstIndex = 0;
  const start = performance.now();
  function draw(now) {
    const elapsed = now - start;
    if (document.hidden || reducedMotion.matches || elapsed > 5100) { stopCelebration(); return; }
    context.clearRect(0, 0, width, height);
    while (burstIndex < burstPlan.length && elapsed >= burstPlan[burstIndex][0]) {
      const [birth, x, y] = burstPlan[burstIndex++];
      for (let i=0; i<42; i++) {
        const angle = Math.PI * 2 * i / 42;
        particles.push({birth, x:x*width, y:y*height, vx:Math.cos(angle)*(60+Math.random()*110), vy:Math.sin(angle)*(60+Math.random()*110), colour:colours[i%colours.length], size:1.5+Math.random()*2});
      }
    }
    for (const particle of particles) {
      const age = (elapsed-particle.birth)/1000;
      if (age < 0 || age > 1.7) continue;
      context.globalAlpha = Math.max(0, 1-age/1.7);
      context.fillStyle = particle.colour;
      context.beginPath();context.arc(particle.x+particle.vx*age, particle.y+particle.vy*age+40*age*age, particle.size,0,Math.PI*2);context.fill();
    }
    context.globalAlpha = 1;
    celebrationFrame = requestAnimationFrame(draw);
  }
  celebrationFrame = requestAnimationFrame(draw);
}
document.getElementById('celebrate-again').addEventListener('click', celebrate);
document.addEventListener('visibilitychange', () => { if (document.hidden) stopCelebration(); });
window.addEventListener('pagehide', stopCelebration);
celebrate();
