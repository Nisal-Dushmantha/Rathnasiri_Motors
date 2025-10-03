import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Card from "../ui/Card";
import Button from "../ui/Button";
import PageHeader from "../ui/PageHeader";

function SalesBikeForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    license_no: "",
    NIC: "",
    address: "",
    contact_no: "",
    bike_model: "",
    color: "",
    chassis_no: "",
    reg_year: "",
    last_price: "",
    date: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await axios.post("http://localhost:5000/bikeSalesReports/", formData, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Response:", res.data);
      setShowSuccess(true);

      setTimeout(() => {
        setFormData({
          name: "",
          license_no: "",
          NIC: "",
          address: "",
          contact_no: "",
          bike_model: "",
          color: "",
          chassis_no: "",
          reg_year: "",
          last_price: "",
          date: "",
        });
        setShowSuccess(false);
        navigate("/BikeSalesReport");
      }, 1500);
    } catch (err) {
      console.error("Error:", err);
      alert(
        `Failed to add owner: ${err.response?.data?.message || err.message}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 bg-white min-h-screen p-10">
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center space-x-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>Report Created successfully!</span>
        </div>
      )}

      <PageHeader
        title="Create Sales Report"
        subtitle="Enter the details to the Report"
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        }
        actions={
          <Button variant="outline" onClick={() => navigate('/BikeSalesReport')}>All Sales Reports</Button>
        }
      />

      <Card className="max-w-3xl mx-auto p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Date Field */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Date of Sale
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-1/2 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
            />
          </div>

          {/* Customer Details Section */}
          <div>
            <h3 className="text-2xl font-bold text-blue-800 mb-4">
              Customer Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
                  placeholder="e.g., John Doe"
                />
              </div>

              {/* License No */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  License No
                </label>
                <input
                  type="text"
                  name="license_no"
                  value={formData.license_no}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
                  placeholder="e.g., B1234567"
                />
              </div>

              {/* NIC */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  NIC
                </label>
                <input
                  type="text"
                  name="NIC"
                  value={formData.NIC}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
                  placeholder="e.g., 200012345678"
                />
              </div>

              {/* Contact No */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Contact No
                </label>
                <input
                  type="tel"
                  name="contact_no"
                  value={formData.contact_no}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{10}"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
                  placeholder="07XXXXXXXX"
                />
              </div>

              {/* Address */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows="2"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
                  placeholder="Enter full address"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Bike Details Section */}
          <div>
            <h3 className="text-2xl font-bold text-blue-800 mb-4">
              Bike Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bike Model */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Bike Model
                </label>
                <select
                  name="bike_model"
                  value={formData.bike_model}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
                >
                  <option value="">Select Model</option>
                  <option value="Ray Zr-Street Rally">Ray Zr-Street Rally</option>
                  <option value="Fz S Version 4.0">Fz S Version 4.0</option>
                  <option value="Ray Zr Disc-113cc">Ray Zr Disc-113cc</option>
                  <option value="Ray Zr-125cc">Ray Zr-125cc</option>
                  <option value="MT-15 Version 2.0">MT-15 Version 2.0</option>
                  <option value="R-15 Version 4.0">R-15 Version 4.0</option>
                  <option value="Ray Zr Street Rally-125cc">Ray Zr Street Rally-125cc</option>
                  <option value="Fz Version 2.0">Fz Version 2.0</option>
                </select>
              </div>

              {/* Color */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Color
                </label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
                  placeholder="e.g., Red, Black"
                />
              </div>

              {/* Chassis No */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Chassi Number
                </label>
                <input
                  type="text"
                  name="chassis_no"
                  value={formData.chassis_no}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
                  placeholder="e.g., ABC123XYZ"
                />
              </div>

              {/* Reg Year */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Registration Year
                </label>
                <select
                  name="reg_year"
                  value={formData.reg_year}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
                >
                  <option value="">Select Year</option>
                  {Array.from({length: 2026-2015+1}, (_,i) => 2015+i).map((yr) => (
                    <option key={yr} value={yr}>{yr}</option>
                  ))}
                </select>
              </div>

              {/* Last Price */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Last Price (Rs.)
                </label>
                <input
                  type="number"
                  name="last_price"
                  value={formData.last_price}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
                  placeholder="500000"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button type="submit" disabled={isSubmitting} className="w-full py-3 text-base">
              {isSubmitting ? "Create Report..." : "Create Report"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default SalesBikeForm;
