import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import autoTable from "jspdf-autotable";

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ category: "", amount: "", notes: "" });
  const [search, setSearch] = useState("");

  // Fetch expenses
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/expenses");
      setExpenses(res.data);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  };

  // Add expense
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/expenses", form);
      setExpenses([res.data, ...expenses]);
      setForm({ category: "", amount: "", notes: "" });
      setShowForm(false);
    } catch (err) {
      console.error("Error adding expense:", err);
    }
  };

  // Delete expense
const handleDelete = async (id) => {
    if (!id) return;
    const ok = window.confirm("Are you sure you want to delete this expense?");
    if (!ok) return;

    try {
      // optimistic UI update (remove immediately)
      setExpenses((prev) => prev.filter((exp) => (exp._id || exp.id) !== id));

      // call backend
      await axios.delete(`http://localhost:5000/api/expenses/${id}`);
      // success: nothing more to do (UI already updated)
    } catch (err) {
      console.error("Error deleting expense:", err);
      alert("Failed to delete expense. See console for details.");
      // fallback: refetch to ensure UI is consistent
      fetchExpenses();
    }
  };


  // Filtered expenses
 // Filter expenses
const filteredExpenses = expenses.filter(
  (exp) =>
    (exp.category?.toLowerCase().includes(search.toLowerCase()) ||
    exp.notes?.toLowerCase().includes(search.toLowerCase()))
);

//Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Monthly Expenses Report", 14, 16);
    doc.setFontSize(12);
    doc.text(
      `Month: ${new Date().toLocaleString("default", { month: "long", year: "numeric" })}`,
      14,
      28
    );
    doc.text(`Total Expenses: LKR ${monthlyTotal.toLocaleString()}`, 14, 36);
    doc.text(`Top Category: ${topCategory}`, 14, 44);

    if (monthlyExpenses.length > 0) {
      autoTable(doc,{
        startY: 52,
        head: [["Date", "Category", "Amount (LKR)", "Notes"]],
        body: monthlyExpenses.map((exp) => [
          new Date(exp.date).toLocaleDateString(),
          exp.category,
          `LKR ${Number(exp.amount).toLocaleString()}`,
          exp.notes || "-",
        ]),
        styles: { fontSize: 10 },
        headStyles: { fillColor: [220, 220, 220] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
      });
    } else {
      doc.text("No expenses for this month.", 14, 52);
    }

    doc.save("MonthlyExpenses.pdf");
  };

  // Export to Excel
  const exportExcel = () => {
  if (monthlyExpenses.length === 0) {
    alert("No expenses for this month to export.");
    return;
  }

  // Convert monthly expenses to Excel-friendly format
  const data = monthlyExpenses.map((exp) => ({
    Date: new Date(exp.date).toLocaleDateString(),
    Category: exp.category,
    Amount: Number(exp.amount),
    Notes: exp.notes || "-",
  }));

  // Create worksheet and workbook
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Monthly Expenses");

  // Add summary row
  const summaryRow = [
    ["", "Total Expenses", monthlyTotal],
    ["", "Top Category", topCategory],
  ];
  XLSX.utils.sheet_add_aoa(worksheet, summaryRow, { origin: -1 });

  // Save the file
  XLSX.writeFile(workbook, "MonthlyExpenses.xlsx");
};


  // Get current month
const currentMonth = new Date().getMonth();
const currentYear = new Date().getFullYear();

// Filter expenses for current month
const monthlyExpenses = expenses.filter(exp => {
  const date = new Date(exp.date);
  return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
});

// Total monthly amount
const monthlyTotal = monthlyExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

// Find top category
const categoryTotals = {};
monthlyExpenses.forEach(exp => {
  if (exp.category) {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + Number(exp.amount);
  }
});

// Determine the category with the highest amount
const topCategory = Object.keys(categoryTotals).reduce((a, b) => categoryTotals[a] > categoryTotals[b] ? a : b, "N/A");


  return (
    <div className="flex-1 bg-gradient-to-b from-red-50 to-orange-50 p-10 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-red-900">📊 Expenses</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-red-700 text-white font-semibold py-2 px-6 rounded-xl hover:bg-red-800 transition"
        >
          ➕ Add Expense
        </button>
      </div>
     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
  <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-500">
    <h2 className="text-lg font-semibold text-gray-700">Total Expenses</h2>
    <p className="text-3xl font-bold text-red-700 mt-2">LKR {monthlyTotal}</p>
  </div>
  <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-orange-500">
    <h2 className="text-lg font-semibold text-gray-700">This Month</h2>
    <p className="text-3xl font-bold text-orange-600 mt-2">LKR {monthlyTotal}</p>
  </div>
  <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-500">
    <h2 className="text-lg font-semibold text-gray-700">Top Category</h2>
    <p className="text-3xl font-bold text-yellow-600 mt-2">{topCategory}</p>
  </div>
   </div>

      {/* Add Expense Form */}
      {showForm && (
        <div className="bg-white shadow-xl rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-red-700 mb-4">Add New Expense</h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Category */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Select Category</option>
                <option value="Utility Bills">Utility Bills</option>
                <option value="Purchase Inventory">Purchase Inventory</option>
                <option value="Purchase Bikes">Purchase Bikes</option>
                <option value="Employee Salaries">Employee Salaries</option>
              </select>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Amount (LKR)
              </label>
              <input
                type="number"
                value={form.amount}
                onChange={(e) =>
                  setForm({ ...form, amount: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Enter amount"
                required
              />
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">
                Notes
              </label>
              <textarea
                value={form.notes}
                onChange={(e) =>
                  setForm({ ...form, notes: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Optional notes"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 md:col-span-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search + Export */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="🔍 Search expenses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg w-full md:w-1/2 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400"
        />
        <div className="flex gap-3">
          <button
           onClick={exportPDF}
            className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold rounded-lg shadow-md hover:from-green-600 hover:to-green-800 transition"
          >
            📄 Export PDF
          </button>
          <button
            onClick={exportExcel}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            📊 Export Excel
          </button>
        </div>
      </div>

      {/* Expenses Table */}
      {filteredExpenses.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="py-4 px-6 text-left text-sm font-semibold">
                  Date
                </th>
                <th className="py-4 px-6 text-left text-sm font-semibold">
                  Category
                </th>
                <th className="py-4 px-6 text-left text-sm font-semibold">
                  Amount (LKR)
                </th>
                <th className="py-4 px-6 text-left text-sm font-semibold">
                  Notes
                </th>
                <th className="py-4 px-6 text-left text-sm font-semibold">
              Actions
             </th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((exp, i) => (
                <tr key={i} className="hover:bg-red-50 transition">
                  <td className="py-3 px-6">
                    {new Date(exp.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-6">{exp.category}</td>
                  <td className="py-3 px-6 font-semibold text-red-700">
                    LKR {Number(exp.amount).toLocaleString()}
                  </td>
                  <td className="py-3 px-6 text-gray-600">
                    {exp.notes || "-"}
                  </td>
                  <td className="py-3 px-6">
              <button
              onClick={() => handleDelete(exp._id)}
             className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition"
            >
               🗑 Delete
            </button>
             </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-6 text-center text-gray-500">
          No expenses found.
        </div>
      )}
    </div>
  );
}

export default Expenses;
