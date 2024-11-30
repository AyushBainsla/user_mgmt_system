const User = require('../data/models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Register a new user
module.exports.register = async (req, res) => {
    try {
        const { name, email, password, age } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User with this email already exists.' });
        }

        const user = await User.create({ name, email, password, age });
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: `Validation error: ${error.message}` });
        }
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Login a user and return a JWT
module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials. Please try again.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Incorrect password. Please try again.' });
        }

        // Generate a JWT
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Get all users with pagination and filters
module.exports.getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, age, name } = req.query;

        if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
            return res.status(400).json({ message: 'Invalid pagination parameters.' });
        }

        const filters = {};
        if (age) filters.age = { $gte: parseInt(age) };
        if (name) filters.name = { $regex: name, $options: 'i' };

        const users = await User.aggregate([
            { $match: filters },
            { $skip: (page - 1) * parseInt(limit) },
            { $limit: parseInt(limit) },
        ]);

        const totalUsers = await User.countDocuments(filters);

        res.status(200).json({
            users,
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: parseInt(page),
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Update a user by ID
module.exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'Invalid user ID format.' });
        }

        const user = await User.findByIdAndUpdate(id, req.body, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: `Validation error: ${error.message}` });
        }
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
