// Test script to verify SMS sending
require('dotenv').config();
const twilio = require('twilio');

async function testSendSMS() {
  console.log('\n🧪 TWILIO SMS TEST 🧪\n');
  
  try {
    // Load Twilio credentials
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
    
    console.log('Twilio credentials loaded:');
    console.log('- Account SID:', accountSid ? '✅ Present' : '❌ Missing');
    console.log('- Auth Token:', authToken ? '✅ Present' : '❌ Missing');
    console.log('- Phone Number:', twilioPhoneNumber ? `✅ ${twilioPhoneNumber}` : '❌ Missing');
    
    if (!accountSid || !authToken || !twilioPhoneNumber) {
      console.error('❌ Missing Twilio credentials. Please check your .env file.');
      return;
    }
    
    // Initialize Twilio client
    const twilioClient = twilio(accountSid, authToken);
    console.log('\n🔄 Initializing Twilio client...');
    
    // Test phone number (CHANGE THIS to your verified number)
    // For Twilio trial accounts, this MUST be a verified number
    const testPhoneNumber = '+94777123456'; // 👈 REPLACE THIS with your number
    console.log(`📱 Will attempt to send SMS to: ${testPhoneNumber}`);
    console.log('   ⚠️ For Twilio trial accounts, this must be a verified number!');
    
    // Ask for confirmation
    console.log('\n⚠️ Press Ctrl+C now to cancel if you want to change the test phone number.');
    console.log('   Continuing in 5 seconds...');
    
    // Wait 5 seconds
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Send test message
    console.log('\n📤 Sending test SMS...');
    
    const message = await twilioClient.messages.create({
      body: 'This is a test message from Rathnasiri Motors SMS system. Your test OTP is: 123456',
      from: twilioPhoneNumber,
      to: testPhoneNumber
    });
    
    console.log(`✅ Message sent successfully! SID: ${message.sid}`);
    console.log('   Check your phone for the test message.');
    
  } catch (error) {
    console.error('❌ Error sending SMS:');
    console.error(`   ${error.message}`);
    console.error('\nError details:');
    console.error(error);
    
    if (error.code === 21608) {
      console.log('\n⚠️ TRIAL ACCOUNT RESTRICTION: You can only send to verified numbers!');
      console.log('   Please verify the test phone number in your Twilio console:');
      console.log('   1. Go to https://console.twilio.com/');
      console.log('   2. Navigate to "Phone Numbers" → "Verified Caller IDs"');
      console.log('   3. Click "+" to add a new verified number');
    }
  }
}

// Run the test
testSendSMS();
