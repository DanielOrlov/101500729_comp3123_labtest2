import axios from 'axios';

export const api = axios.create({
    baseURL: "http://api.openweathermap.org/data/2.5/weather?q=Toronto&appid={key}",
    headers: { "Content-Type": "application/json" },
})