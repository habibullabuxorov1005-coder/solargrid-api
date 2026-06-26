const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let stationConfig = {
  name: "SolarGrid Demo Plant",
  api_type: "growatt",
  rows: 6,
  panelsPerRow: 8,
  capacity_kw: 24,
  growatt: {
    username: "admin",
    password: "123456",
    plant_id: "SG-1001"
  }
};

app.get("/", (req, res) => {
  res.json({
    success: true,
    api: "SolarGrid Virtual Inverter",
    status: "online"
  });
});

app.post("/api/station/test-connection", (req, res) => {

  return res.json({
    success: true,
    message: "Growatt ga muvaffaqiyatli ulandi",
    source: "virtual-growatt"
  });

});

app.post("/api/station/config", (req, res) => {

  stationConfig = {
    ...stationConfig,
    ...req.body
  };

  res.json({
    success: true,
    message: "Config saqlandi"
  });

});

function generateDashboard() {

  const hour = new Date().getHours();

  let power = 0;

  if (hour >= 6 && hour <= 19) {
    power = Math.sin(((hour - 6) / 13) * Math.PI) * stationConfig.capacity_kw;
  }

  power = Number(power.toFixed(2));

  const panels = [];

  let normal = 0;
  let problem = 0;

  for (let r = 0; r < stationConfig.rows; r++) {

    for (let c = 0; c < stationConfig.panelsPerRow; c++) {

      let status = "normal";

      if (Math.random() < 0.03) status = "dirty";
      if (Math.random() < 0.01) status = "fault";

      if (status === "normal") normal++;
      else problem++;

      panels.push({
        id: `${String.fromCharCode(65 + r)}${c + 1}`,
        row: String.fromCharCode(65 + r),
        col: c + 1,
        power_w: Math.round((power * 1000) / (stationConfig.rows * stationConfig.panelsPerRow)),
        voltage: 229,
        current: 5.2,
        temperature: 38,
        efficiency: 96,
        status,
        issue: status === "dirty"
          ? "Changlangan"
          : status === "fault"
          ? "Nosoz"
          : null
      });

    }

  }

  return {

    success: true,

    station: {
      name: stationConfig.name
    },

    summary: {
      total_power_kw: power,
      capacity_kw: stationConfig.capacity_kw,
      efficiency_pct: Math.round((power / stationConfig.capacity_kw) * 100),
      total_panels: panels.length,
      normal_panels: normal,
      problem_panels: problem,
      alerts_count: problem,
      today_kwh: Number((power * 5).toFixed(1))
    },

    panels,

    weather: {
      temp: 34,
      description: "Quyoshli",
      clouds: 10,
      wind_speed: 3,
      solar_radiation: 850,
      uv_index: 8,
      icon: "01d",
      is_day: true,
      sunrise: "05:10",
      sunset: "19:48",
      forecast: [
        { day: "Ertaga", temp: 35, production_estimate: 96 },
        { day: "Indin", temp: 33, production_estimate: 90 },
        { day: "3-kun", temp: 30, production_estimate: 74 }
      ]
    },

    alerts: panels
      .filter(p => p.status !== "normal")
      .map(p => ({
        severity: p.status === "fault" ? "critical" : "warning",
        type: p.status,
        title: `Panel ${p.id}`,
        description: p.issue,
        action: "Tekshirish"
      }))

  };

}

app.get("/api/dashboard", (req, res) => {

  res.json(generateDashboard());

});

// Realtime API
app.get("/realtime", (req, res) => {

  const dashboard = generateDashboard();

  res.json({
    status: "Online",
    power: dashboard.summary.total_power_kw,
    todayEnergy: dashboard.summary.today_kwh,
    totalEnergy: 15482 + Math.floor(Math.random() * 300),
    voltage: 229,
    temperature: 38,
    frequency: 50,
    inverter: "SolarGrid Virtual",
    plantId: stationConfig.growatt.plant_id
  });

});

// Plant API
app.get("/plant", (req, res) => {

  res.json({
    plantId: stationConfig.growatt.plant_id,
    plantName: stationConfig.name,
    capacity: stationConfig.capacity_kw + "kW",
    location: "Uzbekistan"
  });

});

// Login API
app.post("/login", (req, res) => {

  const { username, password, plantId } = req.body;

  if (
    username === stationConfig.growatt.username &&
    password === stationConfig.growatt.password &&
    plantId === stationConfig.growatt.plant_id
  ) {

    return res.json({
      success: true,
      token: "SOLARGRID-DEMO-TOKEN"
    });

  }

  return res.status(401).json({
    success: false,
    message: "Login xato"
  });

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("SolarGrid Virtual API running on port " + PORT);
});
