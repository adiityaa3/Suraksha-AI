/**
 * Suraksha AI — Frontend Dashboard Script
 * Handles: API calls, Chart.js, Leaflet map, multi-language toggle,
 *          community feedback, and full Farmer Advisory rendering.
 */

"use strict";

// ── Location Database ────────────────────────────────────────────────────────
const LOCS = {
  karnataka:   { names: ["Mysore","Coorg","Bangalore","Hassan","Mangalore","Shimoga","Chikmagalur","Hubli","Belagavi","VTU Belagavi"], coords: [[12.30,76.65],[12.34,75.81],[12.97,77.59],[13.00,76.10],[12.87,74.84],[13.93,75.57],[13.32,75.78],[15.36,75.12],[15.85,74.50],[15.8497,74.4977]] },
  maharashtra: { names: ["Mumbai","Pune","Nashik","Kolhapur","Satara","Ratnagiri","Aurangabad","Nagpur"], coords: [[19.08,72.88],[18.52,73.86],[20.00,73.79],[16.70,74.23],[17.69,74.00],[17.00,73.30],[19.88,75.32],[21.15,79.08]] },
  north:       { names: ["Delhi","Lucknow","Dehradun","Shimla","Chandigarh","Jaipur","Agra","Haridwar"], coords: [[28.70,77.10],[26.85,80.95],[30.32,78.03],[31.10,77.17],[30.73,76.78],[26.92,75.82],[27.18,78.01],[29.95,78.16]] },
  tamilnadu:   { names: ["Chennai","Coimbatore","Madurai","Ooty","Salem","Tirunelveli","Thanjavur","Vellore"], coords: [[13.08,80.27],[11.02,76.97],[9.93,78.12],[11.41,76.70],[11.65,78.16],[8.73,77.70],[10.79,79.14],[12.92,79.13]] },
  westbengal:  { names: ["Kolkata","Darjeeling","Siliguri","Asansol","Haldia","Bardhaman","Malda","Durgapur"], coords: [[22.57,88.36],[27.04,88.26],[26.72,88.43],[23.67,86.98],[22.03,88.07],[23.23,87.85],[25.00,88.14],[23.48,87.32]] },
  telangana:   { names: ["Hyderabad","Warangal","Nizamabad","Karimnagar","Khammam","Adilabad","Nalgonda","Mahbubnagar"], coords: [[17.38,78.49],[17.98,79.60],[18.67,78.11],[18.43,79.13],[17.25,80.15],[19.66,78.53],[17.05,79.27],[16.73,77.98]] },
  kerala:      { names: ["Thiruvananthapuram","Kochi","Kozhikode","Thrissur","Kannur","Palakkad","Idukki","Wayanad"], coords: [[8.52,76.94],[9.93,76.26],[11.25,75.78],[10.53,76.21],[11.87,75.37],[10.78,76.65],[9.85,77.10],[11.60,76.08]] },
  gujarat:     { names: ["Ahmedabad","Surat","Vadodara","Rajkot","Gandhinagar","Bhuj","Jamnagar","Anand"], coords: [[23.03,72.59],[21.17,72.83],[22.31,73.18],[22.30,70.80],[23.22,72.65],[23.25,69.67],[22.47,70.07],[22.56,72.95]] }
};

