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

chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
        const { tabId, url, type, initiator } = details;
        if (tabId < 0 || url.startsWith('chrome://') || url.startsWith('data:')) {
            return;
        }

        const hostname = getHostname(url);

        if (!tabRequests[tabId]) {
            tabRequests[tabId] = new Set();
        }

        tabRequests[tabId].add(hostname);
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


chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
        if (details.type === "main_frame" && details.tabId > 0) {
            // Clear the list for the tab just before the page loads
            tabRequests[details.tabId] = new Set();
        }
    },
    { urls: ["<all_urls>"] }
);

chrome.tabs.onRemoved.addListener((tabId) => {
    delete tabRequests[tabId];
});

/*function handleMessages(message, sender, sendResponse) {
    console.log(message)

  // Since `fetch` is asynchronous, must return an explicit `true`
  return true;
}*/

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'getDomainData' || request.type === "getConnectedDomains") {
        const { tabId } = request;
        const domainsSet = tabRequests[tabId] || new Set();
        const domains = Array.from(domainsSet);
        console.log(domains);
        sendResponse({ urls: domains } );
        return true;
    }
});