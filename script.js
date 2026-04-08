/* ===== CONFETTI ===== */
(function confetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');

  const COLORS = ['#d4af37', '#f2d06b', '#ff4da6', '#c084fc', '#ffffff', '#ff7733'];
  let particles = [];
  let spawnActive = true;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function spawnParticle(yOverride) {
    return {
      x: Math.random() * canvas.width,
      y: yOverride !== undefined ? yOverride : -12,
      vx: (Math.random() - 0.5) * 1.8,
      vy: Math.random() * 2.8 + 1.6,
      w: Math.random() * 9 + 4,
      h: Math.random() * 5 + 3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.12,
      alpha: 1,
      circle: Math.random() < 0.3,
    };
  }

  // Seed particles spread across screen so it doesn't start empty
  for (let i = 0; i < 130; i++) {
    particles.push(spawnParticle(Math.random() * canvas.height));
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (spawnActive && Math.random() < 0.45) {
      particles.push(spawnParticle());
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.rotV;
      if (p.y > canvas.height * 0.88) p.alpha -= 0.022;
      if (p.y > canvas.height + 10 || p.alpha <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      if (p.circle) {
        ctx.beginPath();
        ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      }
      ctx.restore();
    }

    requestAnimationFrame(tick);
  }

  tick();

  // After 10s reduce to a gentle drizzle
  setTimeout(() => {
    spawnActive = false;
    setInterval(() => {
      if (particles.length < 35) particles.push(spawnParticle());
    }, 350);
  }, 10000);

  // Expose burst for card reveals
  window.triggerConfettiBurst = function (x, y, count) {
    for (let k = 0; k < (count || 40); k++) {
      const p = spawnParticle();
      p.x = x + (Math.random() - 0.5) * 80;
      p.y = y + (Math.random() - 0.5) * 40;
      p.vy = -(Math.random() * 4 + 2); // burst upward
      p.vx = (Math.random() - 0.5) * 5;
      p.alpha = 1;
      particles.push(p);
    }
  };
})();

/* ===== MYSTERY REVEAL STATE ===== */
let revealedCount = 0;

/* ===== SQUAD DATA ===== */
const SQUAD = [
  {
    name: 'Dwayne "The Rock" Johnson',
    tag: 'WWE Legend & Hollywood Star',
    emoji: '🪨',
    file: 'assets/dwaynebday.mp4',
    gradient: 'linear-gradient(135deg, #1e0f3c, #3d1260)',
  },
  {
    name: 'Donald Trump',
    tag: '45th & 47th President of the USA',
    emoji: '🇺🇸',
    file: 'assets/trumpbday.mp4',
    gradient: 'linear-gradient(135deg, #1a2e4a, #0f1e34)',
  },
  {
    name: 'The Minions',
    tag: 'Professional Birthday Crashers',
    emoji: '💛',
    file: 'assets/minionbday.mp4',
    gradient: 'linear-gradient(135deg, #2a2200, #3d3000)',
  },
  {
    name: 'Africa',
    tag: 'From Africa with Love <3',
    emoji: '🌍',
    file: 'assets/africabday.mp4',
    gradient: 'linear-gradient(135deg, #0f2210, #1a3820)',
  },
  {
    name: 'Jack Black & Jason Momoa',
    tag: 'Hollywood Dream Team',
    emoji: '🎸',
    file: 'assets/jbjmbday.mp4',
    gradient: 'linear-gradient(135deg, #2e1010, #4a1a1a)',
  },
  {
    name: 'Johnny Sins',
    tag: 'Man of Many Professions',
    emoji: '🎓',
    file: 'assets/sinsbday.mp4',
    gradient: 'linear-gradient(135deg, #0f1a30, #1a1040)',
  },
];

/* ===== VIDEO THUMBNAIL GENERATION ===== */
function generateThumbnail(src, onSuccess) {
  const v = document.createElement('video');
  v.muted = true;
  v.playsInline = true;
  v.preload = 'metadata';
  v.crossOrigin = 'anonymous';

  const cleanup = () => { v.src = ''; };

  v.addEventListener('loadeddata', () => { v.currentTime = 1.5; }, { once: true });

  v.addEventListener('seeked', () => {
    try {
      const c = document.createElement('canvas');
      c.width = v.videoWidth || 640;
      c.height = v.videoHeight || 360;
      c.getContext('2d').drawImage(v, 0, 0, c.width, c.height);
      onSuccess(c.toDataURL('image/jpeg', 0.8));
    } catch (_) {
      // Canvas taint or other error — silently fall back to gradient
    }
    cleanup();
  }, { once: true });

  v.addEventListener('error', cleanup, { once: true });
  v.src = src;
}

