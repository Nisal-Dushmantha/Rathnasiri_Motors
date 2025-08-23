const express = require("express");
const mongoose = require("mongoose");
const servicerouter = require("../BACKEND/Routes/serviceRoute");
const repairRouter = require("../BACKEND/Routes/repairRoute");
const router = require("./Routes/UserRoute");
const newBrouter = require("./Routes/newBRoutes");
const sprouter = require("./Routes/SparePRoute");
const cors = require("cors");
const path = require("path");


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/services", servicerouter);
app.use("/repairs", repairRouter);
app.use("/users", router);
app.use("/newBs", newBrouter);
app.use("/sp",sprouter )

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://lawanyanisal:It23557574@itp.hpgudhh.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
