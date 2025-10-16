const mongoose = require('mongoose');

const mongoURI = 'mongodb://localhost:27017/assignment3';

async function connectToMongoDB() {
    try {
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB via Mongoose');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
}

// Handle connection events
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from MongoDB');
});

// Graceful shutdown
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('Mongoose connection closed due to app termination');
    process.exit(0);
});

module.exports = { connectToMongoDB };