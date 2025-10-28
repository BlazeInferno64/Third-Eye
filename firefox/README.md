# 👁️ Third-Eye: Domain Tracker Web Extension

Third-Eye is a lightweight, privacy-focused Web Extension designed to monitor and display all outgoing network connections (hostnames) made by the active web page in real-time. It acts as a simplified network tab, giving you instant insight into the external resources and third-party domains a website is communicating with.

**Status:** Fully compatible with **Chrome** and **Firefox**.

## ✨ Features

* **Real-time Tracking:** Continuously monitors and updates the list of connected domains every second.
* **Host Domain:** Clearly shows the primary host domain of the active tab.
* **Connection Count:** Displays the total number of unique hostnames connected to the page.
* **Full Hostname List:** Lists every unique external hostname fetched by the active tab.
* **Active Tab Reload:** Includes a refresh button to instantly reload the active web page and start a fresh monitoring session.
* **Restricted Page Handling:** Gracefully handles internal browser pages (`chrome://`, `about:`, `resource://`) where tracking is restricted for security.

***

## 🚀 Installation (Developer Mode)

Since this is a custom extension, you need to install it by loading the unpacked directory in your browser.

### For Google Chrome

1.  **Download the Code:** Clone this repository or download the project files.
2.  **Open Chrome Extensions:** Navigate to `chrome://extensions`.
3.  **Enable Developer Mode:** Toggle the **"Developer mode"** switch located in the top right corner.
4.  **Load Unpacked:** Click the **"Load unpacked"** button.
5.  **Select Folder:** Select the root folder containing your extension files (`manifest.json` should be inside).

### For Mozilla Firefox

1.  **Download the Code:** Clone this repository or download the project files.
2.  **Open Firefox Debugging:** Navigate to `about:debugging#/runtime/this-firefox`.
3.  **Load Temporary Add-on:** Click the **"Load Temporary Add-on..."** button.
4.  **Select Manifest:** Select the `manifest.json` file inside your extension's root folder.

The **Third-Eye** icon should now appear in your browser toolbar!

***

## 💡 Usage

1.  **Click the Icon:** Navigate to any website and click the **Third-Eye** icon in your browser toolbar.
2.  **View Hostname:** The top section will display the host domain of the active tab.
3.  **See Connections:** The "Domains Connected" count and the detailed list of hostnames will populate immediately and update every second as the page loads new resources.
4.  **Force Refresh:** Click the **sync icon** (🔄) in the header to reload the active web page and start monitoring its connections from scratch.
5.  **Restricted Pages:** If you are on an internal page (e.g., `chrome://` or `about:`), the extension will inform you that tracking is blocked.

***

## ⚙️ How It Works (Technical Overview)

This extension utilizes the cross-browser **WebExtensions API** for compatibility between Chrome and Firefox.

* **`manifest.json`:**
    * Requests the necessary `webRequest` and `<all_urls>` permissions to monitor all network traffic.
    * Uses **`background.scripts`** (compatible with Firefox Mv3) for its background context.
    * Includes **`browser_specific_settings`** to satisfy Firefox's requirement for a unique Add-on ID and Data Collection Policy declaration.
* **`background.js` (Background Script):**
    * Uses a cross-browser namespace wrapper (`const BROWSER = ...`) to handle both Chrome and Firefox APIs seamlessly.
    * Leverages the **`BROWSER.webRequest.onBeforeRequest`** listener to intercept every network request and extract the hostname.
    * Stores a `Set` of all unique hostnames against their respective `tabId`s.
* **`popup.js` (User Interface):**
    * Also uses the cross-browser namespace wrapper (`BROWSER`).
    * Fetches the current `tabId` using the **Promise-based** `BROWSER.tabs.query`.
    * Communicates with the background script via **`BROWSER.runtime.sendMessage`** every 1000ms (1 second) to pull the latest list of unique hostnames for display.

***

## ⚠️ Known Limitations

* **Internal Pages:** Due to browser security policies, network requests made on internal pages (e.g., `chrome://settings`, Chrome Web Store, `about:config`) cannot be tracked or monitored. The extension will notify you when you are on one of these pages.
* **Initial Load Time:** On very fast connections, some initial requests might complete before the background script is fully initialized, though this is rare.