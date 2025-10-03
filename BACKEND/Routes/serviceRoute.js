const express = require("express");
const router = express.Router();

//insert model 
const service = require("../Model/serviceModel");
//insert controller
const serviceController = require("../controllers/serviceController");
// Import validation middleware
const { validateService, validateResult } = require("../middleware/validationMiddleware");

router.get("/", serviceController.getAllservice);
router.get("/count", serviceController.getServiceCount);
router.post("/", validateService, validateResult, serviceController.addServices);
router.get("/:id", serviceController.getById);
router.put("/:id", validateService, validateResult, serviceController.updateService);
router.delete("/:id", serviceController.deleteService);

//export
module.exports = router;