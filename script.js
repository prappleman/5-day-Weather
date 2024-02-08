var APIKey = "dac7b176fd867911820c8b4e43625060";

// Function to get current weather data
function getCurrentWeather(city) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

    fetch(queryURL)
    .then(response => response.json())
    .then(data => {
        if (data.cod && data.cod !== "404") {
            console.log("Current Weather Data:", data);
            displayCurrentWeather(data);

            updateSearchHistory(city);
        } else {
            console.error("Invalid city name or city not found");
            alert("Invalid city name or city not found");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Error fetching weather data. Please try again later.");
    });
}


// Function to display current weather data on the webpage
function displayCurrentWeather(data) {

    var cityNameElement = document.getElementById("city-name");
    var dateElement = document.getElementById("date");
    var iconElement = document.getElementById("weather-icon");
    var temperatureElement = document.getElementById("temperature");
    var humidityElement = document.getElementById("humidity");
    var windSpeedElement = document.getElementById("wind-speed");

    var cityName = data.name;
    var date = new Date(data.dt * 1000);
    var iconCode = data.weather[0].icon;
    var temperature = convertKelvinToFahrenheit(data.main.temp);
    var humidity = data.main.humidity;
    var windSpeed = convertMetersPerSecondToMilesPerHour(data.wind.speed);


    cityNameElement.textContent = cityName;
    dateElement.textContent = date.toLocaleDateString();
    iconElement.setAttribute("src", "http://openweathermap.org/img/w/" + iconCode + ".png");
    temperatureElement.textContent = Math.round(temperature) + "°F";
    humidityElement.textContent = "Humidity: " + humidity + "%";
    windSpeedElement.textContent = "Wind Speed: " + Math.round(windSpeed) + " mph";

    // Call the function to get the 5-day forecast data
    getFiveDayForecast(data.coord.lat, data.coord.lon);

    // Clear the search box
    document.getElementById("city-input").value = "";
}

// Function to convert Kelvin to Fahrenheit
function convertKelvinToFahrenheit(kelvin) {
    return ((kelvin - 273.15) * 9/5 + 32);
}

// Function to convert meters per second to miles per hour
function convertMetersPerSecondToMilesPerHour(metersPerSecond) {
    return metersPerSecond * 2.237;
}


function getFiveDayForecast(latitude, longitude) {
    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&appid=" + APIKey;
  
    fetch(forecastURL)
    .then(response => response.json())
    .then(data => {
        if (data.cod && data.cod !== "404") {
          console.log("5-Day Forecast Data:", data);
          displayFiveDayForecast(data.list);
        } else {
          console.error("Invalid forecast data");
          alert("Error fetching 5-day forecast data. Please try again later.");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Error fetching 5-day forecast data. Please try again later.");
    });
}


function displayFiveDayForecast(forecastData) {
    var forecastList = document.getElementById("forecast-list");
  
    // Clear existing forecast data
    forecastList.innerHTML = "";
  
    // Loop through the forecast data and create forecast items
    for (var i = 0; i < forecastData.length; i += 8) {
        var forecastItem = document.createElement("div");
        forecastItem.className = "forecast-item";
  
        var date = new Date(forecastData[i].dt * 1000);
        var iconCode = forecastData[i].weather[0].icon;
        var temperature = convertKelvinToFahrenheit(forecastData[i].main.temp);
  
        var dateElement = document.createElement("p");
        dateElement.textContent = date.toLocaleDateString();
  
        var iconElement = document.createElement("img");
        iconElement.setAttribute("src", "http://openweathermap.org/img/w/" + iconCode + ".png");
  
        var temperatureElement = document.createElement("p");
        temperatureElement.textContent = Math.round(temperature) + "°F";
  
        forecastItem.appendChild(dateElement);
        forecastItem.appendChild(iconElement);
        forecastItem.appendChild(temperatureElement);
  
        forecastList.appendChild(forecastItem);
    }
  }
  

// Function to update the search history
function updateSearchHistory(city) {

    var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    var lowerCaseCity = city.toLowerCase();
    var isDuplicate = searchHistory.some(existingCity => existingCity.toLowerCase() === lowerCaseCity);

    if (!isDuplicate) {
        // Add the current city to the search history
        searchHistory.unshift(city);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
        displaySearchHistory(searchHistory);
    }
}


// Function to display search history on the webpage
function displaySearchHistory(searchHistory) {
    var historyList = document.getElementById("search-history-list");

    historyList.innerHTML = "";

    for (var i = 0; i < searchHistory.length; i++) {
        var button = document.createElement("button");
        button.textContent = searchHistory[i];

        button.addEventListener("click", function () {
            var selectedCity = this.textContent;

            getCurrentWeather(selectedCity);
        });

        historyList.appendChild(button);
    }
}

// Event listener for both the search button and "Enter" key on the input field
document.getElementById("search-btn").addEventListener("click", handleSearch);
document.getElementById("city-input").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    handleSearch();
  }
});

function handleSearch() {
  var cityInput = document.getElementById("city-input").value.trim();

  if (cityInput !== "") {
    // Call the function to get current weather data
    getCurrentWeather(cityInput);
  } else {
    alert("Please enter a city name.");
  }
}

// Function to set the default city on page load
function setDefaultCity() {
    var defaultCity = "draper"; // Set your desired default city name here
  
    if (defaultCity !== "") {
      // Call the function to get weather data for the default city
      getCurrentWeather(defaultCity);
    }
  }

// Initialize search history and default city on page load
displaySearchHistory(JSON.parse(localStorage.getItem("searchHistory")) || []);
setDefaultCity(); // Call the function to set the default city