// VehicleHistory.js
import React, {  useEffect, useState, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function VehicleHistory() {
  const [serviceJobs, setServiceJobs] = useState([]);
  const [repairJobs, setRepairJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const pdfRef = useRef(null);

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

  // PDF Export - capture styled template similar to ServiceDocument
  const downloadPDF = async () => {
    const container = pdfRef.current;
    if (!container) return;

    // Render to canvas at high scale for clarity
    const canvas = await html2canvas(container, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");

    // Convert container px to mm for exact page size
    const divWidth = container.offsetWidth; // px
    const divHeight = container.offsetHeight; // px
    const widthMM = divWidth * 0.264583; // 1px = 0.264583mm
    const heightMM = divHeight * 0.264583;

    const pdf = new jsPDF({
      orientation: widthMM > heightMM ? "landscape" : "portrait",
      unit: "mm",
      format: [widthMM, heightMM],
    });

    pdf.addImage(imgData, "PNG", 0, 0, widthMM, heightMM);
    pdf.save("Rathnasiri_Motors_Vehicle_History.pdf");
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

  const includeService = filter === "All" || filter === "Service";
  const includeRepair = filter === "All" || filter === "Repair";

  const now = new Date();
  const dateStr = now.toLocaleDateString();
  const timeStr = now.toLocaleTimeString();

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

        {/* Table (on-screen view) */}
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

        {/* Printable template (styled like ServiceDocument). Keep offscreen but rendered so html2canvas can capture. */}
        <div className="absolute -left-[10000px] top-0">
          <div
            ref={pdfRef}
            className="bg-white border-2 border-gray-200 rounded-lg shadow-sm overflow-hidden mx-auto"
            style={{ width: 794 }}
          >
            {/* Header with gradient background */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold mb-1">RATHNASIRI MOTORS</h1>
                  <p className="text-blue-100 text-lg">Vehicle Repair & Service Center</p>
                  <div className="mt-3 space-y-1 text-blue-100 text-sm">
                    <p>📍 123 Main Street, Colombo, Sri Lanka</p>
                    <p>📞 +94 77 123 4567 | 📧 info@rathnasirimotors.com</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                    <p className="text-blue-100 text-sm font-medium">REPORT DATE</p>
                    <p className="text-white text-lg font-semibold">{dateStr}</p>
                    <p className="text-blue-100 text-sm">{timeStr}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              {/* Title and filter info */}
              <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-gray-600 text-sm font-medium">REPORT</p>
                  <p className="text-xl font-bold text-gray-800">Vehicle History</p>
                  <p className="text-sm text-gray-500 mt-1">Filter: {filter}</p>
                </div>
                <div className="text-right">
                  <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {includeService && includeRepair ? "Service & Repair" : includeService ? "Service" : "Repair"}
                  </span>
                </div>
              </div>

              {/* Service Jobs Table */}
              {includeService && filteredServices.length > 0 && (
                <div className="mb-6">
                  <h2 className="font-bold text-gray-800 text-lg mb-3 flex items-center">
                    <span className="mr-2">🛠️</span>
                    Service Jobs
                  </h2>
                  <div className="overflow-hidden rounded-lg border">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-blue-600 text-white">
                        <tr>
                          <th className="px-4 py-2">Plate Number</th>
                          <th className="px-4 py-2">Vehicle</th>
                          <th className="px-4 py-2">Request</th>
                          <th className="px-4 py-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredServices.map((job, i) => (
                          <tr key={i} className={i % 2 ? "bg-gray-50" : "bg-white"}>
                            <td className="px-4 py-2 border-t">{job?.VehicleNumber || "N/A"}</td>
                            <td className="px-4 py-2 border-t">{`${job?.VehicleType || "N/A"} ${job?.Model || ""}`}</td>
                            <td className="px-4 py-2 border-t">{job?.Requests || "No details"}</td>
                            <td className="px-4 py-2 border-t">{job?.Status || "Completed"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Repair Jobs Table */}
              {includeRepair && filteredRepairs.length > 0 && (
                <div className="mb-6">
                  <h2 className="font-bold text-gray-800 text-lg mb-3 flex items-center">
                    <span className="mr-2">🔧</span>
                    Repair Jobs
                  </h2>
                  <div className="overflow-hidden rounded-lg border">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-red-600 text-white">
                        <tr>
                          <th className="px-4 py-2">Plate Number</th>
                          <th className="px-4 py-2">Vehicle</th>
                          <th className="px-4 py-2">Details</th>
                          <th className="px-4 py-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRepairs.map((job, i) => (
                          <tr key={i} className={i % 2 ? "bg-gray-50" : "bg-white"}>
                            <td className="px-4 py-2 border-t">{job?.VehicleNumber || "N/A"}</td>
                            <td className="px-4 py-2 border-t">{`${job?.VehicleType || "N/A"} ${job?.Model || ""}`}</td>
                            <td className="px-4 py-2 border-t">{job?.Details || "No details"}</td>
                            <td className="px-4 py-2 border-t">{job?.Status || "Completed"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="border-t-2 border-gray-200 pt-6">
                <div className="grid md:grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="font-semibold text-gray-800">Quality Service</p>
                    <p className="text-sm text-gray-600">Professional & Reliable</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Expert Technicians</p>
                    <p className="text-sm text-gray-600">Certified & Experienced</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Customer Satisfaction</p>
                    <p className="text-sm text-gray-600">Your Trust, Our Priority</p>
                  </div>
                </div>
                <div className="text-center mt-6 pt-4 border-t border-gray-200">
                  <p className="text-lg font-bold text-blue-600">Thank you for choosing Rathnasiri Motors!</p>
                  <p className="text-sm text-gray-600 mt-1">We appreciate your business</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VehicleHistory;
