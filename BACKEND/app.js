//password = It23557574
const express = require("express");
const mongoose = require("mongoose");
const servicerouter = require("../BACKEND/Routes/serviceRoute");
const repairrouter = require("../BACKEND/Routes/repairRoute");
const router = require("./Routes/UserRoute");
const sprouter = require("./Routes/SparePRoute");
const newBrouter = require("./Routes/newBRoutes");

const app = express();
const cors = require("cors");

//Middleware

app.use(express.json());
app.use(cors());
app.use("/services", servicerouter);
app.use("/repairs", repairrouter);
app.use("/users",router);
app.use("/sp",sprouter);
app.use("/newBs",newBrouter)

mongoose
  .connect("mongodb+srv://lawanyanisal:It23557574@itp.hpgudhh.mongodb.net")
  .then(() => console.log("connected to MongoDB"))
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => console.log(err));

