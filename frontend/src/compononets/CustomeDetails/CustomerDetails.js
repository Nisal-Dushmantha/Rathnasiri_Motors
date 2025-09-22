import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../ui/Card";
import Button from "../ui/Button";

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
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/customers");
        setCustomers(res.data || []);
      } catch (err) {
        console.error("Failed to load customers", err);
      }
    };
    fetchCustomers();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function isFormValid() {
    return Boolean(form.customerId && form.customerName && form.contactNumber && form.email);
  }

  async function handleAddCustomer() {
    if (!isFormValid()) {
      setError("Please fill in all fields before adding.");
      return;
    }
    try {
      const res = await axios.post("http://localhost:5000/customers", form);
      setCustomers((prev) => [res.data, ...prev]);
      setForm({ customerId: "", customerName: "", contactNumber: "", email: "" });
      setError("");
    } catch (err) {
      console.error("Failed to add customer", err);
      setError("Failed to add customer. Please try again.");
    }
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
    setEditingId(selected._id);
    setError("");
  }

  async function handleSaveUpdate() {
    if (!isFormValid()) {
      setError("Please fill in all fields before saving.");
      return;
    }
    try {
      const res = await axios.put(`http://localhost:5000/customers/${editingId}`, form);
      const updated = res.data;
      setCustomers((prev) => prev.map((c, idx) => (idx === editingIndex ? updated : c)));
      setEditingIndex(null);
      setEditingId(null);
      setForm({ customerId: "", customerName: "", contactNumber: "", email: "" });
      setError("");
    } catch (err) {
      console.error("Failed to update customer", err);
      setError("Failed to update customer. Please try again.");
    }
  }

  function handleCancelEdit() {
    setEditingIndex(null);
    setEditingId(null);
    setForm({ customerId: "", customerName: "", contactNumber: "", email: "" });
    setError("");
  }

  async function handleDeleteCustomer(id) {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await axios.delete(`http://localhost:5000/customers/${id}`);
        setCustomers((prev) => prev.filter((c) => c._id !== id));
      } catch (err) {
        console.error("Failed to delete customer", err);
        setError("Failed to delete customer. Please try again.");
      }
    }
  }

  return (
    <div className="flex-1 bg-white p-10 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-blue-900">Customer Details</h1>

      <Card className="p-8">
        <div className="mb-6">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by any field (ID, name, contact, email)"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-100 rounded-xl overflow-hidden">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-blue-900">
                <th className="text-left p-3">Customer ID</th>
                <th className="text-left p-3">Customer Name</th>
                <th className="text-left p-3">Contact Number</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Actions</th>
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
                    <tr key={`${customer.customerId}-${index}`} className="hover:bg-blue-50 border-b border-gray-100">
                      <td className="p-3">{customer.customerId}</td>
                      <td className="p-3">{customer.customerName}</td>
                      <td className="p-3">{customer.contactNumber}</td>
                      <td className="p-3">{customer.email}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button onClick={() => handleStartEdit(originalIndex)} disabled={editingIndex !== null && editingIndex !== originalIndex} className="py-1 px-3 text-sm">Update</Button>
                          <button onClick={() => handleDeleteCustomer(customer._id)} className="bg-red-600 text-white text-sm py-1 px-3 rounded-md hover:bg-red-700">Delete</button>
                        </div>
                      </td>
                    </tr>
                  );
                });
              })()}
            </tbody>
          </table>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <input name="customerId" value={form.customerId} onChange={handleChange} placeholder="Customer ID" className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          <input name="customerName" value={form.customerName} onChange={handleChange} placeholder="Customer Name" className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          <input name="contactNumber" value={form.contactNumber} onChange={handleChange} placeholder="Contact Number" className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>

        {error && <p className="text-red-600 mt-3">{error}</p>}

        {editingIndex === null ? (
          <Button onClick={handleAddCustomer} className="mt-5">Add Customer</Button>
        ) : (
          <div className="mt-5 flex gap-3">
            <Button onClick={handleSaveUpdate} className="bg-green-600 hover:bg-green-700">Save Changes</Button>
            <Button variant="outline" onClick={handleCancelEdit}>Cancel</Button>
          </div>
        )}
      </Card>
    </div>
  );
}

export default CustomerDetails;

