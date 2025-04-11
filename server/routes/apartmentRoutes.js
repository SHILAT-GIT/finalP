const express = require('express');
const router = express.Router();

const Apartment = require('../models/Apartment');
const User = require('../models/User');

// Fetch all apartments for admin
router.get('/all-apartments', async (req, res) => {
    try {
        const apartments = await Apartment.find().populate('owner', '-password -role')

        if (!apartments || apartments.length === 0) {
            return res.status(404).send({ message: 'No apartments found.' });
        }

        res.status(200).send({ message: 'All apartments retrieved successfully.', apartments: apartments });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error. Please try again later.' });
    }
});

// Fetch all apartments of a user
router.get('/user-apartments/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        const apartments = await Apartment.find({ owner: userId }).select('-owner');

        if (!apartments || apartments.length === 0) {
            return res.status(404).send({ message: 'No apartments found for this user.' });
        }

        res.status(200).send({ message: 'Apartments retrieved successfully.', apartments: apartments });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error. Please try again later.' });
    }
});

// Update apartment status
router.post('/change-apartment-status', async (req, res) => {
    const { apartmentId, status } = req.body;

    try {
        const updatedApartment = await Apartment.findByIdAndUpdate(apartmentId, { status: status }, { new: true });

        if (!updatedApartment) {
            return res.status(404).send({ message: 'Apartment not found.' });
        }

        res.status(200).send({ message: 'Apartment status updated successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error. Please try again later.' });
    }
});

// Delete an apartment
router.delete('/delete-apartment/:id', async (req, res) => {
    const apartmentId = req.params.id;

    try {
        const apartment = await Apartment.findByIdAndDelete(apartmentId);

        if (!apartment) {
            return res.status(404).send({ message: 'Apartment not found' });
        }

        res.status(200).send({ message: 'Apartment successfully deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error. Please try again later.' });
    }
});

module.exports = router;