const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const loyaltySchema = new Schema(
  {
    customerId: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    interaction: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    points: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Loyalty", loyaltySchema);


