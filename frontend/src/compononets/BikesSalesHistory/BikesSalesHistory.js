import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Card from "../ui/Card";
import Button from "../ui/Button";

function BikesSalesHistory() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/newBsH");
      const salesData = Array.isArray(res.data.newBsH) ? res.data.newBsH : [];
      setSales(salesData);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch sales history");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      setDeletingId(id);
      await axios.delete(`http://localhost:5000/newBsH/${id}`);
      setSales(sales.filter((sale) => sale._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete the record.");
    } finally {
      setDeletingId(null);
    }
  };

  // Helper to export a single month's sales to PDF
  const exportMonthPDF = (monthKey, monthSales) => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();
    const monthlyIncome = monthSales.reduce((sum, sale) => sum + Number(sale.last_price || 0), 0);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(`${monthKey} Sold Bikes Summary`, doc.internal.pageSize.getWidth() / 2, 20, { align: "center" });
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Exported: ${date}`, doc.internal.pageSize.getWidth() / 2, 30, { align: "center" });
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 102, 51);
    doc.text(`Monthly Income: Rs. ${monthlyIncome}`, doc.internal.pageSize.getWidth() / 2, 40, { align: "center" });
    const tableColumn = ["New/Used", "Model", "Last Price", "Buyer Name", "Contact No"];
    const tableRows = monthSales.map((sale) => [
      sale.type,
      sale.model,
      `Rs. ${sale.last_price}`,
      sale.buyer_name,
      sale.contact_no
    ]);
    autoTable(doc, {
      startY: 50,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      headStyles: { fillColor: [54, 162, 235], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      styles: { font: "helvetica", fontSize: 10, textColor: 0 },
      margin: { left: 15, right: 15 },
    });
    doc.save(`${monthKey.replace(/ /g, '_')}_Sold_Bikes_Summary.pdf`);
  };

  // Group sales by month and year
  const groupedSales = sales.reduce((acc, sale) => {
    if (!sale.date) return acc;
    const dateObj = new Date(sale.date);
    const month = dateObj.toLocaleString('default', { month: 'long' });
    const year = dateObj.getFullYear();
    const key = `${month} ${year}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(sale);
    return acc;
  }, {});
  const sortedMonthKeys = Object.keys(groupedSales).sort((a, b) => {
    // Sort by year then month
    const [monthA, yearA] = a.split(' ');
    const [monthB, yearB] = b.split(' ');
    const dateA = new Date(`${monthA} 1, ${yearA}`);
    const dateB = new Date(`${monthB} 1, ${yearB}`);
    return dateB - dateA;
  });

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col items-center">
        <div className="w-full max-w-7xl bg-white rounded-2xl shadow-2xl border border-gray-200">
          <h2 className="text-2xl font-bold text-blue-700 mb-4 px-8 pt-8 text-left">
            Monthly Sold Bikes Summary
          </h2>
          {loading ? (
            <p className="text-center text-gray-600">Loading sales history...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : sales.length === 0 ? (
            <p className="text-center text-gray-600">No sales history available.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-xl table-auto">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr className="text-blue-900">
                    <th className="py-3 px-4 text-left font-semibold">New/Used</th>
                    <th className="py-3 px-4 text-left font-semibold">Model</th>
                    <th className="py-3 px-4 text-left font-semibold">Last Price</th>
                    <th className="py-3 px-4 text-left font-semibold">Buyer Name</th>
                    <th className="py-3 px-4 text-left font-semibold">Contact No</th>
                    <th className="py-3 px-4 text-left font-semibold">Date</th>
                    <th className="py-3 px-4 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedMonthKeys.length === 0 && sales.length > 0 && (
                    <tr><td colSpan="7" className="text-center">No dated sales found.</td></tr>
                  )}
                  {sortedMonthKeys.map((monthKey) => [
                    <tr key={monthKey} className="bg-blue-100">
                      <td colSpan="6" className="py-2 px-4 font-bold text-blue-800">{monthKey}</td>
                      <td className="py-2 px-4 text-right">
                        <button
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm"
                          onClick={() => exportMonthPDF(monthKey, groupedSales[monthKey])}
                        >
                          Export PDF
                        </button>
                      </td>
                    </tr>,
                    ...groupedSales[monthKey].map((sale) => (
                      <tr key={sale._id} className="border-b border-gray-100 hover:bg-blue-50 transition-colors duration-200">
                        <td className="py-3 px-4 text-gray-700">{sale.type}</td>
                        <td className="py-3 px-4 text-gray-700">{sale.model}</td>
                        <td className="py-3 px-4 text-gray-700">Rs. {sale.last_price}</td>
                        <td className="py-3 px-4 text-gray-700">{sale.buyer_name}</td>
                        <td className="py-3 px-4 text-gray-700">{sale.contact_no}</td>
                        <td className="py-3 px-4 text-gray-700">{sale.date ? new Date(sale.date).toLocaleDateString() : '-'}</td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleDelete(sale._id)}
                            disabled={deletingId === sale._id}
                            className={`px-3 py-1 rounded-lg text-white transition-all duration-200 ${
                              deletingId === sale._id ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
                            }`}
                          >
                            {deletingId === sale._id ? "Deleting..." : "Delete"}
                          </button>
                        </td>
                      </tr>
                    ))
                  ])}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BikesSalesHistory;
