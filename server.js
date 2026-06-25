const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.json({
    name: "SolarGrid Virtual Inverter API",
    status: "online"
  });
});

app.get("/realtime", (req, res) => {
  const hour = new Date().getHours();

  let power = 0;

  if (hour >= 6 && hour <= 19) {
    power = Math.sin(((hour - 6) / 13) * Math.PI) * 10;
  }

  res.json({
    status: "Online",
    power: Number(power.toFixed(2)),
    todayEnergy: Number((power * 5).toFixed(1)),
    totalEnergy: 15482,
    voltage: 229,
    temperature: 41
  });
});

app.get("/plant", (req, res) => {
  res.json({
    plantId: "SG-1001",
    plantName: "SolarGrid Demo Plant",
    capacity: "10kW",
    location: "Uzbekistan"
  });
});

app.listen(3000, () => {
  console.log("API running on port 3000");
});