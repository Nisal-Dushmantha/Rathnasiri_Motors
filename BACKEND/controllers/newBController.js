const newB = require("../Model/newBModel");

const getAllnewB = async (req, res, next) => {
  let newBs;

  //data display
  try {
    newBs = await newB.find();
  } catch (err) {
    console.log(err);
  }
  // not found
  if (!newBs) {
    return res.status(404).json({ message: "Bike not found" });
  }
  //Display all Bikes
  return res.status(200).json({ newBs });
};

//insert new bike details
const addnewB = async (req, res, next) => {
  console.log("Request body:", req.body);
  console.log("Request file:", req.file);
  
  const { type, model, color, price, status } = req.body;
  
  // Handle file upload
  let imagePath = null;
  if (req.file) {
    imagePath = `/uploads/${req.file.filename}`;
  }

  let newBs;

  try {
    newBs = new newB({ type, model, color, price, status, image: imagePath });
    await newBs.save();
    console.log("Bike saved successfully:", newBs);
  } catch (err) {
    console.log("Error saving bike:", err);
    return res.status(500).json({ message: "Error saving bike", error: err.message });
  }
  //not insert new bikes
  if (!newBs) {
    return res.status(404).json({ message: "unable to add bikes" });
  }
  return res.status(200).json({ newBs });
};

//Get by id
const getByID = async (req, res, next) => {

  const id = req.params.id;

  let newBs;

  try {
    newBs = await newB.findById(id);
  } catch (err) {
    console.log(err);
  }
  //not available new bikes
  if (!newBs) {
    return res.status(404).json({ message: "bike not found" });
  }
  return res.status(200).json({ newBs });
};

//Update New bike details
const updatenewB = async (req, res, next) => {

  const id = req.params.id;
  const { type, model, color, price, status } = req.body;
  
  // Handle file upload
  let imagePath = null;
  if (req.file) {
    imagePath = `/uploads/${req.file.filename}`;
  }

  let newBs;

  try{
    const updateData = {type : type, model : model, color : color, price : price, status : status};
    if (imagePath) {
      updateData.image = imagePath;
    }
    
    newBs = await newB.findByIdAndUpdate(id, updateData, { new: true });
  }catch(err){
    console.log(err);
  }

  if (!newBs) {
    return res.status(404).json({ message: "Unable to Update Bike Details" });
  }
  return res.status(200).json({ newBs });
};

//Delete new Bikes After Sold
const deletenewB = async (req, res, next) => {

    const id = req.params.id;

    let newBs;

    try{
      newBs = await newB.findByIdAndDelete(id)
    }catch (err) {
      console.log(err);
    }

    if (!newBs) {
      return res.status(404).json({ message: "Unable to Delete Bike Details" });
    }
    return res.status(200).json({ newBs });
};

exports.getAllnewB = getAllnewB;
exports.addnewB = addnewB;
exports.getByID = getByID;
exports.updatenewB = updatenewB;
exports.deletenewB = deletenewB;
