const {
	createUsersTable,
	insertUser,
	queryAllUsers,
	queryUserById,
	queryUsersByFilter,
	updateUser,
	deleteUser
} = require('../models/users');

// Ensure the table exists when the controller is first loaded
createUsersTable();

const requireFields = (user) => {
	const { first_name, last_name, email, location } = user || {};
	return Boolean(first_name && last_name && email && location);
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
	const { first_name, last_name, email, location } = req.body || {};
	
	if (!requireFields({ first_name, last_name, email, location })) {
		return res.status(400).json({ error: 'first_name, last_name, email and location are required' });
	}

	try {
		// Get image path if a file was uploaded
		const image_path = req.file ? `/img/users/${req.file.filename}` : null;
		const result = await insertUser({ first_name, last_name, email, location, image_path });
		res.status(201).json({ id: result.id, message: 'User created' });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Failed to create user' });
	}
}

async function editUsers(req, res) {
	const { id } = req.params;
	const { first_name, last_name, email, location, image_path = null } = req.body || {};

	if (!id) {
		return res.status(400).json({ error: 'id param is required' });
	};
	if (!requireFields({ first_name, last_name, email, location })) {
		return res.status(400).json({ error: 'first_name, last_name, email and location are required' });
	};

	try {
		const result = await updateUser(Number(id), { first_name, last_name, email, location, image_path });
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

module.exports = {
	listUsers,
	getUser,
	createUser,
	editUsers,
	removeUser
};


