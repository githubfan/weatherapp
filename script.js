// Allows prompt to work in the command line
const prompt = require("prompt-sync")();

// Import Geocoding APi Key
const config = require("./config");
const apiKey = config.apiKey;

// Create a weather code function
function weatherCode(weatherCode) {

}
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
        // Extracting Weather Codes
        const weatherCode = weatherData.daily.weather_code[0];
        let weatherDesc = "";

        // Determining different weather code descriptions
        function weatherDecode (code) {
          if (weatherCode === 0) {
            weatherDesc = "Clear sky";
          } else if (weatherCode === 1) {
            weatherDesc = "Mainly clear";
          } else if (weatherCode === 2) {
            weatherDesc = "Partly cloudy";
          } else if (weatherCode === 3) {
            weatherDesc = "Overcast";
          } else if (weatherCode === 45) {
            weatherDesc = "Fog";
          } else if (weatherCode === 48) {
            weatherDesc = "Depositing Rime Fog";
          } else if (weatherCode === 51) {
            weatherDesc = "Drizzle: Light intensity";
          } else if (weatherCode === 53) {
            weatherDesc = "Drizzle: Moderate intensity";
          } else if (weatherCode === 55) {
            weatherDesc = "Drizzle: Dense intensity";
          } else if (weatherCode === 56) {
            weatherDesc = "Freezing Drizzle: Light intensity";
          } else if (weatherCode === 57) {
            weatherDesc = "Freezing Drizzle: Dense intensity";
          } else if (weatherCode === 61) {
            weatherDesc = "Rain: Slight intensity";
          } else if (weatherCode === 63) {
            weatherDesc = "Rain: Moderate intensity";
          } else if (weatherCode === 65) {
            weatherDesc = "Rain: Heavy intensity";
          } else if (weatherCode === 66) {
            weatherDesc = "Freezing Rain: Light intensity";
          } else if (weatherCode === 67) {
            weatherDesc = "Freezing Rain: Heavy intensity";
          } else if (weatherCode === 71) {
            weatherDesc = "Snowfall: Slight intensity";
          } else if (weatherCode === 73) {
            weatherDesc = "Snowfall: Moderate intensity";
          } else if (weatherCode === 75) {
            weatherDesc = "Snowfall: Heavy intensity";
          } else if (weatherCode === 77) {
            weatherDesc = "Snow grains";
          } else if (weatherCode === 80) {
            weatherDesc = "Rain Showers: Slight intensity";
          } else if (weatherCode === 81) {
            weatherDesc = "Rain Showers: Moderate intensity";
          } else if (weatherCode === 82) {
            weatherDesc = "Rain Showers: Violent intensity";
          } else if (weatherCode === 85) {
            weatherDesc = "Snow Showers: Slight intensity";
          } else if (weatherCode === 86) {
            weatherDesc = "Snow Showers: Heavy intensity";
          } else if (weatherCode === 95) {
            weatherDesc = "Thunderstorm: Slight intensity";
          } else if (weatherCode === 96) {
            weatherDesc = "Thunderstorm: Moderate intensity";
          } else if (weatherCode === 99) {
            weatherDesc = "Thunderstorm with heavy hail";
          }
        }
        weatherDecode(weatherCode);
        // Print Weather Description
        console.log(`Current Weather: ${weatherDesc}`);

        // Function to format a date in the desired form
        function formatWeatherDate(dateString) {
          return new Date(dateString).toLocaleString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
        }

        // Only showing weather from the current hour.
        const currentHour = new Date().getHours();
        const startIndex = weatherData.hourly.time.findIndex(
          (time) => new Date(time).getHours() >= currentHour,
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
            `${highlight}${formattedDate}: ${temperature}°C${highlight}`,
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
