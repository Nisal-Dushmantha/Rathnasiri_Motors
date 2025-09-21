const express = require('express');
const router = express.Router();
const { createServiceDate, getAllServiceDates } = require('../controllers/ServiceDateController');

router.post('/serviceDates', createServiceDate);
router.get('/serviceDates', getAllServiceDates);

module.exports = router;
