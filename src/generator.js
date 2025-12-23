// Itinerary Generator Logic
// Generates day-wise travel itineraries based on budget and duration

class ItineraryGenerator {
  constructor(destination, budget, duration, tripType = 'all', activities = []) {
    this.destination = destination;
    this.budget = budget; // in currency units
    this.duration = duration; // in days
    this.tripType = tripType; // 'family' | 'friends' | 'couple' | 'all'
    this.activities = activities; // optional activity database override
  }

  // Activity database with estimated costs
  static DEFAULT_ACTIVITIES = {
    accommodation: {
      budget: { cost: 30, name: 'Budget Hostel' },
      mid: { cost: 80, name: 'Mid-range Hotel' },
      luxury: { cost: 200, name: 'Luxury Hotel' }
    },
    meals: {
      budget: { cost: 15, name: 'Street Food & Local Eateries' },
      mid: { cost: 40, name: 'Casual Restaurants' },
      luxury: { cost: 100, name: 'Fine Dining' }
    },
    activities: [
      { name: 'Museum', cost: 20, duration: 3, suitableFor: ['family', 'couple', 'friends', 'all'] },
      { name: 'Hiking/Nature Trail', cost: 0, duration: 4, suitableFor: ['friends', 'family', 'all'] },
      { name: 'City Tour', cost: 50, duration: 4, suitableFor: ['family', 'friends', 'couple', 'all'] },
      { name: 'Food Tour', cost: 60, duration: 3, suitableFor: ['friends', 'couple', 'all'] },
      { name: 'Local Market Visit', cost: 0, duration: 2, suitableFor: ['family', 'friends', 'all'] },
      { name: 'Beachside Relaxation', cost: 0, duration: 4, suitableFor: ['couple', 'family', 'all'] },
      { name: 'Adventure Sports', cost: 100, duration: 3, suitableFor: ['friends', 'all'] },
      { name: 'Cultural Festival', cost: 25, duration: 5, suitableFor: ['family', 'friends', 'couple', 'all'] },
      { name: 'Photography Walk', cost: 0, duration: 3, suitableFor: ['couple', 'friends', 'all'] },
      { name: 'Spa & Wellness', cost: 80, duration: 2, suitableFor: ['couple', 'all'] }
    ],
    transport: {
      daily: { cost: 20, name: 'Local Transport' },
      tour: { cost: 0, name: 'Walk Around' }
    }
  };

  // Determine accommodation tier based on budget per day
  getAccommodationTier() {
    const perDay = this.budget / this.duration;
    if (perDay < 50) return 'budget';
    if (perDay < 250) return 'mid';
    return 'luxury';
  }

  // Determine meal tier based on budget per day
  getMealTier() {
    const perDay = this.budget / this.duration;
    if (perDay < 50) return 'budget';
    if (perDay < 250) return 'mid';
    return 'luxury';
  }

  // Calculate remaining budget after accommodation and meals
  calculateActivityBudget() {
    const tier = this.getAccommodationTier();
    const mealTier = this.getMealTier();
    
    const accommodation = ItineraryGenerator.DEFAULT_ACTIVITIES.accommodation[tier];
    const meals = ItineraryGenerator.DEFAULT_ACTIVITIES.meals[mealTier];
    const transportDaily = ItineraryGenerator.DEFAULT_ACTIVITIES.transport.daily.cost;

    const dailyCost = (accommodation.cost + meals.cost * 2 + transportDaily) * this.duration;
    return Math.max(0, this.budget - dailyCost);
  }

  // Select activities within budget constraints
  selectActivities(activityBudget) {
    const activities = this.activities.length ? this.activities : ItineraryGenerator.DEFAULT_ACTIVITIES.activities;
    const selected = [];
    let spent = 0;

    // Filter by trip type suitability
    const filtered = activities.filter(a => {
      if (!a.suitableFor) return true;
      return a.suitableFor.includes(this.tripType) || a.suitableFor.includes('all');
    });

    // Sort activities by cost (cheapest first)
    const sorted = [...filtered].sort((a, b) => a.cost - b.cost);

    for (const activity of sorted) {
      if (spent + activity.cost <= activityBudget) {
        selected.push(activity);
        spent += activity.cost;
      }
    }

    return selected;
  }

