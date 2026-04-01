// ===== SKILL DATA =====
const SKILLS_DATA = [
  { id:1, name:"Kavya Reddy",    handle:"@kavya_r",    teach:"Python & Machine Learning", learn:"Guitar",         category:"tech",     rating:4.9, exchanges:23, bio:"Software engineer with 4 years in Python & ML. Can teach everything from basics to neural networks.", color:"linear-gradient(135deg,#00e5ff,#7c3aed)", initials:"KR", level:"Advanced" },
  { id:2, name:"Vikram Nair",    handle:"@vikram.n",   teach:"Guitar & Music Theory",     learn:"Web Development",category:"music",    rating:4.8, exchanges:17, bio:"Self-taught guitarist for 8 years. Knows classical, blues, and contemporary styles. Teach by doing!", color:"linear-gradient(135deg,#7c3aed,#a78bfa)", initials:"VN", level:"Intermediate" },
  { id:3, name:"Shreya Menon",   handle:"@shreya_m",   teach:"UI/UX Design",              learn:"Python",         category:"creative", rating:5.0, exchanges:31, bio:"Product designer at a startup. Figma expert, design systems, user research — happy to share it all.", color:"linear-gradient(135deg,#f59e0b,#f97316)", initials:"SM", level:"Expert" },
  { id:4, name:"Arjun Patel",    handle:"@arjun.p",    teach:"Spanish (Conversational)",  learn:"Yoga",           category:"language", rating:4.7, exchanges:12, bio:"Lived in Madrid for 2 years. Conversational fluency, grammar basics, and travel Spanish.", color:"linear-gradient(135deg,#10b981,#06b6d4)", initials:"AP", level:"Fluent" },
  { id:5, name:"Meera Iyer",     handle:"@meera_i",    teach:"Hatha Yoga",                learn:"Photography",    category:"fitness",  rating:4.9, exchanges:28, bio:"Certified Hatha yoga teacher with 5 years experience. Online or in-person in Bangalore.", color:"linear-gradient(135deg,#ef4444,#f97316)", initials:"MI", level:"Certified" },
  { id:6, name:"Rohan Sharma",   handle:"@rohan_s",    teach:"Photography & Editing",     learn:"Digital Marketing",category:"creative",rating:4.6, exchanges:9,  bio:"Wedding & travel photographer. Adobe Lightroom, composition, and lighting techniques.", color:"linear-gradient(135deg,#f59e0b,#eab308)", initials:"RS", level:"Professional" },
  { id:7, name:"Deepa Thomas",   handle:"@deepa_t",    teach:"French (A1-B1)",            learn:"Graphic Design", category:"language", rating:4.8, exchanges:15, bio:"French literature graduate. Teach pronunciation, grammar, and conversational French.", color:"linear-gradient(135deg,#06b6d4,#3b82f6)", initials:"DT", level:"B2" },
  { id:8, name:"Kiran Verma",    handle:"@kiran_v",    teach:"Financial Planning",        learn:"Music Production",category:"business", rating:4.7, exchanges:20, bio:"CA by profession. Personal finance, investment basics, tax planning, mutual funds.", color:"linear-gradient(135deg,#8b5cf6,#6d28d9)", initials:"KV", level:"Professional" },
  { id:9, name:"Ananya Das",     handle:"@ananya_d",   teach:"React & JavaScript",        learn:"French",         category:"tech",     rating:4.9, exchanges:26, bio:"Frontend developer 3yr exp. React, hooks, TypeScript, REST APIs. Project-based learning.", color:"linear-gradient(135deg,#00e5ff,#3b82f6)", initials:"AD", level:"Advanced" },
  { id:10,name:"Suresh Kumar",   handle:"@suresh_k",   teach:"Tabla & Indian Classical",  learn:"Web Development",category:"music",    rating:4.8, exchanges:11, bio:"Tabla player for 12 years. Hindustani classical rhythm, beginner to intermediate.", color:"linear-gradient(135deg,#a78bfa,#7c3aed)", initials:"SK", level:"Expert" },
  { id:11,name:"Pooja Nambiar",  handle:"@pooja_n",    teach:"Nutrition & Meal Planning", learn:"Coding",         category:"fitness",  rating:4.6, exchanges:8,  bio:"Sports nutritionist. Build balanced meal plans, understand macros, performance nutrition.", color:"linear-gradient(135deg,#10b981,#84cc16)", initials:"PN", level:"Certified" },
  { id:12,name:"Ravi Krishnan",  handle:"@ravi_k",     teach:"Digital Marketing & SEO",   learn:"Yoga",           category:"business", rating:4.7, exchanges:19, bio:"7 years in digital marketing. SEO, Google Ads, social media strategy, content marketing.", color:"linear-gradient(135deg,#f59e0b,#ef4444)", initials:"RK", level:"Expert" },
];

