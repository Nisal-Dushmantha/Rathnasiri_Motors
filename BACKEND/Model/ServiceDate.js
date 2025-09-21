const mongoose = require('mongoose');

const serviceDateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  vehicleType: { type: String, required: true },
  vehicleModel: { type: String, required: true },
  plateNumber: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  serviceDate: { type: Date, required: true },
  serviceTime: { type: String, required: true },
});

module.exports = mongoose.model('ServiceDate', serviceDateSchema);
