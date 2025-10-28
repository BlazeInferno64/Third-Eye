                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    func: (domain) => {
                        act(() => {
                            const event = new CustomEvent('domainDetected', { detail: domain });
                            window.dispatchEvent(event);
                        });
                    },
                    args: [domain]
                });









// popup.js

document.addEventListener('DOMContentLoaded', () => {
    // Query for the active tab in the current window
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        // 'tabs' is an array of Tab objects. Since 'active: true' and 'currentWindow: true' are specified,
        // it should contain only one tab, which is the currently active tab.
        const activeTab = tabs[0];

        if (activeTab && activeTab.url) {
            try {
                // Use the built-in URL object to easily parse the URL
                const url = new URL(activeTab.url);
                
                // The 'hostname' property gives you the domain (e.g., 'www.google.com')
                const hostname = url;

                // Update the DOM element in index.html
                const hostDomainElement = document.querySelector('.host-domain');
                if (hostDomainElement) {
                    hostDomainElement.textContent = hostname;
                }
                
                // Log for debugging purposes
                console.log('Current Hostname:', hostname);

            } catch (e) {
                console.error('Error parsing URL:', e);
                const hostDomainElement = document.querySelector('.host-domain');
                if (hostDomainElement) {
                     hostDomainElement.textContent = 'Invalid URL';
                }
            }
        } else {
            // Handle cases where no active tab or URL is available (e.g., on a special chrome:// page)
            const hostDomainElement = document.querySelector('.host-domain');
            if (hostDomainElement) {
                 hostDomainElement.textContent = 'NO DATA!';
            }
        }
    });
});