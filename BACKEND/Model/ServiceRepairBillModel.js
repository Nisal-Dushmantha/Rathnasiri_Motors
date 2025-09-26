const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const serviceLineSchema = new Schema(
  {
    detail: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const serviceRepairBillSchema = new Schema({
  bill_no: {
    type: String,
    required: true,
  },
  
  customerName: {
    type: String,
    required: true,
  },
  
  type: {
    type: String,
    enum: ['service', 'repair'],
    required: true,
    default: 'service'
  },
  
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  
  services: {
    type: [serviceLineSchema],
    required: true,
    default: [],
  },
  
  total: {
    type: Number,
    required: true,
  },
  
  // Optional notes field
  notes: {
    type: String,
    required: false,
  }
});

module.exports = mongoose.model(
  "ServiceRepairBillModel",
  serviceRepairBillSchema
);
