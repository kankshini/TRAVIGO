const ItineraryGenerator = require('../src/generator');
const assert = require('assert');

describe('ItineraryGenerator', function() {
  let generator;

  beforeEach(function() {
    generator = new ItineraryGenerator('Paris', 2000, 5);
  });

  describe('Budget Allocation', function() {
    it('should allocate budget correctly', function() {
      const breakdown = generator.generate().budgetBreakdown;
      assert(breakdown.accommodation > 0, 'Accommodation budget should be positive');
      assert(breakdown.meals > 0, 'Meals budget should be positive');
    });

    it('should not exceed total budget', function() {
      const result = generator.generate();
      const total = result.budgetBreakdown.accommodation + 
                   result.budgetBreakdown.meals + 
                   result.budgetBreakdown.activities + 
                   result.budgetBreakdown.transport;
      assert(total <= result.totalBudget, 'Total should not exceed budget');
    });
  });

  describe('Itinerary Generation', function() {
    it('should generate correct number of days', function() {
      const result = generator.generate();
      assert.strictEqual(result.itinerary.length, 5, 'Should generate 5 days');
    });

    it('should include accommodation and meals for each day', function() {
      const result = generator.generate();
      result.itinerary.forEach(day => {
        assert(day.accommodation, 'Each day should have accommodation');
        assert(day.meals, 'Each day should have meals');
        assert(day.estimatedCost > 0, 'Each day should have estimated cost');
      });
    });

    it('should include morning and evening activities', function() {
      const result = generator.generate();
      result.itinerary.forEach(day => {
        assert(day.morning, 'Each day should have morning activity');
        assert(day.evening, 'Each day should have evening activity');
        assert(day.tips, 'Each day should have tips');
      });
    });
  });

  describe('Accommodation Tier', function() {
    it('should select budget tier for low budget', function() {
      const lowBudgetGen = new ItineraryGenerator('Bangkok', 300, 7);
      assert.strictEqual(lowBudgetGen.getAccommodationTier(), 'budget');
    });

    it('should select mid tier for medium budget', function() {
      const midBudgetGen = new ItineraryGenerator('Bangkok', 1500, 7);
      assert.strictEqual(midBudgetGen.getAccommodationTier(), 'mid');
    });

    it('should select luxury tier for high budget', function() {
      const luxuryGen = new ItineraryGenerator('Bangkok', 3500, 7);
      assert.strictEqual(luxuryGen.getAccommodationTier(), 'luxury');
    });
  });
});
