const express = require("express");
const router = express.Router();


const CustomerController = require("../controllers/CustomerController");
const { validateCustomerPayload } = require("../middleware/userValidation");

router.get("/", CustomerController.getAll);
router.post("/", validateCustomerPayload, CustomerController.create);
router.put("/:id", validateCustomerPayload, CustomerController.update);
router.delete("/:id", CustomerController.remove);

module.exports = router;


