// API Key - Replace with your actual API key
var APIKey = "dac7b176fd867911820c8b4e43625060";

// Function to get current weather data
function getCurrentWeather(city) {
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

  fetch(queryURL)
    .then(response => response.json())
    .then(data => {
      // Handle current weather data
      console.log("Current Weather Data:", data);
      displayCurrentWeather(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// Function to display current weather data on the webpage
function displayCurrentWeather(data) {
  // Get elements from the DOM
  var cityNameElement = document.getElementById("city-name");
  var dateElement = document.getElementById("date");
  var iconElement = document.getElementById("weather-icon");
  var temperatureElement = document.getElementById("temperature");
  var humidityElement = document.getElementById("humidity");
  var windSpeedElement = document.getElementById("wind-speed");

  // Extract relevant data from the API response
  var cityName = data.name;
  var date = new Date(data.dt * 1000); // Convert timestamp to date
  var iconCode = data.weather[0].icon;
  var temperature = data.main.temp;
  var humidity = data.main.humidity;
  var windSpeed = data.wind.speed;

  // Update the DOM with the current weather data
  cityNameElement.textContent = cityName;
  dateElement.textContent = date.toLocaleDateString();
  iconElement.setAttribute("src", "http://openweathermap.org/img/w/" + iconCode + ".png");
  temperatureElement.textContent = temperature + "°C";
  humidityElement.textContent = "Humidity: " + humidity + "%";
  windSpeedElement.textContent = "Wind Speed: " + windSpeed + " m/s";

  // Clear the search box
  document.getElementById("city-input").value = "";
}

// Event listener for the search button
document.getElementById("search-btn").addEventListener("click", function () {
  var cityInput = document.getElementById("city-input").value.trim();

  if (cityInput !== "") {
    // Call the function to get current weather data
    getCurrentWeather(cityInput);

    // TODO: Add the city to the search history (you can use localStorage for this)
  } else {
    alert("Please enter a city name.");
  }
});

// TODO: Add functionality for displaying 5-day forecast and handling search history clicks
