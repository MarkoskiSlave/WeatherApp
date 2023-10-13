let data = [];

let backgroundDiv = document.getElementById('background-div');
let searchDiv = document.getElementById('search-div');
let inputDiv = document.getElementById('input-div');
let mainDiv = document.getElementById('main-div');
let cardDiv = document.getElementById('card-div');
let searchInput = document.getElementById('searchInput');
let searchBtn = document.getElementById('searchButton');
let cardParagraph = document.getElementById('card-paragraph');
let homeParagraph = document.getElementById('home-paragraph');
let spinner = document.getElementById('spinner');
let btnTemperature = document.getElementById('button-temperature');
let btnCelsius = document.getElementById('btn-celsius');
let btnFahrenheit = document.getElementById('btn-fahrenheit');

let isCelsius = true;

let getData = function () {
  let city = searchInput.value;
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&APPID=1ba91938887fdebc25e0502eef115f06`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (weatherResult) {
      data = weatherResult;
      console.log(data);
      fillPage('C');
      backgroundSet();
    })
    .catch(function (error) {
      console.log('The request failed!');
      console.log(error);
      errorInSearchCity();
    });
};

searchBtn.addEventListener('click', function (e) {
  e.preventDefault();
  spinner.style.display = 'flex';
  getData();
});

function celsiusToFahrenheit(celsius) {
  var fahrenheit = (celsius * 9) / 5 + 32;
  return fahrenheit;
}

function fillMainDiv(index, symbol) {
  spinner.style.display = 'none';
  btnTemperature.style.setProperty('display', 'flex', 'important');
  let weather = data.list[index].weather[0].main;
  let city = data.city.name;
  let humidity = data.list[index].main.humidity;
  let airPressure = data.list[index].main.pressure;
  let windSpeed = data.list[index].wind.speed;
  let visibility = data.list[index].visibility / 1000;
  let sunrise = data.city.sunrise;
  let sunset = data.city.sunset;
  let highestTemp = data.list[index].main.temp_max;
  let lowestTemp = data.list[index].main.temp_min;
  let feelsLike = data.list[index].main.feels_like;

  let highestTempFahrenheit;
  let lowestTempFahrenheit;
  let feelsLikeFahrenheit;
  if (!isCelsius) {
    highestTempFahrenheit = celsiusToFahrenheit(highestTemp).toFixed(2);
    lowestTempFahrenheit = celsiusToFahrenheit(lowestTemp).toFixed(2);
    feelsLikeFahrenheit = celsiusToFahrenheit(feelsLike).toFixed(2);
    highestTemp = highestTempFahrenheit;
    lowestTemp = lowestTempFahrenheit;
    feelsLike = feelsLikeFahrenheit;
  } else {
    highestTempFahrenheit = highestTemp;
    lowestTempFahrenheit = lowestTemp;
    feelsLikeFahrenheit = lowestTemp;
  }

  mainDiv.innerHTML = `
    <div class="flex-basis-50">
      <div class="d-flex align-items-start flex-column ms-5 mt-4">
        <p class="text-light mt-1 text-size">${weather}</p>
        <p class="text-light text-size">${city} City</p>
        <p class="text-light text-size text-start">H:${highestTemp}&deg; L:${lowestTemp}&deg;</p>
        <p class="text-light text-size text-start">Feels Like: ${feelsLike}&deg;${symbol}</p>
        <span class="text-light mt-2"> Sunset <img class="ms-2" src="Images/Icons/sunset.png" /></span> 
          <p class="text-light text-size">${convertInSunsetAndSunrise(
            sunset
          )}</p>
        <span class="text-light mt-1">Sunrise <img class="ms-2" src="Images/Icons/sunrise.png" /></span>
        <p class="text-light text-size">${convertInSunsetAndSunrise(
          sunrise
        )}</p>
      </div>
    </div>
    <div class="flex-basis-50">
      <div class="d-flex align-items-end flex-column me-5 mt-4">
        <span class="text-light"><img class="me-2" src="Images/Icons/humidity.png" /> Humidity</span>
        <p class="text-light text-size">${humidity} %</p>
        <span class="text-light mt-2"><img class="me-2" src="Images/Icons/pressure.png" /> Pressure</span>
        <p class="text-light text-size">${airPressure} PS</p>
        <span class="text-light mt-2 text-end"><img class="me-2" src="Images/Icons/wind.png" /> Wind Speed</span>
        <p class="text-light text-size">${windSpeed} km/h</p>
        <span class="text-light mt-2"><img class="me-2" src="Images/Icons/visibility.png" /> Visibility</span>
        <p class="text-light text-size">${visibility} km</p>
        <p class="text-light cursor-pointer text-end" onclick="changeCity()"><img class="me-2" src="Images/Icons/location.png" />Change Location</p>
      </div>
    </div>  
  `;
}

function createCard(time, temperature, picture, index, symbol) {
  return `
    <div class="m-2 cards cursor-pointer" data-index="${index}">
      <div class="card-body border rounded d-flex flex-column align-items-center">
        <p class="mt-2"><img class="image-touch" src = 'Images/Icons/touch.png'></p>
        <p class="text-light text-start">${time}</p>
        <p class="text-light text-size text-start">${temperature}&deg;${symbol}</p>
        <img class="" src = 'http://openweathermap.org/img/w/${picture}.png'>
      </div>
    </div>
  `;
}

function changeCity() {
  mainDiv.innerHTML = '';
  cardDiv.innerHTML = '';
  btnTemperature.style.setProperty('display', 'none', 'important');
  cardParagraph.style.display = 'none';
  searchInput.value = '';
  backgroundDiv.style.backgroundImage = "url('Images/Backgrounds/main.jpg')";
  backgroundDiv.style.height = '100vh';
  homeParagraph.style.display = 'flex';
  searchDiv.style.display = 'flex';
}

function extractHoursFromDateTime(dateTime) {
  let timeParts = dateTime.split(' ')[1].split(':');
  let hours = timeParts[0];
  let minutes = timeParts[1];
  return `${hours}:${minutes}`;
}

function fillCardDiv(symbol) {
  let temperatureData = data.list.slice(0, 9).map((record) => record.main.temp);
  let timeData = data.list
    .slice(0, 9)
    .map((record) => extractHoursFromDateTime(record.dt_txt));
  let picture = data.list.slice(0, 9).map((record) => record.weather[0].icon);
  cardParagraph.style.display = 'block';
  let temperatureDataFahrenheit;
  for (let index = 0; index < temperatureData.length; index++) {
    if (!isCelsius) {
      temperatureDataFahrenheit = celsiusToFahrenheit(
        temperatureData[index]
      ).toFixed(2);
      temperatureData[index] = temperatureDataFahrenheit;
    } else {
      temperatureDataFahrenheit = temperatureData[index];
    }
    cardDiv.innerHTML += createCard(
      timeData[index],
      temperatureData[index],
      picture[index],
      index,
      symbol
    );
  }
}

let activeCardIndex = null;
cardDiv.addEventListener('click', function (event) {
  let clickedCard = event.target.closest('.cards');
  if (clickedCard) {
    let index = clickedCard.dataset.index;
    if (index !== activeCardIndex) {
      if (activeCardIndex !== null) {
        let previousActiveCard = document.querySelector(
          `.cards[data-index="${activeCardIndex}"]`
        );
        let touchImage = previousActiveCard.querySelector('.image-touch');
        if (touchImage) {
          touchImage.style.display = 'none';
        }
      }
      activeCardIndex = index;
      let touchImage = clickedCard.querySelector('.image-touch');
      if (touchImage) {
        touchImage.style.display = 'block';
      }
      let symbol;
      if (isCelsius) {
        symbol = 'C';
      } else {
        symbol = 'F';
      }
      fillMainDiv(index, symbol);
    }
  }
});

function fillPage(symbol) {
  searchDiv.style.display = 'none';
  homeParagraph.style.display = 'none';
  fillMainDiv(0, symbol);
  fillCardDiv(symbol);
}

function convertInSunsetAndSunrise(number) {
  let timestamp = number;
  let date = new Date(timestamp * 1000);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}`;
  return formattedTime;
}

