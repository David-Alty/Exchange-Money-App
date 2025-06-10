const ADMIN_PASSWORD = "parwan2024"; // Şifrenizi değiştirin

// Şifre giriş formu için
const loginForm = document.getElementById('adminLoginForm');
if (loginForm) {
  loginForm.onsubmit = function(e) {
    e.preventDefault();
    const pass = document.getElementById('adminPassword').value;
    const errorDiv = document.getElementById('loginError');
    if (pass === ADMIN_PASSWORD) {
      errorDiv.textContent = "";
      sessionStorage.setItem('admin-auth', 'ok');
      window.location.href = "admin-panel.html";
    } else {
      errorDiv.textContent = "رمز عبور اشتباه است!";
    }
  };
}

// admin-panel.html'ye şifresiz erişimi engelle
if (window.location.pathname.endsWith('admin-panel.html')) {
  if (sessionStorage.getItem('admin-auth') !== 'ok') {
    window.location.replace("admin-login.html");
  }
}
