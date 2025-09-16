const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

//Insert Model
const newB = require("../Model/newBModel");

//Insert newB Controller
const newBController = require("../controllers/newBController");

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.get("/",newBController.getAllnewB);
router.get("/count", newBController.getNewBikesCount);
router.post("/", upload.single('image'), newBController.addnewB);
router.get("/:id",newBController.getByID);
router.put("/:id", upload.single('image'), newBController.updatenewB);
router.delete("/:id",newBController.deletenewB);

module.exports = router;
