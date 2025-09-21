const Offer = require("../Model/OfferModel");

// Get all offers
const getAll = async (req, res) => {
  try {
    const offers = await Offer.find().sort({ createdAt: -1 });
    return res.status(200).json(offers);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to fetch offers" });
  }
};

// Create new offer
const create = async (req, res) => {
  try {
    const { title, description, startDate, endDate, status } = req.body;
    const offer = new Offer({
      title,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status: status || "Active",
    });
    await offer.save();
    return res.status(201).json(offer);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Failed to create offer" });
  }
};

// Update offer
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, startDate, endDate, status } = req.body;
    const updated = await Offer.findByIdAndUpdate(
      id,
      {
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status,
      },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Offer not found" });
    }
    return res.status(200).json(updated);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Failed to update offer" });
  }
};

// Delete offer
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Offer.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Offer not found" });
    }
    return res.status(200).json(deleted);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Failed to delete offer" });
  }
};

module.exports = { getAll, create, update, remove };
