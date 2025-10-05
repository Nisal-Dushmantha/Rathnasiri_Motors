import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";

function SparePartBill() {
  const [billNo, setBillNo] = useState("");
  // Set default date to today in yyyy-mm-dd format
  const getToday = () => {
    const d = new Date();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
  };
  const [date, setDate] = useState(getToday());
  const [customerName, setCustomerName] = useState("");
  const [items, setItems] = useState([{ name: "", brand: "", quantity: 1, price: "" }]);
  const [brands, setBrands] = useState([]);
  const [spareParts, setSpareParts] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // ✅ Store validation errors
  const [errors, setErrors] = useState({});

  // ✅ Fetch spare parts & brands
  useEffect(() => {
    const fetchSpareParts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/sp");
        setSpareParts(res.data.sp);
        const uniqueBrands = [...new Set(res.data.sp.map((part) => part.brand))].sort();
        setBrands(uniqueBrands);
      } catch (err) {
        console.error("Error fetching spare parts:", err);
        alert("Failed to fetch spare parts!");
      }
    };
    fetchSpareParts();
  }, []);

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

  // ✅ Select item → auto-fill brand + price
  const handleSelectSparePart = (idx, spareName) => {
    const part = spareParts.find((sp) => sp.name === spareName);
    if (part) {
      setItems((prev) =>
        prev.map((it, i) =>
          i === idx
            ? { ...it, name: part.name, brand: part.brand, price: part.price }
            : it
        )
      );
    } else {
      updateItem(idx, "name", spareName);
    }
  };

  // ✅ Select brand manually
  const handleSelectBrand = (idx, brand) => {
    setItems((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, brand } : it))
    );
  };

  const updateItem = (idx, field, value) => {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, [field]: value } : it)));
  };

  // ✅ Validation
  const validateForm = () => {
    let newErrors = {};

    if (!billNo.trim()) newErrors.billNo = "Bill No is required";
    if (!date.trim()) newErrors.date = "Bill Date is required";
    if (!customerName.trim()) newErrors.customerName = "Customer Name is required";

    items.forEach((it, i) => {
      if (!it.name.trim()) newErrors[`item_name_${i}`] = "Item name is required";
      if (!it.brand.trim()) newErrors[`item_brand_${i}`] = "Brand is required";
      if (Number(it.quantity) <= 0) newErrors[`item_qty_${i}`] = "Quantity must be greater than 0";
      if (Number(it.price) <= 0) newErrors[`item_price_${i}`] = "Price must be greater than 0";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // ❌ stop if errors exist
    }

    setSubmitting(true);
    try {
      for (const row of totals.rows) {
        await axios.post("http://localhost:5000/spb", {
          bill_no: billNo.trim(),
          date: date,
          customerName: customerName.trim(),
          name: row.name.trim(),
          brand: row.brand.trim(),
          quantity: Number(row.quantity) || 0,
          price: Number(row.price) || 0,
        });
      }

      // ✅ Generate PDF (unchanged)
      const doc = new jsPDF();
      const now = new Date();
      const dateStr = now.toLocaleDateString();
      const timeStr = now.toLocaleTimeString();

      doc.setFillColor(37, 99, 235);
      doc.rect(0, 0, 210, 38, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.text("RATHNASIRI MOTORS", 14, 15);
      doc.setFontSize(12);
      doc.text("Spare Parts Bill", 14, 22);
      doc.setFontSize(10);
      doc.text("📍 123 Main Street, Colombo, Sri Lanka", 14, 29);
      doc.text("📞 +94 77 123 4567 | 📧 info@rathnasirimotors.com", 14, 34);
      doc.setFontSize(11);
      doc.text(`Date: ${dateStr}`, 198, 14, { align: "right" });
      doc.text(`Time: ${timeStr}`, 198, 20, { align: "right" });

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.text(`Bill No: ${billNo || "-"}`, 14, 45);
      doc.text(`Date: ${date || "-"}`, 198, 45, { align: "right" });
      doc.text(`Customer: ${customerName || "-"}`, 14, 52);

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

      let y = startY + 8;
      doc.setFontSize(10);
      totals.rows.forEach((r, i) => {
        if (i % 2 === 1) {
          doc.setFillColor(252, 252, 252);
          doc.rect(12, y - 5, 186, 8, "F");
        }
        doc.text(String(r.name || "-").substring(0, 30), colX.name, y);
        doc.text(String(r.brand || "-").substring(0, 20), colX.brand, y);
        doc.text(String(r.quantity || 0), colX.qty, y, { align: "right" });
        doc.text(String(Number(r.price || 0).toFixed(2)), colX.price, y, { align: "right" });
        doc.text(String(Number(r.lineTotal || 0).toFixed(2)), colX.total, y, { align: "right" });
        y += 8;
      });

      y += 4;
      doc.setDrawColor(230);
      doc.line(12, y, 198, y);
      y += 8;
      doc.setFontSize(12);
      doc.text("Grand Total:", 150, y);
      doc.setFontSize(14);
      doc.text(String(totals.total.toFixed(2)), 198, y, { align: "right" });

      y += 20;
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      doc.text("Quality Service | Expert Team | Customer Satisfaction", 105, 280, { align: "center" });
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text("Thank you for choosing Rathnasiri Motors! We appreciate your business.", 105, 286, { align: "center" });

      doc.save(`SparePartsBill_${billNo || now.getTime()}.pdf`);

      setBillNo("");
      setDate("");
      setCustomerName("");
      setItems([{ name: "", brand: "", quantity: 1, price: "" }]);
      alert("Spare parts bill saved and PDF downloaded.");
    } catch (err) {
      console.error(err);
      alert("Only today's date is allowed for the bill date." );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-50 p-10">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">Spare Parts Bill</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Bill Meta */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bill No</label>
              <input
                type="text"
                value={billNo}
                onChange={(e) => setBillNo(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., SPB-00125"
              />
              {errors.billNo && <p className="text-red-500 text-sm">{errors.billNo}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bill Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min={getToday()}
              />
              {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., John Doe"
              />
              {errors.customerName && <p className="text-red-500 text-sm">{errors.customerName}</p>}
            </div>
          </div>

          {/* Items */}
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
                  <div
                    key={idx}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-gray-50 p-4 rounded-xl border border-gray-200"
                  >
                    {/* Item Name dropdown */}
                    <div className="md:col-span-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <select
                        value={it.name}
                        onChange={(e) => handleSelectSparePart(idx, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Item</option>
                        {spareParts.map((sp) => (
                          <option key={sp._id} value={sp.name}>
                            {sp.name}
                          </option>
                        ))}
                      </select>
                      {errors[`item_name_${idx}`] && (
                        <p className="text-red-500 text-sm">{errors[`item_name_${idx}`]}</p>
                      )}
                    </div>

                    {/* ✅ Brand dropdown */}
                    <div className="md:col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                      <select
                        value={it.brand}
                        onChange={(e) => handleSelectBrand(idx, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Brand</option>
                        {brands.map((b, i) => (
                          <option key={i} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                      {errors[`item_brand_${idx}`] && (
                        <p className="text-red-500 text-sm">{errors[`item_brand_${idx}`]}</p>
                      )}
                    </div>

                    {/* Quantity */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                      <input
                        type="number"
                        min="1"
                        value={it.quantity}
                        onChange={(e) => updateItem(idx, "quantity", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors[`item_qty_${idx}`] && (
                        <p className="text-red-500 text-sm">{errors[`item_qty_${idx}`]}</p>
                      )}
                    </div>

                    {/* Unit Price */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={it.price}
                        onChange={(e) => updateItem(idx, "price", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors[`item_price_${idx}`] && (
                        <p className="text-red-500 text-sm">{errors[`item_price_${idx}`]}</p>
                      )}
                    </div>

                    {/* Line Total */}
                    <div className="md:col-span-1 text-right">
                      <div className="text-xs text-gray-500 mb-1">Line Total</div>
                      <div className="font-semibold text-gray-800">{lineTotal.toFixed(2)}</div>
                    </div>

                    {/* Remove */}
                    <div className="md:col-span-12 text-right -mt-2">
                      <button
                        type="button"
                        onClick={() => removeItem(idx)}
                        disabled={items.length === 1}
                        className={`px-3 py-2 ${
                          items.length === 1
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-red-600 hover:text-red-700"
                        }`}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary */}
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
                <div className="text-2xl font-bold text-blue-900">
                  Total: {totals.total.toFixed(2)}
                </div>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className={`px-6 py-3 rounded-xl text-white font-semibold ${
                  submitting ? "bg-gray-400" : "bg-blue-700 hover:bg-blue-800"
                }`}
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
