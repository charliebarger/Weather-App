async function getWeatherData(city, units) {
    const response = await fetch(
        `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=51f808ad6044666815ba2f99bc610f0b&units=${units}`
    )
    return response.json()
}

let temperature
let feelsLike
let units

async function processWeatherData(place) {
    try {
        units = findPrefferedUnits()
        const json = await getWeatherData(place, units)
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

function showErrorMessage() {
    document.getElementById('warning').classList.add('show')
}

function hideErrorMessage() {
    document.getElementById('warning').classList.remove('show')
}

function animateNewWeather() {
    const main = document.querySelector('main')
    main.classList.add('shrinkMe')
    setTimeout(() => main.classList.remove('shrinkMe'), 1500)
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

const cityFinder = document.getElementById('cityFinder')
const weatherForm = document.getElementById('weatherForm')

cityFinder.addEventListener('input', () => {
    hideErrorMessage()
})
weatherForm.addEventListener('submit', (e) => {
    e.preventDefault()
    processWeatherData(cityFinder.value).then((response) => {
        renderData(response)
    })
    cityFinder.value = ''
})

const tempSwitch = document.getElementById('degree-switch')

tempSwitch.addEventListener('click', () => {
    changeUnits()
})

function changeUnits() {
    console.log('hi')
    let newTemp
    let newFeelslike
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

function formatTemperatures() {
    let symbol
    console.log(units)
    if (units === 'imperial') {
        symbol = 'F'
    } else {
        symbol = 'C'
    }
    return symbol
}

processWeatherData('Denver', findPrefferedUnits()).then((response) => {
    renderData(response)
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
