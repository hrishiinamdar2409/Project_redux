const mongoose = require('mongoose');

// Define the MongoDB connection URL
const mongoURL = 'mongodb://127.0.0.1:27017/appDatabase';

// Set up MongoDB connection
mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Get default connection
// Mongoose maintains a default connection object representing the MongoDB connection
const connectDB = mongoose.connection;

// Define event listener for successful connection
connectDB.on('connected', () => {
    console.log('Connected to MongoDB server');
});

// Define event listener for connection errors
connectDB.on('error', (err) => {
    console.log('MongoDB connection error:', err);
});

// Define event listener for disconnection
connectDB.on('disconnected', () => {
    console.log('Disconnected from MongoDB server');
});

// Export database connection
module.exports = connectDB;
