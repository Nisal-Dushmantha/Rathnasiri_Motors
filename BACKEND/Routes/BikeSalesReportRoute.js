const express = require("express");
const router = express.Router();

//insert model
const Breport = require("../Model/BikeSalesReportModel");
//insert controller
const BikeSalesReportController = require("../controllers/BikeSalesReportController");

router.get("/", BikeSalesReportController.getAllBikeSalesReports);
router.post("/", BikeSalesReportController.addReports);
router.get("/:id", BikeSalesReportController.getByID);
router.put("/:id", BikeSalesReportController.updateReport);
router.delete("/:id", BikeSalesReportController.deleteReport);

//export
module.exports = router;