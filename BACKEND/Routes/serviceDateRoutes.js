const express = require('express');
const router = express.Router();
<<<<<<< HEAD
const { createServiceDate, getAllServiceDates } = require('../controllers/ServiceDateController');

router.post('/serviceDates', createServiceDate);
router.get('/serviceDates', getAllServiceDates);

=======
const { 
  createServiceDate, 
  getAllServiceDates,
  initiateBooking,
  verifyOTP,
  resendOTP
} = require('../controllers/ServiceDateController');

// Legacy routes (keep for backward compatibility)
router.post('/serviceDates', createServiceDate);
router.get('/serviceDates', getAllServiceDates);

// New OTP-enabled routes
router.post('/serviceDates/initiate', initiateBooking);
router.post('/serviceDates/verify', verifyOTP);
router.post('/serviceDates/resend', resendOTP);

>>>>>>> ce7305f4aa4e32727fdc25233ec8a9ba3255e93e
module.exports = router;
