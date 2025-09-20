const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sbSchema = new Schema({
  bill_no: {
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

  quantity: {
    type: Number, //datatype
    required: true, //validate
  },

  price: {
    type: String, //datatype
    required: true, //validate
  },
});

module.exports = mongoose.model(
  "SparePartBillModel", //file name
  sbSchema //function name
);
