const express = require("express");
const router = express.Router();
//Insert Model
const Insurance = require("../Model/InsuranceModel");
//Insert Insurance Controller
const InsuranceController = require("../controllers/InsuranceController");


router.get("/",InsuranceController.getAllInsurances);
router.post("/",InsuranceController.addInsurance);

//export
module.exports = router;
