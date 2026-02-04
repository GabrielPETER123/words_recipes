const form = document.getElementById('login-form');
const statusEl = document.getElementById('status');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(form));

    const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    const json = await res.json();

    if (!res.ok) {
        statusEl.textContent = json.error;
        return;
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    window.location.href = 'index.html';

});

