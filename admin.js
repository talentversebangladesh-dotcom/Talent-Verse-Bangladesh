/*===== EMERGENCY DEBUG LOGIN =====*/
console.log("🚀 admin.js loaded");

window.addEventListener('load', () => {
  console.log("✅ Page fully loaded");
  console.log("Firebase Auth:", window.firebaseAuth);
  console.log("Firebase Functions:", window.firebaseFunctions);
  
  setTimeout(() => {
    if(window.firebaseAuth) {
      console.log("✅ Firebase Auth is READY");
    } else {
      console.log("❌ Firebase Auth NOT loaded!");
      alert("❌ Firebase failed to load. Check firebase-config.js");
    }
  }, 3000);
});

async function doLogin() {
  console.log("🔵 doLogin called!");
  
  const emailEl = document.getElementById('lu');
  const passEl = document.getElementById('lp');
  const errEl = document.getElementById('lerr');
  
  console.log("Email element:", emailEl);
  console.log("Password element:", passEl);
  
  if(!emailEl || !passEl) {
    alert("❌ Email/Password field not found!");
    return;
  }
  
  const u = emailEl.value.trim();
  const p = passEl.value;
  
  console.log("Email:", u);
  console.log("Password length:", p.length);
  
  if(!u || !p) {
    alert("Please fill both fields!");
    return;
  }
  
  if(!window.firebaseAuth) {
    alert("❌ Firebase Auth not ready! Wait and try again.");
    console.error("firebaseAuth is:", window.firebaseAuth);
    return;
  }
  
  if(!window.firebaseFunctions || !window.firebaseFunctions.signInWithEmailAndPassword) {
    alert("❌ Firebase functions not loaded!");
    console.error("firebaseFunctions:", window.firebaseFunctions);
    return;
  }
  
  try {
    console.log("🔐 Attempting login...");
    const { signInWithEmailAndPassword } = window.firebaseFunctions;
    const result = await signInWithEmailAndPassword(window.firebaseAuth, u, p);
    console.log("✅ LOGIN SUCCESS!", result.user.email);
    alert("✅ Login SUCCESS!\n\nEmail: " + result.user.email);
    
    // Show admin panel
    document.getElementById('adm-login').classList.add('hidden');
    document.getElementById('adm-shell').classList.add('show-admin');
    document.getElementById('adm-shell').style.display = 'flex';
    
    if(typeof renderAdminAll === 'function') {
      renderAdminAll();
    }
    
  } catch(error) {
    console.error("❌ LOGIN ERROR:", error);
    alert("❌ Login Failed!\n\nCode: " + error.code + "\n\nMessage: " + error.message);
  }
}
/*===== ADMIN NAVIGATION =====*/
function openAdmin() {
  window.location.href = 'admin.html';
}

function closeAdmin() {
  window.location.href = 'index.html';
}

/*===== FIREBASE AUTH LOGIN =====*/
async function doLogin() {
  const u = document.getElementById('lu').value.trim();
  const p = document.getElementById('lp').value;
  const err = document.getElementById('lerr');

  if(!u || !p) {
    err.classList.add('show');
    err.textContent = "Please fill in all fields.";
    setTimeout(() => err.classList.remove('show'), 3000);
    return;
  }

  const check = setInterval(async () => {
    if(window.firebaseAuth && window.firebaseFunctions) {
      clearInterval(check);
      const { signInWithEmailAndPassword } = window.firebaseFunctions;
      
      try {
        await signInWithEmailAndPassword(window.firebaseAuth, u, p);
      } catch(error) {
        err.classList.add('show');
        err.textContent = "Incorrect email or password.";
        setTimeout(() => err.classList.remove('show'), 3000);
        console.error("Login error:", error);
      }
    }
  }, 100);
}

/*===== LOGOUT =====*/
async function doLogout() {
  const { signOut } = window.firebaseFunctions;
  try {
    await signOut(window.firebaseAuth);
    window.location.href = 'index.html';
  } catch(err) {
    console.error("Logout error:", err);
  }
}

