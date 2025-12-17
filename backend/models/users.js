const sqlite3 = require('sqlite3').verbose();

//Connect to the DB
const db = new sqlite3.Database("./words_recipes.db", sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) return console.error(err.message);
    return console.log("USERS CONNECT TO DB");
});

//!Create table
function createUsersTable(){
    let sql = `CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY NOT NULL,
        first_name TEXT,
        last_name TEXT,
        email TEXT,
        location TEXT,
        image_path TEXT
    )`;
    db.run(sql, (err) => {
        if (err) return console.error(err.message);
    });
};


function insertUser(user){
    let sql = `INSERT INTO users(first_name, last_name, email, location, image_path) VALUES (?,?,?,?,?)`;
    return new Promise((resolve, reject) => {
        db.run(sql, [user.first_name, user.last_name, user.email, user.location, user.image_path], function(err) {
            if (err) return reject(err);
            resolve({ id: this.lastID });
        });
    });
};

function queryAllUsers(){
    let sql = `SELECT * FROM users`;
    return new Promise((resolve, reject) => {
        db.all(sql, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

function queryUserById(id){
    let sql = `SELECT * FROM users WHERE id = ?`;
    return new Promise((resolve, reject) => {
        db.get(sql, [id], (err, row) => {
            if (err) return reject(err);
            resolve(row || null);
        });
    });
};

function queryUsersByFilter(search){
    let sql = `SELECT * FROM users WHERE first_name = ? OR last_name = ? OR location = ?`;
    return new Promise((resolve, reject) => {
        db.all(sql, [search, search, search], (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

function updateUser(id, updatedUser){
    let sql = `UPDATE users SET first_name = ?, last_name = ?, email = ?, location = ?, image_path = ? WHERE id = ?`;
    return new Promise((resolve, reject) => {
        db.run(sql, [updatedUser.first_name, updatedUser.last_name, updatedUser.email, updatedUser.location, updatedUser.image_path, id], function(err) {
            if (err) return reject(err);
            resolve({ changes: this.changes });
        });
    });
};

function deleteUser(id){
    let sql = `DELETE FROM users WHERE id = ?`;
    return new Promise((resolve, reject)=>{
        db.run(sql, [id], function(err){
            if (err) return reject(err);
            resolve({ changes: this.changes });
        });
    });
};

module.exports = {
    db,
    createUsersTable,
    insertUser,
    queryAllUsers,
    queryUserById,
    queryUsersByFilter,
    updateUser,
    deleteUser
};
