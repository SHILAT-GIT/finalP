const mongoose = require('mongoose');

const generalnquirySchema = new mongoose.Schema({
    date: String,
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    status: {
        type: String,
        enum: ['התקבל', 'בטיפול', 'טופל'],
        default: 'התקבל'
    }
});

module.exports = mongoose.model('GeneralInquiry', generalnquirySchema);