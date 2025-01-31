const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Love Pair Schema
const lovePairSchema = new mongoose.Schema({
  name1: String,
  name2: String,
  percentage: Number,
  timestamp: { type: Date, default: Date.now }
});

const LovePair = mongoose.model('LovePair', lovePairSchema);

// Routes
app.post('/api/calculate-love', async (req, res) => {
  const { name1, name2 } = req.body;
  
  // Generate random love percentage (just for fun)
  const percentage = Math.floor(Math.random() * 50) + 50; // Between 50-100%

  try {
    const newPair = new LovePair({ name1, name2, percentage });
    await newPair.save();
    res.json({ percentage });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/results', async (req, res) => {
  try {
    const results = await LovePair.find().sort({ timestamp: -1 }).limit(10);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));