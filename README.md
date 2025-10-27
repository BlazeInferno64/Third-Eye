# 👁️ Third-Eye: Domain Tracker Chrome Extension

Third-Eye is a lightweight, privacy-focused Chrome extension designed to monitor and display all network connections (URLs) made by the active web page in real-time. It acts as a simplified network tab, giving you instant insight into which external resources and domains a website is communicating with.
|----|

## ✨ Features

* **Real-time Tracking:** Continuously monitors and updates the list of connected domains every second.
* **Hostname Display:** Shows the hostname of the active tab (e.g., `www.google.com`).
* **Connection Count:** Displays the total number of unique domains connected to the page.
* **Full URL List:** Lists every URL fetched by the active tab.
* **Active Tab Reload:** Includes a refresh button to instantly reload the active web page, clearing the tracked history and starting a fresh monitoring session.
* **Restricted Page Handling:** Gracefully handles internal Chrome pages (`chrome://`, `about:`) where tracking is restricted for security.

***

## 🚀 Installation (Developer Mode)

Since this is a custom extension, you need to install it by loading the unpacked directory in Chrome.

1.  **Download the Code:** Clone this repository or download the project files (including `manifest.json`, `background.js`, `popup.js`, `index.html`, and `styles.css`).
2.  **Open Chrome Extensions:**
    * Open your Google Chrome browser.
    * Navigate to `chrome://extensions`.
3.  **Enable Developer Mode:** Toggle the **"Developer mode"** switch located in the top right corner.
4.  **Load Unpacked:** Click the **"Load unpacked"** button.
5.  **Select Folder:** Select the folder containing your extension files (the one with `manifest.json` at the root).

The **Third-Eye** icon should now appear in your browser toolbar!

***

## 💡 Usage

1.  **Click the Icon:** Navigate to any website and click the **Third-Eye** icon in your Chrome toolbar.
2.  **View Hostname:** The top section will display the hostname of the active tab.
3.  **See Connections:** The "Domains Connected" count and the detailed list of URLs will populate immediately and update every second as the page loads new resources.
4.  **Force Refresh:** Click the **sync icon** (🔄) in the header to reload the active web page and start monitoring its connections from scratch.
5.  **Restricted Pages:** If you are on a `chrome://` page, the extension will display the page URL and inform you that tracking is blocked.

***

## ⚙️ How It Works (Technical Overview)

This extension utilizes core Chrome API concepts:

* **`manifest.json` (Permissions):** Requests `webRequest` and `<all_urls>` permissions to monitor network traffic across all websites, and `activeTab` to get information about the current page.
* **`background.js` (Service Worker):**
    * Uses the **`chrome.webRequest.onBeforeRequest`** listener to intercept every network request.
    * Stores a `Set` of all unique requested domains against their respective `tabId`s.
    * Includes logic to clear the stored domains when a new main page navigation begins (`main_frame` type).
* **`popup.js` (User Interface):**
    * Fetches the current `tabId` using `chrome.tabs.query`.
    * Communicates with `background.js` via **`chrome.runtime.sendMessage`** every 1000ms (1 second) using `setInterval` to pull the latest list of domains.
    * Renders the data in the `index.html` structure.

***

## ⚠️ Known Limitations

* **Internal Pages:** Due to Chrome security policies, network requests made on internal pages (e.g., `chrome://settings`, Chrome Web Store pages) cannot be tracked or monitored.
* **Initial Load Time:** On very fast connections, some initial requests might complete before the background script is fully initialized, though this is rare.
