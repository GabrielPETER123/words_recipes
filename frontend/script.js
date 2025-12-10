const API_URL = '/api/recipes';
const form = document.getElementById('recipe-form');
const listEl = document.getElementById('recipes-list');
const statusEl = document.getElementById('status');
const searchInput = document.getElementById('search');

const setStatus = (message) => {
	statusEl.textContent = message || '';
};

const renderRecipes = (recipes) => {
	listEl.innerHTML = '';
	recipes.forEach((recipe) => {
		const li = document.createElement('li');
		li.dataset.id = recipe.id;
		li.innerHTML = `<strong>${recipe.name}</strong> — ${recipe.author}<br/><small>${recipe.description}</small>`;

		const deleteBtn = document.createElement('button');
		deleteBtn.textContent = 'Supprimer';
		deleteBtn.addEventListener('click', () => deleteRecipe(recipe.id));

		li.appendChild(deleteBtn);
		listEl.appendChild(li);
	});
};

const loadRecipes = async (search = '') => {
	try {
		setStatus('Chargement...');
		const url = search ? `${API_URL}?search=${encodeURIComponent(search)}` : API_URL;
		const res = await fetch(url);
		if (!res.ok) throw new Error('Impossible de récupérer les recettes');
		const data = await res.json();
		renderRecipes(data);
		setStatus(data.length ? '' : 'Aucune recette');
	} catch (err) {
		setStatus(err.message);
	}
};

const deleteRecipe = async (id) => {
	try {
		const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
		if (!res.ok) throw new Error('Suppression impossible');
		await loadRecipes(searchInput.value.trim());
	} catch (err) {
		setStatus(err.message);
	}
};

if (form) {
	form.addEventListener('submit', async (e) => {
		e.preventDefault();
		const formData = new FormData(form);
		const payload = Object.fromEntries(formData.entries());

		try {
			const res = await fetch(API_URL, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});

			if (!res.ok) throw new Error('Création impossible (vérifiez les champs)');
			form.reset();
			await loadRecipes();
		} catch (err) {
			setStatus(err.message);
		}
	});
}

document.getElementById('search-btn')?.addEventListener('click', () => {
	loadRecipes(searchInput.value.trim());
});

document.getElementById('reset-btn')?.addEventListener('click', () => {
	searchInput.value = '';
	loadRecipes();
});

loadRecipes();
