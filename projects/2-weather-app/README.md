# Project 2 — Weather App

A real app that talks to the internet. Type a city, and it fetches live weather
from a free public API and displays it — with the current date nicely formatted.

## What it does
- Type a city and submit
- Looks up the city's coordinates (geocoding API)
- Fetches current weather for those coordinates (weather API)
- Shows temperature, a condition (☀️ 🌧️ ❄️ …), wind, and the formatted date
- Shows a **loading** state while fetching and a friendly **error** if it fails

## Why this API?
It uses **Open-Meteo** — completely free, **no API key**, no sign-up. Two calls:
1. `https://geocoding-api.open-meteo.com/v1/search?name=CITY&count=1`
   → returns `latitude`, `longitude`, `name`, `country`
2. `https://api.open-meteo.com/v1/forecast?latitude=LAT&longitude=LON&current=temperature_2m,weather_code,wind_speed_10m`
   → returns `current.temperature_2m`, `current.weather_code`, etc.

## Lessons you'll apply
- **25 Fetch & APIs** — `fetch`, checking `response.ok`, parsing JSON
- **20 Async/Await** — `async` functions, `await`, sequential calls
- **21 Error handling** — `try/catch`, showing a friendly message
- **32 Dates & Time** — `Intl.DateTimeFormat` for the current date
- **23 DOM** — updating the page with results

## How to run
Open `index.html` in your browser (you need an internet connection).
It loads `app.js` (starter). Switch to `solution.js` to see it finished.

> ⚠️ Some browsers restrict `fetch` from a `file://` page. If a request is
> blocked, run a tiny local server from this folder instead:
> `python3 -m http.server` then open http://localhost:8000

## Build it step by step
1. **getCoordinates(city)** — fetch the geocoding URL, check `response.ok`,
   parse JSON. If `data.results` is empty, throw an Error("City not found").
   Return `{ name, country, latitude, longitude }`.
2. **getWeather(lat, lon)** — fetch the forecast URL, check `ok`, return
   `data.current`.
3. **describe(code)** — map the numeric `weather_code` to text + an emoji
   (a small lookup object is provided in the starter).
4. **showWeather(...)** — write the results into the page (temperature, etc.)
   and the current date via `Intl.DateTimeFormat`.
5. **Wire it up** — on form submit: `preventDefault`, show "Loading…", then
   `await getCoordinates` → `await getWeather` → `showWeather`. Wrap it all in
   `try/catch` and show the error message on failure.

## Make it your own
- Add a 7-day forecast (the API supports `daily=temperature_2m_max,...`).
- Detect the user's location with `navigator.geolocation` (lesson 35) and load
  local weather on startup.
- Add a °C / °F toggle.
- Cache the last searched city in `localStorage` (lesson 34) and reload it.

## Concepts this cements
- **Chaining async calls**: the second request needs the first's result —
  classic `await A; await B(A)`.
- **Handling the real world**: networks fail, cities are misspelled. Good apps
  always show loading and error states, not just the happy path.
