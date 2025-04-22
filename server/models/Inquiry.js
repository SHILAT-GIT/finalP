const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
    date: String,
    apartment: { type: mongoose.Schema.Types.ObjectId, ref: 'Apartment' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: {
        type: String,
        enum: ['התקבל', 'בטיפול', 'טופל'],
        default: 'התקבל'
    }
});

module.exports = mongoose.model('Inquiry', inquirySchema);