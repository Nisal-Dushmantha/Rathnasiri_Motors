const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const spSchema = new Schema({
  barcode: {
    type: String, //datatype
    required: true, //validate
  },

  name: {
    type: String, //datatype
    required: true, //validate
  },

  brand: {
    type: String, //datatype
    required: true, //validate
  },

  rack: {
    type: String, //datatype
    required: true, //validate
  },

  Quentity: {
    type: Number, //datatype
    required: true, //validate
  },

  price: {
    type: String, //datatype
    required: true, //validate
  },
});

module.exports = mongoose.model(
  "SparePModel", //file name
  spSchema //function name
);
