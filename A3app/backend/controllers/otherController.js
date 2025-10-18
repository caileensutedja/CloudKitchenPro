const Recipe = require('../models/recipe');
const Inventory = require('../models/inventory');
const User = require('../models/user');

module.exports = {
    dashboard: async function (req, res){
        try {
            // const { role, userId, fullname, email } = req.query;
            let userCount = await User.countDocuments();
            let recipeCount = await Recipe.countDocuments();
            let inventoryCount = await Inventory.countDocuments();
            console.log('hi userCount, recipeCount, inventoryCount',userCount, recipeCount, inventoryCount )
            res.status(200).json({
                userCount,
                recipeCount,
                inventoryCount
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Server Error'})
        }
    }
};

// // HD2: CHEF DASHBOARD
// router.get('/chefDashboard', async (req, res) => {
//     try {
//         const { role, userId, fullname, email } = req.query;
//         let count = await Recipe.countDocuments();
//         // Own recipes
//         let user = await User.findOne({userId: userId});
//         let recipes = await Recipe.find({userId: user._id}).sort({ recipeId: 1}).populate('userId');
//         // Turn it back to human readable form
//         recipes = recipes.map(recipe => {
//             return {
//                 ...recipe.toObject(),
//                 ingredientsString: recipe.ingredients.map(each => `${each.quantity}${each.unit} ${each.name}`).join('<br>'),
//                 instructionsString: recipe.instructions.join('<br>'),
//                 createdAtString: recipe.createdAt.toISOString().split('T')[0]
//             };
//             });

//         // Aggregation to get inventory by category (filtered, with daysLeft and expiration warning)
//         let inventoryByCategory = await Inventory.aggregate([
//                     // Lookup for the user (like populate)
//                     {
//                         $lookup: {
//                             from: "users", // Collection name
//                             localField: "userId", // Field in Inventory
//                             foreignField: "_id", // Field in User
//                             as: "user" // New field to prevent overwriting
//                         }
//                     },
//                     { $unwind: "$userId" }, // Unwind because lookup results in an array
//                     {
//                         $addFields: {
//                             daysLeft: {
//                                 $ceil: {
//                                 $divide: [
//                                     { $subtract: ["$expirationDate", new Date()] },
//                                     1000 * 60 * 60 * 24
//                                 ]
//                             }
//                             },
//                             soonExpired:{
//                                 $lt: [{ 
//                                     $ceil: { 
//                                         $divide: [{ 
//                                             $subtract: ["$expirationDate", new Date()] 
//                                         }, 
//                                         1000*60*60*24
//                                     ] 
//                                 } 
//                             }, 
//                             4
//                             ] 
//                         }
//                         }
//                     },
//                     {
//                         $group: {
//                             _id: "$category", // group by category field
//                             categoryCount: { $sum: 1 }, // count docs in each group
//                             inventory: {
//                                 $push: {
//                                     _id: "$_id",
//                                     inventoryId: "$inventoryId",
//                                     userId: "$user.userId",
//                                     ingredientName: "$ingredientName",
//                                     quantity: "$quantity",
//                                     unit: "$unit",
//                                     category: "$category",
//                                     purchaseDate: "$purchaseDate",
//                                     expirationDate: "$expirationDate",
//                                     location: "$location",
//                                     cost: "$cost",
//                                     createdAt: "$createdAt",
//                                     daysLeft: "$daysLeft",
//                                     soonExpired: "$soonExpired"
//                                 }
//                             }
//                         }
//                     },
//                     { $sort: { _id : 1 } }
//                 ]);

//         // Pipeline to create recipe suggestions
//         const suggestionPipeline = [
//         { $match: { userId: user._id } },
//         { // Lookup and match the inventories 
//             $lookup: {
//             from: "inventories",
//             pipeline: [
//                 { $match: { 
//                     $expr: { $eq: ["$userId", "$userId"] },
//                     expirationDate: { $gte: new Date() } // Check if expired or not
//                 }}
//             ],
//             as: "inventory"
//             }
//         },
//         { $unwind: "$ingredients" },
//         { // Check if the ingredient names match the 
//             $addFields: {
//                 matchedItem: {
//                     $first: {
//                         $filter: {
//                             input: "$inventory",
//                             as: "inv", // Rename for simplicity
//                             cond: {
//                             $eq: [
//                                 { $toLower: "$$inv.ingredientName" },
//                                 { $toLower: "$ingredients.name" }
//                                 ]
//                             }
//                         }
//                     }
//                 }
//             }
//         },
//         {   // If else to see if item exists
//             $addFields: {
//             hasIngredient: { $cond: [{ $ifNull: ["$matchedItem", false] }, 1, 0] },
            
//             }
//         },
//         { // Group them
//             $group: {
//             _id: "$_id", // Grouped by ID
//             name: { $first: "$title" }, // Recipe name
//             totalIngredients: { $sum: 1 }, 
//             availableCount: { $sum: "$hasIngredient" },
//             ingredients: { $push: "$ingredients" }
//             }
//         },
//         // Add New Fields
//         {
//             $addFields: {
//             matchRatio: { $divide: ["$availableCount", "$totalIngredients"] }
//             }
//         },
//         { $sort: { fullMatch: -1, matchRatio: -1, name: 1 } }
//         ];
//         // Aggregate to view
//         const suggestions = await Recipe.aggregate(suggestionPipeline);

//         res.render('chef-dashboard',
//             {
//                 role, userId, fullname, email,
//                 count,
//                 recipes,
//                 inventoryByCategory,
//                 suggestions
//             }
//         )
//     } catch (error) {
//         console.error(error);
//         res.status(500).render("404", {errorMsg: 'Server Error'})
//     }
// });


// // HD 3
// router.get("/report", async (req, res) => {
//     try {
//         const { role, userId, fullname, email } = req.query;
//         let userCount = await User.countDocuments();
//         let recipeCount = await Recipe.countDocuments();
//         let inventoryCount = await Inventory.countDocuments();
//         res.render("report", { role, userId, fullname, email, userCount, recipeCount, inventoryCount });
//     } catch (error) {
//         console.error(error);
//         res.status(500).render("404", {errorMsg: 'Server Error'})
//     }
// });

// module.exports = router;