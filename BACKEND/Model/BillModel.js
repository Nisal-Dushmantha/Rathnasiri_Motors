const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BillSchema = new Schema({
  amount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ["Cash", "Card"], required: true },
  insuranceRef: { type: String }, // optional reference (policy number / reg no)
  createdAt: { type: Date, default: Date.now },
  cashier: { type: String }, // optional
});

module.exports = mongoose.model("Bill", BillSchema);
