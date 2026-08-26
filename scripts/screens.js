/* ============================================================
   SCREENS.JS — All 13 screen render functions
   ============================================================ */

const Screens = {

  // ── SCREEN 1: DASHBOARD ───────────────────────────────────
  dashboard() {
    const d = AppData.analytics;
    const totalSent = d.sent.reduce((a, b) => a + b, 0);
    return `
    <div class="page-wrapper">
      <div class="dashboard-greeting animate-fade-in-up">
        <h1>Good morning, Alex 👋</h1>
        <p>Here's what's happening across your campaigns today.</p>
      </div>

      <div class="kpi-grid">
        ${[
          { label: 'Total Contacts', value: '12,482', delta: '+318 this week', dir: 'up', icon: icons.users, color: 'teal' },
          { label: 'Messages Sent', value: '8,642', delta: '+2,080 today', dir: 'up', icon: icons.send, color: 'blue' },
          { label: 'Delivery Rate', value: '94.1%', delta: '+0.3% vs yesterday', dir: 'up', icon: icons.check, color: 'green' },
          { label: 'Replies', value: '517', delta: '+217 today', dir: 'up', icon: icons.msg, color: 'teal' },
          { label: 'Opt-Outs', value: '48', delta: '+12 today', dir: 'down', icon: icons.x, color: 'red' },
          { label: 'Active Campaigns', value: '4', delta: 'Across TX', dir: 'neutral', icon: icons.megaphone, color: 'purple' },
        ].map(k => `
          <div class="kpi-card animate-fade-in-up">
            <div class="kpi-icon ${k.color}">${k.icon}</div>
            <div class="kpi-card-label">${k.label}</div>
            <div class="kpi-card-value">${k.value}</div>
            <div class="kpi-card-delta ${k.dir}">${k.dir === 'up' ? '↑' : k.dir === 'down' ? '↓' : '—'} ${k.delta}</div>
          </div>`).join('')}
      </div>

      <div class="dashboard-main-grid">
        <div class="chart-card animate-fade-in-up">
          <div class="chart-header">
            <div>
              <div class="chart-title">Campaign Performance</div>
              <div class="chart-subtitle">Last 7 days — all campaigns</div>
            </div>
            <select class="select" style="width:auto;height:30px;font-size:12px">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>This month</option>
            </select>
          </div>
          <div class="chart-body">
            <div style="height:240px"><canvas id="dash-main-chart"></canvas></div>
            <div class="chart-legend">
              <div class="chart-legend-item"><div class="chart-legend-dot" style="background:#0d9488"></div>Sent</div>
              <div class="chart-legend-item"><div class="chart-legend-dot" style="background:#3b82f6"></div>Delivered</div>
              <div class="chart-legend-item"><div class="chart-legend-dot" style="background:#22c55e"></div>Replies</div>
              <div class="chart-legend-item"><div class="chart-legend-dot" style="background:#ef4444"></div>Failed</div>
            </div>
          </div>
        </div>

        <div class="chart-card animate-fade-in-up">
          <div class="chart-header">
            <div class="chart-title">Contact Status</div>
          </div>
          <div class="chart-body">
            <div style="height:180px;display:flex;align-items:center;justify-content:center">
              <canvas id="dash-donut-chart"></canvas>
            </div>
            <div style="margin-top:var(--space-4);display:flex;flex-direction:column;gap:var(--space-2)">
              ${[
                { label: 'Replied',    val: '517',   pct: '6.0',  color: '#22c55e' },
                { label: 'Messaged',   val: '4,842', pct: '38.8', color: '#0d9488' },
                { label: 'Assigned',   val: '3,200', pct: '25.6', color: '#3b82f6' },
                { label: 'Pending',    val: '3,875', pct: '31.0', color: '#94a3b8' },
                { label: 'Opted Out', val: '48',    pct: '0.4',  color: '#ef4444' },
              ].map(r => `
                <div style="display:flex;align-items:center;gap:var(--space-2)">
                  <div style="width:8px;height:8px;border-radius:50%;background:${r.color};flex-shrink:0"></div>
                  <span class="text-xs text-secondary" style="flex:1">${r.label}</span>
                  <span class="text-xs fw-semibold">${r.val}</span>
                  <span class="text-xs text-tertiary" style="width:36px;text-align:right">${r.pct}%</span>
                </div>`).join('')}
            </div>
          </div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 340px;gap:var(--space-5);margin-bottom:var(--space-5)">
        <div class="table-container animate-fade-in-up">
          <div class="card-header">
            <div class="card-title">Active Campaigns</div>
            <button class="btn btn-secondary btn-sm" data-nav="campaigns">${icons.arrow_right} View All</button>
          </div>
          <div class="table-scroll">
            <table class="data-table">
              <thead><tr>
                <th>Campaign</th><th>Contacts</th><th>Progress</th>
                <th>Delivery</th><th>Replies</th><th>Status</th>
              </tr></thead>
              <tbody>
                ${AppData.campaigns.filter(c => c.status !== 'completed').map(c => `
                  <tr class="campaign-table-row" data-nav="campaigns" style="cursor:pointer">
                    <td>
                      <div style="font-weight:600;font-size:13px">${c.name}</div>
                      <div style="font-size:11px;color:var(--text-tertiary)">${c.texters.join(', ')}</div>
                    </td>
                    <td><span class="fw-semibold">${c.contacts.toLocaleString()}</span></td>
                    <td style="min-width:130px">${progressBar(c.progress)}</td>
                    <td><span style="color:${c.delivery_rate > 93 ? 'var(--color-green-600)' : 'var(--color-amber-600)'};font-weight:600">${c.delivery_rate > 0 ? c.delivery_rate + '%' : '—'}</span></td>
                    <td>${c.replies > 0 ? c.replies.toLocaleString() : '—'}</td>
                    <td>${statusBadge(c.status)}</td>
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <div class="ai-summary animate-fade-in-up">
          <div class="ai-summary-header">
            <div class="ai-badge">${icons.spark} AI Summary</div>
          </div>
          <div class="ai-summary-title" style="margin-bottom:var(--space-3)">Operations Intelligence</div>
          <div class="ai-summary-text">
            <strong style="color:white">3,842 contacts</strong> have been messaged today across 4 active campaigns. Delivery rate is holding at <strong style="color:var(--color-teal-300)">94.1%</strong> — 0.3 points above yesterday's average. <strong style="color:white">217 contacts</strong> responded, with Election Reminder leading at 8.3% response rate.
            <br><br>
            Delivery failures are concentrated around <strong style="color:var(--color-amber-300)">3 error types</strong>: unreachable numbers (44%), carrier filtering (31%), and invalid format (25%). GOTV — Houston South shows a slightly elevated opt-out rate worth monitoring.
          </div>
          <div class="ai-summary-stats">
            <div class="ai-stat"><div class="ai-stat-value" style="color:var(--color-teal-400)">94.1%</div><div class="ai-stat-label">Delivery</div></div>
            <div class="ai-stat"><div class="ai-stat-value" style="color:var(--color-green-400)">217</div><div class="ai-stat-label">Replies</div></div>
            <div class="ai-stat"><div class="ai-stat-value" style="color:var(--color-amber-400)">48</div><div class="ai-stat-label">Opt-Outs</div></div>
            <div class="ai-stat"><div class="ai-stat-value" style="color:var(--color-blue-400)">4</div><div class="ai-stat-label">Active</div></div>
          </div>
        </div>
      </div>
    </div>`;
  },

  _initDashboardCharts() {
    const d = AppData.analytics;
    setTimeout(() => {
      Charts.line('dash-main-chart', d.weekly_labels, [
        { label: 'Sent',      data: d.sent,      borderColor: '#0d9488', backgroundColor: 'rgba(13,148,136,0.08)', fill: true, tension: 0.4, pointRadius: 3, pointBackgroundColor: '#0d9488' },
        { label: 'Delivered', data: d.delivered, borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.06)', fill: false, tension: 0.4, pointRadius: 3, pointBackgroundColor: '#3b82f6' },
        { label: 'Replies',   data: d.replies,   borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,0.06)',  fill: false, tension: 0.4, pointRadius: 3, pointBackgroundColor: '#22c55e' },
        { label: 'Failed',    data: d.failed,    borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.06)', fill: false, tension: 0.4, pointRadius: 3, pointBackgroundColor: '#ef4444', borderDash: [4, 3] },
      ]);
      Charts.doughnut('dash-donut-chart',
        ['Replied', 'Messaged', 'Assigned', 'Pending', 'Opted Out'],
        [517, 4842, 3200, 3875, 48],
        ['#22c55e', '#0d9488', '#3b82f6', '#94a3b8', '#ef4444'],
      );
    }, 50);
  },

  // ── SCREEN 2: CONTACTS ────────────────────────────────────
  contacts(filterStatus = null) {
    let contacts = [...AppData.contacts];
    let searchTerm = '';

    const renderTable = (data) => `
      <tbody id="contacts-tbody">
        ${data.length === 0 ? `<tr><td colspan="12"><div class="empty-state"><div class="empty-state-icon">${icons.users}</div><div class="empty-state-title">No contacts found</div><div class="empty-state-desc">Try adjusting your search or filters</div></div></td></tr>` :
          data.map(c => `
            <tr class="clickable" data-contact-id="${c.id}">
              <td><input type="checkbox" class="contact-check" data-id="${c.id}" onclick="event.stopPropagation()"></td>
              <td><div class="contact-cell"><div class="avatar avatar-sm ${avatarColor(c.first + c.last)}">${avatarInitials(c.first + ' ' + c.last)}</div><span class="fw-semibold">${c.first}</span></div></td>
              <td>${c.last}</td>
              <td style="font-family:var(--font-mono);font-size:12px;color:var(--text-secondary)">${c.phone}</td>
              <td>${c.city}</td>
              <td>${c.state}</td>
              <td style="max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px">${c.campaign}</td>
              <td>
                <div style="display:flex;align-items:center;gap:var(--space-2)">
                  <div class="avatar avatar-sm ${avatarColor(c.texter)}">${avatarInitials(c.texter)}</div>
                  <span style="font-size:12px">${c.texter.split(' ')[0]}</span>
                </div>
              </td>
              <td>${statusBadge(c.status)}</td>
              <td style="font-size:12px;color:var(--text-tertiary)">${c.last_msg}</td>
              <td>${c.opted_out ? `<span class="badge badge-opted-out">Yes</span>` : `<span class="badge badge-success">No</span>`}</td>
              <td style="font-size:12px;color:var(--text-tertiary)">${c.updated}</td>
            </tr>`).join('')}
      </tbody>`;

    return `
    <div class="page-wrapper" style="padding-bottom:var(--space-6)">
      <div class="page-header">
        <div>
          <h1 class="page-title">Contacts</h1>
          <p class="page-subtitle">${AppData.contacts.length} contacts across ${AppData.campaigns.length} campaigns</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-secondary" id="export-btn">${icons.download} Export</button>
          <button class="btn btn-secondary" id="import-csv-btn">${icons.upload} Import CSV</button>
          <button class="btn btn-primary" id="add-contact-btn">${icons.plus} Add Contact</button>
        </div>
      </div>

      <div id="bulk-bar" class="bulk-action-bar hidden" style="margin-bottom:var(--space-3)">
        <span id="bulk-count">0 contacts selected</span>
        <div style="flex:1"></div>
        <button class="btn btn-sm" style="background:rgba(255,255,255,0.15);color:white;border:none" id="bulk-assign">Assign Texter</button>
        <button class="btn btn-sm" style="background:rgba(255,255,255,0.15);color:white;border:none" id="bulk-tag">Add Tag</button>
        <button class="btn btn-sm" style="background:rgba(255,150,150,0.3);color:white;border:none" id="bulk-delete">Remove</button>
      </div>

      <div class="contacts-toolbar">
        <div class="search-input-wrap" style="width:280px">
          <svg class="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Search contacts…" id="contact-search">
        </div>
        <button class="btn btn-secondary btn-sm" id="filter-btn">${icons.filter} Filter</button>
        <div class="filter-bar" id="active-filters">
          ${filterStatus ? `<div class="filter-chip">${filterStatus} <span class="remove" id="clear-filter">${icons.x}</span></div>` : ''}
        </div>
        <div style="flex:1"></div>
        <div class="tabs" style="border:1px solid var(--border-default);border-radius:var(--radius-md);overflow:hidden">
          ${['All','Pending','Assigned','Messaged','Replied','Opted Out'].map(s => `
            <div class="tab-item ${(!filterStatus && s==='All')||(filterStatus===s)?'active':''}" style="border-bottom:none;padding:6px 12px;font-size:12px" data-status-filter="${s==='All'?'':s.toLowerCase().replace(' ','-')}">${s}</div>`).join('')}
        </div>
      </div>

      <div class="table-container">
        <div class="table-scroll">
          <table class="data-table" id="contacts-table">
            <thead><tr>
              <th style="width:40px"><input type="checkbox" id="select-all-cb"></th>
              <th class="sortable">First Name <span class="sort-icon">↕</span></th>
              <th class="sortable">Last Name <span class="sort-icon">↕</span></th>
              <th>Phone</th>
              <th>City</th>
              <th>State</th>
              <th>Campaign</th>
              <th>Assigned Texter</th>
              <th>Status</th>
              <th>Last Message</th>
              <th>Opt-Out</th>
              <th>Updated</th>
            </tr></thead>
            ${renderTable(contacts)}
          </table>
        </div>
        <div class="table-footer">
          <span class="table-count" id="contacts-count">Showing ${contacts.length} contacts</span>
          <div class="pagination">
            <button class="page-btn">‹</button>
            <button class="page-btn active">1</button>
            <button class="page-btn">2</button>
            <button class="page-btn">3</button>
            <span style="padding:0 4px;color:var(--text-tertiary);font-size:12px">…</span>
            <button class="page-btn">12</button>
            <button class="page-btn">›</button>
          </div>
        </div>
      </div>
    </div>`;
  },

  _initContactsEvents() {
    const searchEl = document.getElementById('contact-search');
    const tbody = document.getElementById('contacts-tbody');
    const selectAll = document.getElementById('select-all-cb');
    const bulkBar = document.getElementById('bulk-bar');
    const bulkCount = document.getElementById('bulk-count');

    const filterContacts = () => {
      const term = searchEl ? searchEl.value.toLowerCase() : '';
      const statusFilter = App.state.contactStatusFilter || '';
      const filtered = AppData.contacts.filter(c => {
        const matchSearch = !term || `${c.first} ${c.last} ${c.phone} ${c.city} ${c.campaign}`.toLowerCase().includes(term);
        const matchStatus = !statusFilter || c.status === statusFilter || (statusFilter === 'opted-out' && c.opted_out);
        return matchSearch && matchStatus;
      });
      document.getElementById('contacts-count').textContent = `Showing ${filtered.length} contacts`;
      tbody.innerHTML = filtered.length === 0 ?
        `<tr><td colspan="12"><div class="empty-state" style="padding:var(--space-8)"><div class="empty-state-icon">${icons.users}</div><div class="empty-state-title">No contacts found</div></div></td></tr>` :
        filtered.map(c => `
          <tr class="clickable" data-contact-id="${c.id}">
            <td><input type="checkbox" class="contact-check" data-id="${c.id}" onclick="event.stopPropagation()"></td>
            <td><div class="contact-cell"><div class="avatar avatar-sm ${avatarColor(c.first+c.last)}">${avatarInitials(c.first+' '+c.last)}</div><span class="fw-semibold">${c.first}</span></div></td>
            <td>${c.last}</td>
            <td style="font-family:var(--font-mono);font-size:12px;color:var(--text-secondary)">${c.phone}</td>
            <td>${c.city}</td>
            <td>${c.state}</td>
            <td style="max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px">${c.campaign}</td>
            <td><div style="display:flex;align-items:center;gap:6px"><div class="avatar avatar-sm ${avatarColor(c.texter)}">${avatarInitials(c.texter)}</div><span style="font-size:12px">${c.texter.split(' ')[0]}</span></div></td>
            <td>${statusBadge(c.status)}</td>
            <td style="font-size:12px;color:var(--text-tertiary)">${c.last_msg}</td>
            <td>${c.opted_out ? `<span class="badge badge-opted-out">Yes</span>` : `<span class="badge badge-success">No</span>`}</td>
            <td style="font-size:12px;color:var(--text-tertiary)">${c.updated}</td>
          </tr>`).join('');
      bindContactRowClicks();
      bindCheckboxes();
    };

    const bindContactRowClicks = () => {
      document.querySelectorAll('[data-contact-id]').forEach(row => {
        row.addEventListener('click', (e) => {
          if (e.target.type === 'checkbox') return;
          const id = parseInt(row.dataset.contactId);
          const contact = AppData.contacts.find(c => c.id === id);
          if (contact) Screens.showContactDrawer(contact);
        });
      });
    };

    const bindCheckboxes = () => {
      document.querySelectorAll('.contact-check').forEach(cb => {
        cb.addEventListener('change', updateBulkBar);
      });
    };

    const updateBulkBar = () => {
      const checked = document.querySelectorAll('.contact-check:checked');
      if (checked.length > 0) {
        bulkBar.classList.remove('hidden');
        bulkCount.textContent = `${checked.length} contact${checked.length > 1 ? 's' : ''} selected`;
      } else {
        bulkBar.classList.add('hidden');
      }
    };

    if (searchEl) searchEl.addEventListener('input', filterContacts);
    if (selectAll) selectAll.addEventListener('change', (e) => {
      document.querySelectorAll('.contact-check').forEach(cb => cb.checked = e.target.checked);
      updateBulkBar();
    });

    document.querySelectorAll('[data-status-filter]').forEach(tab => {
      tab.addEventListener('click', () => {
        App.state.contactStatusFilter = tab.dataset.statusFilter;
        document.querySelectorAll('[data-status-filter]').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        filterContacts();
      });
    });

    document.getElementById('export-btn')?.addEventListener('click', () => Toast.success('Export Started', 'contacts_export.csv will download shortly.'));
    document.getElementById('import-csv-btn')?.addEventListener('click', () => App.navigate('csv-import'));
    document.getElementById('add-contact-btn')?.addEventListener('click', () => Screens.showAddContactModal());
    document.getElementById('filter-btn')?.addEventListener('click', () => Screens.showFilterModal());

    bindContactRowClicks();
    bindCheckboxes();
  },

  showContactDrawer(contact) {
    const msgs = AppData.conversations.find(c => c.contact_id === contact.id);
    Drawer.show({
      content: `
        <div class="drawer-header">
          <div style="display:flex;align-items:center;gap:var(--space-4)">
            <div class="contact-drawer-avatar avatar-${avatarColor(contact.first+contact.last)}">${avatarInitials(contact.first+' '+contact.last)}</div>
            <div>
              <div class="contact-drawer-name">${contact.first} ${contact.last}</div>
              <div class="contact-drawer-sub">${contact.city}, ${contact.state} · ${contact.phone}</div>
            </div>
          </div>
          <button class="modal-close" data-drawer-close>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div style="padding:var(--space-4) var(--space-6);border-bottom:1px solid var(--border-default);display:flex;gap:var(--space-2)">
          ${statusBadge(contact.status)}
          ${contact.opted_out ? `<span class="badge badge-opted-out">Opted Out</span>` : ''}
          ${contact.tags.map(t => `<span class="tag tag-teal">${t}</span>`).join('')}
        </div>
        <div class="drawer-body">
          <div class="section-label" style="margin-bottom:var(--space-3)">Contact Details</div>
          <div style="background:var(--color-gray-50);border:1px solid var(--border-default);border-radius:var(--radius-lg);overflow:hidden;margin-bottom:var(--space-5)">
            ${[
              ['Campaign',        contact.campaign],
              ['Assigned Texter', contact.texter],
              ['Phone',           contact.phone],
              ['City',            `${contact.city}, ${contact.state}`],
              ['Last Message',    contact.last_msg],
              ['Updated',         contact.updated],
            ].map(([k, v]) => `
              <div class="info-row" style="padding:var(--space-2) var(--space-4)">
                <div class="info-row-label">${k}</div>
                <div class="info-row-value">${v}</div>
              </div>`).join('')}
          </div>

          ${contact.notes ? `
            <div class="section-label">Notes</div>
            <div style="background:var(--color-amber-50);border:1px solid var(--color-amber-200);border-radius:var(--radius-md);padding:var(--space-3) var(--space-4);margin-bottom:var(--space-5);font-size:13px;color:var(--color-amber-800)">${contact.notes}</div>` : ''}

          <div class="section-label">Message History</div>
          <div style="display:flex;flex-direction:column;gap:var(--space-2);margin-bottom:var(--space-5)">
            ${msgs ? msgs.messages.slice(-4).map(m => `
              <div class="convo-msg-group ${m.dir === 'out' ? 'outbound' : 'inbound'}">
                <div class="message-bubble ${m.dir === 'out' ? 'outbound' : 'inbound'}">${m.text}</div>
                <div class="message-time ${m.dir === 'in' ? 'inbound' : ''}">${m.time}</div>
              </div>`).join('') :
              `<div style="text-align:center;padding:var(--space-4);color:var(--text-tertiary);font-size:13px">No messages yet</div>`}
          </div>

          <div class="section-label">Tags</div>
          <div style="display:flex;flex-wrap:wrap;gap:var(--space-2);margin-bottom:var(--space-5)">
            ${contact.tags.length ? contact.tags.map(t => `<span class="tag tag-teal">${t}</span>`).join('') : `<span style="font-size:12px;color:var(--text-tertiary)">No tags assigned</span>`}
            <button class="tag" style="cursor:pointer;border-style:dashed">+ Add Tag</button>
          </div>
        </div>
        <div class="drawer-footer">
          <button class="btn btn-secondary btn-sm" onclick="Drawer.close()">${icons.x} Close</button>
          <div style="flex:1"></div>
          ${!contact.opted_out ? `<button class="btn btn-ghost btn-sm text-danger" onclick="Toast.warning('Contact Opted Out','${contact.first} has been marked as opted out.');Drawer.close();">${icons.x} Mark Opt-Out</button>` : ''}
          <button class="btn btn-primary btn-sm" data-nav="inbox">${icons.send} Message</button>
        </div>`,
    });
    document.querySelectorAll('[data-nav]').forEach(el => {
      if (el.closest('.drawer')) {
        el.addEventListener('click', () => { Drawer.close(); App.navigate(el.dataset.nav); });
      }
    });
  },

  showAddContactModal() {
    Modal.show({
      title: 'Add Contact',
      subtitle: 'Manually add a contact to your organization',
      size: '',
      body: `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-4)">
          <div class="form-group"><label class="form-label">First Name <span class="required">*</span></label><input class="input" placeholder="Sarah" id="nc-first"></div>
          <div class="form-group"><label class="form-label">Last Name <span class="required">*</span></label><input class="input" placeholder="Johnson" id="nc-last"></div>
          <div class="form-group" style="grid-column:1/-1"><label class="form-label">Phone Number <span class="required">*</span></label><input class="input" placeholder="+1 (512) 555-0000" id="nc-phone"></div>
          <div class="form-group"><label class="form-label">City</label><input class="input" placeholder="Austin" id="nc-city"></div>
          <div class="form-group"><label class="form-label">State</label><select class="select"><option>TX</option><option>CA</option><option>NY</option></select></div>
          <div class="form-group" style="grid-column:1/-1"><label class="form-label">Assign to Campaign</label>
            <select class="select" id="nc-campaign">
              ${AppData.campaigns.map(c => `<option>${c.name}</option>`).join('')}
            </select>
          </div>
        </div>`,
      footer: `
        <button class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
        <button class="btn btn-primary" id="save-contact-btn">${icons.check} Save Contact</button>`,
    });
    document.getElementById('save-contact-btn').addEventListener('click', () => {
      Modal.close();
      Toast.success('Contact Added', 'The contact has been added to your organization.');
    });
  },

  showFilterModal() {
    Modal.show({
      title: 'Filter Contacts',
      body: `
        <div style="display:grid;gap:var(--space-4)">
          <div class="form-group"><label class="form-label">Status</label>
            <select class="select"><option value="">All statuses</option><option>Pending</option><option>Assigned</option><option>Messaged</option><option>Replied</option><option>Opted Out</option></select>
          </div>
          <div class="form-group"><label class="form-label">Campaign</label>
            <select class="select"><option value="">All campaigns</option>${AppData.campaigns.map(c => `<option>${c.name}</option>`).join('')}</select>
          </div>
          <div class="form-group"><label class="form-label">Assigned Texter</label>
            <select class="select"><option value="">All texters</option>${AppData.team.filter(m=>m.role==='texter').map(m=>`<option>${m.name}</option>`).join('')}</select>
          </div>
          <div class="form-group"><label class="form-label">City</label>
            <select class="select"><option value="">All cities</option><option>Austin</option><option>Houston</option><option>Dallas</option><option>San Antonio</option></select>
          </div>
        </div>`,
      footer: `
        <button class="btn btn-secondary" onclick="Modal.close()">Clear All</button>
        <button class="btn btn-primary" id="apply-filter-btn">${icons.filter} Apply Filters</button>`,
    });
    document.getElementById('apply-filter-btn').addEventListener('click', () => { Modal.close(); Toast.success('Filters Applied', ''); });
  },

  // ── SCREEN 3: CSV IMPORT ──────────────────────────────────
  csvImport(step = 1) {
    const steps = ['Upload', 'Map Fields', 'Validate', 'Import'];
    const imp = AppData.csv_import;

    const stepIndicator = `
      <div class="step-indicator">
        ${steps.map((s, i) => {
          const n = i + 1;
          const cls = n < step ? 'done' : n === step ? 'active' : 'pending';
          return `
            <div class="step-item ${cls}">
              <div class="step-circle">${n < step ? icons.check : n}</div>
              <span class="step-label">${s}</span>
              ${i < steps.length - 1 ? `<div class="step-line"></div>` : ''}
            </div>`;
        }).join('')}
      </div>`;

    const stepContent = {
      1: `
        <div class="dropzone" id="dropzone">
          <div class="dropzone-icon">${icons.upload}</div>
          <div style="font-size:16px;font-weight:600;margin-bottom:var(--space-2)">Drag & drop your CSV file</div>
          <div style="font-size:13px;color:var(--text-tertiary);margin-bottom:var(--space-4)">or click to browse — CSV files up to 50MB</div>
          <button class="btn btn-primary btn-sm" id="browse-btn">Browse Files</button>
        </div>
        <div style="margin-top:var(--space-4);padding:var(--space-3);background:var(--color-blue-50);border:1px solid var(--color-blue-200);border-radius:var(--radius-md);font-size:12px;color:var(--color-blue-700)">
          ${icons.info_circle} Required columns: <strong>first_name</strong>, <strong>phone_number</strong> or <strong>mobile</strong>. Optional: last_name, city, state, zip.
        </div>`,

      2: `
        <div class="file-preview">
          <div class="file-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <div style="flex:1">
            <div style="font-weight:600">${imp.filename}</div>
            <div style="font-size:12px;color:var(--text-tertiary)">${imp.total_rows.toLocaleString()} rows · 8 columns detected</div>
          </div>
          <span class="badge badge-success">${icons.check} File ready</span>
        </div>
        <div style="display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-4)">
          <div class="ai-badge">${icons.spark} AI Suggested Mapping</div>
          <span style="font-size:12px;color:var(--text-secondary)">Review and confirm the field mappings below</span>
          <button class="btn btn-primary btn-sm" id="accept-all-btn">Accept All Suggestions</button>
        </div>
        <div class="table-container">
          <table class="mapping-table">
            <thead><tr><th>CSV Column</th><th>System Field</th><th>Confidence</th><th>Action</th></tr></thead>
            <tbody>
              ${imp.mappings.map((m, i) => `
                <tr>
                  <td><code style="background:var(--color-gray-100);padding:2px 6px;border-radius:4px;font-size:12px">${m.csv_col}</code></td>
                  <td>
                    <select class="select" style="height:32px;font-size:12px" id="mapping-${i}">
                      <option ${m.sys_field==='first_name'?'selected':''}>first_name</option>
                      <option ${m.sys_field==='last_name'?'selected':''}>last_name</option>
                      <option ${m.sys_field==='phone_number'?'selected':''}>phone_number</option>
                      <option ${m.sys_field==='email'?'selected':''}>email</option>
                      <option ${m.sys_field==='city'?'selected':''}>city</option>
                      <option ${m.sys_field==='state'?'selected':''}>state</option>
                      <option ${m.sys_field==='zip_code'?'selected':''}>zip_code</option>
                      <option ${m.sys_field==='custom_1'?'selected':''}>custom_1</option>
                      <option value="">— Skip —</option>
                    </select>
                  </td>
                  <td>
                    <div class="confidence-bar">
                      <div class="progress-bar" style="width:80px">
                        <div class="progress-fill ${m.confidence > 90 ? '' : m.confidence > 80 ? 'blue' : 'amber'}" style="width:${m.confidence}%"></div>
                      </div>
                      <span class="confidence-val">${m.confidence}%</span>
                      ${m.confidence > 90 ? `<span style="color:var(--color-green-600)">${icons.check}</span>` : ''}
                    </div>
                  </td>
                  <td>
                    ${m.locked ? `<span class="badge badge-success" style="font-size:10px">${icons.lock} Confirmed</span>` :
                      `<button class="btn btn-sm btn-ghost" onclick="this.innerHTML='${icons.check} Confirmed';this.className='btn btn-sm btn-success';this.disabled=true">Confirm</button>`}
                  </td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>`,

      3: `
        <div class="validation-summary">
          <div class="val-stat success"><div class="val-stat-num">${imp.valid.toLocaleString()}</div><div class="val-stat-label">Valid Records</div></div>
          <div class="val-stat warning"><div class="val-stat-num">${imp.duplicates}</div><div class="val-stat-label">Duplicates</div></div>
          <div class="val-stat error"><div class="val-stat-num">${imp.invalid_phones}</div><div class="val-stat-label">Invalid Phones</div></div>
          <div class="val-stat error"><div class="val-stat-num">${imp.missing_fields}</div><div class="val-stat-label">Missing Fields</div></div>
        </div>
        <div style="margin-bottom:var(--space-3);display:flex;align-items:center;justify-content:space-between">
          <span class="fw-semibold">Validation Errors <span style="background:var(--color-red-50);color:var(--color-red-600);padding:2px 8px;border-radius:20px;font-size:12px;margin-left:8px">${imp.errors.length}</span></span>
          <button class="btn btn-ghost btn-sm">${icons.download} Export Errors</button>
        </div>
        <div class="table-container">
          <table class="data-table">
            <thead><tr><th>Row</th><th>Error Type</th><th>Field</th><th>Value</th><th>Reason</th></tr></thead>
            <tbody>
              ${imp.errors.map(e => `
                <tr>
                  <td style="font-family:var(--font-mono);font-size:12px">#${e.row}</td>
                  <td><span class="badge ${e.type === 'Duplicate' ? 'badge-warning' : 'badge-error'}">${e.type}</span></td>
                  <td style="font-size:12px;font-weight:600">${e.field}</td>
                  <td style="font-family:var(--font-mono);font-size:11px;color:var(--text-tertiary)">${e.value || '(empty)'}</td>
                  <td style="font-size:12px;color:var(--text-secondary)">${e.message}</td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
        <div style="margin-top:var(--space-4);padding:var(--space-3) var(--space-4);background:var(--color-blue-50);border:1px solid var(--color-blue-200);border-radius:var(--radius-md);font-size:13px;color:var(--color-blue-700)">
          ${icons.info_circle} <strong>${imp.valid.toLocaleString()}</strong> valid records will be imported. Duplicates will be skipped. Invalid records will be excluded.
        </div>`,

      4: `
        <div class="import-success-state">
          <div class="import-success-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div style="font-size:28px;font-weight:800;color:var(--text-primary);margin-bottom:var(--space-2)">${imp.valid.toLocaleString()} contacts imported</div>
          <div style="font-size:15px;color:var(--text-secondary);margin-bottom:var(--space-6)">Successfully added to Demo Campaign — Texas District</div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-4);max-width:500px;margin:0 auto var(--space-8)">
            <div style="background:var(--color-green-50);border:1px solid var(--color-green-200);border-radius:var(--radius-lg);padding:var(--space-4);text-align:center">
              <div style="font-size:24px;font-weight:800;color:var(--color-green-600)">${imp.valid.toLocaleString()}</div>
              <div style="font-size:12px;color:var(--color-green-700);margin-top:4px">Imported</div>
            </div>
            <div style="background:var(--color-amber-50);border:1px solid var(--color-amber-200);border-radius:var(--radius-lg);padding:var(--space-4);text-align:center">
              <div style="font-size:24px;font-weight:800;color:var(--color-amber-600)">${imp.duplicates}</div>
              <div style="font-size:12px;color:var(--color-amber-700);margin-top:4px">Skipped</div>
            </div>
            <div style="background:var(--color-red-50);border:1px solid var(--color-red-200);border-radius:var(--radius-lg);padding:var(--space-4);text-align:center">
              <div style="font-size:24px;font-weight:800;color:var(--color-red-600)">${imp.invalid_phones + imp.missing_fields}</div>
              <div style="font-size:12px;color:var(--color-red-700);margin-top:4px">Excluded</div>
            </div>
          </div>
          <div style="display:flex;gap:var(--space-3);justify-content:center">
            <button class="btn btn-secondary" data-nav="contacts">${icons.users} View Contacts</button>
            <button class="btn btn-primary" data-nav="campaigns">${icons.megaphone} Assign to Campaign</button>
          </div>
        </div>`,
    };

    const footerBtns = {
      1: `<div></div><button class="btn btn-primary" id="csv-next-btn" disabled>Continue to Mapping ${icons.arrow_right}</button>`,
      2: `<button class="btn btn-secondary" data-import-step="1">${icons.arrow_left} Back</button><button class="btn btn-primary" id="csv-next-btn">Validate Records ${icons.arrow_right}</button>`,
      3: `<button class="btn btn-secondary" data-import-step="2">${icons.arrow_left} Back</button><button class="btn btn-primary" id="csv-import-start">Import ${imp.valid.toLocaleString()} Contacts</button>`,
      4: ``,
    };

    return `
    <div class="page-wrapper">
      <div class="page-header">
        <div>
          <h1 class="page-title">Import Contacts</h1>
          <p class="page-subtitle">Upload a CSV to add contacts in bulk</p>
        </div>
      </div>
      <div class="import-container animate-fade-in-up">
        ${stepIndicator}
        <div class="card">
          <div class="card-body">${stepContent[step]}</div>
          ${step < 4 ? `<div class="card-footer" style="display:flex;justify-content:space-between;align-items:center">${footerBtns[step]}</div>` : ''}
        </div>
      </div>
    </div>`;
  },

  _initCsvImportEvents(step) {
    const goTo = (n) => App.navigate('csv-import', { step: n });

    document.getElementById('csv-next-btn')?.addEventListener('click', () => goTo(step + 1));
    document.getElementById('csv-import-start')?.addEventListener('click', () => {
      const btn = document.getElementById('csv-import-start');
      btn.classList.add('loading');
      btn.innerHTML = '<span class="btn-text">Importing…</span>';
      setTimeout(() => { App.navigate('csv-import', { step: 4 }); Toast.success('Import Complete', `${AppData.csv_import.valid.toLocaleString()} contacts imported successfully.`); }, 1800);
    });
    document.querySelectorAll('[data-import-step]').forEach(el => el.addEventListener('click', () => goTo(parseInt(el.dataset.importStep))));
    document.querySelectorAll('[data-nav]').forEach(el => el.addEventListener('click', () => App.navigate(el.dataset.nav)));

    if (step === 1) {
      const dz = document.getElementById('dropzone');
      document.getElementById('browse-btn')?.addEventListener('click', () => simulateFileUpload());
      if (dz) {
        dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('dragover'); });
        dz.addEventListener('dragleave', () => dz.classList.remove('dragover'));
        dz.addEventListener('drop', e => { e.preventDefault(); dz.classList.remove('dragover'); simulateFileUpload(); });
      }
    }

    function simulateFileUpload() {
      const dz = document.getElementById('dropzone');
      if (!dz) return;
      dz.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;gap:var(--space-3)">
          <div style="width:48px;height:48px;border-radius:50%;background:var(--color-teal-50);display:flex;align-items:center;justify-content:center;color:var(--color-teal-600)">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 1s linear infinite"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
          </div>
          <div style="font-weight:600">Uploading texas_voters.csv…</div>
        </div>`;
      setTimeout(() => {
        dz.innerHTML = `
          <div style="display:flex;flex-direction:column;align-items:center;gap:var(--space-3)">
            <div style="width:48px;height:48px;border-radius:50%;background:var(--color-green-50);display:flex;align-items:center;justify-content:center;color:var(--color-green-600)">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div style="font-weight:600">texas_voters.csv uploaded</div>
            <div style="font-size:13px;color:var(--text-tertiary)">10,482 rows detected</div>
          </div>`;
        document.getElementById('csv-next-btn').disabled = false;
      }, 1500);
    }

    if (step === 2) {
      document.getElementById('accept-all-btn')?.addEventListener('click', function() {
        document.querySelectorAll('[id^="mapping-"]').forEach(() => {});
        Toast.success('All Mappings Confirmed', 'You can proceed to validation.');
        this.innerHTML = `${icons.check} All Confirmed`;
        this.className = 'btn btn-success btn-sm';
        this.disabled = true;
      });
    }
  },

  // ── SCREEN 4: CAMPAIGNS ───────────────────────────────────
  campaigns() {
    return `
    <div class="page-wrapper">
      <div class="page-header">
        <div>
          <h1 class="page-title">Campaigns</h1>
          <p class="page-subtitle">${AppData.campaigns.length} campaigns · 4 active</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-secondary btn-sm">${icons.filter} Filter</button>
          <button class="btn btn-primary" id="create-campaign-btn">${icons.plus} Create Campaign</button>
        </div>
      </div>

      <div class="tabs" style="margin-bottom:var(--space-4)">
        ${['All','Active','Ready','Draft','Paused','Completed'].map((s,i) => `<div class="tab-item ${i===0?'active':''}" style="cursor:pointer">${s}${i===0?' <span class="tab-count">'+AppData.campaigns.length+'</span>':''}</div>`).join('')}
      </div>

      <div class="table-container animate-fade-in-up">
        <div class="table-scroll">
          <table class="data-table">
            <thead><tr>
              <th>Campaign</th><th>Contacts</th><th>Assigned</th><th>Sent</th>
              <th>Delivered</th><th>Replies</th><th>Progress</th><th>Status</th>
              <th>Created</th><th></th>
            </tr></thead>
            <tbody>
              ${AppData.campaigns.map(c => `
                <tr class="clickable" data-campaign-id="${c.id}">
                  <td>
                    <div style="font-weight:600;font-size:13px">${c.name}</div>
                    <div style="font-size:11px;color:var(--text-tertiary);margin-top:2px">${c.texters.join(', ')}</div>
                  </td>
                  <td>${c.contacts.toLocaleString()}</td>
                  <td>${c.assigned.toLocaleString()}</td>
                  <td>${c.sent.toLocaleString()}</td>
                  <td>${c.delivered.toLocaleString()}</td>
                  <td>${c.replies}</td>
                  <td style="min-width:140px">${progressBar(c.progress)}</td>
                  <td>${statusBadge(c.status)}</td>
                  <td style="font-size:12px;color:var(--text-tertiary);white-space:nowrap">${c.created}</td>
                  <td>
                    <div style="display:flex;gap:4px">
                      ${c.status === 'active' ? `<button class="btn btn-icon btn-ghost btn-sm" data-tooltip="Pause" onclick="event.stopPropagation();Toast.warning('Campaign Paused','${c.name} has been paused.')">${icons.pause}</button>` : ''}
                      ${c.status === 'paused' ? `<button class="btn btn-icon btn-ghost btn-sm" data-tooltip="Resume" onclick="event.stopPropagation();Toast.success('Campaign Resumed','${c.name} is now active.')">${icons.play}</button>` : ''}
                      <button class="btn btn-icon btn-ghost btn-sm" data-tooltip="Edit" onclick="event.stopPropagation()">${icons.edit}</button>
                      <button class="btn btn-icon btn-ghost btn-sm" data-tooltip="More" onclick="event.stopPropagation()">${icons.dots}</button>
                    </div>
                  </td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
        <div class="table-footer">
          <span class="table-count">Showing all ${AppData.campaigns.length} campaigns</span>
          <div class="pagination">
            <button class="page-btn active">1</button>
          </div>
        </div>
      </div>
    </div>`;
  },

  _initCampaignsEvents() {
    document.getElementById('create-campaign-btn')?.addEventListener('click', () => App.navigate('create-campaign'));
    document.querySelectorAll('[data-campaign-id]').forEach(row => {
      row.addEventListener('click', (e) => {
        if (e.target.closest('button')) return;
        App.navigate('campaign-detail', { id: parseInt(row.dataset.campaignId) });
      });
    });
    document.querySelectorAll('.tab-item').forEach(t => {
      t.addEventListener('click', () => { document.querySelectorAll('.tab-item').forEach(x => x.classList.remove('active')); t.classList.add('active'); });
    });
  },

  // ── SCREEN 4B: CAMPAIGN DETAIL ────────────────────────────
  campaignDetail(id) {
    const c = AppData.campaigns.find(x => x.id === id) || AppData.campaigns[0];
    return `
    <div class="page-wrapper">
      <div class="campaign-detail-header animate-fade-in-up">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:var(--space-5)">
          <div>
            <div style="display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-2)">
              ${statusBadge(c.status)}
              <span class="text-xs text-tertiary">Created ${c.created}</span>
            </div>
            <h1 class="page-title">${c.name}</h1>
            <p class="page-subtitle">${c.description}</p>
          </div>
          <div style="display:flex;gap:var(--space-2)">
            ${c.status === 'active' ? `<button class="btn btn-secondary" onclick="Toast.warning('Campaign Paused','${c.name} has been paused.')">${icons.pause} Pause</button>` : ''}
            ${c.status === 'paused' ? `<button class="btn btn-primary" onclick="Toast.success('Campaign Resumed','')">${icons.play} Resume</button>` : ''}
            ${c.status === 'ready' ? `<button class="btn btn-primary" onclick="Toast.success('Campaign Launched','${c.name} is now live!')">${icons.rocket} Launch</button>` : ''}
            <button class="btn btn-secondary">${icons.edit} Edit</button>
          </div>
        </div>
        <div class="campaign-kpi-row">
          ${[
            { label: 'Total Contacts', value: c.contacts.toLocaleString() },
            { label: 'Messages Sent', value: c.sent.toLocaleString() },
            { label: 'Delivered', value: c.delivered.toLocaleString() },
            { label: 'Delivery Rate', value: c.delivery_rate > 0 ? c.delivery_rate + '%' : '—' },
            { label: 'Replies', value: c.replies },
          ].map(k => `
            <div style="text-align:center;padding:var(--space-3);border-right:1px solid var(--border-default);last-child:border-right:0">
              <div style="font-size:26px;font-weight:800;color:var(--text-primary)">${k.value}</div>
              <div style="font-size:12px;color:var(--text-secondary);margin-top:4px">${k.label}</div>
            </div>`).join('')}
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 280px;gap:var(--space-5)">
        <div class="chart-card animate-fade-in-up">
          <div class="chart-header"><div class="chart-title">Message Volume</div></div>
          <div class="chart-body"><div style="height:220px"><canvas id="campaign-chart"></canvas></div></div>
        </div>
        <div class="card animate-fade-in-up">
          <div class="card-header"><div class="card-title">Campaign Details</div></div>
          <div class="card-body">
            ${[
              ['Template', c.template],
              ['Sending #', c.sending_number],
              ['Texters', c.texters.join(', ')],
              ['Progress', c.progress + '%'],
            ].map(([k,v]) => `
              <div class="info-row">
                <div class="info-row-label">${k}</div>
                <div class="info-row-value">${v}</div>
              </div>`).join('')}
          </div>
        </div>
      </div>
    </div>`;
  },

  _initCampaignDetailCharts() {
    const d = AppData.analytics;
    setTimeout(() => {
      Charts.bar('campaign-chart', d.weekly_labels, [
        { label: 'Sent',      data: d.sent,      backgroundColor: 'rgba(13,148,136,0.8)' },
        { label: 'Delivered', data: d.delivered, backgroundColor: 'rgba(59,130,246,0.8)' },
        { label: 'Replies',   data: d.replies,   backgroundColor: 'rgba(34,197,94,0.8)' },
      ], { scales: { x: { stacked: false }, y: { stacked: false } } });
    }, 50);
  },

  // ── SCREEN 5: CREATE CAMPAIGN ─────────────────────────────
  createCampaign(step = 1) {
    const steps = ['Details', 'Contacts', 'Template', 'Texters', 'Review'];
    App.state.newCampaign = App.state.newCampaign || {
      name: 'Election Reminder — Austin District',
      contacts: 'Austin Voters',
      template: 'Election Reminder',
      texters: ['Mike Torres', 'Sarah Lee', 'John Martinez'],
      number: '+1 (512) 555-0182',
    };
    const nc = App.state.newCampaign;

    const stepIndicator = `
      <div class="step-indicator">
        ${steps.map((s, i) => {
          const n = i + 1;
          const cls = n < step ? 'done' : n === step ? 'active' : 'pending';
          return `<div class="step-item ${cls}"><div class="step-circle">${n < step ? icons.check : n}</div><span class="step-label">${s}</span>${i < steps.length - 1 ? '<div class="step-line"></div>' : ''}</div>`;
        }).join('')}
      </div>`;

    const previewCard = `
      <div class="campaign-preview-card">
        <div class="campaign-preview-label">Live Preview</div>
        <div class="preview-sender" style="color:rgba(255,255,255,0.5);margin-bottom:var(--space-2)">From ${nc.number}</div>
        <div class="preview-phone">
          <div style="font-size:11px;color:#94a3b8;margin-bottom:var(--space-2)">${nc.name || 'Campaign Name'}</div>
          <div class="preview-bubble">
            ${nc.template === 'Election Reminder' ?
              'Hi <span style="background:rgba(13,148,136,0.15);color:#0d9488;padding:1px 4px;border-radius:3px">Sarah</span>, this is <span style="background:rgba(13,148,136,0.15);color:#0d9488;padding:1px 4px;border-radius:3px">Mike</span> with <span style="background:rgba(13,148,136,0.15);color:#0d9488;padding:1px 4px;border-radius:3px">ABC Campaign</span>. Are you planning to vote this Tuesday? Polls open 7am–7pm. Text STOP to opt out.' :
              'Hi <span style="background:rgba(13,148,136,0.15);color:#0d9488;padding:1px 4px;border-radius:3px">{{first_name}}</span>, this is <span style="background:rgba(13,148,136,0.15);color:#0d9488;padding:1px 4px;border-radius:3px">{{texter_name}}</span> with <span style="background:rgba(13,148,136,0.15);color:#0d9488;padding:1px 4px;border-radius:3px">ABC Campaign</span>. Text STOP to opt out.'}
          </div>
        </div>
        <div style="margin-top:var(--space-4);display:flex;flex-direction:column;gap:var(--space-2)">
          ${[
            ['Contacts', nc.contacts || '—', '#3b82f6'],
            ['Texters', nc.texters.length + ' assigned', '#0d9488'],
            ['Est. Queue', nc.texters.length > 0 ? Math.floor(3842 / nc.texters.length) + '/texter' : '—', '#a855f7'],
          ].map(([k,v,c]) => `
            <div style="display:flex;justify-content:space-between;align-items:center">
              <span style="font-size:12px;color:rgba(255,255,255,0.5)">${k}</span>
              <span style="font-size:12px;font-weight:600;color:${c}">${v}</span>
            </div>`).join('')}
        </div>
      </div>`;

    const stepContent = {
      1: `
        <div style="display:grid;gap:var(--space-5)">
          <div class="form-group">
            <label class="form-label">Campaign Name <span class="required">*</span></label>
            <input class="input" value="${nc.name}" id="cc-name" placeholder="e.g. Election Reminder — Austin District">
          </div>
          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea class="textarea" placeholder="Brief description of this campaign's goal…">GOTV outreach to registered voters in Austin Central and East districts.</textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Sending Phone Number <span class="required">*</span></label>
            <select class="select" id="cc-number">
              <option selected>+1 (512) 555-0182 — Austin Main</option>
              <option>+1 (713) 555-0293 — Houston Main</option>
              <option>+1 (214) 555-0184 — Dallas Main</option>
            </select>
          </div>
        </div>`,
      2: `
        <div style="display:grid;gap:var(--space-5)">
          <div class="form-group">
            <label class="form-label">Contact List <span class="required">*</span></label>
            <select class="select" id="cc-contacts">
              <option selected>Austin Voters (3,842 contacts)</option>
              <option>Houston South (2,910 contacts)</option>
              <option>Dallas Volunteers (1,200 contacts)</option>
              <option>San Antonio Survey (980 contacts)</option>
              <option>All Texas Contacts (12,482 contacts)</option>
            </select>
          </div>
          <div style="background:var(--color-teal-50);border:1px solid var(--color-teal-200);border-radius:var(--radius-lg);padding:var(--space-4)">
            <div style="font-weight:600;margin-bottom:var(--space-2)">Austin Voters</div>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-3)">
              ${[['3,842','Total'],['3,200','Without Texter'],['642','Already Assigned']].map(([v,l]) => `
                <div><div style="font-size:20px;font-weight:800;color:var(--text-primary)">${v}</div><div style="font-size:11px;color:var(--text-tertiary)">${l}</div></div>`).join('')}
            </div>
          </div>
          <div>
            <label class="form-label" style="margin-bottom:var(--space-3)">Add Filters</label>
            <div style="display:flex;gap:var(--space-2);flex-wrap:wrap">
              <button class="btn btn-secondary btn-sm">${icons.plus} City</button>
              <button class="btn btn-secondary btn-sm">${icons.plus} Status</button>
              <button class="btn btn-secondary btn-sm">${icons.plus} Tags</button>
            </div>
          </div>
        </div>`,
      3: `
        <div style="display:grid;gap:var(--space-4)">
          <div class="form-group">
            <label class="form-label">Message Template <span class="required">*</span></label>
            <select class="select" id="cc-template">
              ${AppData.templates.map(t => `<option ${t.name==='Election Reminder'?'selected':''}>${t.name}</option>`).join('')}
            </select>
          </div>
          <div style="background:var(--color-gray-50);border:1px solid var(--border-default);border-radius:var(--radius-lg);padding:var(--space-4)">
            <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:var(--text-tertiary);margin-bottom:var(--space-2)">Template Preview</div>
            <div style="font-size:13px;line-height:1.6;color:var(--text-primary)">${AppData.templates[0].body.replace(/\{\{(\w+)\}\}/g, '<span style="background:rgba(13,148,136,0.1);color:#0d9488;padding:1px 5px;border-radius:3px;font-size:12px">$1</span>')}</div>
            <div style="margin-top:var(--space-2);font-size:11px;color:var(--text-tertiary)">${AppData.templates[0].char_count} characters · 1 SMS segment</div>
          </div>
          <div>
            <label class="form-label" style="margin-bottom:var(--space-2)">Optional MMS Attachment</label>
            <div style="border:2px dashed var(--border-strong);border-radius:var(--radius-lg);padding:var(--space-5);text-align:center;color:var(--text-tertiary);font-size:13px;cursor:pointer">
              ${icons.image} Drag image here or click to browse
            </div>
          </div>
        </div>`,
      4: `
        <div style="display:grid;gap:var(--space-4)">
          <div class="form-group">
            <label class="form-label" style="margin-bottom:var(--space-3)">Assigned Texters</label>
            <div style="display:flex;flex-direction:column;gap:var(--space-2)">
              ${AppData.team.filter(m => m.role === 'texter').map(m => `
                <label style="display:flex;align-items:center;gap:var(--space-3);padding:var(--space-3);border:1px solid var(--border-default);border-radius:var(--radius-md);cursor:pointer;transition:background 150ms" class="checkbox-wrapper">
                  <input type="checkbox" ${nc.texters.includes(m.name)?'checked':''} class="texter-cb" data-name="${m.name}">
                  <div class="avatar avatar-sm avatar-${m.color}">${m.initials}</div>
                  <div style="flex:1">
                    <div style="font-weight:600;font-size:13px">${m.name}</div>
                    <div style="font-size:11px;color:var(--text-tertiary)">${m.campaigns} active campaigns</div>
                  </div>
                  <span class="badge badge-active">Available</span>
                </label>`).join('')}
            </div>
          </div>
          <div style="background:var(--color-blue-50);border:1px solid var(--color-blue-200);border-radius:var(--radius-md);padding:var(--space-3) var(--space-4);font-size:12px;color:var(--color-blue-700)">
            ${icons.info_circle} With ${nc.texters.length} texters and 3,842 contacts, each texter will handle ~${Math.floor(3842/nc.texters.length)} conversations.
          </div>
        </div>`,
      5: `
        <div style="display:flex;flex-direction:column;gap:var(--space-5)">
          <div style="background:var(--color-green-50);border:1px solid var(--color-green-200);border-radius:var(--radius-lg);padding:var(--space-4);display:flex;align-items:center;gap:var(--space-3)">
            <div style="width:40px;height:40px;background:var(--color-green-100);border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--color-green-600);flex-shrink:0">${icons.check}</div>
            <div>
              <div style="font-weight:700;color:var(--color-green-800)">Ready to Launch</div>
              <div style="font-size:13px;color:var(--color-green-700)">All required fields are complete. Review your configuration below.</div>
            </div>
          </div>
          ${[
            ['Campaign Name', nc.name],
            ['Contact List', 'Austin Voters · 3,842 contacts'],
            ['Template', nc.template + ' · 158 characters'],
            ['Texters', nc.texters.join(', ')],
            ['Estimated Queue', '~1,281 contacts/texter'],
            ['Sending Number', nc.number],
            ['MMS Attachment', 'None'],
          ].map(([k,v]) => `
            <div class="info-row">
              <div class="info-row-label">${k}</div>
              <div class="info-row-value">${v}</div>
            </div>`).join('')}
        </div>`,
    };

    return `
    <div class="page-wrapper">
      <div class="page-header">
        <div>
          <h1 class="page-title">${step < 5 ? 'Create Campaign' : 'Review & Launch'}</h1>
          <p class="page-subtitle">Set up a new P2P texting campaign</p>
        </div>
      </div>
      <div class="animate-fade-in-up">
        ${stepIndicator}
        <div class="create-campaign-layout">
          <div class="card">
            <div class="card-body">${stepContent[step]}</div>
            <div class="card-footer" style="display:flex;justify-content:space-between;align-items:center">
              ${step > 1 ? `<button class="btn btn-secondary" id="cc-back">← Back</button>` : '<div></div>'}
              <div style="display:flex;gap:var(--space-2)">
                <button class="btn btn-secondary" id="cc-save-draft">Save Draft</button>
                ${step < 5 ? `<button class="btn btn-primary" id="cc-next">Continue ${icons.arrow_right}</button>` :
                  `<button class="btn btn-primary btn-lg" id="cc-launch">${icons.rocket} Launch Campaign</button>`}
              </div>
            </div>
          </div>
          ${previewCard}
        </div>
      </div>
    </div>`;
  },

  _initCreateCampaignEvents(step) {
    const goTo = (n) => App.navigate('create-campaign', { step: n });
    document.getElementById('cc-next')?.addEventListener('click', () => goTo(step + 1));
    document.getElementById('cc-back')?.addEventListener('click', () => goTo(step - 1));
    document.getElementById('cc-save-draft')?.addEventListener('click', () => Toast.info('Draft Saved', 'Campaign saved as draft.'));
    document.getElementById('cc-launch')?.addEventListener('click', () => {
      showConfirm({
        title: 'Launch Campaign',
        message: 'This will immediately begin assigning contacts to texters. Are you sure you want to launch <strong>Election Reminder — Austin District</strong>?',
        confirmText: 'Launch Now',
        danger: false,
        onConfirm: () => {
          App.state.newCampaign = null;
          App.navigate('campaigns');
          setTimeout(() => Toast.success('Campaign Launched 🚀', 'Election Reminder — Austin District is now live.'), 200);
        },
      });
    });
  },

  // ── SCREEN 6: TEMPLATES ───────────────────────────────────
  templates() {
    return `
    <div class="page-wrapper">
      <div class="page-header">
        <div>
          <h1 class="page-title">Message Templates</h1>
          <p class="page-subtitle">${AppData.templates.length} templates</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-primary" id="new-template-btn">${icons.plus} New Template</button>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-4);margin-bottom:var(--space-6)">
        ${AppData.templates.map(t => `
          <div class="card" style="cursor:pointer;transition:all 200ms" onmouseenter="this.style.boxShadow='var(--shadow-card-hover)';this.style.transform='translateY(-1px)'" onmouseleave="this.style.boxShadow='';this.style.transform=''" onclick="Screens.showTemplateEditor(${t.id})">
            <div class="card-body">
              <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:var(--space-3)">
                <div>
                  <div style="font-weight:700;margin-bottom:4px">${t.name}</div>
                  <div style="font-size:11px;color:var(--text-tertiary)">Used in ${t.campaigns_using} campaign${t.campaigns_using !== 1 ? 's' : ''}</div>
                </div>
                ${statusBadge(t.status)}
              </div>
              <div style="font-size:12px;color:var(--text-secondary);line-height:1.6;background:var(--color-gray-50);border:1px solid var(--border-default);border-radius:var(--radius-md);padding:var(--space-3);margin-bottom:var(--space-3)">
                ${t.body.length > 120 ? t.body.substring(0, 120) + '…' : t.body}
              </div>
              <div style="display:flex;align-items:center;justify-content:space-between">
                <span style="font-size:11px;color:var(--text-tertiary)">${t.char_count} chars · ${t.has_mms ? 'MMS' : 'SMS'}</span>
                <span style="font-size:11px;color:var(--text-tertiary)">Updated ${t.last_updated}</span>
              </div>
            </div>
          </div>`).join('')}
      </div>
    </div>`;
  },

  showTemplateEditor(id) {
    const t = AppData.templates.find(x => x.id === id) || AppData.templates[0];
    Modal.show({
      title: 'Edit Template',
      subtitle: t.name,
      size: 'xl',
      body: `
        <div class="template-editor-layout">
          <div>
            <div class="form-group" style="margin-bottom:var(--space-4)">
              <label class="form-label">Template Name</label>
              <input class="input" value="${t.name}">
            </div>
            <div class="form-group" style="margin-bottom:var(--space-3)">
              <label class="form-label">Message Body</label>
              <textarea class="textarea" id="template-body" style="min-height:120px">${t.body}</textarea>
              <div class="char-counter" id="char-count">${t.body.length} / 160 chars (1 SMS)</div>
            </div>
            <div style="margin-bottom:var(--space-4)">
              <div class="form-label" style="margin-bottom:var(--space-2)">Merge Fields</div>
              <div style="display:flex;flex-wrap:wrap;gap:var(--space-2)">
                ${['first_name','last_name','texter_name','organization','city','state'].map(f => `
                  <button class="merge-field-btn" data-field="{{${f}}}">{${f}}</button>`).join('')}
              </div>
            </div>
          </div>
          <div>
            <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:var(--text-tertiary);margin-bottom:var(--space-3)">Preview</div>
            <div class="preview-phone" style="border-radius:16px;padding:var(--space-4);background:var(--color-gray-50);border:1px solid var(--border-default)">
              <div class="preview-bubble" id="template-preview">${t.body}</div>
            </div>
          </div>
        </div>`,
      footer: `
        <button class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
        <button class="btn btn-primary" onclick="Modal.close();Toast.success('Template Saved','Changes saved successfully.')">${icons.check} Save Template</button>`,
    });
    const textarea = document.getElementById('template-body');
    const preview  = document.getElementById('template-preview');
    const counter  = document.getElementById('char-count');
    if (textarea) {
      textarea.addEventListener('input', () => {
        const len = textarea.value.length;
        counter.textContent = `${len} / 160 chars (${Math.ceil(len/160)} SMS)`;
        counter.className = `char-counter ${len > 160 ? 'over' : len > 140 ? 'warning' : ''}`;
        if (preview) preview.textContent = textarea.value;
      });
    }
    document.querySelectorAll('.merge-field-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!textarea) return;
        const pos = textarea.selectionStart;
        const text = textarea.value;
        textarea.value = text.slice(0, pos) + btn.dataset.field + text.slice(pos);
        textarea.dispatchEvent(new Event('input'));
        textarea.focus();
        textarea.selectionStart = textarea.selectionEnd = pos + btn.dataset.field.length;
      });
    });
  },

  // ── SCREEN 7: TEXTER WORKSPACE ────────────────────────────
  texter() {
    const queue = AppData.texter_queue;
    const ci = App.state.texterIndex || 0;
    const contact = queue[ci % queue.length];
    const total = 1000;
    const done = 142 + ci * 7;
    App.state.texterSent = false;

    return `
    <div style="height:calc(100vh - var(--topbar-height));overflow:hidden">
      <div class="texter-workspace">
        <div class="texter-left">
          <div style="text-align:center;margin-bottom:var(--space-2)">
            <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:var(--text-tertiary);margin-bottom:var(--space-3)">Current Contact</div>
          </div>
          <div class="texter-contact-card">
            <div class="texter-contact-top">
              <div style="width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,var(--color-teal-500),var(--color-blue-500));display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:800;color:white;margin:0 auto">${avatarInitials(contact.contact.first + ' ' + contact.contact.last)}</div>
              <div class="texter-contact-name">${contact.contact.first} ${contact.contact.last}</div>
              <div class="texter-contact-loc">${contact.contact.city}, ${contact.contact.state}</div>
            </div>
            <div class="texter-contact-body">
              ${[
                ['Campaign', contact.contact.campaign],
                ['Phone',    contact.contact.phone],
                ['Status',   contact.contact.status],
              ].map(([k,v]) => `
                <div class="info-row" style="padding:var(--space-2) 0">
                  <div class="info-row-label">${k}</div>
                  <div class="info-row-value">${v}</div>
                </div>`).join('')}
            </div>
          </div>

          <div style="border-top:1px solid var(--border-default);padding-top:var(--space-4)">
            <div class="section-label">Tags & Notes</div>
            <div style="display:flex;flex-wrap:wrap;gap:var(--space-1);margin-bottom:var(--space-3)">
              <span class="tag tag-teal">Voter</span>
              <span class="tag">Austin</span>
              <button class="tag" style="cursor:pointer;border-style:dashed">+ Tag</button>
            </div>
            <textarea class="textarea" style="min-height:60px;font-size:12px" placeholder="Add note…"></textarea>
          </div>

          <div style="margin-top:auto">
            <button class="btn btn-danger-outline btn-sm w-full" id="opt-out-btn" style="width:100%">Mark Opt-Out</button>
          </div>
        </div>

        <div class="texter-right">
          <div class="texter-progress-bar-wrap">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-2)">
              <span class="fw-semibold">Progress</span>
              <span class="text-sm text-secondary"><strong>${done}</strong> / ${total} contacts</span>
            </div>
            ${progressBar(Math.floor(done/total*100))}
          </div>

          <div class="texter-stats">
            <div class="texter-stat"><div class="texter-stat-val" style="color:var(--color-gray-400)">${total - done}</div><div class="texter-stat-label">Pending</div></div>
            <div class="texter-stat"><div class="texter-stat-val" style="color:var(--color-blue-600)">${done}</div><div class="texter-stat-label">Sent</div></div>
            <div class="texter-stat"><div class="texter-stat-val" style="color:var(--color-green-600)">18</div><div class="texter-stat-label">Replied</div></div>
            <div class="texter-stat"><div class="texter-stat-val" style="color:var(--color-red-600)">3</div><div class="texter-stat-label">Opted Out</div></div>
          </div>

          <div class="texter-composer" id="texter-composer-wrap">
            <div style="padding:var(--space-3) var(--space-5);border-bottom:1px solid var(--border-default);display:flex;align-items:center;gap:var(--space-2)">
              <div class="avatar avatar-sm ${avatarColor(contact.contact.first+contact.contact.last)}">${avatarInitials(contact.contact.first+' '+contact.contact.last)}</div>
              <span class="fw-semibold">To: ${contact.contact.first} ${contact.contact.last}</span>
              <span style="font-size:12px;color:var(--text-tertiary)">· ${contact.contact.phone}</span>
            </div>
            <textarea class="texter-message-text" id="texter-msg" placeholder="Type your message…">${contact.message}</textarea>
            <div class="texter-composer-footer">
              <div style="display:flex;gap:var(--space-2)">
                <button class="btn btn-ghost btn-icon btn-sm" data-tooltip="Attach image">${icons.image}</button>
                <button class="btn btn-ghost btn-icon btn-sm" data-tooltip="Insert merge field">${icons.tag}</button>
              </div>
              <span class="char-counter" id="texter-char">${contact.message.length} chars</span>
            </div>
          </div>

          <div id="send-btn-area">
            <button class="send-btn" id="send-msg-btn">${icons.send} SEND MESSAGE</button>
          </div>

          <div id="sent-state" class="hidden">
            <div style="background:var(--color-green-50);border:1px solid var(--color-green-200);border-radius:var(--radius-lg);padding:var(--space-4);text-align:center;margin-bottom:var(--space-3)">
              <div style="width:40px;height:40px;background:var(--color-green-100);border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--color-green-600);margin:0 auto var(--space-2)">${icons.check}</div>
              <div style="font-weight:700;color:var(--color-green-800)">Message Sent!</div>
              <div style="font-size:12px;color:var(--color-green-600)">Delivered to ${contact.contact.first} ${contact.contact.last}</div>
            </div>
            <button class="next-contact-btn" id="next-contact-btn">${icons.arrow_right} NEXT CONTACT</button>
          </div>
        </div>
      </div>
    </div>`;
  },

  _initTexterEvents() {
    const msgEl = document.getElementById('texter-msg');
    const charEl = document.getElementById('texter-char');
    if (msgEl && charEl) {
      msgEl.addEventListener('input', () => { charEl.textContent = msgEl.value.length + ' chars'; });
    }

    document.getElementById('send-msg-btn')?.addEventListener('click', function() {
      this.classList.add('loading');
      this.innerHTML = '<span class="btn-text">Sending…</span>';
      setTimeout(() => {
        document.getElementById('send-btn-area').classList.add('hidden');
        document.getElementById('sent-state').classList.remove('hidden');
        if (document.getElementById('texter-composer-wrap')) {
          document.getElementById('texter-composer-wrap').style.opacity = '0.5';
          document.getElementById('texter-composer-wrap').style.pointerEvents = 'none';
        }
      }, 1000);
    });

    document.getElementById('next-contact-btn')?.addEventListener('click', () => {
      App.state.texterIndex = ((App.state.texterIndex || 0) + 1) % AppData.texter_queue.length;
      App.navigate('texter');
      Toast.success('Next Contact Loaded', '');
    });

    document.getElementById('opt-out-btn')?.addEventListener('click', () => {
      showConfirm({
        title: 'Mark as Opted Out',
        message: 'This will immediately remove this contact from all messaging queues.',
        confirmText: 'Mark Opt-Out',
        danger: true,
        onConfirm: () => { Toast.warning('Opted Out', 'Contact has been marked as opted out.'); App.state.texterIndex = ((App.state.texterIndex || 0) + 1) % AppData.texter_queue.length; App.navigate('texter'); },
      });
    });
  },

  // ── SCREEN 8: INBOX ───────────────────────────────────────
  inbox() {
    const activeConvId = App.state.activeConvId || 1;
    const activeConv = AppData.conversations.find(c => c.id === activeConvId) || AppData.conversations[0];
    const activeContact = AppData.contacts.find(c => c.id === activeConv.contact_id) || AppData.contacts[0];

    return `
    <div style="height:calc(100vh - var(--topbar-height));display:flex;overflow:hidden">
      <div class="inbox-sidebar">
        <div class="inbox-search" style="position:relative">
          <svg style="position:absolute;left:20px;top:50%;transform:translateY(-50%);color:var(--text-tertiary)" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input placeholder="Search conversations…" style="padding-left:36px">
        </div>
        <div class="inbox-tabs-bar">
          ${['All','Unread','Needs Reply'].map((t,i) => `<div class="tab-item ${i===0?'active':''}" style="font-size:12px;padding:8px 12px">${t}${i===1?' <span class="tab-count">3</span>':''}</div>`).join('')}
        </div>
        <div class="inbox-conv-list">
          ${AppData.conversations.map(conv => `
            <div class="conv-item ${conv.id === activeConvId ? 'active' : ''}" data-conv-id="${conv.id}">
              <div class="avatar avatar-${avatarColor(conv.contact)}">${avatarInitials(conv.contact)}</div>
              <div class="conv-item-content">
                <div class="conv-item-header">
                  <span class="conv-item-name">${conv.contact}</span>
                  <span class="conv-item-time">${conv.last_time}</span>
                </div>
                <div class="conv-item-preview">${conv.last_message}</div>
                <div class="conv-item-footer">
                  <span class="conv-item-campaign">${conv.campaign.split('—')[0].trim()}</span>
                  ${conv.unread > 0 ? `<span class="unread-badge">${conv.unread}</span>` : ''}
                </div>
              </div>
            </div>`).join('')}
        </div>
      </div>

      <div class="inbox-main">
        <div class="convo-header">
          <div class="avatar avatar-${avatarColor(activeConv.contact)}">${avatarInitials(activeConv.contact)}</div>
          <div style="flex:1">
            <div style="font-weight:700">${activeConv.contact}</div>
            <div style="font-size:12px;color:var(--text-tertiary)">${activeConv.phone} · ${activeConv.campaign}</div>
          </div>
          <div style="display:flex;gap:var(--space-2)">
            <button class="btn btn-secondary btn-sm">${icons.phone} Call</button>
            <button class="btn btn-ghost btn-icon btn-sm">${icons.dots}</button>
          </div>
        </div>
        <div class="convo-thread" id="convo-thread">
          ${activeConv.messages.map(m => `
            <div class="convo-msg-group ${m.dir === 'out' ? 'outbound' : 'inbound'}">
              <div class="convo-sender-label">${m.sender}</div>
              <div class="message-bubble ${m.dir === 'out' ? 'outbound' : 'inbound'}">${m.text}</div>
              <div class="message-time ${m.dir === 'in' ? 'inbound' : ''}">${m.time}</div>
            </div>`).join('')}
          <div id="thread-end"></div>
        </div>
        <div class="convo-composer">
          <div class="convo-composer-box">
            <textarea class="convo-input" id="inbox-reply-input" placeholder="Type a reply…"></textarea>
            <div class="convo-actions">
              <button class="btn btn-ghost btn-icon btn-sm" data-tooltip="Attach image">${icons.image}</button>
              <button class="btn btn-primary btn-icon" id="inbox-send-btn" data-tooltip="Send">${icons.send}</button>
            </div>
          </div>
          <div style="display:flex;align-items:center;justify-content:space-between;margin-top:var(--space-2)">
            <div style="display:flex;gap:var(--space-2)">
              <button class="btn btn-ghost btn-sm" style="font-size:12px">${icons.file} Templates</button>
              <button class="btn btn-ghost btn-sm" style="font-size:12px">${icons.tag} Merge Fields</button>
            </div>
            <span class="text-xs text-tertiary" id="inbox-char-count">0 / 160</span>
          </div>
        </div>
      </div>

      <div class="inbox-detail">
        <div class="inbox-contact-panel">
          <div class="inbox-contact-top">
            <div class="avatar avatar-lg avatar-${avatarColor(activeConv.contact)}" style="margin:0 auto var(--space-2)">${avatarInitials(activeConv.contact)}</div>
            <div style="font-weight:700;font-size:16px">${activeConv.contact}</div>
            <div style="font-size:12px;color:var(--text-tertiary)">${activeConv.phone}</div>
            <div style="margin-top:var(--space-2)">${statusBadge(activeContact.status)}</div>
          </div>

          <div style="margin-top:var(--space-4)">
            <div class="section-label">Contact Info</div>
            ${[
              ['Campaign', activeConv.campaign.split('—')[0].trim()],
              ['Texter', activeConv.texter],
              ['City', `${activeContact.city}, ${activeContact.state}`],
            ].map(([k,v]) => `
              <div class="info-row"><div class="info-row-label">${k}</div><div class="info-row-value">${v}</div></div>`).join('')}
          </div>

          <div class="convo-summary-box">
            <div class="convo-summary-label">AI Conversation Summary</div>
            <div class="convo-summary-text">${activeConv.messages.length > 3 ?
              `Contact has exchanged ${activeConv.messages.length} messages with ${activeConv.texter}. ${activeConv.unread > 0 ? 'Latest message requires a response.' : 'Conversation resolved.'}` :
              `Early-stage conversation with ${activeConv.contact.split(' ')[0]}. ${activeConv.unread > 0 ? 'Awaiting your reply.' : 'No response needed.'}`}
            </div>
          </div>

          <div style="margin-top:var(--space-4)">
            <div class="section-label">Tags</div>
            <div style="display:flex;flex-wrap:wrap;gap:var(--space-1)">
              ${activeContact.tags.map(t => `<span class="tag tag-teal">${t}</span>`).join('')}
              <button class="tag" style="cursor:pointer;border-style:dashed">+ Tag</button>
            </div>
          </div>

          <div style="margin-top:var(--space-4)">
            <div class="section-label">Quick Actions</div>
            <div style="display:flex;flex-direction:column;gap:var(--space-2)">
              <button class="btn btn-secondary btn-sm w-full" style="justify-content:flex-start;gap:var(--space-2)">${icons.users} View Full Profile</button>
              <button class="btn btn-danger-outline btn-sm w-full" style="justify-content:flex-start;gap:var(--space-2)" onclick="Toast.warning('Opted Out','Contact marked as opted out.')">${icons.x} Mark Opt-Out</button>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  },

  _initInboxEvents() {
    document.querySelectorAll('[data-conv-id]').forEach(item => {
      item.addEventListener('click', () => {
        App.state.activeConvId = parseInt(item.dataset.convId);
        App.navigate('inbox');
      });
    });

    const input = document.getElementById('inbox-reply-input');
    const counter = document.getElementById('inbox-char-count');
    if (input && counter) {
      input.addEventListener('input', () => {
        counter.textContent = `${input.value.length} / 160`;
      });
    }

    document.getElementById('inbox-send-btn')?.addEventListener('click', () => {
      const input = document.getElementById('inbox-reply-input');
      if (!input || !input.value.trim()) return;
      const text = input.value.trim();
      input.value = '';
      if (counter) counter.textContent = '0 / 160';
      const thread = document.getElementById('convo-thread');
      const newMsg = document.createElement('div');
      newMsg.className = 'convo-msg-group outbound animate-fade-in-up';
      const now = new Date();
      newMsg.innerHTML = `
        <div class="convo-sender-label">Alex Rivera</div>
        <div class="message-bubble outbound">${text}</div>
        <div class="message-time">${now.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</div>`;
      const endEl = document.getElementById('thread-end');
      if (endEl) thread.insertBefore(newMsg, endEl);
      thread.scrollTop = thread.scrollHeight;
      Toast.success('Message Sent', '');
    });
  },

  // ── SCREEN 9: ANALYTICS ───────────────────────────────────
  analytics() {
    const d = AppData.analytics;
    return `
    <div class="page-wrapper">
      <div class="page-header">
        <div>
          <h1 class="page-title">Analytics</h1>
          <p class="page-subtitle">Performance overview — Demo Campaign · Texas District</p>
        </div>
        <div class="page-actions">
          <select class="select" style="width:150px"><option>Last 7 days</option><option>Last 30 days</option><option>Custom range</option></select>
          <select class="select" style="width:180px"><option value="">All Campaigns</option>${AppData.campaigns.map(c=>`<option>${c.name}</option>`).join('')}</select>
          <button class="btn btn-secondary btn-sm">${icons.download} Export Report</button>
        </div>
      </div>

      <div class="analytics-kpi-grid">
        ${[
          { label: 'Messages Sent',   value: '8,642',  sub: 'Last 7 days',    color: 'teal',   icon: icons.send  },
          { label: 'Delivered',       value: '8,126',  sub: '94.1% rate',     color: 'green',  icon: icons.check },
          { label: 'Failed',          value: '516',    sub: '5.9% failure',   color: 'red',    icon: icons.x     },
          { label: 'Replies',         value: '517',    sub: '6.0% rate',      color: 'blue',   icon: icons.msg   },
          { label: 'Opt-Outs',        value: '48',     sub: '0.56% rate',     color: 'amber',  icon: icons.warning_tri },
          { label: 'Active Campaigns',value: '4',      sub: 'Texas District', color: 'purple', icon: icons.megaphone },
          { label: 'Active Texters',  value: '6',      sub: 'All campaigns',  color: 'teal',   icon: icons.team  },
          { label: 'Avg Response',    value: '4.2m',   sub: 'Time to reply',  color: 'blue',   icon: icons.msg   },
        ].map(k => `
          <div class="kpi-card animate-fade-in-up">
            <div class="kpi-icon ${k.color}">${k.icon}</div>
            <div class="kpi-card-label">${k.label}</div>
            <div class="kpi-card-value">${k.value}</div>
            <div style="font-size:11px;color:var(--text-tertiary);margin-top:4px">${k.sub}</div>
          </div>`).join('')}
      </div>

      <div class="analytics-charts-grid" style="margin-bottom:var(--space-5)">
        <div class="chart-card animate-fade-in-up">
          <div class="chart-header">
            <div><div class="chart-title">Message Volume Over Time</div><div class="chart-subtitle">Last 7 days</div></div>
          </div>
          <div class="chart-body"><div style="height:240px"><canvas id="analytics-volume-chart"></canvas></div>
          <div class="chart-legend">
            <div class="chart-legend-item"><div class="chart-legend-dot" style="background:#0d9488"></div>Sent</div>
            <div class="chart-legend-item"><div class="chart-legend-dot" style="background:#3b82f6"></div>Delivered</div>
            <div class="chart-legend-item"><div class="chart-legend-dot" style="background:#22c55e"></div>Replies</div>
            <div class="chart-legend-item"><div class="chart-legend-dot" style="background:#ef4444"></div>Failed</div>
          </div>
          </div>
        </div>
        <div class="chart-card animate-fade-in-up">
          <div class="chart-header"><div class="chart-title">Delivery Breakdown</div></div>
          <div class="chart-body">
            <div style="height:200px;display:flex;align-items:center;justify-content:center"><canvas id="analytics-delivery-chart"></canvas></div>
            <div style="display:flex;flex-direction:column;gap:var(--space-2);margin-top:var(--space-3)">
              ${[['Delivered','8,126','94.1%','#0d9488'],['Failed - Unreachable','227','2.6%','#ef4444'],['Failed - Carrier','160','1.9%','#f59e0b'],['Failed - Invalid','129','1.5%','#94a3b8']].map(([l,v,p,c]) => `
                <div style="display:flex;align-items:center;gap:var(--space-2)">
                  <div style="width:8px;height:8px;border-radius:50%;background:${c};flex-shrink:0"></div>
                  <span class="text-xs" style="flex:1;color:var(--text-secondary)">${l}</span>
                  <span class="text-xs fw-semibold">${v}</span>
                  <span class="text-xs text-tertiary" style="width:36px;text-align:right">${p}</span>
                </div>`).join('')}
            </div>
          </div>
        </div>
      </div>

      <div class="analytics-charts-grid-2" style="margin-bottom:var(--space-5)">
        <div class="chart-card animate-fade-in-up">
          <div class="chart-header"><div class="chart-title">Reply Rate by Campaign</div></div>
          <div class="chart-body"><div style="height:200px"><canvas id="analytics-reply-chart"></canvas></div></div>
        </div>
        <div class="chart-card animate-fade-in-up">
          <div class="chart-header"><div class="chart-title">Campaign Progress</div></div>
          <div class="chart-body" style="display:flex;flex-direction:column;gap:var(--space-4)">
            ${AppData.campaigns.map(c => `
              <div>
                <div style="display:flex;justify-content:space-between;margin-bottom:4px">
                  <span style="font-size:12px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:160px">${c.name.split('—')[0].trim()}</span>
                  <span style="font-size:12px;color:var(--text-tertiary)">${c.progress}%</span>
                </div>
                ${progressBar(c.progress, c.status === 'completed' ? 'green' : c.status === 'paused' ? 'amber' : '')}
              </div>`).join('')}
          </div>
        </div>
        <div class="chart-card animate-fade-in-up">
          <div class="chart-header"><div class="chart-title">Texter Activity</div></div>
          <div class="chart-body"><div style="height:200px"><canvas id="analytics-texter-chart"></canvas></div></div>
        </div>
      </div>

      <div class="ai-summary animate-fade-in-up">
        <div class="ai-summary-header">
          <div class="ai-badge">${icons.spark} AI Operations Summary</div>
          <span class="text-xs" style="color:rgba(255,255,255,0.4)">Updated just now</span>
        </div>
        <div class="ai-summary-title" style="margin-bottom:var(--space-3)">Weekly Performance Insights</div>
        <div class="ai-summary-text">
          Across all campaigns this week, <strong style="color:white">8,642 messages</strong> were sent with a <strong style="color:var(--color-teal-300)">94.1% delivery rate</strong> — above the platform average of 91.3%. The Election Reminder campaign is your top performer with an <strong style="color:white">8.3% reply rate</strong>.
          <br><br>
          Delivery failures are concentrated in Houston South, primarily from carrier-level filtering (31%). Consider reviewing message frequency for that segment. The Policy Survey shows the highest engagement at 26% reply rate, suggesting the survey format resonates well with San Antonio voters.
          <br><br>
          <strong style="color:var(--color-amber-300)">⚠ Attention:</strong> 48 opt-outs today vs. 23 last week — a 109% increase. GOTV — Houston South accounts for 60% of these. Consider pausing that campaign for 24 hours.
        </div>
        <div class="ai-summary-stats" style="grid-template-columns:repeat(5,1fr)">
          <div class="ai-stat"><div class="ai-stat-value" style="color:var(--color-teal-400)">94.1%</div><div class="ai-stat-label">Delivery</div></div>
          <div class="ai-stat"><div class="ai-stat-value" style="color:var(--color-green-400)">6.0%</div><div class="ai-stat-label">Reply Rate</div></div>
          <div class="ai-stat"><div class="ai-stat-value" style="color:var(--color-amber-400)">48</div><div class="ai-stat-label">Opt-Outs</div></div>
          <div class="ai-stat"><div class="ai-stat-value" style="color:var(--color-blue-400)">4.2m</div><div class="ai-stat-label">Avg Response</div></div>
          <div class="ai-stat"><div class="ai-stat-value" style="color:var(--color-purple-400)">4</div><div class="ai-stat-label">Active</div></div>
        </div>
      </div>
    </div>`;
  },

  _initAnalyticsCharts() {
    const d = AppData.analytics;
    setTimeout(() => {
      Charts.line('analytics-volume-chart', d.weekly_labels, [
        { label: 'Sent',      data: d.sent,      borderColor: '#0d9488', backgroundColor: 'rgba(13,148,136,0.08)', fill: true, tension: 0.4, pointRadius: 3, pointBackgroundColor: '#0d9488' },
        { label: 'Delivered', data: d.delivered, borderColor: '#3b82f6', fill: false, tension: 0.4, pointRadius: 3, pointBackgroundColor: '#3b82f6' },
        { label: 'Replies',   data: d.replies,   borderColor: '#22c55e', fill: false, tension: 0.4, pointRadius: 3, pointBackgroundColor: '#22c55e' },
        { label: 'Failed',    data: d.failed,    borderColor: '#ef4444', fill: false, tension: 0.4, borderDash: [4,3], pointRadius: 3, pointBackgroundColor: '#ef4444' },
      ]);
      Charts.doughnut('analytics-delivery-chart', ['Delivered','Unreachable','Carrier','Invalid'], [8126, 227, 160, 129], ['#0d9488','#ef4444','#f59e0b','#94a3b8']);
      Charts.bar('analytics-reply-chart',
        AppData.campaigns.slice(0,4).map(c => c.name.split('—')[0].trim()),
        [{ label: 'Reply Rate %', data: AppData.campaigns.slice(0,4).map(c => c.reply_rate), backgroundColor: ['#0d9488','#3b82f6','#a855f7','#f59e0b'] }],
      );
      Charts.bar('analytics-texter-chart',
        AppData.team.filter(m => m.role==='texter').map(m => m.name.split(' ')[0]),
        [{ label: 'Messages', data: [482, 398, 421, 312, 276, 340], backgroundColor: 'rgba(13,148,136,0.7)' }],
      );
    }, 50);
  },

  // ── SCREEN 10: TEAM ───────────────────────────────────────
  team() {
    return `
    <div class="page-wrapper">
      <div class="page-header">
        <div>
          <h1 class="page-title">Team</h1>
          <p class="page-subtitle">${AppData.team.length} members in ABC Campaign</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-primary" id="invite-btn">${icons.plus} Invite User</button>
        </div>
      </div>

      <div class="table-container animate-fade-in-up">
        <div class="table-scroll">
          <table class="data-table">
            <thead><tr><th>User</th><th>Role</th><th>Campaigns</th><th>Status</th><th>Last Active</th><th></th></tr></thead>
            <tbody>
              ${AppData.team.map(m => `
                <tr>
                  <td>
                    <div class="team-member-cell">
                      <div class="avatar avatar-${m.color}">${m.initials}</div>
                      <div>
                        <div class="team-member-name">${m.name}</div>
                        <div class="team-member-email">${m.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>${roleBadge(m.role)}</td>
                  <td>${m.campaigns}</td>
                  <td>${statusBadge(m.status)}</td>
                  <td style="font-size:12px;color:var(--text-tertiary)">${m.last_active}</td>
                  <td>
                    <div style="display:flex;gap:4px">
                      <button class="btn btn-ghost btn-sm btn-icon" data-tooltip="Edit role" onclick="Screens.showEditRoleModal('${m.name}','${m.role}')">${icons.edit}</button>
                      ${m.status === 'active' ? `<button class="btn btn-ghost btn-sm btn-icon text-danger" data-tooltip="Suspend" onclick="Toast.warning('User Suspended','${m.name} has been suspended.')">${icons.pause}</button>` : `<button class="btn btn-ghost btn-sm btn-icon" data-tooltip="Reactivate" onclick="Toast.success('User Reactivated','${m.name} is now active.')">${icons.play}</button>`}
                    </div>
                  </td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
        <div class="table-footer">
          <span class="table-count">Showing all ${AppData.team.length} members</span>
        </div>
      </div>
    </div>`;
  },

  showEditRoleModal(name, currentRole) {
    Modal.show({
      title: 'Edit Role',
      subtitle: name,
      body: `
        <div class="form-group">
          <label class="form-label">Role</label>
          <select class="select" id="role-select">
            <option ${currentRole==='admin'?'selected':''} value="admin">Organization Admin</option>
            <option ${currentRole==='manager'?'selected':''} value="manager">Campaign Manager</option>
            <option ${currentRole==='texter'?'selected':''} value="texter">Texter</option>
          </select>
        </div>
        <div style="margin-top:var(--space-3);padding:var(--space-3);background:var(--color-blue-50);border-radius:var(--radius-md);font-size:12px;color:var(--color-blue-700)">
          ${icons.info_circle} Role changes take effect immediately.
        </div>`,
      footer: `<button class="btn btn-secondary" onclick="Modal.close()">Cancel</button><button class="btn btn-primary" onclick="Modal.close();Toast.success('Role Updated','${name}\'s role has been updated.')">Save Changes</button>`,
    });
  },

  _initTeamEvents() {
    document.getElementById('invite-btn')?.addEventListener('click', () => {
      Modal.show({
        title: 'Invite Team Member',
        body: `
          <div style="display:grid;gap:var(--space-4)">
            <div class="form-group"><label class="form-label">Email Address <span class="required">*</span></label><input class="input" type="email" placeholder="name@organization.org" id="invite-email"></div>
            <div class="form-group"><label class="form-label">Role <span class="required">*</span></label>
              <select class="select"><option>Texter</option><option>Campaign Manager</option><option>Organization Admin</option></select>
            </div>
            <div class="form-group"><label class="form-label">Campaigns (optional)</label>
              <select class="select" multiple style="height:80px">${AppData.campaigns.map(c => `<option>${c.name}</option>`).join('')}</select>
            </div>
          </div>`,
        footer: `<button class="btn btn-secondary" onclick="Modal.close()">Cancel</button><button class="btn btn-primary" onclick="Modal.close();Toast.success('Invitation Sent','An email invitation has been sent.')">${icons.send} Send Invitation</button>`,
      });
    });
  },

  // ── SCREEN 11: ADMIN / PLATFORM ───────────────────────────
  admin() {
    const orgs = AppData.platform_orgs;
    return `
    <div class="page-wrapper">
      <div class="page-header">
        <div>
          <h1 class="page-title">Platform Administration</h1>
          <p class="page-subtitle">Manage all organizations and platform activity</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-primary" id="new-org-btn">${icons.plus} New Organization</button>
        </div>
      </div>

      <div class="admin-kpi-row">
        ${[
          { label: 'Organizations', value: '6', icon: icons.building, color: 'teal' },
          { label: 'Active Orgs',   value: '5', icon: icons.check,   color: 'green' },
          { label: 'Total Users',   value: '69', icon: icons.users,  color: 'blue' },
          { label: 'Messages (7d)', value: '415.3K', icon: icons.send, color: 'teal' },
          { label: 'Platform Health', value: '99.9%', icon: icons.shield, color: 'green' },
        ].map(k => `
          <div class="kpi-card animate-fade-in-up">
            <div class="kpi-icon ${k.color}">${k.icon}</div>
            <div class="kpi-card-label">${k.label}</div>
            <div class="kpi-card-value">${k.value}</div>
          </div>`).join('')}
      </div>

      <div class="table-container animate-fade-in-up">
        <div class="card-header">
          <div class="card-title">Organizations</div>
          <div class="search-input-wrap" style="width:220px">
            <svg class="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input placeholder="Search orgs…">
          </div>
        </div>
        <div class="table-scroll">
          <table class="data-table">
            <thead><tr><th>Organization</th><th>Admin</th><th>Users</th><th>Campaigns</th><th>Messages</th><th>Status</th><th>Created</th><th></th></tr></thead>
            <tbody>
              ${orgs.map(o => `
                <tr class="clickable">
                  <td>
                    <div style="display:flex;align-items:center;gap:var(--space-3)">
                      <div class="avatar avatar-sm ${avatarColor(o.name)}">${o.name.charAt(0)}</div>
                      <span class="fw-semibold">${o.name}</span>
                    </div>
                  </td>
                  <td style="font-size:13px">${o.admin}</td>
                  <td>${o.users}</td>
                  <td>${o.campaigns}</td>
                  <td>${o.messages.toLocaleString()}</td>
                  <td>${statusBadge(o.status)}</td>
                  <td style="font-size:12px;color:var(--text-tertiary)">${o.created}</td>
                  <td>
                    <button class="btn btn-ghost btn-icon btn-sm" data-tooltip="Manage">${icons.dots}</button>
                  </td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
        <div class="table-footer">
          <span class="table-count">Showing all ${orgs.length} organizations</span>
        </div>
      </div>
    </div>`;
  },

  _initAdminEvents() {
    document.getElementById('new-org-btn')?.addEventListener('click', () => {
      Modal.show({
        title: 'Create Organization',
        body: `
          <div style="display:grid;gap:var(--space-4)">
            <div class="form-group"><label class="form-label">Organization Name <span class="required">*</span></label><input class="input" placeholder="e.g. Texas Progressives"></div>
            <div class="form-group"><label class="form-label">Admin Email <span class="required">*</span></label><input class="input" type="email" placeholder="admin@organization.org"></div>
            <div class="form-group"><label class="form-label">State</label><select class="select"><option>TX</option><option>CA</option><option>NY</option><option>FL</option></select></div>
          </div>`,
        footer: `<button class="btn btn-secondary" onclick="Modal.close()">Cancel</button><button class="btn btn-primary" onclick="Modal.close();Toast.success('Organization Created','Invitation sent to admin.')">${icons.check} Create</button>`,
      });
    });
  },

  // ── SCREEN 12: AUDIT LOG ──────────────────────────────────
  audit() {
    const eventColors = { success: 'green', warning: 'amber', info: 'blue', error: 'red' };
    const eventIcons  = { success: icons.check, warning: icons.warning_tri, info: icons.info_circle, error: icons.x };
    return `
    <div class="page-wrapper">
      <div class="page-header">
        <div>
          <h1 class="page-title">Audit Log</h1>
          <p class="page-subtitle">All platform activity and security events</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-secondary btn-sm">${icons.download} Export Log</button>
        </div>
      </div>

      <div style="display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-4);flex-wrap:wrap">
        <div class="search-input-wrap" style="width:280px">
          <svg class="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input placeholder="Search events…">
        </div>
        <select class="select" style="width:160px;height:32px;font-size:12px"><option>All Event Types</option><option>Campaign Events</option><option>User Events</option><option>Contact Events</option><option>System Events</option></select>
        <select class="select" style="width:160px;height:32px;font-size:12px"><option>All Users</option>${AppData.team.map(m=>`<option>${m.name}</option>`).join('')}</select>
        <select class="select" style="width:140px;height:32px;font-size:12px"><option>Last 7 days</option><option>Last 30 days</option></select>
      </div>

      <div class="table-container animate-fade-in-up">
        <div class="table-scroll">
          <table class="data-table">
            <thead><tr><th>Timestamp</th><th>User</th><th>Event</th><th>Resource</th><th>IP / Source</th><th>Status</th></tr></thead>
            <tbody>
              ${AppData.audit_events.map(e => `
                <tr>
                  <td style="font-size:11px;font-family:var(--font-mono);color:var(--text-tertiary);white-space:nowrap">${e.ts}</td>
                  <td>
                    <div style="display:flex;align-items:center;gap:var(--space-2)">
                      <div class="avatar avatar-sm ${avatarColor(e.user)}">${avatarInitials(e.user)}</div>
                      <div>
                        <div style="font-size:12px;font-weight:600">${e.user}</div>
                        <div style="font-size:10px;color:var(--text-tertiary)">${e.org}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style="display:flex;align-items:center;gap:var(--space-2)">
                      <div class="audit-event-icon" style="background:var(--color-${eventColors[e.status]}-50);color:var(--color-${eventColors[e.status]}-600)">${eventIcons[e.status]}</div>
                      <span class="audit-event-type">${e.event}</span>
                    </div>
                  </td>
                  <td style="font-size:12px;color:var(--text-secondary);max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${e.resource}</td>
                  <td class="audit-ip">${e.ip}</td>
                  <td><span class="badge badge-${e.status === 'success' ? 'success' : e.status === 'warning' ? 'paused' : e.status === 'info' ? 'info' : 'error'}">${e.status.charAt(0).toUpperCase()+e.status.slice(1)}</span></td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
        <div class="table-footer">
          <span class="table-count">Showing ${AppData.audit_events.length} events</span>
          <div class="pagination">
            <button class="page-btn">‹</button>
            <button class="page-btn active">1</button>
            <button class="page-btn">2</button>
            <button class="page-btn">›</button>
          </div>
        </div>
      </div>
    </div>`;
  },

  // ── SETTINGS (placeholder) ────────────────────────────────
  settings() {
    return `
    <div class="page-wrapper">
      <div class="page-header">
        <h1 class="page-title">Settings</h1>
      </div>
      <div class="card animate-fade-in-up">
        <div class="card-body">
          <div style="display:grid;gap:var(--space-5);max-width:520px">
            <div class="form-group"><label class="form-label">Organization Name</label><input class="input" value="ABC Campaign"></div>
            <div class="form-group"><label class="form-label">Primary Contact Email</label><input class="input" value="alex.rivera@abccampaign.org"></div>
            <div class="form-group"><label class="form-label">Timezone</label><select class="select"><option>America/Chicago (CDT)</option><option>America/New_York</option><option>America/Los_Angeles</option></select></div>
            <div class="form-group"><label class="form-label">Default Opt-Out Message</label><textarea class="textarea">You have been unsubscribed. Reply HELP for help or START to re-subscribe. Standard rates may apply.</textarea></div>
            <div style="display:flex;gap:var(--space-2)">
              <button class="btn btn-primary">Save Settings</button>
              <button class="btn btn-secondary">Discard</button>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  },
};
