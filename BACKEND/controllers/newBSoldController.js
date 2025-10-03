const newB = require("../Model/newBSoldModel");

// Get all sold bikes
const getAllnewBH = async (req, res) => {
  try {
    const newBsH = await newB.find();
    if (!newBsH || newBsH.length === 0) {
      return res.status(404).json({ message: "No bikes found" });
    }
    return res.status(200).json({ newBsH });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error fetching bikes" });
  }
};

//insert new bike sold details
const addnewBH = async (req, res, next) => {
  console.log("Request body:", req.body);
  const { type, model, last_price, buyer_name, contact_no, date } = req.body;

  // Backend validation: date must be today only
  const today = new Date();
  today.setHours(0,0,0,0);
  let submittedDate = date ? new Date(date) : today;
  submittedDate.setHours(0,0,0,0);
  if (submittedDate.getTime() !== today.getTime()) {
    return res.status(400).json({ message: "Date of sale must be today only." });
  }

  let newBsH;
  try {
    newBsH = new newB({
      type,
      model,
      last_price,
      buyer_name,
      contact_no,
      date: today
    });
    await newBsH.save();
    console.log("Sold Bike saved successfully:", newBsH);
    return res.status(201).json({ newBsH, message: " Sold Bike added successfully" });
  } catch (err) {
    console.log("Error saving bike:", err);
    return res.status(500).json({ message: "Error saving bike", error: err.message });
  }
};

// Get Sold bike by ID
const getByID = async (req, res) => {
  try {
    const newBike = await newB.findById(req.params.id);
    if (!newBike) return res.status(404).json({ message: " Sold Bike not found" });
    return res.status(200).json({ newBike });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error fetching bike" });
  }
};

// Update Sold bike
const updatenewBH = async (req, res) => {
  const { type, model, last_price, buyer_name, contact_no, date } = req.body;
  const id = req.params.id;
  let newBsH;
  try {
    const updateData = { type, model, last_price, buyer_name, contact_no };
    if (date) updateData.date = new Date(date);
    newBsH = await newB.findByIdAndUpdate(id, updateData, { new: true });
    if (!newBsH) {
      return res.status(404).json({ message: "Sold Bike not found" });
    }
    return res.status(200).json({ newBsH, message: "Sold Bike updated successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Unable to update Sold bike" });
  }
};

//Delete new Bikes After Sold
const deletenewBH = async (req, res, next) => {
    const id = req.params.id;

    let newBsH;

    try{
      newBsH = await newB.findByIdAndDelete(id);
      if (!newBsH) {
        return res.status(404).json({ message: "Unable to Delete Sold Bike Details" });
      }
      return res.status(200).json({ newBsH, message: "Sold Bike deleted successfully" });
    }catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Error deleting bike" });
    }
};

module.exports = {
  getAllnewBH,
  addnewBH,
  getByID,
  updatenewBH,
  deletenewBH,
};
