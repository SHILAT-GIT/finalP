const express = require('express')
const mongoose = require('mongoose')
const path = require('path');
const app = express()
app.use(express.json());

const cors = require('cors');
app.use(cors());

const dotenv = require('dotenv');
dotenv.config();

const connectdb = require('./db');

connectdb();

// הגדרת נתיב לתיקיית הסטטיים
app.use(express.static(path.join(__dirname, '..', 'client')));

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
// הגדרת נתיב לבית
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'mainPage.html'));
});

//  ייבוא הראוטרים
const userRoutes = require('./routes/userRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');

//  חיבור הראוטרים
app.use('/api/users', userRoutes);
app.use('/api/inquiries', inquiryRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("server is running")
})


