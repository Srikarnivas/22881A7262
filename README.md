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
