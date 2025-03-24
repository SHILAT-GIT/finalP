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
app.use(express.static(path.join(__dirname, 'public')));

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
// הגדרת נתיב לבית
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'mainPage.html'));
});


/*const usersRoutes = require("./routes/usersRoutes");
const productsRoutes = require("./routes/productsRoutes");
app.use("/users",usersRoutes);
app.use("/products",productsRoutes);*/

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("server is running")
})


