// Longitude and latitude parameters
var latitude = 48.13743;
var longitude = 11.57549;

// API call with parameters
var apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&forecast_days=1`;

// Fetch API
fetch(apiUrl)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not okay");
    }
    return response.json();
  })
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.error("There has been a problem with your fetch operation:", error);
  });
