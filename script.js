const prompt = require("prompt-sync")();

// Defining latitude and longitude variables
let latitude = 0;
let longitude = 0;
let validity = true;
// Check if latitude is between -90 and 90 and is a number, and if not, make the user enter a valid latitude
while (validity === true) {
  latitude = parseFloat(prompt("Enter latitude: "));

  if (!isNaN(latitude) && latitude >= -90 && latitude <= 90) {
    validity = false;
    break;
  } else {
    console.log(
      "Invalid latitude. Latitude must be a number between -90 and 90.",
    );
  }
}
validity = true;
// Check if longitude is between -180 and 180 and is a number, and if not, tell the user to enter a valid longitude
while (validity === true) {
  longitude = parseFloat(prompt("Enter longitude: "));

  if (!isNaN(longitude) && longitude >= -180 && longitude <= 180) {
    validity = false;
    break;
  } else {
    console.log(
      "Invalid longitude. Longitude must be a number between -180 and 180.",
    );
  }
}

// API call with parameters
const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&forecast_days=1`;

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
