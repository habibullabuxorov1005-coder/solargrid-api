const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Virtual inverter
const inverter = {
  username: "admin",
  password: "123456",
  plantId: "SG-1001",
  plantName: "SolarGrid Demo Plant",
  capacity: "10kW",
  location: "Uzbekistan"
};

// API info
app.get("/", (req, res) => {
  res.json({
    name: "SolarGrid Virtual Inverter API",
    status: "online"
  });
});

// Login
app.post("/login", (req, res) => {

  const { username, password, plantId } = req.body;

  if (
    username === inverter.username &&
    password === inverter.password &&
    plantId === inverter.plantId
  ) {

    return res.json({
      success: true,
      message: "Login successful",
      token: "SOLARGRID-DEMO-TOKEN"
    });

  }

  res.status(401).json({
    success: false,
    message: "Username, Password yoki Plant ID noto'g'ri"
  });

});

// Plant
app.get("/plant", (req, res) => {

  res.json({
    plantId: inverter.plantId,
    plantName: inverter.plantName,
    capacity: inverter.capacity,
    location: inverter.location
  });

});

// Realtime
app.get("/realtime", (req, res) => {

  const hour = new Date().getHours();

  let power = 0;

  if(hour>=6 && hour<=19){
      power = Math.sin(((hour-6)/13)*Math.PI)*10;
  }

  power = Number(power.toFixed(2));

  res.json({

      status:"Online",

      power,

      todayEnergy:Number((power*5).toFixed(1)),

      totalEnergy:15482+Math.floor(Math.random()*300),

      voltage:220+Math.floor(Math.random()*10),

      temperature:35+Math.floor(Math.random()*10),

      frequency:50,

      inverter:"SolarGrid Virtual",

      plantId:inverter.plantId

  });

});

app.listen(process.env.PORT || 3000, () => {
  console.log("API running");
});
