const mongoose = require('mongoose');

const generalnquirySchema = new mongoose.Schema({
    date: String,
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    status: {
        type: String,
        enum: ['התקבלה', 'בטיפול', 'טופל'],
        default: 'התקבלה'
    }
});

module.exports = mongoose.model('GeneralInquiry', generalnquirySchema);