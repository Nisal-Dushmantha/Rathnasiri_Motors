import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function NewBikesForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: "",
    model: "",
    color: "",
    quantity: "",
    price: "",
    status: "Available",
    image: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setFormData({ ...formData, image: file });
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
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
      // Add timeout to prevent infinite waiting
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const data = new FormData();
      data.append("type", formData.type.trim());
      data.append("model", formData.model.trim());
      data.append("color", formData.color.trim());
      data.append("quantity", formData.quantity.trim());
      data.append("price", formData.price.toString());
      data.append("offers", formData.offers.trim());
      data.append("status", formData.status);
      if (formData.image) {
        // Compress image if it's too large
        if (formData.image.size > 5 * 1024 * 1024) {
          // 5MB
          alert(
            "Image file is too large. Please choose an image smaller than 5MB."
          );
          setIsSubmitting(false);
          return;
        }
        data.append("image", formData.image);
      }

      console.log("Submitting form data...");
      const res = await axios.post("http://localhost:5000/newBs", data, {
        headers: { "Content-Type": "multipart/form-data" },
        signal: controller.signal,
        timeout: 30000, // 30 second timeout
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
          console.log(`Upload Progress: ${percentCompleted}%`);
        },
      });

      clearTimeout(timeoutId);
      console.log("Response:", res.data);

      // Show success message briefly
      setShowSuccess(true);

      // Reset form and navigate after a short delay
      setTimeout(() => {
        setFormData({
          type: "",
          model: "",
          color: "",
          quantity: "",
          price: "",
          offers: "",
          status: "Available",
          image: null,
        });
        setImagePreview(null);
        setUploadProgress(0);
        setShowSuccess(false);
        navigate("/NewBikes");
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
        console.error("Response data:", err.response?.data);
        console.error("Response status:", err.response?.status);
        alert(
          `Failed to add bike: ${err.response?.data?.message || err.message}`
        );
      }
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
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
          <span>Bike added successfully!</span>
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
            Add New Bike
          </h2>
          <p className="text-gray-600">
            Enter the details of the new bike to add to inventory
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Type Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 ">
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

            {/* Model Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 ">
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

            {/* Color Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 ">
                Color
              </label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                placeholder="e.g., Red, Black, Blue"
              />
            </div>

            {/* quantity*/}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 ">
                Quantity
              </label>
              <input
                type="text"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                placeholder="1, 2, 3, 4"
              />
            </div>

            {/* Price Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 ">
                Price (Rs.)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                placeholder="250000"
                min="0"
              />
            </div>

            {/* Offers */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 ">
                Offers
              </label>
              <input
                type="text"
                name="offers"
                value={formData.offers}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
              
              />
            </div>
          </div>

          {/* Status Field */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 ">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
            >
              <option value="Available">Available</option>
              <option value="Sold">Sold</option>
              <option value="Reserved">Reserved</option>
            </select>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 ">
              Bike Image
            </label>
            <div className="space-y-4">
              {/* File Input */}
              <div className="relative">
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="relative group">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-xl border-2 border-gray-200"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-xl flex items-center justify-center">
                    <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-medium">
                      Image Preview
                    </span>
                  </div>
                </div>
              )}
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
              {isSubmitting ? (
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Adding Bike...</span>
                  </div>
                  {uploadProgress > 0 && (
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div
                        className="bg-white h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  )}
                  {uploadProgress > 0 && (
                    <span className="text-sm">{uploadProgress}% uploaded</span>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <svg
                    className="w-5 h-5"
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
                  <span>Add Bike to Inventory</span>
                </div>
              )}
            </button>
          </div>

          {/* Back Button */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate("/NewBikes")}
              className="text-gray-600 hover:text-gray-800 transition-colors duration-200 font-medium"
            >
              ← Back to Vehicle Overview
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewBikesForm;
