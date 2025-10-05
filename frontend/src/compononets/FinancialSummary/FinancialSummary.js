import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function FinancialSummary() {
  const [revenueData, setRevenueData] = useState({
    bikes: 0,
    spares: 0,
    service: 0,
    insurance: 0,
  });
  const [expensesData, setExpensesData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get last completed month
  const getLastMonth = () => {
    const now = new Date();
    now.setDate(0); // Go to last day of previous month
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  };

  const [month, setMonth] = useState(getLastMonth());
  //const [month] = useState(getCurrentMonth());


  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      try {
        // Revenue APIs
        const [bikesRes, sparesRes, serviceRes, insuranceRes, expensesRes] =
          await Promise.all([
            axios.get("http://localhost:5000/newBsH"),
            axios.get("http://localhost:5000/spb"),
            axios.get("http://localhost:5000/service-repair-bills"),
            axios.get("http://localhost:5000/api/bills"),
            axios.get("http://localhost:5000/api/expenses"),
          ]);

        const filterByMonth = (items, dateField) =>
          items.filter((item) => {
            const d = new Date(item[dateField]);
            const itemMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
            return itemMonth === month;
          });

        // Revenue calculations
        const bikesIncome = filterByMonth(bikesRes.data.newBsH || [], "date").reduce(
          (sum, b) => sum + Number(b.last_price || 0),
          0
        );

        const groupedSpare = (sparesRes.data.spb || []).reduce((acc, item) => {
          let bill = acc.find((b) => b.bill_no === item.bill_no);
          if (!bill) {
            bill = { bill_no: item.bill_no, date: item.date, items: [] };
            acc.push(bill);
          }
          bill.items.push({ quantity: Number(item.quantity), price: Number(item.price) });
          return acc;
        }, []);
        const sparesIncome = filterByMonth(groupedSpare, "date").reduce(
          (sum, bill) => sum + bill.items.reduce((s, it) => s + it.quantity * it.price, 0),
          0
        );

        const serviceIncome = filterByMonth(serviceRes.data || [], "date").reduce(
          (sum, s) => sum + Number(s.total || 0),
          0
        );

        const insuranceIncome = filterByMonth(insuranceRes.data.bills || [], "createdAt").reduce(
          (sum, b) => sum + Number(b.serviceCharge || 0),
          0
        );

        setRevenueData({ bikes: bikesIncome, spares: sparesIncome, service: serviceIncome, insurance: insuranceIncome });

        // Expenses calculations
        const filteredExpenses = filterByMonth(expensesRes.data || [], "date");
        setExpensesData(filteredExpenses);

      } catch (err) {
        console.error("Failed to fetch financial data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [month]);

  // Totals
  const totalRevenue = Object.values(revenueData).reduce((sum, val) => sum + val, 0);
  const totalExpenses = expensesData.reduce((sum, e) => sum + Number(e.amount), 0);
  const netProfit = totalRevenue - totalExpenses;

  const pieData = {
    labels: ["Revenue", "Expenses", "Net Profit"],
    datasets: [
      {
        data: [totalRevenue, totalExpenses, netProfit > 0 ? netProfit : 0],
        backgroundColor: ["#3b82f6", "#ef4444", "#22c55e"],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-700">
        📊 Financial Summary ({month})
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <div className="p-6 bg-white rounded-2xl shadow-lg border-l-4 border-blue-500">
              <h2 className="text-lg font-semibold text-gray-600">Total Revenue</h2>
              <p className="text-2xl font-bold text-blue-600">LKR {totalRevenue.toLocaleString()}</p>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-lg border-l-4 border-red-500">
              <h2 className="text-lg font-semibold text-gray-600">Total Expenses</h2>
              <p className="text-2xl font-bold text-red-600">LKR {totalExpenses.toLocaleString()}</p>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-lg border-l-4 border-green-500">
              <h2 className="text-lg font-semibold text-gray-600">Net Profit</h2>
              <p className="text-2xl font-bold text-green-600">LKR {netProfit.toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg max-w-xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
              Financial Breakdown
            </h2>
            <Pie data={pieData} />
          </div>
        </>
      )}
    </div>
  );
}

export default FinancialSummary;