let filteredSkills = [...SKILLS_DATA];
let activeCategory = 'all';

// ===== RENDER SKILLS =====
function renderSkills(skills) {
  const grid = document.getElementById('skillsGrid');
  if (!skills.length) {
    grid.innerHTML = `
      <div class="no-results">
        <div class="no-results__icon">🔍</div>
        <h3>No skills found</h3>
        <p>Try a different search term or category</p>
      </div>`;
    return;
  }
  grid.innerHTML = skills.map(s => `
    <div class="skill-card" onclick="openSkillModal(${s.id})">
      <div class="skill-card__header">
        <div class="skill-card__avatar" style="background:${s.color}">${s.initials}</div>
        <span class="skill-card__category cat-${s.category}">${getCategoryLabel(s.category)}</span>
      </div>
      <div class="skill-card__name">${s.name}</div>
      <div class="skill-card__handle">${s.handle} · ${s.level}</div>
      <div class="skill-card__skill-row">
        <span class="skill-label">Teaches</span>
        <span class="skill-value">${s.teach}</span>
      </div>
      <div class="skill-card__skill-row">
        <span class="skill-label">Wants</span>
        <span class="skill-value">${s.learn}</span>
      </div>
      <div class="skill-card__footer">
        <span class="skill-card__rating">★ ${s.rating}</span>
        <span class="skill-card__exchanges">${s.exchanges} exchanges</span>
      </div>
    </div>
  `).join('');
}

function getCategoryLabel(cat) {
  const map = { tech:'💻 Tech', creative:'🎨 Creative', music:'🎵 Music', language:'🌍 Language', fitness:'💪 Fitness', business:'📊 Business' };
  return map[cat] || cat;
}

// ===== FILTER BY CATEGORY =====
function filterByCategory(cat, btnEl) {
  activeCategory = cat;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  applyFilters();
}

// ===== SEARCH FILTER =====
function filterSkills() { applyFilters(); }

function applyFilters() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  filteredSkills = SKILLS_DATA.filter(s => {
    const matchCat = activeCategory === 'all' || s.category === activeCategory;
    const matchSearch = !query || s.name.toLowerCase().includes(query) || s.teach.toLowerCase().includes(query) || s.learn.toLowerCase().includes(query);
    return matchCat && matchSearch;
  });
  renderSkills(filteredSkills);
}

// ===== SKILL MODAL =====
function openSkillModal(id) {
  const s = SKILLS_DATA.find(x => x.id === id);
  if (!s) return;
  document.getElementById('skillModalContent').innerHTML = `
    <div class="skill-detail">
      <div class="skill-detail__header">
        <div class="skill-detail__avatar" style="background:${s.color}">${s.initials}</div>
        <div>
          <div class="skill-detail__name">${s.name}</div>
          <div class="skill-detail__handle">${s.handle} · <span class="skill-card__category cat-${s.category}">${getCategoryLabel(s.category)}</span></div>
        </div>
      </div>
      <p class="skill-detail__bio">${s.bio}</p>
      <div class="skill-detail__grid">
        <div class="skill-detail__item">
          <label>Teaches</label>
          <p>${s.teach}</p>
        </div>
        <div class="skill-detail__item">
          <label>Wants to Learn</label>
          <p>${s.learn}</p>
        </div>
        <div class="skill-detail__item">
          <label>Experience Level</label>
          <p>${s.level}</p>
        </div>
        <div class="skill-detail__item">
          <label>Rating</label>
          <p>★ ${s.rating} · ${s.exchanges} exchanges</p>
        </div>
      </div>
      <button class="btn btn--primary btn--full" onclick="requestExchange('${s.name}')">Request Skill Exchange ↗</button>
    </div>
  `;
  openModal('skillModal');
}

function requestExchange(name) {
  closeModal('skillModal');
  showToast(`Exchange request sent to ${name}! 🎉`, 'success');
}

