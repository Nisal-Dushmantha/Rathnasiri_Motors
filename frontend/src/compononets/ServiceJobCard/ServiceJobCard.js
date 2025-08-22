import React, { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

function ServiceJobCard() {
  const history = useNavigate();
  
  const [formData, setFormData] = useState({
    customerName: "",
    phoneNumber: "",
    vehicleNumber: "",
    vehicleType: "",
    vehicleModel: "",
    kilometers: "",
    lastServiceDate: "",
    additionalRequests: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Service Job Added:", formData);
    alert("Service Job added to system!");
    sendRequest().then(()=>history("/AllServiceJobs"));
    
  }

  const sendRequest = async () => {
  await axios.post("http://localhost:5000/services", {
    Name: String(formData.customerName),
    Phone: Number(formData.phoneNumber),
    VehicleNumber: String(formData.vehicleNumber),
    VehicleType: String(formData.vehicleType),
    Model: String(formData.vehicleModel),
    KiloMeters: Number(formData.kilometers),
    LastServiceDate: formData.lastServiceDate, 
    Requests: String(formData.additionalRequests), 
  }).then((res) => res.data);
};


  return (
    <div className="flex-1 bg-gradient-to-b from-blue-100 to-blue-50 min-h-screen p-10">
      <h1 className="text-3xl font-bold mb-8 text-blue-900 text-center">
        Add Service Job
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-8 space-y-6"
      >
        {/* Customer Name & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Customer Name
            </label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter customer name"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter phone number"
              required
            />
          </div>
        </div>

        {/* Vehicle Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Vehicle Number
            </label>
            <input
              type="text"
              name="vehicleNumber"
              value={formData.vehicleNumber}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Vehicle number"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Vehicle Type
            </label>
            <input
              type="text"
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Car / Bike / Truck"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Vehicle Model
            </label>
            <input
              type="text"
              name="vehicleModel"
              value={formData.vehicleModel}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Vehicle model"
              required
            />
          </div>
        </div>

        {/* Kilometers & Last Service Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Number of Kilometers
            </label>
            <input
              type="number"
              name="kilometers"
              value={formData.kilometers}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter kilometers"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Last Service Date
            </label>
            <input
              type="date"
              name="lastServiceDate"
              value={formData.lastServiceDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
        </div>

        {/* Additional Requests */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Additional Requests
          </label>
          <textarea
            name="additionalRequests"
            value={formData.additionalRequests}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={4}
            placeholder="Enter any additional requests"
          />
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-800 text-white py-3 px-6 rounded-2xl font-semibold hover:bg-blue-700 transition"
          >
            Add to System
          </button>
        </div>
      </form>
    </div>
  );
}

export default ServiceJobCard;