// ══════════════════════════════════════════════════════════════════════════════
//  MULTI-LANGUAGE STRINGS (i18n)
// ══════════════════════════════════════════════════════════════════════════════
const I18N = {
  en: {
    // Predictor section
    predict_btn:          "🔍 Predict Climate Risk",
    predicting:           "⏳ Analysing...",
    ready_title:          "Ready to Predict",
    ready_sub:            "Fill in the parameters on the left and click Predict Climate Risk to see your full multi-hazard assessment.",
    input_params:         "Input Parameters",
    select_state:         "Select State / Region",
    select_loc:           "Select Location (Village / Block)",
    temperature:          "Current Temperature (°C)",
    soil_moisture:        "Soil Moisture Level",
    wind_speed:           "Wind Speed Condition",
    season:               "Current Season",
    moisture_low:         "Low (Dry Conditions)",
    moisture_mod:         "Moderate (Normal)",
    moisture_high:        "High (Saturated Soil)",
    wind_calm:            "Calm (0–20 km/h)",
    wind_mod:             "Moderate (20–50 km/h)",
    wind_strong:          "Strong (50+ km/h)",
    kharif:               "Kharif (June–November)",
    rabi:                 "Rabi (November–April)",
    zaid:                 "Zaid (April–June)",
    // Risk tabs
    tab_risk:             "⚠️ Risk Assessment",
    tab_chart:            "📊 Rainfall Chart",
    tab_crops:            "🌾 Crop Advisory",
    tab_gauge:            "📈 Rainfall Gauge",
    tab_weather:          "🌤️ Weather",
    multihazard_title:    "Multi-Hazard Risk Assessment (Random Forest)",
    chart_title:          "Temperature vs Predicted Rainfall (Linear Regression)",
    crop_rec_title:       "Recommended Crops for Current Conditions",
    seasonal_action:      "Seasonal Action Plan",
    gauge_title:          "Rainfall Level Indicator",
    weather_title:        "Weather Insights",
    humidity:             "Humidity",
    pressure:             "Pressure",
    uv_index:             "UV Index",
    pred_rainfall:        "Predicted Rainfall",
    flood_risk:           "🌊 Flood Risk",
    landslide_risk:       "⛰️ Landslide Risk",
    crop_risk:            "🌾 Crop Failure Risk",
    advisory_title:       "Farmer Advisory — Ground Level Action Plan",
    view_full_advisory:   "View Full Farmer Advisory",
    // Advisory section
    advisory_section_title: "Farmer Advisory",
    advisory_section_sub: "AI-powered crop recommendations, smart irrigation schedules, pest alerts, soil health scores and market prices — tailored to your exact field conditions.",
    adv_run_title:        "Run Advisory (uses same inputs as Predictor)",
    run_advisory_btn:     "Generate Farmer Advisory",
    adv_generating:       "⏳ Generating...",
    adv_placeholder_title:"Run a Prediction First",
    adv_placeholder_sub:  "Use the Predictor above to set your location and conditions, then click Generate Farmer Advisory.",
    forecast_title:       "5-Day Rainfall Forecast",
    crop_cards_title:     "Recommended Crops for Your Conditions",
    irrigation_title:     "Smart Irrigation Schedule",
    soil_health_title:    "Soil Health Score",
    insurance_title:      "Crop Insurance",
    pest_title:           "Pest & Disease Risk Alerts",
    market_title:         "Live Market Price Alerts",
    kvk_title:            "Nearest KVK Contact",
    // Nav
    map_title:            "🗺️ Location Risk Map",
    map_sub:              "After running a prediction, the map will zoom to your selected location and show a colour-coded risk marker.",
    how_title:            "🤖 How It Works",
    how_sub:              "The Flask backend trains ML models at startup and serves predictions via a REST API — no external services needed.",
    community_title:      "🤝 Community Ground Truth Feedback",
    community_sub:        "Village-level volunteers validate AI predictions and report local conditions.",
    submit_report_title:  "Submit Ground Report",
    your_name:            "Your Name",
    village_block:        "Village / Block",
    conditions_observed:  "Conditions Observed",
    select_condition:     "Select observed condition...",
    additional_obs:       "Additional Observations",
    submit_report:        "📤 Submit Ground Report",
    live_reports:         "Live Community Reports",
    impact_dashboard:     "Community Impact Dashboard",
    reports_submitted:    "Reports Submitted",
    pred_accuracy:        "Prediction Accuracy",
    states_covered:       "States Covered",
    crop_loss_reduced:    "Crop Loss Reduced",
    impact_desc:          "Volunteer ground reports validate AI predictions and continuously improve model accuracy. This two-way feedback loop is Suraksha AI's core differentiator.",
  },
  hi: {
    predict_btn:          "🔍 जलवायु जोखिम का अनुमान लगाएं",
    predicting:           "⏳ विश्लेषण हो रहा है...",
    ready_title:          "अनुमान के लिए तैयार",
    ready_sub:            "बाईं ओर पैरामीटर भरें और जलवायु जोखिम का अनुमान लगाएं पर क्लिक करें।",
    input_params:         "इनपुट पैरामीटर",
    select_state:         "राज्य / क्षेत्र चुनें",
    select_loc:           "स्थान चुनें (गांव / ब्लॉक)",
    temperature:          "वर्तमान तापमान (°C)",
    soil_moisture:        "मिट्टी की नमी का स्तर",
    wind_speed:           "हवा की गति की स्थिति",
    season:               "वर्तमान मौसम",
    moisture_low:         "कम (सूखी स्थिति)",
    moisture_mod:         "मध्यम (सामान्य)",
    moisture_high:        "अधिक (संतृप्त मिट्टी)",
    wind_calm:            "शांत (0–20 किमी/घंटा)",
    wind_mod:             "मध्यम (20–50 किमी/घंटा)",
    wind_strong:          "तेज (50+ किमी/घंटा)",
    kharif:               "खरीफ (जून–नवंबर)",
    rabi:                 "रबी (नवंबर–अप्रैल)",
    zaid:                 "जायद (अप्रैल–जून)",
    tab_risk:             "⚠️ जोखिम मूल्यांकन",
    tab_chart:            "📊 वर्षा चार्ट",
    tab_crops:            "🌾 फसल सलाह",
    tab_gauge:            "📈 वर्षा गेज",
    tab_weather:          "🌤️ मौसम",
    multihazard_title:    "बहु-खतरा जोखिम मूल्यांकन (रैंडम फ़ॉरेस्ट)",
    chart_title:          "तापमान बनाम अनुमानित वर्षा",
    crop_rec_title:       "वर्तमान परिस्थितियों के लिए अनुशंसित फसलें",
    seasonal_action:      "मौसमी कार्य योजना",
    gauge_title:          "वर्षा स्तर संकेतक",
    weather_title:        "मौसम अंतर्दृष्टि",
    humidity:             "आर्द्रता",
    pressure:             "दबाव",
    uv_index:             "यूवी सूचकांक",
    pred_rainfall:        "अनुमानित वर्षा",
    flood_risk:           "🌊 बाढ़ जोखिम",
    landslide_risk:       "⛰️ भूस्खलन जोखिम",
    crop_risk:            "🌾 फसल विफलता जोखिम",
    advisory_title:       "किसान सलाह — ज़मीनी स्तर की कार्य योजना",
    view_full_advisory:   "पूर्ण किसान सलाह देखें",
    advisory_section_title:"किसान सलाह",
    advisory_section_sub: "AI-संचालित फसल अनुशंसाएं, सिंचाई अनुसूची, कीट अलर्ट और बाज़ार मूल्य।",
    adv_run_title:        "सलाह चलाएं (पूर्वानुमान के समान इनपुट)",
    run_advisory_btn:     "किसान सलाह उत्पन्न करें",
    adv_generating:       "⏳ उत्पन्न हो रहा है...",
    adv_placeholder_title:"पहले पूर्वानुमान चलाएं",
    adv_placeholder_sub:  "ऊपर पूर्वानुमान उपकरण का उपयोग करें, फिर किसान सलाह उत्पन्न करें पर क्लिक करें।",
    forecast_title:       "5-दिन वर्षा पूर्वानुमान",
    crop_cards_title:     "आपकी परिस्थितियों के लिए अनुशंसित फसलें",
    irrigation_title:     "स्मार्ट सिंचाई अनुसूची",
    soil_health_title:    "मिट्टी स्वास्थ्य स्कोर",
    insurance_title:      "फसल बीमा",
    pest_title:           "कीट और रोग जोखिम अलर्ट",
    market_title:         "लाइव बाज़ार भाव",
    kvk_title:            "नजदीकी KVK संपर्क",
    map_title:            "🗺️ स्थान जोखिम मानचित्र",
    map_sub:              "पूर्वानुमान के बाद, मानचित्र आपके चयनित स्थान पर ज़ूम करेगा और रंग-कोडित जोखिम मार्कर दिखाएगा।",
    how_title:            "🤖 यह कैसे काम करता है",
    how_sub:              "Flask बैकएंड स्टार्टअप पर ML मॉडल प्रशिक्षित करता है।",
    community_title:      "🤝 सामुदायिक ग्राउंड ट्रुथ फीडबैक",
    community_sub:        "गांव स्तरीय स्वयंसेवक AI पूर्वानुमानों को सत्यापित करते हैं।",
    submit_report_title:  "ज़मीनी रिपोर्ट सबमिट करें",
    your_name:            "आपका नाम",
    village_block:        "गांव / ब्लॉक",
    conditions_observed:  "देखी गई स्थितियां",
    select_condition:     "देखी गई स्थिति चुनें...",
    additional_obs:       "अतिरिक्त टिप्पणियां",
    submit_report:        "📤 ज़मीनी रिपोर्ट सबमिट करें",
    live_reports:         "लाइव सामुदायिक रिपोर्ट",
    impact_dashboard:     "सामुदायिक प्रभाव डैशबोर्ड",
    reports_submitted:    "रिपोर्ट सबमिट",
    pred_accuracy:        "पूर्वानुमान सटीकता",
    states_covered:       "राज्य कवर",
    crop_loss_reduced:    "फसल हानि कम हुई",
    impact_desc:          "स्वयंसेवक रिपोर्ट AI पूर्वानुमानों को मान्य करती हैं और मॉडल सटीकता में सुधार करती हैं।",
  },
  kn: {
    predict_btn:          "🔍 ಹವಾಮಾನ ಅಪಾಯ ಊಹಿಸಿ",
    predicting:           "⏳ ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...",
    ready_title:          "ಊಹಿಸಲು ಸಿದ್ಧ",
    ready_sub:            "ಎಡಭಾಗದ ನಿಯತಾಂಕಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ ಮತ್ತು ಹವಾಮಾನ ಅಪಾಯ ಊಹಿಸಿ ಕ್ಲಿಕ್ ಮಾಡಿ.",
    input_params:         "ಇನ್‌ಪುಟ್ ನಿಯತಾಂಕಗಳು",
    select_state:         "ರಾಜ್ಯ / ಪ್ರದೇಶ ಆಯ್ಕೆಮಾಡಿ",
    select_loc:           "ಸ್ಥಳ ಆಯ್ಕೆಮಾಡಿ (ಗ್ರಾಮ / ಬ್ಲಾಕ್)",
    temperature:          "ಪ್ರಸ್ತುತ ತಾಪಮಾನ (°C)",
    soil_moisture:        "ಮಣ್ಣಿನ ತೇವಾಂಶ ಮಟ್ಟ",
    wind_speed:           "ಗಾಳಿ ವೇಗ ಸ್ಥಿತಿ",
    season:               "ಪ್ರಸ್ತುತ ಋತು",
    moisture_low:         "ಕಡಿಮೆ (ಒಣ ಪರಿಸ್ಥಿತಿಗಳು)",
    moisture_mod:         "ಮಧ್ಯಮ (ಸಾಮಾನ್ಯ)",
    moisture_high:        "ಹೆಚ್ಚು (ಶುದ್ಧ ಮಣ್ಣು)",
    wind_calm:            "ಶಾಂತ (0–20 ಕಿಮೀ/ಗಂ)",
    wind_mod:             "ಮಧ್ಯಮ (20–50 ಕಿಮೀ/ಗಂ)",
    wind_strong:          "ಬಲವಾದ (50+ ಕಿಮೀ/ಗಂ)",
    kharif:               "ಖರೀಫ್ (ಜೂನ್–ನವೆಂಬರ್)",
    rabi:                 "ರಬಿ (ನವೆಂಬರ್–ಏಪ್ರಿಲ್)",
    zaid:                 "ಜಾಯ್ದ್ (ಏಪ್ರಿಲ್–ಜೂನ್)",
    tab_risk:             "⚠️ ಅಪಾಯ ಮೌಲ್ಯಮಾಪನ",
    tab_chart:            "📊 ಮಳೆ ಚಾರ್ಟ್",
    tab_crops:            "🌾 ಬೆಳೆ ಸಲಹೆ",
    tab_gauge:            "📈 ಮಳೆ ಮಾಪಕ",
    tab_weather:          "🌤️ ಹವಾಮಾನ",
    multihazard_title:    "ಬಹು-ಅಪಾಯ ಅಂದಾಜು (ರ್ಯಾಂಡಮ್ ಫಾರೆಸ್ಟ್)",
    chart_title:          "ತಾಪಮಾನ vs ಮಳೆ ಊಹೆ",
    crop_rec_title:       "ಪ್ರಸ್ತುತ ಪರಿಸ್ಥಿತಿಗಳಿಗೆ ಶಿಫಾರಿಸು ಮಾಡಲಾದ ಬೆಳೆಗಳು",
    seasonal_action:      "ಋತು ಕ್ರಿಯಾ ಯೋಜನೆ",
    gauge_title:          "ಮಳೆ ಮಟ್ಟ ಸೂಚಕ",
    weather_title:        "ಹವಾಮಾನ ಮಾಹಿತಿ",
    humidity:             "ಆರ್ದ್ರತೆ",
    pressure:             "ಒತ್ತಡ",
    uv_index:             "UV ಸೂಚ್ಯಂಕ",
    pred_rainfall:        "ಊಹಿಸಿದ ಮಳೆ",
    flood_risk:           "🌊 ಪ್ರವಾಹ ಅಪಾಯ",
    landslide_risk:       "⛰️ ಭೂಕುಸಿತ ಅಪಾಯ",
    crop_risk:            "🌾 ಬೆಳೆ ವೈಫಲ್ಯ ಅಪಾಯ",
    advisory_title:       "ರೈತ ಸಲಹೆ — ಭೂಮಿ ಮಟ್ಟದ ಕ್ರಿಯಾ ಯೋಜನೆ",
    view_full_advisory:   "ಸಂಪೂರ್ಣ ರೈತ ಸಲಹೆ ನೋಡಿ",
    advisory_section_title:"ರೈತ ಸಲಹೆ",
    advisory_section_sub: "AI-ಚಾಲಿತ ಬೆಳೆ ಶಿಫಾರಸುಗಳು, ನೀರಾವರಿ ಅನುಸೂಚಿ, ಕೀಟ ಎಚ್ಚರಿಕೆಗಳು ಮತ್ತು ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು.",
    adv_run_title:        "ಸಲಹೆ ಚಲಾಯಿಸಿ",
    run_advisory_btn:     "ರೈತ ಸಲಹೆ ರಚಿಸಿ",
    adv_generating:       "⏳ ರಚಿಸಲಾಗುತ್ತಿದೆ...",
    adv_placeholder_title:"ಮೊದಲು ಊಹೆ ಚಲಾಯಿಸಿ",
    adv_placeholder_sub:  "ಮೇಲಿನ ಊಹಕ ಉಪಕರಣ ಬಳಸಿ, ನಂತರ ರೈತ ಸಲಹೆ ರಚಿಸಿ ಕ್ಲಿಕ್ ಮಾಡಿ.",
    forecast_title:       "5-ದಿನ ಮಳೆ ಮುನ್ಸೂಚನೆ",
    crop_cards_title:     "ನಿಮ್ಮ ಪರಿಸ್ಥಿತಿಗಳಿಗೆ ಶಿಫಾರಿಸು ಮಾಡಲಾದ ಬೆಳೆಗಳು",
    irrigation_title:     "ಸ್ಮಾರ್ಟ್ ನೀರಾವರಿ ಅನುಸೂಚಿ",
    soil_health_title:    "ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಸ್ಕೋರ್",
    insurance_title:      "ಬೆಳೆ ವಿಮೆ",
    pest_title:           "ಕೀಟ ಮತ್ತು ರೋಗ ಅಪಾಯ ಎಚ್ಚರಿಕೆಗಳು",
    market_title:         "ಲೈವ್ ಮಾರುಕಟ್ಟೆ ಬೆಲೆ",
    kvk_title:            "ಹತ್ತಿರದ KVK ಸಂಪರ್ಕ",
    map_title:            "🗺️ ಸ್ಥಳ ಅಪಾಯ ನಕ್ಷೆ",
    map_sub:              "ಊಹೆಯ ನಂತರ, ನಕ್ಷೆ ನಿಮ್ಮ ಸ್ಥಳಕ್ಕೆ ಜೂಮ್ ಮಾಡುತ್ತದೆ.",
    how_title:            "🤖 ಇದು ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ",
    how_sub:              "Flask ಬ್ಯಾಕೆಂಡ್ ಆರಂಭದಲ್ಲಿ ML ಮಾದರಿಗಳನ್ನು ತರಬೇತಿ ನೀಡುತ್ತದೆ.",
    community_title:      "🤝 ಸಮುದಾಯ ಗ್ರೌಂಡ್ ಟ್ರೂತ್ ಫೀಡ್‌ಬ್ಯಾಕ್",
    community_sub:        "ಗ್ರಾಮ ಮಟ್ಟದ ಸ್ವಯಂಸೇವಕರು AI ಊಹೆಗಳನ್ನು ಮೌಲ್ಯೀಕರಿಸುತ್ತಾರೆ.",
    submit_report_title:  "ಭೂಮಿ ವರದಿ ಸಲ್ಲಿಸಿ",
    your_name:            "ನಿಮ್ಮ ಹೆಸರು",
    village_block:        "ಗ್ರಾಮ / ಬ್ಲಾಕ್",
    conditions_observed:  "ಯಾವ ಸ್ಥಿತಿ ನೋಡಿದ್ದೀರಿ",
    select_condition:     "ನೋಡಿದ ಸ್ಥಿತಿ ಆಯ್ಕೆಮಾಡಿ...",
    additional_obs:       "ಹೆಚ್ಚುವರಿ ವೀಕ್ಷಣೆಗಳು",
    submit_report:        "📤 ಭೂಮಿ ವರದಿ ಸಲ್ಲಿಸಿ",
    live_reports:         "ಲೈವ್ ಸಮುದಾಯ ವರದಿಗಳು",
    impact_dashboard:     "ಸಮುದಾಯ ಪ್ರಭಾವ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    reports_submitted:    "ವರದಿಗಳು ಸಲ್ಲಿಸಿದ",
    pred_accuracy:        "ಊಹೆ ನಿಖರತೆ",
    states_covered:       "ರಾಜ್ಯಗಳು ಕವರ್",
    crop_loss_reduced:    "ಬೆಳೆ ನಷ್ಟ ಕಡಿಮೆ",
    impact_desc:          "ಸ್ವಯಂಸೇವಕ ವರದಿಗಳು AI ಊಹೆಗಳನ್ನು ಮೌಲ್ಯೀಕರಿಸುತ್ತವೆ.",
  }
};

