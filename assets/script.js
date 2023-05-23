fetch('https://api.openweathermap.org/data/2.5/weather?q=Tacoma&units=imperial&appid=996d1e5bbde7df636e3040824eb2d0d9')
  .then(response => response.json())
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

    function getCurrentDate() {
      const date = new Date();
      return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }
  })
  .catch(error => {
    console.log(error);
  });
