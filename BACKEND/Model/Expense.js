const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ["Utility Bills", "Purchase Inventory", "Purchase Bikes", "Employee Salaries"],
    required: true,
  },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  description: { type: String },
 
});

module.exports = mongoose.model("Expense", expenseSchema);
