const weather = document.getElementById('current');
const resultList = document.getElementById('result');

fetch('https://api.openweathermap.org/data/2.5/forecast?q=Detroit&units=imperial&appid=996d1e5bbde7df636e3040824eb2d0d9')
.then(response =>response.json())
.then(data => {
    console.log(data);

    const formattedData = {
        City: data.city.name,
        weather: weather.icon,
        Temp: data.temperature.value,
        wind: data.wind.speed,
        Humidity: data.humidity,
        
    }
        console.log(data.city.name);
        console.log(data.clouds.all);
        console.log(data.temperature.all);
        console.log(data.wind.speed);
        console.log(data.humidity);
        console.log(data.timestamp);

    data.list.forEach(item => {
        const listItem=document.createElement('li');
        listItem.textContent = item.name;
        resultList.appendChild(listItem);
    })
})
.catch(error => {
    console.log(error);
})