const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const repairSchema = new Schema({

    Name: {
        type:String,
        required:true,
    },
    Phone: {
        type:String,
        required:true,
        trim: true,
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
    JobCreatedDate: {
        type: Date,
        default: Date.now,
    },
   
});

module.exports = mongoose.model(
    "repairModel",
    repairSchema

)