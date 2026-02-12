require('dotenv').config();
const express = require('express');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Middleware
app.use(express.json());
app.use(express.static('public'));

// API endpoint to generate itinerary using Gemini AI
app.post('/api/generate-itinerary', async (req, res) => {
  try {
    const { destination, budget, days, travelers, tripType } = req.body;

    // Validate input
    if (!destination || budget === undefined || !days) {
      return res.status(400).json({
        error: 'Missing required fields: destination, budget, days'
      });
    }

    // Validate API key
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'Gemini API key not configured'
      });
    }

    if (budget <= 0 || days <= 0) {
      return res.status(400).json({
        error: 'Budget and days must be positive numbers'
      });
    }

    if (days > 30) {
      return res.status(400).json({
        error: 'Trip duration cannot exceed 30 days'
      });
    }

    // Create detailed prompt for Gemini
    const prompt = `Create a detailed ${days}-day travel itinerary for ${destination} with the following details:
- Total Budget: $${budget}
- Number of Days: ${days}
- Number of Travelers: ${travelers || 'not specified'}
- Trip Type: ${tripType || 'general tourism'}

Please generate a comprehensive itinerary that includes:
1. Day-wise plan with specific places to visit
2. Recommended restaurants and food suggestions
3. Budget breakdown (accommodation, food, activities, transport)
4. Daily budget allocation
5. Travel tips and local insights
6. Best time to visit certain attractions

Format the itinerary in a clear, well-organized manner with day-by-day details.`;

    // Call Gemini API
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const itineraryText = response.text();

    // Return formatted response
    res.json({
      destination,
      days,
      budget,
      travelers: travelers || 1,
      tripType: tripType || 'general tourism',
      itinerary: itineraryText,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating itinerary:', error.message);
    
    if (error.message.includes('API key')) {
      return res.status(500).json({
        error: 'Gemini API key is invalid or not configured'
      });
    }
    
    res.status(500).json({
      error: 'Failed to generate itinerary. Please try again.',
      details: error.message
    });
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
