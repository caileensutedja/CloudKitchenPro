const Recipe = require('../models/recipe');
const User = require('../models/user');

// ============================================
// RECIPE CONTROLLERS
// ============================================
module.exports = {
    getCreateRecipe: async function (req, res){
        res.status(500).json({ errorMsg: 'Angular frontend error' });
    },
    createRecipe: async function(req, res){
        try {
            const { recipe, user } = req.body;
            // let { role, userId, fullname, email } = req.query;
            let { title, ingredients, instructions, mealType, cuisineType, prepTime, difficulty, servings} = recipe;
            let recipeId = await nextRecipeId();

            // Verify user ID exists - userId
            let userFound = await User.findOne({userId: user.userId});
            if (!user) {
                return res.status(400).json({error: 'Selected user ID does not exist'});
            }
            let chef = user.fullname;

            // Ingredients
            // Trim to remove excess whitespace and filters empty objects in the array
            rawIngredients = ingredients.split(",").map(ingredients => ingredients.trim()).filter(ingredients => ingredients !== "");
            // Map each ingredient to parse it to get quantity, unit, name
            ingredients = rawIngredients.map(parseIngredient);
            // Instructions
            instructions = instructions.split(",").map(instruction => instruction.trim()).filter(instruction => instruction !== "");

            let newRecipe = new Recipe({
            recipeId,
            userId: userFound._id,
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
            res.status(200).json({message: `Recipe ${newRecipe.recipeId} added!`, newRecipe})
            // res.redirect(`/34375783/recipe/view?role=${role}&userId=${encodeURIComponent(userId)}&fullname=${encodeURIComponent(fullname)}&email=${encodeURIComponent(email)}&message=${encodeURIComponent(message)}`);
        } catch (error) {
            console.error(error);

            // Handle Mongoose validation errors
            if (error.name === 'ValidationError') {
                const errors = Object.values(error.errors).map(err => err.message);
                return res.status(400).json({error: errors})
            }

            // Handle duplicate key error (11000 is the code for duplicates)
            if (error.code === 11000) {
                const title = error.keyValue.title; // Field of duplicate
                const errorMessage = `Duplicate recipe "${title}" already exists for this user, please try again`;
                return res.status(400).json({
                    error: [errorMessage]
                })
            }
            res.status(500).json({error: 'Server Error'})
        }
    },
    getViewRecipe: async function(req, res){
        try {
            let recipes = await Recipe.find().populate("userId")
            let count = await Recipe.countDocuments();
            // Turn it back to human readable form
            recipes = recipes.map(recipe => {
                return {
                    ...recipe.toObject(),
                    userIdString: recipe.userId.userId,
                    ingredientsString: recipe.ingredients.map(each => `${each.quantity}${each.unit} ${each.name}`).join('<br>'),
                    instructionsString: recipe.instructions.join('<br>'),
                    createdAtString: recipe.createdAt.toISOString().split('T')[0]
                };
                });
            res.status(200).json({
                count,
                recipes: recipes
            })
        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Server Error'})
        }
    },
    getDeleteRecipe: async function(req, res){
        try {
            const { userId } = req.query;
            // console.log('user is: ', user)
            // const { role, userId, fullname, email } = user;
            // console.log('userId is: ', userId)
            let userFound = await User.findOne({userId: userId});
            let recipes = await Recipe.find({userId: userFound._id}).sort({ recipeId: 1}).populate('userId');
            // Turn it back to human readable form
            recipes = recipes.map(recipe => {
                return {
                    ...recipe.toObject(),
                    userIdString: recipe.userId.userId,
                    ingredientsString: recipe.ingredients.map(each => `${each.quantity}${each.unit} ${each.name}`).join('<br>'),
                    instructionsString: recipe.instructions.join('<br>'),
                    // createdAtString: recipe.createdAt.toISOString().split('T')[0]
                };
                });
          
            res.status(200).json({
                recipes
            })
        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Server Error'})
        }
    },
    deleteRecipe: async function (req, res) {
        try {
            // const { role, userId, fullname, email } = req.query;
            // let { deleteRecipeId } = req.params.id;
            
            console.log('deleteRecipeId: ', req.params.id)
            // Verify recipe ID exists - recipeId
            let recipeDeleted = await Recipe.findByIdAndDelete(req.params.id);
            if (!recipeDeleted) {
                return res.status(404).json({error: 'Recipe is not found'});
            }
            res.status(200).json({
                message: `Recipe ${recipeDeleted.recipeId} deleted!`
            })
        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Server Error'})
        }
    },
    getEditRecipe: async function (req, res){
        try {
            const recipeId = req.params.id;
            const recipeFound = await Recipe.findById(recipeId);
            const recipe = recipeFound.toObject(); // Turn it into plain text
            if (!recipe) {
                return res.status(404).json({message: 'Recipe is not found'});
            }
            recipe.ingredients = recipe.ingredients
                .map(each => {
                    return `${each.quantity}${each.unit} ${each.name}`;
                })
                .join(', ');
            recipe.instructions = recipe.instructions.join(', ');
            res.status(200).json({
                recipe
            })
        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Server Error'})
        }
    },
    editRecipe: async function (req, res) {
        try{
            const { recipe, user } = req.body;
            let { title, ingredients, instructions, mealType, cuisineType, prepTime, difficulty, servings} = recipe;
            let rawIngredients = ingredients.split(",").map(ingredients => ingredients.trim()).filter(ingredients => ingredients !== "");
            // Map each ingredient to parse it to get quantity, unit, name
            ingredients = rawIngredients.map(parseIngredient);
            // Instructions
            instructions = instructions.split(",").map(instruction => instruction.trim()).filter(instruction => instruction !== "");
            const updateRecipe = await Recipe.findByIdAndUpdate(
                recipe._id,
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
                return res.status(404).json({error: 'Recipe is not found'});
            }
            res.status(200).json({
                message: `Recipe ${updateRecipe.recipeId} updated!`
            })

        } catch (error) {
            console.error(error);
            // Handle Mongoose validation errors
            if (error.name === 'ValidationError') {
                const errors = Object.values(error.errors).map(err => err.message);
                return res.status(400).json({error: errors})
            }
            // Handle duplicate key error (11000 is the code for duplicates)
            if (error.code === 11000) {
                const title = error.keyValue.title; // Field of duplicate
                const errorMessage = `Duplicate recipe "${title}" already exists for this user, please try again`;
                return res.status(400).json({
                    error: [errorMessage]
                })
            }
            res.status(500).json({error: 'Server Error'})
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