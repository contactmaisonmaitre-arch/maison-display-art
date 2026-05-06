import { useEffect, useState } from "react";
import type { WeatherData } from "@/types/signage";

const WEATHER_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=47.0924&longitude=5.4910&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,uv_index,precipitation,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Europe%2FParis&forecast_days=5";

const REFRESH_MS = 10 * 60 * 1000;

export const useWeather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(WEATHER_URL);
        const data = await res.json();
        setWeather(data);
      } catch (e) {
        console.warn("weather fail", e);
      }
    };
    fetchWeather();
    const id = setInterval(fetchWeather, REFRESH_MS);
    return () => clearInterval(id);
  }, []);

  return weather;
};
