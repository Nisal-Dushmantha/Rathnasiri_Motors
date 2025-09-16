import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function BikesSalesHisForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: "",
    model: "",
    last_price: "",
    buyer_name: "",
    contact_no: "",
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
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

      const payload = {
        type: formData.type.trim(),
        model: formData.model.trim(),
        last_price: formData.last_price.trim(),
        buyer_name: formData.buyer_name,
        contact_no: formData.contact_no.trim(),
      };

      console.log("Submitting form data...");
      const res = await axios.post("http://localhost:5000/newBsH", payload, {
        headers: { "Content-Type": "application/json" },
        timeout: 30000,
      });

      clearTimeout(timeoutId);
      console.log("Response:", res.data);

      setShowSuccess(true);

      setTimeout(() => {
        setFormData({
          type: "",
          model: "",
          last_price: "",
          buyer_name: "",
          contact_no: "",
        });
        setShowSuccess(false);
        navigate("/BikesSalesHistory");
      }, 1500);
    } catch (err) {
      if (err.name === "AbortError" || err.code === "ECONNABORTED") {
        alert("Request timed out. Please check your connection or server.");
      } else if (!err.response) {
        alert("Cannot connect to server. Make sure backend is running on http://localhost:5000");
      } else {
        console.error("Error details:", err);
        alert(`Failed to add bike: ${err.response?.data?.message || err.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-50 flex items-center justify-center p-6">
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center space-x-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>Bike added successfully!</span>
        </div>
      )}

      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-2xl border border-white/20">
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Add Sold bike to the Sales History
          </h2>
          <p className="text-gray-600">
            Enter the buyer details
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Bike Type
              </label>
              <input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                placeholder="e.g., Sport, Cruiser, Touring"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Model
              </label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                placeholder="e.g., Honda CBR 600RR"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Last Price (Rs.)
              </label>
              <input
                type="number"
                name="last_price"
                value={formData.last_price}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                placeholder="250000"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Buyer Name
              </label>
              <input
                type="text"
                name="buyer_name"
                value={formData.buyer_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Contact Number
              </label>
              <input
                type="text"
                name="contact_no"
                value={formData.contact_no}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
              />
            </div>
          </div>

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
              {isSubmitting ? "Adding Bike..." : "Add Bike to Sales History"}
            </button>
          </div>
          


        </form>
      </div>
    </div>
  );
}

export default BikesSalesHisForm;
