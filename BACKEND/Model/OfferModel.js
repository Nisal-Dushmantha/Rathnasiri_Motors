const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const offerSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Expired"],
      default: "Active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Offer", offerSchema);
