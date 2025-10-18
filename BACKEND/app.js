require('dotenv').config();
require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");


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
const loyaltyRouter = require("./Routes/LoyaltyRoute");
const customerRouter = require("./Routes/CustomerRoute");
const offerRouter = require("./Routes/OfferRoute");
const serviceRepairBillRouter = require("./Routes/ServiceRepairBillRoute");
const jobStatsRouter = require("./Routes/JobStatisticsRoute");
const billRoutes = require("./Routes/BillRoutes");
const expenseRoutes =require("./Routes/expenseRoutes");

const registerRouter = require("./Routes/RegisterRoute");
const serviceDateRouter = require("./Routes/serviceDateRoutes"); // ✅ NEW

const app = express();

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Middleware
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use("/services", servicerouter);
app.use("/repairs", repairrouter);
app.use("/users", router);
app.use("/sp", sprouter);
app.use("/newBs", newBrouter);
app.use("/usedBs", usedBrouter);
app.use("/newBsH", newBsoldHrouter);
app.use("/insurances", Inrouter);
app.use("/register", registerRouter);
app.use("/api", serviceDateRouter); // ✅ NEW
app.use("/users",router);
app.use("/sp",sprouter);
app.use("/newBs",newBrouter);
app.use("/usedBs",usedBrouter);
app.use("/newBsH",newBsoldHrouter);
app.use("/insurances",Inrouter);
app.use("/spb",spbrouter);
app.use("/bikeSalesReports",BSrouter);
app.use("/api/bills", billRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/service-repair-bills", serviceRepairBillRouter);

app.use("/loyalty", loyaltyRouter);
app.use("/customers", customerRouter);
app.use("/offers", offerRouter);
app.use("/job-stats", jobStatsRouter);


mongoose
  .connect("mongodb+srv://lawanyanisal:It23557574@itp.hpgudhh.mongodb.net/")
  .then(() => console.log("connected to MongoDB"))
  .then(async () => {
    // After connecting, ensure there isn't an accidental unique index on loyalty.customerId
    // so the same customerId can appear in multiple loyalty records.
    try {
      const db = mongoose.connection.db;
      // collection name derived from model name 'Loyalty' -> 'loyalties'
      const coll = db.collection('loyalties');
      if (coll) {
        const indexes = await coll.indexes();
        const idx = indexes.find((i) => i.key && i.key.customerId === 1 && i.unique);
        if (idx) {
          await coll.dropIndex(idx.name);
          console.log(`Dropped unique index on loyalties.customerId (${idx.name}) to allow repeated customerId values`);
        }
      }
    } catch (err) {
      // Not fatal: just log and continue. If collection doesn't exist yet, indexes() will fail.
      console.warn('Index check/drop for loyalties.customerId skipped or failed:', err.message || err);
    }

    app.listen(5000);
  })
  .catch((err) => console.log(err));

