const express = require("express");
const { createBill, getBills ,deleteBill } = require("../controllers/BillController"); // ✅ correct path

const router = express.Router();

router.post("/create", createBill);
router.get("/", getBills);
router.delete("/:id", deleteBill);


module.exports = router;
