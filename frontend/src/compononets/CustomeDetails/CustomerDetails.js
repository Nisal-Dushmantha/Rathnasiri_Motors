import React, { useState } from "react";

function CustomerDetails() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({
    customerId: "",
    customerName: "",
    contactNumber: "",
    email: "",
  });
  const [error, setError] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function isFormValid() {
    return Boolean(form.customerId && form.customerName && form.contactNumber && form.email);
  }

  function handleAddCustomer() {
    if (!isFormValid()) {
      setError("Please fill in all fields before adding.");
      return;
    }

    setCustomers((prev) => [
      ...prev,
      {
        customerId: form.customerId,
        customerName: form.customerName,
        contactNumber: form.contactNumber,
        email: form.email,
      },
    ]);
    setForm({ customerId: "", customerName: "", contactNumber: "", email: "" });
    setError("");
  }

  function handleStartEdit(index) {
    const selected = customers[index];
    setForm({
      customerId: selected.customerId,
      customerName: selected.customerName,
      contactNumber: selected.contactNumber,
      email: selected.email,
    });
    setEditingIndex(index);
    setError("");
  }

  function handleSaveUpdate() {
    if (!isFormValid()) {
      setError("Please fill in all fields before saving.");
      return;
    }
    setCustomers((prev) =>
      prev.map((c, idx) =>
        idx === editingIndex
          ? {
              customerId: form.customerId,
              customerName: form.customerName,
              contactNumber: form.contactNumber,
              email: form.email,
            }
          : c
      )
    );
    setEditingIndex(null);
    setForm({ customerId: "", customerName: "", contactNumber: "", email: "" });
    setError("");
  }

  function handleCancelEdit() {
    setEditingIndex(null);
    setForm({ customerId: "", customerName: "", contactNumber: "", email: "" });
    setError("");
  }

  return (
    <div className="flex-1 bg-gradient-to-b from-blue-100 to-blue-50 p-10 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-blue-900">Customer Details</h1>

      <div className="bg-white rounded-3xl shadow-xl p-8">
        <div className="mb-6">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by any field (ID, name, contact, email)"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-blue-50 text-blue-900">
                <th className="text-left p-3 border-b">Customer ID</th>
                <th className="text-left p-3 border-b">Customer Name</th>
                <th className="text-left p-3 border-b">Contact Number</th>
                <th className="text-left p-3 border-b">Email</th>
                <th className="text-left p-3 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                if (customers.length === 0) {
                  return (
                    <tr>
                      <td className="p-3 text-gray-500" colSpan={5}>No customers added yet.</td>
                    </tr>
                  );
                }

                const q = searchQuery.trim().toLowerCase();
                const filtered = q
                  ? customers.filter((c) =>
                      [c.customerId, c.customerName, c.contactNumber, c.email]
                        .join(" ")
                        .toLowerCase()
                        .includes(q)
                    )
                  : customers;

                if (filtered.length === 0) {
                  return (
                    <tr>
                      <td className="p-3 text-gray-500" colSpan={5}>No matching customers.</td>
                    </tr>
                  );
                }

                return filtered.map((customer, index) => {
                  const originalIndex = customers.indexOf(customer);
                  return (
                    <tr key={`${customer.customerId}-${index}`} className="hover:bg-gray-50">
                      <td className="p-3 border-b">{customer.customerId}</td>
                      <td className="p-3 border-b">{customer.customerName}</td>
                      <td className="p-3 border-b">{customer.contactNumber}</td>
                      <td className="p-3 border-b">{customer.email}</td>
                      <td className="p-3 border-b">
                        <button
                          onClick={() => handleStartEdit(originalIndex)}
                          className="bg-blue-600 text-white text-sm py-1 px-3 rounded-md hover:bg-blue-700 disabled:opacity-50"
                          disabled={editingIndex !== null && editingIndex !== originalIndex}
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  );
                });
              })()}
            </tbody>
          </table>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            name="customerId"
            value={form.customerId}
            onChange={handleChange}
            placeholder="Customer ID"
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <input
            name="customerName"
            value={form.customerName}
            onChange={handleChange}
            placeholder="Customer Name"
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <input
            name="contactNumber"
            value={form.contactNumber}
            onChange={handleChange}
            placeholder="Contact Number"
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {error && <p className="text-red-600 mt-3">{error}</p>}

        {editingIndex === null ? (
          <button
            onClick={handleAddCustomer}
            className="mt-5 bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            Add Customer
          </button>
        ) : (
          <div className="mt-5 flex gap-3">
            <button
              onClick={handleSaveUpdate}
              className="bg-green-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 transition"
            >
              Save Changes
            </button>
            <button
              onClick={handleCancelEdit}
              className="bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerDetails;


