let temperature
let feelsLike
let units
const tempSwitch = document.getElementById('degree-switch')
const cityFinder = document.getElementById('cityFinder')
const weatherForm = document.getElementById('weatherForm')

async function getWeatherData(city, weatherUnits) {
    console.log(weatherUnits)
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=51f808ad6044666815ba2f99bc610f0b&units=${weatherUnits}`,
        {
            mode: 'cors',
        }
    )
    return response.json()
}

// show and hide error messages if wrong city is inputted
function showErrorMessage() {
    document.getElementById('warning').classList.add('show')
}

function hideErrorMessage() {
    document.getElementById('warning').classList.remove('show')
}

cityFinder.addEventListener('input', () => {
    hideErrorMessage()
})

function findPrefferedUnits() {
    let system
    if (tempSwitch.checked) {
        system = 'metric'
    } else {
        system = 'imperial'
    }
    return system
}

async function processWeatherData(place) {
    try {
        const json = await getWeatherData(place, findPrefferedUnits())
        const weatherMain = json.main
        const displayName = `${json.name}, ${json.sys.country}`
        const weatherDescription = json.weather[0].description
        temperature = weatherMain.temp
        feelsLike = weatherMain.feels_like
        const weatherHumidity = weatherMain.humidity
        const wind = json.wind.speed
        return {
            units,
            displayName,
            weatherDescription,
            temperature,
            feelsLike,
            weatherHumidity,
            wind,
        }
    } catch (error) {
        showErrorMessage()
        throw new Error('City Not Found')
    }
}

function animateNewWeather() {
    const main = document.querySelector('main')
    main.classList.add('shrinkMe')
    setTimeout(() => main.classList.remove('shrinkMe'), 1500)
}

function formatTemperatures() {
    console.log(units)
    let symbol
    if (units === 'metric') {
        symbol = 'C'
    } else {
        symbol = 'F'
    }
    return symbol
}

function renderTemperatures(temp, tempFeel) {
    const symbol = formatTemperatures()
    document.getElementById(
        'temp'
    ).innerHTML = `<h2 class="temp" id="temp">${Math.round(
        temp
    )}<span class="degree big-degree">&deg;${symbol}</span></h2>`
    document.getElementById('feels-like').innerHTML = `
        <span class="feels-like" id="feels-like">
            Feels like: ${Math.round(
                tempFeel
            )}<span class="degree small-degree">&deg;${symbol}</span></span>`
}

function renderData(dataObject) {
    animateNewWeather()
    document.getElementById('title').textContent = dataObject.displayName
    document.getElementById('info').textContent = dataObject.weatherDescription
    renderTemperatures(dataObject.temperature, dataObject.feelsLike)
    document.getElementById('wind').textContent = `Wind : ${Math.round(
        dataObject.wind
    )} mph`
    document.getElementById(
        'humidity'
    ).textContent = `Humidity: ${dataObject.weatherHumidity}%`
}

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault()
    processWeatherData(cityFinder.value).then((response) => {
        renderData(response)
    })
    cityFinder.value = ''
})

// functions for changing from metric to imperial and vice versa
function changeUnits() {
    if (tempSwitch.checked) {
        units = 'metric'
        temperature = ((Number(temperature) - 32) * 5) / 9
        feelsLike = ((Number(feelsLike) - 32) * 5) / 9
    } else if (!tempSwitch.checked) {
        units = 'imperial'
        temperature = (Number(temperature) * 9) / 5 + 32
        feelsLike = (Number(feelsLike) * 9) / 5 + 32
    }
    renderTemperatures(temperature, feelsLike)
}

tempSwitch.addEventListener('click', () => {
    changeUnits()
})

// inital city on page load, GO BRONCOS!!!
processWeatherData('Denver', findPrefferedUnits()).then((response) => {
    renderData(response)
})
