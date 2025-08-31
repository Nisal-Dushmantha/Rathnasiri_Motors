const usedB = require("../Model/usedBModel");

// Get all bikes
const getAllusedB = async (req, res,next) => {
  try {
    const usedBs = await usedB.find();
    if (!usedBs || usedBs.length === 0) {
      return res.status(404).json({ message: "No bikes found" });
    }
    return res.status(200).json({ usedBs });
  } catch (err) {
    console.log(err);
  }
  // not found
  if (!usedBs) {
    return res.status(404).json({ message: "Bike not found" });
  }
};

// Insert used bike details
const addusedB = async (req, res, next) => {
  console.log("Request body:", req.body);
  console.log("Request file:", req.file);

  const { type, model, color, price, mileage, year, owner, status } = req.body;

  // Handle file upload
  let imagePath = null;
  if (req.file) {
    imagePath = `/uploads/${req.file.filename}`;
  }

  let usedBs;

  try {
    usedBs = new usedB({ type, model, color, price, mileage, year, owner,  status, image: imagePath });
    await usedBs.save();
    console.log("Bike saved successfully:", usedBs);
  } catch (err) {
    console.log("Error saving bike:", err);
    return res
      .status(500)
      .json({ message: "Error saving bike", error: err.message });
  }
  //not insert used bikes
  if (!usedBs) {
    return res.status(404).json({ message: "unable to add bikes" });
  }
};

// Get bike by ID
const getByID = async (req, res) => {
  try {
    const usedBike = await usedB.findById(req.params.id);
    if (!usedBike) return res.status(404).json({ message: "Bike not found" });
    return res.status(200).json({ usedBike });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error fetching bike" });
  }
};

// Update bike
const updateusedB = async (req, res) => {
  const { type, model, color, price, mileage, year, owner, status } = req.body;

  // Handle file upload
  let imagePath = null;
  if (req.file) {
    imagePath = `/uploads/${req.file.filename}`;
  }

  let usedBs;

  try {
    const updateData = {
      type: type,
      model: model,
      color: color,
      price: price,
      mileage: mileage,
      year: year,
      owner: owner,
      status: status,
    };
    if (imagePath) {
      updateData.image = imagePath;
    }

    usedBs = await usedB.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    return res.status(200).json({ usedBs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Unable to update bike" });
  }
};

// Delete used Bikes After Sold
const deleteusedB = async (req, res, next) => {
  const id = req.params.id;

  let usedBs;

  try {
    usedBs = await usedB.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
  }

  if (!usedBs) {
    return res
      .status(404)
      .json({ message: "Unable to Delete Bike Details" });
  }
  return res.status(200).json({ usedBs });
};

module.exports = {
  getAllusedB,
  addusedB,
  getByID,
  updateusedB,
  deleteusedB,
};
