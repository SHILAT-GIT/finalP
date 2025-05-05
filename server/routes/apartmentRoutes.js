const express = require('express');
const router = express.Router();

const Apartment = require('../models/Apartment');
const User = require('../models/User');
const Inquiry = require('../models/Inquiry');

const upload = require('../uploadImages');

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

        await Inquiry.deleteMany({ apartment: apartmentId });

        await User.updateMany(
            { savedApartments: apartmentId },
            { $pull: { savedApartments: apartmentId } }
        );

        res.status(200).send({ message: 'Apartment successfully deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error. Please try again later.' });
    }
});

//בקשת שרת לשליפת כל הדירות המאושרות
router.get('/apartments', async (_, res) => {
    try {
        const apartments = await Apartment.find({ status: "מאושר" }).sort({ createdAt: -1 });
        res.send({ apartments });
    } catch (err) {
        res.status(500).send({ message: 'שגיאה בשרת' });
    }
});

//בקשת שרת לשליפת דירה לפי מזהה
router.get('/apartments/:id', async (req, res) => {
    try {
        const apartment = await Apartment.findById(req.params.id).sort({ createdAt: -1 });
        res.send({ apartment });
    } catch (err) {
        res.status(500).send({ message: 'שגיאה בשרת' });
    }
});

// דירות להשכרה
router.get('/for-rent', async (_, res) => {
    try {
        const apartments = await Apartment.find({ status: "מאושר", type: "דירה להשכרה" }).sort({ createdAt: -1 });
        res.send({ apartments });
    } catch (err) {
        res.status(500).send({ message: 'שגיאה בשרת' });
    }
});

// דירות למכירה
router.get('/for-sale', async (_, res) => {
    try {
        const apartments = await Apartment.find({ status: "מאושר", type: "דירה למכירה" }).sort({ createdAt: -1 });
        res.send({ apartments });
    } catch (err) {
        res.status(500).send({ message: 'שגיאה בשרת' });
    }
});

//חיפוש
router.get('/search', async (req, res) => {
    const { q } = req.query;

    if (!q) return res.send({ apartments: [] });

    const searchRegex = new RegExp(q, 'i');
    const qAsNumber = Number(q);
    const isNumber = !isNaN(qAsNumber);

    let query = {
        status: "מאושר",
        $or: [
            { type: searchRegex },
            { "address.city": searchRegex },
            { "address.street": searchRegex }
        ]
    };

    if (isNumber) {
        query.$or.push({ "apartmentDetails.floor": qAsNumber });
        query.$or.push({ "apartmentDetails.numberOfRooms": qAsNumber });
        query.$or.push({ "apartmentDetails.sizeInSquareMeters": qAsNumber });

    }

    try {
        const apartments = await Apartment.find(query).sort({ createdAt: -1 });
        res.send({ apartments });
    } catch (err) {
        console.error("שגיאה בחיפוש:", err);
        res.status(500).send({ message: 'שגיאה בשרת' });
    }
});


// הוספת דירה
router.post("/add-apartment", upload.array("images"), async (req, res) => {
    try {
        const images = req.files.map((file) => `/uploads/${file.filename}`);

        const newApartment = new Apartment({
            owner: req.body.userId, // לוודא שיש req.user (ראה הערה למטה)
            type: req.body.type,
            price: req.body.price,
            address: {
                apartmentNumber: req.body.apartmentNumber,
                street: req.body.street,
                city: req.body.city,
                region: req.body.region,
            },
            apartmentDetails: {
                sizeInSquareMeters: req.body.sizeInSquareMeters,
                numberOfRooms: req.body.numberOfRooms,
                floor: req.body.floor,
            },
            description: req.body.description,
            images,
            status: "ממתין לאישור",
        });

        await newApartment.save();
        res.status(201).send({ message: "דירה נוספה בהצלחה" });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "שגיאה בהוספת דירה" });
    }
});

//הוספת 4 דירות אחרונות לעמוד הראשי
router.get('/latest', async (_, res) => {
    try {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const latestApartments = await Apartment.find({
            status: "מאושר",
            createdAt: { $gte: oneWeekAgo }
        })
            .sort({ createdAt: -1 })
            .limit(4);

        res.send({ apartments: latestApartments });
    } catch (err) {
        res.status(500).send({ message: 'שגיאה בשרת' });
    }
});


// Helper function to analyze user preferences based on saved and viewed apartments
const getUserPreferences = (apartments) => {
    const typeData = {
        "דירה למכירה": {
            count: 0,
            cityCount: {},
            maxPrice: 0,
        },
        "דירה להשכרה": {
            count: 0,
            cityCount: {},
            maxPrice: 0,
        }
    };

    apartments.forEach(apartment => {
        const type = apartment.type;
        const city = apartment.address.city;
        const price = parseInt(String(apartment.price).replace(/,/g, ''));

        if (typeData[type]) {
            typeData[type].count++;
            typeData[type].cityCount[city] = (typeData[type].cityCount[city] || 0) + 1;
            if (price > typeData[type].maxPrice) {
                typeData[type].maxPrice = price;
            }
        }
    });


    const getTopCityAndRegion = (cityCount, apartments, type) => {
        const topCity = Object.entries(cityCount).sort((a, b) => b[1] - a[1])[0]?.[0];
        const region = apartments.find(a => a.address.city === topCity && a.type === type)?.address.region || null;
        return { topCity, region };
    };

    const sale = typeData["דירה למכירה"];
    const rent = typeData["דירה להשכרה"];

    const saleCityRegion = getTopCityAndRegion(sale.cityCount, apartments, "דירה למכירה");
    const rentCityRegion = getTopCityAndRegion(rent.cityCount, apartments, "דירה להשכרה");

    let dominantType = null; // "only_sale" | "only_rent" | "sale" | "rent" | "equal"

    if (sale.count > 0 && rent.count === 0) {
        dominantType = "only_sale";
    } else if (rent.count > 0 && sale.count === 0) {
        dominantType = "only_rent";
    } else if (sale.count > rent.count) {
        dominantType = "sale";
    } else if (rent.count > sale.count) {
        dominantType = "rent";
    } else if (sale.count === rent.count && sale.count > 0) {
        dominantType = "equal";
    }

    return {
        dominantType,
        sale: {
            count: sale.count,
            topCity: saleCityRegion.topCity,
            region: saleCityRegion.region,
            maxPrice: sale.maxPrice
        },
        rent: {
            count: rent.count,
            topCity: rentCityRegion.topCity,
            region: rentCityRegion.region,
            maxPrice: rent.maxPrice
        }
    };
};

