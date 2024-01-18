// Allows prompt to work in the command line
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

    // Weather API call
    const weatherApi = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&forecast_days=1&daily=weather_code`;
    // Fetching weather data
    fetch(weatherApi)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not okay");
        }
        return response.json();
      })
      .then((weatherData) => {
        // Extracting Weather Code
        const weatherCode = weatherData.daily.weather_code[0];
        let weatherDesc = "";

        // Determining different weather code descriptions
        const weatherDescriptions = {
          0: "Clear sky",
          1: "Mainly clear",
          2: "Partly cloudy",
          3: "Overcast",
          45: "Fog",
          48: "Depositing Rime Fog",
          51: "Drizzle: Light intensity",
          53: "Drizzle: Moderate intensity",
          55: "Drizzle: Dense intensity",
          56: "Freezing Drizzle: Light intensity",
          57: "Freezing Drizzle: Dense intensity",
          61: "Rain: Slight intensity",
          63: "Rain: Moderate intensity",
          65: "Rain: Heavy intensity",
          66: "Freezing Rain: Light intensity",
          67: "Freezing Rain: Heavy intensity",
          71: "Snowfall: Slight intensity",
          73: "Snowfall: Moderate intensity",
          75: "Snowfall: Heavy intensity",
          77: "Snow grains",
          80: "Rain Showers: Slight intensity",
          81: "Rain Showers: Moderate intensity",
          82: "Rain Showers: Violent intensity",
          85: "Snow Showers: Slight intensity",
          86: "Snow Showers: Heavy intensity",
          95: "Thunderstorm: Slight intensity",
          96: "Thunderstorm: Moderate intensity",
          99: "Thunderstorm with heavy hail",
        };
        // Matches weather code to description
        weatherDesc = weatherDescriptions[weatherCode] || "Unknown weather code";
        
        // Print Weather Description
        console.log(`Current Weather: ${weatherDesc}`);

        // Function to format a date in the desired format
        const formatWeatherDate = (dateString) => {
          return new Date(dateString).toLocaleString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
        };

        // Only showing weather from the current hour.
        const currentHour = new Date().getHours();
        const startIndex = weatherData.hourly.time.findIndex(
          (time) => new Date(time).getHours() >= currentHour
        );

        // Formatting each weather line
        weatherData.hourly.time.slice(startIndex).forEach((time, index) => {
          const formattedDate = formatWeatherDate(time);
          const temperature =
            weatherData.hourly.temperature_2m[startIndex + index];

          // Highlight the first value in blue
          const highlight = index === 0 ? "\x1b[34m" : "\x1b[0m"; // ANSI escape codes for blue color and reset

          // Print Weather
          console.log(
            `${highlight}${formattedDate}: ${temperature}°C${highlight}`
          );
        });
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
