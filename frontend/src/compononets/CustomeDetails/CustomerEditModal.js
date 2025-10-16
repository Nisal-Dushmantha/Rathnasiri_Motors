import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from '../ui/Button';

export default function CustomerEditModal({ customer, onClose, onSaved, onValidationError, existingCustomers = [], onDuplicate }) {
  const [form, setForm] = useState({ customerId: '', customerName: '', contactNumber: '', email: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (customer) {
      setForm({
        customerId: customer.customerId || '',
        customerName: customer.customerName || '',
        contactNumber: customer.contactNumber || '',
        email: customer.email || '',
      });
      setFieldErrors({});
      setError('');
    }
  }, [customer]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setFieldErrors((p) => (p && p[name] ? { ...p, [name]: undefined } : p));
    setError('');
  }

  async function handleSave() {
    if (!form.customerId || !form.customerName || !form.contactNumber || !form.email) {
      setError('Please fill all fields.');
      return;
    }
    // check duplicates among other customers (exclude the one being edited)
    const otherCustomers = (existingCustomers || []).filter((c) => c._id !== customer._id);
    const dupById = otherCustomers.find((c) => c.customerId === form.customerId);
    if (dupById) {
      const title = 'Customer ID in use';
      const message = `Customer ID ${form.customerId} is already being used by another customer.`;
      onDuplicate && onDuplicate(title, message);
      return;
    }
    try {
      setSaving(true);
      setFieldErrors({});
      const res = await axios.put(`http://localhost:5000/customers/${customer._id}`, form);
      onSaved && onSaved(res.data);
      setSaving(false);
      onClose && onClose();
    } catch (err) {
      setSaving(false);
      const apiErrors = err?.response?.data?.errors;
      if (Array.isArray(apiErrors) && apiErrors.length > 0) {
        const byField = {};
        apiErrors.forEach((e) => {
          if (e.field) byField[e.field] = e.message || 'Invalid value';
        });
        setFieldErrors(byField);
        onValidationError && onValidationError(byField);
        setError('Please fix the highlighted fields.');
      } else {
        setError('Failed to update customer. Please try again.');
      }
    }
  }

  if (!customer) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 p-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-900">Update Customer</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-600">Customer ID</label>
            <input name="customerId" value={form.customerId} onChange={handleChange} className={`w-full px-3 py-2 border ${fieldErrors.customerId ? 'border-red-500' : 'border-gray-200'} rounded`} />
            {fieldErrors.customerId && <div className="text-xs text-red-600 mt-1">{fieldErrors.customerId}</div>}
          </div>
          <div>
            <label className="text-xs text-gray-600">Customer Name</label>
            <input name="customerName" value={form.customerName} onChange={handleChange} className={`w-full px-3 py-2 border ${fieldErrors.customerName ? 'border-red-500' : 'border-gray-200'} rounded`} />
            {fieldErrors.customerName && <div className="text-xs text-red-600 mt-1">{fieldErrors.customerName}</div>}
          </div>
          <div>
            <label className="text-xs text-gray-600">Contact Number</label>
            <input name="contactNumber" value={form.contactNumber} onChange={handleChange} className={`w-full px-3 py-2 border ${fieldErrors.contactNumber ? 'border-red-500' : 'border-gray-200'} rounded`} />
            {fieldErrors.contactNumber && <div className="text-xs text-red-600 mt-1">{fieldErrors.contactNumber}</div>}
          </div>
          <div>
            <label className="text-xs text-gray-600">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} className={`w-full px-3 py-2 border ${fieldErrors.email ? 'border-red-500' : 'border-gray-200'} rounded`} />
            {fieldErrors.email && <div className="text-xs text-red-600 mt-1">{fieldErrors.email}</div>}
          </div>
        </div>

        {error && <div className="text-red-600 mt-3">{error}</div>}

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
        </div>
      </div>
    </div>
  );
}
