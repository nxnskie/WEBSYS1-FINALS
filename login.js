document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('loginForm');
  const err = document.getElementById('login-error');
  const toggle = document.getElementById('togglePass');
  const pass = document.getElementById('password');

  // Toggle password visibility with animated SVG state
  if (toggle && pass) {
    toggle.addEventListener('click', function () {
      const showing = pass.type === 'text';
      pass.type = showing ? 'password' : 'text';
      toggle.classList.toggle('active', !showing);
      toggle.setAttribute('aria-pressed', String(!showing));
      toggle.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
      pass.focus();
    });
  }

  // Clear error when user types
  ['username', 'password'].forEach(function (id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', function () {
      if (err) err.textContent = '';
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const u = (document.getElementById('username').value || '').trim();
    const p = (document.getElementById('password').value || '');

    // Check against hardcoded admin or registered users
    let isValid = false;
    
    if (u === 'admin' && p === 'admin') {
      isValid = true;
    } else {
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      isValid = registeredUsers.some(user => user.username === u && user.password === p);
    }
    
    if (isValid) {
      try { localStorage.setItem('isAdmin', 'true'); } catch (e) {}
      try { localStorage.setItem('currentUser', u); } catch (e) {}
      const rem = document.getElementById('remember');
      if (rem && rem.checked) {
        try { localStorage.setItem('rememberAdmin', 'true'); } catch (e) {}
      }
      location.replace('index.html');
      return;
    }

    if (err) err.textContent = 'Invalid username or password.';
  });
});
