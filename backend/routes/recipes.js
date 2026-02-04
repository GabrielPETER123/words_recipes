const express = require('express');
const router = express.Router();

const recipes = require('../controllers/recipes');

router.get('/', recipes.listRecipes);
router.get('/:id', recipes.getRecipe);
router.post('/', (req, res, next) => {
	// Use multer middleware to handle single file upload with field name 'image'
	req.upload.single('image')(req, res, (err) => {
		if (err) return res.status(400).json({ error: 'File upload error' });
		next();
	});
}, recipes.createRecipe);

router.put('/:id', (req, res, next) => 
	req.upload.single('image')(req, res, next), recipes.editRecipe);
router.put('/:id', recipes.editRecipe);
router.delete('/:id', recipes.removeRecipe);

module.exports = router;