// API Client Example for TRAVIGO Gemini Integration
// This file shows how to call the /api/generate-itinerary endpoint

/**
 * Generate travel itinerary using Gemini AI
 * @param {Object} params - Request parameters
 * @param {string} params.destination - Travel destination (required)
 * @param {number} params.budget - Total budget in USD (required)
 * @param {number} params.days - Number of days for the trip (required)
 * @param {number} params.travelers - Number of travelers (optional, default: 1)
 * @param {string} params.tripType - Type of trip: adventure, luxury, budget, culture, etc. (optional)
 * @returns {Promise<Object>} Generated itinerary object
 */
async function generateItinerary(params) {
  try {
    // Validate required parameters
    if (!params.destination || !params.budget || !params.days) {
      throw new Error('Missing required parameters: destination, budget, days');
    }

    // Make API request
    const response = await fetch('/api/generate-itinerary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    // Check if response is successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate itinerary');
    }

    // Return the itinerary
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating itinerary:', error.message);
    throw error;
  }
}

/**
 * Display generated itinerary in HTML
 * @param {Object} itinerary - Generated itinerary object
 * @param {HTMLElement} container - Container element to display the itinerary
 */
function displayItinerary(itinerary, container) {
  const html = `
    <div class="itinerary-result">
      <h2>${itinerary.destination} - ${itinerary.days} Day Trip</h2>
      <div class="trip-details">
        <p><strong>Budget:</strong> $${itinerary.budget}</p>
        <p><strong>Travelers:</strong> ${itinerary.travelers}</p>
        <p><strong>Trip Type:</strong> ${itinerary.tripType}</p>
        <p><strong>Generated:</strong> ${new Date(itinerary.generatedAt).toLocaleString()}</p>
      </div>
      <div class="itinerary-content">
        ${itinerary.itinerary
          .split('\n')
          .map((line) => `<p>${line}</p>`)
          .join('')}
      </div>
    </div>
  `;
  
  if (container) {
    container.innerHTML = html;
  }
  
  return html;
}

// ============================================
// USAGE EXAMPLES
// ============================================

// Example 1: Simple usage
async function example1() {
  try {
    const itinerary = await generateItinerary({
      destination: 'Paris',
      budget: 2000,
      days: 5,
    });
    console.log('Generated itinerary:', itinerary);
    displayItinerary(itinerary, document.getElementById('result'));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Example 2: With all parameters
async function example2() {
  try {
    const itinerary = await generateItinerary({
      destination: 'Tokyo',
      budget: 3000,
      days: 7,
      travelers: 2,
      tripType: 'adventure',
    });
    console.log('Generated itinerary:', itinerary);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Example 3: With loading state
async function example3() {
  const container = document.getElementById('result');
  const submitBtn = document.getElementById('generateBtn');

  submitBtn.addEventListener('click', async () => {
    // Show loading state
    submitBtn.disabled = true;
    container.innerHTML = '<p>⏳ Generating your itinerary...</p>';

    try {
      const itinerary = await generateItinerary({
        destination: document.getElementById('destination').value,
        budget: parseFloat(document.getElementById('budget').value),
        days: parseInt(document.getElementById('days').value),
        travelers: parseInt(document.getElementById('travelers').value) || 1,
        tripType: document.getElementById('tripType').value,
      });

      displayItinerary(itinerary, container);
    } catch (error) {
      container.innerHTML = `<p class="error">Error: ${error.message}</p>`;
    } finally {
      submitBtn.disabled = false;
    }
  });
}

// Example 4: Using async/await in form handler
async function handleFormSubmit(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const params = {
    destination: formData.get('destination'),
    budget: parseFloat(formData.get('budget')),
    days: parseInt(formData.get('days')),
    travelers: parseInt(formData.get('travelers')) || 1,
    tripType: formData.get('tripType'),
  };

  try {
    const itinerary = await generateItinerary(params);
    displayItinerary(itinerary, document.getElementById('result'));
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

// ============================================
// CURL EXAMPLES (from command line)
// ============================================

/*

Example 1: Basic request
curl -X POST http://localhost:3000/api/generate-itinerary \
  -H "Content-Type: application/json" \
  -d "{\"destination\":\"Paris\",\"budget\":2000,\"days\":5}"

Example 2: With all parameters
curl -X POST http://localhost:3000/api/generate-itinerary \
  -H "Content-Type: application/json" \
  -d "{\"destination\":\"Tokyo\",\"budget\":3000,\"days\":7,\"travelers\":2,\"tripType\":\"adventure\"}"

Example 3: Using format (Windows)
curl -X POST http://localhost:3000/api/generate-itinerary ^
  -H "Content-Type: application/json" ^
  -d "{\"destination\":\"Dubai\",\"budget\":5000,\"days\":10,\"travelers\":4,\"tripType\":\"luxury\"}"

*/

// ============================================
// EXPORT FOR MODULE USE
// ============================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    generateItinerary,
    displayItinerary,
  };
}
