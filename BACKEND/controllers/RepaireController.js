const repair = require("../Model/repairModel");

//data display
const getAllRepairs = async (req, res, next) => {
  let repairs;
  //Get all repairs
  try {
    repairs = await repair.find();
  } catch (err) {
    console.log(err);
  }

  //not found
  if (!repairs) {
    return res.status(404).json({ message: "User Not found" });
  }

  //display all repairs
  return res.status(200).json({ repairs });
};

//data insert

const addRepairs = async (req, res, next) => {
  const { Name, Phone, VehicleNumber, VehicleType, Model, Details } = req.body;

  let repairs;

  try {
    repairs = new repair({
      Name,
      Phone,
      VehicleNumber,
      VehicleType,
      Model,
      Details,
    });
    await repairs.save();
  } catch (err) {
    console.log(err);
  }
  //If insert not working
  if (!repairs) {
    return res.status(404).send({ message: "Unable to add repair Details" });
  }
  return res.status(200).json({ repairs });
};

//Get by ID
const getById = async (req, res, next) => {
  const id = req.params.id;

  let repairs;

  try {
    repairs = await repair.findById(id);
  } catch (err) {
    console.log(err);
  }
  //If ID not available
  if (!repairs) {
    return res.status(404).send({ message: "Vehicle ID not found" });
  }
  return res.status(200).json({ repairs });
};

//updating details
const updateRepairs = async (req, res, next) => {
  const id = req.params.id;
  const { Name, Phone, VehicleNumber, VehicleType, Model, Details } = req.body;

  let repairs;

  try {
    repairs = await repair.findByIdAndUpdate(id, {
      Name: Name,
      Phone: Phone,
      VehicleNumber: VehicleNumber,
      VehicleType: VehicleType,
      Model: Model,
      Details: Details,
    });
    repairs = await repairs.save();
  } catch (err) {
    console.log(err);
  }
  //IF not updated
  if (!repairs) {
    return res.status(404).send({ message: "did not update" });
  }
  return res.status(200).json({ repairs });
};

//Delete
const deleteRepairs = async (req, res, next) => {
  const id = req.params.id;

  let repairs;

  try {
    repairs = await repair.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
  }
  //IF not deleted
  if (!repairs) {
    return res.status(404).send({ message: "Unable to delete" });
  }
  return res.status(200).json({ repairs });
};

// Get total count of repairs
const getRepairCount = async (req, res) => {
  try {
    const count = await repair.countDocuments();
    return res.status(200).json({ count });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error fetching repair count" });
  }
};

//exports
exports.getById = getById;
exports.getAllRepairs = getAllRepairs;
exports.addRepairs = addRepairs;
exports.updateRepairs = updateRepairs;
exports.deleteRepairs = deleteRepairs;
exports.getRepairCount = getRepairCount;
