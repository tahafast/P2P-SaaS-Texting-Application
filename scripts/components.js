/* ============================================================
   COMPONENTS.JS — Sidebar, Topbar, Modals, Toasts, Drawers
   ============================================================ */

// ── Toast System ──────────────────────────────────────────
const Toast = {
  show(type, title, desc = '', duration = 4000) {
    const container = document.getElementById('toast-container');
    const icons = {
      success: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`,
      error:   `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
      info:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="8"/><line x1="12" y1="12" x2="12" y2="16"/></svg>`,
      warning: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    };
    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.innerHTML = `
      <div class="toast-icon">${icons[type]}</div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        ${desc ? `<div class="toast-desc">${desc}</div>` : ''}
      </div>
      <button class="toast-close" onclick="Toast.remove(this.parentElement)">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>`;
    container.appendChild(el);
    if (duration > 0) setTimeout(() => Toast.remove(el), duration);
    return el;
  },
  remove(el) {
    if (!el || el.classList.contains('removing')) return;
    el.classList.add('removing');
    setTimeout(() => el.remove(), 300);
  },
  success: (title, desc) => Toast.show('success', title, desc),
  error:   (title, desc) => Toast.show('error',   title, desc),
  info:    (title, desc) => Toast.show('info',     title, desc),
  warning: (title, desc) => Toast.show('warning',  title, desc),
};

// ── Modal System ──────────────────────────────────────────
const Modal = {
  _active: null,
  show({ title, subtitle = '', body, footer, size = '', onClose } = {}) {
    Modal.close();
    const el = document.createElement('div');
    el.className = 'modal';
    el.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-box ${size}">
        <div class="modal-header">
          <div>
            <div class="modal-title">${title}</div>
            ${subtitle ? `<div class="modal-subtitle">${subtitle}</div>` : ''}
          </div>
          <button class="modal-close" id="modal-close-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="modal-body">${body}</div>
        ${footer ? `<div class="modal-footer">${footer}</div>` : ''}
      </div>`;
    document.body.appendChild(el);
    Modal._active = el;
    el.querySelector('#modal-close-btn').addEventListener('click', () => { Modal.close(); onClose && onClose(); });
    el.querySelector('.modal-overlay').addEventListener('click', () => { Modal.close(); onClose && onClose(); });
    return el;
  },
  close() {
    if (Modal._active) { Modal._active.remove(); Modal._active = null; }
  },
};

// ── Drawer System ─────────────────────────────────────────
const Drawer = {
  _active: null,
  _overlay: null,
  show({ content, width = '440px', onClose } = {}) {
    Drawer.close();
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.style.zIndex = '490';
    overlay.addEventListener('click', () => { Drawer.close(); onClose && onClose(); });
    document.body.appendChild(overlay);
    const el = document.createElement('div');
    el.className = 'drawer';
    el.style.width = width;
    el.innerHTML = content;
    document.body.appendChild(el);
    Drawer._active = el;
    Drawer._overlay = overlay;
    requestAnimationFrame(() => el.classList.add('open'));
    const closeBtn = el.querySelector('[data-drawer-close]');
    if (closeBtn) closeBtn.addEventListener('click', () => { Drawer.close(); onClose && onClose(); });
    return el;
  },
  close() {
    if (Drawer._active) {
      Drawer._active.classList.remove('open');
      setTimeout(() => { Drawer._active && Drawer._active.remove(); Drawer._active = null; }, 400);
    }
    if (Drawer._overlay) { Drawer._overlay.remove(); Drawer._overlay = null; }
  },
};

// ── Confirm Dialog ────────────────────────────────────────
function showConfirm({ title, message, confirmText = 'Confirm', cancelText = 'Cancel', danger = false, onConfirm, onCancel } = {}) {
  Modal.show({
    title,
    body: `<p style="color:var(--text-secondary);line-height:var(--lh-relaxed)">${message}</p>`,
    footer: `
      <button class="btn btn-secondary" id="confirm-cancel">${cancelText}</button>
      <button class="btn ${danger ? 'btn-danger' : 'btn-primary'}" id="confirm-ok">${confirmText}</button>`,
  });
  document.getElementById('confirm-cancel').addEventListener('click', () => { Modal.close(); onCancel && onCancel(); });
  document.getElementById('confirm-ok').addEventListener('click', () => { Modal.close(); onConfirm && onConfirm(); });
}

// ── Sidebar Renderer ──────────────────────────────────────
function renderSidebar(activeScreen) {
  const navItems = [
    { id: 'dashboard',  label: 'Overview',      icon: icons.grid,      badge: null },
    { id: 'contacts',   label: 'Contacts',      icon: icons.users,     badge: null },
    { id: 'campaigns',  label: 'Campaigns',     icon: icons.megaphone, badge: null },
    { id: 'templates',  label: 'Templates',     icon: icons.file,      badge: null },
    { id: 'inbox',      label: 'Inbox',         icon: icons.inbox,     badge: '3'  },
    { id: 'analytics',  label: 'Analytics',     icon: icons.chart,     badge: null },
  ];
  const secondaryItems = [
    { id: 'team',       label: 'Team',          icon: icons.team,      badge: null },
    { id: 'admin',      label: 'Organizations', icon: icons.building,  badge: null },
    { id: 'audit',      label: 'Audit Log',     icon: icons.shield,    badge: null },
    { id: 'settings',   label: 'Settings',      icon: icons.settings,  badge: null },
  ];

  const navHTML = (items) => items.map(item => `
    <div class="nav-item ${activeScreen === item.id ? 'active' : ''}" data-nav="${item.id}">
      <span class="nav-icon">${item.icon}</span>
      <span class="nav-label">${item.label}</span>
      ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ''}
    </div>`).join('');

  return `
    <div class="sidebar-toggle" id="sidebar-toggle" data-tooltip="Collapse sidebar">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
    </div>
    <div class="sidebar-logo">
      <div class="sidebar-logo-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      </div>
      <div class="sidebar-logo-text">
        <span class="sidebar-logo-name">TextReach</span>
        <span class="sidebar-logo-tagline">P2P Texting Platform</span>
      </div>
    </div>
    <div class="sidebar-org" id="org-switcher">
      <div class="sidebar-org-avatar">AC</div>
      <div class="sidebar-org-text">
        <div class="sidebar-org-name">ABC Campaign</div>
        <div class="sidebar-org-role">Texas District</div>
      </div>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--color-gray-600);flex-shrink:0"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
    <nav class="sidebar-nav">
      <div class="sidebar-section-label">Main</div>
      ${navHTML(navItems)}
      <div class="sidebar-section-label" style="margin-top:var(--space-3)">Management</div>
      ${navHTML(secondaryItems)}
    </nav>
    <div class="sidebar-footer">
      <div class="nav-item" id="help-nav">
        <span class="nav-icon">${icons.help}</span>
        <span class="nav-label">Help & Support</span>
      </div>
      <div class="sidebar-user" id="topbar-user-btn-sidebar">
        <div class="user-avatar avatar-a">AR</div>
        <div class="sidebar-user-text">
          <div class="sidebar-user-name">Alex Rivera</div>
          <div class="sidebar-user-role">Org Admin</div>
        </div>
      </div>
    </div>`;
}

// ── Topbar Renderer ───────────────────────────────────────
function renderTopbar(breadcrumbs = []) {
  const crumbsHTML = breadcrumbs.map((b, i) => {
    if (i === breadcrumbs.length - 1) return `<span class="breadcrumb-item current">${b.label}</span>`;
    return `<span class="breadcrumb-item clickable" data-nav="${b.nav || ''}">${b.label}</span>
            <span class="breadcrumb-sep">›</span>`;
  }).join('');
  return `
    <div class="topbar-breadcrumbs">${crumbsHTML}</div>
    <div class="topbar-search">
      <svg class="topbar-search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input type="text" placeholder="Search everything…" id="global-search">
    </div>
    <div class="topbar-actions">
      <button class="topbar-icon-btn" id="notif-btn" data-tooltip="Notifications">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        <div class="topbar-notif-dot"></div>
      </button>
      <div class="topbar-divider"></div>
      <div class="topbar-user" id="topbar-user-btn" style="position:relative">
        <div class="topbar-user-info">
          <span class="topbar-user-name">Alex Rivera</span>
          <span class="topbar-user-role">Org Admin</span>
        </div>
        <div class="user-avatar avatar-a" style="width:32px;height:32px;font-size:12px">AR</div>
      </div>
    </div>`;
}

// ── SVG Icon Library ──────────────────────────────────────
const icons = {
  grid:      `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
  users:     `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  megaphone: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>`,
  file:      `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
  inbox:     `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>`,
  chart:     `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  team:      `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  building:  `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
  shield:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  settings:  `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  help:      `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  plus:      `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  upload:    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>`,
  download:  `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="8 17 12 21 16 17"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"/></svg>`,
  filter:    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>`,
  search:    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  send:      `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
  check:     `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`,
  x:         `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  arrow_right:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
  arrow_left: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>`,
  dots:      `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>`,
  edit:      `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  trash:     `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`,
  eye:       `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
  copy:      `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
  pause:     `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`,
  play:      `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
  image:     `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
  phone:     `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 14a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.77 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.91a16 16 0 0 0 6.06 6.06l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  tag:       `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>`,
  note:      `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
  ai:        `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>`,
  spark:     `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1l3.09 6.26L22 9l-5 4.87 1.18 6.88L12 17.77l-6.18 3.08L7 14l-5-4.87 6.91-.74z"/></svg>`,
  rocket:    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>`,
  mail:      `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
  msg:       `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 0 2 2z"/></svg>`,
  lock:      `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  info_circle:`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="8"/><line x1="12" y1="12" x2="12" y2="16"/></svg>`,
  warning_tri:`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
};

// ── Chart.js helpers ──────────────────────────────────────
const Charts = {
  _instances: {},

  destroy(id) {
    if (Charts._instances[id]) {
      Charts._instances[id].destroy();
      delete Charts._instances[id];
    }
  },

  line(canvasId, labels, datasets, opts = {}) {
    Charts.destroy(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1e293b',
            titleColor: '#f1f5f9',
            bodyColor: '#94a3b8',
            borderColor: '#334155',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
          },
        },
        scales: {
          x: { grid: { display: false }, border: { display: false }, ticks: { color: '#64748b', font: { size: 11 } } },
          y: { grid: { color: '#f1f5f9' }, border: { display: false }, ticks: { color: '#64748b', font: { size: 11 } } },
        },
        ...opts,
      },
    });
    Charts._instances[canvasId] = chart;
    return chart;
  },

  bar(canvasId, labels, datasets, opts = {}) {
    Charts.destroy(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { backgroundColor: '#1e293b', titleColor: '#f1f5f9', bodyColor: '#94a3b8', borderColor: '#334155', borderWidth: 1, padding: 12, cornerRadius: 8 },
        },
        scales: {
          x: { grid: { display: false }, border: { display: false }, ticks: { color: '#64748b', font: { size: 11 } } },
          y: { grid: { color: '#f1f5f9' }, border: { display: false }, ticks: { color: '#64748b', font: { size: 11 } } },
        },
        ...opts,
      },
    });
    Charts._instances[canvasId] = chart;
    return chart;
  },

  doughnut(canvasId, labels, data, colors, opts = {}) {
    Charts.destroy(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: { labels, datasets: [{ data, backgroundColor: colors, borderWidth: 0, hoverOffset: 4 }] },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: { display: false },
          tooltip: { backgroundColor: '#1e293b', titleColor: '#f1f5f9', bodyColor: '#94a3b8', borderColor: '#334155', borderWidth: 1, padding: 12, cornerRadius: 8 },
        },
        ...opts,
      },
    });
    Charts._instances[canvasId] = chart;
    return chart;
  },
};

