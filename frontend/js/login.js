const form = document.getElementById('login-form');
const status = document.getElementById('status');

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
        status.textContent = json.error;
        return;
    }

    localStorage.setItem('user', JSON.stringify(json.user));
    window.location.href = 'profile.html';
});

