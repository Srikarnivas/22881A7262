// logger.js
const axios = require('axios');
const { getAccessToken } = require('./auth');

const LOG_API_URL = "http://20.244.56.144/evaluation-service/logs";

async function logEvent(stack, level, pkg, message) {
  const validStacks = ["backend"];
  const validLevels = ["debug", "info", "warn", "error", "fatal"];
  const validPackages = [
    "cache", "controller", "cron_job", "db", "domain", "handler", "repository", "route", "service",
    "auth", "config", "middleware", "utils"
  ];

  if (!validStacks.includes(stack) || !validLevels.includes(level) || !validPackages.includes(pkg)) {
    console.error("❌ Invalid log inputs");
    return;
  }

  const token = await getAccessToken();
  if (!token) {
    console.error("❌ No token available, skipping log.");
    return;
  }

  try {
    const res = await axios.post(
      LOG_API_URL,
      { stack, level, package: pkg, message },
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );
    console.log("✅ Log sent:", res.data.message);
  } catch (err) {
    console.error("❌ Failed to log:", err.response?.data || err.message);
  }
}

module.exports = { logEvent };
