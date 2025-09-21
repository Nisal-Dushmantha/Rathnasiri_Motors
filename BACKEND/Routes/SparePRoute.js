const express = require("express");
const router = express.Router();
//Insert Model
const SpareP = require("../Model/SparePartBillModel");

//Insert spare parts Controller
const SparePControler = require("../controllers/SparePControler");

router.get("/", SparePControler.getAllSpareParts);
router.get("/low-stock", SparePControler.getLowStock);
router.post("/",SparePControler.addSpareParts);
router.get("/:id",SparePControler.getById);
router.put("/:id",SparePControler.updateSpareParts);
router.delete("/:id",SparePControler.deleteSpareParts);



//export
module.exports = router;