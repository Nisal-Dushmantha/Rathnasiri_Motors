// src/components/CustomReport.js
import React, { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { FaMoneyBillWave, FaCoins, FaChartLine } from "react-icons/fa";

function CustomReport() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [revenues, setRevenues] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const totalRevenue = revenues.reduce((sum, r) => sum + Number(r.amount || r.total || 0), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const netProfit = totalRevenue - totalExpenses;

  const fetchData = async () => {
    if (!fromDate || !toDate) return;
    setLoading(true);
    try {
      const [bikesRes, spareRes, servicesRes, insuranceRes, expensesRes] =
        await Promise.all([
          axios.get("http://localhost:5000/newBsH"),
          axios.get("http://localhost:5000/spb"),
          axios.get("http://localhost:5000/service-repair-bills"),
          axios.get("http://localhost:5000/api/bills"),
          axios.get("http://localhost:5000/api/expenses"),
        ]);

      const start = new Date(fromDate);
      const end = new Date(toDate);

      const filterByDate = (items, dateField) =>
        items.filter((item) => {
          const d = new Date(item[dateField]);
          return d >= start && d <= end;
        });

      const bikes = filterByDate(bikesRes.data.newBsH || [], "date");
      const totalBikes = bikes.map((b) => ({
        type: "Bike Sale",
        date: b.date,
        amount: Number(b.last_price),
      }));

      const rawSpare = spareRes.data.spb || [];
      const groupedSpare = rawSpare.reduce((acc, item) => {
        let bill = acc.find((b) => b.bill_no === item.bill_no);
        if (!bill) {
          bill = { bill_no: item.bill_no, date: item.date, items: [] };
          acc.push(bill);
        }
        bill.items.push({ quantity: Number(item.quantity), price: Number(item.price) });
        return acc;
      }, []);
      const spareIncome = filterByDate(groupedSpare, "date").map((bill) => ({
        type: "Spare Parts",
        date: bill.date,
        amount: bill.items.reduce((s, i) => s + i.quantity * i.price, 0),
      }));

      const services = filterByDate(servicesRes.data || [], "date").map((s) => ({
        type: "Service",
        date: s.date,
        amount: Number(s.total),
      }));

      const insurance = filterByDate(insuranceRes.data.bills || [], "createdAt").map((b) => ({
        type: "Insurance",
        date: b.createdAt,
        amount: Number(b.serviceCharge),
      }));

      setRevenues([...totalBikes, ...spareIncome, ...services, ...insurance]);

      const filteredExpenses = filterByDate(expensesRes.data || [], "date");
      setExpenses(filteredExpenses);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");

    doc.setFillColor(0, 51, 102);
    doc.rect(0, 0, 210, 25, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text("Rathnasiri Motors", 14, 15);
    doc.text("Custom Finance Report", 14, 22);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`Report Period: ${fromDate} ➝ ${toDate}`, 14, 35);

    autoTable(doc, {
      startY: 42,
      head: [["Metric", "Amount (LKR)"]],
      body: [
        ["Total Revenue", totalRevenue.toLocaleString()],
        ["Total Expenses", totalExpenses.toLocaleString()],
        ["Net Profit", netProfit.toLocaleString()],
      ],
      theme: "grid",
      headStyles: { fillColor: [0, 102, 204], textColor: 255, fontStyle: "bold" },
      columnStyles: { 0: { halign: "left" }, 1: { halign: "right" } },
    });

    let y = doc.lastAutoTable.finalY + 10;

    if (revenues.length > 0) {
      autoTable(doc, {
        startY: y,
        head: [["Date", "Type", "Amount (LKR)"]],
        body: revenues.map((r) => [
          new Date(r.date).toLocaleDateString(),
          r.type,
          r.amount.toLocaleString(),
        ]),
        theme: "striped",
        headStyles: { fillColor: [0, 102, 204], textColor: 255 },
        styles: { fontSize: 10 },
        columnStyles: { 2: { halign: "right" } },
      });
      y = doc.lastAutoTable.finalY + 10;
    }

    if (expenses.length > 0) {
      autoTable(doc, {
        startY: y,
        head: [["Date", "Category", "Amount (LKR)"]],
        body: expenses.map((e) => [
          new Date(e.date).toLocaleDateString(),
          e.category,
          e.amount.toLocaleString(),
        ]),
        theme: "striped",
        headStyles: { fillColor: [200, 0, 0], textColor: 255 },
        styles: { fontSize: 10 },
        columnStyles: { 2: { halign: "right" } },
      });
    }

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(100);
      doc.text(
        `Generated by Finance System | Page ${i} of ${pageCount}`,
        14,
        290
      );
    }

    doc.save(`CustomReport_${fromDate}_to_${toDate}.pdf`);
  };

  const exportExcel = () => {
    const data = [
      ...revenues.map((r) => ({ Date: r.date, Type: r.type, Amount: r.amount })),
      ...expenses.map((e) => ({
        Date: e.date,
        Category: e.category,
        Amount: e.amount,
      })),
    ];
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Custom Report");
    XLSX.writeFile(workbook, `CustomReport_${fromDate}_to_${toDate}.xlsx`);
  };

  return (
    <div className="min-h-screen p-10 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <FaChartLine className="text-blue-600" /> Custom Finance Report
      </h1>

      {/* Filter */}
      <div className="flex flex-wrap gap-4 mb-6 items-end">
        <div>
          <label className="block text-gray-700 mb-1 font-medium">From</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => {
              setFromDate(e.target.value);
              if (toDate && e.target.value > toDate) {
                setToDate(""); // reset if invalid
              }
            }}
            max={today} // cannot select future
            className="px-3 py-2 border rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1 font-medium">To</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            min={fromDate || today} // must be >= fromDate
            disabled={!fromDate} // disable until fromDate is picked
            className="px-3 py-2 border rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
          />
        </div>

        <button
          onClick={fetchData}
          disabled={!fromDate || !toDate}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition shadow disabled:opacity-50"
        >
          Generate
        </button>
        <button
          onClick={exportPDF}
          disabled={!revenues.length && !expenses.length}
          className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition shadow disabled:opacity-50"
        >
          📄 Export PDF
        </button>
        <button
          onClick={exportExcel}
          disabled={!revenues.length && !expenses.length}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition shadow disabled:opacity-50"
        >
          📊 Export Excel
        </button>
      </div>

      {loading && <p className="text-gray-500">Loading data...</p>}

      {!loading && (revenues.length > 0 || expenses.length > 0) && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl shadow-md flex items-center gap-4 border-l-4 border-green-500">
            <FaMoneyBillWave className="text-green-500 text-2xl" />
            <div>
              <h2 className="text-md font-semibold text-gray-700">
                Total Revenue
              </h2>
              <p className="text-xl font-bold text-green-600">
                LKR {totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-md flex items-center gap-4 border-l-4 border-red-500">
            <FaCoins className="text-red-500 text-2xl" />
            <div>
              <h2 className="text-md font-semibold text-gray-700">
                Total Expenses
              </h2>
              <p className="text-xl font-bold text-red-600">
                LKR {totalExpenses.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-md flex items-center gap-4 border-l-4 border-blue-500">
            <FaChartLine className="text-blue-500 text-2xl" />
            <div>
              <h2 className="text-md font-semibold text-gray-700">
                Net Profit
              </h2>
              <p className="text-xl font-bold text-blue-600">
                LKR {netProfit.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomReport;
