# -*- coding: utf-8 -*-
"""
Suraksha AI — Real-Time Weather Service
Fetches live weather data from Open-Meteo (https://open-meteo.com)
- Completely free, no API key required
- Provides: temperature, humidity, wind speed, precipitation, UV index, pressure
"""

import requests
from datetime import datetime, timezone

# Open-Meteo API base URL
OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"

# WMO Weather code → emoji + description
WMO_CODES = {
    0:  ("☀️",  "Clear sky"),
    1:  ("🌤️", "Mainly clear"),
    2:  ("⛅",  "Partly cloudy"),
    3:  ("☁️",  "Overcast"),
    45: ("🌫️", "Foggy"),
    48: ("🌫️", "Depositing rime fog"),
    51: ("🌦️", "Light drizzle"),
    53: ("🌦️", "Moderate drizzle"),
    55: ("🌦️", "Dense drizzle"),
    61: ("🌧️", "Slight rain"),
    63: ("🌧️", "Moderate rain"),
    65: ("🌧️", "Heavy rain"),
    71: ("🌨️", "Slight snow"),
    73: ("🌨️", "Moderate snow"),
    75: ("❄️",  "Heavy snow"),
    80: ("🌦️", "Light showers"),
    81: ("🌧️", "Moderate showers"),
    82: ("⛈️",  "Violent showers"),
    95: ("⛈️",  "Thunderstorm"),
    96: ("⛈️",  "Thunderstorm with hail"),
    99: ("⛈️",  "Heavy thunderstorm"),
}

# Timeout in seconds for the external API call
REQUEST_TIMEOUT = 8


def fetch_live_weather(lat: float, lon: float) -> dict:
    """
    Fetch real-time weather data for the given coordinates from Open-Meteo.

    Returns a dict with:
      - temperature        (°C, current)
      - feels_like         (°C)
      - humidity           (%)
      - precipitation      (mm in last hour)
      - wind_speed         (km/h)
      - wind_direction     (degrees)
      - pressure           (hPa)
      - uv_index           (0–11)
      - weather_code       (WMO code int)
      - weather_icon       (emoji)
      - weather_desc       (string)
      - is_day             (bool)
      - forecast_7day      (list of 7 day summaries)
      - source             "open-meteo" | "fallback"
      - fetched_at         ISO timestamp
    """
    params = {
        "latitude":              lat,
        "longitude":             lon,
        "current":               [
            "temperature_2m",
            "apparent_temperature",
            "relative_humidity_2m",
            "precipitation",
            "rain",
            "weather_code",
            "surface_pressure",
            "wind_speed_10m",
            "wind_direction_10m",
            "uv_index",
            "is_day",
        ],
        "daily": [
            "weather_code",
            "temperature_2m_max",
            "temperature_2m_min",
            "precipitation_sum",
            "wind_speed_10m_max",
        ],
        "timezone":              "Asia/Kolkata",
        "forecast_days":         7,
    }

    try:
        resp = requests.get(OPEN_METEO_URL, params=params, timeout=REQUEST_TIMEOUT)
        resp.raise_for_status()
        raw = resp.json()

        cur = raw.get("current", {})
        daily = raw.get("daily", {})

        wmo_code = cur.get("weather_code", 0)
        icon, desc = WMO_CODES.get(wmo_code, ("🌤️", "Partly cloudy"))

        # Build 7-day forecast list
        days = []
        day_names = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]
        dates = daily.get("time", [])
        for i, date_str in enumerate(dates):
            try:
                dt = datetime.strptime(date_str, "%Y-%m-%d")
                day_name = day_names[dt.weekday()]
            except Exception:
                day_name = f"D{i+1}"
            d_code = (daily.get("weather_code") or [0])[i] if i < len(daily.get("weather_code", [])) else 0
            d_icon, d_desc = WMO_CODES.get(d_code, ("⛅", "Partly cloudy"))
            days.append({
                "day":   day_name,
                "date":  date_str,
                "icon":  d_icon,
                "desc":  d_desc,
                "max":   round((daily.get("temperature_2m_max") or [0])[i], 1) if i < len(daily.get("temperature_2m_max", [])) else 0,
                "min":   round((daily.get("temperature_2m_min") or [0])[i], 1) if i < len(daily.get("temperature_2m_min", [])) else 0,
                "rain":  round((daily.get("precipitation_sum") or [0])[i], 1) if i < len(daily.get("precipitation_sum", [])) else 0,
                "wind":  round((daily.get("wind_speed_10m_max") or [0])[i], 1) if i < len(daily.get("wind_speed_10m_max", [])) else 0,
            })

        return {
            "temperature":    round(cur.get("temperature_2m", 28), 1),
            "feels_like":     round(cur.get("apparent_temperature", 28), 1),
            "humidity":       int(cur.get("relative_humidity_2m", 60)),
            "precipitation":  round(cur.get("precipitation", 0), 1),
            "rain_1h":        round(cur.get("rain", 0), 1),
            "wind_speed":     round(cur.get("wind_speed_10m", 0), 1),
            "wind_direction": int(cur.get("wind_direction_10m", 0)),
            "pressure":       int(cur.get("surface_pressure", 1013)),
            "uv_index":       round(cur.get("uv_index", 0), 1),
            "weather_code":   wmo_code,
            "weather_icon":   icon,
            "weather_desc":   desc,
            "is_day":         bool(cur.get("is_day", 1)),
            "forecast_7day":  days,
            "source":         "open-meteo",
            "fetched_at":     datetime.now(timezone.utc).isoformat(),
        }

    except requests.exceptions.Timeout:
        return _fallback_weather(lat, lon, reason="timeout")
    except requests.exceptions.ConnectionError:
        return _fallback_weather(lat, lon, reason="no_connection")
    except Exception as e:
        return _fallback_weather(lat, lon, reason=str(e))


def _fallback_weather(lat: float, lon: float, reason: str = "unknown") -> dict:
    """Return a minimal fallback payload when API is unreachable."""
    return {
        "temperature":    28.0,
        "feels_like":     30.0,
        "humidity":       65,
        "precipitation":  0.0,
        "rain_1h":        0.0,
        "wind_speed":     12.0,
        "wind_direction": 180,
        "pressure":       1013,
        "uv_index":       6.0,
        "weather_code":   1,
        "weather_icon":   "🌤️",
        "weather_desc":   "Data unavailable",
        "is_day":         True,
        "forecast_7day":  [],
        "source":         "fallback",
        "fallback_reason": reason,
        "fetched_at":     datetime.now(timezone.utc).isoformat(),
    }
