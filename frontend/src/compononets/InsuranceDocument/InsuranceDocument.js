// File: InsuranceDocument.js
import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function InsuranceDocument({ user, onClose }) {
  const invoiceRef = useRef();

  const downloadPDF = async () => {
    if (!invoiceRef.current || !user) return;

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
    pdf.save(`Insurance_${user.fullname}_${user.RegistrationNo}.pdf`);
  };

  if (!user) return <p className="text-center p-4">Loading insurance details...</p>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-6 w-full max-w-5xl h-[90vh] overflow-auto relative flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-2xl transition-colors z-10"
        >
          ✕
        </button>

        {/* Insurance Form Preview */}
        <div ref={invoiceRef} className="bg-white border-2 border-gray-200 rounded-lg shadow-sm overflow-hidden max-w-4xl mx-auto p-6 space-y-4">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-lg">
            <h1 className="text-3xl font-bold mb-1">Insurance Form</h1>
            <p className="text-blue-100 text-lg">Rathnasiri Motors</p>
          </div>

          {/* Details */}
          <div className="grid md:grid-cols-2 gap-4">
            <DetailBox label="Full Name" value={user.fullname} />
            <DetailBox label="Contact No" value={user.ContactNo} />
            <DetailBox label="Address" value={user.Address} />
            <DetailBox label="Vehicle No" value={user.RegistrationNo} />
            <DetailBox label="Vehicle Type" value={user.VehicleType} />
            <DetailBox label="Vehicle Model" value={user.VehicleModel} />
            <DetailBox label="Engine No" value={user.EngineNo} />
            <DetailBox label="Chassis No" value={user.ChassisNo} />
            <DetailBox label="Start Date" value={user.StartDate} />
            <DetailBox label="End Date" value={user.EndDate} />
          </div>

              {/* Footer */}
          <div className="border-t-2 border-gray-200 pt-6 text-center">
            <p className="text-lg font-bold text-blue-600">Thank you for choosing Rathnasiri Motors!</p>
            <p className="text-sm text-gray-600 mt-1">We appreciate your trust and business.</p>
          </div>
        </div>


        {/* Action Buttons */}
        <div className="mt-4 flex justify-center gap-4 pt-4 border-t border-gray-200">
          <button
            onClick={downloadPDF}
            className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl flex items-center"
          >
            📄 Download PDF
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

// Reusable Detail Box
const DetailBox = ({ label, value }) => (
  <div className="bg-gray-50 p-3 rounded-xl border">
    <p className="text-xs text-gray-500">{label}</p>
    <p className="font-semibold text-gray-800">{value}</p>
  </div>
);

export default InsuranceDocument;
