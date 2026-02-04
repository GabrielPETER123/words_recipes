const jwt = require('jsonwebtoken');
const SECRET = 'super_secret_key';

function isAuthenticated(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth) {
        return res.status(401).json({ error: 'Non authentifié' });
    }

    const token = auth.split(' ')[1];

    try {
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded; // { id, email }
        next();
    } catch {
        res.status(401).json({ error: 'Token invalide' });
    }
}

module.exports = isAuthenticated;
