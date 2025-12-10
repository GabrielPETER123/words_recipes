const express = require('express');
const router = express.Router();

const recipes = require('../controllers/recipes');

router.get('/', recipes.listRecipes);
router.post('/', recipes.createRecipe);
router.put('/:id', recipes.editRecipe);
router.delete('/:id', recipes.removeRecipe);

module.exports = router;