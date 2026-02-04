const {
	createUsersTable,
	insertUser,
	queryAllUsers,
	queryUserById,
	queryUsersByFilter,
	updateUser,
	deleteUser,
	queryUserByEmail
} = require('../models/users');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET = 'super_secret_key';


// Ensure the table exists when the controller is first loaded
createUsersTable();

const requireFields = (user) => {
	const {name, email } = user || {};
	return Boolean(name && email );
};

async function listUsers(req, res) {
	try {
		const { search } = req.query;
		const rows = search ? await queryUsersByFilter(search) : await queryAllUsers();
		res.status(200).json(rows);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Failed to fetch users' });
	}
}

async function getUser(req, res) {
	const { id } = req.params;
	if (!id) return res.status(400).json({ error: 'id param is required' });

	try {
		const row = await queryUserById(Number(id));
		if (!row) return res.status(404).json({ error: 'User not found' });
		res.status(200).json(row);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Failed to fetch user' });
	};
};

async function createUser(req, res) {
	const { name, email } = req.body || {};
	
	if (!requireFields({ name, email })) {
		return res.status(400).json({ error: 'name and email are required' });
	}

	try {
		// Get image path if a file was uploaded
		const image_path = req.file ? `/img/users/${req.file.filename}` : null;
		const result = await insertUser({ name, email, image_path });
		res.status(201).json({ id: result.id, message: 'User created' });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Failed to create user' });
	}
}

async function editUsers(req, res) {
	const { id } = req.params;
	const { name, email, image_path = null } = req.body || {};

	if (!id) {
		return res.status(400).json({ error: 'id param is required' });
	};
	if (!requireFields({ name, email })) {
		return res.status(400).json({ error: 'name and email are required' });
	};

	try {
		const result = await updateUser(Number(id), { name, email, image_path });
		if (!result.changes) return res.status(404).json({ error: 'Users not found' });
		res.status(200).json({ message: 'User updated' });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Failed to update user' });
	};
};

async function removeUser(req, res) {
	const { id } = req.params;
	if (!id) return res.status(400).json({ error: 'id param is required' });

	try {
		const result = await deleteUser(Number(id));
		if (!result.changes) return res.status(404).json({ error: 'User not found' });
		res.status(200).json({ message: 'User deleted' });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Failed to delete user' });
	};
};



async function register(req, res) {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Champs manquants' });
    }
    try {
        const existing = await queryUserByEmail(email);
        if (existing) {
            return res.status(409).json({ error: 'Email déjà utilisé' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const image_path = req.file ? `/img/users/${req.file.filename}` : null;
        const result = await insertUser({
			name,
            email,
            password: hashedPassword,
            image_path
        });
        res.status(201).json({
            message: 'Utilisateur créé',
            userId: result.id
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

async function login(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email et mot de passe requis' });
    }
    try {
        const user = await queryUserByEmail(email);

        if (!user) {
            return res.status(401).json({ error: 'Identifiants invalides' });
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({ error: 'Identifiants invalides' });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                name: user.name  
            },
            SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Connexion réussie',
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}



module.exports = {
	listUsers,
	getUser,
	createUser,
	editUsers,
	removeUser,
	register,
	login
};


