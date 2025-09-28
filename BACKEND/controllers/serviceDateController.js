const ServiceDate = require('../Model/ServiceDate');
const twilio = require('twilio');

// Initialize Twilio client with error handling
let twilioClient;
try {
  // Check if Twilio credentials are set
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
    console.error('⚠️ Missing Twilio credentials. Please check your .env file.');
    console.error('Required: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER');
  } else {
    twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    console.log('✅ Twilio client initialized successfully');
  }
} catch (err) {
  console.error('❌ Failed to initialize Twilio client:', err.message);
}

// Generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.initiateBooking = async (req, res) => {
  try {
    // Check if Twilio client was initialized successfully
    if (!twilioClient) {
      console.error('Twilio client not initialized. Check your credentials.');
      return res.status(500).json({ 
        error: 'SMS service not configured properly. Please contact support.',
        details: 'Twilio client initialization failed'
      });
    }
    
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }
    
    console.log(`Processing booking for phone: ${phoneNumber}`);
    
    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 10); // OTP valid for 10 minutes
    
    // Log the data being saved
    console.log('Creating booking with data:', { 
      ...req.body,
      otp,
      otpExpiry: otpExpiry.toISOString(),
      isVerified: false
    });
    
    // Save booking data with OTP (not verified yet)
    const newBooking = new ServiceDate({
      ...req.body,
      otp,
      otpExpiry,
      isVerified: false
    });
    
    await newBooking.save();
    console.log(`Booking saved with ID: ${newBooking._id}`);
    
    // Format the phone number for international dialing
    const formattedPhone = phoneNumber.startsWith('+') 
      ? phoneNumber 
      : `+94${phoneNumber.replace(/^0+/, '')}`;
    
    console.log(`Sending OTP to formatted number: ${formattedPhone}`);
    console.log(`⭐⭐⭐ OTP is: ${otp} ⭐⭐⭐`);
    
    // Send OTP via SMS
    try {
      // Debug the environment variable value
      console.log(`USE_REAL_SMS environment variable: "${process.env.USE_REAL_SMS}"`);
      console.log(`Type: ${typeof process.env.USE_REAL_SMS}`);
      
      // Check if we should attempt to use Twilio based on environment variable
      const useRealSMS = process.env.USE_REAL_SMS === 'true';
      console.log(`Will use real SMS? ${useRealSMS}`);
      
      if (useRealSMS) {
        // Try to send real SMS via Twilio
        console.log('Attempting to send real SMS via Twilio...');
        await twilioClient.messages.create({
          body: `Your OTP for Rathnasiri Motors service booking is: ${otp}. Valid for 10 minutes.`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: formattedPhone
        });
        console.log('OTP sent successfully via Twilio');
      } else {
        // Skip Twilio in development mode, just log the OTP
        console.log('⚠️ Skipping actual SMS sending (development mode)');
        console.log(`📱 SMS would be sent to: ${formattedPhone}`);
        console.log(`📝 SMS content: Your OTP for Rathnasiri Motors service booking is: ${otp}. Valid for 10 minutes.`);
      }
      
      // In either case, return success to allow testing the flow
      res.status(200).json({ 
        message: useRealSMS ? 'OTP sent successfully' : 'OTP generated (check server logs for code)',
        bookingId: newBooking._id,
        devMode: !useRealSMS
      });
    } catch (twilioErr) {
      console.error('Twilio error:', twilioErr);
      console.error('Error details:', JSON.stringify(twilioErr, null, 2));
      // If SMS fails, still return booking ID but with error message
      res.status(200).json({ 
        message: 'Booking initiated but SMS failed. Check server logs for OTP code.',
        bookingId: newBooking._id,
        smsError: true
      });
    }
  } catch (err) {
    console.error('Error initiating booking:', err);
    // Provide more detailed error information
    let errorMessage = 'Failed to initiate booking';
    if (err.name === 'ValidationError') {
      errorMessage = 'Invalid booking data: ' + Object.values(err.errors).map(e => e.message).join(', ');
    } else if (err.name === 'MongoServerError' && err.code === 11000) {
      errorMessage = 'Duplicate booking detected';
    }
    
    res.status(500).json({ error: errorMessage });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { bookingId, otp } = req.body;
    
    const booking = await ServiceDate.findById(bookingId);
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    if (booking.isVerified) {
      return res.status(400).json({ error: 'Booking is already verified' });
    }
    
    if (new Date() > booking.otpExpiry) {
      return res.status(400).json({ error: 'OTP has expired', expired: true });
    }
    
    if (booking.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }
    
    // OTP is valid, mark booking as verified
    booking.isVerified = true;
    await booking.save();
    
    res.status(200).json({ message: 'OTP verified successfully. Booking confirmed.' });
  } catch (err) {
    console.error('Error verifying OTP:', err);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
};

exports.resendOTP = async (req, res) => {
  try {
    const { bookingId } = req.body;
    
    const booking = await ServiceDate.findById(bookingId);
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    if (booking.isVerified) {
      return res.status(400).json({ error: 'Booking is already verified' });
    }
    
    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);
    
    booking.otp = otp;
    booking.otpExpiry = otpExpiry;
    await booking.save();
    
    // Send OTP via SMS
    try {
      await twilioClient.messages.create({
        body: `Your new OTP for Rathnasiri Motors service booking is: ${otp}. Valid for 10 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: `+94${booking.phoneNumber.replace(/^0+/, '')}`
      });
      
      res.status(200).json({ message: 'New OTP sent successfully' });
    } catch (twilioErr) {
      console.error('Twilio error:', twilioErr);
      res.status(200).json({ 
        message: 'New OTP generated but SMS failed. Contact support if needed.',
        smsError: true
      });
    }
  } catch (err) {
    console.error('Error resending OTP:', err);
    res.status(500).json({ error: 'Failed to resend OTP' });
  }
};

exports.createServiceDate = async (req, res) => {
  try {
    const newService = new ServiceDate(req.body);
    await newService.save();
    res.status(201).json({ message: 'Service date booked successfully' });
  } catch (err) {
    console.error('Error creating service date:', err);
    res.status(500).json({ error: 'Failed to book service date' });
  }
};

exports.getAllServiceDates = async (req, res) => {
  try {
    const serviceDates = await ServiceDate.find({ isVerified: true });
    res.status(200).json(serviceDates);
  } catch (err) {
    console.error('Error fetching service dates:', err);
    res.status(500).json({ error: 'Failed to fetch service dates' });
  }
};