// ── State ────────────────────────────────────────────────────────────────────
let currentLang   = 'en';
let chartInstance = null;
let leafletMap    = null;
let riskMarker    = null;
let lastResult    = null;
let lastPayload   = null;  // Store last predict payload for advisory reuse

// ══════════════════════════════════════════════════════════════════════════════
//  DOM READY
// ══════════════════════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  populateLocs();
  initMap();
  loadFeedback();
  loadStats();
  applyLang('en');
  // Fetch live weather when the location dropdown changes
  document.getElementById('selLoc').addEventListener('change', () => {
    const state = document.getElementById('selState').value;
    const idx   = parseInt(document.getElementById('selLoc').value);
    fetchLiveWeather(state, idx);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
//  MULTI-LANGUAGE ENGINE (Fixed — uses data-i18n attributes)
// ══════════════════════════════════════════════════════════════════════════════
function applyLang(lang) {
  currentLang = lang;
  const t = I18N[lang];

  // Update language button visual state
  document.querySelectorAll('.lang-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.lang === lang);
  });

  // Apply to all [data-i18n] elements (text nodes)
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) el.textContent = t[key];
  });

  // Apply predict button text
  const btnText = document.getElementById('btn-text');
  if (btnText) btnText.textContent = t.predict_btn;

  // Apply advisory button text
  const advBtnText = document.getElementById('adv-btn-text');
  if (advBtnText) {
    const inner = advBtnText.querySelector('[data-i18n]');
    if (!inner) advBtnText.textContent = '🌾 ' + t.run_advisory_btn;
    else inner.textContent = t.run_advisory_btn;
  }

  // Apply placeholder text
  const pt = document.getElementById('placeholder-title');
  const ps = document.getElementById('placeholder-sub');
  if (pt) pt.textContent = t.ready_title;
  if (ps) ps.textContent = t.ready_sub;

  // Re-render results if available
  if (lastResult) renderResult(lastResult);
}