// Function to filter apartments based on user preferences (type, price, city, region)
const getFilteredApartments = async (apartments, type, maxPrice, city, region, numResults) => {
    const results = [];

    const cleanPrice = (price) => parseInt(String(price).replace(/,/g, ''));

    // שלב 1: חיפוש לפי עיר + איזור + מחיר + סוג
    const level1 = apartments.filter(ap =>
        ap.type === type &&
        cleanPrice(ap.price) <= maxPrice &&
        ap.address.city === city &&
        ap.address.region === region
    );
    results.push(...level1);

    // אם יש מספיק, נחזיר
    if (results.length >= numResults) return results.slice(0, numResults);

    // שלב 2: חיפוש לפי איזור + מחיר + סוג (בלי עיר)
    const level2 = apartments.filter(ap =>
        ap.type === type &&
        cleanPrice(ap.price) <= maxPrice &&
        ap.address.region === region &&
        !results.includes(ap)
    );
    results.push(...level2);

    // אם יש מספיק, נחזיר
    if (results.length >= numResults) return results.slice(0, numResults);

    // שלב 3: חיפוש לפי איזור + סוג בלבד (בלי מחיר)
    const level3 = apartments.filter(ap =>
        ap.type === type &&
        ap.address.region === region &&
        !results.includes(ap)
    );
    results.push(...level3);

    return results.slice(0, numResults);
};

// Function to get recommended apartments based on user preferences
const getRecommendedApartments = async (userId) => {
    // 1. שליפת נתוני המשתמש
    const user = await User.findById(userId).populate('savedApartments').populate('recentlyViewedApartments');
    if (!user || (!user.savedApartments && !user.recentlyViewedApartments)) {
        return [];
    }
    const apartments = [...user.savedApartments, ...user.recentlyViewedApartments];

    // 2. קבלת העדפות המשתמש
    const { dominantType, sale, rent } = getUserPreferences(apartments);

    // 3. שליפת כל הדירות המאושרות
    const allApartments = await Apartment.find({ status: "מאושר" });
    const userApartments = await Apartment.find({ owner: userId });

    // 4. הסרת דירות שצפה ושמר המשתמש
    const filteredApartments = allApartments.filter(apartment =>
        !user.savedApartments.some(saved => saved._id.toString() === apartment._id.toString()) &&
        !user.recentlyViewedApartments.some(viewed => viewed._id.toString() === apartment._id.toString()) &&
        !userApartments.some(ap => ap._id.toString() === apartment._id.toString())
    ).sort((a, b) => b.createdAt - a.createdAt);

    // 5. שליפת דירות לפי ההעדפות של המשתמש
    let recommendedApartments = [];

    if (dominantType === "only_sale") {
        recommendedApartments = await getFilteredApartments(
            filteredApartments,
            "דירה למכירה",
            sale.maxPrice,
            sale.topCity,
            sale.region,
            4
        );
    } else if (dominantType === "only_rent") {
        recommendedApartments = await getFilteredApartments(
            filteredApartments,
            "דירה להשכרה",
            rent.maxPrice,
            rent.topCity,
            rent.region,
            4
        );
    } else if (dominantType === "sale" || dominantType === "rent") {
        const primaryType = dominantType === "sale" ? "דירה למכירה" : "דירה להשכרה";
        const secondaryType = dominantType === "sale" ? "דירה להשכרה" : "דירה למכירה";
        const primaryPrefs = dominantType === "sale" ? sale : rent;
        const secondaryPrefs = dominantType === "sale" ? rent : sale;

        const primaryResults = await getFilteredApartments(
            filteredApartments,
            primaryType,
            primaryPrefs.maxPrice,
            primaryPrefs.topCity,
            primaryPrefs.region,
            3
        );

        const secondaryResults = await getFilteredApartments(
            filteredApartments,
            secondaryType,
            secondaryPrefs.maxPrice,
            secondaryPrefs.topCity,
            secondaryPrefs.region,
            1
        );

        recommendedApartments = [...primaryResults, ...secondaryResults];
    } else if (dominantType === "equal") {
        const saleResults = await getFilteredApartments(
            filteredApartments,
            "דירה למכירה",
            sale.maxPrice,
            sale.topCity,
            sale.region,
            2
        );

        const rentResults = await getFilteredApartments(
            filteredApartments,
            "דירה להשכרה",
            rent.maxPrice,
            rent.topCity,
            rent.region,
            2
        );

        recommendedApartments = [...saleResults, ...rentResults];
    }

    return recommendedApartments;
};

// Fetch recommended apartments for a user
router.get('/recommended-apartments/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        const recommendedApartments = await getRecommendedApartments(userId);

        if (recommendedApartments.length === 0) {
            return res.status(404).send({ message: 'No relevant apartments found based on your preferences.' });
        }

        res.status(200).send({
            message: 'Recommended apartments retrieved successfully.',
            apartments: recommendedApartments
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error. Please try again later.' });
    }
});


module.exports = router;