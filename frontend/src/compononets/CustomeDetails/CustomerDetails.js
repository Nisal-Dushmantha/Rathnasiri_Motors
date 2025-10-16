import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../ui/Card";
import Button from "../ui/Button";
import CustomerQRCodeModal from "./CustomerQRCodeModal";
import CustomerEditModal from './CustomerEditModal';

function CustomerDetails() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({
    customerId: "",
    customerName: "",
    contactNumber: "",
    email: "",
  });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [highlightedRow, setHighlightedRow] = useState(null); // index of table row to highlight (or 'form')
  const [editModalCustomer, setEditModalCustomer] = useState(null);
  const [duplicateModal, setDuplicateModal] = useState({ open: false, title: '', message: '' });
  const [searchQuery, setSearchQuery] = useState("");
  const [qrModalCustomer, setQrModalCustomer] = useState(null);

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
    // clear field-specific error when user edits the field
    setFieldErrors((prev) => (prev && prev[name] ? { ...prev, [name]: undefined } : prev));
    // clear highlighted row because user is editing
    setHighlightedRow(null);
  }

  function isFormValid() {
    // customerId optional (server can auto-generate)
    return Boolean(form.customerName && form.contactNumber && form.email);
  }

  async function handleAddCustomer() {
    if (!isFormValid()) {
      setError("Please fill in all fields before adding.");
      return;
    }
    // check for duplicate customerId (primary key behavior)
    const existingById = customers.find((c) => c.customerId === form.customerId);
    if (existingById) {
      setDuplicateModal({ open: true, title: 'Customer ID in use', message: `Customer ID ${form.customerId} is already being used.` });
      return;
    }
    // NOTE: name-duplication check intentionally removed — only customerId is enforced as primary key
    try {
      setFieldErrors({});
      setHighlightedRow(null);
      const res = await axios.post("http://localhost:5000/customers", form);
      setCustomers((prev) => [res.data, ...prev]);
      // notify user of the assigned/generated ID (parity with AddCustomer page)
      if (res && res.data && res.data.customerId) {
        alert(`Customer created with ID: ${res.data.customerId}`);
      }
      setForm({ customerId: "", customerName: "", contactNumber: "", email: "" });
      setError("");
      setFieldErrors({});
    } catch (err) {
      console.error("Failed to add customer", err);
      // backend validation returns { errors: [{ field, message }] }
      const apiErrors = err?.response?.data?.errors;
      if (Array.isArray(apiErrors) && apiErrors.length > 0) {
        const byField = {};
        apiErrors.forEach((e) => {
          if (e.field) byField[e.field] = e.message || "Invalid value";
        });
        setFieldErrors(byField);
        // highlight the form area
        setHighlightedRow('form');
        setError("Please fix the highlighted fields.");
      } else {
        setError("Failed to add customer. Please try again.");
      }
    }
  }

  function handleStartEdit(index) {
    const selected = customers[index];
    // open edit modal with selected customer
    setEditModalCustomer(selected);
    // clear any previous errors/highlight
    setFieldErrors({});
    setHighlightedRow(null);
    setError('');
  }

  // Update is now handled in the edit modal. The modal will call onSaved/onValidationError callbacks.

  // Editing is handled in the modal; no inline cancel handler needed

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
                  const isHighlighted = highlightedRow === originalIndex;
                  return (
                    <tr
                      key={`${customer.customerId}-${index}`}
                      className={`hover:bg-blue-50 border-b border-gray-100 ${isHighlighted ? 'bg-yellow-50 ring-2 ring-yellow-300' : ''}`}
                    >
                      <td className="p-3">{customer.customerId}</td>
                      <td className="p-3">{customer.customerName}</td>
                      <td className="p-3">{customer.contactNumber}</td>
                      <td className="p-3">{customer.email}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button onClick={() => handleStartEdit(originalIndex)} disabled={editModalCustomer !== null} className="py-1 px-3 text-sm">Update</Button>
                          <button onClick={() => handleDeleteCustomer(customer._id)} className="bg-red-600 text-white text-sm py-1 px-3 rounded-md hover:bg-red-700">Delete</button>
                          <button onClick={() => setQrModalCustomer(customer)} className="bg-green-600 text-white text-sm py-1 px-3 rounded-md hover:bg-green-700">View QR</button>
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
          <div>
            <input name="customerId" value={form.customerId} onChange={handleChange} placeholder="Customer ID (leave blank to auto-generate)" className={`px-4 py-3 border ${fieldErrors.customerId ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`} />
            {fieldErrors.customerId && <div className="text-xs text-red-600 mt-1">{fieldErrors.customerId}</div>}
          </div>
          <div>
            <input name="customerName" value={form.customerName} onChange={handleChange} placeholder="Customer Name" className={`px-4 py-3 border ${fieldErrors.customerName ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`} />
            {fieldErrors.customerName && <div className="text-xs text-red-600 mt-1">{fieldErrors.customerName}</div>}
          </div>
          <div>
            <input name="contactNumber" value={form.contactNumber} onChange={handleChange} placeholder="Contact Number" className={`px-4 py-3 border ${fieldErrors.contactNumber ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`} />
            {fieldErrors.contactNumber && <div className="text-xs text-red-600 mt-1">{fieldErrors.contactNumber}</div>}
          </div>
          <div>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" className={`px-4 py-3 border ${fieldErrors.email ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`} />
            {fieldErrors.email && <div className="text-xs text-red-600 mt-1">{fieldErrors.email}</div>}
          </div>
        </div>

        {error && <p className="text-red-600 mt-3">{error}</p>}

        <div className="mt-5">
          <Button onClick={handleAddCustomer} className="">Add Customer</Button>
        </div>
      </Card>
      {/* QR Code Modal */}
      {qrModalCustomer && (
        <CustomerQRCodeModal customer={qrModalCustomer} onClose={() => setQrModalCustomer(null)} />
      )}
      {/* Edit Modal */}
      {editModalCustomer && (
        <CustomerEditModal
          customer={editModalCustomer}
          existingCustomers={customers}
          onDuplicate={(title, message) => setDuplicateModal({ open: true, title, message })}
          onClose={() => setEditModalCustomer(null)}
          onSaved={(updated) => {
            // find index by _id and replace
            setCustomers((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
            setFieldErrors({});
            setHighlightedRow(null);
            setError('');
          }}
          onValidationError={(byField) => {
            // highlight the row for the customer
            const idx = customers.findIndex((c) => c._id === editModalCustomer._id);
            if (idx >= 0) setHighlightedRow(idx);
            setFieldErrors(byField || {});
            setError('Please fix the highlighted fields.');
          }}
        />
      )}

      {/* Duplicate / conflict popup */}
      {duplicateModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-2 text-blue-900">{duplicateModal.title}</h3>
            <p className="text-sm text-gray-700 mb-4">{duplicateModal.message}</p>
            <div className="flex justify-end">
              <Button onClick={() => setDuplicateModal({ open: false, title: '', message: '' })}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerDetails;

