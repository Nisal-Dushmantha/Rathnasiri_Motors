import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import {
  FaFileInvoiceDollar,
  FaMoneyBillWave,
  FaWallet,
  FaMotorcycle,
  FaTools,
  FaShieldAlt,
} from "react-icons/fa";
import { Chart } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const getCurrentMonth = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

function MonthlyReport() {
  const chartRef = useRef(null);
  const [month, setMonth] = useState(getCurrentMonth());
  const [expenses, setExpenses] = useState([]);
  const [bikes, setBikes] = useState([]);
  const [spareParts, setSpareParts] = useState([]);
  const [services, setServices] = useState([]);
  const [insuranceBills, setInsuranceBills] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!month) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const expRes = await axios.get("http://localhost:5000/api/expenses");
        const allExpenses = expRes.data || [];

        const [bikesRes, spareRes, servicesRes, insuranceRes] = await Promise.all([
          axios.get("http://localhost:5000/newBsH"),
          axios.get("http://localhost:5000/spb"),
          axios.get("http://localhost:5000/service-repair-bills"),
          axios.get("http://localhost:5000/api/bills"),
        ]);

        const filterByMonth = (items, dateField) =>
          items.filter((item) => {
            const d = new Date(item[dateField]);
            const itemMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
              2,
              "0"
            )}`;
            return itemMonth === month;
          });

        setExpenses(filterByMonth(allExpenses, "date"));
        setBikes(filterByMonth(bikesRes.data.newBsH || [], "date"));

        const rawSpare = spareRes.data.spb || [];
        const groupedSpare = rawSpare.reduce((acc, item) => {
          let bill = acc.find((b) => b.bill_no === item.bill_no);
          if (!bill) {
            bill = { bill_no: item.bill_no, date: item.date, items: [] };
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
        console.error("Failed to fetch monthly report:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [month]);

  // Totals
  const totalBikesIncome = bikes.reduce((sum, b) => sum + Number(b.last_price || 0), 0);
  const totalSpareIncome = spareParts.reduce(
    (sum, bill) => sum + bill.items.reduce((s, it) => s + it.quantity * it.price, 0),
    0
  );
  const totalServicesIncome = services.reduce((sum, s) => sum + Number(s.total || 0), 0);
  const totalInsuranceIncome = insuranceBills.reduce(
    (sum, b) => sum + Number(b.serviceCharge || 0),
    0
  );
  const totalRevenue = totalBikesIncome + totalSpareIncome + totalServicesIncome + totalInsuranceIncome;
  const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  const netProfit = totalRevenue - totalExpenses;

  // Professional Bar Chart
  const chartData = {
    labels: ["Bikes", "Spare Parts", "Service", "Insurance", "Expenses", "Net Profit"],
    datasets: [
      {
        label: "Amount (LKR)",
        data: [
          totalBikesIncome,
          totalSpareIncome,
          totalServicesIncome,
          totalInsuranceIncome,
          totalExpenses,
          netProfit,
        ],
        backgroundColor: [
          "#4f81bd",
          "#c0504d",
          "#9bbb59",
          "#8064a2",
          "#f79646",
          "#4bacc6",
        ],
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        grid: { color: "#e5e5e5" },
        ticks: {
          beginAtZero: true,
          callback: (value) => value.toLocaleString(),
        },
      },
    },
  };

  // PDF export with chart
  const exportPDF = () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "A4" });

    // Header
    doc.setFontSize(20);
    doc.setTextColor("#2e3e5c");
    doc.setFont("helvetica", "bold");
    doc.text("Rathnasiri Motors", 40, 50);

    doc.setFontSize(16);
    doc.setTextColor("#4f81bd");
    doc.text("Monthly Financial Report", 40, 80);

    doc.setFontSize(12);
    doc.setTextColor("#000");
    doc.text(
      `Month: ${new Date(`${month}-01`).toLocaleString("default", {
        month: "long",
        year: "numeric",
      })}`,
      40,
      100
    );

    // Summary Table
    const summary = [
      ["Total Revenue", totalRevenue.toFixed(2) + " LKR"],
      ["Total Expenses", totalExpenses.toFixed(2) + " LKR"],
      ["Net Profit", netProfit.toFixed(2) + " LKR"],
    ];

    autoTable(doc, {
      startY: 130,
      head: [["Metric", "Amount (LKR)"]],
      body: summary,
      theme: "grid",
      headStyles: { fillColor: "#4f81bd", textColor: "#fff", fontStyle: "bold" },
      bodyStyles: { fontSize: 12 },
      alternateRowStyles: { fillColor: "#f3f6fb" },
    });

    // Add chart as image
    if (chartRef.current) {
      const chartCanvas = chartRef.current.canvas;
      const chartImg = chartCanvas.toDataURL("image/png", 1.0);
      doc.addImage(chartImg, "PNG", 40, doc.lastAutoTable.finalY + 20, 520, 250);
    }

    // Footer
   const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(
      `Generated by Finance System | Page ${i} of ${pageCount}`,
      40, // X position (left padding)
      820 // Y position (bottom of A4 = ~842pt, keep some margin)
    );
  }

    doc.save(`MonthlyReport_${month}.pdf`);
  };

  // Excel Export
  const exportExcel = () => {
    const data = [
      { Metric: "Total Revenue", Amount: totalRevenue },
      { Metric: "Total Expenses", Amount: totalExpenses },
      { Metric: "Net Profit", Amount: netProfit },
    ];
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Monthly Report");
    XLSX.writeFile(wb, `MonthlyReport_${month}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">📊 Monthly Report</h1>

      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <button
          onClick={exportPDF}
          disabled={!month}
          className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-2 rounded-xl font-semibold shadow-lg hover:from-green-600 hover:to-green-700 transition"
        >
          📄Export PDF
        </button>
        <button
          onClick={exportExcel}
          disabled={!month}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          📊 Export Excel
        </button>
      </div>

      {loading && <div className="text-gray-500 text-center">Loading data...</div>}

      {!loading && month && (
        <>
          {/* Revenue Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
            <div className="p-6 bg-white text-gray-800 rounded-2xl shadow-md flex items-center gap-4 border-l-4 border-blue-500">
              <FaMotorcycle size={36} className="text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Bikes Income</p>
                <h2 className="text-2xl font-bold">{totalBikesIncome.toLocaleString()} LKR</h2>
              </div>
            </div>
            <div className="p-6 bg-white text-gray-800 rounded-2xl shadow-md flex items-center gap-4 border-l-4 border-orange-500">
              <FaTools size={36} className="text-orange-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Spare Parts Income</p>
                <h2 className="text-2xl font-bold">{totalSpareIncome.toLocaleString()} LKR</h2>
              </div>
            </div>
            <div className="p-6 bg-white text-gray-800 rounded-2xl shadow-md flex items-center gap-4 border-l-4 border-green-500">
              <FaWallet size={36} className="text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Service Income</p>
                <h2 className="text-2xl font-bold">{totalServicesIncome.toLocaleString()} LKR</h2>
              </div>
            </div>
            <div className="p-6 bg-white text-gray-800 rounded-2xl shadow-md flex items-center gap-4 border-l-4 border-purple-500">
              <FaShieldAlt size={36} className="text-purple-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Insurance Income</p>
                <h2 className="text-2xl font-bold">{totalInsuranceIncome.toLocaleString()} LKR</h2>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <div className="p-6 bg-white text-gray-800 rounded-2xl shadow-md flex items-center gap-4 border-l-4 border-indigo-500">
              <FaMoneyBillWave size={36} className="text-indigo-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <h2 className="text-2xl font-bold">{totalRevenue.toLocaleString()} LKR</h2>
              </div>
            </div>
            <div className="p-6 bg-white text-gray-800 rounded-2xl shadow-md flex items-center gap-4 border-l-4 border-red-500">
              <FaFileInvoiceDollar size={36} className="text-red-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Total Expenses</p>
                <h2 className="text-2xl font-bold">{totalExpenses.toLocaleString()} LKR</h2>
              </div>
            </div>
            <div className="p-6 bg-white text-gray-800 rounded-2xl shadow-md flex items-center gap-4 border-l-4 border-teal-500">
              <FaWallet size={36} className="text-teal-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Net Profit</p>
                <h2 className="text-2xl font-bold">{netProfit.toLocaleString()} LKR</h2>
              </div>
            </div>
          </div>

          {/* Professional Bar Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Monthly Breakdown</h2>
            <Chart ref={chartRef} type="bar" data={chartData} options={chartOptions} />
          </div>
        </>
      )}
    </div>
  );
}

export default MonthlyReport;
