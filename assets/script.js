var city = '';

function getCurrentWeather(cityName) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=996d1e5bbde7df636e3040824eb2d0d9`)
    .then(response => {
      if (!response.ok) {
        throw new Error('City not found. Check spelling and try again.');
      }
      return response.json();
    })
    .then(data => {
      console.log(data);

      const formattedData = {
        City: data.name,
        WeatherIcon: data.weather[0].icon,
        Temp: data.main.temp,
        Wind: data.wind.speed,
        Humidity: data.main.humidity,
      };
      console.log(data.name);
      console.log(data.weather[0].icon);
      console.log(data.main.temp);
      console.log(data.wind.speed);
      console.log(data.main.humidity);

      const cityNameElement = document.getElementById('cityName');
      const currentDateElement = document.getElementById('currentDate');
      const weatherIconElement = document.getElementById('weatherIcon');
      const temperatureElement = document.getElementById('temperature');
      const windElement = document.getElementById('wind');
      const humidityElement = document.getElementById('humidity');

      cityNameElement.textContent = `${formattedData.City}:`;
      currentDateElement.textContent = getCurrentDate();
      weatherIconElement.src = `https://openweathermap.org/img/wn/${formattedData.WeatherIcon}.png`;
      temperatureElement.textContent = `Temperature: ${formattedData.Temp}°F`;
      windElement.textContent = `Wind: ${formattedData.Wind} mph`;
      humidityElement.textContent = `Humidity: ${formattedData.Humidity}%`;

      // Show the weather icon element
      weatherIconElement.style.display = 'inline';

      // Save the searched city in local storage
      saveSearchedCity(cityName);

      // Clear the error message
      clearErrorMessage();
    })
    .catch(error => {
      console.log(error);
      displayErrorMessage(error.message);
    });
}

function getCurrentForecast(cityName) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=996d1e5bbde7df636e3040824eb2d0d9`)
    .then(response => {
      if (!response.ok) {
        throw new Error('City not found. Check spelling and try again.');
      }
      return response.json();
    })
    .then(data => {
      console.log(data);

      const forecastData = data.list.slice(0, 5); // Get the forecast data for the next 5 days

      forecastData.forEach((item, index) => {
        const formattedData = {
          Day: getForecastDay(item.dt_txt),
          WeatherIcon: item.weather[0].icon,
          Temp: item.main.temp,
          Wind: item.wind.speed,
          Humidity: item.main.humidity,
        };

        const forecastDayElement = document.getElementById(`forecastDay${index + 1}`);
        const forecastWeatherIconElement = document.getElementById(`forecastWeatherIcon${index + 1}`);
        const forecastTemperatureElement = document.getElementById(`forecastTemperature${index + 1}`);
        const forecastWindElement = document.getElementById(`forecastWind${index + 1}`);
        const forecastHumidityElement = document.getElementById(`forecastHumidity${index + 1}`);

        forecastDayElement.textContent = formattedData.Day;
        forecastWeatherIconElement.src = `https://openweathermap.org/img/wn/${formattedData.WeatherIcon}.png`;
        forecastTemperatureElement.textContent = `Temperature: ${formattedData.Temp}°F`;
        forecastWindElement.textContent = `Wind: ${formattedData.Wind} mph`;
        forecastHumidityElement.textContent = `Humidity: ${formattedData.Humidity}%`;
      });
    })
    .catch(error => {
      console.log(error);
      displayErrorMessage(error.message);
    });
}

function displayErrorMessage(message) {
  const errorMessageElement = document.getElementById('errorMessage');
  errorMessageElement.textContent = message;
  errorMessageElement.style.display = 'block';
}

function clearErrorMessage() {
  const errorMessageElement = document.getElementById('errorMessage');
  errorMessageElement.textContent = '';
  errorMessageElement.style.display = 'none';
}

function saveSearchedCity(cityName) {
  let cities = localStorage.getItem('cities');
  cities = cities ? JSON.parse(cities) : [];

  // Add the current city to the list
  cities.push(cityName);

  // Store only the last 8 searched cities
  if (cities.length > 8) {
    cities = cities.slice(cities.length - 8);
  }

  // Save the updated list in local storage
  localStorage.setItem('cities', JSON.stringify(cities));

  // Update the UI to display the last 8 searched cities
  updateSearchedCitiesUI(cities);
}

function updateSearchedCitiesUI(cities) {
  const searchedCitiesElement = document.getElementById('searchedCities');
  searchedCitiesElement.innerHTML = '';

  cities.forEach(city => {
    const cityItem = document.createElement('li');
    cityItem.textContent = city;
    searchedCitiesElement.appendChild(cityItem);
  });
}

function getCurrentDate() {
  const date = new Date();
  return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function getForecastDay(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

document.addEventListener('DOMContentLoaded', function() {
  const searchButton = document.getElementById('searchButton');
  const cityInput = document.getElementById('cityInput');
  const searchedCities = localStorage.getItem('cities');

  if (searchedCities) {
    const parsedCities = JSON.parse(searchedCities);
    updateSearchedCitiesUI(parsedCities);
  }

  // Get user's location and set it as the default city
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        const { latitude, longitude } = position.coords;
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=996d1e5bbde7df636e3040824eb2d0d9`)
          .then(response => response.json())
          .then(data => {
            const defaultCity = data.name;
            cityInput.value = defaultCity;
            getCurrentWeather(defaultCity);
          })
          .catch(error => {
            console.log(error);
          });
      },
      function(error) {
        console.log(error);
      }
    );
  }

  searchButton.addEventListener('click', function() {
    city = cityInput.value;
    getCurrentWeather(city);
    getCurrentForecast(city);
    clearErrorMessage(); // Clear the error message
  });
});