/*===== AUTH STATE CHECK =====*/
function checkAdminAuth() {
  const check = setInterval(() => {
    if(window.firebaseAuth && window.firebaseFunctions) {
      clearInterval(check);
      const { onAuthStateChanged } = window.firebaseFunctions;
      
      onAuthStateChanged(window.firebaseAuth, (user) => {
        if(user) {
          document.getElementById('adm-login').classList.add('hidden');
          document.getElementById('adm-shell').style.display = 'flex';
          renderAdminAll();
          loadMessages().then(() => {
            if(typeof renderMessagesTable === 'function') renderMessagesTable();
          });
          loadRegistrations().then(() => {
            if(typeof renderRegistrationsTable === 'function') renderRegistrationsTable();
          });
        } else {
          document.getElementById('adm-login').classList.remove('hidden');
          document.getElementById('adm-shell').style.display = 'none';
        }
      });
    }
  }, 100);
}

/*===== SIDEBAR =====*/
function openSidebar() {
  document.getElementById('adm-sb').classList.add('open');
  document.getElementById('sb-ov').classList.add('open');
}

function closeSidebar() {
  document.getElementById('adm-sb').classList.remove('open');
  document.getElementById('sb-ov').classList.remove('open');
}

/*===== NAVIGATION =====*/
function goSec(btn) {
  const secId = btn.getAttribute('data-sec');

  document.querySelectorAll('.adm-sec').forEach(s => s.classList.remove('active'));
  const sec = document.getElementById(secId);
  if(sec) sec.classList.add('active');

  document.querySelectorAll('.adm-nb').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const titles = {
  const titles = {
  'dash': 'Dashboard',
  'home-ed': 'Home Page Editor',
  'olymp-adm': 'Manage Olympiads',
  'gal-adm': 'Gallery Manager',
  'news-adm': 'News Updates',
  'msg-adm': 'Contact Messages',
  'reg-adm': 'Registrations',
  'popup-adm': 'Popup Notice',
  'set-adm': 'System Settings'
};
  const ptitle = document.getElementById('adm-ptitle');
  if(ptitle) ptitle.textContent = titles[secId] || secId;

  const actions = document.getElementById('adm-topbar-actions');
  if(actions) {
    actions.innerHTML = '';
    if(secId === 'home-ed') {
      actions.innerHTML = `<button class="save-btn" onclick="saveHomeEditor()">💾 Save Changes</button>`;
    } else if(secId === 'olymp-adm') {
      actions.innerHTML = `<button class="add-btn" onclick="openOlympiadForm()">+ Add Olympiad</button>`;
    } else if(secId === 'gal-adm') {
      actions.innerHTML = `<button class="add-btn" onclick="openGalleryForm()">+ Add Media</button>`;
    } else if(secId === 'news-adm') {
      actions.innerHTML = `<button class="add-btn" onclick="openNewsForm()">+ Add News</button>`;
    } else if(secId === 'reg-adm') {
      actions.innerHTML = `<button class="add-btn" onclick="downloadRegistrationsCSV()">⬇️ Download CSV</button>`;
    }
  }

  // Load settings when opening Settings tab
if(secId === 'set-adm') {
  loadRegistrationSettings();
}

// Load popup settings when opening Popup tab
if(secId === 'popup-adm') {
  loadPopupSettings();
}

  if(window.innerWidth <= 700) closeSidebar();
}

/*===== RENDER ADMIN ALL =====*/
function renderAdminAll() {
  renderDashboard();
  renderOlympiadTable();
  renderGalleryTable();
  renderNewsTable();
  loadHomeEditor();
}

/*===== DASHBOARD =====*/
function renderDashboard() {
  const olympiads = getOlympiads();
  const gallery = getGallery();
  const news = getNews();
  const messages = getMessages();
  const registrations = getRegistrations();

  const active = olympiads.filter(o => o.status === 'active').length;
  const upcoming = olympiads.filter(o => o.status === 'upcoming').length;
  const unreadMsg = messages.filter(m => !m.read).length;

  const stats = document.getElementById('db-stats');
  if(stats) {
    stats.innerHTML = `
      <div class="stat-card"><div class="sl">Total Olympiads</div><div class="sv">${olympiads.length}</div></div>
      <div class="stat-card"><div class="sl">Active Now</div><div class="sv">${active}</div></div>
      <div class="stat-card"><div class="sl">Upcoming</div><div class="sv">${upcoming}</div></div>
      <div class="stat-card"><div class="sl">Gallery Items</div><div class="sv">${gallery.length}</div></div>
      <div class="stat-card"><div class="sl">News Posts</div><div class="sv">${news.length}</div></div>
      <div class="stat-card"><div class="sl">Messages</div><div class="sv">${messages.length}</div></div>
      <div class="stat-card"><div class="sl">Unread Msgs</div><div class="sv" style="color:#f87171;">${unreadMsg}</div></div>
      <div class="stat-card"><div class="sl">Registrations</div><div class="sv">${registrations.length}</div></div>`;
  }

  const recent = document.getElementById('db-recent');
  if(recent) {
    if(olympiads.length === 0) {
      recent.innerHTML = `<tr class="empty-row"><td colspan="3">No olympiads added yet</td></tr>`;
    } else {
      recent.innerHTML = '';
      olympiads.slice(0, 5).forEach(o => {
        recent.innerHTML += `
          <tr>
            <td>${o.title}</td>
            <td><span class="bs bs-${o.status}">${o.status}</span></td>
            <td>${o.date || 'TBA'}</td>
          </tr>`;
      });
    }
  }
}

/*===== OLYMPIAD TABLE =====*/
function renderOlympiadTable() {
  const tbody = document.getElementById('otbl');
  if(!tbody) return;

  const olympiads = getOlympiads();
  if(olympiads.length === 0) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="6">No olympiads yet. Click "+ Add Olympiad" to get started.</td></tr>`;
    return;
  }

  tbody.innerHTML = '';
  olympiads.forEach((o) => {
    tbody.innerHTML += `
      <tr>
        <td>${o.img ? `<img src="${o.img}" class="thumb" alt="cover">` : `<div class="thumb" style="background:var(--card2);display:flex;align-items:center;justify-content:center;font-size:1.2rem">🏆</div>`}</td>
        <td>${o.title}</td>
        <td>${o.cat}</td>
        <td>${o.date || 'TBA'}</td>
        <td><span class="bs bs-${o.status}">${o.status}</span></td>
        <td class="tbl-acts">
          <button class="e-btn" onclick="editOlympiad('${o.id}')">Edit</button>
          <button class="d-btn" onclick="deleteOlympiad('${o.id}')">Delete</button>
        </td>
      </tr>`;
  });
}

/*===== GALLERY TABLE =====*/
function renderGalleryTable() {
  const tbody = document.getElementById('gtbl');
  if(!tbody) return;

  const gallery = getGallery();
  if(gallery.length === 0) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="4">No media yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = '';
  gallery.forEach((g) => {
    tbody.innerHTML += `
      <tr>
        <td>${g.type === 'video' ? `<div class="thumb" style="background:var(--card2);display:flex;align-items:center;justify-content:center;font-size:1.5rem">🎥</div>` : `<img src="${g.url}" class="thumb">`}</td>
        <td>${g.cap || '—'}</td>
        <td>${g.type}</td>
        <td class="tbl-acts">
          <button class="e-btn" onclick="editGallery('${g.id}')">Edit</button>
          <button class="d-btn" onclick="deleteGallery('${g.id}')">Delete</button>
        </td>
      </tr>`;
  });
}

/*===== NEWS TABLE =====*/
function renderNewsTable() {
  const tbody = document.getElementById('ntbl');
  if(!tbody) return;

  const news = getNews();
  if(news.length === 0) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="3">No news yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = '';
  news.forEach((n) => {
    tbody.innerHTML += `
      <tr>
        <td>${n.title}</td>
        <td>${n.date}</td>
        <td class="tbl-acts">
          <button class="e-btn" onclick="editNews('${n.id}')">Edit</button>
          <button class="d-btn" onclick="deleteNews('${n.id}')">Delete</button>
        </td>
      </tr>`;
  });
}

/*===== MESSAGES TABLE =====*/
function renderMessagesTable() {
  const tbody = document.getElementById('mtbl');
  if(!tbody) return;

  const messages = getMessages();
  if(messages.length === 0) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="5">No messages yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = '';
  messages.forEach((m) => {
    const date = m.createdAt ? new Date(m.createdAt).toLocaleString() : 'N/A';
    tbody.innerHTML += `
      <tr>
        <td>${m.name}</td>
        <td><a href="mailto:${m.email}" style="color:var(--blue-br)">${m.email}</a></td>
        <td>${m.subject || '(No subject)'}</td>
        <td>${date}</td>
        <td class="tbl-acts">
          <button class="e-btn" onclick="viewMessage('${m.id}')">View</button>
          <button class="d-btn" onclick="deleteMessageAction('${m.id}')">Delete</button>
        </td>
      </tr>`;
  });
}

function viewMessage(id) {
  const msg = getMessages().find(m => m.id === id);
  if(!msg) return;
  alert(`From: ${msg.name}\nEmail: ${msg.email}\nSubject: ${msg.subject || 'N/A'}\n\nMessage:\n${msg.message}`);
}

async function deleteMessageAction(id) {
  if(!confirm("Delete this message?")) return;
  const ok = await deleteMessage(id);
  if(ok) {
    renderMessagesTable();
    renderDashboard();
    toast("Message deleted.");
  }
}

/*===== REGISTRATIONS TABLE =====*/
function renderRegistrationsTable() {
  const tbody = document.getElementById('rtbl');
  if(!tbody) return;

  const regs = getRegistrations();
  if(regs.length === 0) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="6">No registrations yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = '';
  regs.forEach((r) => {
    const date = r.createdAt ? new Date(r.createdAt).toLocaleString() : 'N/A';
    tbody.innerHTML += `
      <tr>
        <td>${r.name}</td>
        <td><a href="mailto:${r.email}" style="color:var(--blue-br)">${r.email}</a></td>
        <td>${r.phone}</td>
        <td>${r.olympiad}</td>
        <td>${date}</td>
        <td class="tbl-acts">
          <button class="e-btn" onclick="viewRegistration('${r.id}')">View</button>
          <button class="d-btn" onclick="deleteRegistrationAction('${r.id}')">Delete</button>
        </td>
      </tr>`;
  });
}

function viewRegistration(id) {
  const r = getRegistrations().find(x => x.id === id);
  if(!r) return;
  const details = `
Name: ${r.name}
Email: ${r.email}
Phone: ${r.phone}
Olympiad: ${r.olympiad}
Class: ${r.class || 'N/A'}
School: ${r.school || 'N/A'}
Address: ${r.address || 'N/A'}
Message: ${r.message || 'N/A'}
Date: ${r.createdAt ? new Date(r.createdAt).toLocaleString() : 'N/A'}
  `;
  alert(details);
}

async function deleteRegistrationAction(id) {
  if(!confirm("Delete this registration?")) return;
  const ok = await deleteRegistration(id);
  if(ok) {
    renderRegistrationsTable();
    renderDashboard();
    toast("Registration deleted.");
  }
}

function downloadRegistrationsCSV() {
  const regs = getRegistrations();
  if(regs.length === 0) return toast("No registrations to download.", true);

  let csv = "Name,Email,Phone,Olympiad,Class,School,Address,Message,Date\n";
  regs.forEach(r => {
    const row = [
      r.name || '',
      r.email || '',
      r.phone || '',
      r.olympiad || '',
      r.class || '',
      r.school || '',
      r.address || '',
      (r.message || '').replace(/\n/g, ' '),
      r.createdAt ? new Date(r.createdAt).toLocaleString() : ''
    ].map(x => `"${String(x).replace(/"/g, '""')}"`).join(',');
    csv += row + "\n";
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `registrations_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast("CSV downloaded! ✅");
}

/*===== HOME EDITOR =====*/
function loadHomeEditor() {
  const h = getHome();
  const fields = {
    'he-badge': h.badge, 'he-title': h.title, 'he-sub': h.sub,
    'he-b1': h.b1, 'he-b2': h.b2, 'he-odesc': h.odesc,
    'he-s1n': h.s1n, 'he-s1l': h.s1l, 'he-s2n': h.s2n,
    'he-s2l': h.s2l, 'he-s3n': h.s3n, 'he-s3l': h.s3l,
    'he-quote': h.quote, 'he-fdesc': h.fdesc,
    'he-femail': h.femail, 'he-fphone': h.fphone, 'he-faddr': h.faddr
  };
  Object.entries(fields).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if(el) el.value = val || '';
  });
}

async function saveHomeEditor() {
  const data = {
    badge: document.getElementById('he-badge')?.value || '',
    title: document.getElementById('he-title')?.value || '',
    sub: document.getElementById('he-sub')?.value || '',
    b1: document.getElementById('he-b1')?.value || '',
    b2: document.getElementById('he-b2')?.value || '',
    odesc: document.getElementById('he-odesc')?.value || '',
    s1n: document.getElementById('he-s1n')?.value || '',
    s1l: document.getElementById('he-s1l')?.value || '',
    s2n: document.getElementById('he-s2n')?.value || '',
    s2l: document.getElementById('he-s2l')?.value || '',
    s3n: document.getElementById('he-s3n')?.value || '',
    s3l: document.getElementById('he-s3l')?.value || '',
    quote: document.getElementById('he-quote')?.value || '',
    fdesc: document.getElementById('he-fdesc')?.value || '',
    femail: document.getElementById('he-femail')?.value || '',
    fphone: document.getElementById('he-fphone')?.value || '',
    faddr: document.getElementById('he-faddr')?.value || ''
  };
  const ok = await updateHome(data);
  if(ok) toast("Home page updated! ✅");
  else toast("Update failed!", true);
}

/*===== FORM MODAL =====*/
function openFM(id) {
  const el = document.getElementById(id);
  if(el) el.classList.add('open');
}

function closeFM(id) {
  const el = document.getElementById(id);
  if(el) el.classList.remove('open');
}

/*===== OLYMPIAD FORM =====*/
function openOlympiadForm() {
  document.getElementById('ofm-title').textContent = "Add Olympiad";
  document.getElementById('of-eid').value = "";
  ['of-t','of-dt','of-rd','of-v','of-pr','of-el','of-fe','of-rl','of-ds','of-fd','of-iu'].forEach(id => {
    const el = document.getElementById(id);
    if(el) el.value = '';
  });
  document.getElementById('of-cat').value = 'Mathematics';
  document.getElementById('of-st').value = 'upcoming';
  const chk = document.getElementById('of-reg-enabled');
  if(chk) chk.checked = false;
  document.getElementById('of-iprev').innerHTML = '';
  openFM('ofm');
}

function editOlympiad(id) {
  const o = getOlympiads().find(x => x.id === id);
  if(!o) return;
  document.getElementById('ofm-title').textContent = "Edit Olympiad";
  document.getElementById('of-eid').value = id;
  document.getElementById('of-t').value = o.title || '';
  document.getElementById('of-cat').value = o.cat || 'Mathematics';
  document.getElementById('of-st').value = o.status || 'upcoming';
  document.getElementById('of-dt').value = o.date || '';
  document.getElementById('of-rd').value = o.deadline || '';
  document.getElementById('of-v').value = o.venue || '';
  document.getElementById('of-pr').value = o.prize || '';
  document.getElementById('of-el').value = o.eligibility || '';
  document.getElementById('of-fe').value = o.fee || '';
  document.getElementById('of-rl').value = o.regLink || '';
  document.getElementById('of-ds').value = o.desc || '';
  document.getElementById('of-fd').value = o.fullDesc || '';
  document.getElementById('of-iu').value = o.img || '';
  const chk = document.getElementById('of-reg-enabled');
  if(chk) chk.checked = o.regEnabled || false;
  document.getElementById('of-iprev').innerHTML = o.img ? `<img src="${o.img}">` : '';
  openFM('ofm');
}

async function saveOlympiad() {
  const title = document.getElementById('of-t').value.trim();
  const desc = document.getElementById('of-ds').value.trim();
  if(!title) return toast("Title is required!", true);
  if(!desc) return toast("Short description is required!", true);

  const o = {
    title, desc,
    cat: document.getElementById('of-cat').value,
    status: document.getElementById('of-st').value,
    date: document.getElementById('of-dt').value,
    deadline: document.getElementById('of-rd').value,
    venue: document.getElementById('of-v').value,
    prize: document.getElementById('of-pr').value,
    eligibility: document.getElementById('of-el').value,
    fee: document.getElementById('of-fe').value,
    regLink: document.getElementById('of-rl').value,
    fullDesc: document.getElementById('of-fd').value,
    img: document.getElementById('of-iu').value,
    regEnabled: document.getElementById('of-reg-enabled')?.checked || false
  };

  const eid = document.getElementById('of-eid').value;
  const btn = document.querySelector('#ofm .fs-btn');
  btn.textContent = 'Saving...';
  btn.disabled = true;

  const ok = eid === '' ? await addOlympiad(o) : await updateOlympiad(eid, o);
  
  btn.textContent = 'Save Olympiad';
  btn.disabled = false;

  if(ok) {
    renderOlympiadTable();
    renderDashboard();
    closeFM('ofm');
    toast("Olympiad saved! ✅");
  } else {
    toast("Save failed!", true);
  }
}

async function deleteOlympiad(id) {
  if(!confirm("Delete this olympiad?")) return;
  const ok = await deleteOlympiadData(id);
  if(ok) {
    renderOlympiadTable();
    renderDashboard();
    toast("Olympiad deleted.");
  }
}

/*===== GALLERY FORM =====*/
function openGalleryForm() {
  document.getElementById('gfm-title').textContent = "Add Media";
  document.getElementById('gf-eid').value = '';
  document.getElementById('gf-cap').value = '';
  document.getElementById('gf-type').value = 'image';
  document.getElementById('gf-url').value = '';
  document.getElementById('gf-prev').innerHTML = '';
  openFM('gfm');
}

function editGallery(id) {
  const g = getGallery().find(x => x.id === id);
  if(!g) return;
  document.getElementById('gfm-title').textContent = "Edit Media";
  document.getElementById('gf-eid').value = id;
  document.getElementById('gf-cap').value = g.cap || '';
  document.getElementById('gf-type').value = g.type || 'image';
  document.getElementById('gf-url').value = g.url || '';
  document.getElementById('gf-prev').innerHTML = g.type === 'video' ? `<div style="font-size:2rem;padding:10px">🎥</div>` : `<img src="${g.url}">`;
  openFM('gfm');
}

async function saveGallery() {
  const url = document.getElementById('gf-url').value.trim();
  if(!url) return toast("URL or file is required!", true);

  const g = {
    cap: document.getElementById('gf-cap').value.trim(),
    type: document.getElementById('gf-type').value,
    url
  };

  const eid = document.getElementById('gf-eid').value;
  const btn = document.querySelector('#gfm .fs-btn');
  btn.textContent = 'Saving...';
  btn.disabled = true;

  const ok = eid === '' ? await addGallery(g) : await updateGallery(eid, g);
  
  btn.textContent = 'Save Media';
  btn.disabled = false;

  if(ok) {
    renderGalleryTable();
    renderDashboard();
    closeFM('gfm');
    toast("Media saved! ✅");
  } else {
    toast("Save failed!", true);
  }
}

async function deleteGallery(id) {
  if(!confirm("Delete this?")) return;
  const ok = await deleteGalleryData(id);
  if(ok) {
    renderGalleryTable();
    renderDashboard();
    toast("Deleted.");
  }
}

/*===== NEWS FORM =====*/
function openNewsForm() {
  document.getElementById('nfm-title').textContent = "Add News";
  document.getElementById('nf-eid').value = '';
  document.getElementById('nf-t').value = '';
  document.getElementById('nf-b').value = '';
  document.getElementById('nf-d').value = new Date().toISOString().split('T')[0];
  openFM('nfm');
}

function editNews(id) {
  const n = getNews().find(x => x.id === id);
  if(!n) return;
  document.getElementById('nfm-title').textContent = "Edit News";
  document.getElementById('nf-eid').value = id;
  document.getElementById('nf-t').value = n.title || '';
  document.getElementById('nf-d').value = n.date || '';
  document.getElementById('nf-b').value = n.body || '';
  openFM('nfm');
}

async function saveNews() {
  const title = document.getElementById('nf-t').value.trim();
  const body = document.getElementById('nf-b').value.trim();
  if(!title) return toast("Headline is required!", true);
  if(!body) return toast("News body is required!", true);

  const n = { title, body, date: document.getElementById('nf-d').value };

  const eid = document.getElementById('nf-eid').value;
  const btn = document.querySelector('#nfm .fs-btn');
  btn.textContent = 'Saving...';
  btn.disabled = true;

  const ok = eid === '' ? await addNews(n) : await updateNews(eid, n);
  
  btn.textContent = 'Save News';
  btn.disabled = false;

  if(ok) {
    renderNewsTable();
    renderDashboard();
    closeFM('nfm');
    toast("News saved! ✅");
  } else {
    toast("Save failed!", true);
  }
}

async function deleteNews(id) {
  if(!confirm("Delete this news?")) return;
  const ok = await deleteNewsData(id);
  if(ok) {
    renderNewsTable();
    renderDashboard();
    toast("News deleted.");
  }
}

/*===== IMAGE UPLOAD (Auto ImgBB) =====*/
async function prevOImg(input) {
  if(!input.files || !input.files[0]) return;
  const file = input.files[0];
  
  if(file.size > 32 * 1024 * 1024) {
    return toast("File too large! Max 32MB", true);
  }

  const prev = document.getElementById('of-iprev');
  prev.innerHTML = `<div style="padding:10px;color:var(--muted)">⏳ Uploading to ImgBB...</div>`;

  const result = await uploadToImgBB(file);
  
  if(result.success) {
    document.getElementById('of-iu').value = result.url;
    prev.innerHTML = `<img src="${result.url}"><div style="color:#4ade80;font-size:.75rem;margin-top:5px">✅ Uploaded!</div>`;
    toast("Image uploaded! ✅");
  } else {
    prev.innerHTML = `<div style="color:#f87171">❌ Upload failed</div>`;
    toast("Upload failed!", true);
  }
}

async function prevGFile(input) {
  if(!input.files || !input.files[0]) return;
  const file = input.files[0];
  const isVideo = file.type.includes('video');

  if(isVideo) {
    if(file.size > 5 * 1024 * 1024) {
      return toast("Video too large! Max 5MB. Please use a video URL instead.", true);
    }
    const reader = new FileReader();
    reader.onload = e => {
      document.getElementById('gf-url').value = e.target.result;
      document.getElementById('gf-type').value = 'video';
      document.getElementById('gf-prev').innerHTML = `<div style="font-size:2rem;padding:10px">🎥 Video Uploaded</div>`;
    };
    reader.readAsDataURL(file);
    return;
  }

  if(file.size > 32 * 1024 * 1024) {
    return toast("File too large! Max 32MB", true);
  }

  const prev = document.getElementById('gf-prev');
  prev.innerHTML = `<div style="padding:10px;color:var(--muted)">⏳ Uploading to ImgBB...</div>`;

  const result = await uploadToImgBB(file);
  
  if(result.success) {
    document.getElementById('gf-url').value = result.url;
    document.getElementById('gf-type').value = 'image';
    prev.innerHTML = `<img src="${result.url}"><div style="color:#4ade80;font-size:.75rem;margin-top:5px">✅ Uploaded!</div>`;
    toast("Image uploaded! ✅");
  } else {
    prev.innerHTML = `<div style="color:#f87171">❌ Upload failed</div>`;
    toast("Upload failed!", true);
  }
}

/*===== REGISTRATION SETTINGS (Google Form) =====*/
async function loadRegistrationSettings() {
  const settings = await getRegistrationSettings();
  const titleEl = document.getElementById('rs-title');
  const descEl = document.getElementById('rs-desc');
  const linkEl = document.getElementById('rs-link');
  const deadEl = document.getElementById('rs-deadline');
  const activeEl = document.getElementById('rs-active');
  
  if(titleEl) titleEl.value = settings.title || '';
  if(descEl) descEl.value = settings.description || '';
  if(linkEl) linkEl.value = settings.formLink || '';
  if(deadEl) deadEl.value = settings.deadline || '';
  if(activeEl) activeEl.checked = settings.active || false;
}

async function saveRegistrationSettings() {
  const data = {
    title: document.getElementById('rs-title')?.value.trim() || '',
    description: document.getElementById('rs-desc')?.value.trim() || '',
    formLink: document.getElementById('rs-link')?.value.trim() || '',
    deadline: document.getElementById('rs-deadline')?.value || '',
    active: document.getElementById('rs-active')?.checked || false
  };
  
  if(data.active && !data.formLink) {
    return toast("Google Form link is required when active!", true);
  }
  
  if(data.active && !data.title) {
    return toast("Title is required when active!", true);
  }
  
  const btn = document.getElementById('rs-save-btn');
  if(btn) {
    btn.textContent = '⏳ Saving...';
    btn.disabled = true;
  }
  
  const ok = await updateRegistrationSettings(data);
  
  if(btn) {
    btn.textContent = '💾 Save Registration Settings';
    btn.disabled = false;
  }
  
  if(ok) toast("Registration settings saved! ✅");
  else toast("Save failed!", true);
}
/*===== POPUP NOTICE SETTINGS (Admin) =====*/
async function loadPopupSettings() {
  const settings = await getPopupSettings();
  
  const activeEl = document.getElementById('ps-active');
  const titleEl = document.getElementById('ps-title');
  const msgEl = document.getElementById('ps-message');
  const btnTextEl = document.getElementById('ps-btn-text');
  const btnLinkEl = document.getElementById('ps-btn-link');
  const deadEl = document.getElementById('ps-deadline');
  const nbActiveEl = document.getElementById('ps-nb-active');
  const nbTextEl = document.getElementById('ps-nb-text');
  
  if(activeEl) activeEl.checked = settings.active || false;
  if(titleEl) titleEl.value = settings.title || '';
  if(msgEl) msgEl.value = settings.message || '';
  if(btnTextEl) btnTextEl.value = settings.buttonText || 'Apply Now';
  if(btnLinkEl) btnLinkEl.value = settings.buttonLink || '';
  if(deadEl) deadEl.value = settings.deadline || '';
  if(nbActiveEl) nbActiveEl.checked = settings.showNoticeBar || false;
  if(nbTextEl) nbTextEl.value = settings.noticeBarText || '';
}

async function savePopupSettings() {
  const data = {
    active: document.getElementById('ps-active')?.checked || false,
    title: document.getElementById('ps-title')?.value.trim() || '',
    message: document.getElementById('ps-message')?.value.trim() || '',
    buttonText: document.getElementById('ps-btn-text')?.value.trim() || 'Apply Now',
    buttonLink: document.getElementById('ps-btn-link')?.value.trim() || '',
    deadline: document.getElementById('ps-deadline')?.value || '',
    showNoticeBar: document.getElementById('ps-nb-active')?.checked || false,
    noticeBarText: document.getElementById('ps-nb-text')?.value.trim() || ''
  };
  
  if(data.active && !data.title) {
    return toast("Title is required when active!", true);
  }
  if(data.active && !data.message) {
    return toast("Message is required when active!", true);
  }
  
  const btn = document.getElementById('ps-save-btn');
  if(btn) {
    btn.textContent = '⏳ Saving...';
    btn.disabled = true;
  }
  
  const ok = await updatePopupSettings(data);
  
  if(btn) {
    btn.textContent = '💾 Save Popup Settings';
    btn.disabled = false;
  }
  
  if(ok) toast("Popup settings saved! ✅");
  else toast("Save failed!", true);
}
