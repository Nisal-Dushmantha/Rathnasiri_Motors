const express = require("express");
const router = express.Router();

// Import controller
const ServiceRepairBillController = require("../controllers/ServiceRepairBillController");

// Define routes
router.get("/", ServiceRepairBillController.getAllServiceRepairBills);
router.post("/", ServiceRepairBillController.addServiceRepairBill);
router.get("/:id", ServiceRepairBillController.getBillById);
router.put("/:id", ServiceRepairBillController.updateBill);
router.delete("/:id", ServiceRepairBillController.deleteBill);

// Export router
module.exports = router;
