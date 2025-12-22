const key = "3ea3d8d5873a2bb68135e4fd1da77d90";

const defaultCity = "Karachi";

const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("city-search");

searchBtn.addEventListener("click", fetchWeather);
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") fetchWeather();
});

window.addEventListener("load", () => {
  searchInput.value = defaultCity;
  fetchWeather();
});

function fetchWeather() {
  const city = searchInput.value.trim();

  if (!city) {
    Swal.fire({
      icon: "warning",
      title: "Oops...",
      text: "Please enter city name!",
      confirmButtonColor: "#0dcaf0",
    });
    return;
  }

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${key}`
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.cod !== 200) {
        Swal.fire({
          icon: "error",
          title: "City not found",
          text: "Please enter a valid city name",
          confirmButtonColor: "#0dcaf0",
        });
        return;
      }

      console.log("City Weather Data:", data);

      document.getElementById(
        "city-name"
      ).textContent = `${data.name}, ${data.sys.country}`;

      const today = new Date();
      document.querySelector(".glass-card p.opacity-75").textContent =
        today.toLocaleDateString(undefined, {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        });

      document.getElementById("main-temp").textContent = `${Math.round(
        data.main.temp
      )}°`;

      document.getElementById("weather-desc").textContent =
        data.weather[0].description;

      document.querySelector(
        ".glass-card img"
      ).src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;

      const sunrise = new Date(data.sys.sunrise * 1000);
      const sunset = new Date(data.sys.sunset * 1000);

      document.getElementById("sunrise-time").textContent =
        sunrise.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      document.getElementById("sunset-time").textContent =
        sunset.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      const daylightSeconds = data.sys.sunset - data.sys.sunrise;
      const daylightHours = Math.floor(daylightSeconds / 3600);
      const daylightMinutes = Math.floor((daylightSeconds % 3600) / 60);

      document.querySelector(
        ".Daylight"
      ).textContent = `Total Daylight: ${daylightHours}h ${daylightMinutes}m`;

      document.getElementById("feels-like-dash").textContent = `${Math.round(
        data.main.feels_like
      )}°`;

      document.getElementById("wind-dash").textContent = `${Math.round(
        data.wind.speed
      )} km/h`;

      document.getElementById("visibility-dash").textContent = `${Math.round(
        data.visibility / 1000
      )} km`;

      document.getElementById(
        "pressure-dash"
      ).textContent = `${data.main.pressure} hPa`;

      document.getElementById("cloud-dash").textContent = `${data.clouds.all}%`;

      document.getElementById("feels-like").textContent = `${Math.round(
        data.main.feels_like
      )}°`;

      document.getElementById(
        "humidity"
      ).textContent = `${data.main.humidity}%`;

      document.getElementById("wind").textContent = `${Math.round(
        data.wind.speed
      )} km/h`;

      document.getElementById(
        "pressure"
      ).textContent = `${data.main.pressure} hPa`;

      document.getElementById("cloud-val").textContent = `${data.clouds.all}%`;

      document.getElementById("vis-val").textContent = `${Math.round(
        data.visibility / 1000
      )} km`;

      let alertText = "No immediate severe weather alerts for your area.";
      let alertIcon = "fa-circle-exclamation";
      let alertColor = "text-danger";

      if (data.main.temp >= 40) {
        alertText = "Extreme heat alert. Avoid outdoor activities.";
        alertIcon = "fa-temperature-high";
        alertColor = "text-danger";
      } else if (data.wind.speed >= 15) {
        alertText = "Strong wind advisory in your area.";
        alertIcon = "fa-wind";
        alertColor = "text-warning";
      } else if (data.weather[0].main.toLowerCase().includes("rain")) {
        alertText = "Rain expected. Carry an umbrella.";
        alertIcon = "fa-cloud-rain";
        alertColor = "text-info";
      }

      document.getElementById("alert-text").textContent = alertText;

      const alertIconEl = document.querySelector("#alerts i");
      alertIconEl.className = `fa-solid ${alertIcon} fs-1 ${alertColor} me-4`;

      const { lat, lon } = data.coord;

      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${key}`
      )
        .then((res) => res.json())
        .then((data1) => {
          console.log("🌦 Forecast Data:", data1);

          const hourlyList = document.getElementById("hourly-list");
          hourlyList.innerHTML = "";

          data1.list.slice(0, 8).forEach((item, index) => {
            const date = new Date(item.dt * 1000);
            let hours = date.getHours();
            const ampm = hours >= 12 ? "PM" : "AM";
            hours = hours % 12 || 12;

            const time = index === 0 ? "Now" : `${hours} ${ampm}`;
            const temp = Math.round(item.main.temp);
            const icon = item.weather[0].icon;

            hourlyList.innerHTML += `
              <div class="col-6 col-md-2">
                <div class="small-card text-center">
                  <small class="text-secondary">${time}</small><br>
                  <img src="https://openweathermap.org/img/wn/${icon}.png" width="40"><br>
                  <b>${temp}°</b>
                </div>
              </div>`;
          });

          const dailyBody = document.getElementById("daily-body");
          dailyBody.innerHTML = "";

          const daysAdded = new Set();

          data1.list.forEach((item) => {
            const dateObj = new Date(item.dt * 1000);
            const dateKey = dateObj.toDateString();

            if (daysAdded.has(dateKey) || daysAdded.size >= 7) return;

            daysAdded.add(dateKey);

            const dayName =
              daysAdded.size === 1
                ? "Today"
                : dateObj.toLocaleDateString("en-US", { weekday: "long" });

            dailyBody.innerHTML += `
              <tr class="align-middle">
                <td class="ps-4">${dayName}</td>
                <td>
                  <img src="https://openweathermap.org/img/wn/${
                    item.weather[0].icon
                  }.png" width="30" class="me-2">
                  ${item.weather[0].main}
                </td>
                <td class="text-info fw-bold">${Math.round(
                  item.main.temp_max
                )}°</td>
                <td class="text-secondary">${Math.round(
                  item.main.temp_min
                )}°</td>
              </tr>`;
          });

          fetch(
            `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${key}`
          )
            .then((res) => res.json())
            .then((airData) => {
              console.log("Air Quality Data:", airData);

              const aqiValue = airData.list[0].main.aqi;

              const aqiMap = {
                1: { text: "Good", color: "#2ecc71", percent: 20 },
                2: { text: "Fair", color: "#9acd32", percent: 40 },
                3: { text: "Moderate", color: "#f1c40f", percent: 60 },
                4: { text: "Poor", color: "#e67e22", percent: 80 },
                5: { text: "Very Poor", color: "#e74c3c", percent: 100 },
              };

              const aqiInfo = aqiMap[aqiValue];

              document.getElementById("aqi").textContent = aqiValue;
              document.getElementById("aqi-desc").textContent = aqiInfo.text;

              const aqiBar = document.getElementById("aqi-progress");
              aqiBar.style.width = aqiInfo.percent + "%";
              aqiBar.style.backgroundColor = aqiInfo.color;

              const components = airData.list[0].components;

              document.getElementById("pm25").textContent = components.pm2_5;
              document.getElementById("pm10").textContent = components.pm10;
              document.getElementById("co").textContent = components.co;
              document.getElementById("so2").textContent = components.so2;
            })
            .catch(() => {
              console.log("Air Quality API failed");
            });
        })
        .catch(() => console.log("Forecast API failed"));
    })
    .catch(() => console.log("Weather API failed"));
}