  // Generate day-wise itinerary
  generate() {
    const itinerary = [];
    const accommodationTier = this.getAccommodationTier();
    const mealTier = this.getMealTier();
    const activityBudget = this.calculateActivityBudget();
    const activities = this.selectActivities(activityBudget);

    const accommodation = ItineraryGenerator.DEFAULT_ACTIVITIES.accommodation[accommodationTier];
    const meals = ItineraryGenerator.DEFAULT_ACTIVITIES.meals[mealTier];

    for (let day = 1; day <= this.duration; day++) {
      const dayItinerary = {
        day: day,
        title: `Day ${day} in ${this.destination}`,
        morning: this.getMorningActivity(day, activities),
        afternoon: this.getAfternoonActivity(day, activities),
        evening: this.getEveningActivity(day),
        accommodation: accommodation.name,
        meals: {
          breakfast: `${meals.name} - Breakfast`,
          lunch: `${meals.name} - Lunch`,
          dinner: `${meals.name} - Dinner`
        },
        estimatedCost: accommodation.cost + meals.cost * 2,
        tips: this.getDayTips(day)
      };

      itinerary.push(dayItinerary);
    }

    return {
      destination: this.destination,
      duration: this.duration,
      totalBudget: this.budget,
      budgetBreakdown: (function() {
        // Compose breakdown and ensure it does not exceed total budget by reducing transport/meals/accommodation
        let accommodationTotal = accommodation.cost * this.duration;
        let mealsTotal = meals.cost * 2 * this.duration;
        let transportTotal = ItineraryGenerator.DEFAULT_ACTIVITIES.transport.daily.cost * this.duration;
        let activitiesTotal = activityBudget;

        let sum = accommodationTotal + mealsTotal + activitiesTotal + transportTotal;
        if (sum > this.budget) {
          let over = sum - this.budget;
          // reduce transport first
          const reduceTransport = Math.min(over, transportTotal);
          transportTotal -= reduceTransport;
          over -= reduceTransport;
          // then reduce meals
          if (over > 0) {
            const reduceMeals = Math.min(over, mealsTotal);
            mealsTotal -= reduceMeals;
            over -= reduceMeals;
          }
          // then reduce accommodation
          if (over > 0) {
            const reduceAcc = Math.min(over, accommodationTotal);
            accommodationTotal -= reduceAcc;
            over -= reduceAcc;
          }
          // if still over, set activities to 0 (already likely)
          if (over > 0) {
            activitiesTotal = Math.max(0, activitiesTotal - over);
            over = 0;
          }
        }

        return {
          accommodation: accommodationTotal,
          meals: mealsTotal,
          activities: activitiesTotal,
          transport: transportTotal
        };
      }).call(this),
      itinerary: itinerary
    };
  }

  // Get morning activity
  getMorningActivity(day, activities) {
    if (day === 1) {
      return 'Arrival and check-in at accommodation. Rest and explore nearby area.';
    }
    return activities[day % activities.length]?.name || 'Explore local area';
  }

  // Get afternoon activity
  getAfternoonActivity(day, activities) {
    const idx = (day + 1) % activities.length;
    return activities[idx]?.name || 'Visit local market or attractions';
  }

  // Get evening activity
  getEveningActivity(day) {
    const eveningActivities = [
      'Sunset viewing at scenic location',
      'Local cultural show or performance',
      'Street food tasting',
      'Pub crawl or nightlife',
      'Rooftop bar experience'
    ];
    return eveningActivities[day % eveningActivities.length];
  }

  // Get tips for the day
  getDayTips(day) {
    const tips = [
      'Wake up early to avoid crowds',
      'Book popular attractions in advance',
      'Carry water and comfortable shoes',
      'Try local cuisine at hidden gems',
      'Use public transport to save money',
      'Take photos during golden hour',
      'Respect local customs and culture',
      'Keep some cash for street vendors'
    ];
    return tips[day % tips.length];
  }
}

// Export for Node.js and browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ItineraryGenerator;
}
