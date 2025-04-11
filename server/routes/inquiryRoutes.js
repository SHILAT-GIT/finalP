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

// Fetch all inquiries for admin
router.get('/all-inquiries', async (req, res) => {
    try {
        const inquiries = await Inquiry.find()
            .populate('user', '-password -role')
            .populate('apartment')
            .populate({
                path: 'apartment.owner',
                select: '-password -role'
            });

        if (!inquiries || inquiries.length === 0) {
            return res.status(404).send({ message: 'No inquiries found.' });
        }

        res.status(200).send({ message: 'All inquiries retrieved successfully.', inquiries: inquiries });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error. Please try again later.' });
    }
});

// Fetch all inquiries of a user
router.get('/user-inquiries/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        const inquiries = await Inquiry.find({ user: userId }).populate('apartment', '-owner -address.apartmentNumber');

        if (!inquiries || inquiries.length === 0) {
            return res.status(404).send({ message: 'No inquiries sent by this user.' });
        }

        res.status(200).send({ message: 'Inquiries retrieved successfully.', inquiries: inquiries });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error. Please try again later.' });
    }
});

// Update inquiry status
router.post('/change-inquiry-status', async (req, res) => {
    const { inquiryId, status } = req.body;

    try {
        const updatedInquiry = await Inquiry.findByIdAndUpdate(inquiryId, { status: status }, { new: true });

        if (!updatedInquiry) {
            return res.status(404).send({ message: 'Inquiry not found.' });
        }

        res.status(200).send({ message: 'Inquiry status updated successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error. Please try again later.' });
    }
});

// Delete an inquiry
router.delete('/delete-inquiry/:id', async (req, res) => {
    const inquiryId = req.params.id;

    try {
        const inquiry = await Inquiry.findByIdAndDelete(inquiryId);

        if (!inquiry) {
            return res.status(404).send({ message: 'Inquiry not found' });
        }

        res.status(200).send({ message: 'Inquiry successfully deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error. Please try again later.' });
    }
});

module.exports = router;