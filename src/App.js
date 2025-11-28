// App.js
import { useEffect, useState } from "react";
import { WeatherAPI } from "./api";
import { kelvinToCelsius } from "./util/format";
import './App.css';

function App() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");

  const [weatherInfo, setWeatherInfo] = useState({
    city: "",
    country: "",
    main: "",
    description: "",
    icon: "",
    temp: "",
    feels_like: "",
    temp_min: "",
    temp_max: "",
    pressure: "",
    humidity: "",
    wind_speed: "",
    wind_deg: ""
  });

  const mapWeatherResponse = (data) => {
    const {
      name = "",
      sys = {},
      main = {},
      weather = [],
      wind = {}
    } = data;

    const {
      temp = "",
      feels_like = "",
      temp_min = "",
      temp_max = "",
      pressure = "",
      humidity = ""
    } = main;

    const {
      main: mainCondition = "",
      description = "",
      icon = ""
    } = weather[0] || {};

    const {
      speed: wind_speed = "",
      deg: wind_deg = ""
    } = wind;

    return {
      city: name,
      country: sys.country || "",
      main: mainCondition,
      description,
      icon,
      temp,
      feels_like,
      temp_min,
      temp_max,
      pressure,
      humidity,
      wind_speed,
      wind_deg
    };
  };

  const load = async (cityOverride) => {
    try {
      setErr("");
      setLoading(true);

      const city = cityOverride ?? q.trim();

      const res = city
        ? await WeatherAPI.getCityWeather(city)
        : await WeatherAPI.getDefaultWeather();

      const info = mapWeatherResponse(res.data);
      setWeatherInfo(info);
    } catch (e) {
      setErr(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  // Load default weather on first render (Toronto)
  useEffect(() => {
    load();
  }, []);


  return (
    <div className="container mt-4" >

      {/* Center the card using Bootstrap grid */}
      <div className="row justify-content-center">


        <div className="col-md-6 col-lg-5">
          {/* Search bar */}
          <div className="row mb-3" >
            <div className="col-md-8">
              <input
                type="text"
                className="form-control"
                placeholder="Enter city (e.g. Toronto)"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <div className="col-md-4 mt-2 mt-md-0">
              <button
                className="btn btn-primary w-100"
                onClick={() => load()}
                disabled={loading}
              >
                {loading ? "Loading..." : "Get Weather"}
              </button>
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4 className="mb-0">Weather Info</h4>
              <span className="badge bg-primary">
                {weatherInfo.city
                  ? `${weatherInfo.city}${weatherInfo.country ? ` (${weatherInfo.country})` : ""}`
                  : "No city loaded"}
              </span>
            </div>

            <div className="card-body" style={{ background: "lightblue" }}>

              <div className="d-flex align-items-center mb-3">
                {weatherInfo.icon && (
                  <img
                    src={`https://openweathermap.org/img/wn/${weatherInfo.icon}@2x.png`}
                    alt={weatherInfo.description}
                    className="me-3"
                  />
                )}
                <div>
                  <h3 className="mb-0">
                    {weatherInfo.temp !== "" ? `${kelvinToCelsius(weatherInfo.temp)} °C` : "--"}
                  </h3>
                  <small className="text-muted text-capitalize">
                    {weatherInfo.description || weatherInfo.main || "No data"}
                  </small>
                </div>
              </div>

              <hr />

              <dl className="row mb-0">
                <dt className="col-sm-3">Temperature (min / max)</dt>
                <dd className="col-sm-9">
                  {weatherInfo.temp_min !== "" && weatherInfo.temp_max !== ""
                    ? `${kelvinToCelsius(weatherInfo.temp_min)} °C / ${kelvinToCelsius(weatherInfo.temp_max)} °C`
                    : "--"}
                </dd>

                <dt className="col-sm-3">Feels Like</dt>
                <dd className="col-sm-9">
                  {weatherInfo.feels_like !== "" ? `${kelvinToCelsius(weatherInfo.feels_like)} °C` : "--"}
                </dd>

                <dt className="col-sm-3">Humidity</dt>
                <dd className="col-sm-9">
                  {weatherInfo.humidity !== "" ? `${weatherInfo.humidity} %` : "--"}
                </dd>

                <dt className="col-sm-3">Pressure</dt>
                <dd className="col-sm-9">
                  {weatherInfo.pressure !== "" ? `${weatherInfo.pressure} hPa` : "--"}
                </dd>

                <dt className="col-sm-3">Wind</dt>
                <dd className="col-sm-9">
                  {weatherInfo.wind_speed !== ""
                    ? `${weatherInfo.wind_speed} m/s at ${weatherInfo.wind_deg}°`
                    : "--"}
                </dd>
              </dl>

            </div>
          </div>

        </div>
      </div>

    </div>
  );

}

export default App;
