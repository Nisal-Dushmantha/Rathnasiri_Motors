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

// Aggregate top members by total points
const topMembers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    // group by customerId and name and sum points
    const agg = await Loyalty.aggregate([
      { $group: { _id: { customerId: "$customerId", name: "$name" }, totalPoints: { $sum: "$points" } } },
      { $sort: { totalPoints: -1 } },
      { $limit: limit },
      { $project: { customerId: "$_id.customerId", name: "$_id.name", points: "$totalPoints", _id: 0 } }
    ]).exec();
    return res.status(200).json({ members: agg });
  } catch (err) {
    console.error("Failed to aggregate top members", err);
    return res.status(500).json({ message: "Failed to fetch top members" });
  }
};

module.exports.topMembers = topMembers;


