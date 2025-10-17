const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    inventoryId: {
        type: String,
        unique: [true, 'This Inventory ID already exists'],
        required: [true, 'Inventory ID is required'],
        trim: true,
        match: [/^I-\d{5}$/, 'Enter inventory ID in the format of I-XXXXX where X is an integer.']
    },
    userId:
    // References 1 user ID, who added the inventory
    {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user',
        required: [true, 'User ID is required']
    },
    ingredientName: {
        type: String,
        required: [true, 'Ingredient name is required'],
        trim: true,
        minlength: [2, 'Ingredient name must have at least 2 characters'],
        maxlength: [50, 'Ingredient name must have at most 50 characters'],
        match: [/^[A-Za-z -]+$/, 'Only alphabets, spaces and hypens allowed.']

    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        trim: true,
        validate: {
            validator: function(quantity) {
                return (quantity > 0 && quantity <= 9999)
            },
            message: 'Quantity must be greater than 0 to a maximum of 9999 (accepting decimals)'
        }
    },
    unit: {
        type: String,
        required: [true, 'Inventory unit is required'],
        enum: ["pieces", "kg", "g", "liters", "ml", "cups", "tbsp", "tsp", "dozen"],
    },
    category: {
        type: String,
        required: [true, 'Inventory category is required'],
        enum: ["Vegetables", "Fruits", "Meat", "Dairy", "Grains", "Spices", "Beverages", "Frozen", "Canned", "Other"],
    },
    purchaseDate: {
        type: Date,
        required: [true, 'Purchase date is required'],
        validate: {
            validator: function(purchase) {
                console.log('purchase input: ', purchase)
                // Compare with current date
                console.log('purchase now date: ', new Date())
                console.log('purchase is less?: ', purchase <= new Date())
                return purchase <= new Date();
            },
            message: 'Purchase date cannot be in the future'
        }
    },
    expirationDate: {
        type: Date,
        required: [true, 'Expiration date is required'],
        validate: {
            validator: function(expiration) {
                console.log('expiration, purch: ', expiration , this.purchaseDate)
                // Date must not be the purchase date and must be after it
                return !this.purchaseDate || expiration > this.purchaseDate;
            },
            message: 'Expiration date must be after the purchase date!!'
        }
    },
    location: {
        type: String,
        enum: ["Fridge", "Freezer", "Pantry", "Counter", "Cupboard"],
        required: [true, 'Location of inventory is required'],
    },
    cost: {
        type: Number,
        required: [true, 'Cost of inventory in 2 decimal places is required'],
        min: [0.01, 'Cost must be at least 0.01'],
        max: [999.9, 'Cost must be at most 999.99'],
        validate: {
            validator: function(cost) {
                // any decimal, with optional . then 1-2 letters after
                COST_REGEX= /^\d+(\.\d{1,2})?$/
                return COST_REGEX.test(cost.toString())
            }
        }
    },
},
{timestamps: {createdDate: 'createdDate'}}
);

module.exports = mongoose.model('inventory', inventorySchema);