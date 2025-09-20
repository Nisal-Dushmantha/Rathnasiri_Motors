import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function SparePartsForm() {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    barcode: "",
    name: "",
    brand: "",
    rack: "",
    Quentity: "",
    price: "",
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
      const res = await axios.post("http://localhost:5000/sp", formData, {
        headers: { "Content-Type": "application/json" },
        timeout: 30000,
      });

      console.log("Response:", res.data);

      setShowSuccess(true);

      // Reset form and navigate after success
      setTimeout(() => {
        setFormData({
          barcode: "",
          name: "",
          brand: "",
          rack: "",
          Quentity: "",
          price: "",
        });
        setShowSuccess(false);
        navigate("/SparePartsDisplay");
      }, 1500);
    } catch (err) {
      console.error("Error details:", err);
      alert(
        `Failed to add item: ${err.response?.data?.message || err.message}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
   <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-50 flex items-center justify-center p-6">
      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center space-x-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>Item added successfully!</span>
        </div>
      )}

      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-2xl border border-white/20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-2">
            Add New Item
          </h2>
          <p className="text-gray-600">
            Enter the details of the new item to add to inventory
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Barcode */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Barcode
              </label>
              <input
                type="text"
                name="barcode"
                value={formData.barcode}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                placeholder="e.g., 123456789"
              />
            </div>

            {/* Name */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                placeholder="e.g., Yamaha FZ"
              />
            </div>

            {/* Brand */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Brand
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                placeholder="e.g., Honda"
              />
            </div>

            {/* Rack */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Rack
              </label>
              <input
                type="text"
                name="rack"
                value={formData.rack}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                placeholder="e.g., Rack A1"
              />
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                name="Quentity"
                value={formData.Quentity}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                placeholder="e.g., 5"
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Price (Rs.)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                placeholder="250000"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl"
              }`}
            >
              {isSubmitting ? "Adding Item..." : "Add Item to Inventory"}
            </button>
          </div>

          {/* Back Button */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate("/inventory")}
              className="text-gray-600 hover:text-gray-800 transition-colors duration-200 font-medium"
            >
              ← Back to Inventory
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SparePartsForm;
