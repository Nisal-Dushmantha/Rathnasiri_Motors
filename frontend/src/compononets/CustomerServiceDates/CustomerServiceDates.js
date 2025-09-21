import React, { useState } from 'react';
import axios from 'axios';
import CustomerNavBar from '../CustomerNavBar/CustomerNavBar';
import CustomerFooter from '../CustomerFooter/CustomerFooter';

function CustomerServiceDates() {
  const [formData, setFormData] = useState({
    name: '',
    vehicleType: '',
    vehicleModel: '',
    plateNumber: '',
    phoneNumber: '',
    serviceDate: '',
    serviceTime: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/serviceDates', formData);
      alert('Service date booked successfully!');
      setFormData({
        name: '',
        vehicleType: '',
        vehicleModel: '',
        plateNumber: '',
        phoneNumber: '',
        serviceDate: '',
        serviceTime: '',
      });
    } catch (err) {
      console.error('Error submitting form:', err);
      alert('Failed to book service date.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-50 flex flex-col">
      <CustomerNavBar />
      <main className="flex-grow flex items-center justify-center p-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-xl space-y-6"
        >
          <h2 className="text-3xl font-bold text-blue-900 text-center">Book a Service Date</h2>

          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-xl"
          />

          <input
            type="text"
            name="vehicleType"
            placeholder="Vehicle Type"
            value={formData.vehicleType}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-xl"
          />

          <input
            type="text"
            name="vehicleModel"
            placeholder="Vehicle Model"
            value={formData.vehicleModel}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-xl"
          />

          <input
            type="text"
            name="plateNumber"
            placeholder="Plate Number"
            value={formData.plateNumber}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-xl"
          />

          <input
            type="tel"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-xl"
          />

          <input
            type="date"
            name="serviceDate"
            value={formData.serviceDate}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-xl"
          />

          <input
            type="time"
            name="serviceTime"
            value={formData.serviceTime}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-xl"
          />

          <button
            type="submit"
            className="w-full bg-blue-800 text-white py-3 rounded-xl hover:bg-blue-700 transition font-semibold"
          >
            Submit
          </button>
        </form>
      </main>
      <CustomerFooter />
    </div>
  );
}

export default CustomerServiceDates;
