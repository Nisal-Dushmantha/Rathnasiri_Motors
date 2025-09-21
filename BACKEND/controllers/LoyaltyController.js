const Loyalty = require("../Model/LoyaltyModel");

// Get loyalty records (optionally filter by customerId)
const getAll = async (req, res) => {
  try {
    const { customerId } = req.query;
    const filter = customerId ? { customerId } : {};
    const records = await Loyalty.find(filter).sort({ createdAt: -1 });
    return res.status(200).json(records);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to fetch loyalty records" });
  }
};

// Create new loyalty record
const create = async (req, res) => {
  try {
    const { customerId, name, interaction, date, points } = req.body;
    const record = new Loyalty({
      customerId,
      name,
      interaction,
      date,
      points,
    });
    await record.save();
    return res.status(201).json(record);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Failed to create loyalty record" });
  }
};

// Update points or fields on an existing record
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { customerId, name, interaction, date, points } = req.body;
    const updated = await Loyalty.findByIdAndUpdate(
      id,
      { customerId, name, interaction, date, points },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Record not found" });
    }
    return res.status(200).json(updated);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Failed to update loyalty record" });
  }
};

// Delete a record
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Loyalty.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Record not found" });
    }
    return res.status(200).json(deleted);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Failed to delete loyalty record" });
  }
};

module.exports = { getAll, create, update, remove };


