import React, { useState } from "react";
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
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function isFormValid() {
    return Boolean(
      form.customerId && form.customerName && form.contactNumber && form.email
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!isFormValid()) {
      setError("Please fill in all fields before adding.");
      return;
    }
    try {
      setSubmitting(true);
      await axios.post("http://localhost:5000/customers", form);
      setError("");
      navigate("/CustomerDetails");
    } catch (err) {
      console.error("Failed to add customer", err);
      setError("Failed to add customer. Please try again.");
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
              placeholder="Enter customer ID"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
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
          </div>

          {error && <p className="text-red-600">{error}</p>}

          <div className="text-center">
            <Button type="submit" disabled={submitting} className="px-6 py-3 rounded-xl">
              {submitting ? "Saving..." : "Add Customer"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default AddCustomer;

