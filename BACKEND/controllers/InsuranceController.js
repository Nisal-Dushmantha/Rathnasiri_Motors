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

// Count all insurances up to today
const getTotalInsurances = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const total = await Insurance.countDocuments({
      StartDate: { $lte: today }
    });

    res.status(200).json({ total });
  } catch (err) {
    console.error("Error counting insurances:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const sendExpiryReminders = async (req, res) => {
  try {
    // Find tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get only the date part
    const startOfDay = new Date(tomorrow.setHours(0, 0, 0, 0));
    const endOfDay = new Date(tomorrow.setHours(23, 59, 59, 999));

    // Find insurances expiring tomorrow
    const expiringInsurances = await Insurance.find({
      EndDate: { $gte: startOfDay, $lte: endOfDay }
    });

    if (expiringInsurances.length === 0) {
      return res.status(200).json({ message: "No insurances expiring tomorrow." });
    }

    // Loop through and send SMS
    for (const insurance of expiringInsurances) {
      const message = `Dear ${insurance.fullname}, your insurance for vehicle ${insurance.RegistrationNo} will expire on ${insurance.EndDate.toDateString()}. Please renew before expiry.`;

      await client.messages.create({
        body: message,
        from: twilioPhone,
        to: insurance.ContactNo // must be in E.164 format, e.g. +94712345678
      });
    }

    return res.status(200).json({ 
      message: "Reminder SMS sent.", 
      count: expiringInsurances.length 
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error sending reminder SMS" });
  }
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
exports.getTotalInsurances = getTotalInsurances;
exports.sendExpiryReminders = sendExpiryReminders;
exports.addInsurance = addInsurance;
exports.getById =getById;
exports.updateInsurance = updateInsurance;
exports.deleteInsurance = deleteInsurance;
exports.getTotalInsurances = getTotalInsurances;
exports.sendExpiryReminders = sendExpiryReminders;

