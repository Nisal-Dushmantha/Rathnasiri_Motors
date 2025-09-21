import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const SparePartsUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    barcode: "",
    name: "",
    brand: "",
    rack: "",
    Quentity: "",
    price: "",
  });

  useEffect(() => {
    const fetchSparePartData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/sp/${id}`);
        const sparePart = response.data.sp;

        setFormData({
          barcode: sparePart.barcode || "",
          name: sparePart.name || "",
          brand: sparePart.brand || "",
          rack: sparePart.rack || "",
          Quentity: sparePart.Quentity || "",
          price: sparePart.price || "",
        });
      } catch (err) {
        setError("Error fetching spare part data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSparePartData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await axios.put(`http://localhost:5000/sp/${id}`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setMessage("✅ Spare part updated successfully!");
      setTimeout(() => {
        navigate("/SparePartsDisplay");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "❌ Error updating spare part");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.barcode) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10">
      <div className="max-w-2xl mx-auto px-6">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-700 to-blue-900 px-8 py-6">
            <h1 className="text-3xl font-extrabold text-white">Update Spare Part Details</h1>
            <p className="text-blue-200 mt-2 text-sm">Make changes and save the details</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Messages */}
            {message && (
              <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-sm">
                {message}
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-sm">
                {error}
              </div>
            )}

            {/* Form Fields */}
            {[
              { label: "Barcode", name: "barcode", type: "text" },
              { label: "Name", name: "name", type: "text" },
              { label: "Brand", name: "brand", type: "text" },
              { label: "Rack", name: "rack", type: "text" },
              { label: "Quantity", name: "Quentity", type: "number" },
              { label: "Price (Rs.)", name: "price", type: "number" },
            ].map((field) => (
              <div key={field.name} className="relative">
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  className="peer w-full px-4 pt-6 pb-2 border border-gray-300 rounded-xl bg-gray-50 text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition"
                  placeholder={field.label}
                  required
                />
                <label
                  className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600"
                >
                  {field.label}
                </label>
              </div>
            ))}

            {/* Buttons */}
            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate("/SparePartsDisplay")}
                className="px-6 py-2 rounded-xl border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 shadow-sm transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 rounded-xl bg-blue-700 text-white font-semibold hover:bg-blue-800 shadow-md transition disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SparePartsUpdate;
