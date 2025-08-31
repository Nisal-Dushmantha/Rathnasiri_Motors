const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// Insert Model
const usedB = require("../Model/usedBModel");

// Insert usedB Controller
const usedBController = require("../controllers/usedBController");

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

router.get("/", usedBController.getAllusedB);
router.post("/", upload.single('image'), usedBController.addusedB);
router.get("/:id", usedBController.getByID);
router.put("/:id", upload.single('image'), usedBController.updateusedB);
router.delete("/:id", usedBController.deleteusedB);

module.exports = router;
