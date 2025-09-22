import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";


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
   <div className="min-h-screen bg-white flex items-center justify-center p-6">
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

      <Card className="p-8 w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4 border border-blue-100">
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
          <h2 className="text-3xl font-bold text-blue-900 mb-2">
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
            <Input label="Barcode" type="text" name="barcode" value={formData.barcode} onChange={handleChange} required placeholder="e.g., 123456789" />

            {/* Name */}
            <Input label="Name" type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="e.g., name" />

            {/* Brand */}
            <Input label="Brand" type="text" name="brand" value={formData.brand} onChange={handleChange} required placeholder="e.g., Yamaha FZ" />

            {/* Rack */}
            <Input label="Rack" type="text" name="rack" value={formData.rack} onChange={handleChange} required placeholder="e.g., Rack A1" />

            {/* Quantity */}
            <Input label="Quantity" type="number" name="Quentity" value={formData.Quentity} onChange={handleChange} required min="1" placeholder="e.g., 5" />

            {/* Price */}
            <Input label="Price (Rs.)" type="number" name="price" value={formData.price} onChange={handleChange} required min="0" placeholder="250000" />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button type="submit" disabled={isSubmitting} className="w-full py-3 text-base">
              {isSubmitting ? "Adding Item..." : "Add Item to Inventory"}
            </Button>
          </div>

          {/* Back Button */}
          <div className="text-center">
            <Button type="button" variant="outline" onClick={() => navigate("/inventory")}>
              ← Back to Inventory
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default SparePartsForm;
