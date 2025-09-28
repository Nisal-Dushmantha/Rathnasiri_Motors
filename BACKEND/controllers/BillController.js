const Bill = require("../Model/BillModel");

// Create and save a bill record
const createBill = async (req, res) => {
  try {
    const { customerName, vehicleNumber, amount, serviceCharge, total, paymentMethod, insuranceRef, cashier } = req.body;

    if (!customerName || !vehicleNumber || !amount || !total) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const bill = new Bill({
      customerName,
      vehicleNumber,
      amount,
      serviceCharge,
      total,
      paymentMethod,
      insuranceRef: insuranceRef || null,
      cashier: cashier || null,
    });

    await bill.save();
    return res.status(201).json({ message: "Bill saved", bill });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Optional: get last N bills (for list)
const getBills = async (req, res) => {
  try {
    const bills = await Bill.find().sort({ createdAt: -1 }).limit(50);
    return res.status(200).json({ bills });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Delete a bill
const deleteBill = async (req, res) => {
  try {
    const { id } = req.params;
    await Bill.findByIdAndDelete(id);
    return res.status(200).json({ message: "Bill deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};


module.exports = { createBill, getBills ,deleteBill};
