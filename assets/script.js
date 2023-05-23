fetch('https://api.openweathermap.org/data/2.5/forecast?q=Tacoma&units=imperial&appid=996d1e5bbde7df636e3040824eb2d0d9')
  .then(response => response.json())
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

    const weatherDataDiv = document.getElementById('weatherData');

    const paragraph = document.createElement('p');
    const icon = document.createElement('img'); // Create an <img> element

    icon.src = `https://openweathermap.org/img/wn/${formattedData.WeatherIcon}@2x.png`; // Set the src attribute to the weather icon URL
    icon.alt = 'Weather Icon'; // Set an alt attribute for accessibility

    paragraph.textContent = `City: ${formattedData.City}, Temperature: ${formattedData.Temp}, Wind: ${formattedData.Wind}, Humidity: ${formattedData.Humidity}`;

    // Append the icon and paragraph to the weatherDataDiv
    weatherDataDiv.appendChild(icon);
    weatherDataDiv.appendChild(paragraph);
  })
  .catch(error => {
    console.log(error);
  });
