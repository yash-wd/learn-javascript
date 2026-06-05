/* =============================================================================
 * WEATHER APP — SOLUTION
 * =============================================================================
 * Complete, working version. Compare with your app.js after trying.
 *
 * Lessons used: 25 Fetch · 20 Async/Await · 21 Errors · 32 Dates · 23 DOM
 * ========================================================================== */

const form = document.querySelector('#search-form');
const cityInput = document.querySelector('#city-input');
const statusEl = document.querySelector('#status');
const result = document.querySelector('#result');
const placeEl = document.querySelector('#place');
const dateEl = document.querySelector('#date');
const emojiEl = document.querySelector('#emoji');
const tempEl = document.querySelector('#temp');
const conditionEl = document.querySelector('#condition');
const windEl = document.querySelector('#wind');

const WEATHER = {
  0: ['Clear sky', '☀️'],
  1: ['Mainly clear', '🌤️'],
  2: ['Partly cloudy', '⛅'],
  3: ['Overcast', '☁️'],
  45: ['Foggy', '🌫️'],
  48: ['Rime fog', '🌫️'],
  51: ['Light drizzle', '🌦️'],
  61: ['Light rain', '🌧️'],
  63: ['Rain', '🌧️'],
  65: ['Heavy rain', '⛈️'],
  71: ['Light snow', '🌨️'],
  73: ['Snow', '❄️'],
  80: ['Rain showers', '🌦️'],
  95: ['Thunderstorm', '⛈️'],
};
function describe(code) {
  return WEATHER[code] || ['Unknown', '❓'];
}

// ── Step 1: city name → coordinates ──────────────────────────────────────────
async function getCoordinates(city) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    city
  )}&count=1`;

  const response = await fetch(url);
  if (!response.ok) throw new Error('Could not reach the location service');

  const data = await response.json();
  // The geocoding API omits `results` entirely when nothing matches:
  if (!data.results || data.results.length === 0) {
    throw new Error(`City "${city}" not found`);
  }

  const { name, country, latitude, longitude } = data.results[0];
  return { name, country, latitude, longitude };
}

// ── Step 2: coordinates → current weather ────────────────────────────────────
async function getWeather(lat, lon) {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,weather_code,wind_speed_10m`;

  const response = await fetch(url);
  if (!response.ok) throw new Error('Could not load the weather');

  const data = await response.json();
  return data.current; // { temperature_2m, weather_code, wind_speed_10m, ... }
}

// ── Step 3: render results ───────────────────────────────────────────────────
function showWeather(place, weather) {
  const [text, emoji] = describe(weather.weather_code);

  placeEl.textContent = `${place.name}, ${place.country}`;
  emojiEl.textContent = emoji;
  tempEl.textContent = `${Math.round(weather.temperature_2m)}°C`;
  conditionEl.textContent = text;
  windEl.textContent = `💨 Wind: ${weather.wind_speed_10m} km/h`;

  // Format today's date nicely (lesson 32)
  dateEl.textContent = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  result.classList.remove('hidden');
}

// ── Wire up the form: chain the two async calls with proper error handling ───
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const city = cityInput.value.trim();
  if (!city) return;

  // Loading state
  statusEl.textContent = 'Loading…';
  statusEl.classList.remove('error');
  result.classList.add('hidden');

  try {
    const place = await getCoordinates(city);              // first call
    const weather = await getWeather(place.latitude, place.longitude); // second
    showWeather(place, weather);
    statusEl.textContent = '';                             // clear loading
  } catch (err) {
    // Any failure (bad city, network down, API error) lands here.
    statusEl.textContent = `⚠️ ${err.message}`;
    statusEl.classList.add('error');
    result.classList.add('hidden');
  }
});
