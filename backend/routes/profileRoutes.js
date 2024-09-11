const express = require('express');
const User = require('../model/User');

const router = express.Router();

// Get user profile
router.get('/', async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { firstName, lastName, email, age, homeAddress, primaryColor, secondaryColor, logo } = user;
        res.json({ firstName, lastName, email, age, homeAddress, primaryColor, secondaryColor, logo });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update user profile
router.put('/', async (req, res) => {
    try {
        const { firstName, lastName, age, homeAddress, primaryColor, secondaryColor, logo } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { firstName, lastName, age, homeAddress, primaryColor, secondaryColor, logo },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;