/* ===== BUILD SQUAD CARDS ===== */
function buildCards() {
  const grid = document.getElementById('squad-grid');

  SQUAD.forEach((member, i) => {
    const card = document.createElement('div');
    // Start all cards as mystery — click listeners added after reveal
    card.className = 'squad-card reveal-up mystery';
    card.style.transitionDelay = `${i * 0.09}s`;
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '-1'); // not focusable until revealed
    card.setAttribute('aria-label', `Mystery Guest ${i + 1} — not yet revealed`);

    card.innerHTML = `
      <div class="card-thumb">
        <div class="card-thumb-bg" style="background: ${member.gradient}">${member.emoji}</div>
        <div class="card-play-hover" aria-hidden="true">
          <div class="card-play-circle">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </div>
      </div>
      <div class="card-body">
        <div class="card-name">${member.name}</div>
        <div class="card-tag">${member.tag}</div>
      </div>
    `;

    // Mystery cover overlay (sits above card content via z-index)
    const cover = document.createElement('div');
    cover.className = 'mystery-cover';
    cover.innerHTML = `
      <div class="mystery-icon">?</div>
      <p class="mystery-label">Mystery Guest #${i + 1}</p>
    `;
    card.appendChild(cover);

    grid.appendChild(card);

    // Generate thumbnail in background — will be visible after reveal
    generateThumbnail(member.file, (dataUrl) => {
      const thumb = card.querySelector('.card-thumb');
      const img = document.createElement('img');
      img.src = dataUrl;
      img.alt = '';
      img.setAttribute('aria-hidden', 'true');
      thumb.insertBefore(img, thumb.querySelector('.card-play-hover'));
    });
  });
}

/* ===== MYSTERY REVEAL ===== */
function updateRevealUI() {
  const btn = document.getElementById('reveal-btn');
  const counter = document.getElementById('reveal-counter');
  if (revealedCount >= SQUAD.length) {
    btn.textContent = 'All Guests Revealed! 🎉';
    btn.disabled = true;
    counter.textContent = 'The whole squad showed up!';
  } else {
    btn.textContent = 'Reveal Next Guest 🎁';
    counter.textContent = `${revealedCount} of ${SQUAD.length} revealed`;
  }
}

function revealNextCard() {
  if (revealedCount >= SQUAD.length) return;

  const btn = document.getElementById('reveal-btn');
  btn.disabled = true; // guard against double-click during animation

  const cards = document.querySelectorAll('.squad-card');
  const card = cards[revealedCount];
  const member = SQUAD[revealedCount];

  // Capture position before any DOM changes
  const rect = card.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  // Make card interactive
  card.classList.remove('mystery');
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-label', `Watch ${member.name}'s birthday greeting`);

  const open = () => openModal(member);
  card.addEventListener('click', open);
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      open();
    }
  });

  revealedCount++;

  // Animate mystery cover away
  const cover = card.querySelector('.mystery-cover');
  cover.classList.add('is-revealing');

  setTimeout(() => {
    cover.remove();
    window.triggerConfettiBurst(cx, cy, 50);
    updateRevealUI();
    // Re-enable button if more cards remain
    if (revealedCount < SQUAD.length) {
      btn.disabled = false;
    }
  }, 650);
}

/* ===== MODAL ===== */
const modal = document.getElementById('modal');
const modalVideo = document.getElementById('modal-video');
const modalLabel = document.getElementById('modal-label');
const modalClose = document.getElementById('modal-close');
const modalBd = document.getElementById('modal-bd');

function openModal(member) {
  modalLabel.textContent = member.name;
  modalVideo.src = member.file;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  modalVideo.play().catch(() => {});
  modalClose.focus();
}

function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  modalVideo.pause();
  modalVideo.src = '';
}

modalClose.addEventListener('click', closeModal);
modalBd.addEventListener('click', closeModal);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

/* ===== INTRO VIDEO ===== */
const introVideo = document.getElementById('intro-video');
const introPlayBtn = document.getElementById('intro-play-btn');
const introPauseBtn = document.getElementById('intro-pause-btn');
const featuredEl = document.getElementById('featured-video');

introPlayBtn.addEventListener('click', () => {
  featuredEl.classList.add('playing');
  introVideo.play().catch(() => {});
});

introPauseBtn.addEventListener('click', () => {
  introVideo.pause();
});

// Click anywhere on the video wrapper to toggle play/pause
featuredEl.addEventListener('click', (e) => {
  if (e.target.closest('button')) return; // let buttons handle themselves
  if (introVideo.paused) {
    featuredEl.classList.add('playing');
    introVideo.play().catch(() => {});
  } else {
    introVideo.pause();
  }
});

introVideo.addEventListener('ended', () => featuredEl.classList.remove('playing'));
introVideo.addEventListener('pause', () => {
  if (!introVideo.ended) featuredEl.classList.remove('playing');
});
introVideo.addEventListener('play', () => featuredEl.classList.add('playing'));

/* ===== SCROLL REVEAL ===== */
function setupReveal() {
  const obs = new IntersectionObserver(
    (entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    }),
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  // Exclude hero elements (animated on load, not scroll)
  document.querySelectorAll('.reveal-up:not(.hero .reveal-up)').forEach((el) => obs.observe(el));
}

/* ===== HERO ENTRANCE ===== */
function heroEntrance() {
  document.querySelectorAll('.hero .reveal-up').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 200 + i * 160);
  });
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
  heroEntrance();
  buildCards();
  setupReveal();
  document.getElementById('reveal-btn').addEventListener('click', revealNextCard);
  updateRevealUI();
});
