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
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col items-center">
        <div className="w-full max-w-7xl bg-white rounded-2xl shadow-2xl border border-gray-200">
          <h2 className="text-2xl font-bold text-blue-700 mb-4 px-8 pt-8 text-left">
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
              <table className="min-w-full bg-white rounded-xl table-auto">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="py-4 px-6 text-base font-semibold border-b border-gray-200 text-left">Name</th>
                    <th className="py-4 px-6 text-base font-semibold border-b border-gray-200 text-left">NIC</th>
                    <th className="py-4 px-6 text-base font-semibold border-b border-gray-200 text-left">License No</th>
                    <th className="py-4 px-6 text-base font-semibold border-b border-gray-200 text-left">Contact</th>
                    <th className="py-4 px-6 text-base font-semibold border-b border-gray-200 text-left">Bike Model</th>
                    <th className="py-4 px-6 text-base font-semibold border-b border-gray-200 text-left">Chassis No</th>
                    <th className="py-4 px-6 text-base font-semibold border-b border-gray-200 text-left">Date</th>
                    <th className="py-4 px-6 text-base font-semibold border-b border-gray-200 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr
                      key={report._id}
                      className="border-b border-gray-200 hover:bg-blue-50 transition-colors duration-200"
                    >
                      <td className="py-3 px-6 text-gray-700">{report.name}</td>
                      <td className="py-3 px-6 text-gray-700">{report.NIC}</td>
                      <td className="py-3 px-6 text-gray-700">{report.license_no}</td>
                      <td className="py-3 px-6 text-gray-700">{report.contact_no}</td>
                      <td className="py-3 px-6 text-gray-700">{report.bike_model}</td>
                      <td className="py-3 px-6 text-gray-700">{report.chassis_no}</td>
                      <td className="py-3 px-6 text-gray-700">
                        {report.date
                          ? new Date(report.date).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="py-3 px-6 text-center flex justify-center gap-2">
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
    </div>
  );
}

export default BikeSalesReport;
