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

  const exportPDF = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();
    const monthlyIncome = sales.reduce((sum, sale) => sum + Number(sale.last_price || 0), 0);

    // Title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Monthly Sold Bikes Summary", doc.internal.pageSize.getWidth() / 2, 20, { align: "center" });

    // Date
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Date: ${date}`, doc.internal.pageSize.getWidth() / 2, 30, { align: "center" });

    // Monthly Income
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 102, 51);
    doc.text(`Monthly Income: Rs. ${monthlyIncome}`, doc.internal.pageSize.getWidth() / 2, 40, { align: "center" });

    // Table data
    const tableColumn = ["New/Used", "Model", "Last Price", "Buyer Name", "Contact No"];
    const tableRows = sales.map((sale) => [
      sale.type,
      sale.model,
      `Rs. ${sale.last_price}`,
      sale.buyer_name,
      sale.contact_no
    ]);

    // Generate table
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

    doc.save("Monthly_Sold_Bikes_Summary.pdf");
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <Card className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-blue-900">Monthly Sold Bikes Summary</h2>
          <Button onClick={exportPDF}>Export PDF</Button>
        </div>

        {loading ? (
          <p className="text-center text-gray-600">Loading sales history...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : sales.length === 0 ? (
          <p className="text-center text-gray-600">No sales history available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl overflow-hidden border border-gray-100">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-blue-900">
                  <th className="py-3 px-4 text-left font-semibold">New/Used</th>
                  <th className="py-3 px-4 text-left font-semibold">Model</th>
                  <th className="py-3 px-4 text-left font-semibold">Last Price</th>
                  <th className="py-3 px-4 text-left font-semibold">Buyer Name</th>
                  <th className="py-3 px-4 text-left font-semibold">Contact No</th>
                  <th className="py-3 px-4 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => (
                  <tr key={sale._id} className="border-b border-gray-100 hover:bg-blue-50 transition-colors duration-200">
                    <td className="py-3 px-4 text-gray-700">{sale.type}</td>
                    <td className="py-3 px-4 text-gray-700">{sale.model}</td>
                    <td className="py-3 px-4 text-gray-700">Rs. {sale.last_price}</td>
                    <td className="py-3 px-4 text-gray-700">{sale.buyer_name}</td>
                    <td className="py-3 px-4 text-gray-700">{sale.contact_no}</td>
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

export default BikesSalesHistory;