// ── Populate Location Dropdown ───────────────────────────────────────────────
function populateLocs() {
  const state = document.getElementById('selState').value;
  const sel   = document.getElementById('selLoc');
  sel.innerHTML = LOCS[state].names
    .map((n, i) => `<option value="${i}">${n}</option>`)
    .join('');
  // Auto-fetch live weather for the first location in new state
  fetchLiveWeather(state, 0);
}

// ── Leaflet Map ──────────────────────────────────────────────────────────────
function initMap() {
  if (!window.L) return;
  leafletMap = L.map('map', { center: [20.5937, 78.9629], zoom: 5 });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors', maxZoom: 18,
  }).addTo(leafletMap);
  L.popup()
    .setLatLng([20.5937, 78.9629])
    .setContent('<b>🌱 Suraksha AI</b><br>Select a location and predict to see risk on map.')
    .openOn(leafletMap);
}

function updateMap(result) {
  if (!leafletMap) return;
  const [lat, lng] = result.coordinates;
  if (riskMarker) leafletMap.removeLayer(riskMarker);
  const colorMap = { low: '#22c55e', medium: '#f59e0b', high: '#ef4444' };
  const color = colorMap[result.overall] || '#22c55e';
  riskMarker = L.circleMarker([lat, lng], {
    radius: 18, color, fillColor: color, fillOpacity: 0.35, weight: 3,
  }).addTo(leafletMap);
  const popup = `
    <div style="font-family:'Plus Jakarta Sans',sans-serif;min-width:180px">
      <div style="font-weight:800;font-size:1rem;margin-bottom:4px">${result.location}</div>
      <div style="font-size:.8rem;color:#4b7a5c;margin-bottom:6px">${result.state.charAt(0).toUpperCase()+result.state.slice(1)}</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        <span style="background:${color};color:#fff;font-size:.72rem;font-weight:700;padding:2px 8px;border-radius:20px">
          ${result.flood_risk.icon} Flood: ${result.flood_risk.level}
        </span>
        <span style="background:#dbeafe;color:#1d4ed8;font-size:.72rem;font-weight:700;padding:2px 8px;border-radius:20px">
          🌧️ ${result.rainfall}mm
        </span>
      </div>
    </div>`;
  riskMarker.bindPopup(popup).openPopup();
  leafletMap.setView([lat, lng], 7, { animate: true });
}

// ══════════════════════════════════════════════════════════════════════════════
//  PREDICTOR
// ══════════════════════════════════════════════════════════════════════════════
async function runPred() {
  const btn     = document.getElementById('predictBtn');
  const btnTxt  = document.getElementById('btn-text');
  const spinner = btn.querySelector('.spinner');

  btn.disabled = true;
  btn.classList.add('loading');
  spinner.style.display = 'block';
  btnTxt.textContent = I18N[currentLang].predicting;

  const payload = {
    state:        document.getElementById('selState').value,
    location_idx: parseInt(document.getElementById('selLoc').value),
    temperature:  parseFloat(document.getElementById('tempR').value),
    moisture:     document.getElementById('selMoist').value,
    wind:         document.getElementById('selWind').value,
    season:       document.getElementById('selSeason').value,
    custom_name:  window._exactLocOverride || null,
    custom_coords: window._exactCoords || null
  };
  lastPayload = payload;  // Store for advisory reuse

  try {
    const res  = await fetch('/api/predict', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    lastResult = data;
    renderResult(data);
    updateMap(data);
    updateAdvisoryInputSummary(payload, data);   // Update advisory input card
  } catch (err) {
    showToast('❌ Prediction failed: ' + err.message);
  } finally {
    btn.disabled = false;
    btn.classList.remove('loading');
    spinner.style.display = 'none';
    btnTxt.textContent = I18N[currentLang].predict_btn;
  }
}

function updateAdvisoryInputSummary(payload, result) {
  const locEl    = document.getElementById('adv-loc-display');
  const paramsEl = document.getElementById('adv-params-display');
  if (locEl) locEl.textContent  = `📍 ${result.location}, ${payload.state.charAt(0).toUpperCase()+payload.state.slice(1)}`;
  if (paramsEl) paramsEl.textContent = `🌡️ ${payload.temperature}°C  💧 ${payload.moisture}  🌬️ ${payload.wind}  🗓️ ${payload.season}  ➜ ${result.overall.toUpperCase()} RISK`;
}

// ── Render Prediction Result ─────────────────────────────────────────────────
function renderResult(r) {
  const t = I18N[currentLang];

  const bannerCfg = {
    low:    ['green', '✅', `Conditions in ${r.location} are safe — risk levels are LOW.`],
    medium: ['yellow', '⚠️', `Moderate risk in ${r.location}. Take precautionary measures.`],
    high:   ['red', '🚨', `HIGH RISK in ${r.location}! Immediate action required.`],
  };
  const [bc, bi, btext] = bannerCfg[r.overall];
  const ab = document.getElementById('abanner');
  ab.className = `abanner ${bc}`;
  document.getElementById('aicon').textContent = bi;
  document.getElementById('atext').textContent = btext;

  // Show/Hide Farmer Broadcast Group depending on risk
  const broadcastGroup = document.getElementById('broadcastGroup');
  const btnBroadcast = document.getElementById('btnBroadcast');
  if (r.overall === 'high' || r.overall === 'medium') {
    broadcastGroup.style.display = 'flex';
    btnBroadcast.style.background = r.overall === 'high' 
      ? 'linear-gradient(135deg, var(--r600), var(--r400))'
      : 'linear-gradient(135deg, var(--e600), var(--e400))';
    btnBroadcast.disabled = false;
  } else {
    broadcastGroup.style.display = 'none';
  }

  document.getElementById('mT').textContent = r.temperature;
  document.getElementById('mR').textContent = r.rainfall;
  const fc = { Low: '#16a34a', Medium: '#d97706', High: '#dc2626' };
  const mF = document.getElementById('mF');
  const mL = document.getElementById('mL');
  mF.textContent = r.flood_risk.level;
  mF.style.color = fc[r.flood_risk.level];
  mL.textContent = r.landslide_risk.level;
  mL.style.color = r.landslide_risk.level === 'High' ? '#dc2626' : '#16a34a';

  document.getElementById('bFlood').innerHTML = rbHtml(r.flood_risk, t.flood_risk, true);
  document.getElementById('bLand').innerHTML  = rbHtml(r.landslide_risk, t.landslide_risk, false);
  document.getElementById('bCrop').innerHTML  = rbHtml(r.crop_risk, t.crop_risk, true);

  buildChart(r.temperature, r.rainfall);

  document.getElementById('cropWrap').innerHTML =
    r.recommended_crops.map(c => `<div class="ctag">${c}</div>`).join('');

  const seasMap = {
    kharif: 'Kharif (June–Nov): Focus on paddy, soybean, cotton — monitor waterlogging risk from monsoon rains.',
    rabi:   'Rabi (Nov–Apr): Ideal for wheat, mustard, pulses — plan irrigation carefully during dry spells.',
    zaid:   'Zaid (Apr–Jun): Suitable for short-duration vegetables — manage heat and water stress proactively.',
  };
  document.getElementById('seasAdv').textContent = seasMap[r.season] || '';

  document.getElementById('gaugeOut').innerHTML = buildGauge(r.rainfall);

  const wi = r.weather_insights;
  document.getElementById('wi-humidity').textContent = wi.humidity + '%';
  document.getElementById('wi-pressure').textContent = wi.pressure + ' hPa';
  document.getElementById('wi-uv').textContent = wi.uv_index + ' / 11';

  document.getElementById('advText').innerHTML =
    r.advisory.replace(r.location, `<strong>${r.location}</strong>`);

  const ph = document.getElementById('placeholder');
  if (ph) ph.style.display = 'none';
  
  const res = document.getElementById('results');
  res.classList.add('on');
  setTimeout(() => res.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
}

// ── Farmer Broadcast Alert ───────────────────────────────────────────────────
async function broadcastAlert() {
  if (!lastPayload || !lastResult) return;

  const btn = document.getElementById('btnBroadcast');
  const ogText = btn.innerHTML;
  btn.innerHTML = '<div class="spinner" style="display:inline-block; width:14px; height:14px; border-width:2px; margin-right:8px;"></div> Broadcasting...';
  btn.disabled = true;
  
  try {
    const res = await fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        state: lastPayload.state,
        location: lastResult.location,
        risk_level: lastResult.overall
      })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    showToast(`✅ ${data.message}`);
    // Change button to success state temporarily
    btn.innerHTML = `✅ Alerts Dispatched`;
    btn.style.background = 'linear-gradient(135deg, var(--g600), var(--g400))';
    setTimeout(() => { btn.style.display = 'none'; }, 6000);
  } catch(err) {
    showToast('❌ Failed to broadcast alert: ' + err.message);
    btn.innerHTML = ogText;
    btn.disabled = false;
  }
}

