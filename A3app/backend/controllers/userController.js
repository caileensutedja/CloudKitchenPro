const User = require('../models/user');

// ============================================
// USER CONTROLLERS
// ============================================
module.exports = {
    getRegister: async function (req, res){
        res.status(500).json({ error: 'Angular frontend error' });
    },
    
    createUser: async function(req, res){
        try {
            let { email, password, fullname, role, phone } = req.body;
            let userId = await nextUserId();

            // Replaces all spaces (\s) and dashes (-) globally (accross entire string)
            phone = phone.replace(/[\s-]/g, '');

            let newUser = new User({
                userId, 
                email, 
                password, 
                fullname, 
                role, 
                phone
            });
            await newUser.save();

            res.status(201).json({
                message: 'User created successfully!', newUser
            });
        } catch (error) {
            console.error(error);

            // Handle Mongoose validation errors
            if (error.name === 'ValidationError') {
                const errors = Object.values(error.errors).map(err => err.message);
                return res.status(400).json({error: errors})
            }
            res.status(500).json({error: ['Server Error' + error.message]})
        }
    },
    
    getLogin: async function (req, res) {
        res.status(500).json({error: 'Angular frontend error'})
    },
    
    loginUser: async function (req, res){
        try {
            const { email, password } = req.body;
            // Validate
            const user = await User.findOne(
                {'email': email}, 
                {email: 1,
                userId: 1,
                password: 1,
                fullname: 1,
                role: 1});
            if (!user) {
                return res.status(404).json({ error: 'Email not found, please try again.' });
            }
            if (user.password !== password) {
                return res.status(401).json({ error: 'Incorrect password. Please try again.' });
            }
            res.status(200).json({message: 'Login Successful', user})
        } catch (error){
            console.error(error);
            res.status(500).json({error: 'Server Error'})
        }
    }
};
    
// ============================================
// HELPER FUNCTIONS
// ============================================
async function nextUserId() {
    const lastAdded = await User.findOne()
    .sort({ userId: -1}) // descending
    .exec();

    let max = 0;
    if (lastAdded) {
        const num = parseInt(lastAdded.userId.split('-')[1]);
        // Only if num is not null, max is redefined
        if (!isNaN(num)) max = num;
    }
    const nextUserId = 'U-' + String(max + 1).padStart(5, '0');
    return nextUserId;
}