import React, { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";
import PageHeader from "../ui/PageHeader";

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
    <div className="flex-1 bg-white min-h-screen p-10">
      <PageHeader
        title="Add Service Job"
        subtitle="Create a new service job record"
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-7 4h8M7 8h10M5 6h14" />
          </svg>
        }
        actions={
          <Button variant="outline" onClick={() => history('/AllServiceJobs')}>All Service Jobs</Button>
        }
      />

      <Card className="max-w-3xl mx-auto p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Name & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Customer Name" type="text" name="customerName" value={formData.customerName} onChange={handleChange} placeholder="Enter customer name" required />

            <Input label="Phone Number" type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Enter phone number" required />
          </div>

          {/* Vehicle Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input label="Vehicle Number" type="text" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} placeholder="Vehicle number" required />

            <Input label="Vehicle Type" type="text" name="vehicleType" value={formData.vehicleType} onChange={handleChange} placeholder="Bike / Scooter" required />

            <Input label="Vehicle Model" type="text" name="vehicleModel" value={formData.vehicleModel} onChange={handleChange} placeholder="Vehicle model" required />
          </div>

          {/* Kilometers & Last Service Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Number of Kilometers" type="number" name="kilometers" value={formData.kilometers} onChange={handleChange} placeholder="Enter kilometers" required />

            <Input label="Last Service Date" type="date" name="lastServiceDate" value={formData.lastServiceDate} onChange={handleChange} required />
          </div>

          {/* Additional Requests */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Requests</label>
            <textarea
              name="additionalRequests"
              value={formData.additionalRequests}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              rows={4}
              placeholder="Enter any additional requests"
            />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <Button type="submit" className="px-6 py-3 rounded-xl">Add to System</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default ServiceJobCard;