// ===== AUTH HANDLERS =====
function handleLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const errorEl = document.getElementById('loginError');
  errorEl.textContent = '';

  if (!email || !password) {
    errorEl.textContent = 'Please fill in all fields.';
    return;
  }
  if (!isValidEmail(email)) {
    errorEl.textContent = 'Please enter a valid email.';
    return;
  }

  // Simulate API call to backend
  const btn = event.target;
  btn.textContent = 'Logging in...';
  btn.disabled = true;

  setTimeout(() => {
    closeModal('loginModal');
    showToast('Welcome back! You are logged in 👋', 'success');
    btn.textContent = 'Log In →';
    btn.disabled = false;
  }, 1200);
}

function handleRegister() {
  const firstName = document.getElementById('regFirstName').value.trim();
  const lastName = document.getElementById('regLastName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const teach = document.getElementById('regTeach').value.trim();
  const learn = document.getElementById('regLearn').value.trim();
  const errorEl = document.getElementById('registerError');
  const successEl = document.getElementById('registerSuccess');
  errorEl.textContent = '';
  successEl.textContent = '';

  if (!firstName || !lastName || !email || !password || !teach || !learn) {
    errorEl.textContent = 'Please fill in all fields.';
    return;
  }
  if (!isValidEmail(email)) {
    errorEl.textContent = 'Please enter a valid email address.';
    return;
  }
  if (password.length < 6) {
    errorEl.textContent = 'Password must be at least 6 characters.';
    return;
  }

  const btn = event.target;
  btn.textContent = 'Creating account...';
  btn.disabled = true;

  // Simulate API POST /api/auth/register
  fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ firstName, lastName, email, password, teach, learn })
  })
  .then(r => r.json())
  .then(data => {
    successEl.textContent = '🎉 Account created! Redirecting...';
    setTimeout(() => {
      closeModal('registerModal');
      showToast(`Welcome to SkillSphere, ${firstName}! 🌐`, 'success');
    }, 1200);
  })
  .catch(() => {
    // Simulate success if backend not running (for demo)
    successEl.textContent = '🎉 Account created! Welcome aboard!';
    setTimeout(() => {
      closeModal('registerModal');
      showToast(`Welcome to SkillSphere, ${firstName}! 🌐`, 'success');
    }, 1200);
  })
  .finally(() => {
    btn.textContent = 'Create Account →';
    btn.disabled = false;
  });
}

// ===== MODAL UTILS =====
function openModal(id) {
  document.getElementById(id).classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  document.getElementById(id).classList.remove('active');
  document.body.style.overflow = '';
}
function switchModal(from, to) {
  closeModal(from);
  setTimeout(() => openModal(to), 200);
}

// ===== TOAST =====
function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = `toast show ${type}`;
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// ===== MOBILE NAV =====
function toggleMobileNav() {
  const links = document.querySelector('.nav__links');
  const actions = document.querySelector('.nav__actions');
  if (links.style.display === 'flex') {
    links.style.display = 'none';
    actions.style.display = 'none';
  } else {
    links.style.cssText = 'display:flex;flex-direction:column;position:fixed;top:70px;left:0;right:0;background:var(--bg-2);padding:2rem;gap:1.5rem;border-bottom:1px solid var(--border);z-index:99;';
    actions.style.cssText = 'display:flex;position:fixed;top:210px;left:0;right:0;background:var(--bg-2);padding:1rem 2rem 2rem;gap:1rem;z-index:99;border-bottom:1px solid var(--border);';
  }
}

// ===== NAV SCROLL =====
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== COUNTER ANIMATION =====
function animateCounter(el, target) {
  let start = 0;
  const duration = 1800;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { el.textContent = target.toLocaleString() + '+'; clearInterval(timer); }
    else { el.textContent = Math.floor(start).toLocaleString(); }
  }, 16);
}

function initCounters() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        document.querySelectorAll('.stat__num').forEach(el => {
          animateCounter(el, parseInt(el.dataset.target));
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.5 });
  const statsEl = document.querySelector('.hero__stats');
  if (statsEl) observer.observe(statsEl);
}

// ===== SCROLL HELPER =====
function scrollTo(selector) {
  document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' });
}

// ===== CARD ENTRANCE ANIMATION =====
function initCardAnimations() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
        }, i * 80);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.step, .cat-card, .testimonial-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
}

// ===== VALID EMAIL =====
function isValidEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  renderSkills(SKILLS_DATA);
  initCounters();
  setTimeout(initCardAnimations, 300);
});
