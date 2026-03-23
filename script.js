const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-btn");

const weatherInfo = document.querySelector(".weather-info");
const searchCity = document.querySelector(".search-city");
const notFound = document.querySelector(".not-found");

const countryTxt = document.querySelector(".country-txt");
const tempTxt = document.querySelector(".temp-txt");
const conditionTxt = document.querySelector(".condition-txt");
const humidityValueTxt = document.querySelector(".humidity-value-txt");
const windValueTxt = document.querySelector(".wind-value-txt");
const currentDateTxt = document.querySelector(".current-date-txt");
const weatherSummaryImg = document.querySelector(".weather-summary-img");

const forecastItemsContainer = document.querySelector(".forecast-items-container");

const apiKey = "YOUR_API_HERE";

searchBtn.addEventListener("click", () => {
    if (cityInput.value.trim() !== "") {
        updateWeatherInfo(cityInput.value);

        cityInput.value = "";
        cityInput.blur();
    }
});

cityInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && cityInput.value.trim() !== "") {
        updateWeatherInfo(cityInput.value);

        cityInput.value = "";
        cityInput.blur();
    }
});

async function getFetchData(endPoint, city) {
    const apiURL = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;

    const response = await fetch(apiURL);

    return response.json();
}

function getCurrentDate() {
    const currentDate = new Date();
    const options = {
        weekday: "short",
        day: "2-digit",
        month: "short",
    };

    return currentDate.toLocaleDateString("en-GB", options);
}

function getWeatherIcon(id) {
    if (id <= 232) return "thunderstorm.svg";
    if (id <= 321) return "drizzle.svg";
    if (id <= 531) return "rain.svg";
    if (id <= 622) return "snow.svg";
    if (id <= 781) return "atmosphere.svg";
    if (id <= 800) return "clear.svg";
    else return "clouds.svg";
}

async function updateWeatherInfo(city) {
    const weatherData = await getFetchData("weather", city);

    if (weatherData.cod !== 200) {
        showDisplaySection(notFound);
        return;
    }

    const {
        name: country,
        main: { humidity, temp },
        weather: [{ id, main }],
        wind: { speed }
    } = weatherData;

    countryTxt.textContent = country;
    tempTxt.textContent = `${Math.round(temp)} °C`;
    conditionTxt.textContent = main;
    humidityValueTxt.textContent = `${humidity}%`;
    windValueTxt.textContent = `${speed} m/s`;

    currentDateTxt.textContent = getCurrentDate();
    weatherSummaryImg.src = `assets/weather/${getWeatherIcon(id)}`;

    await updateForecastInfo(city);
    showDisplaySection(weatherInfo);
}

async function updateForecastInfo(city) {
    const forecastsData = await getFetchData("forecast", city);

    const timeTaken = "12:00:00";
    const todayDate = new Date().toISOString().split("T")[0];

    forecastItemsContainer.innerHTML = "";

    forecastsData.list.forEach(forecastWeather => {
        if (forecastWeather.dt_txt.includes(timeTaken) &&
            !forecastWeather.dt_txt.includes(todayDate)) {
                updateForecastItem(forecastWeather);
            }
    });
}

function updateForecastItem(weatherData) {
    const {
        dt_txt: date,
        main: { temp },
        weather: [{ id }]
    } = weatherData;

    const dateTaken = new Date(date);
    const dateOptions = {
        day: "2-digit",
        month: "short"
    };

    const dateResult = dateTaken.toLocaleDateString("en-US", dateOptions);

    forecastItem = `
        <div class="forecast-item">
            <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
            <img src="assets/weather/${getWeatherIcon(id)}" class="forecast-item-img">
            <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
        </div>
    `;

    forecastItemsContainer.insertAdjacentHTML("beforeend", forecastItem);
}

function showDisplaySection(section) {
    [weatherInfo, searchCity, notFound]
        .forEach(section => section.style.display = "none");

    section.style.display = "flex";
}