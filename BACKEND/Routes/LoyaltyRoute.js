const express = require("express");
const router = express.Router();

const LoyaltyController = require("../controllers/LoyaltyController");

router.get("/", LoyaltyController.getAll);
router.get("/top-members", LoyaltyController.topMembers);
router.post("/", LoyaltyController.create);
router.put("/:id", LoyaltyController.update);
router.delete("/:id", LoyaltyController.remove);

module.exports = router;


