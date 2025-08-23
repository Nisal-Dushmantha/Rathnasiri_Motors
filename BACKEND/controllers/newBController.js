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
    return res.status(500).json({ message: "Error fetching bikes" });
  }
};

// Add new bike with optional image
const addnewB = async (req, res) => {
  const { type, model, color, price, status } = req.body;
  const imageFilename = req.file ? req.file.filename : null;

  try {
    const newBike = new newB({ type, model, color, price, status, imageFilename });
    await newBike.save();
    return res.status(200).json({ newBike });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Unable to add bike" });
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
  const imageFilename = req.file ? req.file.filename : null;

  try {
    const updatedBike = await newB.findByIdAndUpdate(
      req.params.id,
      { type, model, color, price, status, ...(imageFilename && { imageFilename }) },
      { new: true }
    );
    if (!updatedBike) return res.status(404).json({ message: "Bike not found" });
    return res.status(200).json({ updatedBike });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Unable to update bike" });
  }
};

// Delete bike
const deletenewB = async (req, res) => {
  try {
    const deletedBike = await newB.findByIdAndDelete(req.params.id);
    if (!deletedBike) return res.status(404).json({ message: "Bike not found" });
    return res.status(200).json({ deletedBike });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Unable to delete bike" });
  }
};

module.exports = {
  getAllnewB,
  addnewB,
  getByID,
  updatenewB,
  deletenewB,
};
