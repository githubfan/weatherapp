const prompt = require("prompt-sync")();
// Import Geocoding APi Key
const config = require("./config");
const apiKey = config.apiKey;
// Defining latitude and longitude variables
let latitude = 0;
let longitude = 0;

// prompt user to enter place name
const place = prompt("Place Name: ");

// Geocoding API
const geocodingApi = `https://geocode.maps.co/search?q=${place}&api_key=${apiKey}`;
fetch(geocodingApi)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not okay");
    }
    return response.json();
  })
  .then((geocodeData) => {
    // Getting the First geocoding response
    const firstValue = geocodeData[0];
    // Extracting latitude and longitude
    latitude = Number(firstValue.lat);
    longitude = Number(firstValue.lon);

    // Weather API
    const weatherApi = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&forecast_days=1`;

    fetch(weatherApi)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not okay");
        }
        return response.json();
      })
      .then((weatherData) => {
        console.log(weatherData);
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error,
        );
      });
  })
  .catch((error) => {
    console.error("There has been a problem with your fetch operation:", error);
  });
