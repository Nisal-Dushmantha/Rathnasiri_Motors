const express = require("express");
const router = express.Router();

//insert model 
const service = require("../Model/serviceModel");
const repair = require("../Model/repairModel");
//insert controller
const serviceController = require("../controllers/serviceController");
const RepairController = require("../controllers/RepaireController");

router.get("/", RepairController.getAllRepairs);
router.post("/", RepairController.addRepairs);
router.get("/:id", RepairController.getById);
router.put("/:id", RepairController.updateRepairs);
router.delete("/:id", RepairController.deleteRepairs);

//export
module.exports = router;