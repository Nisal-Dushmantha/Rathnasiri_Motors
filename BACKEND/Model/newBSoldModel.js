const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const newBSchema = new Schema({
  type: {
    type: String, //datatype
    required: true, //validate
  },
  model: {
    type: String, //datatype
    required: true, //validate
  },
  last_price: {
    type: String, //datatype
    required: true, //validate
  },
  buyer_name: {
    type: String, //datatype
    required: true, //validate
  },
  contact_no: {
    type: String, //datatype
    required: true, //validate
  },
});

module.exports = mongoose.model("newBSoldModel", newBSchema);
