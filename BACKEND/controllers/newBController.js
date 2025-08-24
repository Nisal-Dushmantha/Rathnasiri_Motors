const newB = require("../Model/newBModel");

// Get all bikes
const getAllnewB = async (req, res) => {
  try {
    const newBs = await newB.find();
    if (!newBs || newBs.length === 0) {
      return res.status(404).json({ message: "No bikes found" });
    }
    return res.status(200).json({ newBs });
  } catch (err) {
    console.log(err);
  }
  // not found
  if (!newBs) {
    return res.status(404).json({ message: "Bike not found" });
  }
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
};

// Get bike by ID
const getByID = async (req, res) => {
  try {
    const newBike = await newB.findById(req.params.id);
    if (!newBike) return res.status(404).json({ message: "Bike not found" });
    return res.status(200).json({ newBike });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error fetching bike" });
  }
};

// Update bike
const updatenewB = async (req, res) => {
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
    return res.status(500).json({ message: "Unable to update bike" });
  }
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

module.exports = {
  getAllnewB,
  addnewB,
  getByID,
  updatenewB,
  deletenewB,
};
