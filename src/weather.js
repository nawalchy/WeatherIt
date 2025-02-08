// AUTHOR: SAMIP REGMI
// GROUP: L4CG1
// COLLEGE: BIRATNAGAR INTERNATIONAL COLLEGE, NEPAL
// APPLICATION: WEATHER APP
// PROTOTYPE: 3


const date = new Date();
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();
let dayOfWeek = date.getDay();
let dayName = days[dayOfWeek];
let currentDate = `${dayName}: ${year}/${month}/${day}`;
document.querySelector('#date').innerHTML = `Today is ${currentDate}`;

async function getForecast() {
  clearWeatherDetails();
  var address = document.getElementById('address').value;

  if (!address) {
    alert("Invalid Input: enter city name");
    document.querySelector('button').innerText = "Send";
    return;
  }
  // was giving me problem for cities like "New York" which contained space so i fixed the url encoding by adding +
  // like New york to New+York ...
  // when i am sending this data to php , i just encode it using encodeURIComponent()
  else if (address.includes(' ')) {
    address = address.replace(" ", "+");
  }

  document.querySelector('button').innerText = "Fetching...";
  let data;
  var weatherData;
  try {
    if (navigator.onLine) {
    const response = await fetch(`http://localhost/<folder_name>/connection.php?q=${encodeURIComponent(address)}`);
    if (!response.ok) throw new Error("Failed to fetch data from server.");

    weatherData = await response.json();
    // console.log(imgData)
    localStorage.setItem(address,JSON.stringify(weatherData));
    console.log(weatherData)
    }
    else{
      data = JSON.parse(localStorage.getItem(address));
    }
    if (weatherData.error) {
      alert(weatherData.error);
      clearWeatherDetails();
      return;
    }

    if (weatherData.length > 0) {
      const latestData = weatherData[0];
      document.querySelector('button').innerText = "Send";
      document.getElementById("selectedAddress").innerText = address.toUpperCase();
      document.getElementById("windspeed").innerText = `${latestData.wind} m/s`;
      document.getElementById("humidity").innerText = `${latestData.humidity}%`;
      document.getElementById("forecast").innerText = `${latestData.weatherMain}\n${latestData.weatherDesc}`;
      document.getElementById("temperature").innerText = `${latestData.temp}°C` || "N/A";
      document.getElementById("pressure").innerText = `${latestData.pressure} hPa`;
      document.querySelector("#icon_img").style.width = '30%';
      document.querySelector("#icon_img").src = `http://openweathermap.org/img/wn/${latestData.icon}@4x.png`;
      document.querySelector('span').style.display = 'none';
      document.querySelector('#wind_direction').innerText = `${latestData.wind} °`;
          } else {
      alert("No data available. Please check the PHP endpoint or fetch new data.");
      clearWeatherDetails();
    }
  } catch (error) {
    alert("Error: " + error.message);
    console.error(error);
    clearWeatherDetails();
  }
}

function clearWeatherDetails() {
  document.querySelector('button').innerText = "Send";
  document.getElementById("selectedAddress").innerText = "ADDRESS";
  document.getElementById("windspeed").innerText = "WINDSPEED";
  document.getElementById("humidity").innerText = "HUMIDITY";
  document.getElementById("temperature").innerText = "TEMPERATURE";
  document.getElementById("pressure").innerText = "PRESSURE";
  document.querySelector('#wind_direction').innerText = "WIND DIRECTION";
  document.querySelector("#icon_img").src = "";
  document.querySelector('span').style.display = 'inline-block';
  document.querySelector('#forecast').style.fontSize = '30px';
  document.getElementById("forecast").innerText = "𝓦𝓮𝓪𝓽𝓱𝓮𝓻 𝓲𝓽";
}
