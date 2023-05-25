function getCurrentWeather(cityName) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid={API key}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('City not found. Check spelling and try again.');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
  
        const formattedData = {
          City: data.city.name,
          WeatherIcon: data.list[0].weather[0].icon,
          Temp: data.list[0].main.temp,
          Wind: data.list[0].wind.speed,
          Humidity: data.list[0].main.humidity,
        };
        console.log(data.city.name);
        console.log(data.list[0].weather[0].icon);
        console.log(data.list[0].main.temp);
        console.log(data.list[0].wind.speed);
        console.log(data.list[0].main.humidity);
  
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
  