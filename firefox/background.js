const BROWSER = typeof browser !== 'undefined' ? browser : chrome;

// Pretty names for request types
const prettyTypes = {
    fetch: 'xhr',
    image: 'img',
    main_frame: 'doc',
    script: 'js',
    stylesheet: 'css',
    sub_frame: 'frm',
    xmlhttprequest: 'xhr',
};

const tabRequests = {};

function getHostname(urlString) {
    try {
        return new URL(urlString).hostname;
    } catch (e) {
        return null;
    }
}

async function updateBadgeForActiveTab() {
    try {
        const tabs = await BROWSER.tabs.query({ active: true, currentWindow: true });
        const activeTab = tabs[0];
        if (activeTab && activeTab.id >= 0) {
            const domainsSet = tabRequests[activeTab.id] || new Set();
            const count = domainsSet.size;
            const badgeAPI = BROWSER.browserAction || BROWSER.action;
            badgeAPI.setBadgeText({ text: count > 0 ? count.toString() : "" });
            badgeAPI.setBadgeBackgroundColor({ color: "#4b4a4d" });
        }
    } catch (error) {
        console.error("Error updating badge:", error);
    }
}

BROWSER.webRequest.onBeforeRequest.addListener(
    async (details) => {
        const { tabId, url, type, initiator } = details;
        if (tabId < 0 || url.startsWith('chrome://') || url.startsWith('data:') || url.startsWith('about:')) {
            return;
        }

        const hostname = getHostname(url);

        if (!tabRequests[tabId]) {
            tabRequests[tabId] = new Set();
        }
        const wasAdded = !tabRequests[tabId].has(hostname);
        tabRequests[tabId].add(hostname);

        if (wasAdded) {
            await updateBadgeForActiveTab();
        }
    },
    {
        urls: ["<all_urls>"],
        types: [
            "csp_report",
            "font",
            "image",
            "main_frame",
            "media",
            "object",
            "other",
            "ping",
            "script",
            "stylesheet",
            "sub_frame",
            "webbundle",
            "websocket",
            "xmlhttprequest"
        ]
    }
)


BROWSER.webRequest.onBeforeRequest.addListener(
    (details) => {
        if (details.type === "main_frame" && details.tabId > 0) {
            // Clear the list for the tab just before the page loads
            tabRequests[details.tabId] = new Set();
        }
    },
    { urls: ["<all_urls>"] }
);

BROWSER.tabs.onRemoved.addListener((tabId) => {
    delete tabRequests[tabId];
});

// Update badge when tab is activated (switched to)
BROWSER.tabs.onActivated.addListener(async (activeInfo) => {
    await updateBadgeForActiveTab();
});
// Set initial badge background color on startup
BROWSER.runtime.onStartup.addListener(() => {
    const badgeAPI = BROWSER.browserAction || BROWSER.action;
    badgeAPI.setBadgeBackgroundColor({ color: "#4b4a4d" });
});

/*function handleMessages(message, sender, sendResponse) {
    console.log(message)

  // Since `fetch` is asynchronous, must return an explicit `true`
  return true;
}*/

BROWSER.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'getDomainData' || request.type === "getConnectedDomains") {
        const { tabId } = request;
        const domainsSet = tabRequests[tabId] || new Set();
        const domains = Array.from(domainsSet);
        console.log(domains);
        sendResponse({ urls: domains });
        return true;
    }
});