// Register page form handling
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');
  const regUsername = document.getElementById('reg-username');
  const regPassword = document.getElementById('reg-password');
  const regConfirm = document.getElementById('reg-confirm');
  const togglePass = document.getElementById('togglePass');
  const toggleConfirm = document.getElementById('toggleConfirm');
  const regError = document.getElementById('register-error');
  const regSuccess = document.getElementById('register-success');
  const userError = document.getElementById('username-error');
  const passError = document.getElementById('password-error');
  const confirmError = document.getElementById('confirm-error');
  
  // Password toggle for password field
  if (togglePass) {
    togglePass.addEventListener('click', () => {
      const isPassword = regPassword.type === 'password';
      regPassword.type = isPassword ? 'text' : 'password';
      togglePass.classList.toggle('active');
      togglePass.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    });
  }
  
  // Password toggle for confirm field
  if (toggleConfirm) {
    toggleConfirm.addEventListener('click', () => {
      const isPassword = regConfirm.type === 'password';
      regConfirm.type = isPassword ? 'text' : 'password';
      toggleConfirm.classList.toggle('active');
      toggleConfirm.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    });
  }
  
  // Clear errors on input
  [regUsername, regPassword, regConfirm].forEach(field => {
    if (field) {
      field.addEventListener('input', () => {
        field.parentElement.querySelector('.field-error').textContent = '';
      });
    }
  });
  
  // Form submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Clear previous errors
      regError.textContent = '';
      regSuccess.textContent = '';
      userError.textContent = '';
      passError.textContent = '';
      confirmError.textContent = '';
      
      const username = regUsername.value.trim();
      const password = regPassword.value;
      const confirm = regConfirm.value;
      
      let isValid = true;
      
      // Validate username
      if (!username) {
        userError.textContent = 'Username is required.';
        isValid = false;
      } else if (username.length < 3) {
        userError.textContent = 'Username must be at least 3 characters.';
        isValid = false;
      } else if (username.length > 20) {
        userError.textContent = 'Username must not exceed 20 characters.';
        isValid = false;
      }
      
      // Validate password
      if (!password) {
        passError.textContent = 'Password is required.';
        isValid = false;
      } else if (password.length < 6) {
        passError.textContent = 'Password must be at least 6 characters.';
        isValid = false;
      }
      
      // Validate confirm password
      if (!confirm) {
        confirmError.textContent = 'Please confirm your password.';
        isValid = false;
      } else if (confirm !== password) {
        confirmError.textContent = 'Passwords do not match.';
        isValid = false;
      }
      
      // Check if user already exists
      if (isValid) {
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const userExists = registeredUsers.some(u => u.username === username);
        
        if (userExists) {
          showUserExistsModal();
          return;
        }
      }
      
      if (!isValid) return;
      
      // Save to localStorage
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      registeredUsers.push({
        username: username,
        password: password
      });
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      
      // Show success and auto-login then redirect to main page
      regSuccess.textContent = '✓ Registration successful! Signing you in...';
      form.style.opacity = '0.6';
      form.style.pointerEvents = 'none';
      
      // Auto-login: set auth and current user
      try { localStorage.setItem('isAdmin', 'true'); } catch (e) {}
      try { localStorage.setItem('currentUser', username); } catch (e) {}

      setTimeout(() => {
        location.replace('index.html');
      }, 1200);
    });
  }
  
  // Modal handlers
  const modal = document.getElementById('userExistsModal');
  const goToLoginBtn = document.getElementById('goToLoginBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  
  function showUserExistsModal() {
    modal.removeAttribute('hidden');
  }
  
  function closeModal() {
    modal.setAttribute('hidden', '');
    regUsername.focus();
  }
  
  if (goToLoginBtn) {
    goToLoginBtn.addEventListener('click', () => {
      location.replace('login.html');
    });
  }
  
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }
  
  // Close modal when clicking outside
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }
});
