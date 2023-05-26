var city = '';

function getCurrentWeather(cityName) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=996d1e5bbde7df636e3040824eb2d0d9`)
    .then(response => {
      if (!response.ok) {
        handleCityNotFound();
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      updateWeatherUI(data);
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
        handleCityNotFound();
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      updateForecastUI(data);
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
  // Retrieve the existing list of searched cities from local storage
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
    const cityButton = document.createElement('button'); // Create a button element
    cityButton.textContent = city;
    cityButton.classList.add('searched-city'); // Add the 'searched-city' class to apply the button styling

    cityButton.addEventListener('click', function() {
      getCurrentWeather(city);
      getCurrentForecast(city);
      clearErrorMessage();
    });

    cityItem.appendChild(cityButton);
    searchedCitiesElement.appendChild(cityItem);
  });
}



function updateWeatherUI(data) {
  const formattedData = {
    City: data.name,
    WeatherIcon: data.weather[0].icon,
    Temp: data.main.temp,
    Wind: data.wind.speed,
    Humidity: data.main.humidity,
  };

  console.log(formattedData.City);
  console.log(formattedData.WeatherIcon);
  console.log(formattedData.Temp);
  console.log(formattedData.Wind);
  console.log(formattedData.Humidity);

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
  saveSearchedCity(formattedData.City);

  // Clear the error message
  clearErrorMessage();
}

function updateForecastUI(data) {
  const forecastData = data.list;

  // Create an object to store the forecast data grouped by day
  const dailyForecasts = {};

  forecastData.forEach(item => {
    const date = item.dt_txt.split(' ')[0];

    if (dailyForecasts[date]) {
      dailyForecasts[date].push(item);
    } else {
      dailyForecasts[date] = [item];
    }
  });

  let index = 1;
  for (const date in dailyForecasts) {
    if (index > 5) break; // Display only the forecast for the next 5 days

    const dayForecast = dailyForecasts[date][0];
    const formattedData = {
      Day: getForecastDay(dayForecast.dt_txt),
      WeatherIcon: dayForecast.weather[0].icon,
      Temp: dayForecast.main.temp,
      Wind: dayForecast.wind.speed,
      Humidity: dayForecast.main.humidity,
    };

    console.log(formattedData.Day);
    console.log(formattedData.WeatherIcon);
    console.log(formattedData.Temp);
    console.log(formattedData.Wind);
    console.log(formattedData.Humidity);

    const forecastDayElement = document.getElementById(`forecastDay${index}`);
    const forecastWeatherIconElement = document.getElementById(`forecastWeatherIcon${index}`);
    const forecastTemperatureElement = document.getElementById(`forecastTemperature${index}`);
    const forecastWindElement = document.getElementById(`forecastWind${index}`);
    const forecastHumidityElement = document.getElementById(`forecastHumidity${index}`);

    forecastDayElement.textContent = formattedData.Day;
    forecastWeatherIconElement.src = `https://openweathermap.org/img/wn/${formattedData.WeatherIcon}.png`;
    forecastTemperatureElement.textContent = `Temperature: ${formattedData.Temp}°F`;
    forecastWindElement.textContent = `Wind: ${formattedData.Wind} mph`;
    forecastHumidityElement.textContent = `Humidity: ${formattedData.Humidity}%`;

    index++;
  }
}

function getCurrentDate() {
  const date = new Date();
  return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function getForecastDay(dateString) {
  const date = new Date(dateString.split(' ')[0]);
  const day = date.toLocaleDateString('en-US', { weekday: 'long' });
  return day;
}

document.addEventListener('DOMContentLoaded', function() {
  const searchButton = document.getElementById('searchButton');
  const cityInput = document.getElementById('cityInput');
  const searchedCities = localStorage.getItem('cities');

  if (searchedCities) {
    const parsedCities = JSON.parse(searchedCities);
    updateSearchedCitiesUI(parsedCities);
  }

  // Check if the user's location is available
  if (!navigator.geolocation) {
    // Geolocation is not supported
    console.log('Geolocation is not supported');
    // Set a default city name here
    city = 'Your Default City';
    getCurrentWeather(city);
    getCurrentForecast(city);
  } else {
    // Geolocation is supported
    navigator.geolocation.getCurrentPosition(
      function(position) {
        const { latitude, longitude } = position.coords;
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=996d1e5bbde7df636e3040824eb2d0d9`)
          .then(response => response.json())
          .then(data => {
            const defaultCity = data.name;
            cityInput.value = defaultCity;
            getCurrentWeather(defaultCity);
            getCurrentForecast(defaultCity);
          })
          .catch(error => {
            console.log(error);
            // Set a default city name here
            city = 'Ogden';
            getCurrentWeather(city);
            getCurrentForecast(city);
          });
      },
      function(error) {
        console.log(error);
        // Set a default city name here
        city = 'Detroit';
        getCurrentWeather(city);
        getCurrentForecast(city);
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

function handleCityNotFound() {
  throw new Error('City not found. Check spelling and try again.');
}

