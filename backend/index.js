require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./db/Database'); // Database connection
const calculatorRoutes = require('./routes/calculatorRoutes');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

connectDB.once('open', () => {
    console.log('Database connected successfully');
});

// JWT authentication middleware
// const authenticate = (req, res, next) => {
//     try {
//         const token = req.headers['authorization']?.split(' ')[1]; // Bearer <token>
//         if (!token) return res.status(401).json({ message: 'No token provided' });

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded; // Attach user info to request
//         next();
//     } catch (error) {
//         res.status(401).json({ message: 'Invalid token' });
//     }
// };

const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Extract token from header

    if (!token) {
        return res.status(401).json({ message: 'Access Denied. No token provided.' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Attach user to request object
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

// Authentication routes
app.use('/auth', authRoutes);

// Profile routes
app.use('/profile', authenticate, profileRoutes);

// Calculator routes
app.use('/calculations', authenticate, calculatorRoutes);


app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

