import React, { useMemo, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";

function SparePartBill() {
  const [billNo, setBillNo] = useState("");
  const [date, setDate] = useState(""); // new date state
  const [customerName, setCustomerName] = useState("");
  const [items, setItems] = useState([
    { name: "", brand: "", quantity: 1, price: "" },
  ]);
  const [submitting, setSubmitting] = useState(false);

  const totals = useMemo(() => {
    const rows = items.map((it) => {
      const qty = Number(it.quantity) || 0;
      const price = Number(it.price) || 0;
      return { ...it, lineTotal: qty * price };
    });
    const total = rows.reduce((acc, r) => acc + r.lineTotal, 0);
    return { rows, total };
  }, [items]);

  const addItem = () => {
    setItems((prev) => [...prev, { name: "", brand: "", quantity: 1, price: "" }]);
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
      // Persist each line item using existing single-item endpoint
      for (const row of totals.rows) {
        await axios.post("http://localhost:5000/spb", {
          bill_no: billNo.trim(),
          date: date,// use provided date or current date
          customerName: customerName.trim(), //customer name
          name: row.name.trim(),
          brand: row.brand.trim(),
          quantity: Number(row.quantity) || 0,
          price: Number(row.price) || 0,
        });
      }

      // Generate PDF invoice
      const doc = new jsPDF();
      const now = new Date();
      const dateStr = now.toLocaleDateString();
      const timeStr = now.toLocaleTimeString();

              // ===== HEADER =====
          doc.setFillColor(37, 99, 235); // blue (fallback for gradient)
          doc.rect(0, 0, 210, 38, "F"); // header background

          // Title
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(20);
          doc.text("RATHNASIRI MOTORS", 14, 15);

          // Subtitle
          doc.setFontSize(12);
          doc.setTextColor(220, 235, 255);
          doc.text("Spare Parts Bill", 14, 22);

          // Contact Details
          doc.setFontSize(10);
          doc.setTextColor(220, 230, 255);
          doc.text("📍 123 Main Street, Colombo, Sri Lanka", 14, 29);
          doc.text("📞 +94 77 123 4567 | 📧 info@rathnasirimotors.com", 14, 34);

          // Date & Time (top-right)
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(11);
          doc.text(`Date: ${dateStr}`, 198, 14, { align: "right" });
          doc.text(`Time: ${timeStr}`, 198, 20, { align: "right" });


      // Bill meta
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.text(`Bill No: ${billNo || "-"}`, 14, 45);
      doc.text(`Date: ${date || "-"}`, 198, 45,{ align: "right" });
      doc.text(`Customer: ${customerName || "-"}`, 14, 52);

      // Table header
      const startY = 60;
      const colX = { name: 14, brand: 84, qty: 134, price: 154, total: 178 };
      doc.setFillColor(240, 245, 255);
      doc.rect(12, startY - 6, 186, 10, "F");
      doc.setFontSize(11);
      doc.text("Item", colX.name, startY);
      doc.text("Brand", colX.brand, startY);
      doc.text("Qty", colX.qty, startY, { align: "right" });
      doc.text("Price", colX.price, startY, { align: "right" });
      doc.text("Total", colX.total, startY, { align: "right" });

      // Rows
      let y = startY + 8;
      doc.setFontSize(10);
      totals.rows.forEach((r, i) => {
        // zebra stripes
        if (i % 2 === 1) {
          doc.setFillColor(252, 252, 252);
          doc.rect(12, y - 5, 186, 8, "F");
        }
        const name = r.name || "-";
        const brand = r.brand || "-";
        doc.text(String(name).substring(0, 30), colX.name, y);
        doc.text(String(brand).substring(0, 20), colX.brand, y);
        doc.text(String(r.quantity || 0), colX.qty, y, { align: "right" });
        doc.text(String(Number(r.price || 0).toFixed(2)), colX.price, y, { align: "right" });
        doc.text(String(Number(r.lineTotal || 0).toFixed(2)), colX.total, y, { align: "right" });
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
      doc.text(String(totals.total.toFixed(2)), 198, y, { align: "right" });

          // ===== FOOTER =====
      y += 20; // add space before footer
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60); // dark gray
      doc.text(
        "Quality Service | Expert Team | Customer Satisfaction",
        105,
        280,
        { align: "center" }
      );

      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100); // lighter gray
      doc.text(
        "Thank you for choosing Rathnasiri Motors! We appreciate your business.",
        105,
        286,
        { align: "center" }
      );
      // ✅ SAVE PDF HERE
    doc.save(`SparePartsBill_${billNo || now.getTime()}.pdf`);

      // Reset
      setBillNo("");
      setDate("");// reset date
      setCustomerName("");
      setItems([{ name: "", brand: "", quantity: 1, price: "" }]);
      alert("Spare parts bill saved and PDF downloaded.");
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
        <h1 className="text-3xl font-bold text-blue-900 mb-6">Spare Parts Bill</h1>

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
                placeholder="e.g., SPB-00125"
              />
            </div>

             {/* Bill Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bill Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., John Doe"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold text-blue-800">Items</h2>
              <button
                type="button"
                onClick={addItem}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                + Add Item
              </button>
            </div>

            <div className="space-y-4">
              {items.map((it, idx) => {
                const qty = Number(it.quantity) || 0;
                const unit = Number(it.price) || 0;
                const lineTotal = qty * unit;
                return (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="md:col-span-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={it.name}
                      onChange={(e) => updateItem(idx, "name", e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Brake Pad"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                    <input
                      type="text"
                      value={it.brand}
                      onChange={(e) => updateItem(idx, "brand", e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Yamaha"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={it.quantity}
                      onChange={(e) => updateItem(idx, "quantity", e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={it.price}
                      onChange={(e) => updateItem(idx, "price", e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="md:col-span-1 text-right">
                    <div className="text-xs text-gray-500 mb-1">Line Total</div>
                    <div className="font-semibold text-gray-800">{lineTotal.toFixed(2)}</div>
                  </div>
                  <div className="md:col-span-12 text-right -mt-2">
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      disabled={items.length === 1}
                      className={`px-3 py-2 ${items.length === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-red-600 hover:text-red-700'}`}
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
              + Add another item
            </button>
            <div className="flex items-center gap-8">
            <div className="text-right">
              <div className="text-sm text-gray-600">Items: {totals.rows.length}</div>
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

export default SparePartBill;