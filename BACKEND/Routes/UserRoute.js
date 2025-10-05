const express = require("express");
const router = express.Router();

//Insert Model
const User = require("../Model/UserModel");
//insert user controller
const UserController = require("../Controllers/UserController");
const { validateUserPayload } = require("../middleware/userValidation");

router.get("/",UserController.getAllUsers);
// Create user with validation
router.post("/", validateUserPayload, UserController.addUsers);
router.get("/:id",UserController.getById);
// Update user with validation
router.put("/:id", validateUserPayload, UserController.updateUser);
router.delete("/:id",UserController.deleteUser);

//export
module.exports = router;