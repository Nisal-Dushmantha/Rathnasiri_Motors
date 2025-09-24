const Bill = require("../Model/BillModel");

// Create and save a bill record
const createBill = async (req, res) => {
  try {
    const { amount, paymentMethod, insuranceRef, cashier } = req.body;

    if (typeof amount !== "number" || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    if (!["Cash", "Card"].includes(paymentMethod)) {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    const bill = new Bill({
      amount,
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

module.exports = { createBill, getBills };
