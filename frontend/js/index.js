const RECIPE_API_URL = '/api/recipes';

const listEl = document.getElementById('recipes-list');
const statusEl = document.getElementById('status');
const searchInput = document.getElementById('search');

const setStatus = (message = '') => {
    statusEl.textContent = message;
};

async function getRecipeFilePath(recipeId) {
  try {
    const response = await fetch(`${RECIPE_API_URL}/${recipeId}`);
    const recipe = await response.json();
    return recipe.image_path;
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return null;
  }
};

async function deleteRecipe(recipeId) {
    try {
        const response = await fetch(`${RECIPE_API_URL}/${recipeId}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            loadRecipes();
        };
    } catch {
        setStatus('Erreur lors de la suppression');
    };
};


const renderRecipes = (recipes) => {
    listEl.innerHTML = '';

    recipes.forEach(recipe => {
        const li = document.createElement('li');

        li.innerHTML = `
            <h3>${recipe.name}</h3>
            <p>${recipe.description}</p>
            <small>Auteur : ${recipe.author}</small>
            ${recipe.image_path ? `<img src="${recipe.image_path}" width="150">` : ''}

            <div>
                <button class="edit-btn" data-id="${recipe.id}">Modifier</button>
                <button class="delete-btn" data-id="${recipe.id}">Supprimer</button>
            </div>

            <form class="edit-form" data-id="${recipe.id}" style="display:none">
                <input type="text" name="name" value="${recipe.name}" required>
                <textarea name="description" required>${recipe.description}</textarea>
                <input type="file" name="image" accept="image/png,image/jpeg">
                <button type="submit">Enregistrer</button>
                <button type="button" class="cancel-btn">Annuler</button>
            </form>
        `;
        listEl.appendChild(li);
    });
};

const loadRecipes = async (search = '') => {
    try {
        setStatus('Chargement...');
        const url = search ? `${RECIPE_API_URL}?search=${search}` : RECIPE_API_URL;
        const res = await fetch(url);
        const data = await res.json();
        renderRecipes(data);
        setStatus(data.length ? '' : 'Aucune recette');
    } catch {
        setStatus('Erreur de chargement');
    }
};

document.getElementById('search-btn').onclick = () => {
    loadRecipes(searchInput.value.trim());
};

document.getElementById('reset-btn').onclick = () => {
    searchInput.value = '';
    loadRecipes();
};

loadRecipes();

listEl.addEventListener('click', async (e) => {
    const id = e.target.dataset.id;

    // SUPPRESSION
    if (e.target.classList.contains('delete-btn')) {
        if (!confirm('Supprimer cette recette ?')) return;

        const res = await fetch(`/api/recipes/${id}`, {
            method: 'DELETE'
        });

        if (res.ok) {
            loadRecipes(searchInput.value.trim());
        } else {
            setStatus('Erreur lors de la suppression');
        }
    }

    // MODIFICATION
    if (e.target.classList.contains('edit-btn')) {
        const li = e.target.closest('li');
        li.querySelector('.edit-form').style.display = 'block';
        e.target.style.display = 'none';
    }

    // ANNULER
    if (e.target.classList.contains('cancel-btn')) {
        const li = e.target.closest('li');
        li.querySelector('.edit-form').style.display = 'none';
        li.querySelector('.edit-btn').style.display = 'inline';
    }
});

listEl.addEventListener('submit', async (e) => {
    if (!e.target.classList.contains('edit-form')) return;

    e.preventDefault();

    const form = e.target;
    const id = form.dataset.id;

    const formData = new FormData(form);

    const res = await fetch(`/api/recipes/${id}`, {
        method: 'PUT',
        body: formData
    });

    if (res.ok) {
        loadRecipes(searchInput.value.trim());
    } else {
        setStatus('Erreur lors de la modification');
    }
});


