const express = require("express");
const router = express.Router();


//Insert spare parts Controller
const SparePartBillController = require("../controllers/SparePartBillController");

router.get("/", SparePartBillController.getAllSparePartsBill);
router.post("/",SparePartBillController.addSparePartsBill);
router.get("/:id",SparePartBillController.getById);




//export
module.exports = router;

