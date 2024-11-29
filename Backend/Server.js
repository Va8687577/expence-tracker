const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth'); // Adjust the path to your auth file
const transactionRoutes = require('./routes/transaction');
const dotenv = require('dotenv');

const app = express();

// Config the dotenv file
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json()); // Ensure body-parser middleware is set

// Routes
app.use('/api', authRoutes);
app.use('/api/transactions', transactionRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err.message));

// Start the server
app.listen(5000, () => {
  console.log('Server running on port 5000');
});
