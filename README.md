# 🌾 Suraksha AI – Climate Risk Forecasting System for Resilient Communities

![Python](https://img.shields.io/badge/Python-3.11+-blue?logo=python)
![Flask](https://img.shields.io/badge/Flask-Web%20Framework-black?logo=flask)
![Machine Learning](https://img.shields.io/badge/Machine%20Learning-Scikit--Learn-orange)
![SQLite](https://img.shields.io/badge/Database-SQLite-blue)
![License](https://img.shields.io/badge/License-MIT-green)

Suraksha AI is an AI-powered climate risk forecasting platform designed to help farmers make informed agricultural decisions using machine learning, real-time weather forecasting, live market prices, and intelligent advisory recommendations.

The application predicts climate risks, provides personalized farming recommendations, sends SMS alerts, and enables community-based reporting through an interactive dashboard.

---

## 📌 Features

### 🌦 Climate Risk Prediction
- Predicts climate-related agricultural risks using Machine Learning
- Flood, drought, and weather severity prediction
- Seasonal crop recommendations

### 🤖 AI Farmer Advisory
- Personalized farming recommendations
- Irrigation guidance
- Pest management suggestions
- Soil health recommendations
- Insurance awareness

### 🌍 Live Weather Information
- Real-time weather using Open-Meteo API
- Temperature
- Humidity
- Wind Speed
- Rainfall
- UV Index
- 7-Day Forecast

### 📈 Live Market Prices
- Retrieves crop prices from Government Agmarknet API
- Falls back to curated local market prices when API is unavailable

### 📱 SMS Notification System
- Farmer Registration
- Automated Weather Alerts
- Disaster Notifications
- Twilio Integration

### 👨‍🌾 Community Reporting
- Farmers can submit field reports
- Ground condition monitoring
- Disaster reporting
- Crowd-sourced climate observations

### 📊 Dashboard
- Live Statistics
- Prediction Accuracy
- Community Reports
- Interactive User Interface

---

# 🏗 System Architecture

```
                    User
                     │
                     ▼
            Flask Web Application
                     │
      ┌──────────────┼──────────────┐
      │              │              │
      ▼              ▼              ▼
 ML Predictor   Weather API   Market API
      │              │              │
      └──────────────┼──────────────┘
                     │
                     ▼
             Farmer Advisory Engine
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
     SQLite Database      Twilio SMS API
```

---

# 🛠 Tech Stack

## Frontend

- HTML5
- CSS3
- JavaScript

## Backend

- Flask
- REST APIs
- Flask-CORS

## Machine Learning

- Scikit-Learn
- NumPy
- Pandas

## Database

- SQLite

## APIs

- Open-Meteo Weather API
- Government Agmarknet API
- Twilio SMS API

## Deployment

- Python
- Gunicorn
- Vercel / Render / Railway (Supported)

---

# 📂 Project Structure

```
suraksha-ai/
│
├── app.py
├── requirements.txt
├── README.md
├── LICENSE
├── .gitignore
├── .env.example
│
├── services/
│   ├── weather_api.py
│   ├── market_api.py
│   ├── sms_api.py
│   └── __init__.py
│
├── templates/
│   └── index.html
│
├── static/
│   ├── css/
│   ├── js/
│   └── images/

```

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/adiityaa3/suraksha-ai.git
```

```bash
cd suraksha-ai
```

---

## Create Virtual Environment

### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

### Linux / macOS

```bash
python3 -m venv venv
source venv/bin/activate
```

---

## Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Configure Environment Variables

Create a `.env` file in the project root.

```env
GEMINI_API_KEY=your_gemini_api_key

TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

MARKET_API_KEY=your_market_api_key
```

---

## Run Application

```bash
python app.py
```

Application will start at

```
http://127.0.0.1:5000
```

---

# 📡 API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/` | Dashboard |
| POST | `/api/predict` | Climate Risk Prediction |
| POST | `/api/advisory` | AI Farmer Advisory |
| GET | `/api/weather/realtime` | Live Weather |
| GET | `/api/market/prices` | Live Crop Prices |
| POST | `/api/farmers/register` | Register Farmer |
| POST | `/api/notify` | Send SMS Alerts |
| GET | `/api/feedback` | View Community Reports |
| POST | `/api/feedback` | Submit Community Report |
| GET | `/api/stats` | Dashboard Statistics |
| GET | `/api/locations` | Location Database |

---

# 📊 Key Features

- Machine Learning Risk Prediction
- Real-Time Weather Monitoring
- AI-Based Farmer Advisory
- Crop Recommendation
- Live Market Prices
- SMS Alerts
- Community Reporting
- SQLite Database
- RESTful APIs
- Responsive Dashboard

---

# 📈 Future Enhancements

- User Authentication
- Mobile Application
- Satellite Image Analysis
- AI Chatbot for Farmers
- Voice-Based Advisory
- Multi-language Support
- Cloud Deployment on AWS
- Kubernetes & Docker Support
- Historical Climate Analytics

---


# 📄 License

This project is licensed under the **MIT License**.

Feel free to use, modify, and distribute this project with proper attribution.
