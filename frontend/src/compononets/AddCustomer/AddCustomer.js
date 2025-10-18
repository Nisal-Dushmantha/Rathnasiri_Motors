import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Card from "../ui/Card";
import Button from "../ui/Button";

function AddCustomer() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    customerId: "",
    customerName: "",
    contactNumber: "",
    email: "",
  });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [customers, setCustomers] = useState([]);
  const [duplicateModal, setDuplicateModal] = useState({ open: false, title: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => (prev && prev[name] ? { ...prev, [name]: undefined } : prev));
  }

  function isFormValid() {
    // customerId optional (server can auto-generate)
    return Boolean(form.customerName && form.contactNumber && form.email);
  }

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/customers');
        setCustomers(res.data || []);
      } catch (err) {
        console.error('Failed to load customers for validation', err);
      }
    };
    fetchCustomers();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!isFormValid()) {
      setError("Please fill in all fields before adding.");
      return;
    }
    // client-side duplicate check for customerId
    if (form.customerId) {
      const existingById = customers.find((c) => c.customerId === form.customerId);
      if (existingById) {
        setDuplicateModal({ open: true, title: 'Customer ID in use', message: `Customer ID ${form.customerId} is already being used.` });
        return;
      }
    }
    try {
      setSubmitting(true);
      const res = await axios.post("http://localhost:5000/customers", form);
      setError("");
      const created = res.data;
      if (created && created.customerId) {
        alert(`Customer created with ID: ${created.customerId}`);
      }
      navigate("/CustomerDetails");
    } catch (err) {
      console.error("Failed to add customer", err);
      // parse structured field errors from backend if available
      const apiErrors = err?.response?.data?.errors;
      if (Array.isArray(apiErrors) && apiErrors.length > 0) {
        const byField = {};
        apiErrors.forEach((e) => {
          if (e.field) byField[e.field] = e.message || 'Invalid value';
        });
        setFieldErrors(byField);
        setError('Please fix the highlighted fields.');
      } else {
        setError("Failed to add customer. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex-1 bg-white p-10 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-blue-900">Add Customer</h1>
      <Card className="max-w-3xl mx-auto p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer ID</label>
            <input
              name="customerId"
              value={form.customerId}
              onChange={handleChange}
              placeholder="Customer ID (leave blank to auto-generate)"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {fieldErrors.customerId && <div className="text-xs text-red-600 mt-1">{fieldErrors.customerId}</div>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
            <input
              name="customerName"
              value={form.customerName}
              onChange={handleChange}
              placeholder="Enter customer name"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {fieldErrors.customerName && <div className="text-xs text-red-600 mt-1">{fieldErrors.customerName}</div>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
            <input
              name="contactNumber"
              value={form.contactNumber}
              onChange={handleChange}
              placeholder="Enter contact number"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {fieldErrors.contactNumber && <div className="text-xs text-red-600 mt-1">{fieldErrors.contactNumber}</div>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email address"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {fieldErrors.email && <div className="text-xs text-red-600 mt-1">{fieldErrors.email}</div>}
          </div>

          {error && <p className="text-red-600">{error}</p>}

          <div className="text-center">
            <Button type="submit" disabled={submitting} className="px-6 py-3 rounded-xl">
              {submitting ? "Saving..." : "Add Customer"}
            </Button>
          </div>
        </form>
      </Card>
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

export default AddCustomer;

