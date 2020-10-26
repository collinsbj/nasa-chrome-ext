const key = NASA_API_KEY

async function getWeatherData() {
    let data = await fetch(`https://api.nasa.gov/insight_weather/?api_key=${key}&feedtype=json&ver=1.0`)
    data = await data.json()
    
    return data
}

async function getManifest() {
    let data = await fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/curiosity?api_key=${key}`)
    data = await data.json()
    
    return data
}

async function getMostRecentImages(sol, camera) {
    let data = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${sol}&camera=${camera}&api_key=${key}`)
    data = await data.json()
    
    return data
}

async function setImage() {
    const manifest = await getManifest()
    console.log('manifest', manifest)

    const mostRecentData = manifest.photo_manifest.photos[manifest.photo_manifest.photos.length - 1]
    console.log('mostRecentData', mostRecentData)

    const randomCameraType = mostRecentData.cameras[Math.floor(Math.random() * Math.floor(mostRecentData.cameras.length))]
    console.log('randomCameraType', randomCameraType)

    const mostRecentImages = await getMostRecentImages(mostRecentData.sol, randomCameraType)
    console.log('mostRecentImages', mostRecentImages)
    
    const mostRecentImage = mostRecentImages.photos[0]
    
    const imageContainer = window.document.getElementById("image-container")
    imageContainer.style.backgroundImage = `url('${mostRecentImage.img_src}')`

    const imageRoverContainer = window.document.getElementById("image-rover")
    imageRoverContainer.innerHTML = `Rover: ${mostRecentImage.rover.name}`

    const imageDateContainer = window.document.getElementById("image-date")
    imageDateContainer.innerHTML = `Earth Date: ${mostRecentImage.earth_date}`

    const imageSolContainer = window.document.getElementById("image-sol")
    imageSolContainer.innerHTML = `Sol: ${mostRecentImage.sol}`

    const imageCameraContainer = window.document.getElementById("image-camera")
    imageCameraContainer.innerHTML = `Camera: ${mostRecentImage.camera.full_name}`
}

async function setWeather() {
    const weatherData = await getWeatherData()
    console.log('weatherData', weatherData)
    const mostRecentWeatherData = weatherData[weatherData.sol_keys[weatherData.sol_keys.length - 1]]
    console.log('mostRecentWeatherData', mostRecentWeatherData)

    const weatherDateContainer = window.document.getElementById("weather-date")
    weatherDateContainer.innerHTML = `Date: ${mostRecentWeatherData.Last_UTC.split("T")[0]}`

    const weatherTempContainer = window.document.getElementById("weather-temp")
    weatherTempContainer.innerHTML = `Average Temp: ${mostRecentWeatherData.AT.av} &deg;F`

    const weatherWindContainer = window.document.getElementById("weather-wind")
    weatherWindContainer.innerHTML = `Average Wind Speed: ${mostRecentWeatherData.HWS.av} m/s`
    
    const weatherPressureContainer = window.document.getElementById("weather-pressure")
    weatherPressureContainer.innerHTML = `Average Pressure: ${mostRecentWeatherData.PRE.av} Pa`

    const weatherSeasonContainer = window.document.getElementById("weather-season")
    weatherSeasonContainer.innerHTML = `Season: ${mostRecentWeatherData.Season}`
}

setImage()
setWeather()
