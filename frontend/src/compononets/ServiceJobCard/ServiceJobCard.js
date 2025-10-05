import React, { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";
import PageHeader from "../ui/PageHeader";
import { AlertTriangle } from "lucide-react"; // Import for error icon (if lucide is your icon library)

function ServiceJobCard() {
  const history = useNavigate();
  
  const [formData, setFormData] = useState({
    customerName: "",
    phoneNumber: "",
    vehicleNumber: "",
    vehicleType: "",
    vehicleModel: "",
    kilometers: "",
    lastServiceDate: "",
    additionalRequests: "",
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
      console.log("Service Job Added:", formData);
      alert("Service Job added to system!");
      history("/AllServiceJobs");
    } catch (error) {
      console.error("Error submitting form:", error);
      // Error handling is done in sendRequest
    } finally {
      setIsSubmitting(false);
    }
  }

  const sendRequest = async () => {
    try {
      const response = await axios.post("http://localhost:5000/services", {
        Name: String(formData.customerName),
        Phone: String(formData.phoneNumber),
        VehicleNumber: String(formData.vehicleNumber),
        VehicleType: String(formData.vehicleType),
        Model: String(formData.vehicleModel),
        KiloMeters: Number(formData.kilometers),
        LastServiceDate: formData.lastServiceDate, 
        Requests: String(formData.additionalRequests),
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
          'LastServiceDate': 'lastServiceDate',
          'Requests': 'additionalRequests'
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
        setSubmitError("Failed to submit service job. Please try again.");
      }
      throw error; // Re-throw to let the calling function know there was an error
    }
  };


  return (
    <div className="flex-1 bg-white min-h-screen p-10">
      <PageHeader
        title="Add Service Job"
        subtitle="Create a new service job record"
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-7 4h8M7 8h10M5 6h14" />
          </svg>
        }
        actions={
          <Button variant="outline" onClick={() => history('/AllServiceJobs')}>All Service Jobs</Button>
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

          {/* Kilometers & Last Service Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Number of Kilometers" 
              type="number" 
              name="kilometers" 
              value={formData.kilometers} 
              onChange={handleChange} 
              placeholder="Enter kilometers" 
              required 
              error={errors.kilometers}
            />

            <Input 
              label="Last Service Date" 
              type="date" 
              name="lastServiceDate" 
              value={formData.lastServiceDate} 
              onChange={handleChange} 
              required 
              error={errors.lastServiceDate}
            />
          </div>

          {/* Additional Requests */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Requests</label>
            <textarea
              name="additionalRequests"
              value={formData.additionalRequests}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${
                errors.additionalRequests ? 'border-red-500' : 'border-gray-200'
              } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              rows={4}
              placeholder="Enter any additional requests"
            />
            {errors.additionalRequests && (
              <p className="mt-1 text-sm text-red-600">{errors.additionalRequests}</p>
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

export default ServiceJobCard;
