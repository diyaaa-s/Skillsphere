// ===== SHARED COMPONENTS =====
// Injected into every page via: Components.init()

const Components = {

  navHTML: `
  <nav class="nav" id="navbar">
    <a href="index.html" class="nav__logo">
      <span class="logo-icon">◎</span>
      <span>SkillSphere</span>
    </a>
    <ul class="nav__links">
      <li><a href="explore.html">Explore</a></li>
      <li><a href="how-it-works.html">How It Works</a></li>
      <li><a href="dashboard.html">Dashboard</a></li>
      <li><a href="contact.html">Contact</a></li>
    </ul>
    <div class="nav__actions" id="navActions">
      <!-- Injected by auth state -->
    </div>
    <button class="hamburger" id="hamburgerBtn">☰</button>
  </nav>`,

  footerHTML: `
  <footer class="footer">
    <div class="container">
      <div class="footer__top">
        <div class="footer__brand">
          <a href="index.html" class="nav__logo" style="margin-bottom:1rem;display:flex;align-items:center;gap:.5rem">
            <span class="logo-icon">◎</span><span>SkillSphere</span>
          </a>
          <p>A community-driven skill exchange platform. Teach what you know. Learn what you need.</p>
        </div>
        <div class="footer__links">
          <div>
            <h5>Platform</h5>
            <a href="explore.html">Browse Skills</a>
            <a href="how-it-works.html">How It Works</a>
            <a href="list-skill.html">List a Skill</a>
          </div>
          <div>
            <h5>Account</h5>
            <a href="dashboard.html">Dashboard</a>
            <a href="profile.html">My Profile</a>
            <a href="login.html">Login</a>
          </div>
          <div>
            <h5>Company</h5>
            <a href="contact.html">Contact</a>
            <a href="about.html">About</a>
          </div>
        </div>
      </div>
      <div class="footer__bottom">
        <p>© 2024 SkillSphere. Built with ❤️ as a DevOps Project.</p>
        <p>Powered by Node.js · MongoDB · Docker</p>
      </div>
    </div>
  </footer>
  <div class="toast" id="toast"></div>`,

  init() {
    // Inject nav
    const navEl = document.getElementById('nav-placeholder');
    if (navEl) navEl.innerHTML = this.navHTML;

    // Inject footer
    const footerEl = document.getElementById('footer-placeholder');
    if (footerEl) footerEl.innerHTML = this.footerHTML;

    // Nav scroll effect
    window.addEventListener('scroll', () => {
      const nav = document.getElementById('navbar');
      if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Hamburger
    document.addEventListener('click', (e) => {
      if (e.target.id === 'hamburgerBtn' || e.target.closest('#hamburgerBtn')) {
        this.toggleMobileNav();
      }
    });

    // Auth state
    this.updateNavAuth();

    // Active link highlight
    this.highlightActiveLink();
  },

  toggleMobileNav() {
    const links = document.querySelector('.nav__links');
    const actions = document.querySelector('.nav__actions');
    if (!links) return;
    const open = links.classList.contains('mobile-open');
    links.classList.toggle('mobile-open', !open);
    if (actions) actions.classList.toggle('mobile-open', !open);
  },

  updateNavAuth() {
    const actionsEl = document.getElementById('navActions');
    if (!actionsEl) return;
    const user = Auth.getUser();
    if (user) {
      actionsEl.innerHTML = `
        <span style="color:var(--text-muted);font-size:.88rem">Hi, ${user.firstName}!</span>
        <a href="dashboard.html" class="btn btn--ghost">Dashboard</a>
        <button class="btn btn--primary" onclick="Auth.logout()">Log Out</button>`;
    } else {
      actionsEl.innerHTML = `
        <a href="login.html" class="btn btn--ghost">Log In</a>
        <a href="register.html" class="btn btn--primary">Join Free</a>`;
    }
  },

  highlightActiveLink() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav__links a').forEach(a => {
      if (a.getAttribute('href') === page) a.classList.add('active-link');
    });
  }
};

// ===== AUTH HELPERS =====
const Auth = {
  getUser() {
    try { return JSON.parse(localStorage.getItem('ss_user')); } catch { return null; }
  },
  getToken() {
    return localStorage.getItem('ss_token');
  },
  save(token, user) {
    localStorage.setItem('ss_token', token);
    localStorage.setItem('ss_user', JSON.stringify(user));
  },
  logout() {
    localStorage.removeItem('ss_token');
    localStorage.removeItem('ss_user');
    window.location.href = 'index.html';
  },
  requireAuth() {
    if (!this.getToken()) {
      window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.pathname);
      return false;
    }
    return true;
  }
};

// ===== API HELPER =====
const API = {
  base: '/api',
  async request(method, path, body = null) {
    const headers = { 'Content-Type': 'application/json' };
    const token = Auth.getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const opts = { method, headers };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(this.base + path, opts);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Request failed');
    return data;
  },
  get(path)         { return this.request('GET', path); },
  post(path, body)  { return this.request('POST', path, body); },
  put(path, body)   { return this.request('PUT', path, body); },
  delete(path)      { return this.request('DELETE', path); },
};

// ===== TOAST =====
function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.className = `toast show ${type}`;
  setTimeout(() => t.classList.remove('show'), 3500);
}

// ===== UTILS =====
function isValidEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
function formatDate(d)    { return new Date(d).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }); }
function getCategoryLabel(cat) {
  return { tech:'💻 Tech', creative:'🎨 Creative', music:'🎵 Music', language:'🌍 Language', fitness:'💪 Fitness', business:'📊 Business', other:'🔖 Other' }[cat] || cat;
}
