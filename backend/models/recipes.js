const sqlite3 = require('sqlite3').verbose();

//Connect to the DB
const db = new sqlite3.Database("./words_recipes.db", sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) return console.error(err.message);
    return console.log("RECIPES CONNECT TO DB");
});

//!Create table
function createRecipesTable(){
    let sql = `CREATE TABLE IF NOT EXISTS recipes(
        id INTEGER PRIMARY KEY NOT NULL,
        name TEXT,
        description TEXT,
        image_path TEXT,
        author TEXT
    )`;
    db.run(sql, (err) => {
        if (err) return console.error(err.message);
    });
};
    
/**
 * Function to insert a recipe in the DB
 * @param {object} recipe - Recipe struct(name, desc, img_url and author)
 * @exemple insertRecipe({"name": "Ratatouille", "description": "there is vegetables", "author": "michel michel"})
 */
function insertRecipe(recipe){
    let sql = `INSERT INTO recipes(name, description, image_path, author) VALUES (?,?,?,?)`;
    return new Promise((resolve, reject) => {
        db.run(sql, [recipe.name, recipe.description, recipe.image_path, recipe.author], function(err) {
            if (err) return reject(err);
            resolve({ id: this.lastID });
        });
    });
};

/**
 * Query all recipes from DB
 * @returns {object[]} - A list of Recipes
 */
function queryAllRecipes(){
    let sql = `SELECT * FROM recipes`;
    return new Promise((resolve, reject) => {
        db.all(sql, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

/**
 * Query one recipe by id
 * @param {number} id - Recipe Id
 * @returns {object|null} - Single recipe or null if not found
 */
function queryRecipeById(id){
    let sql = `SELECT * FROM recipes WHERE id = ?`;
    return new Promise((resolve, reject) => {
        db.get(sql, [id], (err, row) => {
            if (err) return reject(err);
            resolve(row || null);
        });
    });
};

/**
 * Query recipes corresponding to a search 
 * @param {string} search - Filter to find corresponding Recipes
 * @returns {object[]} - A list of Recipes
 * @example queryRecipesByFilter("tarte")
 */
function queryRecipesByFilter(search){
    let sql = `SELECT * FROM recipes WHERE name = ? OR author = ?`;
    return new Promise((resolve, reject) => {
        db.all(sql, [search, search], (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

/**
 * Update one recipe in the DB
 * @param {int} id - Recipe Id
 * @param {object[]} updatedRecipe - Recipe struct(name, desc, img_url, author)
 * @example updateRecipe(1, {"name": "tarte au pommes", "description": "il y a des pommes", "image_path": "../img/1.png", "author": "martine longeant"})
 */
function updateRecipe(id, updatedRecipe){
    let sql = `UPDATE recipes SET name = ?, description = ?, image_path = ?, author = ? WHERE id = ?`;
    return new Promise((resolve, reject) => {
        db.run(sql, [updatedRecipe.name, updatedRecipe.description, updatedRecipe.image_path, updatedRecipe.author, id], function(err) {
            if (err) return reject(err);
            resolve({ changes: this.changes });
        });
    });
};

/**
 * Delete recipe from the DB
 * @param {int} id - Recipe Id
 * @exemple deleteRecipe(3)
 */
function deleteRecipe(id){
    let sql = `DELETE FROM recipes WHERE id = ?`;
    return new Promise((resolve, reject)=>{
        db.run(sql, [id], function(err){
            if (err) return reject(err);
            resolve({ changes: this.changes });
        });
    });
};

module.exports = {
    db,
    createRecipesTable,
    insertRecipe,
    queryAllRecipes,
    queryRecipeById,
    queryRecipesByFilter,
    updateRecipe,
    deleteRecipe
};
