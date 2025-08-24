const Insurance = require("../Model/InsuranceModel");

const getAllInsurances = async (req, res, next) => {

    let insurances;
    try{
        insurances = await Insurance.find();
    }catch (err){
        console.log(err);
    }
    //not found
    if(!insurances){
        return res.status(404).json({message:"Insurance not found"});
    }
    //display all insurances
    return res.status(200).json({insurances});
};

//insert data
const addInsurance = async (req,res,next) => {
    const {fullname,
        Address,
        ContactNo,
        RegistrationNo,
        VehicleType,
        VehicleModel,
        EngineNo,
        ChassisNo,
        StartDate,
        EndDate} = req.body;
    let insurances;
    try{
        insurances = new Insurance({
            fullname,
            Address,
            ContactNo,
            RegistrationNo,
            VehicleType,
            VehicleModel,
            EngineNo,
            ChassisNo,
            StartDate,
            EndDate});
            await insurances.save();
    }catch (err){
        console.log(err);
    }

    //not insert data
    if(!insurances){
        return res.status(404).send({message:"Unable to add details"});
    }
    return res.status(200).json({insurances});
};
exports.getAllInsurances = getAllInsurances;
exports.addInsurance = addInsurance;