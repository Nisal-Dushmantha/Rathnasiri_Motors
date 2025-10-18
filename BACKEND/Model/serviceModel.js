const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const serviceSchema = new Schema({

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
    KiloMeters: {
        type:Number,
        required:true,
    },
    LastServiceDate: {
        type:Date,
        required:true,
    },
    Requests: {
        type:String,
        required:true,
    },
    JobCreatedDate: {
        type: Date,
        default: Date.now,
    },
   
});

module.exports = mongoose.model(
    "serviceModel",
    serviceSchema

)