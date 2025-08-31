const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InsuranceSchema = new Schema({
    fullname:{
        type:String,//datatype
        required:true,//validate
    },
    Address:{
        type:String,
        required:true,
    },
    ContactNo:{
        type:String,
        required:true,
    },
    RegistrationNo:{
        type:String,
        required:true,
    },
    VehicleType:{
        type:String,
        required:true,
    },
    VehicleModel:{
        type:String,
        required:true,
    },
    EngineNo:{
        type:String,
        required:true,
    },
    ChassisNo:{
        type:String,
        required:true,
    },
    StartDate:{
        type:Date,
        required:true,
    },
    EndDate:{
        type:Date,
        required:true,
    }

});
module.exports = mongoose.model(
    "InsuranceModel",//filename
    InsuranceSchema //function name
)