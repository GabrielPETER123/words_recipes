const express = require('express');
const router = express.Router();

const users = require('../controllers/users');

router.get('/', users.listUsers);
router.get('/:id', users.getUser);
router.post('/', (req, res, next) => {
    // Use multer middleware to handle single file upload with field name 'image'
    req.upload.single('image')(req, res, (err) => {
        if (err) return res.status(400).json({ error: 'File upload error' });
        next();
    });
}, users.createUser);
router.put('/:id', users.editUsers);
router.delete('/:id', users.removeUser);

module.exports = router;