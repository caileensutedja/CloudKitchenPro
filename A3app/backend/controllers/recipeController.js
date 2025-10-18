const Recipe = require('../models/recipe');
const User = require('../models/user');

// ============================================
// RECIPE CONTROLLERS
// ============================================
module.exports = {
    getCreateRecipe: async function (req, res){
    //     try {
    //     const { role, userId, fullname, email } = req.query;
    //     res.render('add-recipe', {
    //         role, 
    //         userId, 
    //         fullname, 
    //         email,
    //         message: null
    //     });
    // } catch (error) {
    //     console.error(error);
    //     res.status(500).render("404", {errorMsg: 'Server Error'})
    // }
        res.status(500).json({ errorMsg: 'Angular frontend error' });

    },
    createRecipe: async function(req, res){
        try {
            let { role, userId, fullname, email } = req.query;
            let { title, ingredients, instructions, mealType, cuisineType, prepTime, difficulty, servings} = req.body;
            let recipeId = await nextRecipeId();

            // Verify user ID exists - userId
            let user = await User.findOne({userId: userId});
            if (!user) {
                return res.status(400).send('Selected user ID does not exist');
            }
            let chef = fullname;

            // Ingredients
            // Trim to remove excess whitespace and filters empty objects in the array
            rawIngredients = ingredients.split(",").map(ingredients => ingredients.trim()).filter(ingredients => ingredients !== "");
            // Map each ingredient to parse it to get quantity, unit, name
            ingredients = rawIngredients.map(parseIngredient);
            // Instructions
            instructions = instructions.split(",").map(instruction => instruction.trim()).filter(instruction => instruction !== "");

            let newRecipe = new Recipe({
            recipeId,
            userId: user._id,
            title,
            chef,
            ingredients,
            instructions,
            mealType,
            cuisineType,
            prepTime,
            difficulty,
            servings
            });
            await newRecipe.save();
            let message=  `Recipe ${newRecipe.recipeId} added!`
            res.redirect(`/34375783/recipe/view?role=${role}&userId=${encodeURIComponent(userId)}&fullname=${encodeURIComponent(fullname)}&email=${encodeURIComponent(email)}&message=${encodeURIComponent(message)}`);

        } catch (error) {
            console.error(error);

            // Handle Mongoose validation errors
            if (error.name === 'ValidationError') {
                let { role, userId, fullname, email } = req.query;

                const errors = Object.values(error.errors).map(err => err.message);
                const errorMessage = '*' + errors.join('<br>*');
                
                return res.render('add-recipe', {
                    role, 
                    userId, 
                    fullname, 
                    email,
                    message: errorMessage
                });
            }

            // Handle duplicate key error (11000 is the code for duplicates)
            if (error.code === 11000) {
                let { role, userId, fullname, email } = req.query;
                const nextId = await nextRecipeId();
                const users = await User.find({}).sort({ userId: 1,  fullname: 1});

                const dupField = Object.keys(error.keyValue)[0]; // Field of duplicate
                const dupValue = error.keyValue[dupField]; // Value of duplicate
                const errorMessage = `Duplicate recipe ${dupField}: "${dupValue}" already exists for this user, please try again`;
                return res.render('add-recipe', {
                    role,
                    userId,
                    fullname,
                    email,
                    message: errorMessage,
                    nextRecipeId: nextId,
                    users: users
                });
            }
            res.status(500).render("404", {errorMsg: 'Server Error'})
        }
    },
    getViewRecipe: async function(req, res){
        try {
            const { role, userId, fullname, email } = req.query;

            let recipes = await Recipe.find().populate("userId")
            let count = await Recipe.countDocuments();
            // Turn it back to human readable form
            recipes = recipes.map(recipe => {
                return {
                    ...recipe.toObject(),
                    ingredientsString: recipe.ingredients.map(each => `${each.quantity}${each.unit} ${each.name}`).join('<br>'),
                    instructionsString: recipe.instructions.join('<br>'),
                    createdAtString: recipe.createdAt.toISOString().split('T')[0]
                };
                });
            res.render('view-recipe', {
                role, userId, fullname, email,
                count,
                message: null,
                recipes: recipes
            });
        } catch (error) {
            console.error(error);
            res.status(500).render("404", {errorMsg: 'Server Error'})
        }
    },
    getDeleteRecipe: async function(req, res){
        try {
            const { role, userId, fullname, email } = req.query;
            let user = await User.findOne({userId: userId});
            let recipes = await Recipe.find({userId: user._id}).sort({ recipeId: 1}).populate('userId');
            // Turn it back to human readable form
            recipes = recipes.map(recipe => {
                return {
                    ...recipe.toObject(),
                    ingredientsString: recipe.ingredients.map(each => `${each.quantity}${each.unit} ${each.name}`).join('<br>'),
                    instructionsString: recipe.instructions.join('<br>'),
                    createdAtString: recipe.createdAt.toISOString().split('T')[0]
                };
                });
            res.render('delete-recipe', {
                role, 
                userId, 
                fullname, 
                email,
                recipes
            });
        } catch (error) {
            console.error(error);
            res.status(500).render("404", {errorMsg: 'Server Error'})
        }
    },
    deleteRecipe: async function (req, res) {
        try {
            const { role, userId, fullname, email } = req.query;
            let { deleteRecipeId } = req.body;
            
            // Verify recipe ID exists - recipeId
            let recipeDeleted = await Recipe.findByIdAndDelete(deleteRecipeId);
            if (!recipeDeleted) {
                return res.status(404).send('Recipe is not found');
            }

            let message = `Recipe ${recipeDeleted.recipeId} deleted!`
            res.redirect(`/34375783/inventory/view?role=${role}&userId=${encodeURIComponent(userId)}&fullname=${encodeURIComponent(fullname)}&email=${encodeURIComponent(email)}&message=${encodeURIComponent(message)}`);

        } catch (error) {
            console.error(error);
            res.status(500).render("404", {errorMsg: 'Server Error'})
        }
    },
    getEditRecipe: async function (req, res){
        try {
            const { role, userId, fullname, email, editId} = req.query;
            const recipe = await Recipe.findById(editId);
            if (!recipe) {
                return res.status(404).send('Recipe is not found');
            }
            recipe.ingredientsString = recipe.ingredients
                .map(each => `${each.quantity}${each.unit} ${each.name}`)
                .join(', ');
            recipe.instructionsString = recipe.instructions.join(', ');
            res.render('edit-recipe', { role, userId, fullname, email, recipe });
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
        }
    },
    editRecipe: async function (req, res) {
        try{
            let { role, userId, fullname, email } = req.query;
            let { editId, title, ingredients, instructions, mealType, cuisineType, prepTime, difficulty, servings} = req.body;
            let rawIngredients = ingredients.split(",").map(ingredients => ingredients.trim()).filter(ingredients => ingredients !== "");
            // Map each ingredient to parse it to get quantity, unit, name
            ingredients = rawIngredients.map(parseIngredient);
            // Instructions
            instructions = instructions.split(",").map(instruction => instruction.trim()).filter(instruction => instruction !== "");
            console.og
            const updateRecipe = await Recipe.findByIdAndUpdate(
                editId,
                {
                    title,
                    ingredients,
                    instructions,
                    mealType,
                    cuisineType,
                    prepTime,
                    difficulty,
                    servings,
                },
                { 
                    new: true,              // Return the updated document
                    runValidators: true     // Run schema validation
                }
            );
            if (!updateRecipe) {
                return res.status(404).send('Recipe not found');
            }
            let message = `Recipe ${updateRecipe.recipeId} updated!`
            res.redirect(`/34375783/recipe/view?role=${role}&userId=${encodeURIComponent(userId)}&fullname=${encodeURIComponent(fullname)}&email=${encodeURIComponent(email)}&message=${encodeURIComponent(message)}`);

        } catch (error) {
            console.error(error);

            // Handle Mongoose validation errors
            if (error.name === 'ValidationError') {
                let { role, userId, fullname, email } = req.query;
                let {editId} = req.body;
                // const users = await User.find({}).sort({ userId: 1,  fullname: 1});
                const recipe = await Recipe.findById(editId);
                if (recipe) {
                    recipe.ingredientsString = recipe.ingredients
                        .map(each => `${each.quantity}${each.unit} ${each.name}`)
                        .join(', ');
                    recipe.instructionsString = recipe.instructions.join(', ');
                }
                const errors = Object.values(error.errors).map(err => err.message);
                const errorMessage = '*' + errors.join('<br>*');
                
                return res.render('edit-recipe', {
                    role, 
                    userId, 
                    fullname, 
                    email,
                    message: errorMessage,
                    recipe
                });
            }

            // Handle duplicate key error (11000 is the code for duplicates)
            if (error.code === 11000) {
                let { role, userId, fullname, email } = req.query;
                const recipe = await Recipe.findById(editId);
                if (recipe) {
                    recipe.ingredientsString = recipe.ingredients
                        .map(each => `${each.quantity}${each.unit} ${each.name}`)
                        .join(', ');
                    recipe.instructionsString = recipe.instructions.join(', ');
                }

                const dupField = Object.keys(error.keyValue)[0]; // Field of duplicate
                const dupValue = error.keyValue[dupField]; // Value of duplicate
                const errorMessage = `Duplicate recipe ${dupField}: "${dupValue}" already exists for this user, please try again`;
                return res.render('edit-recipe', {
                    role, 
                    userId, 
                    fullname, 
                    email,
                    message: errorMessage,
                    recipe
                });
            }
            res.status(500).render("404", {errorMsg: 'Server Error'})
        }
    }
};

// ============================================
// HELPER FUNCTIONS
// ============================================
async function nextRecipeId() {
    const lastAdded = await Recipe.findOne()
    .sort({ recipeId: -1}) // descending
    .exec();

    let max = 0;
    if (lastAdded) {
        const num = parseInt(lastAdded.recipeId.split('-')[1]);
        // Only if num is not null, max is redefined
        if (!isNaN(num)) max = num;
    }
    const nextUserId = 'R-' + String(max + 1).padStart(5, '0');
    return nextUserId;
}

function parseIngredient(string) {
    // Get the quantity/unit part of the string
    const [first, ...rest] = string.trim().split(' ');

    // Find the pure quantity
    const quantityFind = first.match(/^\d*\.?\d+/);
    const quantity = quantityFind ? parseFloat(quantityFind[0]) : 1;

    // Find the unit
    const unit = quantityFind && first.length > quantityFind[0].length ? first.slice(quantityFind[0].length) : "pieces"

    const name = rest.join(' ').trim();
    return {quantity, unit, name}
}