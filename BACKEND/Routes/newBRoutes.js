const express = require("express");
const router = express.Router();

//Insert Model
const newB = require("../Model/newBModel");

//Insert newB Controller
const newBController = require("../Controllers/newBController");

router.get("/",newBController.getAllnewB);
router.post("/",newBController.addnewB);
router.get("/:id",newBController.getByID);
router.put("/:id",newBController.updatenewB);
router.delete("/:id",newBController.deletenewB);

//export
module.exports = router;


