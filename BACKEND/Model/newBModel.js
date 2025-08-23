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
  price: {
    type: String, //datatype
    required: true, //validate
  },
  status: {
    type: String, //datatype
    required: true, //validate
  }
});

module.exports = mongoose.model(
  "newBModel", //file name
  newBSchema //function name
);
