const express = require("express");
const router = express.Router();

const CustomerController = require("../controllers/CustomerController");

router.get("/", CustomerController.getAll);
router.post("/", CustomerController.create);
router.put("/:id", CustomerController.update);
router.delete("/:id", CustomerController.remove);

module.exports = router;


