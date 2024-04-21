let API_key = 'd8d11fa571b90aec6cf8317f5e41d044';

async function getWeather(url) {
    let response = await fetch(url);
    if (!response.ok) {
        throw new Error('City not found');
    }
    let data = await response.json();
    return data;
}

async function getUserLocation() {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    var latitude = data.latitude;
    var longitude = data.longitude;
    return [latitude, longitude];
}

document.addEventListener("DOMContentLoaded", () => {
    getUserLocation().then((coord) => {
        let lat = coord[0];
        let lon = coord[1];
        let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}`

        showLoadingSpinner(); 
        getWeather(url).then((data) => {
            console.log(data);
            updateCard(data);
            hideLoadingSpinner(); 
            clearError(); 
        }).catch((error) => {
            console.log(error);
            showError("City not found"); 
            hideLoadingSpinner(); 
        });
    }).catch(error => console.error(error));
});

function updateCard(data) {
    let {
        name: city,
        main: { temp, humidity, pressure, temp_max, temp_min },
        weather: [{ description, icon }],
        wind: { speed },
        sys: { sunrise, sunset }
    } = data;
    document.getElementById("name").innerHTML = city;

    document.getElementById("weatherIcon").innerHTML = getWeatherEmoji(icon);
    document.getElementById("mainTemp").innerHTML = formatTemp(temp);
    document.getElementById("low").innerHTML = formatTemp(temp_min);
    document.getElementById("high").innerHTML = formatTemp(temp_max);

    document.getElementById("pressure").innerHTML = (pressure / 1000).toFixed(2) + " atm";
    document.getElementById("humidity").innerHTML = humidity + "%";
    document.getElementById("wind").innerHTML = speed.toFixed(1) + " m/s";

    document.getElementById("weatherDesc").innerHTML = description;

    document.getElementById("sunrise").innerHTML = new Date(sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.getElementById("sunset").innerHTML = new Date(sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    document.getElementById("error").innerHTML = "";

    document.getElementById("weatherCard").classList.remove('hidden');
    document.getElementById("weatherCard").classList.add('show');
}

function formatTemp(temp) {
    return (temp - 273.15).toFixed(1) + "°C";
}

function getWeatherEmoji(weatherCode) {
    const weatherEmojis = {
        '01d': '☀️',
        '01n': '🌙',
        '02d': '⛅',
        '02n': '⛅',
        '03d': '☁️',
        '03n': '☁️',
        '04d': '☁️',
        '04n': '☁️',
        '09d': '🌧️',
        '09n': '🌧️',
        '10d': '🌦️',
        '10n': '🌦️',
        '11d': '🌩️',
        '11n': '🌩️',
        '13d': '❄️',
        '13n': '❄️',
        '50d': '🌫️',
        '50n': '🌫️'
    };

    return weatherEmojis[weatherCode] || '❓';
}

document.getElementById("searchBtn").addEventListener("click", () => {
    const city = document.getElementById("cityName").value;
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}`;

    showLoadingSpinner(); 
    getWeather(url).then((data) => {
        updateCard(data);
        hideLoadingSpinner(); 
        clearError(); 
    }).catch((error) => {
        document.getElementById("weatherCard").classList.remove('show');
        document.getElementById("weatherCard").classList.add('hidden');
        showError("City not found"); 
        hideLoadingSpinner(); 
    });

});

function showLoadingSpinner() {
    document.getElementById("loadingSpinner").style.display = "block";
}

function hideLoadingSpinner() {
    document.getElementById("loadingSpinner").style.display = "none";
}

function showError(message) {
    document.getElementById("error").innerHTML = message;
}

function clearError() {
    document.getElementById("error").innerHTML = "";
}
