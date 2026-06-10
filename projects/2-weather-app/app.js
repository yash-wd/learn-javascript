/* =============================================================================
 * WEATHER APP — STARTER
 * =============================================================================
 * Fill in the TODOs. The README has the full step-by-step.
 * Solution is in solution.js — try first!
 *
 * Lessons used: 26 Fetch · 20 Async/Await · 22 Errors · 33 Dates · 24 DOM
 * ========================================================================== */

// ── Elements ─────────────────────────────────────────────────────────────────
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

// ── Weather code → text + emoji (Open-Meteo's WMO codes) ─────────────────────
// Provided for you. Use describe(code) to look one up.
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

// ── Step 1: get coordinates for a city name ──────────────────────────────────
async function getCoordinates(city) {
  // TODO 1:
  //   - fetch: https://geocoding-api.open-meteo.com/v1/search?name=<city>&count=1
  //     (use encodeURIComponent(city) so spaces/accents work)
  //   - if !response.ok → throw new Error('Could not reach the location service')
  //   - parse JSON; if !data.results || data.results.length === 0
  //       → throw new Error('City not found')
  //   - return { name, country, latitude, longitude } from data.results[0]
}

// ── Step 2: get current weather for coordinates ──────────────────────────────
async function getWeather(lat, lon) {
  // TODO 2:
  //   - fetch the forecast URL with
  //       ?latitude=<lat>&longitude=<lon>&current=temperature_2m,weather_code,wind_speed_10m
  //   - check response.ok, parse JSON, return data.current
}

// ── Step 3: show results on the page ─────────────────────────────────────────
function showWeather(place, weather) {
  // TODO 3:
  //   - const [text, emoji] = describe(weather.weather_code)
  //   - set placeEl, tempEl (weather.temperature_2m + '°C'), emojiEl,
  //     conditionEl, windEl (weather.wind_speed_10m + ' km/h')
  //   - set dateEl to today's date with Intl.DateTimeFormat (lesson 33)
  //   - reveal the card: result.classList.remove('hidden')
}

// ── Wire up the form ─────────────────────────────────────────────────────────
form.addEventListener('submit', async (event) => {
  // TODO 4:
  //   - event.preventDefault()
  //   - read & trim the city; ignore if empty
  //   - show "Loading…" in statusEl, hide the result card
  //   - try:
  //       const place = await getCoordinates(city)
  //       const weather = await getWeather(place.latitude, place.longitude)
  //       showWeather(place, weather)
  //       clear statusEl
  //     catch (err):
  //       statusEl.textContent = err.message; add 'error' class
});
