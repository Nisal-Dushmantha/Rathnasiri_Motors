// InsuranceHistory.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Download, Search, Filter } from "lucide-react";

function InsuranceHistory() {
  const [insurances, setInsurances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchInsurances = async () => {
      try {
        const res = await axios.get("http://localhost:5000/insurances");
        setInsurances(res.data.insurances || []);
      } catch (err) {
        console.error("Error fetching insurance history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInsurances();
  }, []);

  // PDF Export
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Insurance History Report", 14, 20);

    if (insurances.length > 0) {
      doc.setFontSize(12);
      autoTable(doc, {
        startY: 30,
        head: [
          [
            "Full Name",
            "Vehicle Number",
            "Vehicle Type",
            "Vehicle Model",
            "Engine No",
            "Chassis No",
            "Start Date",
            "End Date",
          ],
        ],
        body: insurances
          .filter(
            (item) =>
              filter === "All" ||
              (filter === "Active" &&
                new Date(item.StartDate) <= new Date() &&
                new Date(item.EndDate) >= new Date()) ||
              (filter === "Expired" && new Date(item.EndDate) < new Date())
          )
          .map((item) => [
            item.fullname || "N/A",
            item.RegistrationNo || "N/A",
            item.VehicleType || "N/A",
            item.VehicleModel || "N/A",
            item.EngineNo || "N/A",
            item.ChassisNo || "N/A",
            item.StartDate ? item.StartDate.substring(0, 10) : "N/A",
            item.EndDate ? item.EndDate.substring(0, 10) : "N/A",
          ]),
        styles: { fontSize: 10 },
        headStyles: { fillColor: [66, 133, 244], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
      });
    }

    doc.setFontSize(9);
    doc.text(
      `Generated on: ${new Date().toLocaleString()}`,
      14,
      doc.internal.pageSize.height - 10
    );
    doc.save("InsuranceHistory.pdf");
  };

  if (loading)
    return (
      <div className="p-10 text-center text-lg text-gray-600">
        Loading insurance history...
      </div>
    );

  // Filtering & Searching
  const filteredInsurances = insurances.filter(
    (item) =>
      (item.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.RegistrationNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.VehicleType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.VehicleModel?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filter === "All" ||
        (filter === "Active" &&
          new Date(item.StartDate) <= new Date() &&
          new Date(item.EndDate) >= new Date()) ||
        (filter === "Expired" && new Date(item.EndDate) < new Date()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-10 px-6 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-7xl mb-8">
        <h1 className="text-4xl font-extrabold text-blue-800 tracking-tight">
          📊 Insurance History
        </h1>
        <p className="text-gray-600 mt-2">
          Search, filter, and export your vehicle insurance history.
        </p>
      </div>

      {/* Search, Filter, Actions */}
      <div className="w-full max-w-7xl bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 p-4 mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Name, Vehicle Number, Model..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Filter & Download */}
        <div className="flex gap-3">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 shadow-sm">
            <Filter className="text-gray-500" size={18} />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-transparent outline-none text-gray-700 font-medium"
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Expired">Expired</option>
            </select>
          </div>

          <button
            onClick={downloadPDF}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-2 rounded-xl font-semibold shadow-lg hover:from-green-600 hover:to-green-700 transition"
          >
            <Download size={18} />
            Export PDF
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-4 px-6 text-left">Full Name</th>
                <th className="py-4 px-6 text-left">Vehicle Number</th>
                <th className="py-4 px-6 text-left">Type</th>
                <th className="py-4 px-6 text-left">Model</th>
                <th className="py-4 px-6 text-left">Engine No</th>
                <th className="py-4 px-6 text-left">Chassis No</th>
                <th className="py-4 px-6 text-left">Start Date</th>
                <th className="py-4 px-6 text-left">End Date</th>
                <th className="py-4 px-6 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredInsurances.map((item, idx) => {
                const isActive =
                  new Date(item.StartDate) <= new Date() &&
                  new Date(item.EndDate) >= new Date();

                return (
                  <tr
                    key={idx}
                    className="hover:bg-blue-50 transition border-b last:border-none"
                  >
                    <td className="py-3 px-6 text-gray-800">
                      {item.fullname || "N/A"}
                    </td>
                    <td className="py-3 px-6 text-gray-800">
                      {item.RegistrationNo || "N/A"}
                    </td>
                    <td className="py-3 px-6 text-gray-800">
                      {item.VehicleType || "N/A"}
                    </td>
                    <td className="py-3 px-6 text-gray-800">
                      {item.VehicleModel || "N/A"}
                    </td>
                    <td className="py-3 px-6 text-gray-800">
                      {item.EngineNo || "N/A"}
                    </td>
                    <td className="py-3 px-6 text-gray-800">
                      {item.ChassisNo || "N/A"}
                    </td>
                    <td className="py-3 px-6 text-gray-800">
                      {item.StartDate?.substring(0, 10) || "N/A"}
                    </td>
                    <td className="py-3 px-6 text-gray-800">
                      {item.EndDate?.substring(0, 10) || "N/A"}
                    </td>
                    <td className="py-3 px-6">
                      <span
                        className={`px-3 py-1 text-sm font-semibold rounded-full ${
                          isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {isActive ? "Active" : "Expired"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default InsuranceHistory;
