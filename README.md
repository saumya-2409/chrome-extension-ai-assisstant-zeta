# ⚡ Zeta: AI Assistant Chrome Extension

> 🚀 Instantly get AI-powered answers by selecting text on any web page — lightweight, fast, and secure.
> 
---

## ✨ Features

* 🖱️ **Select & Ask**: Highlight any text and send it to your custom backend API
* 🔗 **Popup Access**: Trigger via context menu or `Ctrl+I` / `Cmd+I`
* ⚡ **Fast Responses**: Fetches cached or live AI answers
* 🔄 **UX Touches**: Includes a loader animation and copy-to-clipboard support

---

## 🛠️ Setup Instructions

### 1️⃣ Load Extension in Chrome

1. Clone or download this repository
2. Go to `chrome://extensions/`
3. Enable **Developer Mode**
4. Click **Load Unpacked** and select the project folder

### 2️⃣ Configure Backend

In `background.js` and `flask_app.py`, update:

* 🔗 Your **API endpoint** (`https://your-backend-endpoint.com`)
* 🔐 **Authorization headers/tokens**

> ⚠️ **Do not commit sensitive keys**. Use environment variables or a secure secrets manager.

### 3️⃣ Set Keyboard Shortcut

* Default: `Ctrl+I` / `Cmd+I`
* Change via: `chrome://extensions/shortcuts`

---

## 🧪 Development Overview

| File                      | Role                                                   |
| ------------------------- | ------------------------------------------------------ |
| `background.js`           | Handles context menu, keyboard shortcuts, API requests |
| `popup.html` + `popup.js` | Renders the question/answer UI                         |
| `flask_app.py`            | Simple Flask API proxy to securely handle AI requests  |

---

## 📄 License

Licensed under the [MIT License](./LICENSE) — feel free to use, modify, and share.

---

Built with ❤️ to enhance your **research**, **reading**, and **productivity** — one click at a time.
