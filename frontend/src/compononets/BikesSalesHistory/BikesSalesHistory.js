import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function BikesSalesHistory() {
  const navigate = useNavigate();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch all sold bikes
  const fetchSales = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/newBsH");
      // Adjust based on backend: your backend returns { newBsH: [...] }
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

  // Delete a sale
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          New Bikes Sales History
        </h2>

        {loading ? (
          <p className="text-center text-gray-600">Loading sales history...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : sales.length === 0 ? (
          <p className="text-center text-gray-600">No sales history available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl overflow-hidden">
              <thead className="bg-blue-200">
                <tr>
                  <th className="py-3 px-4 text-left text-gray-700 font-semibold uppercase tracking-wide">New/Used</th>
                  <th className="py-3 px-4 text-left text-gray-700 font-semibold uppercase tracking-wide">Model</th>
                  <th className="py-3 px-4 text-left text-gray-700 font-semibold uppercase tracking-wide">Last Price</th>
                  <th className="py-3 px-4 text-left text-gray-700 font-semibold uppercase tracking-wide">Buyer Name</th>
                  <th className="py-3 px-4 text-left text-gray-700 font-semibold uppercase tracking-wide">Contact No</th>
                  <th className="py-3 px-4 text-center text-gray-700 font-semibold uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => (
                  <tr
                    key={sale._id}
                    className="border-b border-gray-200 hover:bg-blue-50 transition-colors duration-200"
                  >
                    <td className="py-3 px-4 text-gray-700">{sale.type}</td>
                    <td className="py-3 px-4 text-gray-700">{sale.model}</td>
                    <td className="py-3 px-4 text-gray-700">Rs. {sale.last_price}</td>
                    <td className="py-3 px-4 text-gray-700">{sale.buyer_name}</td>
                    <td className="py-3 px-4 text-gray-700">{sale.contact_no}</td>
                    <td className="py-3 px-4 text-center space-x-2">
                      <button
                        onClick={() => navigate(`/NewBikesSalesHisForm/${sale._id}`)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(sale._id)}
                        disabled={deletingId === sale._id}
                        className={`px-3 py-1 rounded-lg text-white transition-all duration-200 ${
                          deletingId === sale._id
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-700"
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


      </div>
    </div>
  );
}

export default BikesSalesHistory;
