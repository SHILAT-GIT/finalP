const mongoose = require('mongoose');

const apartmentSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, required: true },
    price: { type: Number, required: true },
    address: { type: String, required: true },
    address: {
        apartmentNumber: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        region: {
            type: String,
            enum: ["צפון", "שרון", "מרכז", "שפלה", "דרום", "ירושלים והסביבה", "יהודה ושומרון"],
            required: true
        }
    },
    apartmentDetails: {
        sizeInSquareMeters: { type: Number, required: true },
        numberOfRooms: { type: Number, required: true },
        floor: { type: Number, required: true }
    },
    description: String,
    images: [String],
    status: {
        type: String,
        enum: ['מאושר', 'ממתין לאישור', 'נדחה'],
        default: 'ממתין לאישור'
    }
});

module.exports = mongoose.model('Apartment', apartmentSchema);