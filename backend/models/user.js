const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, 'User ID is required'],
        trim: true,
        match: [/^U-\d{5}$/, 'Enter User ID in the format of U-XXXXX where X is an integer']
    },
    email: {
        type: String,
        required: [true, 'Email for the user is required'],
        trim: true,
        unique: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password for the user is required'],
        trim: true,
        minlength: [8, 'Password must be at least 8 characters'],
        validate: {
            validator: function(password) {
                if (!/[A-Z]/.test(password)) return false; // Upper case check
                if (!/[a-z]/.test(password)) return false; // Lower case check
                if (!/[0-9]/.test(password)) return false; // Number check
                if (!/[\W_]/.test(password)) return false; // Special character check
                return true;
            },
            message: 'Invalid password format, password must contain at least one upper case letter, one lower case letter, one number, and one special character'
        }
    },
    fullname: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true,
        minlength: [2, 'Full name must have at least 2 characters'],
        maxlength: [100, 'Full name must have at most 100 characters'],
        match: [/^[A-Za-z\s'-]+$/,'Enter full name, no numbers and special characters except hypens and apostrophes' ]
    },
    role: {
        type: String,
        enum: ['admin', 'chef', 'manager'], // This validates the input
        required: [true, 'Your role is required']
    },
    phone: {
        type: String,
        trim: true,
        required: [true, 'Enter your phone number with international code'],
        match: [/^\+614\d{8}$/, 'Please input a valid phone number with country code (e.g. +61 4xxxxxxx)']
    }
},
{timestamps: {createdAt: 'createdAt', updatedAt: 'udpatedAt'}});

module.exports = mongoose.model('user', userSchema);