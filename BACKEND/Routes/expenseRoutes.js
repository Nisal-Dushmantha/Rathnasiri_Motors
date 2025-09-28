const express = require("express");
const { addExpense, getExpenses} = require("../controllers/expenseController");
const { deleteExpense } = require("../controllers/expenseController");
const router = express.Router();

// POST - add expense
router.post("/", addExpense);

// GET - get all expenses
router.get("/", getExpenses);

// Delete expense

router.delete("/:id", deleteExpense);


module.exports = router;   // 👈 instead of export default
