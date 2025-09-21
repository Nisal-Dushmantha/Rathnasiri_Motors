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

  const closeDetails = (e) => {
    if (!e || e.target === e.currentTarget) {
      setSelected(null);
      setLoyalty([]);
    }
  };

  const printPDF = async () => {
    if (!modalRef.current) return;
    const input = modalRef.current;
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 190;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 10;

    pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

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
            <h2 className="text-xl font-bold mb-4 text-blue-900">Customer Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">Customer ID</p>
                <p className="font-semibold">{selected.customerId}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">Customer Name</p>
                <p className="font-semibold">{selected.customerName}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold">{selected.email || "—"}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-semibold">{selected.contactNumber || "—"}</p>
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
                </tbody>
              </table>
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
