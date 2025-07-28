const express = require('express');
const bodyParser = require('body-parser');
const { logEvent } = require('../Logging Middleware/logger');

logEvent("backend", "info", "service", "🚀 Logger is initialized and working.");

const app = express();
app.use(bodyParser.json());

const PORT = 5000;
const memoryStore = {};


function createShortCode(length = 6) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
}


app.post('/shorten', async (req, res) => {
  const { url, code, time } = req.body;

  if (!url) {
    await logEvent('backend', 'error', 'handler', 'No URL provided in request body');
    return res.status(400).json({ error: 'URL is required' });
  }

  let shortCode = code || createShortCode();
  const expiry = new Date(Date.now() + (time || 30) * 60000);

  if (!code && memoryStore[shortCode]) {
    shortCode = createShortCode();
  }

  memoryStore[shortCode] = {
    originalUrl: url,
    createdAt: new Date(),
    expiresAt: expiry,
    clicks: 0
  };

  const hostUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
  const shortUrl = `${hostUrl}/r/${shortCode}`;

  await logEvent('backend', 'info', 'service', `Short URL created: ${shortCode}`);

  res.status(200).json({
    short_url: shortUrl,
    code: shortCode,
    expires_at: expiry.toISOString()
  });
});


app.get('/r/:code', async (req, res) => {
  const { code } = req.params;
  const data = memoryStore[code];

  if (!data) {
    await logEvent('backend', 'warn', 'route', `Redirection failed: ${code} not found`);
    return res.status(404).json({ error: 'Short URL not found' });
  }

  if (new Date() > data.expiresAt) {
    await logEvent('backend', 'warn', 'route', `Expired URL accessed: ${code}`);
    delete memoryStore[code];
    return res.status(410).json({ error: 'Short URL has expired' });
  }

  data.clicks++;
  res.redirect(data.originalUrl);
});


app.get('/stats/:code', async (req, res) => {
  const { code } = req.params;
  const data = memoryStore[code];

  if (!data) {
    await logEvent('backend', 'warn', 'handler', `Stats retrieval failed: ${code} not found`);
    return res.status(404).json({ error: 'Short URL not found' });
  }

  await logEvent('backend', 'info', 'handler', `Stats accessed for: ${code}`);

  res.json({
    original_url: data.originalUrl,
    code,
    created_at: data.createdAt.toISOString(),
    expires_at: data.expiresAt.toISOString(),
    clicks: data.clicks
  });
});

app.listen(PORT, () => {
  console.log(`🔗 URL Shortener running at http://localhost:${PORT}`);
});
