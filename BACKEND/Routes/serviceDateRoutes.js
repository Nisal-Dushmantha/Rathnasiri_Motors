const express = require('express');
const router = express.Router();
const { 
  createServiceDate, 
  getAllServiceDates,
  initiateBooking,
  verifyOTP,
  resendOTP,
  acceptBooking
} = require('../controllers/ServiceDateController');

// Legacy routes (keep for backward compatibility)
router.post('/serviceDates', createServiceDate);
router.get('/serviceDates', getAllServiceDates);

// New OTP-enabled routes
router.post('/serviceDates/initiate', initiateBooking);
router.post('/serviceDates/verify', verifyOTP);
router.post('/serviceDates/resend', resendOTP);

// Admin accept route
router.post('/serviceDates/:id/accept', acceptBooking);

module.exports = router;
