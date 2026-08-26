/* ============================================================
   APP.JS — Router, state management, navigation
   ============================================================ */

const App = {
  state: {
    screen: 'login',
    contactStatusFilter: '',
    texterIndex: 0,
    activeConvId: 1,
    newCampaign: null,
  },

  // ── Navigate to a screen ───────────────────────────────────
  navigate(screenId, params = {}) {
    const pageContent = document.getElementById('page-content');
    if (!pageContent) return;

    // Update state
    App.state.screen = screenId;
    Object.assign(App.state, params);

    // Destroy any active charts
    Object.keys(Charts._instances).forEach(k => Charts.destroy(k));

    // Close drawers/modals on nav
    Drawer.close();
    Modal.close();

    // Render sidebar with new active item
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      const navMap = { 'campaign-detail': 'campaigns', 'create-campaign': 'campaigns', 'csv-import': 'contacts' };
      sidebar.innerHTML = renderSidebar(navMap[screenId] || screenId);
      App._bindSidebar();
    }

    // Render topbar breadcrumbs
    const topbar = document.getElementById('topbar');
    if (topbar) {
      const crumbs = App._getBreadcrumbs(screenId, params);
      topbar.innerHTML = renderTopbar(crumbs);
      App._bindTopbar();
    }

    // Render screen
    let html = '';
    switch (screenId) {
      case 'dashboard':       html = Screens.dashboard(); break;
      case 'contacts':        html = Screens.contacts(); break;
      case 'csv-import':      html = Screens.csvImport(params.step || 1); break;
      case 'campaigns':       html = Screens.campaigns(); break;
      case 'campaign-detail': html = Screens.campaignDetail(params.id || 1); break;
      case 'create-campaign': html = Screens.createCampaign(params.step || 1); break;
      case 'templates':       html = Screens.templates(); break;
      case 'texter':          html = Screens.texter(); break;
      case 'inbox':           html = Screens.inbox(); break;
      case 'analytics':       html = Screens.analytics(); break;
      case 'team':            html = Screens.team(); break;
      case 'admin':           html = Screens.admin(); break;
      case 'audit':           html = Screens.audit(); break;
      case 'settings':        html = Screens.settings(); break;
      default:                html = Screens.dashboard(); break;
    }

    pageContent.innerHTML = html;
    pageContent.scrollTop = 0;

    // Bind screen-specific events
    setTimeout(() => {
      App._bindScreenEvents(screenId, params);
      App._bindGlobalLinks(pageContent);
    }, 0);
  },

  _getBreadcrumbs(screenId, params) {
    const map = {
      'dashboard':       [{ label: 'ABC Campaign' }, { label: 'Overview' }],
      'contacts':        [{ label: 'ABC Campaign' }, { label: 'Contacts' }],
      'csv-import':      [{ label: 'ABC Campaign' }, { label: 'Contacts', nav: 'contacts' }, { label: 'Import CSV' }],
      'campaigns':       [{ label: 'ABC Campaign' }, { label: 'Campaigns' }],
      'campaign-detail': [{ label: 'ABC Campaign' }, { label: 'Campaigns', nav: 'campaigns' }, { label: (AppData.campaigns.find(c => c.id === params.id) || AppData.campaigns[0]).name }],
      'create-campaign': [{ label: 'ABC Campaign' }, { label: 'Campaigns', nav: 'campaigns' }, { label: 'Create Campaign' }],
      'templates':       [{ label: 'ABC Campaign' }, { label: 'Templates' }],
      'texter':          [{ label: 'ABC Campaign' }, { label: 'Texter Workspace' }],
      'inbox':           [{ label: 'ABC Campaign' }, { label: 'Inbox' }],
      'analytics':       [{ label: 'ABC Campaign' }, { label: 'Analytics' }],
      'team':            [{ label: 'ABC Campaign' }, { label: 'Team' }],
      'admin':           [{ label: 'Platform Admin' }, { label: 'Organizations' }],
      'audit':           [{ label: 'Platform Admin' }, { label: 'Audit Log' }],
      'settings':        [{ label: 'ABC Campaign' }, { label: 'Settings' }],
    };
    return map[screenId] || [{ label: 'ABC Campaign' }, { label: screenId }];
  },

  _bindScreenEvents(screenId, params) {
    switch (screenId) {
      case 'dashboard':       Screens._initDashboardCharts(); App._bindDashboardNav(); break;
      case 'contacts':        Screens._initContactsEvents(); break;
      case 'csv-import':      Screens._initCsvImportEvents(params.step || 1); break;
      case 'campaigns':       Screens._initCampaignsEvents(); break;
      case 'campaign-detail': Screens._initCampaignDetailCharts(); break;
      case 'create-campaign': Screens._initCreateCampaignEvents(params.step || 1); break;
      case 'templates':       document.getElementById('new-template-btn')?.addEventListener('click', () => Screens.showTemplateEditor(1)); break;
      case 'texter':          Screens._initTexterEvents(); break;
      case 'inbox':           Screens._initInboxEvents(); break;
      case 'analytics':       Screens._initAnalyticsCharts(); break;
      case 'team':            Screens._initTeamEvents(); break;
      case 'admin':           Screens._initAdminEvents(); break;
      case 'audit':           break;
      case 'settings':        document.querySelector('.btn-primary')?.addEventListener('click', () => Toast.success('Settings Saved', 'Your changes have been saved.')); break;
    }
  },

  _bindGlobalLinks(container) {
    container.querySelectorAll('[data-nav]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        App.navigate(el.dataset.nav);
      });
    });
  },

  _bindDashboardNav() {
    document.querySelectorAll('.campaign-table-row').forEach(row => {
      row.addEventListener('click', () => App.navigate('campaigns'));
    });
  },

  // ── Sidebar bindings ──────────────────────────────────────
  _bindSidebar() {
    // Nav items
    document.querySelectorAll('[data-nav]').forEach(el => {
      if (!el.closest('#page-content')) {
        el.addEventListener('click', () => App.navigate(el.dataset.nav));
      }
    });

    // Toggle collapse
    document.getElementById('sidebar-toggle')?.addEventListener('click', () => {
      const sidebar = document.getElementById('sidebar');
      sidebar.classList.toggle('collapsed');
    });

    // Org switcher
    document.getElementById('org-switcher')?.addEventListener('click', () => {
      Toast.info('Organization Switcher', 'You are currently viewing: Demo Campaign — Texas District');
    });

    // Help
    document.getElementById('help-nav')?.addEventListener('click', () => {
      Toast.info('Help & Support', 'Visit docs.textreach.io or email support@textreach.io');
    });
  },

  // ── Topbar bindings ───────────────────────────────────────
  _bindTopbar() {
    // Notifications
    document.getElementById('notif-btn')?.addEventListener('click', () => {
      const panel = document.getElementById('notif-panel');
      if (panel) {
        panel.classList.toggle('open');
        if (panel.classList.contains('open')) renderNotifPanel();
      }
    });

    // User menu
    document.getElementById('topbar-user-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      showUserDropdown(document.getElementById('topbar-user-btn'));
    });

    // Breadcrumb nav
    document.querySelectorAll('.breadcrumb-item[data-nav]').forEach(el => {
      el.style.cursor = 'pointer';
      el.addEventListener('click', () => App.navigate(el.dataset.nav));
    });

    // Global search shortcut
    document.getElementById('global-search')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.value.trim()) {
        Toast.info('Search', `Showing results for "${e.target.value.trim()}"`);
        e.target.value = '';
      }
    });
  },

  // ── Login flow ─────────────────────────────────────────────
  login() {
    const loginScreen = document.getElementById('login-screen');
    const appShell = document.getElementById('app-shell');
    loginScreen.classList.add('hidden');
    setTimeout(() => {
      loginScreen.style.display = 'none';
      appShell.classList.add('visible');
      App.navigate('dashboard');
    }, 400);
    Toast.success('Welcome back, Alex!', 'You\'re now signed in to ABC Campaign.');
  },

  logout() {
    const loginScreen = document.getElementById('login-screen');
    const appShell = document.getElementById('app-shell');
    loginScreen.style.display = '';
    appShell.classList.remove('visible');
    setTimeout(() => loginScreen.classList.remove('hidden'), 10);
    App.state = { screen: 'login', contactStatusFilter: '', texterIndex: 0, activeConvId: 1, newCampaign: null };
    Toast.info('Signed Out', 'You have been signed out.');
  },

  // ── Initialize the app ─────────────────────────────────────
  init() {
    // Render sidebar and topbar initially (will be re-rendered on navigate)
    const sidebar = document.getElementById('sidebar');
    if (sidebar) { sidebar.innerHTML = renderSidebar('dashboard'); App._bindSidebar(); }

    const topbar = document.getElementById('topbar');
    if (topbar) { topbar.innerHTML = renderTopbar([{ label: 'ABC Campaign' }, { label: 'Overview' }]); App._bindTopbar(); }

    // Login button
    document.getElementById('login-btn')?.addEventListener('click', function() {
      const emailEl = document.getElementById('login-email');
      const passEl  = document.getElementById('login-pass');
      if (!emailEl.value || !passEl.value) {
        emailEl.classList.toggle('error', !emailEl.value);
        passEl.classList.toggle('error', !passEl.value);
        return;
      }
      this.classList.add('loading');
      this.innerHTML = '<span class="btn-text">Signing in…</span>';
      setTimeout(() => App.login(), 1200);
    });

    document.getElementById('login-email')?.addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('login-btn').click(); });
    document.getElementById('login-pass')?.addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('login-btn').click(); });

    // SSO button
    document.getElementById('sso-btn')?.addEventListener('click', function() {
      this.innerHTML = 'Redirecting…';
      setTimeout(() => App.login(), 800);
    });

    // Forgot password
    document.getElementById('forgot-link')?.addEventListener('click', () => {
      Toast.info('Password Reset', 'Check your email for reset instructions.');
    });

    // Notification panel init
    const notifPanel = document.getElementById('notif-panel');
    if (notifPanel) renderNotifPanel();

    // Close dropdowns on outside click
    document.addEventListener('click', (e) => {
      const dd = document.getElementById('user-dropdown-menu');
      if (dd && !dd.contains(e.target)) dd.remove();
    });

    // Keyboard shortcut: Escape closes modal/drawer
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        Modal.close();
        Drawer.close();
        const panel = document.getElementById('notif-panel');
        if (panel) panel.classList.remove('open');
      }
    });
  },
};

// ── Boot ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => App.init());
