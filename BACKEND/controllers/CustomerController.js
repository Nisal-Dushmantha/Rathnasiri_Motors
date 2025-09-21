const Customer = require("../Model/CustomerModel");

const getAll = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    return res.status(200).json(customers);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to fetch customers" });
  }
};

const create = async (req, res) => {
  try {
    const { customerId, customerName, contactNumber, email } = req.body;
    const customer = new Customer({ customerId, customerName, contactNumber, email });
    await customer.save();
    return res.status(201).json(customer);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Failed to create customer" });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { customerId, customerName, contactNumber, email } = req.body;
    const updated = await Customer.findByIdAndUpdate(
      id,
      { customerId, customerName, contactNumber, email },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Customer not found" });
    return res.status(200).json(updated);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Failed to update customer" });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Customer.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Customer not found" });
    return res.status(200).json(deleted);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Failed to delete customer" });
  }
};

module.exports = { getAll, create, update, remove };


