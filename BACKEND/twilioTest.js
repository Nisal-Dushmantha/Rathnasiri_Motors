const dotenv = require('dotenv');
const twilio = require('twilio');
dotenv.config();

// Function to test Twilio credentials
async function testTwilioSetup() {
    console.log('\n🔍 TWILIO DIAGNOSTIC TOOL 🔍\n');
    
    // Check for environment variables
    console.log('📋 Checking environment variables:');
    
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const phoneNumber = process.env.TWILIO_PHONE_NUMBER;
    
    // Check Account SID
    if (!accountSid) {
        console.error('❌ TWILIO_ACCOUNT_SID is missing in your .env file');
    } else if (!accountSid.startsWith('AC')) {
        console.error('❌ TWILIO_ACCOUNT_SID appears to be invalid (should start with "AC")');
    } else {
        console.log('✅ TWILIO_ACCOUNT_SID is set');
    }
    
    // Check Auth Token
    if (!authToken) {
        console.error('❌ TWILIO_AUTH_TOKEN is missing in your .env file');
    } else if (authToken === 'your_auth_token') {
        console.error('❌ TWILIO_AUTH_TOKEN appears to be the default placeholder value');
    } else {
        console.log('✅ TWILIO_AUTH_TOKEN is set');
    }
    
    // Check Phone Number
    if (!phoneNumber) {
        console.error('❌ TWILIO_PHONE_NUMBER is missing in your .env file');
    } else if (!phoneNumber.startsWith('+')) {
        console.error('❌ TWILIO_PHONE_NUMBER should start with "+" followed by country code');
    } else {
        console.log('✅ TWILIO_PHONE_NUMBER is set');
    }
    
    // If any credentials are missing, exit early
    if (!accountSid || !authToken || !phoneNumber) {
        console.log('\n⚠️ Please update your .env file with the correct Twilio credentials.');
        return;
    }
    
    // Try to initialize the Twilio client
    console.log('\n📱 Trying to initialize Twilio client...');
    
    try {
        const client = twilio(accountSid, authToken);
        
        // Try to fetch account info to verify credentials
        console.log('🔄 Verifying credentials by retrieving account info...');
        const account = await client.api.accounts(accountSid).fetch();
        console.log(`✅ Successfully connected to Twilio account: ${account.friendlyName}`);
        console.log('✅ Your Twilio credentials are valid!');
        
        console.log('\n✨ Twilio setup appears to be correct! You should be able to send SMS messages.');
    } catch (error) {
        console.error('❌ Error connecting to Twilio:');
        console.error(`   ${error.message}`);
        console.log('\n⚠️ Your Twilio credentials appear to be invalid or there may be network issues.');
        console.log('   Please check your Twilio dashboard to verify your credentials.');
    }
}

// Run the test
testTwilioSetup();