// ── Farmer Registration ──────────────────────────────────────────────────────
async function registerFarmer() {
  const name = document.getElementById('regName').value.trim();
  const phone = document.getElementById('regPhone').value.trim();
  const state = document.getElementById('regState').value;
  const vil = document.getElementById('regVil').value.trim();

  if (!name || !phone || !vil) {
    showToast('⚠️ Please fill out Name, Phone, and Village.');
    return;
  }

  const btn = document.getElementById('regBtn');
  const ogText = btn.innerHTML;
  btn.innerHTML = '<div class="spinner" style="display:inline-block; width:14px; height:14px; border-width:2px; margin-right:8px;"></div> Registering...';
  btn.disabled = true;

  try {
    const res = await fetch('/api/farmers/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, state, location: vil })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    
    showToast(`✅ ${data.message}`);
    
    // Store in localStorage to remember the farmer device locally
    localStorage.setItem('suraksha_farmer', JSON.stringify({ name, phone, state, location: vil }));
    
    btn.innerHTML = '✅ Registered Successfully';
    setTimeout(() => { btn.innerHTML = ogText; btn.disabled = false; }, 3000);
  } catch (err) {
    showToast('❌ Failed to register: ' + err.message);
    btn.innerHTML = ogText;
    btn.disabled = false;
  }
}

// ── Risk Block HTML ──────────────────────────────────────────────────────────
function rbHtml(risk, title, showProbs) {
  const clsMap = { Low: 'safe', Medium: 'warn', High: 'danger' };
  const cls = clsMap[risk.level] || 'safe';
  let probsHtml = '';
  if (showProbs && risk.probabilities) {
    const colors = { Low: '#22c55e', Medium: '#f59e0b', High: '#ef4444' };
    probsHtml = `<div class="prob-wrap">` +
      ['Low','Medium','High'].map(l => {
        const pct = Math.round((risk.probabilities[l]||0)*100);
        return `<div class="prob-row">
          <span class="prob-lbl">${l}</span>
          <div class="prob-bar"><div class="prob-fill" style="width:${pct}%;background:${colors[l]}"></div></div>
          <span class="prob-val">${pct}%</span>
        </div>`;
      }).join('') + `</div>`;
  }
  return `<div class="rb ${cls}">
    <div class="rb-i">${risk.icon}</div>
    <div>
      <div class="rb-t">${title}</div>
      <div class="rb-b">${risk.level} Risk</div>
      <div class="rb-m">${risk.message}</div>
      ${probsHtml}
    </div>
  </div>`;
}

// ── Chart.js ─────────────────────────────────────────────────────────────────
function buildChart(temp, rain) {
  const ctx = document.getElementById('myChart').getContext('2d');
  if (chartInstance) chartInstance.destroy();
  const temps = [], rains = [];
  for (let t = 15; t <= 45; t += 0.5) {
    temps.push(t);
    rains.push(Math.max(5, Math.round(-1.8*Math.pow(t-28,2)+120)));
  }
  chartInstance = new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [
        { label:'ML Trend', type:'line', data: temps.map((t,i)=>({x:t,y:rains[i]})),
          borderColor:'#16a34a', borderWidth:2.5, pointRadius:0, fill:false, tension:.35 },
        { label:`Your Input (${temp}°C → ${rain}mm)`, data:[{x:temp,y:rain}],
          backgroundColor:'#f59e0b', pointRadius:12, pointHoverRadius:14 }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend:{labels:{font:{family:'Plus Jakarta Sans',size:11},color:'#4b7a5c',boxWidth:14}} },
      scales: {
        x: { title:{display:true,text:'Temperature (°C)',color:'#4b7a5c',font:{size:11}}, ticks:{color:'#4b7a5c',font:{size:10}}, grid:{color:'rgba(0,0,0,0.04)'} },
        y: { title:{display:true,text:'Predicted Rainfall (mm)',color:'#4b7a5c',font:{size:11}}, ticks:{color:'#4b7a5c',font:{size:10}}, grid:{color:'rgba(0,0,0,0.04)'} }
      }
    }
  });
}

// ── Rainfall Gauge ───────────────────────────────────────────────────────────
function buildGauge(r) {
  const pct = Math.min(100, Math.round((r/180)*100));
  const color = r<60?'#22c55e':r<100?'#f59e0b':'#ef4444';
  const weeks = [.22,.28,.30,.20].map(f => Math.round(r*f));
  const legend = [['#86efac','Low (<60mm)'],['#fde68a','Med (60-100mm)'],['#fca5a5','High (>100mm)']]
    .map(([cl,l]) => `<div style="display:flex;align-items:center;gap:4px;font-size:.68rem;color:var(--muted);font-weight:600"><div style="width:8px;height:8px;border-radius:50%;background:${cl}"></div>${l}</div>`).join('');
  const weekBars = weeks.map((w,i) => {
    const wp = Math.min(100, Math.round((w/45)*100));
    return `<div class="wr"><span class="wl">Week ${i+1}</span>
      <div class="wb-bg"><div class="wb-fill" style="width:${wp}%;background:${color}"></div></div>
      <span class="wv">${w}mm</span></div>`;
  }).join('');
  return `
    <div style="margin-bottom:.6rem">
      <div style="display:flex;justify-content:space-between;font-size:.7rem;color:var(--muted);font-weight:700;margin-bottom:4px">
        <span>0 mm</span><span style="font-family:'DM Mono',monospace;color:${color}">${r} mm predicted</span><span>180 mm</span>
      </div>
      <div class="gb-bg"><div class="gb-fill" style="width:${pct}%;background:${color}"></div></div>
      <div style="display:flex;gap:8px;margin-top:5px;flex-wrap:wrap">${legend}</div>
    </div>
    <div style="margin-top:.9rem">
      <div style="font-size:.68rem;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:var(--muted);margin-bottom:.5rem">Weekly Breakdown Estimate</div>
      ${weekBars}
    </div>`;
}

