const weatherModule = () => {
  const locationInput = document.getElementById('location-input');
  const submitButton = document.getElementById('submit-weather-form');
  const nameElemenet = document.getElementById('name');
  const tempElement = document.getElementById('temp');
  const weatherElement = document.getElementById('weather');
  const humidityElement = document.getElementById('humidity');
  const dataContainer = document.getElementById('data-container');
  const loader = document.getElementById('loader-container');
  const tempToggle = document.getElementById('temp-toggle');
  const errorModal = document.getElementById('error-modal');
  const errorMessage = document.getElementById('error-message');


  const throwError = (message) => {
    errorModal.classList.add('error-modal-show');
    errorMessage.textContent = message;
  }

  const revokeError = () => {
    errorModal.classList.remove('error-modal-show');
    errorMessage.textContent = "";
  }

  const fetchWeather = async (location, unit = false) => {
    const unitValue = unit === true ? 'metric' : 'imperial';
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=${unitValue}&appid=4bd4b9ab3b3c5a1d664f8bc0eecfaf36`, { mode: 'cors' });
    loader.classList.toggle("flex")
    const weatherData = await response.json();
    return weatherData;
  };


  const parseWeatherJSON = (json) => {
    const { temp } = json.main;
    const { name } = json;
    const weather = json.weather[0].main;
    const { humidity } = json.main;

    return {
      name, temp, weather, humidity,
    };
  };

  const getWeatherImage = async(weather) => {
    const response = await fetch(`https://api.pexels.com/v1/search?query=${weather}+weather&size=medium`, {
      headers: {
        Authorization: '563492ad6f91700001000001abc669dc2c4e46d28693596b6f0a47bf',
      },
    }, {
      mode: 'cors',
    });

    const image = await response.json();
    return image.photos[0].src.original;
  }

  const changeBackground = (url) => {
    document.getElementById('weather-background').classList.remove('default-weather');
    document.getElementById('weather-background').classList.add('background-weather');
    document.getElementById('weather-background').style.backgroundImage = `url(${url})`;
  };

  const updateInformation = (name, temp, weather, humidity) => {
    nameElemenet.textContent = name;
    tempElement.textContent = temp;
    weatherElement.textContent = weather;
    humidityElement.textContent = humidity;
    dataContainer.style.display = 'block';
  };

  const resolveWeatherImage = (weatherName) => {
    getWeatherImage(weatherName).then((imageUrl) => {
      changeBackground(imageUrl);
      loader.classList.toggle("flex");
      loader.classList.toggle("hidden");
    }).catch(() => {
      throwError('Image Not Found For the Weather Null');
    });
  };


  const resolveFetchWeather = (cityName, tempToggle) => {
    fetchWeather(cityName, tempToggle).then((json) => {
      const weatherData = (parseWeatherJSON(json));
      updateInformation(weatherData.name,
        weatherData.temp,
        weatherData.weather,
        weatherData.humidity);
      return resolveWeatherImage(weatherData.weather);
    }).catch(() => {
      throwError('Place Not Found');
      loader.classList.toggle("flex");
      loader.classList.toggle("hidden");
    });
  };


  submitButton.addEventListener('click', () => {
    const cityName = locationInput.value;
    revokeError();
    resolveFetchWeather(cityName, tempToggle.checked);
  });

  tempToggle.addEventListener('click', () => {
    let temperature = tempElement.textContent;
    if (tempToggle.checked) {
      temperature = Math.round((temperature - 32) * (5 / 9));
      tempElement.textContent = temperature;
    } else {
      temperature = Math.round((temperature * (9 / 5)) + 32);
      tempElement.textContent = temperature;
    }
  });
};

export { weatherModule as default };