// ── Notification Panel ─────────────────────────────────────
function renderNotifPanel() {
  const panel = document.getElementById('notif-panel');
  if (!panel) return;
  const iconMap = {
    reply:   { icon: icons.msg,       bg: 'var(--color-teal-50)',  color: 'var(--color-teal-600)' },
    campaign:{ icon: icons.megaphone, bg: 'var(--color-blue-50)',  color: 'var(--color-blue-600)' },
    warning: { icon: icons.warning_tri,bg:'var(--color-amber-50)', color: 'var(--color-amber-600)'},
    success: { icon: icons.check,     bg: 'var(--color-green-50)', color: 'var(--color-green-600)'},
    system:  { icon: icons.info_circle,bg:'var(--color-gray-100)', color: 'var(--color-gray-500)' },
  };
  panel.innerHTML = `
    <div class="notif-panel-header">
      <span class="fw-semibold text-md">Notifications</span>
      <div style="display:flex;align-items:center;gap:var(--space-3)">
        <span class="text-xs text-accent pointer">Mark all read</span>
        <button class="topbar-icon-btn" id="close-notif-panel">
          ${icons.x}
        </button>
      </div>
    </div>
    <div class="notif-panel-body">
      ${AppData.notifications.map(n => {
        const style = iconMap[n.type] || iconMap.system;
        return `
          <div class="notif-item ${n.unread ? 'unread' : ''}">
            <div class="notif-icon" style="background:${style.bg};color:${style.color}">${style.icon}</div>
            <div class="notif-content">
              <div class="notif-title">${n.title}</div>
              <div class="notif-desc">${n.desc}</div>
              <div class="notif-time">${n.time}</div>
            </div>
          </div>`;
      }).join('')}
    </div>`;
  document.getElementById('close-notif-panel').addEventListener('click', () => {
    panel.classList.remove('open');
  });
}

