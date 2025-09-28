// src/components/ViewBills.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";

function ViewBills({ fetchUrl = "http://localhost:5000/api/bills" }) {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(""); // YYYY-MM

  const fetchBills = async () => {
    try {
      setLoading(true);
      const res = await axios.get(fetchUrl);
      setBills(res.data.bills || []);
    } catch (err) {
      console.error("Error fetching bills:", err);
      setError("Failed to load bills.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, [fetchUrl]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bill?")) return;
    try {
      await axios.delete(`${fetchUrl}/${id}`);
      setBills((prev) => prev.filter((bill) => bill._id !== id));
    } catch (err) {
      console.error("Error deleting bill:", err);
      alert("Failed to delete bill.");
    }
  };

  // Filter bills by selected month
  const filteredBills = bills.filter((bill) => {
    if (!selectedMonth) return true;
    const billDate = new Date(bill.createdAt);
    const monthStr = `${billDate.getFullYear()}-${String(billDate.getMonth() + 1).padStart(2, "0")}`;
    return monthStr === selectedMonth;
  });

  const totalBase = filteredBills.reduce((sum, bill) => sum + (bill.amount || 0), 0);
  const totalService = filteredBills.reduce((sum, bill) => sum + (bill.serviceCharge || 0), 0);
  const totalAmount = filteredBills.reduce((sum, bill) => sum + (bill.total || 0), 0);

  // Generate professional PDF
  const generatePdf = () => {
    const doc = new jsPDF({ unit: "pt", format: "A4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let y = 60;

    // Logo placeholder (replace with actual base64 logo if available)
    // doc.addImage(logoDataUrl, "PNG", 40, 15, 50, 50);

    // Header
    doc.setFontSize(18);
    doc.setTextColor(41, 128, 185);
    doc.setFont("helvetica", "bold");
    doc.text("Rathnasiri Motors", pageWidth / 2, 30, { align: "center" });
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.setFont("helvetica", "normal");
    doc.text("Monthly Insurance Bills Summary", pageWidth / 2, 50, { align: "center" });

    // Month info
    doc.setFontSize(12);
    doc.text(`Month: ${selectedMonth || "All months"}`, 40, y);
    y += 20;

    const headers = ["Customer", "Vehicle No", "Base Amount", "Service Charge", "Total", "Payment", "Date"];
    const colWidths = [100, 80, 80, 100, 80, 60, 80];
    const xStart = 40;

    // Table header
    let x = xStart;
    doc.setFillColor(52, 152, 219);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    headers.forEach((header, i) => {
      doc.rect(x, y, colWidths[i], 25, "F");
      doc.text(header, x + 3, y + 17);
      x += colWidths[i];
    });

    y += 25;

    // Table rows
    doc.setFont("helvetica", "normal");
    filteredBills.forEach((bill, index) => {
      x = xStart;
      doc.setFillColor(index % 2 === 0 ? 245 : 255, 245, 245);
      doc.rect(x, y, colWidths.reduce((a, b) => a + b, 0), 20, "F");

      const row = [
        bill.customerName || "N/A",
        bill.vehicleNumber || "N/A",
        (bill.amount || 0).toFixed(2),
        (bill.serviceCharge || 0).toFixed(2),
        (bill.total || 0).toFixed(2),
        bill.paymentMethod,
        new Date(bill.createdAt).toLocaleDateString(),
      ];

      row.forEach((cell, i) => {
        doc.setTextColor(0);
        doc.text(cell.toString(), x + 3, y + 14);
        x += colWidths[i];
      });

      y += 20;
      if (y > pageHeight - 80) {
        doc.addPage();
        y = 60;
      }
    });

    // Grand totals row
    y += 10;
    doc.setFillColor(41, 128, 185);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.rect(xStart, y, colWidths.reduce((a, b) => a + b, 0), 25, "F");
    doc.text(`Grand Total Base: Rs. ${totalBase.toFixed(2)}`, xStart + 5, y + 17);
    doc.text(`Service Charge: Rs. ${totalService.toFixed(2)}`, xStart + 200, y + 17);
    doc.text(`Total: Rs. ${totalAmount.toFixed(2)}`, xStart + 400, y + 17);

    // Footer with page numbers
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(120);
      doc.text(
        `Page ${i} of ${pageCount} | Rathnasiri Motors | Contact: 077-XXXXXXX`,
        pageWidth / 2,
        pageHeight - 20,
        { align: "center" }
      );
    }

    doc.save(`Monthly_Summary_${selectedMonth || "All"}.pdf`);
  };

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-6 mt-6 border">
      <h2 className="text-2xl font-bold mb-4 text-blue-800 text-center">
        Insurance Bills History
      </h2>

      <div className="mb-4 flex items-center gap-4">
        <label className="font-medium">Select Month:</label>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="p-2 border rounded-lg"
        />
        <button
          onClick={generatePdf}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Generate Monthly Summary PDF
        </button>
      </div>

      {loading && <div className="text-gray-600">Loading bills...</div>}
      {error && <div className="text-red-600">{error}</div>}

      {!loading && filteredBills.length === 0 && (
        <div className="text-gray-500 text-center">No bills found.</div>
      )}

      {!loading && filteredBills.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-4 py-2 border">Customer</th>
                <th className="px-4 py-2 border">Vehicle No</th>
                <th className="px-4 py-2 border">Base Amount (Rs.)</th>
                <th className="px-4 py-2 border">Service Charge (Rs.)</th>
                <th className="px-4 py-2 border">Total Amount (Rs.)</th>
                <th className="px-4 py-2 border">Payment</th>
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.map((bill) => (
                <tr key={bill._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{bill.customerName || "N/A"}</td>
                  <td className="px-4 py-2 border">{bill.vehicleNumber || "N/A"}</td>
                  <td className="px-4 py-2 border">{bill.amount?.toFixed(2) || "0.00"}</td>
                  <td className="px-4 py-2 border">{bill.serviceCharge?.toFixed(2) || "0.00"}</td>
                  <td className="px-4 py-2 border">{bill.total?.toFixed(2) || "0.00"}</td>
                  <td className="px-4 py-2 border">{bill.paymentMethod}</td>
                  <td className="px-4 py-2 border">{new Date(bill.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-2 border text-center">
                    <button
                      onClick={() => handleDelete(bill._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ViewBills;
