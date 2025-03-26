const express = require('express');
const router = express.Router();

const Inquiry = require('../models/Inquiry');
const Apartment = require('../models/Apartment');
const User = require('../models/User');

// Create an inquiry
router.post('/send-inquiry', async (req, res) => {
    try {
        const { userId, apartmentId } = req.body;

        const userExists = await User.exists({ _id: userId });
        const apartmentExists = await Apartment.exists({ _id: apartmentId });

        if (!userExists || !apartmentExists) {
            return res.status(400).send({ message: 'Invalid user or apartment ID' });
        }

        const newInquiry = new Inquiry({
            date: new Date(),
            apartment: apartmentId,
            user: userId,
            status: 'התקבל'
        });

        await newInquiry.save();

        res.status(200).send({ message: 'The inquiry has been successfully sent!' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error. Please try again later.' });
    }
});

module.exports = router;