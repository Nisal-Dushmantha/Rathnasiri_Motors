const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BRSchema = new Schema({

    name : {
        type: String,//data type
        required: true,//validate
    },

    license_no : {
        type: String,//data type
        required: true,//validate
    },

    NIC : {
        type: String,//data type
        required: true,//validate
    },

    address : {
        type: String,//data type
        required: true,//validate
    },

    contact_no : {
        type: String,//data type
        required: true,//validate
    },

    bike_model : {
        type: String,//data type
        required: true,//validate
    },

    color : {
        type: String,//data type
        required: true,//validate
    },

    chassis_no : {
        type: String,//data type
        required: true,//validate
    },

    reg_year : {
        type: String,//data type
        required: true,//validate
    },

    last_price : {
        type: String,//data type
        required: true,//validate
    }
});

module.exports = mongoose.model("BikeSalesReportModel", BRSchema);




