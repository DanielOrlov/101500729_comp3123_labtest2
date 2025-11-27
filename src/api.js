import axios from 'axios';

const API_KEY = "";

export const api = axios.create({
  baseURL: "https://api.openweathermap.org/data/2.5",
  headers: { "Content-Type": "application/json" },
});

export const WeatherAPI = {
  getDefaultWeather: () =>
    api.get("/weather", {
      params: { q: "Toronto", appid: API_KEY },
    }),

  getCityWeather: (city) =>
    api.get("/weather", {
      params: { q: city, appid: API_KEY },
    }),
};