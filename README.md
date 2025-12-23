# TRAVIGO - Smart Travel Itinerary Generator

Generate intelligent, budget-optimized day-wise travel itineraries effortlessly!

## 🌟 Features

- **Smart Budget Allocation** - Automatically distributes your budget across accommodation, meals, activities, and transport
- **Day-wise Itineraries** - Get detailed plans for each day of your trip
- **Activity Recommendations** - Curated activities based on your budget tier
- **Cost Optimization** - Maximizes experiences within your budget constraints
- **Mobile Responsive** - Works seamlessly on all devices
- **Real-time Generation** - Instant itinerary creation

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/travigo.git
   cd travigo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

## 📖 Usage

1. Enter your destination (e.g., Paris, Bangkok)
2. Set your total budget in your preferred currency
3. Specify trip duration in days (1-30 days)
4. Click "Generate Itinerary"
5. Get a detailed day-by-day plan with activities, meals, and accommodation

## 💰 Budget Categories

The app automatically allocates budget across these categories:

- **Accommodation** - Hotels, hostels, or homestays based on budget tier
- **Meals** - Breakfast, lunch, and dinner options
- **Activities** - Museums, tours, adventure sports, cultural experiences
- **Transport** - Local transportation within the city

## 🏗️ Project Structure

```
travigo/
├── src/
│   └── generator.js          # Core itinerary generation logic
├── public/
│   ├── index.html           # Frontend interface
│   └── styles.css           # Styling (Tailwind CSS ready)
├── test/
│   └── generator.test.js    # Unit tests
├── server.js                # Express server
├── package.json             # Dependencies
└── README.md               # This file
```

## 🧪 Testing

Run the test suite:

```bash
npm test
```

Tests cover:
- Budget allocation correctness
- Day-by-day itinerary generation
- Accommodation tier selection
- Activity recommendations

## 🔌 API Endpoints

### Generate Itinerary
**POST** `/api/generate-itinerary`

**Request Body:**
```json
{
  "destination": "Paris",
  "budget": 2000,
  "duration": 5
}
```

**Response:**
```json
{
  "destination": "Paris",
  "duration": 5,
  "totalBudget": 2000,
  "budgetBreakdown": {
    "accommodation": 350,
    "meals": 1000,
    "activities": 500,
    "transport": 150
  },
  "itinerary": [
    {
      "day": 1,
      "title": "Day 1 in Paris",
      "morning": "Arrival and check-in...",
      "afternoon": "City Tour",
      "evening": "Sunset viewing...",
      "accommodation": "Mid-range Hotel",
      "meals": {...},
      "estimatedCost": 150,
      "tips": "..."
    }
    ...
  ]
}
```

### Health Check
**GET** `/api/health`

Returns: `{ "status": "ok", "message": "TRAVIGO server is running" }`

## 🎨 Frontend Technology

- **Vanilla JavaScript** - No framework dependencies for lightweight implementation
- **Custom CSS** - Tailwind CSS-inspired design system
- **Responsive Design** - Mobile-first approach
- **Modern UI/UX** - Gradient backgrounds and smooth interactions

## 🔮 Future Enhancements

- [ ] React.js rewrite for better component structure
- [ ] Integration with real travel APIs (Google Maps, booking.com)
- [ ] User authentication and saved itineraries
- [ ] Real-time exchange rates
- [ ] Social sharing features
- [ ] Mobile app (React Native)
- [ ] Hotel and flight recommendations
- [ ] Weather integration
- [ ] Local event integration
- [ ] Multi-language support

## 📱 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect repository to Vercel
3. Set up environment variables if needed
4. Deploy!

### Heroku
```bash
heroku login
heroku create travigo-app
git push heroku main
```

### Docker
```bash
docker build -t travigo .
docker run -p 3000:3000 travigo
```

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Issues & Bugs

Found a bug? Please create an issue on GitHub with:
- Description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)

## 📧 Contact & Support

- **Email**: kankshinideotale@gmail.com
- **GitHub**: https://github.com/kankshini

## 🙏 Acknowledgments

- Inspired by travel enthusiasts everywhere
- Thanks to the Node.js and Express communities
- Icons and gradients from design inspiration

---

**Happy Traveling! ✈️🌍**

Made with ❤️ by TRAVIGO Team
