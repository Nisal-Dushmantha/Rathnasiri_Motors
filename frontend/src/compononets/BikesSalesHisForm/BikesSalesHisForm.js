import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Card from "../ui/Card";
import Button from "../ui/Button";
import PageHeader from "../ui/PageHeader";

function BikesSalesHisForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    type: "",
    model: "",
    last_price: "",
    buyer_name: "",
    contact_no: "",
    date: ""
  });

  // Autofill form if bike data is passed via navigation state
  useEffect(() => {
    if (location.state && location.state.bike) {
      const bike = location.state.bike;
      // Get current date in yyyy-mm-dd format
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      const currentDate = `${yyyy}-${mm}-${dd}`;
      // Determine type: if bike.type is 'Scooter' or 'Motor Bike', treat as New, else Used
      let typeValue = '';
      if (bike.type === 'Scooter' || bike.type === 'Motor Bike') {
        typeValue = 'New';
      } else {
        typeValue = 'Used';
      }
      setFormData((prev) => ({
        ...prev,
        type: typeValue,
        model: bike.model || '',
        last_price: bike.price ? String(bike.price) : '',
        date: currentDate,
      }));
    }
  }, [location.state]);
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
        date: formData.date ? formData.date : undefined
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
          date: ""
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
          <span>Bike added successfully!</span>
        </div>
      )}

      <PageHeader
        title="Add Sold Bike to Sales History"
        subtitle="Enter the Sold Bike Details"
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        }
        actions={
          <Button variant="outline" onClick={() => navigate('/BikesSalesHistory')}>All Sales History</Button>
        }
      />

      <Card className="max-w-3xl mx-auto p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Date of Sale</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Bike Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Type</option>
                <option value="New">New</option>
                <option value="Used">Used</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Model</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                readOnly
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Last Price (Rs.)</label>
              <input
                type="number"
                name="last_price"
                value={formData.last_price}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                placeholder = "Rs.250000"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Buyer Name</label>
              <input
                type="text"
                name="buyer_name"
                value={formData.buyer_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder = "Name"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Contact Number</label>
              <input
                type="text"
                name="contact_no"
                value={formData.contact_no}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder= "07########"
              />
            </div>
          </div>

          <div className="pt-4">
            <Button type="submit" disabled={isSubmitting} className="w-full py-3 text-base">
              {isSubmitting ? "Adding Bike..." : "Add Bike to Sales History"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default BikesSalesHisForm;
