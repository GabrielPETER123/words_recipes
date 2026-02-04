const form = document.getElementById('recipe-form');
const statusEl = document.getElementById('status');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    let res;
    try {
        res = await fetch('/api/recipes', {
            method: 'POST',
            headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`},
            body: formData
        });
    } catch (err) {
        statusEl.textContent = 'Erreur réseau';
        return;
    }

    let data = {};
    try {
        data = await res.json();
    } catch (err) {
        console.warn('Réponse non JSON');
    }

    console.log('status:', res.status);
    console.log('response:', data);

    if (!res.ok) {
        statusEl.textContent = data.error || 'Erreur lors de la création';
        return;
    }

    statusEl.style.color = 'green';
    statusEl.textContent = 'Recette créée avec succès 🎉';
    form.reset();
});

