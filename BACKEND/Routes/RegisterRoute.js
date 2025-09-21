const express = require('express');
const router = express.Router();

//import model
const register = require('../Model/RegisterModel');
//import controller
const registerController = require('../controllers/RegisterController');
//routes
router.get('/', registerController.getAllregister);
router.post('/', registerController.addRegister);
router.get('/:id', registerController.getById);

// Login endpoint
router.post('/login', async (req, res) => {
  const { Email, Password } = req.body;
  try {
    const user = await register.findOne({ Email, Password });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.status(200).json({ message: 'Login successful', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

//export
module.exports = router;