const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const mongoURI = 'mongodb+srv://username:<password>@cluster0.lh7wn6f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB
mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// Import routes
const userRoutes = require('./routes/users');
const tweetRoutes = require('./routes/tweets');

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/tweets', tweetRoutes);

const PORT = 5002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

