import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function BikeReportView() {
  const { id } = useParams();
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

    // Dynamic PDF size based on content
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

          {/* Invoice Date & Time on Right */}
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
            <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-semibold">
              COMPLETED
            </span>
          </div>
        </div>

        {/* Customer Information - Modern UI */}
        <div className="bg-white/80 p-10 rounded-2xl border border-blue-200 mb-10 shadow-sm">
            <h2 className="font-bold text-blue-900 text-2xl mb-8 tracking-wide underline decoration-blue-900 decoration-4 underline-offset-4">Customer Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-3 text-gray-800">
            <div>
              <div className="text-xs text-blue-800 uppercase font-bold tracking-wider mb-1">Name</div>
              <div className="text-lg font-medium">{report.name}</div>
            </div>
            <div>
              <div className="text-xs text-blue-800 uppercase font-bold tracking-wider mb-1">NIC</div>
              <div className="text-lg font-medium">{report.NIC}</div>
            </div>
            <div>
              <div className="text-xs text-blue-800 uppercase font-bold tracking-wider mb-1">License No</div>
              <div className="text-lg font-medium">{report.license_no}</div>
            </div>
            <div>
              <div className="text-xs text-blue-800 uppercase font-bold tracking-wider mb-1">Contact No</div>
              <div className="text-lg font-medium">{report.contact_no}</div>
            </div>
            <div className="sm:col-span-2">
              <div className="text-xs text-blue-800 uppercase font-bold tracking-wider mb-1">Address</div>
              <div className="text-lg font-medium">{report.address}</div>
            </div>
          </div>
        </div>

        {/* Bike Details - Modern UI */}
        <div className="bg-white/80 p-10 rounded-2xl border border-blue-200 mb-5 shadow-sm">
            <h2 className="font-bold text-blue-900 text-2xl mb-8 tracking-wide underline decoration-blue-900 decoration-4 underline-offset-4">Bike Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-3 text-gray-800">
            <div>
              <div className="text-xs text-blue-800 uppercase font-bold tracking-wider mb-1">Model</div>
              <div className="text-lg font-medium">{report.bike_model}</div>
            </div>
            <div>
              <div className="text-xs text-blue-800 uppercase font-bold tracking-wider mb-1">Color</div>
              <div className="text-lg font-medium">{report.color}</div>
            </div>
            <div>
              <div className="text-xs text-blue-800 uppercase font-bold tracking-wider mb-1">Chassis No</div>
              <div className="text-lg font-medium">{report.chassis_no}</div>
            </div>
            <div>
              <div className="text-xs text-blue-800 uppercase font-bold tracking-wider mb-1">Registration Year</div>
              <div className="text-lg font-medium">{report.reg_year}</div>
            </div>
          </div>
        </div>


        {/* Price and Signature Row - Same Line */}
        <div className="flex flex-row justify-between items-end mt-12 mb-12 w-full">
          {/* Last Price - Left */}
          <div className="flex flex-col items-start">
            <p className="text-xl font-semibold text-gray-500 mb-1">Total Price :</p>
            <div className="rounded-lg px-10 py-2 font-bold text-blue-900 text-3xl  shadow-sm">
              Rs. {report.last_price}
            </div>
          </div>
          {/* Signature - Right */}
          <div className="flex flex-col items-end">
            <div className="w-56 h-14 border-b-2 border-gray-400 mb-1 mr-2"></div>
            <p className="text-lg text-gray-700 mt-1 mr-2 font-bold">Authorized Signature</p>
  
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-gray-200 pt-6 text-center">
          <p className="font-semibold text-gray-800 mb-2">Quality Service | Expert Team | Customer Satisfaction</p>
          <p className="text-sm text-gray-600">Thank you for choosing Rathnasiri Motors! We appreciate your business.</p>
        </div>
      </div>

      {/* Download PDF Button - Shorter */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleDownloadPDF}
          className="bg-gradient-to-r from-green-600 to-green-900 text-white px-6 py-3 rounded-lg font-bold shadow-lg  hover:to-green-700 transition-all"
        >
          📄 Download Report
        </button>
      </div>
    </div>
  );
}

export default BikeReportView;
