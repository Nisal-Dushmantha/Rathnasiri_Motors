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

  if (!user)
    return <p className="text-center p-4">Loading insurance details...</p>;

  const now = new Date();
  const dateStr = now.toLocaleDateString();
  const timeStr = now.toLocaleTimeString();

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

        {/* Invoice preview */}
        <div className="flex-1 overflow-auto pr-2">
          <div
            ref={invoiceRef}
            className="bg-white border-2 border-gray-200 rounded-lg shadow-sm overflow-hidden max-w-4xl mx-auto"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold mb-1">RATHNASIRI MOTORS</h1>
                  <p className="text-blue-100 text-lg">
                    Insurance Registration Center
                  </p>
                  <div className="mt-3 space-y-1 text-blue-100 text-sm">
                    <p>📍 Polgahawela Road,Imbulgasdeniya,Kegalle</p>
                    <p>📞 037 2242101/0776575477/0761617789 | 📧 yamahakegalle@gmail.com </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                    <p className="text-blue-100 text-sm font-medium">
                      INVOICE DATE
                    </p>
                    <p className="text-white text-lg font-semibold">{dateStr}</p>
                    <p className="text-blue-100 text-sm">{timeStr}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="p-6">
              {/* Invoice Number and Status */}
              <div className="flex justify-between items-center mb-6 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-gray-600 text-sm font-medium">INVOICE #</p>
                  <p className="text-xl font-bold text-gray-800">{user._id}</p>
                </div>
                <div className="text-right">
                  <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                    COMPLETED
                  </span>
                </div>
              </div>

              {/* Sections */}
              <Section title="Client Information">
                <DetailRow label="Full Name" value={user.fullname} index={0} />
                <DetailRow label="Contact No" value={user.ContactNo} index={1} />
                <DetailRow label="Address" value={user.Address} index={2} />
              </Section>

              <Section title="Vehicle Information">
                <DetailRow
                  label="Vehicle No"
                  value={user.RegistrationNo}
                  index={0}
                />
                <DetailRow
                  label="Vehicle Type"
                  value={user.VehicleType}
                  index={1}
                />
                <DetailRow
                  label="Vehicle Model"
                  value={user.VehicleModel}
                  index={2}
                />
                <DetailRow label="Engine No" value={user.EngineNo} index={3} />
                <DetailRow label="Chassis No" value={user.ChassisNo} index={4} />
              </Section>

              <Section title="Policy Information">
                <DetailRow label="Start Date" value={user.StartDate} index={0} />
                <DetailRow label="End Date" value={user.EndDate} index={1} />
              </Section>

              {/* Signature */}
              <div className="mt-12 flex justify-end">
                <div className="text-right">
                  <div className="h-16 border-b-2 border-gray-400 w-48"></div>
                  <p className="mt-2 text-sm font-semibold text-gray-700">
                    Manager - Rathnasiri Motors </p>
                    <p className="text-sm text-gray-500">Authorized Signature
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t-2 border-gray-200 pt-6 text-center mt-10">
                <p className="text-lg font-bold text-blue-600">
                  Thank you for choosing Rathnasiri Motors!
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  We appreciate your trust and business.
                </p>
              </div>
            </div>
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

/* 🔹 Section & Row Components */
const Section = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="text-lg font-bold text-blue-800 border-b-2 border-blue-200 mb-4 pb-1">
      {title}
    </h2>
    <div className="border rounded-lg overflow-hidden">{children}</div>
  </div>
);

const DetailRow = ({ label, value, index }) => (
  <div
    className={`grid grid-cols-2 px-4 py-3 text-sm ${
      index % 2 === 0 ? "bg-white" : "bg-gray-50"
    }`}
  >
    <div className="font-semibold text-gray-700">{label}</div>
    <div className="text-gray-900">{value || "N/A"}</div>
  </div>
);

export default InsuranceDocument;