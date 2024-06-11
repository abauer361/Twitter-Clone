const mongoose = require('mongoose');
const TweetSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, maxlength: 280 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    retweets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }],
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        text: { type: String, required: true }
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tweet', TweetSchema);
