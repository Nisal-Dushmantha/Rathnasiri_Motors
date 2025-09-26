const express = require("express");
const { createBill, getBills } = require("../controllers/BillController"); // ✅ correct path

const router = express.Router();

router.post("/create", createBill);
router.get("/", getBills);

module.exports = router;
