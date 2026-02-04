const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const recipesRouter = require('./routes/recipes');
const usersRouter = require('./routes/users');
const PORT = process.env.PORT || 8080;

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        try {
            const isUser = req.originalUrl && req.originalUrl.startsWith('/api/users');
            const isRecipe = req.originalUrl && req.originalUrl.startsWith('/api/recipes');
            const sub = isUser ? 'users' : (isRecipe ? 'recipes' : '');
            const baseDir = path.join(__dirname, '../backend/img');
            const dest = sub ? path.join(baseDir, sub) : baseDir;
            fs.mkdirSync(dest, { recursive: true });
            cb(null, dest);
        } catch (e) {
            cb(e);
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

app.use(express.json());

// Make multer available to routes
app.use((req, res, next) => {
    req.upload = upload;
    next();
});

// API routes
app.use('/api/recipes', recipesRouter);
app.use('/api/users', usersRouter)

// Serve uploaded images
app.use('/img', express.static(path.join(__dirname, 'img')));

// Serve frontend assets
app.use(express.static(path.join(__dirname, '../frontend')));

// Fallback to index.html for root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is listening http://localhost:${PORT}`);
});