import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Card from "../ui/Card";
import Button from "../ui/Button";

function AddLoyalty() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerId: "",
    name: "",
    interaction: "",
    date: "",
    points: 0,
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === "points" ? Number(value) : value }));
  };

  function isFormValid() {
    return Boolean(
      formData.customerId && formData.name && formData.interaction && formData.date !== "" && formData.points >= 0
    );
  }

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      setError("Please fill in all fields before adding.");
      return;
    }
    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        date: formData.date ? new Date(formData.date) : new Date(),
      };
      await axios.post("http://localhost:5000/loyalty", payload);
      setError("");
      navigate("/CustomerLoyalty");
    } catch (err) {
      console.error("Failed to add loyalty record", err);
      setError("Failed to add loyalty record. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 bg-white min-h-screen p-10">
      <h1 className="text-4xl font-bold mb-8 text-blue-900">Add Loyalty Record</h1>
      <Card className="max-w-3xl mx-auto p-8">
        <form className="space-y-6" onSubmit={handleAdd}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer ID</label>
            <input
              name="customerId"
              value={formData.customerId}
              onChange={handleFormChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Interaction</label>
            <input
              name="interaction"
              value={formData.interaction}
              onChange={handleFormChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Interaction Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleFormChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Loyalty Points</label>
            <input
              type="number"
              name="points"
              min="0"
              value={formData.points}
              onChange={handleFormChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {error && <p className="text-red-600">{error}</p>}

          <div className="text-center">
            <Button type="submit" disabled={submitting} className="px-6 py-3 rounded-xl">
              {submitting ? "Saving..." : "Add Record"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default AddLoyalty;
