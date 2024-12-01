const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { router: addUserRoutes } = require('./routes/userRoutes');

const userRoutes = require('./routes/adminUserRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
// const addUserRoutes = require('./routes/userRoutes');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/add-user',addUserRoutes);
app.use('/api/payments', paymentRoutes);
// Import and run the cron job
require('./cronJob');
// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/chitfund', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('Error connecting to MongoDB:', err));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
