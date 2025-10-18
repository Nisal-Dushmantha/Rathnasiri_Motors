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

const Counter = require('../Model/CounterModel');

async function getNextSeqFromCounter(key = 'customerId') {
  const ret = await Counter.findOneAndUpdate(
    { _id: key },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return ret.seq;
}

// attempts to auto-increment based on existing numeric-like ids (preserve width), else fallback to counter
function makeNextIdFromExisting(lastId) {
  if (!lastId) return null;
  // find trailing number in the id
  const m = lastId.match(/(\d+)$/);
  if (!m) return null;
  const num = m[1];
  const prefix = lastId.slice(0, lastId.length - num.length);
  const nextNum = String(Number(num) + 1).padStart(num.length, '0');
  return `${prefix}${nextNum}`;
}

const create = async (req, res) => {
  try {
    let { customerId, customerName, contactNumber, email } = req.body;

    // if no customerId provided, try to generate from the latest customerId format
    if (!customerId || !customerId.toString().trim()) {
      // find the customer with the highest createdAt and look at its id
      const last = await Customer.findOne().sort({ createdAt: -1 }).select('customerId').lean();
      let next = null;
      if (last && last.customerId) next = makeNextIdFromExisting(last.customerId);
      if (!next) {
        // fallback to global counter
        const seq = await getNextSeqFromCounter();
        next = `CUST${String(seq).padStart(4, '0')}`;
      }
      customerId = next;
    }

    // server-side duplicate check for customerId
    const existingById = await Customer.findOne({ customerId });
    if (existingById) {
      return res.status(400).json({ errors: [{ field: 'customerId', message: `Customer ID ${customerId} is already in use.` }] });
    }

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
    // Prevent changing to a customerId that belongs to another record
    const conflict = await Customer.findOne({ customerId: customerId, _id: { $ne: id } });
    if (conflict) {
      return res.status(400).json({ errors: [{ field: 'customerId', message: `Customer ID ${customerId} is already in use by another customer.` }] });
    }
    // NOTE: name uniqueness check removed by request — only customerId enforced as primary key
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


