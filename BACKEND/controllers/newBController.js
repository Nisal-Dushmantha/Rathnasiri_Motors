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

//insert new bike details
const addnewB = async (req, res, next) => {
  console.log("Request body:", req.body);
  console.log("Request file:", req.file);
  
  const { type, model, color, quantity, price, offers, status } = req.body;
  
  // Handle file upload
  let imagePath = null;
  if (req.file) {
    imagePath = `/uploads/${req.file.filename}`;
  }

  let newBs;

  try {
    newBs = new newB({ type, model, color, quantity, price, offers, status, image: imagePath });
    await newBs.save();
    console.log("Bike saved successfully:", newBs);
    return res.status(201).json({ newBs, message: "Bike added successfully" });
  } catch (err) {
    console.log("Error saving bike:", err);
    return res.status(500).json({ message: "Error saving bike", error: err.message });
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
  const { type, model, color, quantity, price, offers, status } = req.body;
  const id = req.params.id;
  
  // Handle file upload
  let imagePath = null;
  if (req.file) {
    imagePath = `/uploads/${req.file.filename}`;
  }

  let newBs;

  try{
    const updateData = {type : type, model : model, color : color, quantity : quantity, price : price, offers : offers, status : status};
    if (imagePath) {
      updateData.image = imagePath;
    }
    
    newBs = await newB.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!newBs) {
      return res.status(404).json({ message: "Bike not found" });
    }
    
    return res.status(200).json({ newBs, message: "Bike updated successfully" });
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
      newBs = await newB.findByIdAndDelete(id);
      if (!newBs) {
        return res.status(404).json({ message: "Unable to Delete Bike Details" });
      }
      return res.status(200).json({ newBs, message: "Bike deleted successfully" });
    }catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Error deleting bike" });
    }
};

// Get total count of new bikes
const getNewBikesCount = async (req, res) => {
  try {
    const count = await newB.countDocuments();
    return res.status(200).json({ count });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error fetching bike count" });
  }
};

// Get total quantity (stock units) across all new bikes
const getNewBikesQuantitySum = async (req, res) => {
  try {
    // Fetch only quantity field to minimize payload
    const docs = await newB.find({}, { quantity: 1, _id: 0 }).lean();
    const totalQuantity = docs.reduce((sum, doc) => {
      const q = parseInt(doc.quantity, 10);
      return sum + (Number.isNaN(q) ? 0 : q);
    }, 0);
    return res.status(200).json({ totalQuantity });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error summing bike quantities" });
  }
};

// Get low stock new bikes (quantity below threshold)
const getLowStockNewBikes = async (req, res) => {
  try {
    const thresholdParam = req.query.threshold;
    const threshold = Number.isNaN(parseInt(thresholdParam, 10))
      ? 20
      : parseInt(thresholdParam, 10);

    // Convert string quantity to int and filter
    const lowStock = await newB
      .aggregate([
        {
          $addFields: {
            numericQuantity: { $toInt: "$quantity" },
          },
        },
        {
          $match: { numericQuantity: { $lt: threshold } },
        },
        {
          $project: {
            type: 1,
            model: 1,
            color: 1,
            quantity: 1,
            price: 1,
            status: 1,
            image: 1,
          },
        },
      ])
      .exec();

    return res.status(200).json({ threshold, items: lowStock });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error fetching low stock bikes" });
  }
};

module.exports = {
  getAllnewB,
  addnewB,
  getByID,
  updatenewB,
  deletenewB,
  getNewBikesCount,
  getNewBikesQuantitySum,
  getLowStockNewBikes,
};
