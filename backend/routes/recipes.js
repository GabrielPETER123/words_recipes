const express = require('express');
const isAuthenticated = require('../middlewares/isAuthenticated');
const router = express.Router();
const upload = require('../middlewares/upload');
const recipes = require('../controllers/recipes');

router.get('/', recipes.listRecipes);
router.get('/:id', recipes.getRecipe);
router.post('/',isAuthenticated, (req, res, next) => {
	upload.single('image')
}, recipes.createRecipe);

router.put('/:id',isAuthenticated, (req, res, next) => 
	upload.single('image'), recipes.editRecipe);
router.delete('/:id', isAuthenticated, recipes.removeRecipe);

module.exports = router;