import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../ui/Card";

function RevenueManagement() {
  const [bikeSales, setBikeSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/newBsH"); // Fetch all bike sales
        const salesData = Array.isArray(res.data.newBsH) ? res.data.newBsH : [];
        setBikeSales(salesData);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch bike sales.");
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, []);

  // Get current month and year
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Filter sales for current month
  const monthlyBikeSales = bikeSales.filter((sale) => {
    const date = new Date(sale.date || sale.createdAt);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  // Calculate total income for the month
  const totalBikeIncome = monthlyBikeSales.reduce(
    (sum, sale) => sum + Number(sale.last_price || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">Revenue Management</h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading sales data...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          {/* Monthly Income Card */}
          <div className="mb-6">
            <Card className="p-4 bg-white shadow rounded-xl">
              <h2 className="text-xl font-semibold text-gray-700">Monthly Bike Income</h2>
              <p className="text-2xl font-bold text-green-600 mt-2">
                Rs. {totalBikeIncome.toLocaleString()}
              </p>
            </Card>
          </div>

          {/* Table of Monthly Bike Sales */}
          <Card className="overflow-x-auto bg-white shadow rounded-xl">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left font-semibold">Date</th>
                  <th className="py-3 px-4 text-left font-semibold">New/Used</th>
                  <th className="py-3 px-4 text-left font-semibold">Model</th>
                  <th className="py-3 px-4 text-left font-semibold">Price</th>
                  <th className="py-3 px-4 text-left font-semibold">Buyer</th>
                  <th className="py-3 px-4 text-left font-semibold">Contact</th>
                </tr>
              </thead>
              <tbody>
                {monthlyBikeSales.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-4 text-center text-gray-500">
                      No bike sales this month.
                    </td>
                  </tr>
                ) : (
                  monthlyBikeSales.map((sale) => (
                    <tr key={sale._id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">
                        {new Date(sale.date || sale.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-4">{sale.type}</td>
                      <td className="py-2 px-4">{sale.model}</td>
                      <td className="py-2 px-4">Rs. {Number(sale.last_price).toLocaleString()}</td>
                      <td className="py-2 px-4">{sale.buyer_name}</td>
                      <td className="py-2 px-4">{sale.contact_no}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </Card>
        </>
      )}
    </div>
  );
}

export default RevenueManagement;
