import React, { useState } from 'react';
import axios from 'axios';
import CustomerNavBar from '../CustomerNavBar/CustomerNavBar';
import CustomerFooter from '../CustomerFooter/CustomerFooter';

function CustomerServiceDates() {
  const [step, setStep] = useState('form'); // 'form', 'otp', 'success'
  const [bookingId, setBookingId] = useState(null);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    vehicleType: '',
    vehicleModel: '',
    plateNumber: '',
    phoneNumber: '',
    serviceDate: '',
    serviceTime: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleOtpChange = (e) => {
    // Only allow numbers and limit to 6 digits
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
    setOtpError('');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Step 1: Initiate booking and send OTP
      const response = await axios.post(
        'http://localhost:5000/api/serviceDates/initiate', 
        formData
      );
      
      setBookingId(response.data.bookingId);
      setStep('otp');
      
      if (response.data.devMode) {
        setOtpError('Development mode: Check server console logs for the OTP code.');
      } else if (response.data.smsError) {
        setOtpError('SMS delivery failed. Please check server logs for OTP code or contact support.');
      }
    } catch (err) {
      console.error('Error initiating booking:', err);
      let errorMessage = 'Failed to initiate booking. Please try again.';
      
      // Provide more specific error messages based on the error
      if (err.response) {
        // The request was made and the server responded with an error status
        console.error('Server error response:', err.response.data);
        if (err.response.data && err.response.data.error) {
          errorMessage = `Error: ${err.response.data.error}`;
        }
      } else if (err.request) {
        // The request was made but no response was received
        console.error('No response received:', err.request);
        errorMessage = 'No response from server. Please check if the server is running.';
      } else {
        // Something happened in setting up the request
        console.error('Request setup error:', err.message);
        errorMessage = `Error: ${err.message}`;
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  const verifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setOtpError('Please enter a valid 6-digit OTP');
      return;
    }
    
    setLoading(true);
    
    try {
      await axios.post('http://localhost:5000/api/serviceDates/verify', {
        bookingId,
        otp
      });
      
      // OTP verified successfully
      setStep('success');
    } catch (err) {
      console.error('OTP verification failed:', err);
      if (err.response && err.response.data) {
        if (err.response.data.expired) {
          setOtpError('OTP has expired. Please request a new one.');
        } else {
          setOtpError(err.response.data.error || 'Invalid OTP. Please try again.');
        }
      } else {
        setOtpError('Verification failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const resendOtp = async () => {
    setLoading(true);
    setOtpError('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/serviceDates/resend', {
        bookingId
      });
      
      alert('New OTP has been sent to your phone.');
      
      if (response.data.smsError) {
        setOtpError('SMS delivery failed. Please contact support if you do not receive the OTP.');
      }
    } catch (err) {
      console.error('Failed to resend OTP:', err);
      setOtpError('Failed to send new OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const resetForm = () => {
    setStep('form');
    setBookingId(null);
    setOtp('');
    setOtpError('');
    setFormData({
      name: '',
      vehicleType: '',
      vehicleModel: '',
      plateNumber: '',
      phoneNumber: '',
      serviceDate: '',
      serviceTime: '',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-50 flex flex-col">
      <CustomerNavBar />
      <main className="flex-grow flex items-center justify-center p-6">
        {step === 'form' && (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-xl space-y-6"
          >
            <h2 className="text-3xl font-bold text-blue-900 text-center">Book a Service Date</h2>

            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-xl"
            />

            <input
              type="text"
              name="vehicleType"
              placeholder="Vehicle Type"
              value={formData.vehicleType}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-xl"
            />

            <input
              type="text"
              name="vehicleModel"
              placeholder="Vehicle Model"
              value={formData.vehicleModel}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-xl"
            />

            <input
              type="text"
              name="plateNumber"
              placeholder="Plate Number"
              value={formData.plateNumber}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-xl"
            />

            <div className="relative">
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number (e.g., 0771234567)"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-xl"
              />
              <p className="text-xs text-gray-500 mt-1">
                We'll send a verification code to this number
              </p>
            </div>

            <input
              type="date"
              name="serviceDate"
              value={formData.serviceDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-xl"
            />

            <input
              type="time"
              name="serviceTime"
              value={formData.serviceTime}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-xl"
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-800 text-white py-3 rounded-xl hover:bg-blue-700 transition font-semibold ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Processing...' : 'Book Appointment'}
            </button>
          </form>
        )}

        {step === 'otp' && (
          <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-xl space-y-6 text-center">
            <h2 className="text-3xl font-bold text-blue-900">Verify Your Booking</h2>
            <p className="text-gray-600">
              We've sent a 6-digit verification code to your phone number.
            </p>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                Enter Verification Code
              </label>
              <input
                type="text"
                value={otp}
                onChange={handleOtpChange}
                placeholder="6-digit code"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-center text-2xl tracking-widest"
                maxLength={6}
              />
              {otpError && (
                <p className="text-red-500 text-sm mt-2 text-left">{otpError}</p>
              )}
            </div>

            <div className="flex flex-col space-y-3">
              <button
                onClick={verifyOtp}
                disabled={loading || otp.length !== 6}
                className={`bg-blue-800 text-white py-3 rounded-xl hover:bg-blue-700 transition font-semibold ${
                  loading || otp.length !== 6 ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Verifying...' : 'Verify & Confirm Booking'}
              </button>
              
              <button
                onClick={resendOtp}
                disabled={loading}
                className="text-blue-600 underline py-2 hover:text-blue-800"
              >
                {loading ? 'Processing...' : "Didn't receive the code? Send again"}
              </button>
              
              <button
                onClick={() => setStep('form')}
                className="text-gray-500 text-sm py-2"
              >
                Back to form
              </button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-xl space-y-6 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-3xl font-bold text-blue-900">Booking Confirmed!</h2>
            
            <p className="text-gray-600">
              Your service appointment has been successfully booked and confirmed.
            </p>
            
            <div className="bg-blue-50 p-4 rounded-xl mt-4">
              <p className="text-sm text-blue-800">
                <strong>Date:</strong> {new Date(formData.serviceDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-blue-800">
                <strong>Time:</strong> {formData.serviceTime}
              </p>
            </div>
            
            <p className="text-gray-500 text-sm">
              We'll send you a reminder closer to your appointment date.
            </p>
            
            <button
              onClick={resetForm}
              className="bg-blue-800 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition font-semibold"
            >
              Book Another Appointment
            </button>
          </div>
        )}
      </main>
      <CustomerFooter />
    </div>
  );
}

export default CustomerServiceDates;
