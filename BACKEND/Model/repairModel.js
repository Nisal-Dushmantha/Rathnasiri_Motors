const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const repairSchema = new Schema({

    Name: {
        type:String,
        required:true,
    },
    Phone: {
        type:Number,
        required:true,
    },
    VehicleNumber: {
        type:String,
        required:true,
    },
    VehicleType: {
        type:String,
        required:true,
    },
    Model: {
        type:String,
        required:true,
    },
    Details: {
        type:String,
        required:true,
    },
   
});

module.exports = mongoose.model(
    "repairModel",
    repairSchema

)