# Zeta: AI Assistant Chrome Extension

QueryShield is a lightweight Chrome Extension that allows you to select text on any web page and instantly receive AI-powered answers via a secure backend API.

## Features

* Highlight and send selected text to a backend API
* Open popup via context menu or keyboard shortcut
* Displays cached or freshly fetched AI answers
* Includes loader animation and copy-to-clipboard support

## Setup Instructions

### 1. Load the Extension in Chrome

* Clone or download this repository
* Open `chrome://extensions/` in Chrome
* Enable **Developer Mode**
* Click **Load Unpacked** and select the project directory

### 2. Backend Configuration

In `background.js` and `flask_app.py`, replace:

* API URLs (placeholders like `https://your-backend-endpoint.com`)
* Authorization tokens with your actual credentials

**Never commit sensitive keys to version control.** Use environment variables instead.

### 3. Keyboard Shortcut

Default: `Ctrl+I` / `Cmd+I`
Can be changed via `chrome://extensions/shortcuts`

## Development

* `background.js`: Context menu, shortcut commands, and messaging
* `popup.html` + `popup.js`: UI for displaying question & answer
* `flask_app.py`: Flask backend to relay the query to your AI service

## License

This project is licensed under the [MIT License](./LICENSE).

---

Made with ❤️ to enhance your browsing and research workflow.
