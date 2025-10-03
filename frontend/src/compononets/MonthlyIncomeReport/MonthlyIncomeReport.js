import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import { FaMotorcycle, FaTools, FaWrench, FaFileInvoiceDollar } from "react-icons/fa";

function MonthlyIncomeReport() {
  const [month, setMonth] = useState(""); // YYYY-MM
  const [bikes, setBikes] = useState([]);
  const [spareParts, setSpareParts] = useState([]);
  const [services, setServices] = useState([]);
  const [insuranceBills, setInsuranceBills] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!month) return;
    setLoading(true);

    const fetchAll = async () => {
      try {
        const [bikesRes, spareRes, servicesRes, insuranceRes] = await Promise.all([
          axios.get("http://localhost:5000/newBsH"),
          axios.get("http://localhost:5000/spb"),
          axios.get("http://localhost:5000/service-repair-bills"),
          axios.get("http://localhost:5000/api/bills"),
        ]);

        const filterByMonth = (items, dateField) =>
          items.filter((item) => {
            const d = new Date(item[dateField]);
            const itemMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
            return itemMonth === month;
          });

        setBikes(filterByMonth(bikesRes.data.newBsH || [], "date"));

        // Process Spare Parts
        const rawSpare = spareRes.data.spb || [];
        const groupedSpare = rawSpare.reduce((acc, item) => {
          let bill = acc.find((b) => b.bill_no === item.bill_no);
          if (!bill) {
            bill = {
              bill_no: item.bill_no,
              date: item.date,
              customerName: item.customerName,
              items: [],
            };
            acc.push(bill);
          }
          bill.items.push({
            name: item.name,
            brand: item.brand,
            quantity: Number(item.quantity),
            price: Number(item.price),
          });
          return acc;
        }, []);
        setSpareParts(filterByMonth(groupedSpare, "date"));

        setServices(filterByMonth(servicesRes.data || [], "date"));
        setInsuranceBills(filterByMonth(insuranceRes.data.bills || [], "createdAt"));
      } catch (err) {
        console.error("Failed to fetch monthly data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [month]);

  // Income calculations
  const totalBikesIncome = bikes.reduce((sum, b) => sum + Number(b.last_price || 0), 0);
  const totalSpareIncome = spareParts.reduce((sum, bill) => bill.items.reduce((s, it) => s + it.quantity * it.price, 0) + sum, 0);
  const totalServicesIncome = services.reduce((sum, s) => sum + Number(s.total || 0), 0);
  const totalInsuranceService = insuranceBills.reduce((sum, b) => sum + Number(b.serviceCharge || 0), 0);

  const totalIncome = totalBikesIncome + totalSpareIncome + totalServicesIncome + totalInsuranceService;

  // Professional PDF generation
  const generatePdf = () => {
    const doc = new jsPDF("p", "mm", "a4");

    // Title
    doc.setFontSize(20);
    doc.setTextColor(0, 70, 140);
    doc.setFont("helvetica", "bold");
    doc.text("Monthly Income Report", 105, 20, { align: "center" });

    // Subtitle - Month
    doc.setFontSize(14);
    doc.setTextColor(80, 80, 80);
    const monthName = new Date(`${month}-01`).toLocaleString("default", { month: "long", year: "numeric" });
    doc.text(`Month: ${monthName}`, 105, 30, { align: "center" });

    // Table
    const startY = 45;
    const rowHeight = 10;
    const col1X = 20;
    const col2X = 150;

    // Header
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.setFillColor(0, 70, 140); // Dark blue header
    doc.rect(col1X - 2, startY - 6, 150, 10, "F");
    doc.text("Source", col1X, startY);
    doc.text("Amount (Rs.)", col2X, startY, { align: "right" });

    // Rows data
    const tableData = [
      ["Sold Bikes", totalBikesIncome.toFixed(2)],
      ["Spare Parts", totalSpareIncome.toFixed(2)],
      ["Service & Repair", totalServicesIncome.toFixed(2)],
      ["Insurance Service Charge", totalInsuranceService.toFixed(2)],
      ["Total Income", totalIncome.toFixed(2)],
    ];

    let currentY = startY + 8;

    tableData.forEach((row, index) => {
      const isTotal = row[0] === "Total Income";

      // Alternate row colors
      if (!isTotal && index % 2 === 0) {
        doc.setFillColor(240, 245, 255);
        doc.rect(col1X - 2, currentY - 6, 150, rowHeight, "F");
      }

      // Text color
      doc.setTextColor(isTotal ? 255 : 0, isTotal ? 255 : 0, isTotal ? 255 : 0);
      doc.setFont(isTotal ? "helvetica" : "helvetica", isTotal ? "bold" : "normal");

      // Background for total row
      if (isTotal) {
        doc.setFillColor(0, 120, 120); // Teal for total income
        doc.rect(col1X - 2, currentY - 6, 150, rowHeight, "F");
      }

      doc.text(row[0], col1X, currentY);
      doc.text(row[1], col2X, currentY, { align: "right" });

      currentY += rowHeight;
    });

    // Footer
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(120, 120, 120);
    doc.text("Generated by Rathnasiri Motors Dashboard", 105, 280, { align: "center" });

    doc.save(`Monthly_Income_${month}.pdf`);
  };

  // UI cards
  const incomeCards = [
    { title: "Sold Bikes", value: totalBikesIncome, icon: <FaMotorcycle size={28} />, color: "bg-white text-blue-700" },
    { title: "Spare Parts", value: totalSpareIncome, icon: <FaTools size={28} />, color: "bg-white text-green-700" },
    { title: "Service & Repair", value: totalServicesIncome, icon: <FaWrench size={28} />, color: "bg-white text-yellow-700" },
    { title: "Insurance Service", value: totalInsuranceService, icon: <FaFileInvoiceDollar size={28} />, color: "bg-white text-purple-700" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-10">
      <div className="max-w-6xl mx-auto p-6 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">Monthly Income Report</h2>

        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={generatePdf}
            disabled={!month}
            className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold rounded-lg shadow-md hover:from-green-600 hover:to-green-800 transition"
          >
            Generate PDF
          </button>
        </div>

        {loading && <div className="text-gray-500 text-center text-lg">Loading data...</div>}

        {!month && !loading && (
          <div className="bg-white p-6 rounded-xl shadow-md text-center text-gray-600 max-w-lg mx-auto">
            <p className="text-lg mb-2">Select a month to view income breakdown</p>
            <p className="text-sm text-gray-400">
              See detailed income from Bikes, Spare Parts, Service, and Insurance.
            </p>
          </div>
        )}

        {month && !loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {incomeCards.map((card, index) => (
              <div
                key={index}
                className={`flex items-center gap-4 p-6 rounded-xl shadow-lg hover:shadow-2xl transition ${card.color}`}
              >
                <div>{card.icon}</div>
                <div>
                  <h2 className="text-xl font-bold">{card.value.toLocaleString()}</h2>
                  <p className="text-sm opacity-80">{card.title}</p>
                </div>
              </div>
            ))}

            <div className="col-span-full bg-gradient-to-r from-green-500 to-green-800 text-white p-6 rounded-xl shadow-lg flex justify-center items-center hover:shadow-2xl transition">
              <div className="text-center">
                <h2 className="text-2xl font-bold">{totalIncome.toLocaleString()}</h2>
                <p className="text-lg opacity-80">Total Income</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MonthlyIncomeReport;
