const express = require('express');
const router = express.Router();
const { 
  createServiceDate, 
  getAllServiceDates,
  initiateBooking,
  verifyOTP,
  resendOTP,
  acceptBooking,
  deleteBooking
} = require('../controllers/serviceDateController');

// Legacy routes (keep for backward compatibility)
router.post('/serviceDates', createServiceDate);
router.get('/serviceDates', getAllServiceDates);

// New OTP-enabled routes
router.post('/serviceDates/initiate', initiateBooking);
router.post('/serviceDates/verify', verifyOTP);
router.post('/serviceDates/resend', resendOTP);

// Admin actions
router.post('/serviceDates/:id/accept', acceptBooking);
router.delete('/serviceDates/:id', deleteBooking);

module.exports = router;
