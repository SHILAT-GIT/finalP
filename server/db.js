const mongoose = require('mongoose')

const connectdb = async () => {

    try {
        await mongoose.connect(process.env.DB_URI)
        console.log("success")
    } catch (error) {
        console.error("fail")
    }
}

module.exports = connectdb;