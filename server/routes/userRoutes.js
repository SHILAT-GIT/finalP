const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Apartment = require('../models/Apartment');

// Fetch all saved apartments of a user
router.get('/saved-apartments/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId).populate('savedApartments', '-owner -address.apartmentNumber');

        if (!user || user.savedApartments.length === 0) {
            return res.status(404).send({ message: 'No saved apartments found.' });
        }

        res.status(200).send({ message: 'Saved apartments retrieved successfully.', apartments: user.savedApartments });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error. Please try again later.' });
    }
});

// Remove saved apartment from user's saved apartments list
router.post('/remove-saved-apartment', async (req, res) => {
    const { userId, apartmentId } = req.body;

    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { $pull: { savedApartments: apartmentId } },
            { new: true }
        );

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        res.status(200).send({ message: 'Apartment removed from apartments successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error. Please try again later.' });
    }
});

// Get user profile
router.get('/profile/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId).select('-password -savedApartments');
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        res.status(200).send({ message: 'Account successfully deleted', user: user });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error. Please try again later.' });
    }
});

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

//הרשמה
router.post('/register', async (req, res) => {
    const { name, email, phone, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "כתובת המייל כבר רשומה." });
        }

        const newUser = new User({
            name,
            email,
            phone,
            password,
        });

        await newUser.save();
        res.status(201).json({ message: "המשתמש נוצר בהצלחה." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "שגיאה בשרת." });
    }
});

//התחברות
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "משתמש לא קיים במערכת." });
        }

        if (user.password !== password) {
            return res.status(401).json({ message: "סיסמה שגויה." });
        }

        // החזרת מידע רלוונטי בלבד (בלי הסיסמה!)
        const userInfo = {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
        };

        res.status(200).json({ message: "התחברות הצליחה", user: userInfo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "שגיאה בשרת." });
    }
});



module.exports = router;