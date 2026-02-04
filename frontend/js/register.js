const form = document.getElementById('register-form');
const statusEl = document.getElementById('status');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(form));

    const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    const json = await res.json();

    if (!res.ok) {
        statusEl.textContent = json.error;
        return;
    }

    window.location.href = 'login.html';
});
