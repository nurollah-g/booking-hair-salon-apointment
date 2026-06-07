const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendSMS = async (phone, message) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEV SMS] to ${phone}:\n${message}`);
      return true;
    }

    const provider = process.env.SMS_PROVIDER || 'twilio';

    if (provider === 'twilio') {
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken  = process.env.TWILIO_AUTH_TOKEN;
      const fromNumber = process.env.TWILIO_FROM_NUMBER;

      if (!accountSid || !authToken || !fromNumber) {
        console.error('Twilio credentials missing');
        return false;
      }

      const credentials = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
      const body = new URLSearchParams({ To: phone, From: fromNumber, Body: message });

      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
        { method: 'POST', headers: { 'Authorization': `Basic ${credentials}`, 'Content-Type': 'application/x-www-form-urlencoded' }, body }
      );

      if (!response.ok) {
        const err = await response.json();
        console.error('Twilio error:', err);
        return false;
      }
      return true;
    }

    // fallback: KaveNegar (for Iranian numbers)
    if (provider === 'kavenegar') {
      const axios = require('axios');
      const apiKey = process.env.KAVENEGAR_API_KEY;
      const url = `https://api.kavenegar.com/v1/${apiKey}/sms/send.json`;
      await axios.post(url, { receptor: phone, message });
      return true;
    }

    console.error('Unknown SMS provider:', provider);
    return false;

  } catch (error) {
    console.error('SMS error:', error.message);
    return false;
  }
};

const sendOTP = async (phone, code) => {
  const message = `Your DS Barbers verification code: ${code}\nValid for 2 minutes.`;
  return await sendSMS(phone, message);
};

module.exports = { sendOTP, sendSMS, generateOTP };
