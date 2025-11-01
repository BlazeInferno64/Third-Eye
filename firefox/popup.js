// Use 'browser' for standard WebExtensions API, fall back to 'chrome' for compatibility.
const BROWSER = typeof browser !== 'undefined' ? browser : chrome;

let refreshIntervalId;

document.addEventListener("DOMContentLoaded", (e) => {
    // Make updateDomains an async function to use await with BROWSER APIs
    const updateDomains = async () => {
        try {
            const ulElement = document.querySelector('.domains ul');
            const domainInfoElement = document.querySelector('#doc');
            const refreshButton = document.getElementById('refresh-tab-button');
            const hostDomainElement = document.querySelector('.host-domain'); // Moved this up for use in restricted check

            // Use await with BROWSER.tabs.query (Promise-based API)
            const tabs = await BROWSER.tabs.query({
                active: true,
                currentWindow: true
            });

            const activeTab = tabs[0];

            // Check for restricted pages (including Firefox's 'about:' pages)
            if (activeTab && (activeTab.url.startsWith('chrome://') || activeTab.url.startsWith('about:'))) {
                if (hostDomainElement) {
                    hostDomainElement.textContent = activeTab.url;
                }
                if (domainInfoElement) {
                    domainInfoElement.innerHTML = `<i class="fa fa-link"></i> Domains Connected: 0`;
                }
                if (ulElement) {
                    ulElement.innerHTML = '<li>Cannot track connections on this restricted page!</li>';
                }

                clearInterval(refreshIntervalId);
                return;
            }

            if (activeTab && activeTab.url) {
                const url = new URL(activeTab.url);
                const hostname = url.hostname;
                if (hostDomainElement) {
                    hostDomainElement.textContent = hostname;
                }
            }

            // Use await with BROWSER.runtime.sendMessage
            const response = await BROWSER.runtime.sendMessage({
                type: 'getDomainData',
                tabId: activeTab.id,
            });

            // Use BROWSER.runtime.lastError
            if (BROWSER.runtime.lastError || !response || !response.urls) {
                console.error("Error or no URLs received:", BROWSER.runtime.lastError?.message || "No response data.");
                return;
            };

            if (response && response.urls && ulElement && domainInfoElement) {
                const { urls } = response;
                ulElement.innerHTML = '';
                const uniqueUrls = new Set();

                urls.forEach(domain => {
                    try {
                        uniqueUrls.add(domain);
                        const li = document.createElement('li');
                        li.textContent = domain;
                        ulElement.appendChild(li);
                    } catch (error) {
                        // Ignore the invalid URLs
                    }
                });

                domainInfoElement.innerText = `Domains Connected: ${uniqueUrls.size}`;

                if (urls.length === 0) {
                    const li = document.createElement('li');
                    li.textContent = "No network requests detected yet. Try refreshing the page.";
                    ulElement.appendChild(li);
                }
            }

            if (refreshButton) {
                // Make the click handler async
                refreshButton.addEventListener("click", async (e) => {
                    refreshButton.classList.add('spin');

                    // Use await with BROWSER.tabs.query
                    const reloadTabs = await BROWSER.tabs.query({
                        active: true,
                        currentWindow: true
                    });

                    const reloadActiveTab = reloadTabs[0];

                    if (reloadActiveTab && reloadActiveTab.id) {
                        // Use await with BROWSER.tabs.reload (Promise-based)
                        await BROWSER.tabs.reload(reloadActiveTab.id);

                        setTimeout(() => {
                            refreshButton.classList.remove('spin');
                        }, 800);
                    }
                });
            }
        } catch (error) {
            console.error(error);
        }
    }

    updateDomains();

    refreshIntervalId = setInterval(updateDomains, 1000);
    window.addEventListener('unload', () => {
        clearInterval(refreshIntervalId);
    });
});


document.addEventListener("contextmenu", (e) => {
    return e.preventDefault();
});