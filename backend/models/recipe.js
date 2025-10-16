const mongoose = require('mongoose');

/*
Sub-schema acting like 'object' for each ingredient.
*/
const ingredientSchema = new mongoose.Schema({
    quantity: {
        type: Number,
        required: [true, 'Ingredient quantity is required'],
        min: [0, 'Quantity must be a positive number']
    },
    unit: {
        type: String,
        default: 'pieces'
    },
    name: {
        type: String,
        required: [true, 'Ingredient name is required'],
        minlength: [1, 'Ingredient name must be at least 1 character']
    }
}, {_id: false});

const recipeSchema = new mongoose.Schema({
    recipeId: {
        type: String,
        required: [true, 'Recipe ID is required'],
        trim: true,
        unique: true,
        match: [/^R-\d{5}$/, 'Enter recipe ID in the format of R-XXXXX where X is an integer.']
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user',
        // fk user id
        required: [true, 'User ID is required'],
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        minlength: [3, 'Title must be at least 3 characters'],
        maxlength: [100, 'Title must be at most 100 characters']
    },
    chef: {
        type: String,
        required: [true, 'Chef name is required'],
        trim: true,
        minlength: [2, 'Chef must have at least 2 characters'],
        maxlength: [50, 'Chef must have at most 50 characters'],
        // Any letters, apostrophy, spaces, hypens allowed
        match: [/^[A-Za-z '-]+$/, 'Only alphabets, spaces, hypens, and apostrophes allowed.']
    },
    ingredients: {
        type: [ingredientSchema],
        required: [true, 'Ingredients are required'],
        validate: {
            validator: function(ingredients) {
                return (ingredients.length >= 1 && ingredients.length <= 20)
            },
            message: 'Ingredients must be between 1 to 20'
        }
    },
    instructions: {
        type: [String],
        required: [true, 'Instructions are required'],
        validate: [
            {
                // Verifying number of instructions
                validator: function(instructions) {
                    return instructions.length >= 1 && instructions.length <= 15
                },
                message: 'Instructions must be between 1 to 15 steps'
            },
            { // For each instruction step
                validator: function(instructions) {
                    return instructions.every(step => step.length >= 10);
                },
                message: 'Each step must have at least 10 characters'
            }
        ]
    },
    mealType: {
        type: String,
        required: [true, 'Meal type is required'],
        enum: [ "Breakfast", "Lunch", "Dinner", "Snack"]
    },
    cuisineType: {
        type: String,
        required: [true, 'Cuisine type is required'],
        enum: ["Italian", "Asian", "Mexican", "American", "French", "Indian", "Mediterranean", "Other"]
    },
    prepTime: {
        type: Number,
        required: [true, 'Preparation time is required'],
        validate: {
            validator: function(prep) {
                return (prep >= 1 && prep <= 480)
            },
            message: 'Preparation time must be between 1 to 480 minutes (8 hours)'
        }
    },
    difficulty: {
        type: String,
        required: [true, 'Difficulty level is required'],
        enum: ["Easy", "Medium", "Hard"]
    },
    servings: {
        type: Number,
        required: [true, 'Number of servings is required'],
        validate: {
            validator: function(servings) {
                return (servings >= 1 && servings <= 20)
            },
            message: 'Servings time must be between 1 to 20'
        }
    }
},
{timestamps: {createdDate: 'createdDate'}}
);

// Ensuring that the userId and title combination is unique
recipeSchema.index({ userId: 1, title: 1 }, { unique: true });

module.exports = mongoose.model('recipes', recipeSchema);