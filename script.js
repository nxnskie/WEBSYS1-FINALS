const hamburger = document.getElementById("burger-checkbox");
const navLinks = document.getElementById("navLinks");

if (hamburger && navLinks) {
  hamburger.onclick = () => {
    navLinks.classList.toggle("active");
  };
}

function handleContactSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('name').value;
  const region = document.getElementById('region').value;
  alert(`Thank you, ${name}! We've received your message about ${region}. We'll get back to you soon.`);
  document.querySelector('.contact-form').reset();
}

// Logout button behaviour shared across pages + username display + confirmation modal
(function () {
  const logoutBtn = document.getElementById('logoutBtn');

  // create a user dropdown next to the logo (shows username, profile/settings, logout)
  function createUserDropdown() {
    let navUser = document.getElementById('navUser');
    if (navUser) return navUser;
    const nav = document.querySelector('nav');
    if (!nav) return null;

    // insert at the end of nav (right side, before closing nav tag)
    navUser = document.createElement('div');
    navUser.id = 'navUser';
    navUser.className = 'nav-user';
    navUser.setAttribute('aria-hidden', 'true');

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'nav-user-button';
    btn.id = 'navUserBtn';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-haspopup', 'true');

    // avatar circle with initials
    const avatar = document.createElement('div');
    avatar.className = 'nav-user-avatar';
    avatar.title = 'User avatar';
    avatar.textContent = 'U';

    const nameSpan = document.createElement('span');
    nameSpan.className = 'nav-user-name';
    nameSpan.textContent = '';

    const chev = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    chev.setAttribute('viewBox', '0 0 24 24');
    chev.className = 'chev';
    chev.innerHTML = '<polyline points="6 9 12 15 18 9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none" />';

    btn.appendChild(avatar);
    btn.appendChild(nameSpan);
    btn.appendChild(chev);

    const menu = document.createElement('div');
    menu.className = 'nav-user-menu';
    menu.id = 'navUserMenu';

    const profile = document.createElement('button');
    profile.className = 'menu-item';
    profile.textContent = 'Profile';
    profile.type = 'button';
    profile.role = 'menuitem';
    profile.addEventListener('click', () => { window.location.href = 'profile.html'; });

    const settings = document.createElement('button');
    settings.className = 'menu-item';
    settings.textContent = 'Settings';
    settings.type = 'button';
    settings.role = 'menuitem';
    settings.addEventListener('click', () => { window.location.href = 'settings.html'; });

    const separator = document.createElement('div');
    separator.style.cssText = 'height:1px;background:rgba(92,228,255,0.1);margin:6px 0';

    const logoutItem = document.createElement('button');
    logoutItem.className = 'menu-item';
    logoutItem.id = 'navUserLogout';
    logoutItem.textContent = 'Logout';
    logoutItem.type = 'button';
    logoutItem.role = 'menuitem';
    logoutItem.style.color = '#d32f2f';
    logoutItem.addEventListener('click', () => { openLogoutModal(); });

    menu.appendChild(profile);
    menu.appendChild(settings);
    menu.appendChild(separator);
    menu.appendChild(logoutItem);

    // keyboard navigation
    const menuItems = [profile, settings, logoutItem];
    menuItems.forEach((item, idx) => {
      item.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const nextIdx = (idx + 1) % menuItems.length;
          menuItems[nextIdx].focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prevIdx = (idx - 1 + menuItems.length) % menuItems.length;
          menuItems[prevIdx].focus();
        } else if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          item.click();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          navUser.classList.remove('open');
          btn.setAttribute('aria-expanded', 'false');
          btn.focus();
        }
      });
    });

    navUser.appendChild(btn);
    navUser.appendChild(menu);

    // append to nav (right side)
    nav.appendChild(navUser);

    // toggle menu
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = navUser.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open && menuItems.length > 0) {
        menuItems[0].focus();
      }
    });

    // close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navUser) return;
      if (!navUser.contains(e.target)) {
        navUser.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });

    return navUser;
  }

  function updateLogoutVisibility() {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const username = localStorage.getItem('currentUser') || '';

    // toggle all logout buttons by class
    const logoutBtns = document.querySelectorAll('.logout-btn');
    logoutBtns.forEach(b => b.classList.toggle('hidden', !isAdmin));

    // show/hide and update dropdown
    const userEl = createUserDropdown();
    if (userEl) {
      const nameSpan = userEl.querySelector('.nav-user-name');
      const avatar = userEl.querySelector('.nav-user-avatar');
      if (isAdmin && username) {
        nameSpan.textContent = `Hi, ${username}`;
        // set avatar initials from username
        if (avatar) avatar.textContent = username.charAt(0).toUpperCase();
        userEl.setAttribute('aria-hidden', 'false');
      } else {
        userEl.setAttribute('aria-hidden', 'true');
      }
    }
  }

  // Create confirmation modal dynamically
  function ensureLogoutModal() {
    if (document.getElementById('logoutModal')) return document.getElementById('logoutModal');
    const modal = document.createElement('div');
    modal.id = 'logoutModal';
    modal.className = 'modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.hidden = true;
    modal.innerHTML = `
      <div class="modal-content">
        <h2 id="logoutModalTitle">Confirm Logout</h2>
        <p>Are you sure you want to log out?</p>
        <div class="modal-actions">
          <button class="modal-btn modal-btn-primary" id="confirmLogoutBtn">Log out</button>
          <button class="modal-btn modal-btn-secondary" id="cancelLogoutBtn">Cancel</button>
        </div>
      </div>`;
    document.body.appendChild(modal);
    return modal;
  }

  function openLogoutModal() {
    const m = ensureLogoutModal();
    m.hidden = false;
    // focus the primary action
    const confirm = document.getElementById('confirmLogoutBtn');
    if (confirm) confirm.focus();
  }

  function closeLogoutModal() {
    const m = document.getElementById('logoutModal');
    if (!m) return;
    m.hidden = true;
  }

  function performLogout() {
    try { localStorage.removeItem('isAdmin'); } catch (e) {}
    try { localStorage.removeItem('rememberAdmin'); } catch (e) {}
    try { localStorage.removeItem('currentUser'); } catch (e) {}
    location.replace('login.html');
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      openLogoutModal();
    });
  }

  // wire modal buttons
  document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'confirmLogoutBtn') {
      performLogout();
    }
    if (e.target && e.target.id === 'cancelLogoutBtn') {
      closeLogoutModal();
    }
  });

  // click outside to close
  document.addEventListener('click', (e) => {
    const m = document.getElementById('logoutModal');
    if (!m || m.hidden) return;
    if (e.target === m) closeLogoutModal();
  });

  // Update when the script loads
  updateLogoutVisibility();

  // Observe storage changes
  window.addEventListener('storage', (e) => {
    if (e.key === 'isAdmin' || e.key === 'currentUser') updateLogoutVisibility();
  });
})();