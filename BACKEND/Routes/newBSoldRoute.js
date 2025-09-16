const express = require("express");
const router = express.Router();
const path = require("path");

//Insert Model
const newB = require("../Model/newBSoldModel");

//Insert newB Controller
const newBSoldController = require("../controllers/newBSoldController");



router.get("/",newBSoldController.getAllnewBH);
router.post("/", newBSoldController.addnewBH);
router.get("/:id",newBSoldController.getByID);
router.put("/:id", newBSoldController.updatenewBH);
router.delete("/:id",newBSoldController.deletenewBH);

module.exports = router;
