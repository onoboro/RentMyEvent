const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

const app = express();
connectDB();

require('dotenv').config();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: true,
}));
app.set('view engine', 'ejs');
console.log('Mongo URI:', process.env.MONGO_URI);

app.use(authRoutes);
app.get('/', (req, res) => {
    res.render('welcome'); // Render the welcome.ejs file
});

app.listen(3000, (err) => {
    if (err) {
        console.error("Error occurred while starting the server:", err);
        process.exit(1); // Exit the process if there's an error
    } else {
        console.log("Server running on http://localhost:3000");
    }
});

