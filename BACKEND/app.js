//password = It23557574
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const servicerouter = require("../BACKEND/Routes/serviceRoute");
const repairrouter = require("../BACKEND/Routes/repairRoute");
const router = require("./Routes/UserRoute");
const sprouter = require("./Routes/SparePRoute");
const newBrouter = require("./Routes/newBRoutes");
const usedBrouter = require("./Routes/usedBRoutes");
const newBsoldHrouter = require("./Routes/newBSoldRoute");
const Inrouter = require("./Routes/InsuranceRoute");
const BSrouter = require("./Routes//BikeSalesReportRoute");
const spbrouter = require("./Routes/SparePartBillRoutes");


const app = express();
const cors = require("cors");

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

//Middleware

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use("/services", servicerouter);
app.use("/repairs", repairrouter);
app.use("/users",router);
app.use("/sp",sprouter);
app.use("/newBs",newBrouter);
app.use("/usedBs",usedBrouter);
app.use("/newBsH",newBsoldHrouter);
app.use("/insurances",Inrouter);
app.use("/spb",spbrouter);
app.use("/bikeSalesReports",BSrouter);



mongoose
  .connect("mongodb+srv://lawanyanisal:It23557574@itp.hpgudhh.mongodb.net")
  .then(() => console.log("connected to MongoDB"))
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => console.log(err));