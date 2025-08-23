import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function NewBikesForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: "",
    model: "",
    color: "",
    price: "",
    status: "Available",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") setFormData({ ...formData, image: files[0] });
    else setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("type", formData.type);
      data.append("model", formData.model);
      data.append("color", formData.color);
      data.append("price", formData.price);
      data.append("status", formData.status);
      if (formData.image) data.append("image", formData.image);

      const res = await axios.post("http://localhost:5000/newBs", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Response:", res.data);
      alert("Bike added successfully!");
      setFormData({ type: "", model: "", color: "", price: "", status: "Available", image: null });
      navigate("/all-bikes");
    } catch (err) {
      console.error(err.response ? err.response.data : err);
      alert("Failed to add bike");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-lg">
        <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">Add New Bike</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {["type", "model", "color", "price"].map((field) => (
            <div key={field}>
              <label className="block text-gray-700 font-medium mb-2 capitalize">{field}</label>
              <input
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                placeholder={`Enter ${field}`}
              />
            </div>
          ))}

          <div>
            <label className="block text-gray-700 font-medium mb-2 capitalize">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            >
              <option value="Available">Available</option>
              <option value="Sold">Sold</option>
              <option value="Reserved">Reserved</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2 capitalize">Bike Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-800 text-white py-3 rounded-2xl font-semibold hover:bg-blue-700 transition"
          >
            Add Bike
          </button>
        </form>
      </div>
    </div>
  );
}

export default NewBikesForm;
