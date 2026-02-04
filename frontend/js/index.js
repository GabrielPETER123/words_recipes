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
            <button onclick=deleteRecipe(${recipe.id})>Supprimer la recette</button>
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
