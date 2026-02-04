const fs = require('fs').promises;

const {
	createRecipesTable,
	insertRecipe,
	queryAllRecipes,
	queryRecipeById,
	queryRecipesByFilter,
	updateRecipe,
	deleteRecipe
} = require('../models/recipes');

// Ensure the table exists when the controller is first loaded
createRecipesTable();


const requireFields = (recipe) => {
	const { name, description } = recipe || {};
	return Boolean(name && description);
};

async function listRecipes(req, res) {
	try {
		const { search } = req.query;
		const rows = search ? await queryRecipesByFilter(search) : await queryAllRecipes();
		res.status(200).json(rows);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Failed to fetch recipes' });
	};
};

async function getRecipe(req, res) {
	const { id } = req.params;
	if (!id) return res.status(400).json({ error: 'id param is required' });

	try {
		const row = await queryRecipeById(Number(id));
		if (!row) return res.status(404).json({ error: 'Recipe not found' });
		res.status(200).json(row);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Failed to fetch recipe' });
	};
};

async function createRecipe(req, res) {
	const { name, description} = req.body || {};
	if (!requireFields({ name, description })) {
		return res.status(400).json({ error: 'recipe name and description are required' });
	};

	try {
		// Get image path if a file was uploaded
		const image_path = req.file ? `/img/recipes/${req.file.filename}` : null;
		const result = await insertRecipe({ name, description, image_path, author : 'Anonyme' });
		res.status(201).json({ id: result.id, message: 'Recipe created' });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Failed to create recipe' });
	};
};

async function editRecipe(req, res) {
	const { id } = req.params;
	const { name, description } = req.body || {};

	if (!id) {
		return res.status(400).json({ error: 'id param is required' });
	};
	if (!requireFields({ name, description })) {
		return res.status(400).json({ error: 'name and description are required' });
	};

	try {
		const image_path = req.file? `/img/recipes/${req.file.filename}` : null;
		const result = await updateRecipe(Number(id), { name, description, image_path, author : 'Anonyme'});
		if (!result.changes) return res.status(404).json({ error: 'Recipe not found' });
		res.status(200).json({ message: 'Recipe updated' });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Failed to update recipe' });
	};
};

async function removeRecipe(req, res) {
	const { id } = req.params;
	if (!id) return res.status(400).json({ error: 'id param is required' });

	try {
		// Fetch the recipe to get image_path
		const recipe = await queryRecipeById(Number(id));
		if (!recipe) return res.status(404).json({ error: 'Recipe not found' });

		// Delete the image file if it exists
		if (recipe.image_path) {
			try {
				const imagePath = `../words_recipes/frontend/${recipe.image_path}`;
				await fs.unlink(imagePath);
				console.log('Image file deleted:', imagePath);
			} catch (fileErr) {
				console.warn('Warning: Could not delete image file:', fileErr.message);
			}
		}

		// Delete the recipe from database
		const result = await deleteRecipe(Number(id));
		res.status(200).json({ message: 'Recipe deleted' });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Failed to delete recipe' });
	};
};

module.exports = {
	listRecipes,
	getRecipe,
	createRecipe,
	editRecipe,
	removeRecipe
};
