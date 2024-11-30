const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

// Initialize App
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(passport.initialize());

// Database Connection
require('./data/connection/connection');

// Passport Configuration
require('./services/authService');

// Routes
app.use('/api/users', require('./routes/users'));

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