function backgroundSet() {
  let weather = data.list[0].weather[0].main;
  let pictureString = data.list[0].weather[0].icon;
  let lastCharacterOfPictureString = pictureString.charAt(
    pictureString.length - 1
  );
  switch (weather) {
    case 'Clear':
      if (lastCharacterOfPictureString === 'n') {
        backgroundDiv.style.backgroundImage =
          "url('Images/Backgrounds/Night-Clear-Gif.gif')";
        backgroundDiv.style.height = 'auto';
      } else {
        backgroundDiv.style.backgroundImage =
          "url('Images/Backgrounds/Clear.jpg')";
        backgroundDiv.style.height = 'auto';
      }
      break;
    case 'Rain':
      backgroundDiv.style.backgroundImage =
        "url('Images/Backgrounds/Thunder-Rain.gif')";
      backgroundDiv.style.height = 'auto';
      break;
    case 'Clouds':
      if (lastCharacterOfPictureString === 'n') {
        backgroundDiv.style.backgroundImage =
          "url('Images/Backgrounds/Night-Clouds-Gif.gif')";
        backgroundDiv.style.height = 'auto';
      } else {
        backgroundDiv.style.backgroundImage =
          "url('Images/Backgrounds/Clouds-Gif.gif')";
        backgroundDiv.style.height = 'auto';
      }
      break;
    default:
      backgroundDiv.style.backgroundImage =
        "url('Images/Backgrounds/main.jpg')";
  }
}

function errorInSearchCity() {
  mainDiv.innerHTML = `
    <p class="text-center text-light text-size mt-5">
       Warning: You have encountered a search error. Double-check your search terms!
    </p>
  `;
  mainDiv.style.justifyContent = 'center';
  searchDiv.style.display = 'flex';
  btnTemperature.style.setProperty('display', 'none', 'important');
}

btnCelsius.addEventListener('click', function () {
  cardDiv.innerHTML = '';
  isCelsius = true;
  fillPage('C');
});

btnFahrenheit.addEventListener('click', function () {
  cardDiv.innerHTML = '';
  isCelsius = false;
  fillPage('F');
});
