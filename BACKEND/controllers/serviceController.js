const service = require("../Model/serviceModel");

//data display
const getAllservice = async (req, res, next) => {
  let services;
  //Get all services
  try {
    services = await service.find();
  } catch (err) {
    console.log(err);
  }

  //not found
  if (!services) {
    return res.status(404).json({ message: "User Not found" });
  }

  //display all services
  return res.status(200).json({ services });
};

//data insert

const addServices = async (req, res, next) => {
  const {
    Name,
    Phone,
    VehicleNumber,
    VehicleType,
    Model,
    KiloMeters,
    LastServiceDate,
    Requests
  } = req.body;

  let services;

  try {
    services = new service({
      Name,
    Phone,
    VehicleNumber,
    VehicleType,
    Model,
    KiloMeters,
    LastServiceDate,
    Requests
    });
    await services.save();
  } catch (err) {
    console.log(err);
  }
  //If insert not working
  if (!services) {
    return res.status(404).send({ message: "Unable to add service Details" });
  }
  return res.status(200).json({ services });
};

//Get by ID
const getById = async (req, res, next) => {
  const id = req.params.id;

  let services;

  try {
    services = await service.findById(id);
  } catch (err) {
    console.log(err);
  }
  //If ID not available
  if (!services) {
    return res.status(404).send({ message: "Vehicle ID not found" });
  }
  return res.status(200).json({ services });
};

//updating details
const updateService = async (req, res, next) => {
  const id = req.params.id;
  const { Name,
    Phone,
    VehicleNumber,
    VehicleType,
    Model,
    KiloMeters,
    LastServiceDate,
    Requests } =
    req.body;

  let services;

  try {
    services = await service.findByIdAndUpdate(id, {
    Name: Name,
    Phone: Phone,
    VehicleNumber: VehicleNumber,
    VehicleType: VehicleType,
    Model: Model,
    KiloMeters: KiloMeters,
    LastServiceDate: LastServiceDate,
    Requests: Requests
    });
    services = await services.save();
  } catch (err) {
    console.log(err);
  }
  //IF not updated
  if (!services) {
    return res.status(404).send({ message: "did not update" });
  }
  return res.status(200).json({ services });
};

//Delete
const deleteService = async (req, res, next) => {
  const id = req.params.id;

  let services;

  try {
    services = await service.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
  }
  //IF not deleted
  if (!services) {
    return res.status(404).send({ message: "Unable to delete" });
  }
  return res.status(200).json({ services });
};

//exports
exports.getById = getById;
exports.getAllservice = getAllservice;
exports.addServices = addServices;
exports.updateService = updateService;
exports.deleteService = deleteService;
