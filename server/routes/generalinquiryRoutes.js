const express = require('express');
const router = express.Router();

const GeneralInquiry = require('../models/GeneralInquiry');

// Create an inquiry
router.post('/send-inquiry', async (req, res) => {
    try {
        const { name, phone, email, message } = req.body;

        if (!name || !phone || !email || !message) {
            return res.status(400).send({ message: 'Missing required fields' });
        }
        const now = new Date();

        const day = now.getDate().toString().padStart(2, '0');
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const year = now.getFullYear();

        const dateWithSlashes = `${day}/${month}/${year}`;

        const newGeneralInquiry = new GeneralInquiry({
            date: dateWithSlashes,
            name,
            phone,
            email,
            message,
            status: 'התקבלה'
        });

        await newGeneralInquiry.save();

        res.status(200).send({ message: 'The inquiry has been successfully sent!' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error. Please try again later.' });
    }
});

// Fetch all general inquiries for admin
router.get('/all-inquiries', async (req, res) => {
    try {
        const generalInquiries = await GeneralInquiry.find();

        if (!generalInquiries || generalInquiries.length === 0) {
            return res.status(404).send({ message: 'No inquiries found.' });
        }

        res.status(200).send({ message: 'All inquiries retrieved successfully.', inquiries: generalInquiries });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error. Please try again later.' });
    }
});

// Update general inquiry status
router.post('/change-inquiry-status', async (req, res) => {
    const { inquiryId, status } = req.body;

    try {
        const updatedInquiry = await GeneralInquiry.findByIdAndUpdate(inquiryId, { status: status }, { new: true });

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
        const generalInquiry = await GeneralInquiry.findByIdAndDelete(inquiryId);

        if (!generalInquiry) {
            return res.status(404).send({ message: 'Inquiry not found' });
        }

        res.status(200).send({ message: 'Inquiry successfully deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error. Please try again later.' });
    }
});

module.exports = router;