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

        const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(ContactNo)) {
    return res
      .status(400)
      .json({ message: "Invalid Contact Number. Must be 10 digits." });
  }
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

//Get by Id
const getById = async (req,res,next) => {

    const id = req.params.id;
    let insurances;
    try{
        insurances = await Insurance.findById(id);
    }catch (err){
        console.log(err);
    }

    if(!insurances){
        return res.status(404).send({message:"Insurance not found"});
    }
    return res.status(200).json({insurances});
};

//update user details
const updateInsurance = async (req,res,next) => {

    const id = req.params.id;
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

        const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(ContactNo)) {
    return res
      .status(400)
      .json({ message: "Invalid Contact Number. Must be 10 digits." });
  }

        let insurances;
        try{
            insurances = await Insurance.findByIdAndUpdate(id,
                {fullname : fullname,
                 Address  : Address,
                 ContactNo: ContactNo,
                 RegistrationNo : RegistrationNo,
                 VehicleType : VehicleType,
                 VehicleModel : VehicleModel,
                 EngineNo : EngineNo,
                 ChassisNo : ChassisNo,
                 StartDate :StartDate ,
                 EndDate : EndDate    } );
                 insurances = await insurances.save();
        }catch (err){
            console.log(err);
        }

        if(!insurances){
        return res.status(404).send({message:"Insurance not updated"});
         }
    return res.status(200).json({insurances});

};

//Deleter insurance details
const deleteInsurance = async (req,res,next) => {
    const id = req.params.id;
    let insurances;
    try{
        insurances = await Insurance.findByIdAndDelete(id);
    }catch (err){
        console.log(err);
    }
    if(!insurances){
        return res.status(404).send({message:"Unable to delete insurance details"});
    }
    return res.status(200).json({insurances});

};



exports.getAllInsurances = getAllInsurances;
exports.addInsurance = addInsurance;
exports.getById =getById;
//exports.updateInsurance = updateInsurance;
//exports.deleteInsurance = deleteInsurance;
exports.addInsurance = addInsurance;
exports.getById =getById;
exports.updateInsurance = updateInsurance;
exports.deleteInsurance = deleteInsurance;
