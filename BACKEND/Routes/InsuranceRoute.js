const express = require("express");
const router = express.Router();
//Insert Model
const Insurance = require("../Model/InsuranceModel");
//Insert Insurance Controller
const InsuranceController = require("../controllers/InsuranceController");


router.get("/",InsuranceController.getAllInsurances);
router.post("/",InsuranceController.addInsurance);
router.get("/:id",InsuranceController.getById);
router.put("/:id",InsuranceController.updateInsurance);
router.delete("/:id",InsuranceController.deleteInsurance);





//export
module.exports = router;
module.exports = router;