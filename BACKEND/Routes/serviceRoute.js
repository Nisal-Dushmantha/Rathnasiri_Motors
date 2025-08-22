const express = require("express");
const router = express.Router();

//insert model 
const service = require("../Model/serviceModel");
//insert controller
const serviceController = require("../controllers/serviceController");

router.get("/", serviceController.getAllservice);
router.post("/", serviceController.addServices);
router.get("/:id", serviceController.getById);
router.put("/:id", serviceController.updateService);
router.delete("/:id", serviceController.deleteService);

//export
module.exports = router;