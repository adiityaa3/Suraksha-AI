"""
Suraksha AI — ML Predictor Module
Trains and exposes Random Forest + Linear Regression models
for climate risk prediction.
"""

import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import LabelEncoder

# ── Location Database ──────────────────────────────────────────────────────────
LOCATIONS = {
    "karnataka": {
        "names": ["Mysore", "Coorg", "Bangalore", "Hassan", "Mangalore",
                  "Shimoga", "Chikmagalur", "Hubli", "Belagavi", "VTU Belagavi"],
        "offsets": [12, 38, 4, 15, 22, 28, 32, 6, -5, -5],
        "hilly":   [True, True, False, False, False, True, True, False, False, False],
        "coords":  [(12.30, 76.65), (12.34, 75.81), (12.97, 77.59),
                    (13.00, 76.10), (12.87, 74.84), (13.93, 75.57),
                    (13.32, 75.78), (15.36, 75.12), (15.85, 74.50), (15.8497, 74.4977)],
        "soil_type": "Red Laterite"
    },
    "maharashtra": {
        "names": ["Mumbai", "Pune", "Nashik", "Kolhapur", "Satara",
                  "Ratnagiri", "Aurangabad", "Nagpur"],
        "offsets": [30, 10, 5, 18, 20, 35, -8, -5],
        "hilly":   [False, False, False, False, False, True, False, False],
        "coords":  [(19.08, 72.88), (18.52, 73.86), (20.00, 73.79),
                    (16.70, 74.23), (17.69, 74.00), (17.00, 73.30),
                    (19.88, 75.32), (21.15, 79.08)],
        "soil_type": "Black Cotton Soil"
    },
    "north": {
        "names": ["Delhi", "Lucknow", "Dehradun", "Shimla", "Chandigarh",
                  "Jaipur", "Agra", "Haridwar"],
        "offsets": [-22, -15, 8, 15, -12, -30, -28, 10],
        "hilly":   [False, False, True, True, False, False, False, False],
        "coords":  [(28.70, 77.10), (26.85, 80.95), (30.32, 78.03),
                    (31.10, 77.17), (30.73, 76.78), (26.92, 75.82),
                    (27.18, 78.01), (29.95, 78.16)],
        "soil_type": "Alluvial Soil"
    },
    "tamilnadu": {
        "names": ["Chennai", "Coimbatore", "Madurai", "Ooty", "Salem",
                  "Tirunelveli", "Thanjavur", "Vellore"],
        "offsets": [20, 5, -5, 25, 8, 10, 12, 3],
        "hilly":   [False, False, False, True, False, False, False, False],
        "coords":  [(13.08, 80.27), (11.02, 76.97), (9.93, 78.12),
                    (11.41, 76.70), (11.65, 78.16), (8.73, 77.70),
                    (10.79, 79.14), (12.92, 79.13)],
        "soil_type": "Red Sandy Soil"
    },
    "westbengal": {
        "names": ["Kolkata", "Darjeeling", "Siliguri", "Asansol", "Haldia",
                  "Bardhaman", "Malda", "Durgapur"],
        "offsets": [22, 18, 20, -5, 15, -8, 5, -6],
        "hilly":   [False, True, False, False, False, False, False, False],
        "coords":  [(22.57, 88.36), (27.04, 88.26), (26.72, 88.43),
                    (23.67, 86.98), (22.03, 88.07), (23.23, 87.85),
                    (25.00, 88.14), (23.48, 87.32)],
        "soil_type": "Alluvial Soil"
    },
    "telangana": {
        "names": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar",
                  "Khammam", "Adilabad", "Nalgonda", "Mahbubnagar"],
        "offsets": [8, 5, -5, 2, 12, 8, -5, -10],
        "hilly":   [False, False, False, False, False, False, False, False],
        "coords":  [(17.38, 78.49), (17.98, 79.60), (18.67, 78.11),
                    (18.43, 79.13), (17.25, 80.15), (19.66, 78.53),
                    (17.05, 79.27), (16.73, 77.98)],
        "soil_type": "Red & Black Soil"
    },
    "kerala": {
        "names": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur",
                  "Kannur", "Palakkad", "Idukki", "Wayanad"],
        "offsets": [30, 32, 35, 28, 35, 15, 40, 42],
        "hilly":   [False, False, False, False, False, False, True, True],
        "coords":  [(8.52, 76.94), (9.93, 76.26), (11.25, 75.78),
                    (10.53, 76.21), (11.87, 75.37), (10.78, 76.65),
                    (9.85, 77.10), (11.60, 76.08)],
        "soil_type": "Laterite Soil"
    },
    "gujarat": {
        "names": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar",
                  "Bhuj", "Jamnagar", "Anand"],
        "offsets": [-10, 5, -5, -12, -8, -25, 0, -5],
        "hilly":   [False, False, False, False, False, False, False, False],
        "coords":  [(23.03, 72.59), (21.17, 72.83), (22.31, 73.18),
                    (22.30, 70.80), (23.22, 72.65), (23.25, 69.67),
                    (22.47, 70.07), (22.56, 72.95)],
        "soil_type": "Sandy Loam Soil"
    }
}

