const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const user = new User({ username, email, password: await bcrypt.hash(password, 10) });
        await user.save();
        res.json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user._id }, 'secretKey', { expiresIn: '1h' });
            res.json({ token });
        } else {
            res.status(400).json({ error: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get profile
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Follow/Unfollow
router.put('/:id/follow', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userId);
        if (user.followers.includes(req.body.userId)) {
            user.followers.pull(req.body.userId);
            currentUser.following.pull(req.params.id);
        } else {
            user.followers.push(req.body.userId);
            currentUser.following.push(req.params.id);
        }
        await user.save();
        await currentUser.save();
        res.json({ message: 'Follow status updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
