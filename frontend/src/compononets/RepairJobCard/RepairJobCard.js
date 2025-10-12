import React, { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";
import PageHeader from "../ui/PageHeader";

function RepairJobCard() {
  const history = useNavigate();

  const [formData, setFormData] = useState({
    customerName: "",
    phoneNumber: "",
    vehicleNumber: "",
    vehicleType: "",
    vehicleModel: "",
    kilometers: "", // Add kilometers field
    repairDetails: "", // ✅ consistent key
  });
  
  // Add state for handling validation errors
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Client-side validation
    if (name === 'phoneNumber') {
      // Only allow numeric input and limit to 10 digits
      const phoneRegex = /^\d{0,10}$/;
      if (!phoneRegex.test(value)) {
        return; // Don't update if not valid phone input
      }
    }
    
    if (name === 'kilometers') {
      // Only allow non-negative numbers
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
      console.log("Repair Job Added:", formData);
      alert("Repair Job added to system!");
      history("/AllRepairJobs");
    } catch (error) {
      console.error("Error submitting form:", error);
      // Error handling is done in sendRequest
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendRequest = async () => {
    try {
      const response = await axios.post("http://localhost:5000/repairs", {
        Name: String(formData.customerName),
        Phone: String(formData.phoneNumber),
        VehicleNumber: String(formData.vehicleNumber),
        VehicleType: String(formData.vehicleType),
        Model: String(formData.vehicleModel),
        KiloMeters: formData.kilometers ? Number(formData.kilometers) : undefined, // Add kilometers
        Details: String(formData.repairDetails),
        JobCreatedDate: new Date(), // Automatically add current date
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        // Map backend field names to frontend field names
        const fieldMap = {
          'Name': 'customerName',
          'Phone': 'phoneNumber',
          'VehicleNumber': 'vehicleNumber',
          'VehicleType': 'vehicleType',
          'Model': 'vehicleModel',
          'KiloMeters': 'kilometers',
          'Details': 'repairDetails'
        };
        
        // Create a new errors object for frontend fields
        const formattedErrors = {};
        error.response.data.errors.forEach(err => {
          const frontendField = fieldMap[err.param] || err.param;
          formattedErrors[frontendField] = err.msg;
        });
        
        setErrors(formattedErrors);
        setSubmitError("Please correct the errors below");
      } else {
        setSubmitError("Failed to submit repair job. Please try again.");
      }
      throw error; // Re-throw to let the calling function know there was an error
    }
  };

  return (
    <div className="flex-1 bg-white min-h-screen p-10">
      <PageHeader
        title="Add Repair Job"
        subtitle="Create a new repair job record"
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h2l2 5 4-2 4 2 2-5h2M12 14v7m-3 0h6" />
          </svg>
        }
      />

      <Card className="max-w-3xl mx-auto p-8">
        {submitError && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p>{submitError}</p>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Name & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Customer Name" 
              type="text" 
              name="customerName" 
              value={formData.customerName} 
              onChange={handleChange} 
              placeholder="Enter customer name" 
              required 
              error={errors.customerName}
            />

            <Input 
              label="Phone Number" 
              type="tel" 
              name="phoneNumber" 
              value={formData.phoneNumber} 
              onChange={handleChange} 
              placeholder="Enter 10-digit phone number" 
              required 
              error={errors.phoneNumber}
              maxLength={10}
            />
          </div>

          {/* Vehicle Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input 
              label="Vehicle Number" 
              type="text" 
              name="vehicleNumber" 
              value={formData.vehicleNumber} 
              onChange={handleChange} 
              placeholder="Vehicle number" 
              required 
              error={errors.vehicleNumber}
            />

            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Vehicle Type<span className="text-red-500 ml-1">*</span>
              </label>
              <select
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 border ${errors.vehicleType ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              >
                <option value="" disabled>Select vehicle type</option>
                <option value="Bike">Bike</option>
                <option value="Scooter">Scooter</option>
              </select>
              {errors.vehicleType && (
                <p className="mt-1 text-sm text-red-600">{errors.vehicleType}</p>
              )}
            </div>

            <Input 
              label="Vehicle Model" 
              type="text" 
              name="vehicleModel" 
              value={formData.vehicleModel} 
              onChange={handleChange} 
              placeholder="Vehicle model" 
              required 
              error={errors.vehicleModel}
            />
          </div>

          {/* Kilometers & Repair Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <Input 
                label="Number of Kilometers" 
                type="number" 
                name="kilometers" 
                value={formData.kilometers} 
                onChange={handleChange} 
                placeholder="Enter kilometers (optional)" 
                error={errors.kilometers}
                min="0"
              />
            </div>
            
            <div className="md:col-span-1">
              {/* Just a spacer in grid layout */}
            </div>
          </div>
          
          {/* Repair Details */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Repair Details</label>
            <textarea
              name="repairDetails"
              value={formData.repairDetails}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${errors.repairDetails ? 'border-red-500 bg-red-50' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              rows={4}
              placeholder="Enter repair details"
              required
            />
            {errors.repairDetails && (
              <p className="mt-1 text-sm text-red-600">{errors.repairDetails}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <Button 
              type="submit" 
              className="px-6 py-3 rounded-xl"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Add to System'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default RepairJobCard;
//Nisal