# ── Rich Crop Database ─────────────────────────────────────────────────────────
CROP_DB = {
    "low": [
        {
            "name": "Wheat", "emoji": "🌾", "tag": "HIGH ROI",
            "tag_color": "#f59e0b", "water": "Low",
            "sow_kharif": "Not suitable", "sow_rabi": "Nov–Dec", "sow_zaid": "Not suitable",
            "yield": "35–50 q/ha", "price": "₹2,450/q", "trend": "+4.2%",
            "match_base": 95, "notes": "Ideal for dry, cool conditions. High market demand.",
            "benefit": "Drought tolerant, stable income"
        },
        {
            "name": "Maize", "emoji": "🌽", "tag": "CLIMATE FIT",
            "tag_color": "#22c55e", "water": "Low–Medium",
            "sow_kharif": "Jun–Jul", "sow_rabi": "Nov", "sow_zaid": "Feb–Mar",
            "yield": "40–60 q/ha", "price": "₹1,850/q", "trend": "+2.1%",
            "match_base": 90, "notes": "Versatile crop for multiple seasons.",
            "benefit": "Animal feed + ethanol market"
        },
        {
            "name": "Groundnut", "emoji": "🥜", "tag": "HIGH ROI",
            "tag_color": "#f59e0b", "water": "Low",
            "sow_kharif": "Jun–Jul", "sow_rabi": "Nov–Dec", "sow_zaid": "Mar–Apr",
            "yield": "18–25 q/ha", "price": "₹5,800/q", "trend": "+6.5%",
            "match_base": 88, "notes": "High value oilseed. Fixes nitrogen in soil.",
            "benefit": "Oilseed premium price"
        },
        {
            "name": "Bengal Gram", "emoji": "🫘", "tag": "STABLE",
            "tag_color": "#3b82f6", "water": "Low",
            "sow_kharif": "Not suitable", "sow_rabi": "Oct–Nov", "sow_zaid": "Not suitable",
            "yield": "12–18 q/ha", "price": "₹5,200/q", "trend": "+1.8%",
            "match_base": 85, "notes": "Hardy pulse for dry soils. MSP backed.",
            "benefit": "Government MSP guaranteed"
        },
        {
            "name": "Mustard", "emoji": "🌻", "tag": "FAST HARVEST",
            "tag_color": "#8b5cf6", "water": "Low",
            "sow_kharif": "Not suitable", "sow_rabi": "Oct", "sow_zaid": "Not suitable",
            "yield": "10–18 q/ha", "price": "₹5,650/q", "trend": "+3.9%",
            "match_base": 82, "notes": "Quick 90-day harvest. Cold weather tolerant.",
            "benefit": "Short duration, fast income"
        },
    ],
    "medium": [
        {
            "name": "Paddy (Rice)", "emoji": "🌾", "tag": "CLIMATE FIT",
            "tag_color": "#22c55e", "water": "High",
            "sow_kharif": "Jun–Jul", "sow_rabi": "Nov–Dec", "sow_zaid": "Feb–Mar",
            "yield": "45–65 q/ha", "price": "₹2,183/q", "trend": "+1.3%",
            "match_base": 92, "notes": "Best suited for moderate-high rainfall regions.",
            "benefit": "Staple crop, strong demand"
        },
        {
            "name": "Soybean", "emoji": "🌿", "tag": "HIGH ROI",
            "tag_color": "#f59e0b", "water": "Medium",
            "sow_kharif": "Jun–Jul", "sow_rabi": "Not suitable", "sow_zaid": "Not suitable",
            "yield": "18–28 q/ha", "price": "₹4,600/q", "trend": "+5.2%",
            "match_base": 88, "notes": "Nitrogen-fixing legume. High protein content.",
            "benefit": "Export market premium"
        },
        {
            "name": "Sunflower", "emoji": "🌻", "tag": "STABLE",
            "tag_color": "#3b82f6", "water": "Medium",
            "sow_kharif": "Jun", "sow_rabi": "Jan–Feb", "sow_zaid": "Feb–Mar",
            "yield": "12–20 q/ha", "price": "₹6,015/q", "trend": "+2.7%",
            "match_base": 84, "notes": "Drought tolerant oilseed with good oil content.",
            "benefit": "Stable oilseed market"
        },
        {
            "name": "Turmeric", "emoji": "☘️", "tag": "HIGH ROI",
            "tag_color": "#f59e0b", "water": "Medium–High",
            "sow_kharif": "May–Jun", "sow_rabi": "Not suitable", "sow_zaid": "Not suitable",
            "yield": "25–35 q/ha", "price": "₹12,000/q", "trend": "+8.1%",
            "match_base": 80, "notes": "Premium spice crop. High export demand.",
            "benefit": "Premium spice prices"
        },
        {
            "name": "Green Gram", "emoji": "🫛", "tag": "FAST HARVEST",
            "tag_color": "#8b5cf6", "water": "Medium",
            "sow_kharif": "Jun–Jul", "sow_rabi": "Feb", "sow_zaid": "Mar",
            "yield": "8–14 q/ha", "price": "₹7,755/q", "trend": "+3.4%",
            "match_base": 78, "notes": "Short-duration 60-day crop. Soil enriching.",
            "benefit": "Quick turnover, 60 days"
        },
    ],
    "high": [
        {
            "name": "Ginger", "emoji": "🌿", "tag": "HIGH ROI",
            "tag_color": "#f59e0b", "water": "High",
            "sow_kharif": "Apr–May", "sow_rabi": "Not suitable", "sow_zaid": "Not suitable",
            "yield": "150–250 q/ha", "price": "₹8,500/q", "trend": "+12.3%",
            "match_base": 90, "notes": "Thrives in heavy rainfall. High export value.",
            "benefit": "Extremely high value crop"
        },
        {
            "name": "Banana", "emoji": "🍌", "tag": "STABLE",
            "tag_color": "#3b82f6", "water": "High",
            "sow_kharif": "Jun–Jul", "sow_rabi": "Not suitable", "sow_zaid": "Mar–Apr",
            "yield": "250–400 q/ha", "price": "₹1,800/q", "trend": "+2.8%",
            "match_base": 88, "notes": "Year-round fruit crop for wet regions.",
            "benefit": "Year-round income stream"
        },
        {
            "name": "Sugarcane", "emoji": "🎍", "tag": "CLIMATE FIT",
            "tag_color": "#22c55e", "water": "Very High",
            "sow_kharif": "Feb–Mar", "sow_rabi": "Oct–Nov", "sow_zaid": "Feb–Mar",
            "yield": "600–900 q/ha", "price": "₹315/q", "trend": "+3.1%",
            "match_base": 85, "notes": "High water user but high biomass. Mill contact farming.",
            "benefit": "Contract farming available"
        },
        {
            "name": "Coconut", "emoji": "🥥", "tag": "STABLE",
            "tag_color": "#3b82f6", "water": "High",
            "sow_kharif": "Jun–Jul", "sow_rabi": "Not suitable", "sow_zaid": "Not suitable",
            "yield": "80–120 nuts/tree", "price": "₹30/nut", "trend": "+1.9%",
            "match_base": 82, "notes": "Perennial crop. 60+ year productive life.",
            "benefit": "Long-term perennial income"
        },
        {
            "name": "Water Spinach", "emoji": "🍃", "tag": "FAST HARVEST",
            "tag_color": "#8b5cf6", "water": "Very High",
            "sow_kharif": "Jun", "sow_rabi": "Not suitable", "sow_zaid": "Not suitable",
            "yield": "80–120 q/ha", "price": "₹1,200/q", "trend": "+0.8%",
            "match_base": 75, "notes": "Rapid 30-day harvest. Flood-tolerant vegetable.",
            "benefit": "Thrives in waterlogged fields"
        },
    ]
}

