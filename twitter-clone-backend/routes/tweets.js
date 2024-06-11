const express = require('express');
const Tweet = require('../models/Tweet');
const router = express.Router();

// Create a tweet
router.post('/', async (req, res) => {
    try {
        const tweet = new Tweet(req.body);
        await tweet.save();
        res.json(tweet);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all tweets
router.get('/', async (req, res) => {
    try {
        const tweets = await Tweet.find().populate('user', 'username').sort({ createdAt: -1 });
        res.json(tweets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Like a tweet
router.put('/:id/like', async (req, res) => {
    try {
        const tweet = await Tweet.findById(req.params.id);
        if (tweet.likes.includes(req.body.userId)) {
            tweet.likes.pull(req.body.userId);
        } else {
            tweet.likes.push(req.body.userId);
        }
        await tweet.save();
        res.json(tweet);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Comment on a tweet
router.post('/:id/comment', async (req, res) => {
    try {
        const tweet = await Tweet.findById(req.params.id);
        tweet.comments.push({ user: req.body.userId, text: req.body.text });
        await tweet.save();
        res.json(tweet);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;