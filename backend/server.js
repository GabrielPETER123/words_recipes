const express = require('express');
const app = express();
const path = require('path');
const PORT = 8080;

app.use(express.json())


app.listen(PORT, () => {
    console.log(`Server is listening http://localhost:${PORT}`);
});

app.get('/test', (req, res) => {
    res.status(200).send({
        "test": "test"
    })
});

app.post('/test/:id', (req, res) => {
    const { id } = req.params;
    const { other } = req.body;
});