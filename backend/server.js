const express = require('express');
const app = express();
const path = require('path');
const recipesRouter = require('./routes/recipes');
const PORT = process.env.PORT || 8080;

app.use(express.json());

// API routes
app.use('/api/recipes', recipesRouter);

// Serve frontend assets
app.use(express.static(path.join(__dirname, '../frontend')));

// Fallback to index.html for root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is listening http://localhost:${PORT}`);
});