ADVISORIES = {
    "low": (
        "Good news for {loc} farmers! Predicted rainfall of {rain} mm this month "
        "signals favourable conditions. Continue regular field monitoring, plan your "
        "sowing schedule, and optimise irrigation. This is the right time to invest "
        "in soil health and high-value cash crop selection."
    ),
    "medium": (
        "Attention {loc} farmers! {rain} mm of predicted rainfall indicates moderate "
        "weather stress. Ensure all drainage channels are clear. Use raised bed planting "
        "before sowing. Keep emergency replanting seed stock ready. Monitor crop health "
        "daily for early signs of waterlogging or pest pressure."
    ),
    "high": (
        "⚠️ Urgent advisory for {loc}! Predicted rainfall of {rain} mm indicates severe "
        "multi-hazard risk. Immediately postpone all field operations. Secure harvested "
        "produce and farm equipment. Move livestock to higher ground. Activate crop "
        "insurance immediately. Contact your local Krishi Vigyan Kendra. "
        "Your safety comes first."
    )
}

# ── KVK (Krishi Vigyan Kendra) Database ───────────────────────────────────────
KVK_DB = {
    "karnataka":   {"name": "KVK Mysore", "phone": "0821-2411706", "email": "kvk-mysore@icar.gov.in"},
    "maharashtra": {"name": "KVK Pune",   "phone": "020-25537237",  "email": "kvk-pune@icar.gov.in"},
    "north":       {"name": "KVK Delhi",  "phone": "011-25847648",  "email": "kvk-delhi@icar.gov.in"},
    "tamilnadu":   {"name": "KVK Chennai","phone": "044-22350241",  "email": "kvk-tnau@icar.gov.in"},
    "westbengal":  {"name": "KVK Kolkata","phone": "033-25755800",  "email": "kvk-wb@icar.gov.in"},
    "telangana":   {"name": "KVK Hyderabad","phone": "040-24015033","email": "kvk-ts@icar.gov.in"},
    "kerala":      {"name": "KVK Kochi",  "phone": "0484-2375705",  "email": "kvk-kochi@icar.gov.in"},
    "gujarat":     {"name": "KVK Anand",  "phone": "02692-261306",  "email": "kvk-anand@icar.gov.in"},
}


