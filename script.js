const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemEl = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForestcastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const API_KEY = '147816a937969b88c82010c2f13cd629';

setInterval(()=> {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HFormat = hour >= 13 ? hour % 12: hour;
    const minutes = time.getMinutes();
    const ampm = hour >= 12 ? "PM" : "AM";

    timeEl.innerHTML = (hoursIn12HFormat < 10 ? "0" + hoursIn12HFormat : hoursIn12HFormat) + ":" + (minutes < 10 ? "0" + minutes : minutes) + " " +`<span id="am-pm">${ampm}</span>`
    
    dateEl.innerHTML =  days[day] + ", " + date + ` ` + months[month]
},1000);

getWeatherData();
function getWeatherData(){
    navigator.geolocation.getCurrentPosition((success) =>{
        let {latitude, longitude} = success.coords;

        fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly&appid=${API_KEY}`).then(res => res.json()).then(data=>{
            console.log(data)
            showWeatherData(data);
        })
    })
}

function showWeatherData(data){
    let{ humidity, pressure, sunrise, sunset, wind_speed} = data.current;

    timezone.innerHTML = data.timezone;
    countryEl.innerHTML = data.lat + "N" + data.lon + "E";

    currentWeatherItemEl.innerHTML = 
    `<div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}%</div>
        </div>
    <div class="weather-item">
        <div>Pressure</div>
        <div>${pressure}</div>
    </div>
    <div class="weather-item">
        <div>Wind Speed</div>
        <div>${wind_speed}</div>
    </div>

    <div class="weather-item">
        <div>Sunrise</div>
        <div>${window.moment(sunrise * 1000).format("HH:mm a")}</div>
    </div>
    <div class="weather-item">
        <div>Sunset</div>
        <div>${window.moment(sunset * 1000).format("HH:mm a")}</div>
    </div>
    `;

    let otherDayForCast = '';
    data.daily.forEach((day, idx) => {
        if(idx == 0){
            currentTempEl.innerHTML = `<img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png"
            alt="weather icon" class="w-icon">
                <div class="other">
                    <div class="day">${window.moment(day.dt * 1000).format("ddd")}</div>
                            <div class="temp">Night - ${day.temp.night}&#176; C</div>
                            <div class="temp">Day - ${day.temp.night}&#176; C</div>
                            
                </div>
                `;
        }else {
            otherDayForCast += `<div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt * 1000).format("ddd")}</div>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"
                alt="weather icon" class="w-icon">
                <div class="temp"> Night - ${day.temp.night}&#176; C</div>
                <div class="temp"> Dayx - ${day.temp.night}&#176; C</div>
                </div>`
                ;
        }
    });
    weatherForestcastEl.innerHTML = otherDayForCast;
}