import { useQuery } from "@tanstack/react-query";
import { getWeatherDescription } from "../utils/weather";

interface WeatherResponse {
  current_weather: {
    temperature: number;
    windspeed: number;
    weathercode: number;
    is_day: number;
    time: string;
  };
}

export interface CurrentWeather {
  temperature: number;
  windspeed: number;
  time: string;
  description: string;
}

const fetchWeather = async (
  lat: number,
  lon: number
): Promise<WeatherResponse> => {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
  );
  if (!res.ok) throw new Error("날씨 정보를 가져오는 데 실패했습니다.");
  return res.json();
};

export const useCurrentWeather = (latitude: number, longitude: number) => {
  return useQuery({
    queryKey: ["currentWeather", latitude, longitude],
    queryFn: () => fetchWeather(latitude, longitude),

    select: (data: WeatherResponse): CurrentWeather => {
      const { current_weather } = data;
      return {
        temperature: current_weather.temperature,
        windspeed: current_weather.windspeed,
        time: current_weather.time,
        description: getWeatherDescription(current_weather.weathercode),
      };
    },

    staleTime: 1000 * 60 * 5,
  });
};