class SurakshaPredictor:
    """
    Trains and holds all ML models used by Suraksha AI.
    Models are trained at startup on synthetic but realistic data.
    """

    def __init__(self):
        self._train_rainfall_model()
        self._train_risk_models()

    # ── Rainfall prediction (Linear Regression) ────────────────────────────────
    def _train_rainfall_model(self):
        """Train a LinearRegression model: temperature → predicted monthly rainfall."""
        rng = np.random.RandomState(42)
        temps = np.linspace(15, 45, 300)
        rainfall = -1.8 * (temps - 28) ** 2 + 120 + rng.uniform(-12, 12, len(temps))
        rainfall = np.clip(rainfall, 5, 200)

        self.lr = LinearRegression()
        self.lr.fit(temps.reshape(-1, 1), rainfall)

    # ── Risk classification (Random Forest) ───────────────────────────────────
    def _train_risk_models(self):
        rng = np.random.RandomState(42)
        n = 2000
        rainfall   = rng.uniform(5, 200, n)
        temp       = rng.uniform(15, 45, n)
        moisture   = rng.randint(0, 3, n)
        wind       = rng.randint(0, 3, n)
        hilly      = rng.randint(0, 2, n)

        X = np.column_stack([rainfall, temp, moisture, wind, hilly])

        flood_labels = np.zeros(n, dtype=int)
        flood_labels[(rainfall >= 60) & (rainfall < 100)] = 1
        flood_labels[rainfall >= 100] = 2
        flood_labels[(moisture == 2) & (rainfall >= 50)] = np.maximum(
            flood_labels[(moisture == 2) & (rainfall >= 50)], 1)
        flood_labels[(wind == 2) & (rainfall >= 80)] = 2

        noise_idx = rng.choice(n, size=n // 10, replace=False)
        flood_labels[noise_idx] = rng.randint(0, 3, len(noise_idx))

        self.rf_flood = RandomForestClassifier(n_estimators=120, max_depth=8, random_state=42)
        self.rf_flood.fit(X, flood_labels)

        crop_labels = np.zeros(n, dtype=int)
        crop_labels[((rainfall > 120) | (rainfall < 30)) & (moisture >= 1)] = 1
        crop_labels[((rainfall > 150) | (rainfall < 20)) & (moisture == 2)] = 2
        crop_labels[(wind == 2) & (rainfall > 100)] = np.maximum(
            crop_labels[(wind == 2) & (rainfall > 100)], 1)
        crop_labels[(moisture == 0) & (rainfall < 25)] = 2

        noise_idx2 = rng.choice(n, size=n // 10, replace=False)
        crop_labels[noise_idx2] = rng.randint(0, 3, len(noise_idx2))

        self.rf_crop = RandomForestClassifier(n_estimators=120, max_depth=8, random_state=42)
        self.rf_crop.fit(X, crop_labels)

        self.label_map = {0: "Low", 1: "Medium", 2: "High"}
        self.moisture_enc = {"low": 0, "moderate": 1, "high": 2}
        self.wind_enc = {"calm": 0, "moderate": 1, "strong": 2}

    # ── Landslide risk ─────────────────────────────────────────────────────────
    def _landslide_risk(self, rainfall, hilly):
        threshold = 75 if hilly else 115
        if rainfall >= threshold:
            return {
                "level": "High", "icon": "🚨",
                "message": ("Landslide risk is HIGH. Avoid all hilly terrain and steep "
                            "agricultural slopes. Evacuate vulnerable hillside settlements.")
            }
        return {
            "level": "Low", "icon": "✅",
            "message": ("Landslide risk is LOW. Terrain is stable. Hillside agriculture "
                        "can continue with standard precautions and regular slope monitoring.")
        }

    # ── Crop match score adjuster ──────────────────────────────────────────────
    def _compute_match(self, crop, rainfall, temperature, moisture, season):
        """Adjust base match score based on actual conditions."""
        score = crop["match_base"]
        water = crop["water"].lower()

        # Rainfall alignment
        if "low" in water and rainfall < 60:
            score += 3
        elif "high" in water and rainfall > 80:
            score += 3
        elif "medium" in water and 40 <= rainfall <= 100:
            score += 2

        # Season alignment
        sow_key = f"sow_{season}"
        if sow_key in crop and crop[sow_key] != "Not suitable":
            score += 2
        elif sow_key in crop and crop[sow_key] == "Not suitable":
            score -= 8

        # Temperature (most crops prefer 20–35°C)
        if 20 <= temperature <= 35:
            score += 2

        return min(99, max(50, score))

    # ── Pest & Disease Alert ───────────────────────────────────────────────────
    def _pest_alert(self, rainfall, humidity, temperature, moisture):
        alerts = []
        if rainfall > 100 and humidity > 75:
            alerts.append({
                "type": "danger",
                "icon": "🍄",
                "title": "Fungal Blight Risk",
                "desc": "High rainfall + humidity creates ideal conditions for late blight, leaf spot, and rust. Apply preventive fungicide spray (Mancozeb / Copper Oxychloride)."
            })
        if rainfall > 80 and humidity > 70:
            alerts.append({
                "type": "warn",
                "icon": "🪱",
                "title": "Stem Borer & Aphid Alert",
                "desc": "Moist conditions favour stem borers in paddy and aphids in pulses. Scout fields twice weekly. Apply neem-based pesticide if infestation > 10%."
            })
        if rainfall < 30 and temperature > 35:
            alerts.append({
                "type": "danger",
                "icon": "🦗",
                "title": "Locust & Whitefly Risk",
                "desc": "Hot dry conditions create locust breeding grounds. Monitor for egg pods in bare soil. Spray pyrethroid if adult density exceeds threshold."
            })
        if rainfall < 20 and moisture == "low":
            alerts.append({
                "type": "warn",
                "icon": "🌵",
                "title": "Drought Stress Alert",
                "desc": "Critically low moisture levels. Apply mulching immediately to conserve soil moisture. Switch to drip irrigation. Consider drought-tolerant variety replanting."
            })
        if not alerts:
            alerts.append({
                "type": "safe",
                "icon": "✅",
                "title": "No Pest Threats Detected",
                "desc": "Current climate conditions show low pest pressure. Continue regular field scouting every 10 days as a preventive measure."
            })
        return alerts

    # ── Irrigation Schedule ────────────────────────────────────────────────────
    def _irrigation_schedule(self, temperature, moisture, rainfall):
        """Compute smart irrigation timing based on conditions."""
        if rainfall > 120 or moisture == "high":
            return {
                "soil_moisture_pct": min(98, int(70 + rainfall * 0.15)),
                "morning": {"time": "Not Required", "duration": "—", "note": "Excess soil moisture"},
                "evening": {"time": "Not Required", "duration": "—", "note": "Natural rainfall sufficient"},
                "auto_pause": True,
                "tip": "Heavy rainfall detected. Pause all irrigation to prevent waterlogging. Ensure drainage channels are open."
            }
        elif moisture == "low" or rainfall < 30:
            morning_time = "05:00 AM" if temperature > 35 else "05:30 AM"
            evening_time = "06:30 PM" if temperature > 35 else "06:00 PM"
            return {
                "soil_moisture_pct": max(20, int(30 + rainfall * 0.5)),
                "morning": {"time": morning_time, "duration": "60 mins", "note": "Deep watering — drought conditions"},
                "evening": {"time": evening_time, "duration": "45 mins", "note": "Foliar moisture recovery"},
                "auto_pause": False,
                "tip": "Dry conditions: Apply mulch around crop base. Use drip irrigation to reduce evaporation loss by 40%."
            }
        else:
            morning_time = "05:30 AM" if temperature > 30 else "06:00 AM"
            evening_time = "06:15 PM"
            morning_dur = "45 mins" if temperature > 32 else "30 mins"
            return {
                "soil_moisture_pct": int(50 + rainfall * 0.2 + ({"low":0,"moderate":10,"high":20}[moisture])),
                "morning": {"time": morning_time, "duration": morning_dur, "note": "Standard schedule"},
                "evening": {"time": evening_time, "duration": "20 mins", "note": "Light evening supplement"},
                "auto_pause": False,
                "tip": "Moderate conditions: Maintain consistent irrigation. Monitor soil at 6-inch depth for moisture adequacy."
            }

    # ── Soil Health Score ──────────────────────────────────────────────────────
    def _soil_health(self, moisture, rainfall, temperature):
        score = 50
        if moisture == "moderate":
            score += 25
        elif moisture == "high":
            score += 10
        elif moisture == "low":
            score -= 10

        if 40 <= rainfall <= 100:
            score += 20
        elif rainfall > 100:
            score += 5
        elif rainfall < 20:
            score -= 15

        if 20 <= temperature <= 32:
            score += 5

        score = max(10, min(100, score))

        if score >= 75:
            status, color, advice = "Excellent", "#22c55e", "Soil is in optimal condition. Ideal time to plant high-value crops."
        elif score >= 55:
            status, color, advice = "Good", "#84cc16", "Soil health is satisfactory. Apply bio-fertiliser to maintain fertility."
        elif score >= 35:
            status, color, advice = "Needs Attention", "#f59e0b", "Soil stress detected. Add organic compost and verify drainage."
        else:
            status, color, advice = "Critical", "#ef4444", "Severe soil stress. Immediate remedial action required — test pH and nutrient levels."

        return {"score": score, "status": status, "color": color, "advice": advice}

    # ── 5-Day Forecast ─────────────────────────────────────────────────────────
    def _five_day_forecast(self, rainfall, temperature, moisture):
        days = ["Mon", "Tue", "Wed", "Thu", "Fri"]
        rng = np.random.RandomState(int(rainfall + temperature))
        base = rainfall / 30  # daily average
        forecast = []
        for i, day in enumerate(days):
            variation = rng.uniform(0.4, 1.6)
            daily_rain = round(base * variation, 1)
            icons = ["☀️", "⛅", "🌦️", "🌧️", "⛈️"]
            icon_idx = min(4, int(daily_rain / 1.5))
            forecast.append({
                "day": day,
                "rain": daily_rain,
                "temp": round(temperature + rng.uniform(-2, 2), 1),
                "icon": icons[icon_idx]
            })
        return forecast

    # ── Main Prediction ────────────────────────────────────────────────────────
    def predict(self, state: str, location_idx: int, temperature: float,
                moisture: str, wind: str, season: str, custom_name=None, custom_coords=None) -> dict:
        loc_data  = LOCATIONS[state]
        loc_name = custom_name if custom_name else loc_data["names"][location_idx]
        coords   = custom_coords if custom_coords else loc_data["coords"][location_idx]
        offset    = loc_data["offsets"][location_idx]
        hilly     = loc_data["hilly"][location_idx]

        base_rain = float(self.lr.predict([[temperature]])[0])
        m_adj = {"low": -12, "moderate": 0, "high": 18}[moisture]
        w_adj = {"calm": 0, "moderate": 3, "strong": 9}[wind]
        rainfall = max(5, round(base_rain + offset + m_adj + w_adj))

        m_enc = self.moisture_enc[moisture]
        w_enc = self.wind_enc[wind]
        feat = [[rainfall, temperature, m_enc, w_enc, int(hilly)]]

        flood_cls = int(self.rf_flood.predict(feat)[0])
        flood_probs = self.rf_flood.predict_proba(feat)[0].tolist()
        flood_level = self.label_map[flood_cls]
        flood_messages = {
            "Low":    "Flood risk is minimal. Normal agricultural activities can continue safely.",
            "Medium": "Moderate flood risk. Monitor field drainage closely, avoid sowing near river banks.",
            "High":   "High flood risk! Avoid all low-lying fields. Secure livestock and stored crops immediately."
        }

        crop_cls = int(self.rf_crop.predict(feat)[0])
        crop_probs = self.rf_crop.predict_proba(feat)[0].tolist()
        crop_level = self.label_map[crop_cls]
        crop_messages = {
            "Low":    "Crop failure risk is LOW. Conditions are suitable for healthy crop growth.",
            "Medium": "Moderate crop stress risk. Monitor crops daily, apply preventive measures.",
            "High":   "High crop failure risk! Multiple climate stress factors detected. Consult your KVK immediately."
        }

        land = self._landslide_risk(rainfall, hilly)

        severity_map = {"Low": 0, "Medium": 1, "High": 2}
        max_sev = max(severity_map[flood_level],
                      severity_map[land["level"]],
                      severity_map[crop_level])
        overall = {0: "low", 1: "medium", 2: "high"}[max_sev]

        humidity = min(98, max(20, int(40 + rainfall * 0.28 + (m_enc * 10))))
        pressure = int(1013 - (temperature - 25) * 0.5 + (rainfall / 20))
        uv_index = max(1, min(11, int(8 - (rainfall / 30))))

        icons = {"Low": "✅", "Medium": "⚠️", "High": "🚨"}

        # Build rich crop list (names only, for backward compat)
        crop_names = [f"{c['emoji']} {c['name']}" for c in CROP_DB[overall]]

        return {
            "location":   loc_name,
            "state":      state,
            "rainfall":   rainfall,
            "temperature": temperature,
            "coordinates": list(coords),
            "flood_risk": {
                "level":       flood_level,
                "icon":        icons[flood_level],
                "message":     flood_messages[flood_level],
                "probabilities": {"Low": round(flood_probs[0], 3),
                                  "Medium": round(flood_probs[1], 3),
                                  "High": round(flood_probs[2], 3)}
            },
            "landslide_risk": {
                "level":   land["level"],
                "icon":    land["icon"],
                "message": land["message"]
            },
            "crop_risk": {
                "level":       crop_level,
                "icon":        icons[crop_level],
                "message":     crop_messages[crop_level],
                "probabilities": {"Low": round(crop_probs[0], 3),
                                  "Medium": round(crop_probs[1], 3),
                                  "High": round(crop_probs[2], 3)}
            },
            "overall":           overall,
            "recommended_crops": crop_names,
            "advisory":          ADVISORIES[overall].format(loc=loc_name, rain=rainfall),
            "weather_insights": {
                "humidity":  humidity,
                "pressure":  pressure,
                "uv_index":  uv_index
            }
        }

    # ── Full Advisory (for /api/advisory endpoint) ─────────────────────────────
    def get_advisory(self, state: str, location_idx: int, temperature: float,
                     moisture: str, wind: str, season: str, custom_name=None, custom_coords=None) -> dict:
        """
        Returns a comprehensive farmer advisory including crop cards,
        irrigation schedule, pest alerts, soil health score, 5-day forecast,
        and KVK contact.
        """
        loc_data = LOCATIONS[state]
        loc_name = custom_name if custom_name else loc_data["names"][location_idx]
        coords   = custom_coords if custom_coords else loc_data["coords"][location_idx]
        hilly    = loc_data["hilly"][location_idx]
        soil_type = loc_data.get("soil_type", "Mixed Soil")

        # Run base prediction to get rainfall + overall risk
        base_rain = float(self.lr.predict([[temperature]])[0])
        m_adj = {"low": -12, "moderate": 0, "high": 18}[moisture]
        w_adj = {"calm": 0, "moderate": 3, "strong": 9}[wind]
        rainfall = max(5, round(base_rain + loc_data["offsets"][location_idx] + m_adj + w_adj))

        m_enc = self.moisture_enc[moisture]
        w_enc = self.wind_enc[wind]
        feat = [[rainfall, temperature, m_enc, w_enc, int(hilly)]]

        flood_cls = int(self.rf_flood.predict(feat)[0])
        crop_cls  = int(self.rf_crop.predict(feat)[0])
        land      = self._landslide_risk(rainfall, hilly)
        severity_map = {"Low": 0, "Medium": 1, "High": 2}
        max_sev   = max(flood_cls, severity_map[land["level"]], crop_cls)
        overall   = {0: "low", 1: "medium", 2: "high"}[max_sev]

        humidity = min(98, max(20, int(40 + rainfall * 0.28 + (m_enc * 10))))

        # Build crop cards with match scores
        raw_crops = CROP_DB[overall]
        crop_cards = []
        for crop in raw_crops:
            match = self._compute_match(crop, rainfall, temperature, moisture, season)
            sow_key = f"sow_{season}"
            crop_cards.append({
                "name":       crop["name"],
                "emoji":      crop["emoji"],
                "tag":        crop["tag"],
                "tag_color":  crop["tag_color"],
                "water":      crop["water"],
                "sow_window": crop.get(sow_key, "—"),
                "yield":      crop["yield"],
                "price":      crop["price"],
                "trend":      crop["trend"],
                "match":      match,
                "notes":      crop["notes"],
                "benefit":    crop["benefit"],
            })
        # Sort by match score descending
        crop_cards.sort(key=lambda x: x["match"], reverse=True)

        # Irrigation schedule
        irrigation = self._irrigation_schedule(temperature, moisture, rainfall)

        # Pest alerts
        pest_alerts = self._pest_alert(rainfall, humidity, temperature, moisture)

        # Soil health
        soil = self._soil_health(moisture, rainfall, temperature)
        soil["type"] = soil_type

        # 5-day forecast
        forecast = self._five_day_forecast(rainfall, temperature, moisture)

        # Insurance eligibility
        risk_level = {0: "Low", 1: "Medium", 2: "High"}[max_sev]
        if risk_level == "High":
            insurance = {
                "eligible": True,
                "scheme": "PM Fasal Bima Yojana",
                "premium": "1.5–5% of sum insured",
                "deadline": "Within 2 weeks of crop sowing",
                "note": "HIGH risk detected — enroll immediately to protect your investment."
            }
        elif risk_level == "Medium":
            insurance = {
                "eligible": True,
                "scheme": "PM Fasal Bima Yojana + RWBCIS",
                "premium": "1.5–2% of sum insured",
                "deadline": "Within 4 weeks of crop sowing",
                "note": "Moderate risk — insurance strongly recommended as a safety net."
            }
        else:
            insurance = {
                "eligible": True,
                "scheme": "PM Fasal Bima Yojana",
                "premium": "1.5% of sum insured",
                "deadline": "Within 6 weeks of crop sowing",
                "note": "Good conditions — enroll preventively for complete peace of mind."
            }

        # KVK
        kvk = KVK_DB.get(state, {"name": "Local KVK", "phone": "1800 180 1551", "email": "kvk@icar.gov.in"})

        # Market prices
        market_prices = [
            {"crop": "Wheat",        "price": "₹2,450/q", "trend": "+4.2%", "exchange": "APMC Mandi", "icon": "🌾"},
            {"crop": "Rice (Basmati)","price": "₹4,800/q", "trend": "+1.3%", "exchange": "Global Export", "icon": "🍚"},
            {"crop": "Soybean",      "price": "₹4,600/q", "trend": "+5.2%", "exchange": "NCDEX",      "icon": "🌿"},
            {"crop": "Maize",        "price": "₹1,850/q", "trend": "+2.1%", "exchange": "MCX",        "icon": "🌽"},
            {"crop": "Groundnut",    "price": "₹5,800/q", "trend": "+6.5%", "exchange": "APMC",       "icon": "🥜"},
            {"crop": "Turmeric",     "price": "₹12,000/q","trend": "+8.1%", "exchange": "Nizamabad",  "icon": "☘️"},
        ]

        return {
            "location":      loc_name,
            "state":         state,
            "season":        season,
            "overall_risk":  overall,
            "rainfall":      rainfall,
            "temperature":   temperature,
            "humidity":      humidity,
            "crop_cards":    crop_cards,
            "irrigation":    irrigation,
            "pest_alerts":   pest_alerts,
            "soil":          soil,
            "forecast":      forecast,
            "insurance":     insurance,
            "kvk":           kvk,
            "market_prices": market_prices,
        }
