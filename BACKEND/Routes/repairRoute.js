const express = require("express");
const router = express.Router();

//insert model 
const service = require("../Model/serviceModel");
const repair = require("../Model/repairModel");
//insert controller
const serviceController = require("../controllers/serviceController");
const RepairController = require("../controllers/RepaireController");
// Import validation middleware
const { validateRepair, validateResult } = require("../middleware/validationMiddleware");

router.get("/", RepairController.getAllRepairs);
router.get("/count", RepairController.getRepairCount);
router.post("/", validateRepair, validateResult, RepairController.addRepairs);
router.get("/:id", RepairController.getById);
router.put("/:id", validateRepair, validateResult, RepairController.updateRepairs);
router.delete("/:id", RepairController.deleteRepairs);

//export
module.exports = router;