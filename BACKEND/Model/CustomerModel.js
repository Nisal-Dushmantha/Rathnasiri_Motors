const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const customerSchema = new Schema(
  {
    customerId: { type: String, required: true, trim: true },
    customerName: { type: String, required: true, trim: true },
    contactNumber: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", customerSchema);