// ── User Dropdown ─────────────────────────────────────────
function showUserDropdown(anchorEl) {
  const existing = document.getElementById('user-dropdown-menu');
  if (existing) { existing.remove(); return; }
  const dd = document.createElement('div');
  dd.className = 'user-dropdown';
  dd.id = 'user-dropdown-menu';
  dd.innerHTML = `
    <div class="user-dropdown-header">
      <div class="user-dropdown-name">Alex Rivera</div>
      <div class="user-dropdown-email">alex.rivera@abccampaign.org</div>
    </div>
    <div class="user-dropdown-item">${icons.users} <span>My Profile</span></div>
    <div class="user-dropdown-item" data-nav="settings">${icons.settings} <span>Settings</span></div>
    <div class="user-dropdown-item">${icons.building} <span>Organization</span></div>
    <div class="user-dropdown-divider"></div>
    <div class="user-dropdown-item">${icons.help} <span>Help & Support</span></div>
    <div class="user-dropdown-divider"></div>
    <div class="user-dropdown-item danger" id="logout-btn">${icons.lock} <span>Sign Out</span></div>`;
  anchorEl.style.position = 'relative';
  anchorEl.appendChild(dd);
  setTimeout(() => {
    document.addEventListener('click', function closeDD(e) {
      if (!dd.contains(e.target) && !anchorEl.contains(e.target)) {
        dd.remove();
        document.removeEventListener('click', closeDD);
      }
    });
  }, 0);
  dd.querySelector('#logout-btn').addEventListener('click', () => {
    dd.remove();
    App.logout();
  });
  dd.querySelectorAll('[data-nav]').forEach(el => {
    el.addEventListener('click', () => { dd.remove(); App.navigate(el.dataset.nav); });
  });
}

