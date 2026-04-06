// ===== SHARED COMPONENTS =====
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
    <div class="nav__actions" id="navActions"></div>
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
            <a href="how-it-works.html">About</a>
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
    const navEl = document.getElementById('nav-placeholder');
    if (navEl) navEl.innerHTML = this.navHTML;
    const footerEl = document.getElementById('footer-placeholder');
    if (footerEl) footerEl.innerHTML = this.footerHTML;
    window.addEventListener('scroll', () => {
      const nav = document.getElementById('navbar');
      if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
    });
    document.addEventListener('click', (e) => {
      if (e.target.id === 'hamburgerBtn' || e.target.closest('#hamburgerBtn')) {
        this.toggleMobileNav();
      }
    });
    this.updateNavAuth();
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
  getToken() { return localStorage.getItem('ss_token'); },
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
// Auto-detects: uses real backend on localhost, demo mode on GitHub Pages
const API = {
  isLocal() {
    return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  },

  async request(method, path, body = null) {
    if (this.isLocal()) {
      try {
        const headers = { 'Content-Type': 'application/json' };
        const token = Auth.getToken();
        if (token) headers['Authorization'] = 'Bearer ' + token;
        const opts = { method, headers };
        if (body) opts.body = JSON.stringify(body);
        const res = await fetch('/api' + path, opts);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Request failed');
        return data;
      } catch(err) {
        if (err.message && err.message !== 'Failed to fetch') throw err;
        return this.demo(method, path, body);
      }
    }
    return this.demo(method, path, body);
  },

  // Full demo mode — entire app works without any backend
  demo(method, path, body) {
    if (method === 'POST' && path === '/auth/register') {
      if (!body.firstName || !body.email || !body.password) {
        return Promise.reject(new Error('Please fill in all fields.'));
      }
      const user = {
        id: 'u_' + Date.now(),
        firstName: body.firstName, lastName: body.lastName,
        email: body.email, teach: body.teach, learn: body.learn,
        category: body.category || 'other', bio: body.bio || '',
        rating: 0, exchanges: 0
      };
      return Promise.resolve({ success: true, token: 'demo_' + Date.now(), user });
    }
    if (method === 'POST' && path === '/auth/login') {
      if (!body.email || !body.password) {
        return Promise.reject(new Error('Please provide email and password.'));
      }
      const existing = Auth.getUser();
      const user = (existing && existing.email === body.email)
        ? existing
        : { id: 'u_demo', firstName: 'Demo', lastName: 'User', email: body.email, teach: 'JavaScript', learn: 'Design', rating: 4.8, exchanges: 12, category: 'tech' };
      return Promise.resolve({ success: true, token: 'demo_' + Date.now(), user });
    }
    if (method === 'PUT' && path === '/auth/me') {
      const user = Object.assign({}, Auth.getUser(), body);
      return Promise.resolve({ success: true, user });
    }
    if (method === 'POST' && path === '/skills') {
      return Promise.resolve({ success: true, message: 'Skill listed successfully!', skill: body });
    }
    return Promise.resolve({ success: true, message: 'OK (demo mode)' });
  },

  get(path)        { return this.request('GET', path); },
  post(path, body) { return this.request('POST', path, body); },
  put(path, body)  { return this.request('PUT', path, body); },
  delete(path)     { return this.request('DELETE', path); },
};

// ===== TOAST =====
function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.className = 'toast show ' + type;
  setTimeout(() => t.classList.remove('show'), 3500);
}

// ===== UTILS =====
function isValidEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
function formatDate(d)    { return new Date(d).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }); }
function getCategoryLabel(cat) {
  return { tech:'💻 Tech', creative:'🎨 Creative', music:'🎵 Music', language:'🌍 Language', fitness:'💪 Fitness', business:'📊 Business', other:'🔖 Other' }[cat] || cat;
}
