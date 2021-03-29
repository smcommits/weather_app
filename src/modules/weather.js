const weatherModule = (() => {

  const locationInput = document.getElementById('location-input')
  const submitButton = document.getElementById('submit-weather-form')


  async function fetchWeather(location, unit="metric") {
    const unitValue = unit == "celcius" ? "metric" : "imperial" 
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=${unitValue}&appid=4bd4b9ab3b3c5a1d664f8bc0eecfaf36`, {mode: 'cors'});
      const weatherData = await response.json();
      return weatherData
    } catch(error) {
        return "Coudn't find data for the specified location"
    }
  }

  const parseWeatherJSON = (json) => {
    const temp = json.main.temp
    const name = json.name
    const weather = json.weather[0].main
    const humidity = json.main.humidity

    return {name, temp, weather, humidity}
  }

  async function getWeatherImage(weather) {
    const response = await fetch(`https://api.pexels.com/v1/search?query=${weather}+weather&size=medium`, {
      headers: {
        "Authorization": "563492ad6f91700001000001abc669dc2c4e46d28693596b6f0a47bf"
      }
    }
    )

  const image = await response.json();
    return image.photos[0].src.original
  }

  submitButton.addEventListener('click', () => {
    const cityName = locationInput.value
    fetchWeather(cityName).then((json) => {
      const weatherData = (parseWeatherJSON(json));
      getWeatherImage(weatherData.weather).then((imageUrl) => {
       document.getElementById("weather-background").classList.remove("default-weather");
       document.getElementBy("weather-background").classList.add("background-weather");
        document.getElementById("weather-background").style.backgroundImage = `url(${imageUrl})`;
      })
    })
  })
  

})();

export {  weatherModule as default }
