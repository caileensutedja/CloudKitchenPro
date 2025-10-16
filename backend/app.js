/*
Application Backend
 */
// ============================================
// IMPORTS
// ============================================
// Modules
let express = require("express");
let path = require("path");
const { connectToMongoDB } = require('./db/connection');

let app = express();
const PORT = 8080;

app.use(express.urlencoded({ extended: true }));

app.use("/css", express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")));
app.use("/js", express.static(path.join(__dirname, "node_modules/bootstrap/dist/js")));

// USE BOOTSTRAP
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap')));
app.use('/bootstrap-icons', express.static(path.join(__dirname, 'node_modules/bootstrap-icons')));

// USE PUBLIC FOLDER FILES
app.use(express.static('public'));
app.use(express.static("public/imgs"));
app.use(express.static("public/css"));

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ============================================
// ROUTE IMPORTS
// ============================================
// USER
const userRouter = require('./routes/user');
app.use('/34375783/user', userRouter)

// RECIPE
const recipeRouter = require('./routes/recipe');
app.use('/34375783/recipe', recipeRouter)

// INVENTORY
const inventoryRouter = require('./routes/inventory');
app.use('/34375783/inventory', inventoryRouter)

//OTHERS
const otherRouter = require('./routes/other');
app.use('/34375783', otherRouter)

// ============================================
// ROUTES
// ============================================

// LOGIN PAGE
app.get("/34375783", function (req, res) {
	res.render("login", {message: null});
});
// If base root is allowed
app.get("/", function (req, res) {
	res.render("login", {message: null});
});

/**
 * Error endpoint
 */
// Works for all HTTP methods and avoids issues with the new route parser
// Inspired By Lab 4 Code
app.use((req, res) => {
    res.status(404).render("404", {errorMsg: 'Page not found.'});
});

// ============================================
// CONNECT TO DATABASE
// ============================================
async function startServer() {
    try {
        await connectToMongoDB();
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}/34375783`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();