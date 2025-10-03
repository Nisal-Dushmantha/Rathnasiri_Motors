import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";
import PageHeader from "../ui/PageHeader";
import { AlertTriangle } from "lucide-react";

function SparePartsForm() {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [formData, setFormData] = useState({
    barcode: "",
    name: "",
    brand: "",
    rack: "",
    Quentity: "",
    price: "",
    description: ""
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch all brands for dropdown
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await axios.get("http://localhost:5000/sp");
        const uniqueBrands = [
          ...new Set(res.data.sp.map((part) => part.brand)),
        ].sort();
        setBrands(uniqueBrands);
      } catch (err) {
        console.error("Error fetching brands:", err);
      }
    };
    fetchBrands();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if ((name === "Quentity" || name === "price") && value && parseFloat(value) < 0) {
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Frontend validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.barcode.trim()) newErrors.barcode = "Barcode is required";
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.brand) newErrors.brand = "Brand must be selected";
    if (!formData.rack.trim()) newErrors.rack = "Rack is required";
    if (!formData.Quentity) {
      newErrors.Quentity = "Quantity is required";
    } else if (formData.Quentity <= 0) {
      newErrors.Quentity = "Quantity must be greater than 0";
    }
    if (!formData.price) {
      newErrors.price = "Price is required";
    } else if (formData.price < 0) {
      newErrors.price = "Price cannot be negative";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSubmitError("");
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      await axios.post("http://localhost:5000/sp", {
        barcode: String(formData.barcode),
        name: String(formData.name),
        brand: String(formData.brand),
        rack: String(formData.rack),
        Quentity: Number(formData.Quentity),
        price: String(formData.price),
        description: formData.description ? String(formData.description) : undefined,
      }, {
        headers: { "Content-Type": "application/json" },
        timeout: 30000,
      });
      setShowSuccess(true);
      setTimeout(() => {
        setFormData({
          barcode: "",
          name: "",
          brand: "",
          rack: "",
          Quentity: "",
          price: "",
          description: "",
        });
        setShowSuccess(false);
        navigate("/SparePartsDisplay");
      }, 1500);
    } catch (err) {
      console.error("Error details:", err);
      setSubmitError(
        err.response?.data?.message || "Failed to add item. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 bg-white min-h-screen p-10">
      <PageHeader
        title="Add New Spare Part"
        subtitle="Enter the detsils of the spare part to add it to the inventory."
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        }
        actions={
          <Button variant="outline" onClick={() => navigate('/SparePartsDisplay')}>All Spare Parts</Button>
        }
      />

      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center space-x-2">
          ✅ <span>Item added successfully!</span>
        </div>
      )}

      <Card className="max-w-3xl mx-auto p-8">
        {submitError && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <p>{submitError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Barcode & Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Barcode"
              type="text"
              name="barcode"
              value={formData.barcode}
              onChange={handleChange}
              placeholder="Enter barcode"
              required
              error={errors.barcode}
            />

            <Input
              label="Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter part name"
              required
              error={errors.name}
            />
          </div>

          {/* Brand & Rack */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brand
              </label>
              <div className="relative">
                <select
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 bg-white rounded-xl shadow-sm 
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none
                             text-gray-700 appearance-none pr-[2.5cm]"
                >
                  <option value="" className="text-gray-400">
                    Select Brand
                  </option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand} className="text-gray-700">
                      {brand}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-[0.2cm] flex items-center pr-3">
                  <svg
                    className="h-5 w-5 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 12a1 1 0 01-.707-.293l-3-3a1 1 0 111.414-1.414L10 9.586l2.293-2.293a1 1 0 111.414 1.414l-3 3A1 1 0 0110 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              {errors.brand && (
                <p className="text-red-500 text-sm mt-1">{errors.brand}</p>
              )}
            </div>

            <Input
              label="Rack"
              type="text"
              name="rack"
              value={formData.rack}
              onChange={handleChange}
              placeholder="Enter rack location"
              required
              error={errors.rack}
            />
          </div>

          {/* Quantity & Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Quantity"
              type="number"
              name="Quentity"
              value={formData.Quentity}
              onChange={handleChange}
              placeholder="Enter quantity"
              required
              error={errors.Quentity}
              min="1"
            />

            <Input
              label="Price (Rs.)"
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price"
              required
              error={errors.price}
              min="0"
            />
          </div>
          {/* Submit Button */}
          <div className="text-center">
            <Button
              type="submit"
              className="px-6 py-3 rounded-xl"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Add to System'
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default SparePartsForm;