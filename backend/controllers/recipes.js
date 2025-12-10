const {
	createRecipesTable,
	insertRecipe,
	queryAllRecipes,
	queryRecipeById,
	queryRecipesByFilter,
	updateRecipe,
	deleteRecipe
} = require('../models/db');

// Ensure the table exists when the controller is first loaded
createRecipesTable();

const requireFields = (recipe) => {
	const { name, description, author } = recipe || {};
	return Boolean(name && description && author);
};

async function listRecipes(req, res) {
	try {
		const { search } = req.query;
		const rows = search ? await queryRecipesByFilter(search) : await queryAllRecipes();
		res.status(200).json(rows);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Failed to fetch recipes' });
	}
}

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
	}
}

async function createRecipe(req, res) {
	const { name, description, image_url = null, author } = req.body || {};
	if (!requireFields({ name, description, author })) {
		return res.status(400).json({ error: 'name, description, and author are required' });
	}

	try {
		const result = await insertRecipe({ name, description, image_url, author });
		res.status(201).json({ id: result.id, message: 'Recipe created' });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Failed to create recipe' });
	}
}

async function editRecipe(req, res) {
	const { id } = req.params;
	const { name, description, image_url = null, author } = req.body || {};

	if (!id) {
		return res.status(400).json({ error: 'id param is required' });
	}
	if (!requireFields({ name, description, author })) {
		return res.status(400).json({ error: 'name, description, and author are required' });
	}

	try {
		const result = await updateRecipe(Number(id), { name, description, image_url, author });
		if (!result.changes) return res.status(404).json({ error: 'Recipe not found' });
		res.status(200).json({ message: 'Recipe updated' });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Failed to update recipe' });
	}
}

async function removeRecipe(req, res) {
	const { id } = req.params;
	if (!id) return res.status(400).json({ error: 'id param is required' });

	try {
		const result = await deleteRecipe(Number(id));
		if (!result.changes) return res.status(404).json({ error: 'Recipe not found' });
		res.status(200).json({ message: 'Recipe deleted' });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Failed to delete recipe' });
	}
}

module.exports = {
	listRecipes,
	getRecipe,
	createRecipe,
	editRecipe,
	removeRecipe
};
