# -*- coding: utf-8 -*-
"""
Suraksha AI — Live Market Price Service
Fetches Indian mandi (APMC) prices from data.gov.in Agmarknet dataset.
- Free API key required: https://data.gov.in/user/register
- Falls back to curated static prices if key not set or API unavailable.
"""

import os
import requests
from datetime import datetime, timezone

# ── API Config ────────────────────────────────────────────────────────────────
DATA_GOV_BASE     = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070"
REQUEST_TIMEOUT   = 10

# ── Static Fallback Price Database ────────────────────────────────────────────
# Updated periodically — reflects approximate MSP/APMC prices
STATIC_PRICES = [
    {"crop": "Wheat",         "price": "₹2,450/q", "change": "+4.2%", "exchange": "APMC Mandi",   "icon": "🌾",  "price_num": 2450},
    {"crop": "Rice (Basmati)","price": "₹4,800/q", "change": "+1.3%", "exchange": "Global Export", "icon": "🍚",  "price_num": 4800},
    {"crop": "Soybean",       "price": "₹4,600/q", "change": "+5.2%", "exchange": "NCDEX",         "icon": "🌿",  "price_num": 4600},
    {"crop": "Maize",         "price": "₹1,850/q", "change": "+2.1%", "exchange": "MCX",           "icon": "🌽",  "price_num": 1850},
    {"crop": "Groundnut",     "price": "₹5,800/q", "change": "+6.5%", "exchange": "APMC",          "icon": "🥜",  "price_num": 5800},
    {"crop": "Turmeric",      "price": "₹12,000/q","change": "+8.1%", "exchange": "Nizamabad",     "icon": "☘️",  "price_num": 12000},
    {"crop": "Ginger",        "price": "₹8,500/q", "change": "+12.3%","exchange": "Kochi APMC",    "icon": "🌿",  "price_num": 8500},
    {"crop": "Onion",         "price": "₹2,100/q", "change": "-1.2%", "exchange": "Lasalgaon",     "icon": "🧅",  "price_num": 2100},
    {"crop": "Tomato",        "price": "₹3,200/q", "change": "+15.4%","exchange": "Kolar APMC",    "icon": "🍅",  "price_num": 3200},
    {"crop": "Cotton",        "price": "₹6,620/q", "change": "+0.9%", "exchange": "MCX",           "icon": "🌸",  "price_num": 6620},
]

# Commodity name → icon mapping for live API results
CROP_ICON_MAP = {
    "wheat":      "🌾",  "rice":     "🍚",  "paddy":    "🍚",
    "soybean":    "🌿",  "soya":     "🌿",  "maize":    "🌽",
    "groundnut":  "🥜",  "turmeric": "☘️",  "ginger":   "🌿",
    "onion":      "🧅",  "tomato":   "🍅",  "cotton":   "🌸",
    "mustard":    "🌻",  "sugarcane":"🎍",  "banana":   "🍌",
    "coconut":    "🥥",  "pulses":   "🫘",  "chana":    "🫘",
    "arhar":      "🫛",  "urad":     "🫘",  "moong":    "🫛",
}

# State names as used by data.gov.in
STATE_NAME_MAP = {
    "karnataka":   "Karnataka",
    "maharashtra": "Maharashtra",
    "north":       "Uttar Pradesh",
    "tamilnadu":   "Tamil Nadu",
    "westbengal":  "West Bengal",
    "telangana":   "Telangana",
    "kerala":      "Kerala",
    "gujarat":     "Gujarat",
}


def fetch_market_prices(state: str = "karnataka", limit: int = 10) -> dict:
    """
    Fetch live mandi prices for a given state.

    Returns:
      {
        "prices":  [...],   # list of price dicts
        "source":  "live" | "fallback",
        "state":   str,
        "fetched_at": ISO timestamp
      }
    """
    api_key = os.environ.get("MARKET_API_KEY", "").strip()

    if not api_key:
        return _static_response(state, reason="no_api_key")

    state_name = STATE_NAME_MAP.get(state, "Karnataka")

    params = {
        "api-key":  api_key,
        "format":   "json",
        "limit":    limit,
        "filters[state.keyword]": state_name,
    }

    try:
        resp = requests.get(DATA_GOV_BASE, params=params, timeout=REQUEST_TIMEOUT)
        resp.raise_for_status()
        data = resp.json()

        records = data.get("records", [])
        if not records:
            return _static_response(state, reason="no_records")

        prices = []
        seen = set()
        for rec in records:
            commodity = rec.get("commodity", "").strip()
            if not commodity or commodity.lower() in seen:
                continue
            seen.add(commodity.lower())

            modal_price = rec.get("modal_price", 0)
            min_price   = rec.get("min_price", 0)
            max_price   = rec.get("max_price", 0)

            try:
                modal_num = float(str(modal_price).replace(",", ""))
                # Agmarknet prices are per quintal
                price_str = f"₹{int(modal_num):,}/q"
            except (ValueError, TypeError):
                price_str = f"₹{modal_price}/q"
                modal_num = 0

            icon = "🌾"
            for key, val in CROP_ICON_MAP.items():
                if key in commodity.lower():
                    icon = val
                    break

            mandi = rec.get("market", rec.get("apmc", rec.get("district", "APMC")))

            prices.append({
                "crop":      commodity,
                "price":     price_str,
                "price_num": modal_num,
                "change":    "LIVE",
                "exchange":  mandi,
                "icon":      icon,
                "date":      rec.get("arrival_date", ""),
            })

        if not prices:
            return _static_response(state, reason="parse_empty")

        return {
            "prices":     prices[:10],
            "source":     "live",
            "state":      state,
            "fetched_at": datetime.now(timezone.utc).isoformat(),
        }

    except requests.exceptions.Timeout:
        return _static_response(state, reason="timeout")
    except requests.exceptions.HTTPError as e:
        return _static_response(state, reason=f"http_{e.response.status_code}")
    except Exception as e:
        return _static_response(state, reason=str(e)[:60])


def _static_response(state: str, reason: str = "fallback") -> dict:
    """Return the static curated price list."""
    return {
        "prices":         STATIC_PRICES,
        "source":         "fallback",
        "fallback_reason": reason,
        "state":          state,
        "fetched_at":     datetime.now(timezone.utc).isoformat(),
    }
