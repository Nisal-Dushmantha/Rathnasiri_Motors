import React, { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";
import PageHeader from "../ui/PageHeader";
import { AlertTriangle } from "lucide-react";

function SparePartsForm() {
  const history = useNavigate();
  
  const [formData, setFormData] = useState({
    barcode: "",
    name: "",
    brand: "",
    rack: "",
    quantity: "",
    price: "",
    description: "" // Optional field for description
  });
  
  // Add state for handling validation errors
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Client-side validation
    if (name === 'quantity' || name === 'price') {
      // Only allow positive numbers
      if (value && parseFloat(value) < 0) {
        return; // Don't update if negative
      }
    }
    
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing again
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Reset errors
    setErrors({});
    setSubmitError("");
    setIsSubmitting(true);
    
    try {
      await sendRequest();
      console.log("Spare Part Added:", formData);
      alert("Spare Part added to system!");
      history("/SparePartsDisplay");
    } catch (error) {
      console.error("Error submitting form:", error);
      // Error handling is done in sendRequest
    } finally {
      setIsSubmitting(false);
    }
  }

  const sendRequest = async () => {
    try {
      const response = await axios.post("http://localhost:5000/sp", {
        barcode: String(formData.barcode),
        name: String(formData.name),
        brand: String(formData.brand),
        rack: String(formData.rack),
        Quentity: Number(formData.quantity),
        price: String(formData.price),
        description: formData.description ? String(formData.description) : undefined
      });
      return response.data;
    } catch (error) {
      // Handle errors from backend
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.message || "Failed to add spare part";
        setSubmitError(errorMessage);
      } else {
        setSubmitError("Failed to submit spare part. Please try again.");
      }
      throw error; // Re-throw to let the calling function know there was an error
    }
  };

  return (
    <div className="flex-1 bg-white min-h-screen p-10">
      <PageHeader
        title="Add Spare Part"
        subtitle="Create a new spare part record"
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        }
        actions={
          <Button variant="outline" onClick={() => history('/SparePartsDisplay')}>All Spare Parts</Button>
        }
      />

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
              label="Part Name" 
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
            <Input 
              label="Brand" 
              type="text" 
              name="brand" 
              value={formData.brand} 
              onChange={handleChange} 
              placeholder="Enter brand name" 
              required 
              error={errors.brand}
            />

            <Input 
              label="Rack Location" 
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
              name="quantity" 
              value={formData.quantity} 
              onChange={handleChange} 
              placeholder="Enter quantity" 
              required 
              error={errors.quantity}
              min="0"
            />

            <Input 
              label="Price (Rs.)" 
              type="text" 
              name="price" 
              value={formData.price} 
              onChange={handleChange} 
              placeholder="Enter price" 
              required 
              error={errors.price}
            />
          </div>

          {/* Description (Optional) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description (Optional)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${
                errors.description ? 'border-red-500' : 'border-gray-200'
              } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              rows={4}
              placeholder="Enter part description, specifications, etc."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
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
