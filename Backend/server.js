const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// --- ADDED: Sample request to test the server ---
// This will respond when you visit the root URL (e.g., http://localhost:5000)
app.get('/', (req, res) => {
    res.send('✅ Campus Pay API is running!');
});

// Mount the main API router
// All routes defined in routes/api.js will be prefixed with /api
app.use('/api', require('./routes/api'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));