async function getRawData(location) {
  const rawData = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/` +
      location +
      `?key=9PDT97NMJ2HD8MDM9L7X7WPWD`,
    { mode: "cors" },
  );
  const jData = await rawData.json();
  return jData;
}

async function weatherData(location, dayFromToday) {
  const data = await getRawData(location);
  console.log(data);

  const address = data.resolvedAddress;
  const date = data.days[dayFromToday].datetime;
  const condition = data.days[dayFromToday].conditions;
  const tempMax = data.days[dayFromToday].tempmax;
  const tempMin = data.days[dayFromToday].tempmin;
  const temp = data.days[dayFromToday].temp;
  const windSpeed = data.days[dayFromToday].windspeed;
  const visibility = data.days[dayFromToday].visibility;

  return {
    address,
    date,
    condition,
    temp,
    tempMax,
    tempMin,
    windSpeed,
    visibility,
  };
}

function getInfo(userLocation) {
  const locationContainer = document.querySelector("#locationContainer");
  const firstLine = document.querySelector("#firstLine");
  const secondLine = document.querySelector("#secondLine");

  async function getLocation() {
    const result = await weatherData(userLocation, 0);
    const address = result.address;
    locationContainer.textContent = address;
  }

  async function getResult() {
    loading.style.display = "block";

    firstLine.innerHTML = "";
    secondLine.innerHTML = "";

    try {
      for (let i = 0; i < 4; i++) {
        const result = await weatherData(userLocation, i);
        const weatherCard = document.createElement("div");
        weatherCard.id = `weatherCard` + i;
        weatherCard.classList.add("weatherCard");

        const condition = result.condition;
        const date = result.date;
        const temp = result.temp;
        const tempMax = result.tempMax;
        const tempMin = result.tempMin;
        const visibility = result.visibility;
        const windSpeed = result.windSpeed;

        const conditionDOM = document.createElement("div");
        conditionDOM.textContent = condition;
        const dateDOM = document.createElement("div");
        dateDOM.textContent = date;
        const tempDOM = document.createElement("div");
        tempDOM.textContent = `Temperature: ` + temp + ` F`;
        const tempMaxDOM = document.createElement("div");
        tempMaxDOM.textContent = `Max Temperature: ` + tempMax + ` F`;
        const tempMinDOM = document.createElement("div");
        tempMinDOM.textContent = `Min Temperature: ` + tempMin + ` F`;
        const visibilityDOM = document.createElement("div");
        visibilityDOM.textContent = `Visibility: ` + visibility + ` miles`;
        const windSpeedDOM = document.createElement("div");
        windSpeedDOM.textContent = `Wind Speed: ` + windSpeed + ` mph`;

        weatherCard.appendChild(conditionDOM);
        weatherCard.appendChild(dateDOM);
        weatherCard.appendChild(tempDOM);
        weatherCard.appendChild(tempMaxDOM);
        weatherCard.appendChild(tempMinDOM);
        weatherCard.appendChild(visibilityDOM);
        weatherCard.appendChild(windSpeedDOM);

        if (i === 0) {
          firstLine.appendChild(weatherCard);
        } else {
          secondLine.appendChild(weatherCard);
        }
      }
    } catch (error) {
      locationContainer.textContent = "Error loading data.";
    } finally {
      loading.style.display = "none";
    }
  }
  getLocation();
  getResult();
}

const locationBtn = document.querySelector("#locationBtn");
const locationInput = document.querySelector("#location");

locationBtn.addEventListener("click", () => {
  const userLocation = locationInput.value;
  getInfo(userLocation);
  locationInput.value = "";
});

window.addEventListener("DOMContentLoaded", () => {
  const defaultCity = "New York";
  getInfo(defaultCity);
  locationInput.value = "";
});
