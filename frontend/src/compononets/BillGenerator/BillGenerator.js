// src/components/BillGenerator.js
import React, { useState } from "react";
import jsPDF from "jspdf";
import axios from "axios";


function BillGenerator({ apiSave = true, saveUrl = "http://localhost:5000/api/bills" }) {
  const [customerName, setCustomerName] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [amountText, setAmountText] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Fixed service charge
  const SERVICE_CHARGE = 150.00;

  const resetForm = () => {
    setCustomerName("");
    setVehicleNumber("");
    setAmountText("");
    setPaymentMethod("Cash");
    setError(null);
  };

  const generateReceiptPdf = ({ customerName, vehicleNumber, amount, serviceCharge, total, method, billId = null }) => {
    const doc = new jsPDF({ unit: "pt", format: "A4" });
    const pageWidth = doc.internal.pageSize.getWidth();

    // Colors
    const primary = [41, 128, 185]; // blue
    const accent = [26, 188, 156]; // teal

    // Header with background
    doc.setFillColor(...primary);
    doc.rect(0, 0, pageWidth, 80, "F");
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    doc.text("Rathnasiri Motors - Insurance Bill", pageWidth / 2, 50, { align: "center" });

    let y = 110;

    // Bill info
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    const now = new Date();
    doc.text(`Date: ${now.toLocaleString()}`, 40, y);
    doc.text(`Bill ID: ${billId || "N/A"}`, pageWidth - 200, y);
    y += 30;

    // Customer details box
    doc.setFillColor(245, 245, 245);
    doc.rect(40, y, pageWidth - 80, 100, "F");
    doc.setFontSize(12);
    doc.setTextColor(...primary);
    doc.text("Customer Details", 50, y + 20);
    doc.setTextColor(0, 0, 0);
    doc.text(`Name: ${customerName}`, 60, y + 45);
    doc.text(`Vehicle No: ${vehicleNumber}`, 60, y + 70);
    y += 130;

    // Payment details
    doc.setFillColor(245, 245, 245);
    doc.rect(40, y, pageWidth - 80, 140, "F");
    doc.setTextColor(...primary);
    doc.text("Payment Details", 50, y + 20);
    doc.setTextColor(0, 0, 0);
    doc.text(`Method: ${method}`, 60, y + 45);
    doc.text(`Base Amount: Rs. ${amount.toFixed(2)}`, 60, y + 70);
    doc.text(`Service Charge: Rs. ${serviceCharge.toFixed(2)}`, 60, y + 95);

    // Total highlight
    doc.setFillColor(...accent);
    doc.setTextColor(255, 255, 255);
    doc.rect(60, y + 115, pageWidth - 160, 30, "F");
    doc.setFontSize(14);
    doc.text(`TOTAL: Rs. ${total.toFixed(2)}`, pageWidth / 2, y + 137, { align: "center" });
    y += 180;

    // Thank you note
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(
      "Thank you for your payment. This receipt serves as an official proof of your insurance transaction.",
      pageWidth / 2,
      y,
      { align: "center", maxWidth: pageWidth - 100 }
    );
    y += 40;

    // Signature line
    doc.text("__________________________", 60, y);
    doc.text("Authorized Signature", 70, y + 15);

    // Footer
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text("Rathnasiri Motors | Address line | Contact: 077-XXXXXXX", pageWidth / 2, 820, { align: "center" });

    doc.save(`Insurance_Bill_${Date.now()}.pdf`);
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError(null);

    const amount = parseFloat(amountText) || 0;
    const serviceCharge = SERVICE_CHARGE;
    const total = amount + serviceCharge;

    if (!customerName || !vehicleNumber) {
      setError("Please enter customer name and vehicle number.");
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount greater than zero.");
      return;
    }

    if (apiSave) {
      setSaving(true);
      try {
        const payload = {
          customerName,
          vehicleNumber,
          amount,
          serviceCharge,
          total,
          paymentMethod,
        };
        const res = await axios.post(saveUrl, payload);
        const billId = res.data.bill?._id || null;
        generateReceiptPdf({ customerName, vehicleNumber, amount, serviceCharge, total, method: paymentMethod, billId });
        resetForm();
      } catch (err) {
        console.error("Error saving bill:", err);
        generateReceiptPdf({ customerName, vehicleNumber, amount, serviceCharge, total, method: paymentMethod, billId: null });
      } finally {
        setSaving(false);
      }
    } else {
      generateReceiptPdf({ customerName, vehicleNumber, amount, serviceCharge, total, method: paymentMethod, billId: null });
      resetForm();
    }
  };

  const baseAmount = parseFloat(amountText) || 0;
  const totalAmount = baseAmount + SERVICE_CHARGE;

  return (
    <div className="max-w-lg mx-auto bg-gradient-to-b from-sky-50 to-white shadow-xl rounded-2xl p-8 border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-blue-800 text-center">Insurance Bill Generator</h2>

      <form onSubmit={handleGenerate} className="space-y-6">
        {/* Customer Details */}
        <div className="bg-gray-50 p-4 rounded-xl border">
          <h3 className="font-semibold text-blue-700 mb-3">Customer Details</h3>
          <label className="block text-sm font-medium">Customer Name</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Enter customer name"
            className="mt-1 w-full p-2 border rounded-lg"
            required
          />

          <label className="block text-sm font-medium mt-4">Vehicle Number</label>
          <input
            type="text"
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
            placeholder="Enter vehicle number"
            className="mt-1 w-full p-2 border rounded-lg"
            required
          />
        </div>

        {/* Payment Info */}
        <div className="bg-gray-50 p-4 rounded-xl border">
          <h3 className="font-semibold text-blue-700 mb-3">Payment Info</h3>
          <label className="block text-sm font-medium">Base Amount</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={amountText}
            onChange={(e) => setAmountText(e.target.value)}
            placeholder="Enter base amount"
            className="mt-1 w-full p-2 border rounded-lg"
            required
          />

          <label className="block text-sm font-medium mt-4">Service Charge</label>
          <input
            type="text"
            value={SERVICE_CHARGE.toFixed(2)}
            readOnly
            className="mt-1 w-full p-2 border rounded-lg bg-gray-100"
          />

          <label className="block text-sm font-medium mt-4">Total Amount</label>
          <div className="mt-1 w-full p-3 rounded-lg bg-gradient-to-r from-green-100 to-green-50 border text-lg font-bold text-green-700">
            Rs. {totalAmount.toFixed(2)}
          </div>

          <label className="block text-sm font-medium mt-4">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="mt-1 w-full p-2 border rounded-lg"
          >
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
          </select>
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            disabled={saving}
          >
            {saving ? "Saving & Generating..." : "Generate Bill"}
          </button>
          <button
            type="button"
            className="px-4 py-3 border rounded-xl font-medium hover:bg-gray-100"
            onClick={resetForm}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}

export default BillGenerator;
