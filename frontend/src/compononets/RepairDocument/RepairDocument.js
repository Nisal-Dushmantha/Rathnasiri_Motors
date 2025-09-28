import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function RepairDocument({ id, onClose }) {
  const [job, setJob] = useState(null);
  const invoiceRef = useRef(); // Only capture this for PDF

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/repairs/${id}`);
        setJob(res.data.repairs || res.data);
      } catch (err) {
        console.error("Error fetching job:", err);
      }
    };
    if (id) fetchJob();
  }, [id]);

  const downloadPDF = async () => {
    if (!invoiceRef.current || !job) return;

    const canvas = await html2canvas(invoiceRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const divWidth = invoiceRef.current.offsetWidth;
    const divHeight = invoiceRef.current.offsetHeight;

    const widthMM = divWidth * 0.264583;
    const heightMM = divHeight * 0.264583;

    const pdf = new jsPDF({
      orientation: widthMM > heightMM ? "landscape" : "portrait",
      unit: "mm",
      format: [widthMM, heightMM],
    });

    pdf.addImage(imgData, "PNG", 0, 0, widthMM, heightMM);
    pdf.save(`Invoice_${job?.Name}_${job?.VehicleNumber}.pdf`);
  };

  if (!job) return <p className="text-center p-4">Loading job details...</p>;

  const now = new Date();
  const dateStr = now.toLocaleDateString();
  const timeStr = now.toLocaleTimeString();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-6 w-full max-w-5xl h-[90vh] overflow-hidden relative flex flex-col">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-2xl transition-colors z-10"
        >
          ✕
        </button>

        {/* Invoice preview - Scrollable container */}
        <div className="flex-1 overflow-auto pr-2">
          <div
            ref={invoiceRef}
            className="bg-white border-2 border-gray-200 rounded-lg shadow-sm overflow-hidden max-w-4xl mx-auto"
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
                    <p className="text-blue-100 text-sm font-medium">INVOICE DATE</p>
                    <p className="text-white text-lg font-semibold">{dateStr}</p>
                    <p className="text-blue-100 text-sm">{timeStr}</p>
                  </div>
                </div>
              </div>
            </div>              {/* Invoice Details */}
            <div className="p-6">
              {/* Invoice Number and Status */}
              <div className="flex justify-between items-center mb-6 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-gray-600 text-sm font-medium">INVOICE #</p>
                  <p className="text-xl font-bold text-gray-800">{job?._id || "N/A"}</p>
                  {job?.JobCreatedDate && (
                    <p className="text-sm text-gray-500 mt-1">
                      Job Created: {new Date(job.JobCreatedDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                    COMPLETED
                  </span>
                </div>
              </div>

              {/* Customer & Vehicle Information */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <h2 className="font-bold text-gray-800 text-lg mb-3 flex items-center">
                    <span className="mr-2">👤</span>
                    Customer Information
                  </h2>
                  <div className="space-y-2 text-gray-700">
                    <p><span className="font-semibold">Name:</span> {job?.Name || "N/A"}</p>
                    <p><span className="font-semibold">Phone:</span> {job?.Phone || "N/A"}</p>
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                  <h2 className="font-bold text-gray-800 text-lg mb-3 flex items-center">
                    <span className="mr-2">🚗</span>
                    Vehicle Information
                  </h2>
                  <div className="space-y-2 text-gray-700">
                    <p><span className="font-semibold">Vehicle Type:</span> {job?.VehicleType || "N/A"}</p>
                    <p><span className="font-semibold">Model:</span> {job?.Model || "N/A"}</p>
                    <p><span className="font-semibold">Registration:</span> {job?.VehicleNumber || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Job Details */}
              <div className="mb-6">
                <h2 className="font-bold text-gray-800 text-lg mb-3 flex items-center">
                  <span className="mr-2">🔧</span>
                  Service Details
                </h2>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <p className="text-gray-700 leading-relaxed">{job?.Details || "No details available."}</p>
                </div>
              </div>

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

        {/* Action Buttons - Fixed at bottom */}
        <div className="mt-4 flex justify-center gap-4 pt-4 border-t border-gray-200">
          <button
            onClick={downloadPDF}
            className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl flex items-center"
          >
            <span className="mr-2">📄</span>
            Download PDF
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default RepairDocument;
