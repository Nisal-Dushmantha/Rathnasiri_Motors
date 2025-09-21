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
  color: {
    type: String, //datatype
    required: true, //validate
  },
  quantity: {
    type: String, //datatype
    required: true, //validate
  },
  price: {
    type: String, //datatype
    required: true, //validate
  },
  offers: {
    type: String, //datatype
    required: true, //validate
  },
  status: {
    type: String, //datatype
    required: true, //validate
  },
  image: {
    type: String, //datatype for image URL/path
    required: false, //optional field
  }
});

module.exports = mongoose.model("newBModel", newBSchema);