// ── Utility helpers ───────────────────────────────────────
function avatarInitials(name) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

function avatarColor(name) {
  const colors = ['a', 'b', 'c', 'd', 'e', 'f'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function statusBadge(status) {
  const map = {
    'active':     'badge-active',
    'ready':      'badge-ready',
    'draft':      'badge-draft',
    'paused':     'badge-paused',
    'completed':  'badge-completed',
    'pending':    'badge-pending',
    'assigned':   'badge-assigned',
    'messaged':   'badge-messaged',
    'replied':    'badge-replied',
    'opted-out':  'badge-opted-out',
    'opted_out':  'badge-opted-out',
    'inactive':   'badge-neutral',
  };
  const cls = map[status] || 'badge-neutral';
  const label = status.replace(/-/g, ' ').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return `<span class="badge ${cls}"><span class="badge-dot"></span>${label}</span>`;
}

function roleBadge(role) {
  const map = { admin: 'badge-admin', manager: 'badge-manager', texter: 'badge-texter' };
  const labels = { admin: 'Org Admin', manager: 'Campaign Manager', texter: 'Texter' };
  return `<span class="badge ${map[role] || 'badge-neutral'}">${labels[role] || role}</span>`;
}

function progressBar(pct, cls = '') {
  return `
    <div style="display:flex;align-items:center;gap:var(--space-2)">
      <div class="progress-bar" style="flex:1">
        <div class="progress-fill ${cls}" style="width:${pct}%"></div>
      </div>
      <span class="text-xs fw-semibold text-secondary" style="width:32px;text-align:right">${pct}%</span>
    </div>`;
}
