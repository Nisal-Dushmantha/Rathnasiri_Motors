import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function BikeReportView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const reportRef = useRef();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/bikeSalesReports/${id}`
        );
        setReport(res.data.reports);
      } catch (err) {
        console.error("Error fetching report:", err);
        setError("Failed to load report");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  const handleDownloadPDF = async () => {
    if (!reportRef.current || !report) return;

    const canvas = await html2canvas(reportRef.current, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdfWidth = canvas.width * 0.264583;
    const pdfHeight = canvas.height * 0.264583;

    const pdf = new jsPDF({
      orientation: pdfWidth > pdfHeight ? "landscape" : "portrait",
      unit: "mm",
      format: [pdfWidth, pdfHeight],
    });

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`BikeReport_${report?.name || "Report"}.pdf`);
  };

  if (loading)
    return <p className="text-center text-gray-600">Loading report...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!report)
    return <p className="text-center text-gray-600">Report not found</p>;

  const now = new Date();
  const dateStr = now.toLocaleDateString();
  const timeStr = now.toLocaleTimeString();

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center flex-col items-center">
      {/* PDF Content */}
      <div
        ref={reportRef}
        className="bg-white border-2 border-gray-200 rounded-xl shadow-lg p-6 w-full max-w-4xl"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-lg mb-6 flex justify-between items-start">
          <div className="text-left">
            <h1 className="text-3xl font-bold mb-1">RATHNASIRI MOTORS</h1>
            <p className="text-lg text-blue-100 mb-2">Bike Sales Report</p>
            <div className="text-blue-100 text-sm">
              <p>📍 123 Main Street, Colombo, Sri Lanka</p>
              <p>📞 +94 77 123 4567 | 📧 info@rathnasirimotors.com</p>
            </div>
          </div>

          {/* Invoice Date & Time */}
          <div className="text-right bg-white bg-opacity-20 rounded-lg p-2 inline-block mt-2">
            <p className="text-sm text-blue-100 font-medium">Invoice Date & Time</p>
            <p className="text-white font-semibold">{dateStr} ⏰ {timeStr}</p>
          </div>
        </div>

        {/* Report ID & Status */}
        <div className="flex justify-between items-center mb-6 p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-gray-600 text-sm font-medium">REPORT ID</p>
            <p className="text-xl font-bold text-gray-800">{report._id || id}</p>
          </div>
          <div className="text-right">
            <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
              COMPLETED
            </span>
          </div>
        </div>

        {/* Customer Information */}
        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 mb-6">
          <h2 className="font-bold text-gray-800 text-lg mb-3 flex items-center">
            <span className="mr-2">👤</span> Customer Information
          </h2>
          <div className="space-y-3 text-gray-700">
            <p><span className="font-bold">Name:</span> {report.name}</p>
            <p><span className="font-bold">NIC:</span> {report.NIC}</p>
            <p><span className="font-bold">License No:</span> {report.license_no}</p>
            <p><span className="font-bold">Contact No:</span> {report.contact_no}</p>
            <p><span className="font-bold">Address:</span> {report.address}</p>
          </div>
        </div>

        {/* Bike Details */}
        <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500 mb-6">
          <h2 className="font-bold text-gray-800 text-lg mb-3 flex items-center">
            <span className="mr-2">🏍️</span> Bike Details
          </h2>
          <div className="space-y-3 text-gray-700">
            <p><span className="font-bold">Model:</span> {report.bike_model}</p>
            <p><span className="font-bold">Color:</span> {report.color}</p>
            <p><span className="font-bold">Chassis No:</span> {report.chassis_no}</p>
            <p><span className="font-bold">Registration Year:</span> {report.reg_year}</p>
          </div>
        </div>

        {/* Last Price */}
        <div className="mb-5 flex flex-col items-center">
          <p className="text-xl text-gray-500 mb-2">Last Price</p>
          <div className="font-bold text-black-900 text-center text-4xl">
            Rs. {report.last_price}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-gray-200 pt-6 text-center">
          <p className="font-semibold text-gray-800 mb-2">Quality Service | Expert Team | Customer Satisfaction</p>
          <p className="text-sm text-gray-600">Thank you for choosing Rathnasiri Motors! We appreciate your business.</p>
        </div>
      </div>

      {/* Buttons: Back on left, Download on right */}
      <div className="mt-6 w-full max-w-4xl flex justify-between">
        <button
          onClick={() => navigate("/BikeSalesReport")}
          className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold shadow hover:bg-gray-300 transition-all"
        >
          🔙 Back
        </button>

        <button
          onClick={handleDownloadPDF}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all"
        >
          📄 Download Report
        </button>
      </div>
    </div>
  );
}

export default BikeReportView;
