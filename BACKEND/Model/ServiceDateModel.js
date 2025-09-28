const mongoose = require('mongoose');

const serviceDateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  vehicleType: {
    type: String,
    required: true,
  },
  vehicleModel: {
    type: String,
    required: true,
  },
  plateNumber: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  serviceDate: {
    type: String,
    required: true,
  },
  serviceTime: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  otpExpiry: {
    type: Date,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ServiceDate', serviceDateSchema);
