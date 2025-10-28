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


The **Third-Eye** icon should now appear in your browser toolbar!

***

## 💡 Usage

1.  **Click the Icon:** Navigate to any website and click the **Third-Eye** icon in your browser toolbar.
2.  **View Hostname:** The top section will display the host domain of the active tab.
3.  **See Connections:** The "Domains Connected" count and the detailed list of hostnames will populate immediately and update every second as the page loads new resources.
4.  **Force Refresh:** Click the **sync icon** (🔄) in the header to reload the active web page and start monitoring its connections from scratch.
5.  **Restricted Pages:** If you are on an internal page (e.g., `chrome://` or `about:`), the extension will inform you that tracking is blocked.

***

## ⚠️ Known Limitations

* **Internal Pages:** Due to browser security policies, network requests made on internal pages (e.g., `chrome://settings`, Chrome Web Store, `about:config`) cannot be tracked or monitored. The extension will notify you when you are on one of these pages.
* **Initial Load Time:** On very fast connections, some initial requests might complete before the background script is fully initialized, though this is rare.

# LICENSE

`Third-Eye` is released under the MIT License.

View the full license terms <a href="https://github.com/BlazeInferno64/Third-eye/blob/main/LICENSE">here</a>.

# Bugs & Issues

Found a bug or want a new feature?

Report issues and request features on the [Third Eye issue tracker](https://github.com/blazeinferno64/Third-Eye/issues).

`Thanks for reading!`

`Have a great day ahead :D`