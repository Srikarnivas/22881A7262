# 🔗 Node.js URL Shortener API

A simple URL shortener backend built with **Node.js** and **Express**, allowing users to generate shortened URLs with optional custom codes and expiration times. Includes statistics tracking for each short URL.

---

## 🚀 Features

- ✅ Shorten any valid URL
- ⏱️ Optional expiration time (default: 30 minutes)
- ✏️ Optional custom short code
- 📊 Statistics endpoint (click count, creation time, expiry)
- ⚠️ Expired URLs return error
- 🧠 In-memory storage (easy to replace with database)

---

## 📦 Installation

```bash
git clone https://github.com/your-username/url-shortener-node.git
cd url-shortener-node
npm install
node index.js

```

🧪 API Endpoints
➕ POST /shorten
Create a new shortened URL.

🔸 Request Body (JSON):
json
```bash
{
  "url": "https://example.com",    // Required
  "code": "custom123",             // Optional
  "time": 10                       // Optional, in minutes (default: 30)
}
```
🔸 Response:
json
```bash
{
  "short_url": "http://localhost:5000/r/custom123",
  "code": "custom123",
  "expires_at": "2025-07-28T12:05:00.000Z"
}
```
🔗 GET /r/:code
Redirects to the original URL using the short code.

Example:
```bash
GET http://localhost:5000/r/custom123
```
Redirects if valid

Returns 410 Gone if expired

Returns 404 Not Found if invalid

📊 GET /stats/:code
Retrieve stats for a short URL.

Response:
json
```bash
{
  "original_url": "https://example.com",
  "code": "custom123",
  "created_at": "2025-07-28T11:59:20.000Z",
  "expires_at": "2025-07-28T12:05:20.000Z",
  "clicks": 2
}
```
🧰 Tech Stack
Node.js

Express

uuid (for unique IDs)

In-memory object for storage (you can plug in Redis, MongoDB, etc.)

🧪 Testing with Postman
1. POST /shorten
Body → Raw → JSON:
```bash
{
  "url": "https://example.com",
  "time": 10,
  "code": "mycustomcode"
}
```
2. GET /r/mycustomcode
Redirects to https://example.com

3. GET /stats/mycustomcode
Returns usage stats and expiry info
