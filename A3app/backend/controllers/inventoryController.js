const Inventory = require('../models/inventory');
const recipe = require('../models/recipe');
const User = require('../models/user');

// ============================================
// INVENTORY CONTROLLERS
// ============================================
module.exports = {
    getCreateUser: async function (req, res){
        res.status(500).json({ errorMsg: 'Angular frontend error' });
    },
    createInventory: async function(req, res){
        try {
            const { inventory, user } = req.body;
            let { ingredientName, quantity, unit, category, purchaseDate, expirationDate, location, cost} = inventory;
            let inventoryId = await nextInventoryId();
            // Verify user ID exists - userId
            let userFound = await User.findOne({userId: user.userId});
            if (!userFound) {
                return res.status(400).json({error: 'Selected user ID does not exist'});
            }
            let newInventory = new Inventory({
                    inventoryId,
                    userId: userFound._id,
                    ingredientName,
                    quantity,
                    unit,
                    category,
                    purchaseDate,
                    expirationDate,
                    location,
                    cost
                    });
            await newInventory.save();
            res.status(200).json({message: `Inventory ${newInventory.inventoryId} added!`, newInventory})
            } catch (error) {
                console.error(error);

                // Handle Mongoose validation errors
                if (error.name === 'ValidationError') {
                    const errors = Object.values(error.errors).map(err => err.message);
                    return res.status(400).json({error: errors})
                }
                res.status(500).json({error: 'Server Error'})
            }
    },
    getViewInventory: async function (req, res) {
        try {
        let inventoryByCategory = await Inventory.aggregate([
            // Lookup for the user (like populate)
            {
                $lookup: {
                    from: "users", // Collection name
                    localField: "userId", // Field in Inventory
                    foreignField: "_id", // Field in User
                    as: "user" // New field to prevent overwriting
                }
            },
            { $unwind: "$userId" }, // Unwind because lookup results in an array
            {
                $addFields: {
                    daysLeft: {
                        $ceil: {
                        $divide: [
                            { $subtract: ["$expirationDate", new Date()] },
                            1000 * 60 * 60 * 24
                        ]
                    }
                    },
                    soonExpired:{
                        $lt: [{ 
                            $ceil: { 
                                $divide: [{ 
                                    $subtract: ["$expirationDate", new Date()] 
                                }, 
                                1000*60*60*24
                            ] 
                        } 
                    }, 
                    4] 
                }
                }
            },
            {
                $group: {
                    _id: "$category", // group by category field
                    categoryCount: { $sum: 1 }, // count docs in each group
                    inventory: {
                        $push: {
                            _id: "$_id",
                            inventoryId: "$inventoryId",
                            userId: "$user.userId",
                            ingredientName: "$ingredientName",
                            quantity: "$quantity",
                            unit: "$unit",
                            category: "$category",
                            purchaseDate: "$purchaseDate",
                            expirationDate: "$expirationDate",
                            location: "$location",
                            cost: "$cost",
                            createdAt: "$createdAt",
                            daysLeft: "$daysLeft",
                            soonExpired: "$soonExpired"
                        }
                    }
                }
            },
            { $sort: { _id : 1 } }
        ]);

        const lowStock = await Inventory.find({ quantity: { $lt: 4 } });
        const expiringSoon = await Inventory.aggregate([
        {
            $addFields: {
            daysLeft: {
                $ceil: {
                $divide: [
                    { $subtract: ["$expirationDate", new Date()] },
                    1000 * 60 * 60 * 24 // milliseconds → days
                ]
                }}
            }
        },
        {
            $match: { daysLeft: { $lt: 4 } }
        },
        {
            $addFields: {
            daysLeft: {
                $cond: [{ $lt: ["$daysLeft", 0] }, "Expired", "$daysLeft"]
            }
            }
        }
        ]);

        let inventories = await Inventory.find().populate("userId")
        let totalCost = inventories.reduce((sum, item) => sum + item.cost, 0);
        totalCost = totalCost.toFixed(2);
        let count = await Inventory.countDocuments();
        res.status(200).json({
                count,
                totalCost,
                lowStock,
                expiringSoon,
                inventoryByCategory
            })
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Server Error'})
    }
    },
    getDeleteInventory: async function (req, res){
        try {
        let inventories = await Inventory.find().sort({ inventoryId: 1}).populate('userId');
        inventories = inventories.map(inventory => {
            return {
                ...inventory.toObject(),
                userIdString: inventory.userId.userId
            }
        });
        res.status(200).json({
                inventories
            })
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Server Error'})
    }
    },
    deleteInventory: async function (req, res) {
        try {
            let inventoryDelete = await Inventory.findByIdAndDelete(req.params.id);
            if (!inventoryDelete) {
                return res.status(404).json({error: 'Inventory is not found'});
            }
            res.status(200).json({
                message: `Inventory ${inventoryDelete.inventoryId} deleted!`
            })
        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Server Error'})
        }
    },
    getEditInventory: async function (req, res) {
        try {
            const editId = req.params.id;
            const inventory = await Inventory.findById(editId);
            if (!inventory) {
                return res.status(404).send('Inventory is not found');
            }
            res.status(200).json({
                inventory
            })
        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Server Error'})
        }
    },
    editInventory: async function (req, res){
        try{
            const { inventory, user } = req.body;
            let { ingredientName, quantity, unit, category, purchaseDate, expirationDate, location, cost} = inventory;
            const purchase = new Date(purchaseDate);
            const expiration = new Date(expirationDate);
            if (purchase > expiration) {
                return res.status(404).json({error: 'Expiration date must be after the purchase date'});
            }
            const updateInventory = await Inventory.findByIdAndUpdate(
                inventory._id,
                {
                    ingredientName,
                    quantity,
                    unit,
                    category,
                    purchaseDate,
                    expirationDate,
                    location,
                    cost
                },
                {
                    new: true, // Return the updated document
                    runValidators: true, // Run schema validation
                }
            );
            if (!updateInventory) {
                return res.status(404).json({error: 'Inventory is not found'});
            }
            res.status(200).json({
                message: `Inventory ${updateInventory.inventoryId} updated!`
            })
        } catch (error) {
            console.error(error);
            // Handle Mongoose validation errors
            if (error.name === 'ValidationError') {
                const errors = Object.values(error.errors).map(err => err.message);
                return res.status(400).json({error: errors})
            }
            res.status(500).json({error: 'Server Error'})
        }
    }
};

// ============================================
// HELPER FUNCTIONS
// ============================================
async function nextInventoryId() {
    const lastAdded = await Inventory.findOne()
    .sort({ inventoryId: -1}) // descending
    .exec();

    let max = 0;
    if (lastAdded) {
        const num = parseInt(lastAdded.inventoryId.split('-')[1]);
        // Only if num is not null, max is redefined
        if (!isNaN(num)) max = num;
    }
    const nextUserId = 'I-' + String(max + 1).padStart(5, '0');
    return nextUserId;
}