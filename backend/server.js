const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Serve static frontend files from ../frontend
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Serve index.html for root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// 404 for other requests
app.use((req, res) => {
    res.status(404).send('Not Found');
});

app.listen(port, () => {
    console.log(`Server (backend + static frontend) is listening on port ${port}`);
});
