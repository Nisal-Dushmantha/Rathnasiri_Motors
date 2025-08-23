const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const newBSchema = new Schema({
  type: { type: String, required: true },
  model: { type: String, required: true },
  color: { type: String, required: true },
  price: { type: String, required: true },
  status: { type: String, required: true },
  imageFilename: { type: String }, // stores uploaded image filename
});

module.exports = mongoose.model("newBModel", newBSchema);
