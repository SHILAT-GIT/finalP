const express = require('express');
const router = express.Router();

const User = require('../models/User');

// Update user profile
router.post('/update-profile', async (req, res) => {
    const { userId, updateData } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
        if (!updatedUser) {
            return res.status(400).send({ message: 'Failed to update profile. Please try again.' });
        }

        res.status(200).send({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error. Please try again later.' });
    }
});

// Delete user account
router.delete('/delete-account/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        res.status(200).send({ message: 'Account successfully deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error. Please try again later.' });
    }
});

module.exports = router;