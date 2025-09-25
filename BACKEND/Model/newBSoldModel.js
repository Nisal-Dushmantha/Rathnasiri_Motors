const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const newBSchema = new Schema({
  type: { type: String, required: true },
  model: { type: String, required: true },
  last_price: { type: String, required: true },
  buyer_name: { type: String, required: true },
  contact_no: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now }
});

module.exports = mongoose.model("newBSoldModel", newBSchema);
