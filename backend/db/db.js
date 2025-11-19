const sqlite3 = require('sqlite3').verbose();

//Connect to the DB
const db = new sqlite3.Database("./words_recipes.db", sqlite3.OPEN_READWRITE, (err)=> {
    if (err) return console.error(err.message);
    return console.log("CONNECT TO DB")
});

//Create table
function createRecipesTable(){
    let sql = `CREATE TABLE IF NOT EXISTS recipes(
        id INTEGER PRIMARY KEY NOT NULL,
        name TEXT,
        description TEXT,
        image_url TEXT,
        author TEXT
    )`;
    db.run(sql, (err) => {
        if (err) return console.error(err.message);
    });
}
    

/**
 * Function to insert a recipe in the DB
 * @param {*} recipe - Recipe struct with name, desc, img_url and author*
 * @exemple insertRecipe({"name": "Ratatouille", "description": "there is vegetables", "author": "michel michel"})
 */
function insertRecipe(recipe){
    let sql = `INSERT INTO recipes(name, description, image_url, author) VALUES (?,?,?,?)`;
    db.run(sql, [recipe.name, recipe.description, recipe.image_url, recipe.author], (err)=>{
        if (err) return console.error(err.message)
    })
};

function queryAllRecipes(){
    let sql = `SELECT * FROM recipes`
    db.all(sql, [], (err, rows)=>{
        if (err) return console.error(err.message);
        rows.forEach(row=>{
            console.log(row);
        })
    })
};

function queryRecipesByFilter(search){
    let sql = `SELECT * FROM recipes WHERE name = ${search} OR author = ${search}}`
};