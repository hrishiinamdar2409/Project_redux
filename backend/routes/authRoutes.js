const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/User');

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { 
            firstName, 
            lastName, 
            email,
            password,
            age, 
            homeAddress, 
            primaryColor, 
            secondaryColor, 
            logo 
        } = req.body;

        if (!firstName || !email || !password || !homeAddress || !primaryColor || !secondaryColor || !logo) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            age,
            homeAddress,
            primaryColor,
            secondaryColor,
            logo,
        });

        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ token, user: { firstName, lastName, email } });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Sign In
router.post('/signIn', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Missing email or password' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, user: { firstName: user.firstName, lastName: user.lastName, email: user.email } });
    } catch (error) {
        console.error('Error during sign in:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
