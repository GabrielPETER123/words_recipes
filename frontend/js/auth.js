function getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

function isLoggedIn() {
    return !!localStorage.getItem('token');
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

function setupHeader() {
    const user = getUser();

    const loginLink = document.getElementById('login-link');
    const registerLink = document.getElementById('register-link');
    const profileLink = document.getElementById('profile-link');
    const logoutBtn = document.getElementById('logout-btn');
    const userLabel = document.getElementById('user-label');

    if (user) {
        userLabel.textContent = `👤 ${user.name}`;
        loginLink.style.display = 'none';
        registerLink.style.display = 'none';
        profileLink.style.display = 'inline';
        logoutBtn.style.display = 'inline';
    } else {
        userLabel.textContent = '';
        profileLink.style.display = 'none';
        logoutBtn.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', setupHeader);
