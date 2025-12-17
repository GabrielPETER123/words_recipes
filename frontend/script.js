const RECIPE_API_URL = '/api/recipes';
const USER_API_URL = '/api/users';
const recipe_form = document.getElementById('recipe-form');
const user_form = document.getElementById('user-form');
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
		
		let imageHTML = '';
		if (recipe.image_path) {
			imageHTML = `<br/><img src="${recipe.image_path}" alt="${recipe.name}" style="max-width: 150px; max-height: 150px;">`;
		};
		
		li.innerHTML = `<strong>${recipe.name}</strong> — ${recipe.author}<br/><small>${recipe.description}</small>${imageHTML}`;

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
		const url = search ? `${RECIPE_API_URL}?search=${encodeURIComponent(search)}` : RECIPE_API_URL;
		const res = await fetch(url);
		if (!res.ok) throw new Error('Impossible de récupérer les recettes');
		const data = await res.json();
		renderRecipes(data);
		setStatus(data.length ? '' : 'Aucune recette');
	} catch (err) {
		setStatus(err.message);
	};
};

const deleteRecipe = async (id) => {
	try {
		const res = await fetch(`${RECIPE_API_URL}/${id}`, { method: 'DELETE' });
		if (!res.ok) throw new Error('Suppression impossible');
		await loadRecipes(searchInput.value.trim());
	} catch (err) {
		setStatus(err.message);
	};
};

if (recipe_form) {
	recipe_form.addEventListener('submit', async (e) => {
		e.preventDefault();
		const formData = new FormData(recipe_form);

		try {
			const res = await fetch(RECIPE_API_URL, {
				method: 'POST',
				body: formData
			});

			if (!res.ok) throw new Error('Création impossible (vérifiez les champs)');
			recipe_form.reset();
			await loadRecipes();
		} catch (err) {
			setStatus(err.message);
		};
	});
};

if (user_form) {
	user_form.addEventListener('submit', async (e) => {
		e.preventDefault();
		const formData = new FormData(user_form);
		try {
			const res = await fetch(USER_API_URL, {
				method: 'POST',
				body: formData
			});

			if (!res.ok) throw new Error("Création d'un utilisateur impossible (vérifiez les champs)");
			user_form.reset();
		} catch (err) {
			setStatus(err.message);
		};
	});
};

document.getElementById('search-btn')?.addEventListener('click', () => {
	loadRecipes(searchInput.value.trim());
});

document.getElementById('reset-btn')?.addEventListener('click', () => {
	searchInput.value = '';
	loadRecipes();
});

loadRecipes();
