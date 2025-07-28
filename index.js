const express = require('express');
const bodyparser = require('body-parser');


const app = express();
app.use(bodyparser.json());

const PORT = 5000;
const db = {};

function generateCode(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}


app.post('/shorten', (req, res) => {
  const { url, code, time } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  let shortCode = code || generateCode();
  const expiryTime = new Date(Date.now() + (time || 30) * 60 * 1000);

  if (db[shortCode] && !code) {
    shortCode = generateCode();
  }

  db[shortCode] = {
    originalUrl: url,
    createdAt: new Date(),
    expiryTime,
    clicks: 0
  };
  const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
  const shortUrl = `${baseUrl}/r/${shortCode}`;

  res.status(200).json({
    short_url: shortUrl,
    code: shortCode,
    expires_at: expiryTime.toISOString()
  });
});

app.get('/r/:code', (req, res) => {
  const { code } = req.params;
  const data = db[code];

  if (!data) {
    return res.status(404).json({ error: 'Short URL not found' });
  }

  if (new Date() > data.expiryTime) {
    delete urldb[code];
    return res.status(410).json({ error: 'Short URL has expired' });
  }

  data.clicks += 1;
  res.redirect(data.originalUrl);
});


app.get('/stats/:code', (req, res) => {
  const { code } = req.params;
  const data = urldb[code];

  if (!data) {
    return res.status(404).json({ error: 'Short URL not found' });
  }

  res.json({
    original_url: data.originalUrl,
    code,
    created_at: data.createdAt.toISOString(),
    expires_at: data.expiryTime.toISOString(),
    clicks: data.clicks
  });
});

app.listen(PORT, () => {
  console.log(`URL Shortener running at http://localhost:${PORT}`);
});
