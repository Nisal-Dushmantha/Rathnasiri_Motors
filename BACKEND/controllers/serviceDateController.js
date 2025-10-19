const ServiceDate = require('../Model/ServiceDateModel');
const twilio = require('twilio');

// Initialize Twilio client if credentials are available
let twilioClient;
let twilioPhoneNumber;
// Force production mode to ensure SMS is sent
const DEV_MODE = false;

try {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
  
  if (accountSid && authToken) {
    twilioClient = twilio(accountSid, authToken);
    console.log('Twilio client initialized successfully');
  } else if (!DEV_MODE) {
    console.error('Twilio credentials missing in .env file. SMS functionality disabled.');
  }
} catch (error) {
  console.error('Failed to initialize Twilio client:', error.message);
}

// Generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Format phone number to international format
const formatPhoneNumber = (phoneNumber) => {
  // Remove any non-digit characters
  let cleaned = phoneNumber.replace(/\D/g, '');
  
  // For Sri Lankan numbers
  if (cleaned.startsWith('0')) {
    cleaned = '+94' + cleaned.substring(1);
  } else if (!cleaned.startsWith('+')) {
    cleaned = '+' + cleaned;
  }
  
  return cleaned;
};

// Send OTP via SMS
const sendOTP = async (phoneNumber, otp) => {
  // Check if we're in development mode
  if (DEV_MODE) {
    console.log(`⭐⭐⭐ DEVELOPMENT MODE: OTP for ${phoneNumber} is: ${otp} ⭐⭐⭐`);
    return { success: true, devMode: true };
  }
  
  // Check if Twilio is properly configured
  if (!twilioClient || !twilioPhoneNumber) {
    console.error('Twilio not configured. Cannot send SMS.');
    return { success: false, error: 'SMS service not configured' };
  }
  
  try {
    // Format the phone number
    const formattedNumber = formatPhoneNumber(phoneNumber);
    
    // Send the SMS
    await twilioClient.messages.create({
      body: `Your Rathnasiri Motors service booking verification code is: ${otp}. Valid for 10 minutes.`,
      from: twilioPhoneNumber,
      to: formattedNumber
    });
    
    console.log(`OTP sent to ${formattedNumber}`);
    return { success: true };
  } catch (error) {
    console.error('Failed to send OTP via Twilio:', error.message);
    return { success: false, error: error.message };
  }
};

// Generic SMS sender for arbitrary messages
const sendSMS = async (phoneNumber, message) => {
  if (DEV_MODE) {
    console.log(`⭐⭐⭐ DEVELOPMENT MODE SMS to ${phoneNumber}: ${message} ⭐⭐⭐`);
    return { success: true, devMode: true };
  }
  if (!twilioClient || !twilioPhoneNumber) {
    console.error('Twilio not configured. Cannot send SMS.');
    return { success: false, error: 'SMS service not configured' };
  }
  try {
    const formattedNumber = formatPhoneNumber(phoneNumber);
    await twilioClient.messages.create({ body: message, from: twilioPhoneNumber, to: formattedNumber });
    return { success: true };
  } catch (error) {
    console.error('Failed to send SMS via Twilio:', error.message);
    return { success: false, error: error.message };
  }
};

// Create Service Date (Legacy)
const createServiceDate = async (req, res) => {
  try {
    const newServiceDate = new ServiceDate({
      ...req.body,
      otp: '000000', // Placeholder
      otpExpiry: new Date(), // Placeholder
      verified: true // Auto-verified for legacy route
    });
    
    await newServiceDate.save();
    res.status(201).json({ message: 'Service date created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Service Dates
const getAllServiceDates = async (req, res) => {
  try {
    // Only return verified bookings
    const serviceDates = await ServiceDate.find({ verified: true });
    res.status(200).json(serviceDates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Initiate Booking with OTP
const initiateBooking = async (req, res) => {
  try {
    // Generate OTP and set expiry (10 minutes)
    const otp = generateOTP();
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + (process.env.OTP_EXPIRY_MINUTES || 10));
    
    // Create new service date record
    const newServiceDate = new ServiceDate({
      ...req.body,
      otp,
      otpExpiry,
      verified: false
    });
    
    await newServiceDate.save();
    
    // Send OTP
    const smsResult = await sendOTP(req.body.phoneNumber, otp);
    
    // Return response
    res.status(200).json({
      message: 'Booking initiated successfully',
      bookingId: newServiceDate._id,
      devMode: smsResult.devMode || false,
      smsError: !smsResult.success
    });
  } catch (error) {
    console.error('Error in initiateBooking:', error);
    res.status(500).json({ error: error.message });
  }
};

// Verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { bookingId, otp } = req.body;
    
    // Find the booking
    const booking = await ServiceDate.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    // Check if OTP is expired
    if (new Date() > booking.otpExpiry) {
      return res.status(400).json({ expired: true, error: 'OTP has expired' });
    }
    
    // Check if OTP matches
    if (booking.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }
    
    // Mark as verified
    booking.verified = true;
    await booking.save();
    
    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Resend OTP
const resendOTP = async (req, res) => {
  try {
    const { bookingId } = req.body;
    
    // Find the booking
    const booking = await ServiceDate.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + (process.env.OTP_EXPIRY_MINUTES || 10));
    
    // Update booking
    booking.otp = otp;
    booking.otpExpiry = otpExpiry;
    await booking.save();
    
    // Send OTP
    const smsResult = await sendOTP(booking.phoneNumber, otp);
    
    res.status(200).json({ 
      message: 'OTP resent successfully',
      devMode: smsResult.devMode || false,
      smsError: !smsResult.success
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Accept booking (admin action)
const acceptBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await ServiceDate.findById(id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (!booking.verified) {
      return res.status(400).json({ error: 'Booking is not verified yet' });
    }

    booking.accepted = true;
    booking.acceptedAt = new Date();
    await booking.save();

    // Build a friendly date/time/plate message
    let dateDisplay = booking.serviceDate;
    try {
      const d = new Date(booking.serviceDate);
      if (!isNaN(d.getTime())) {
        dateDisplay = d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
      }
    } catch (_) {}
    const timeDisplay = booking.serviceTime || '-';
    const plateDisplay = booking.plateNumber || '-';

    const smsText = `Your service booking for ${dateDisplay} at ${timeDisplay} (Plate: ${plateDisplay}) is accepted.`;
    const smsResult = await sendSMS(booking.phoneNumber, smsText);

    return res.status(200).json({ 
      message: 'Booking accepted successfully',
      smsError: !smsResult.success,
      devMode: smsResult.devMode || false
    });
  } catch (error) {
    console.error('acceptBooking error:', error);
    return res.status(500).json({ error: error.message });
  }
};

// Remove booking (admin action)
const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await ServiceDate.findById(id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    await ServiceDate.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Booking removed successfully' });
  } catch (error) {
    console.error('deleteBooking error:', error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createServiceDate,
  getAllServiceDates,
  initiateBooking,
  verifyOTP,
  resendOTP,
  acceptBooking,
  deleteBooking
};
