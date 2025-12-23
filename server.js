const express = require('express');
const path = require('path');
const ItineraryGenerator = require('./src/generator');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// API endpoint to generate itinerary
app.post('/api/generate-itinerary', (req, res) => {
  try {
    const { destination, budget, duration, tripType } = req.body;

    // Validate input
    if (!destination || !budget || !duration) {
      return res.status(400).json({
        error: 'Missing required fields: destination, budget, duration'
      });
    }

    if (budget <= 0 || duration <= 0) {
      return res.status(400).json({
        error: 'Budget and duration must be positive numbers'
      });
    }

    if (duration > 30) {
      return res.status(400).json({
        error: 'Trip duration cannot exceed 30 days'
      });
    }

    // Generate itinerary
    const generator = new ItineraryGenerator(destination, budget, duration, tripType || 'all');
    const itinerary = generator.generate();

    res.json(itinerary);
  } catch (error) {
    console.error('Error generating itinerary:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'TRAVIGO server is running' });
});

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`TRAVIGO server running on http://localhost:${PORT}`);
});
