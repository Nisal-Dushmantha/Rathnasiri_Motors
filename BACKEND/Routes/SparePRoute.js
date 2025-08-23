const express = require("express");
const router = express.Router();
//Insert Model
const SpareP = require("../Model/SparePModel");

//Insert User Controller
const SparePControler = require("../controllers/SparePControler");

router.get("/", SparePControler.getAllSpareParts);
router.post("/",SparePControler.addSpareParts);
router.get("/:id",SparePControler.getById);
router.put("/:id",SparePControler.updateSpareParts);
router.delete("/:id",SparePControler.deleteSpareParts);



//export
module.exports = router;
