
const axios = require('axios');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });

let cachedToken = null;

async function getAccessToken() {
  if (cachedToken) return cachedToken;

  const authUrl = "http://20.244.56.144/evaluation-service/auth";

  const body = {
    email: process.env.EMAIL,
    name: process.env.NAME,
    rollNo: process.env.ROLLNO,
    accessCode: process.env.ACCESS_CODE,
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  };

  try {
    const res = await axios.post(authUrl, body);
    cachedToken = res.data.access_token;
    return cachedToken;
  } catch (err) {
    console.error("❌ Auth Error:", err.response?.data || err.message);
    return null;
  }
}

module.exports = { getAccessToken };
