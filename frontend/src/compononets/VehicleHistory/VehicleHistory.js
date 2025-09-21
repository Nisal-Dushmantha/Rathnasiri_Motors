// VehicleHistory.js
import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function VehicleHistory() {
  const [serviceJobs, setServiceJobs] = useState([]);
  const [repairJobs, setRepairJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [serviceRes, repairRes] = await Promise.all([
          axios.get("http://localhost:5000/services"),
          axios.get("http://localhost:5000/repairs"),
        ]);
        setServiceJobs(serviceRes.data.services || []);
        setRepairJobs(repairRes.data.repairs || []);
      } catch (err) {
        console.error("Error fetching vehicle history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // PDF Export
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Vehicle History Report", 14, 20);

    // --- Service Jobs Table ---
    if (serviceJobs.length > 0 && (filter === "All" || filter === "Service")) {
      doc.setFontSize(12);
      doc.text("Service Jobs", 14, 35);

      autoTable(doc, {
        startY: 40,
        head: [["Plate Number", "Vehicle", "Request", "Status"]],
        body: serviceJobs.map((job) => [
          job.VehicleNumber || "N/A",
          `${job.VehicleType || ""} ${job.Model || ""}`,
          job.Requests || "No details",
          job.Status || "Completed",
        ]),
        styles: { fontSize: 10 },
        headStyles: { fillColor: [66, 133, 244], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
      });
    }

    // --- Repair Jobs Table ---
    let y = doc.lastAutoTable?.finalY + 15 || 50;
    if (repairJobs.length > 0 && (filter === "All" || filter === "Repair")) {
      doc.setFontSize(12);
      doc.text("Repair Jobs", 14, y);

      autoTable(doc, {
        startY: y + 5,
        head: [["Plate Number", "Vehicle", "Details", "Status"]],
        body: repairJobs.map((job) => [
          job.VehicleNumber || "N/A",
          `${job.VehicleType || ""} ${job.Model || ""}`,
          job.Details || "No details",
          job.Status || "Completed",
        ]),
        styles: { fontSize: 10 },
        headStyles: { fillColor: [220, 53, 69], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
      });
    }

    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(9);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, pageHeight - 10);

    doc.save("VehicleHistory.pdf");
  };

  if (loading) return <div className="p-10 text-center">Loading vehicle history...</div>;

  // --- Filtering & Searching ---
  const filteredServices = serviceJobs.filter(
    (job) =>
      job.VehicleNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.VehicleType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.Model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.Requests?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRepairs = repairJobs.filter(
    (job) =>
      job.VehicleNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.VehicleType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.Model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.Details?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col items-center">
        {/* Search, filter, and download bar */}
        <div className="w-full max-w-7xl flex flex-col sm:flex-row items-center justify-between mb-6 gap-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search With Vehicle Plate Number"
            className="w-full sm:w-2/3 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="flex-1 sm:flex-none px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-200 transition"
            >
              <option value="All">All</option>
              <option value="Service">Service</option>
              <option value="Repair">Repair</option>
            </select>
            <button
              onClick={downloadPDF}
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-green-700 transition flex items-center"
            >
              <span className="mr-2">📄</span>
              Download PDF
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="w-full max-w-7xl bg-white rounded-2xl shadow-2xl border border-gray-200">
          <h2 className="text-2xl font-bold text-blue-700 mb-4 px-8 pt-8 text-left">
            Vehicle Service & Repair History
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl table-auto">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="py-4 px-6 text-base font-semibold border-b border-gray-200 text-left">Type</th>
                  <th className="py-4 px-6 text-base font-semibold border-b border-gray-200 text-left">Vehicle Plate Number</th>
                  <th className="py-4 px-6 text-base font-semibold border-b border-gray-200 text-left">Vehicle</th>
                  <th className="py-4 px-6 text-base font-semibold border-b border-gray-200 text-left">Request/Details</th>
                  <th className="py-4 px-6 text-base font-semibold border-b border-gray-200 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {(filter === "All" || filter === "Service") &&
                  filteredServices.map((job, idx) => (
                    <tr key={"service-" + idx} className="hover:bg-blue-50 transition">
                      <td className="py-3 px-6 text-blue-700 font-bold bg-blue-50 rounded-l-xl">Service</td>
                      <td className="py-3 px-6 text-gray-800">{job?.VehicleNumber || "N/A"}</td>
                      <td className="py-3 px-6 text-gray-800">
                        {job?.VehicleType || "N/A"} {job?.Model || ""}
                      </td>
                      <td className="py-3 px-6 text-gray-700">{job?.Requests || "No details"}</td>
                      <td className="py-3 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            job?.Status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {job?.Status || "Completed"}
                        </span>
                      </td>
                    </tr>
                  ))}

                {(filter === "All" || filter === "Repair") &&
                  filteredRepairs.map((job, idx) => (
                    <tr key={"repair-" + idx} className="hover:bg-red-50 transition">
                      <td className="py-3 px-6 text-red-700 font-bold bg-red-50 rounded-l-xl">Repair</td>
                      <td className="py-3 px-6 text-gray-800">{job?.VehicleNumber || "N/A"}</td>
                      <td className="py-3 px-6 text-gray-800">
                        {job?.VehicleType || "N/A"} {job?.Model || ""}
                      </td>
                      <td className="py-3 px-6 text-gray-700">{job?.Details || "No details"}</td>
                      <td className="py-3 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            job?.Status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {job?.Status || "Completed"}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VehicleHistory;
