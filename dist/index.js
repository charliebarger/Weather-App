async function getWeatherData(city, units) {
    const response = await fetch(
        `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=51f808ad6044666815ba2f99bc610f0b&units=${units}`
    )
    return response.json()
}

async function processWeatherData(place) {
    try {
        const units = findPrefferedUnits()
        const json = await getWeatherData(place, units)
        const weatherMain = json.main
        const displayName = `${json.name}, ${json.sys.country}`
        const weatherDescription = json.weather[0].description
        const temperature = weatherMain.temp
        const feelsLike = weatherMain.feels_like
        changeUnits(temperature, feelsLike)
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
        throw new Error('City Not Found')
    }
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
    const symbol = formatTemperatures(dataObject.units)
    document.getElementById(
        'temp'
    ).innerHTML = `<h2 class="temp" id="temp">${Math.round(
        dataObject.temperature
    )}<span class="degree big-degree">&deg;${symbol}</span></h2>`
    document.getElementById('feels-like').innerHTML = `
        <span class="feels-like" id="feels-like">
            Feels like: ${Math.round(
                dataObject.feelsLike
            )}<span class="degree small-degree">&deg;${symbol}</span></span>`
    document.getElementById('wind').textContent = `Wind : ${Math.round(
        dataObject.wind
    )} mph`
    document.getElementById(
        'humidity'
    ).textContent = `Humidity: ${dataObject.weatherHumidity}%`
}

const cityFinder = document.getElementById('cityFinder')
const weatherForm = document.getElementById('weatherForm')

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault()
    processWeatherData(cityFinder.value).then((response) => {
        renderData(response)
    })
    cityFinder.value = ''
})

const tempSwitch = document.getElementById('degree-switch')

function changeUnits(temp, feelsLike) {
    tempSwitch.addEventListener('click', () => {
        if (!tempSwitch.checked) {
            const temperature = ((Number(temp) - 32) * 5) / 9
            console.log(temperature)
            console.log(feelsLike)
        }
    })
}
tempSwitch.addEventListener('click', () => {
    const unit = findPrefferedUnits()
})

function formatTemperatures(unit) {
    let symbol
    console.log(unit)
    if (unit === 'imperial') {
        symbol = 'F'
    } else {
        symbol = 'C'
    }
    return symbol
}

processWeatherData('Miami', findPrefferedUnits()).then((response) => {
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

function switchUnits() {
    const system = findPrefferedUnits()
    const symbol = formatTemperatures(system)
}
