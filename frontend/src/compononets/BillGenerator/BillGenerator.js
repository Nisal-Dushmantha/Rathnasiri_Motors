// src/components/BillGenerator.js
import React, { useState, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Modal from "react-modal";
import ReceiptDocument from "../ReceiptDocument/ReceiptDocument";

Modal.setAppElement("#root");

function BillGenerator({ apiSave = true, saveUrl = "http://localhost:5000/api/bills" }) {
  const [customerName, setCustomerName] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [amountText, setAmountText] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const previewRef = useRef();

  const SERVICE_CHARGE = 150.0;

  const resetForm = () => {
    setCustomerName("");
    setVehicleNumber("");
    setAmountText("");
    setPaymentMethod("Cash");
    setError(null);
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError(null);

    const amount = parseFloat(amountText) || 0;
    const total = amount + SERVICE_CHARGE;

    if (!customerName || !vehicleNumber) {
      setError("Please enter customer name and vehicle number.");
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount greater than zero.");
      return;
    }

    let billId = null;

    if (apiSave) {
      setSaving(true);
      try {
        const payload = { customerName, vehicleNumber, amount, serviceCharge: SERVICE_CHARGE, total, paymentMethod };
        const res = await axios.post(`${saveUrl}/create`, payload);
        billId = res.data.bill?._id || null;
      } catch (err) {
        console.error("Error saving bill:", err);
      } finally {
        setSaving(false);
      }
    }

    setPreviewData({ customerName, vehicleNumber, amount, serviceCharge: SERVICE_CHARGE, total, method: paymentMethod, billId });
    setPreviewOpen(true);
  };

  const downloadPdfFromPreview = async () => {
    if (!previewRef.current) return;
    const canvas = await html2canvas(previewRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ unit: "pt", format: "a4" });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Insurance_Bill_${Date.now()}.pdf`);
    setPreviewOpen(false);
    resetForm();
  };

  const totalAmount = (parseFloat(amountText) || 0) + SERVICE_CHARGE;

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white shadow-2xl rounded-3xl border border-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-blue-800 text-center">Insurance Bill Generator</h2>

      <form onSubmit={handleGenerate} className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Customer Details */}
          <div className="flex-1 bg-blue-50 p-6 rounded-2xl border border-blue-100 shadow-inner">
            <h3 className="font-semibold text-blue-700 text-lg mb-4">Customer Details</h3>

            <label className="block text-sm font-medium mb-1">Customer Name</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter customer name"
              className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            />

            <label className="block text-sm font-medium mt-4 mb-1">Vehicle Number</label>
            <input
              type="text"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              placeholder="Enter vehicle number"
              className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            />
          </div>

          {/* Payment Info */}
          <div className="flex-1 bg-green-50 p-6 rounded-2xl border border-green-100 shadow-inner">
            <h3 className="font-semibold text-green-700 text-lg mb-4">Payment Info</h3>

            <label className="block text-sm font-medium mb-1">Base Amount</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={amountText}
              onChange={(e) => setAmountText(e.target.value)}
              placeholder="Enter base amount"
              className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              required
            />

            <label className="block text-sm font-medium mt-4 mb-1">Service Charge</label>
            <input
              type="text"
              value={SERVICE_CHARGE.toFixed(2)}
              readOnly
              className="w-full p-3 rounded-xl border border-gray-300 bg-gray-100"
            />

            <label className="block text-sm font-medium mt-4 mb-1">Total Amount</label>
            <div className="w-full p-3 rounded-xl bg-gradient-to-r from-green-100 to-green-50 border text-lg font-bold text-green-700">
              Rs. {totalAmount.toFixed(2)}
            </div>

            <label className="block text-sm font-medium mt-4 mb-1">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            >
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
            </select>
          </div>
        </div>

        {error && <div className="text-red-600 text-sm font-medium">{error}</div>}

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-blue-700 transition shadow-md"
            disabled={saving}
          >
            {saving ? "Saving & Generating..." : "Generate Bill"}
          </button>
          <button
            type="button"
            className="flex-1 px-6 py-3 border border-gray-300 rounded-2xl font-medium hover:bg-gray-100 transition"
            onClick={resetForm}
          >
            Reset
          </button>
        </div>
      </form>

      {/* PDF Preview Modal */}
      <Modal
        isOpen={previewOpen}
        onRequestClose={() => setPreviewOpen(false)}
        contentLabel="PDF Preview"
        style={{
          content: { maxWidth: "700px", margin: "auto", borderRadius: "1.5rem", padding: "2rem", overflow: "auto" },
          overlay: { backgroundColor: "rgba(0,0,0,0.5)" }
        }}
      >
        <div ref={previewRef}>
          <ReceiptDocument data={previewData} />
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={downloadPdfFromPreview}
            className="bg-green-600 text-white px-5 py-2 rounded-xl hover:bg-green-700 transition shadow"
          >
            📄 Download PDF
          </button>
          <button
            onClick={() => setPreviewOpen(false)}
            className="px-5 py-2 border rounded-xl hover:bg-gray-100 transition"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default BillGenerator;
