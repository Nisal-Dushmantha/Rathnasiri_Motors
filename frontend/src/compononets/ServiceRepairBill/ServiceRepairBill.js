import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";

function ServiceRepairBill() {
  const [billNo, setBillNo] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [billType, setBillType] = useState("service");
  const [billDate, setBillDate] = useState("");
  const [items, setItems] = useState([
    { detail: "", price: "" },
  ]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    setBillDate(`${yyyy}-${mm}-${dd}`);
  }, []);

  const totals = useMemo(() => {
    const rows = items.map((it) => {
      const price = Number(it.price) || 0;
      return { ...it, lineTotal: price };
    });
    const total = rows.reduce((acc, r) => acc + r.lineTotal, 0);
    return { rows, total };
  }, [items]);

  const addItem = () => {
    setItems((prev) => [...prev, { detail: "", price: "" }]);
  };

  const removeItem = (idx) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateItem = (idx, field, value) => {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, [field]: value } : it)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        bill_no: billNo.trim(),
        customerName: customerName.trim(),
        type: billType,
        date: billDate,
        services: totals.rows.map((row) => ({
          detail: String(row.detail || "").trim(),
          price: Number(row.price) || 0,
        })),
        total: Number(totals.total) || 0,
      };

      const res = await axios.post("http://localhost:5000/service-repair-bills", payload);
      const saved = res?.data || payload;

      const doc = new jsPDF();
      const now = new Date();
      const timeStr = now.toLocaleTimeString();

      // Header band
      doc.setFillColor(25, 64, 128);
      doc.rect(0, 0, 210, 28, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.text("Rathnasiri Motors", 14, 18);
      doc.setFontSize(12);
      doc.text(`${billType === 'repair' ? 'Repair' : 'Service'} Bill`, 160, 12, { align: "right" });
      doc.text(`Date: ${billDate || "-"}`, 160, 18, { align: "right" });
      doc.text(`Time: ${timeStr}`, 160, 24, { align: "right" });

      // Bill meta
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.text(`Bill No: ${saved.bill_no || billNo || "-"}`, 14, 40);
      doc.text(`Customer: ${saved.customerName || customerName || "-"}`, 14, 47);

      // Table header
      const startY = 60;
      const colX = { name: 14, qty: 124, unit: 154, total: 186 };
      doc.setFillColor(240, 245, 255);
      doc.rect(12, startY - 6, 186, 10, "F");
      doc.setFontSize(11);
      doc.text("Service / Item", colX.name, startY);
      doc.text("Qty", colX.qty, startY, { align: "right" });
      doc.text("Unit", colX.unit, startY, { align: "right" });
      doc.text("Line Total", colX.total, startY, { align: "right" });

      // Rows
      let y = startY + 8;
      doc.setFontSize(10);
      const rows = (saved.services && saved.services.length ? saved.services : payload.services);
      rows.forEach((r, i) => {
        if (i % 2 === 1) {
          doc.setFillColor(252, 252, 252);
          doc.rect(12, y - 5, 186, 8, "F");
        }
        const label = r.detail || "-";
        const unit = Number(r.price ?? 0);
        doc.text(String(label).substring(0, 60), colX.name, y);
        doc.text("1", colX.qty, y, { align: "right" });
        doc.text(String(unit.toFixed(2)), colX.unit, y, { align: "right" });
        doc.text(String(unit.toFixed(2)), colX.total, y, { align: "right" });
        y += 8;
      });

      // Summary
      y += 4;
      doc.setDrawColor(230);
      doc.line(12, y, 198, y);
      y += 8;
      doc.setFontSize(12);
      doc.text("Grand Total:", 150, y);
      doc.setFontSize(14);
      const grand = saved.total ?? totals.total;
      doc.text(String(Number(grand || 0).toFixed(2)), 198, y, { align: "right" });

      // Footer
      y += 16;
      doc.setFontSize(10);
      doc.setTextColor(120);
      doc.text("Thank you for your business!", 14, y);
      doc.text("Please retain this bill for your records.", 14, y + 6);

      doc.save(`Bill_${saved.bill_no || billNo || now.getTime()}.pdf`);

      // Reset
      setBillNo("");
      setCustomerName("");
      setBillType("service");
      setBillDate("");
      setItems([{ detail: "", price: "" }]);
      alert("Bill saved and PDF downloaded.");
    } catch (err) {
      console.error(err);
      alert("Failed to save bill. Please check the server and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-50 p-10">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">Create {billType === 'repair' ? 'Repair' : 'Service'} Bill</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bill No</label>
              <input
                type="text"
                value={billNo}
                onChange={(e) => setBillNo(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., INV-00125"
                aria-label="Bill number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bill Type</label>
              <select
                value={billType}
                onChange={(e) => setBillType(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Bill type"
              >
                <option value="service">Service</option>
                <option value="repair">Repair</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bill Date</label>
              <input
                type="date"
                value={billDate}
                onChange={(e) => setBillDate(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Bill date"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., John Doe"
                aria-label="Customer name"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold text-blue-800">{billType === 'repair' ? 'Repair' : 'Service'} Lines</h2>
              <button
                type="button"
                onClick={addItem}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                aria-label="Add service line"
              >
                + Add Line
              </button>
            </div>

            <div className="space-y-4">
              {items.map((it, idx) => {
                const price = Number(it.price) || 0;
                return (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="md:col-span-8">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Service Description</label>
                    <input
                      type="text"
                      value={it.detail}
                      onChange={(e) => updateItem(idx, "detail", e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Oil Change"
                      aria-label={`Service description ${idx + 1}`}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={it.price}
                      onChange={(e) => updateItem(idx, "price", e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-label={`Price for service ${idx + 1}`}
                    />
                  </div>
                  <div className="md:col-span-2 text-right">
                    <div className="text-xs text-gray-500 mb-1">Price</div>
                    <div className="font-semibold text-gray-800" aria-live="polite">{price.toFixed(2)}</div>
                  </div>
                  <div className="md:col-span-12 text-right -mt-2">
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      disabled={items.length === 1}
                      className={`px-3 py-2 ${items.length === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-red-600 hover:text-red-700'}`}
                      aria-label={`Remove line ${idx + 1}`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )})}
            </div>
          </div>

          <div className="flex items-center justify-between border-t pt-6">
            <button
              type="button"
              onClick={addItem}
              className="px-5 py-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100"
            >
              + Add another line
            </button>
            <div className="flex items-center gap-8">
            <div className="text-right">
              <div className="text-sm text-gray-600">Lines: {totals.rows.length}</div>
              <div className="text-2xl font-bold text-blue-900">Total: {totals.total.toFixed(2)}</div>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className={`px-6 py-3 rounded-xl text-white font-semibold ${submitting ? "bg-gray-400" : "bg-blue-700 hover:bg-blue-800"}`}
            >
              {submitting ? "Saving..." : "Save & Download PDF"}
            </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ServiceRepairBill;
