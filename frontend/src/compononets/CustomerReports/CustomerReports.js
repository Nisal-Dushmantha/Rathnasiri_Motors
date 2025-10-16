// CustomerReports.js
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function CustomerReports() {
  const [customers, setCustomers] = useState([]);
  const [query, setQuery] = useState("");

  const [selected, setSelected] = useState(null);
  const [loyalty, setLoyalty] = useState([]);
  const modalRef = useRef();
  const printableRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/customers");
        setCustomers(res.data || []);
      } catch (err) {
        console.error("Failed to load customer records", err);
      }
    };
    fetchData();

    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const normalized = (val) => (val ?? "").toString().toLowerCase();
  const filteredCustomers = customers.filter((c) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      normalized(c.customerId).includes(q) ||
      normalized(c.customerName).includes(q)
    );
  });

  const openDetails = async (customer) => {
    setSelected(customer);
    try {
      const res = await axios.get("http://localhost:5000/loyalty", {
        params: { customerId: customer.customerId },
      });
      setLoyalty(res.data || []);
    } catch (err) {
      console.error("Failed to load loyalty records", err);
      setLoyalty([]);
    }
  };

  const now = new Date();
  const dateStr = now.toLocaleDateString();
  const timeStr = now.toLocaleTimeString();

  // compute total loyalty points for the selected customer
  const totalPoints = (loyalty || []).reduce((sum, item) => sum + (Number(item.points) || 0), 0);

  const closeDetails = (e) => {
    if (!e || e.target === e.currentTarget) {
      setSelected(null);
      setLoyalty([]);
    }
  };

  const printPDF = async () => {
    // capture only the printable area (exclude modal buttons)
    const inputEl = printableRef.current || modalRef.current;
    if (!inputEl) return;

    // render at higher scale for clarity
    const canvas = await html2canvas(inputEl, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
    const imgData = canvas.toDataURL("image/png");

    // measure element in mm to create a PDF sized to the element
    const divWidth = inputEl.offsetWidth;
    const divHeight = inputEl.offsetHeight;
    const widthMM = divWidth * 0.264583;
    const heightMM = divHeight * 0.264583;

    const pdf = new jsPDF({
      orientation: widthMM > heightMM ? "landscape" : "portrait",
      unit: "mm",
      format: [widthMM, heightMM],
    });

    pdf.addImage(imgData, "PNG", 0, 0, widthMM, heightMM);
    const fileName = selected ? `Customer_${selected.customerId}.pdf` : "Customer.pdf";
    pdf.save(fileName);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen relative">
      <h1 className="text-2xl font-bold mb-6 text-blue-900">Customer Reports</h1>
      
      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by ID or Name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full md:w-1/2 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-lg overflow-hidden">
          <thead className="bg-blue-800 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Customer ID</th>
              <th className="py-3 px-4 text-left">Customer Name</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((cust, index) => (
              <tr key={cust._id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <td className="py-3 px-4">{cust.customerId}</td>
                <td className="py-3 px-4">{cust.customerName}</td>
                <td className="py-3 px-4">
                  <button
                    className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
                    onClick={() => openDetails(cust)}
                  >
                    Show Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn"
          onClick={closeDetails}
        >
          <div ref={modalRef} className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-2xl mx-4 animate-slideIn">
            <div ref={printableRef} className="bg-white border-2 border-gray-200 rounded-lg shadow-sm overflow-hidden">
              {/* Header with gradient matching RepairDocument */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl font-bold mb-1">RATHNASIRI MOTORS</h1>
                    <p className="text-blue-100 text-sm">Customer Reports & Loyalty</p>
                    <div className="mt-2 space-y-1 text-blue-100 text-xs">
                      <p>📍 123 Main Street, Colombo, Sri Lanka</p>
                      <p>📞 +94 77 123 4567 | 📧 info@rathnasirimotors.com</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="bg-white bg-opacity-20 rounded-lg p-3 backdrop-blur-sm">
                      <p className="text-blue-100 text-xs font-medium">REPORT DATE</p>
                      <p className="text-white text-sm font-semibold">{dateStr}</p>
                      <p className="text-blue-100 text-xs">{timeStr}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex justify-between items-center mb-4 p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">REPORT FOR</p>
                    <p className="text-xl font-bold text-gray-800">{selected.customerName || selected.customerId}</p>
                    <p className="text-sm text-gray-500">Customer ID: {selected.customerId}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">LOYALTY SUMMARY</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                    <p className="text-sm text-gray-600">Customer ID</p>
                    <p className="font-semibold">{selected.customerId}</p>
                    <p className="text-sm text-gray-600 mt-2">Email</p>
                    <p className="font-semibold">{selected.email || "—"}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-semibold">{selected.contactNumber || "—"}</p>
                    <p className="text-sm text-gray-600 mt-2">Total Points</p>
                    <p className="font-semibold">{totalPoints}</p>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-blue-800 mb-2">Interactions & Loyalty</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white rounded-lg border">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="py-2 px-3 text-left">Interaction</th>
                        <th className="py-2 px-3 text-left">Date</th>
                        <th className="py-2 px-3 text-left">Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loyalty.map((l) => (
                        <tr key={l._id}>
                          <td className="py-2 px-3">{l.interaction}</td>
                          <td className="py-2 px-3">{l.date ? new Date(l.date).toLocaleDateString() : ""}</td>
                          <td className="py-2 px-3">{l.points}</td>
                        </tr>
                      ))}
                      <tr className="bg-gray-100 font-semibold">
                        <td className="py-2 px-3 text-right" colSpan={2}>Total Points</td>
                        <td className="py-2 px-3">{totalPoints}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Footer similar to RepairDocument */}
                <div className="border-t-2 border-gray-200 pt-6 mt-6">
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

            <div className="flex justify-end gap-3 pt-6">
              <button
                onClick={printPDF}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Print Details
              </button>
              <button
                onClick={closeDetails}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerReports;
