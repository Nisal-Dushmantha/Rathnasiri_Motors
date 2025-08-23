const express = require("express");
const router = express.Router();
const newBController = require("../controllers/newBController");
const multer = require("multer");
const path = require("path");

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// Routes
router.get("/", newBController.getAllnewB);
router.post("/", upload.single("image"), newBController.addnewB);
router.get("/:id", newBController.getByID);
router.put("/:id", upload.single("image"), newBController.updatenewB);
router.delete("/:id", newBController.deletenewB);

module.exports = router;