// ── Tab Switching ────────────────────────────────────────────────────────────
function switchTab(id, btn) {
  document.querySelectorAll('.tp').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tb').forEach(b => b.classList.remove('active'));
  document.getElementById('tp-'+id).classList.add('active');
  btn.classList.add('active');
  if (id === 'chart' && chartInstance) chartInstance.resize();
}

// ── Navigation ───────────────────────────────────────────────────────────────
function goTo(id, btn) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
  document.querySelectorAll('.nav-link').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function goToAdvisoryFromResult() {
  const btn = document.getElementById('navAdvisory');
  goTo('sec-advisory', btn);
  // Auto-trigger advisory if payload is available
  if (lastPayload) setTimeout(() => runAdvisory(), 300);
}

// ══════════════════════════════════════════════════════════════════════════════
//  FARMER ADVISORY
// ══════════════════════════════════════════════════════════════════════════════
async function runAdvisory() {
  if (!lastPayload) {
    showToast('⚠️ Please run a Prediction first to set your location and conditions.');
    return;
  }

  const btn     = document.getElementById('advRunBtn');
  const btnTxt  = document.getElementById('adv-btn-text');
  const spinner = btn.querySelector('.spinner');
  const t       = I18N[currentLang];

  btn.disabled = true;
  btn.classList.add('loading');
  spinner.style.display = 'block';
  btnTxt.textContent = t.adv_generating;

  try {
    const res  = await fetch('/api/advisory', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify(lastPayload),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    renderAdvisory(data);
  } catch (err) {
    showToast('❌ Advisory failed: ' + err.message);
  } finally {
    btn.disabled = false;
    btn.classList.remove('loading');
    spinner.style.display = 'none';
    btnTxt.innerHTML = '🌾 <span data-i18n="run_advisory_btn">' + t.run_advisory_btn + '</span>';
  }
}

function renderAdvisory(d) {
  document.getElementById('adv-placeholder').style.display = 'none';
  const res = document.getElementById('adv-results');
  res.style.display = 'block';

  // ── 5-Day Forecast Strip ──
  const forecastColors = {0:'#22c55e',1:'#84cc16',2:'#fbbf24',3:'#f87171',4:'#ef4444'};
  document.getElementById('forecastStrip').innerHTML = d.forecast.map(day => {
    const idx = Math.min(4, Math.floor(day.rain / 1.5));
    return `<div class="forecast-day">
      <div class="fc-day">${day.day}</div>
      <div class="fc-icon">${day.icon}</div>
      <div class="fc-rain" style="color:${forecastColors[idx]}">${day.rain}mm</div>
      <div class="fc-temp">${day.temp}°C</div>
    </div>`;
  }).join('');

  // ── Crop Cards ──
  const riskColors = { low:'#22c55e', medium:'#f59e0b', high:'#ef4444' };
  const riskBg     = { low:'#f0fdf4', medium:'#fffbeb', high:'#fef2f2' };
  document.getElementById('cropCardsGrid').innerHTML = d.crop_cards.map(c => `
    <div class="crop-card">
      <div class="crop-card-badge" style="background:${c.tag_color}">${c.tag}</div>
      <div class="crop-emoji">${c.emoji}</div>
      <div class="crop-name">${c.name}</div>
      <div class="crop-match-row">
        <div class="crop-match-bar-bg">
          <div class="crop-match-bar-fill" style="width:${c.match}%;background:${riskColors[d.overall_risk]}"></div>
        </div>
        <span class="crop-match-pct" style="color:${riskColors[d.overall_risk]}">${c.match}%</span>
      </div>
      <div class="crop-meta-row">
        <span class="crop-meta-item">💧 ${c.water}</span>
        <span class="crop-meta-item">📅 ${c.sow_window}</span>
      </div>
      <div class="crop-price-row">
        <span class="crop-price">${c.price}</span>
        <span class="crop-trend" style="color:#22c55e">${c.trend}</span>
      </div>
      <div class="crop-yield">📦 Yield: ${c.yield}</div>
      <div class="crop-benefit">✅ ${c.benefit}</div>
      <div class="crop-notes">${c.notes}</div>
    </div>`).join('');

  // ── Irrigation ──
  const irr = d.irrigation;
  const mPct = irr.soil_moisture_pct;
  const mColor = mPct > 70 ? '#3b82f6' : mPct > 40 ? '#22c55e' : '#f59e0b';
  document.getElementById('irrigationCard').innerHTML = `
    <div class="irr-moisture-row">
      <span style="font-size:.72rem;font-weight:700;color:var(--muted)">Soil Moisture</span>
      <span style="font-size:.72rem;font-weight:800;color:${mColor};font-family:'DM Mono',monospace">${mPct}%</span>
    </div>
    <div class="gb-bg" style="margin-bottom:1rem"><div class="gb-fill" style="width:${mPct}%;background:${mColor}"></div></div>
    <div class="irr-shifts">
      <div class="irr-shift ${irr.morning.time==='Not Required'?'irr-paused':'irr-active'}">
        <div class="irr-shift-label">🌅 Morning Shift</div>
        <div class="irr-shift-time">${irr.morning.time}</div>
        <div class="irr-shift-dur">${irr.morning.duration}</div>
        <div class="irr-shift-note">${irr.morning.note}</div>
      </div>
      <div class="irr-shift ${irr.evening.time==='Not Required'?'irr-paused':'irr-active'}">
        <div class="irr-shift-label">🌇 Evening Shift</div>
        <div class="irr-shift-time">${irr.evening.time}</div>
        <div class="irr-shift-dur">${irr.evening.duration}</div>
        <div class="irr-shift-note">${irr.evening.note}</div>
      </div>
    </div>
    ${irr.auto_pause ? '<div class="irr-pause-badge">⏸ Auto-Irrigation Paused — Rainfall Expected</div>' : ''}
    <div class="irr-tip">💡 ${irr.tip}</div>
  `;

  // ── Soil Health ──
  const soil = d.soil;
  const soilArc = Math.round((soil.score / 100) * 180);
  document.getElementById('soilHealthCard').innerHTML = `
    <div class="soil-score-ring" style="--score-color:${soil.color}">
      <div class="soil-score-val" style="color:${soil.color}">${soil.score}</div>
      <div class="soil-score-label">/100</div>
    </div>
    <div class="soil-status-badge" style="background:${soil.color}22;color:${soil.color};border:1.5px solid ${soil.color}44">
      ${soil.status}
    </div>
    <div class="soil-type-row">🌍 Soil Type: <strong>${soil.type}</strong></div>
    <div class="soil-advice">${soil.advice}</div>
  `;

  // ── Insurance ──
  const ins = d.insurance;
  document.getElementById('insuranceCard').innerHTML = `
    <div class="ins-badge ${ins.eligible ? 'ins-eligible' : ''}">
      ${ins.eligible ? '✅ Eligible' : '❌ Not Eligible'}
    </div>
    <div class="ins-scheme">📋 ${ins.scheme}</div>
    <div class="ins-row"><span>Premium:</span><strong>${ins.premium}</strong></div>
    <div class="ins-row"><span>Deadline:</span><strong>${ins.deadline}</strong></div>
    <div class="ins-note">${ins.note}</div>
    <a class="ins-link" href="https://pmfby.gov.in" target="_blank" rel="noopener">🔗 Apply at pmfby.gov.in</a>
  `;

  // ── Pest Alerts ──
  const pestColors = { safe:'safe', warn:'warn', danger:'danger' };
  document.getElementById('pestAlerts').innerHTML = d.pest_alerts.map(p =>
    `<div class="rb ${pestColors[p.type]}" style="margin-bottom:.8rem">
      <div class="rb-i">${p.icon}</div>
      <div>
        <div class="rb-t">${p.title}</div>
        <div class="rb-m">${p.desc}</div>
      </div>
    </div>`).join('');

  // ── Market Prices ── (show skeleton, then fetch live data)
  const state = d.state || document.getElementById('selState').value;
  document.getElementById('marketPrices').innerHTML = `
    <div class="market-skeleton">
      <div class="mkt-skel-row"></div>
      <div class="mkt-skel-row"></div>
      <div class="mkt-skel-row"></div>
      <div class="mkt-skel-row"></div>
    </div>`;
  // Kick off live market fetch in background
  fetchMarketPrices(state);

  // ── KVK ──
  const kvk = d.kvk;
  document.getElementById('kvkCard').innerHTML = `
    <div class="kvk-name">🏛️ ${kvk.name}</div>
    <div class="kvk-row">📞 <a href="tel:${kvk.phone}">${kvk.phone}</a></div>
    <div class="kvk-row">✉️ <a href="mailto:${kvk.email}">${kvk.email}</a></div>
    <div class="kvk-row" style="margin-top:.8rem;padding:.7rem;background:var(--g50);border-radius:8px;font-size:.77rem;color:var(--g700);font-weight:600">
      📞 National Helpline: <strong>1800 180 1551</strong> (Toll Free)
    </div>
    <div class="kvk-row" style="margin-top:.6rem;font-size:.75rem;color:var(--muted)">
      🕐 Mon–Sat, 9 AM – 5 PM · Kisan Call Centre
    </div>
  `;

  // Scroll to results
  setTimeout(() => res.scrollIntoView({ behavior:'smooth', block:'start' }), 100);
  showToast(`✅ Advisory ready for ${d.location}!`);
}

// ══════════════════════════════════════════════════════════════════════════════
//  COMMUNITY FEEDBACK
// ══════════════════════════════════════════════════════════════════════════════
async function submitFB() {
  const name      = document.getElementById('fbName').value.trim();
  const village   = document.getElementById('fbVil').value.trim();
  const condition = document.getElementById('fbCond').value;
  const notes     = document.getElementById('fbText').value.trim();

  if (!name || !village || !condition) {
    showToast('⚠️ Please fill in your name, village, and select a condition.');
    return;
  }

  try {
    const res  = await fetch('/api/feedback', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({name, village, condition, notes}),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);

    document.getElementById('rCount').textContent = data.total_reports;
    const list = document.getElementById('fbList');
    const item = document.createElement('div');
    item.className = 'fb-item';
    item.style.animation = 'pop-in .4s ease both';
    item.innerHTML = `
      <div class="fb-hdr">
        <span class="fb-name">${data.report.name}</span>
        <span class="fb-loc">📍 ${data.report.village}</span>
      </div>
      <div class="fb-txt"><strong>${data.report.condition}.</strong>${notes?' '+notes:''}</div>`;
    list.insertBefore(item, list.firstChild);
    ['fbName','fbVil','fbText'].forEach(id => document.getElementById(id).value='');
    document.getElementById('fbCond').value='';
    showToast('✅ Report submitted! Thank you, '+name.split(' ')[0]+'.');
  } catch(err) {
    showToast('❌ Submission failed: '+err.message);
  }
}

async function loadFeedback() {
  try {
    const res  = await fetch('/api/feedback');
    const data = await res.json();
    const list = document.getElementById('fbList');
    list.innerHTML='';
    data.reports.forEach(rep => {
      const item = document.createElement('div');
      item.className='fb-item';
      item.innerHTML=`
        <div class="fb-hdr">
          <span class="fb-name">${rep.name}</span>
          <span class="fb-loc">📍 ${rep.village}</span>
        </div>
        <div class="fb-txt"><strong>${rep.condition}.</strong>${rep.notes?' '+rep.notes:''}</div>`;
      list.appendChild(item);
    });
    document.getElementById('rCount').textContent = data.total;
  } catch(_) {}
}

async function loadStats() {
  try {
    const res  = await fetch('/api/stats');
    const data = await res.json();
    document.getElementById('rCount').textContent    = data.total_reports;
    document.getElementById('statStates').textContent = data.states_covered;
    document.getElementById('statAcc').textContent    = data.prediction_accuracy+'%';
    document.getElementById('statCrop').textContent   = data.crop_loss_reduction+'%';
  } catch(_) {}
}

// ══════════════════════════════════════════════════════════════════════════════
//  REAL-TIME WEATHER — Open-Meteo
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Fetch live weather for the given state + location index.
 * On success, updates the live weather badge and pre-fills the temperature slider.
 */
async function fetchLiveWeather(state, locIdx) {
  const badge = document.getElementById('live-weather-badge');
  if (!badge) return;

  // Show loading state
  badge.style.display = 'block';
  badge.innerHTML = `
    <div class="lwb-header">
      <span class="lwb-dot"></span>
      <span class="lwb-label">LIVE WEATHER</span>
      <span class="lwb-source">Open-Meteo</span>
    </div>
    <div class="lwb-fetching">⏳ Fetching live weather data...</div>`;

  let coords = LOCS[state]?.coords?.[locIdx];
  if (window._exactCoords) coords = window._exactCoords;
  if (!coords) {
    badge.style.display = 'none';
    return;
  }
  const [lat, lon] = coords;

  try {
    const res  = await fetch(`/api/weather/realtime?lat=${lat}&lon=${lon}`);
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    updateLiveWeatherBadge(data);
  } catch (err) {
    badge.innerHTML = `
      <div class="lwb-header">
        <span class="lwb-dot" style="background:#f59e0b"></span>
        <span class="lwb-label">WEATHER</span>
        <span class="lwb-source">Offline</span>
      </div>
      <div class="lwb-note lwb-note-warn">⚠️ Live weather unavailable. Using ML estimates.</div>`;
  }
}

/** Update the live weather badge with fetched data. */
function updateLiveWeatherBadge(data) {
  const badge = document.getElementById('live-weather-badge');
  if (!badge) return;

  const isLive    = data.source === 'open-meteo';
  const sourceLabel = isLive ? 'Open-Meteo · LIVE' : 'Offline Estimate';
  const dotColor    = isLive ? '#ef4444' : '#f59e0b';
  const rain1h      = data.rain_1h || data.precipitation || 0;

  badge.innerHTML = `
    <div class="lwb-header">
      <span class="lwb-dot" style="background:${dotColor}"></span>
      <span class="lwb-label">LIVE WEATHER</span>
      <span class="lwb-source">${sourceLabel}</span>
    </div>
    <div class="lwb-stats">
      <div class="lwb-stat">
        <span class="lwb-icon">🌡️</span>
        <span class="lwb-val" id="lwb-temp">${data.temperature}</span>
        <span class="lwb-unit">°C</span>
      </div>
      <div class="lwb-stat">
        <span class="lwb-icon">💧</span>
        <span class="lwb-val" id="lwb-hum">${data.humidity}</span>
        <span class="lwb-unit">% Humidity</span>
      </div>
      <div class="lwb-stat">
        <span class="lwb-icon">🌬️</span>
        <span class="lwb-val" id="lwb-wind">${data.wind_speed}</span>
        <span class="lwb-unit">km/h</span>
      </div>
      <div class="lwb-stat">
        <span class="lwb-icon" id="lwb-icon">${data.weather_icon}</span>
        <span class="lwb-desc" id="lwb-desc">${data.weather_desc}</span>
      </div>
    </div>
    ${rain1h > 0 ? `<div class="lwb-note">🌧️ ${rain1h}mm rainfall in last hour</div>` : ''}
    ${data.feels_like ? `<div class="lwb-note">Feels like ${data.feels_like}°C</div>` : ''}`;

  // Auto-fill temperature slider with live value if within range
  if (isLive) {
    // 1. Map temperature
    const clampedTemp = Math.max(15, Math.min(45, Math.round(data.temperature)));
    const slider = document.getElementById('tempR');
    const label  = document.getElementById('tempV');
    if (slider && label) {
      slider.value    = clampedTemp;
      label.textContent = clampedTemp + '°C';
    }

    // 2. Map moisture based on humidity
    const moistureSelect = document.getElementById('selMoist');
    if (moistureSelect) {
      if (data.humidity < 40) moistureSelect.value = 'low';
      else if (data.humidity > 70) moistureSelect.value = 'high';
      else moistureSelect.value = 'moderate';
    }

    // 3. Map wind based on wind speed (km/h)
    const windSelect = document.getElementById('selWind');
    if (windSelect) {
      if (data.wind_speed < 10) windSelect.value = 'calm';
      else if (data.wind_speed > 25) windSelect.value = 'strong';
      else windSelect.value = 'moderate';
    }

    showToast(`🌍 Live data synced: Temp, Moisture & Wind inputs auto-filled!`);
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  GEOLOCATION & REVERSE MAPPING
// ══════════════════════════════════════════════════════════════════════════════

/** Triggered by the "Locate Me" button */
function geolocateUser() {
  if (!navigator.geolocation) {
    showToast("❌ Geolocation is not supported by your browser.");
    return;
  }
  showToast("📍 Requesting GPS location...");
  navigator.geolocation.getCurrentPosition(
    async pos => {
      const { latitude, longitude, accuracy } = pos.coords;
      console.log(`[Suraksha GPS] Raw coords: lat=${latitude}, lon=${longitude}, accuracy=${accuracy}m`);
      showToast(`📍 GPS: ${latitude.toFixed(4)}, ${longitude.toFixed(4)} (±${Math.round(accuracy)}m)`);
      
      window._exactCoords = [latitude, longitude];
      try {
        const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
        const d = await r.json();
        const address = d.address || {};
        const exactName = address.village || address.suburb || address.town || address.city || address.county || "Exact GPS Location";
        window._exactLocOverride = exactName;
      } catch (e) {
        window._exactLocOverride = "Exact GPS Location";
        console.warn("Reverse geocode failed", e);
      }

      findNearestVillage(latitude, longitude);
    },
    err => {
      showToast("❌ GPS access denied or unavailable.");
    },
    { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
  );
}

/** Haversine distance helper (returns km) */
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

/** Finds the nearest village in LOCS and updates dropdowns. */
function findNearestVillage(userLat, userLon) {
  if (!LOCS) return;

  let minDistance = Infinity;
  let nearestState = null;
  let nearestLocIdx = 0;
  let nearestName = "";

  for (const state in LOCS) {
    const coordsList = LOCS[state].coords;
    const namesList  = LOCS[state].names;
    for (let i = 0; i < coordsList.length; i++) {
        const [lat, lon] = coordsList[i];
        const dist = getDistance(userLat, userLon, lat, lon);
        if (dist < minDistance) {
            minDistance = dist;
            nearestState = state;
            nearestLocIdx = i;
            nearestName = namesList[i];
        }
    }
  }

  if (nearestState) {
    // Set state dropdown
    document.getElementById('selState').value = nearestState;
    // Populate villages for that state
    populateLocs();
    // Set village dropdown
    const locSel = document.getElementById('selLoc');
    locSel.value = nearestLocIdx;
    
    // Show the *database city name* (e.g. "VTU Belagavi") in dropdown and use it for predictions
    const dbCityName = nearestName;  // e.g. "VTU Belagavi"
    locSel.options[locSel.selectedIndex].text = `📍 ${dbCityName} (GPS)`;
    locSel.options[locSel.selectedIndex].style.fontWeight = 'bold';
    locSel.options[locSel.selectedIndex].style.color = '#22c55e';

    // Always use the database city name for predictions (overrides Nominatim micro-locality)
    window._exactLocOverride = dbCityName;
    
    // Fetch live weather using exact GPS coords (not the nearest village's coords)
    if (window._exactCoords) {
      const [eLat, eLon] = window._exactCoords;
      const badge = document.getElementById('live-weather-badge');
      if (badge) {
        badge.style.display = 'block';
        badge.innerHTML = `<div class="lwb-header"><span class="lwb-dot"></span><span class="lwb-label">LIVE WEATHER</span><span class="lwb-source">Open-Meteo</span></div><div class="lwb-fetching">⏳ Fetching live weather for your exact location...</div>`;
        fetch(`/api/weather/realtime?lat=${eLat}&lon=${eLon}`)
          .then(r => r.json())
          .then(data => { if (!data.error) updateLiveWeatherBadge(data); })
          .catch(() => {});
      }
    } else {
      fetchLiveWeather(nearestState, nearestLocIdx);
    }
    
    showToast(`✅ Located: ${dbCityName}, Karnataka (±${Math.round(minDistance * 1000) / 1000}km from city centre)`);
  }
}


// ══════════════════════════════════════════════════════════════════════════════
//  LIVE MARKET PRICES — data.gov.in (with fallback)
// ══════════════════════════════════════════════════════════════════════════════

// Store last fetched state for refresh button
let _lastMarketState = 'karnataka';

/**
 * Fetch live mandi prices for the given state.
 * Renders prices with LIVE or SIMULATED source badge.
 */
async function fetchMarketPrices(state) {
  _lastMarketState = state || 'karnataka';
  const container = document.getElementById('marketPrices');
  if (!container) return;

  // Show shimmer skeleton while loading
  container.innerHTML = `
    <div class="market-skeleton">
      ${'<div class="mkt-skel-row"></div>'.repeat(5)}
    </div>`;

  try {
    const res  = await fetch(`/api/market/prices?state=${encodeURIComponent(_lastMarketState)}`);
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    renderMarketPrices(data.prices, data.source, data.fetched_at);
  } catch (err) {
    // Silently fall back to a generic error row
    container.innerHTML = `
      <div style="font-size:.78rem;color:var(--muted);padding:.5rem 0">
        ⚠️ Market prices temporarily unavailable. Please refresh.
      </div>`;
  }
}

/** Called by the Refresh button in the market card. */
async function refreshMarketPrices() {
  const btn = document.getElementById('market-refresh-btn');
  if (btn) { btn.disabled = true; btn.textContent = '⏳'; }
  await fetchMarketPrices(_lastMarketState);
  if (btn) { btn.disabled = false; btn.textContent = '↻ Refresh'; }
}

/** Render the market prices list and update source badge. */
function renderMarketPrices(prices, source, fetchedAt) {
  const container = document.getElementById('marketPrices');
  if (!container) return;

  const isLive = source === 'live';

  // Render source badge
  const badgeEl = document.getElementById('market-source-badge');
  if (badgeEl) {
    badgeEl.style.display = 'inline-block';
    if (isLive) {
      badgeEl.className = 'market-source-badge badge-live';
      badgeEl.textContent = 'LIVE';
    } else {
      badgeEl.className = 'market-source-badge badge-simulated';
      badgeEl.textContent = 'Simulated';
    }
  }

  // Render last-updated timestamp
  const updEl = document.getElementById('market-last-updated');
  if (updEl && fetchedAt) {
    const dt = new Date(fetchedAt);
    updEl.textContent = `Updated: ${dt.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })}`;
  }
  const rowEl = document.getElementById('market-refresh-row');
  if (rowEl) rowEl.style.display = 'flex';

  // Render price rows
  container.innerHTML = prices.map(m => {
    let trendHtml = '';
    const ch = m.change || m.trend || '';
    if (ch === 'LIVE') {
      trendHtml = `<div class="market-trend trend-live">● LIVE APMC</div>`;
    } else if (ch.startsWith('+')) {
      trendHtml = `<div class="market-trend trend-up">📈 ${ch}</div>`;
    } else if (ch.startsWith('-')) {
      trendHtml = `<div class="market-trend trend-down">📉 ${ch}</div>`;
    } else {
      trendHtml = `<div class="market-trend">— ${ch}</div>`;
    }
    const dateStr = m.date ? `<div style="font-size:.6rem;color:var(--muted)">${m.date}</div>` : '';
    return `<div class="market-row">
      <div class="market-icon">${m.icon || '🌾'}</div>
      <div class="market-info">
        <div class="market-crop">${m.crop}</div>
        <div class="market-exchange">${m.exchange}${dateStr}</div>
      </div>
      <div class="market-right">
        <div class="market-price">${m.price}</div>
        ${trendHtml}
      </div>
    </div>`;
  }).join('');
}

// ── Toast Notifications ──────────────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3500);
}
