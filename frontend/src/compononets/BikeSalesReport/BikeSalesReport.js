import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function BikeSalesReport() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get("http://localhost:5000/bikeSalesReports/");
        setReports(res.data.reports || []);
      } catch (err) {
        console.error("Error fetching reports:", err);
        setError("Failed to fetch reports");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleView = (id) => {
    navigate(`/BikeReportView/${id}`);
  };

  const handleDelete = async (id, name) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the report for ${name}?`
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/bikeSalesReports/${id}`);
      alert("Report deleted successfully!");
      setReports((prev) => prev.filter((report) => report._id !== id));
    } catch (err) {
      console.error("Error deleting report:", err);
      alert("Failed to delete the report. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
        <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">
          Bike Sales Reports
        </h2>

        {loading ? (
          <p className="text-center text-gray-600">Loading reports...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : reports.length === 0 ? (
          <p className="text-center text-gray-600">No reports found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl overflow-hidden">
              <thead className="bg-blue-200">
                <tr>
                  <th className="py-3 px-4 text-left text-gray-700 font-bold uppercase tracking-wide">
                    Name
                  </th>
                  <th className="py-3 px-4 text-left text-gray-700 font-bold uppercase tracking-wide">
                    NIC
                  </th>
                  <th className="py-3 px-4 text-left text-gray-700 font-bold uppercase tracking-wide">
                    License No
                  </th>
                  <th className="py-3 px-4 text-left text-gray-700 font-bold uppercase tracking-wide">
                    Contact
                  </th>
                  <th className="py-3 px-4 text-left text-gray-700 font-bold uppercase tracking-wide">
                    Bike Model
                  </th>
                  <th className="py-3 px-4 text-left text-gray-700 font-bold uppercase tracking-wide">
                    Chassis No
                  </th>
                  <th className="py-3 px-4 text-center text-gray-700 font-bold uppercase tracking-wide">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr
                    key={report._id}
                    className="border-b border-gray-200 hover:bg-blue-50 transition-colors duration-200"
                  >
                    <td className="py-3 px-4 text-gray-700">{report.name}</td>
                    <td className="py-3 px-4 text-gray-700">{report.NIC}</td>
                    <td className="py-3 px-4 text-gray-700">{report.license_no}</td>
                    <td className="py-3 px-4 text-gray-700">{report.contact_no}</td>
                    <td className="py-3 px-4 text-gray-700">{report.bike_model}</td>
                    <td className="py-3 px-4 text-gray-700">{report.chassis_no}</td>
                    <td className="py-3 px-4 text-center flex justify-center gap-2">
                      <button
                        onClick={() => handleView(report._id)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDelete(report._id, report.name)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200"
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
    </div>
  );
}

export default BikeSalesReport;
