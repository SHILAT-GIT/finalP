const express = require('express');
const router = express.Router();

const Apartment = require('../models/Apartment');
const User = require('../models/User');





// Fetch all apartments
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

/*//בקשת שרת לשליפת כל הדירות המאושרות
router.get('/apartments', async (req, res) => {
    
    try {
        const apartments = await Apartment.find({ status: "מאושר" }).select('-owner');

        if (!apartments || apartments.length === 0) {
            return res.status(404).send({ message: 'No apartments found.' });
        }

        res.status(200).send({ message: 'Apartments retrieved successfully.', apartments: apartments });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error. Please try again later.' });
    }
});

// בקשת שרת לשליפת כל הדירות המאושרות שהן למכירה
router.get('/apartmentsForSale', async (req, res) => {
    
    try {
        const apartments = await Apartment.find({ status: "מאושר", type: "דירה למכירה" }).select('-owner');

        if (!apartments || apartments.length === 0) {
            return res.status(404).send({ message: 'No apartments found.' });
        }

        res.status(200).send({ message: 'Apartments retrieved successfully.', apartments: apartments });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error. Please try again later.' });
    }
});

// בקשת שרת לשליפת כל הדירות המאושרות שהן להשכרה
router.get('/apartmentsForRent', async (req, res) => {
    
    try {
        const apartments = await Apartment.find({ status: "מאושר", type: "דירה להשכרה" }).select('-owner');

        if (!apartments || apartments.length === 0) {
            return res.status(404).send({ message: 'No apartments found.' });
        }

        res.status(200).send({ message: 'Apartments retrieved successfully.', apartments: apartments });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error. Please try again later.' });
    }
});*/

// בקובץ routes/apartments.js (או איפה שאת מנהלת את הרואטר)

router.get('/apartments', async (req, res) => {
    try {
      const apartments = await Apartment.find({ status: "מאושר" });
      res.send({ apartments });
    } catch (err) {
      res.status(500).send({ message: 'שגיאה בשרת' });
    }
  });
  
  router.get('/apartments/:id', async (req, res) => {
    try {
      const apartment = await Apartment.findById(req.params.id);
      res.send({ apartment });
    } catch (err) {
      res.status(500).send({ message: 'שגיאה בשרת' });
    }
  });
  


module.exports = router;