import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UsedBikesForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: "",
    model: "",
    color: "",
    price: "",
    mileage: "",
    year: "",
    owner: "",
    status: "Available",
    image: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0); // Added state
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setFormData({ ...formData, image: file });
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const data = new FormData();
      data.append("type", formData.type.trim());
      data.append("model", formData.model.trim());
      data.append("color", formData.color.trim());
      data.append("price", formData.price.toString());
      data.append("mileage", formData.mileage.trim());
      data.append("year", formData.year.trim());
      data.append("owner", formData.owner.trim());
      data.append("status", formData.status);

      if (formData.image) {
        if (formData.image.size > 5 * 1024 * 1024) {
          alert("Image file is too large. Please choose an image smaller than 5MB.");
          setIsSubmitting(false);
          return;
        }
        data.append("image", formData.image);
      }

      const res = await axios.post("http://localhost:5000/usedBs", data, {
        headers: { "Content-Type": "multipart/form-data" },
        signal: controller.signal,
        timeout: 30000,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      clearTimeout(timeoutId);
      setShowSuccess(true);

      setTimeout(() => {
        setFormData({
          type: "",
          model: "",
          color: "",
          price: "",
          mileage: "",
          year: "",
          owner: "",
          status: "Available",
          image: null,
        });
        setImagePreview(null);
        setUploadProgress(0); // Reset progress
        setShowSuccess(false);
        navigate("/UsedBikes");
      }, 1500);
    } catch (err) {
      if (err.name === "AbortError") {
        alert("Request timed out. Please check your connection and try again.");
      } else if (err.code === "ECONNABORTED") {
        alert("Request timed out. Please check if the server is running.");
      } else if (!err.response) {
        alert(
          "Cannot connect to server. Please check if the backend server is running on http://localhost:5000"
        );
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
          <span>Used bike added successfully!</span>
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
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Add Used Bike</h2>
          <p className="text-gray-600">Enter the details of the used bike to add to inventory</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bike Type */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Bike Type</label>
              <input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Sport, Cruiser, Touring"
              />
            </div>

            {/* Model */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Model</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Honda CBR 600RR"
              />
            </div>

            {/* Color */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Color</label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Red, Black, Blue"
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Price (Rs.)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="250000"
                min="0"
              />
            </div>

            {/* Mileage */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Mileage (km)</label>
              <input
                type="number"
                name="mileage"
                value={formData.mileage}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="20000"
                min="0"
              />
            </div>

            {/* Year */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Year</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="2018"
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>

            {/* Owner */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Previous Owners</label>
              <input
                type="text"
                name="owner"
                value={formData.owner}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., First Owner, Second Owner"
              />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Available">Available</option>
              <option value="Sold">Sold</option>
              <option value="Reserved">Reserved</option>
            </select>
          </div>

          {/* Image */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Bike Image</label>
            <div className="space-y-4">
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {imagePreview && (
                <div className="relative group">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-xl border-2 border-gray-200"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Upload Progress */}
          {uploadProgress > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              }`}
            >
              {isSubmitting ? "Adding Used Bike..." : "Add Used Bike"}
            </button>
          </div>

          {/* Back */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate("/UsedBikes")}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              ← Back to Used Bikes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UsedBikesForm;
