import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UpdateNewBike = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    type: '',
    model: '',
    color: '',
    quantity: '',
    price: '',
    offers: '',
    status: '',
    image: null,
  });

  const [previewImage, setPreviewImage] = useState('');

  // ✅ Fixed: fetchBikeData defined inside useEffect so no dependency warning
  useEffect(() => {
    const fetchBikeData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/newBs/${id}`);
        const bike = response.data.newBike;

        setFormData({
          type: bike.type || '',
          model: bike.model || '',
          color: bike.color || '',
          quantity: bike.quantity || '',
          price: bike.price || '',
          offers: bike.offers || '',
          status: bike.status || '',
          image: null,
        });

        if (bike.image) {
          setPreviewImage(`http://localhost:5000${bike.image}`);
        }
      } catch (err) {
        setError('Error fetching bike data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBikeData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('type', formData.type);
      formDataToSend.append('model', formData.model);
      formDataToSend.append('color', formData.color);
      formDataToSend.append('quantity', formData.quantity);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('offers', formData.offers);
      formDataToSend.append('status', formData.status);

      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      // ✅ Fixed: removed unused `response`
      await axios.put(`http://localhost:5000/newBs/${id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage('Bike updated successfully!');
      setTimeout(() => {
        navigate('/NewBikes');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating bike');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.type) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Update New Bike</h1>
            <p className="text-blue-100 mt-1">
              Modify bike details including price, offers, and status
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Messages */}
            {message && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                {message}
              </div>
            )}

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <input
                  type="text"
                  name="type"
                  value={formData.type}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                  required
                />
              </div>

              {/* Model */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Model
                </label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                  required
                />
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                  required
                />
              </div>

              {/* quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <select
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Quantity</option>
                  {[1,2,3,4,5,6].map((num) => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price
                </label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., $5000"
                  required
                />
              </div>

              {/* Offers */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Offers
                </label>
                <input
                  type="text"
                  name="offers"
                  value={formData.offers}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 10% off, Free helmet"
                  required
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="Available">Available</option>
                  <option value="Sold">Sold</option>
                  <option value="Reserved">Reserved</option>
                </select>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bike Image
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  name="image"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {previewImage && (
                  <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-300">
                    <img
                      src={previewImage}
                      alt="Bike preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Leave empty to keep the current image
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/NewBikes')}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating...' : 'Update Bike'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateNewBike;
