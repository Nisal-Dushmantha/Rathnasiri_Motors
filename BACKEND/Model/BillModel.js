const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BillSchema = new Schema({
  customerName: { type: String, required: true },
    vehicleNumber: { type: String, required: true },
    amount: { type: Number, required: true },
    serviceCharge: { type: Number, default: 150 },
    total: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["Cash", "Card"], required: true },
    insuranceRef: { type: String }, // optional
    cashier: { type: String }, // optional
  },
  { timestamps: true } // adds createdAt & updatedAt
);

module.exports = mongoose.model("Bill", BillSchema);
