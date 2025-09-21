const express = require("express");
const router = express.Router();

const OfferController = require("../controllers/OfferController");

router.get("/", OfferController.getAll);
router.post("/", OfferController.create);
router.put("/:id", OfferController.update);
router.delete("/:id", OfferController.remove);

module.exports = router;
