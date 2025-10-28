let refreshIntervalId;

document.addEventListener("DOMContentLoaded", (e) => {
    const updateDomains = () => {
        try {
            const ulElement = document.querySelector('.domains ul');
            const domainInfoElement = document.querySelector('.domain-info');
            const refreshButton = document.getElementById('refresh-tab-button');

            chrome.tabs.query({
                active: true,
                currentWindow: true
            }, async (tabs) => {
                const activeTab = tabs[0];
                if (activeTab && (activeTab.url.startsWith('chrome://') || activeTab.url.startsWith('about:'))) {
                    if (hostDomainElement) {
                        hostDomainElement.textContent = activeTab.url; // Display the chrome:// URL
                    }
                    if (domainInfoElement) {
                        domainInfoElement.innerHTML = `<i class="fa fa-link"></i> Domains Connected: 0`;
                    }
                    if (ulElement) {
                        ulElement.innerHTML = '<li>Cannot track connections on this restricted page!</li>';
                    }
                    // Stop the function here and clear the interval for this restricted context
                    // This prevents spamming the console with errors every second.
                    clearInterval(refreshIntervalId);
                    return;
                }

                if (activeTab && activeTab.url) {
                    const url = new URL(activeTab.url);
                    const hostname = url.hostname;
                    const hostDomainElement = document.querySelector('.host-domain');
                    if (hostDomainElement) {
                        hostDomainElement.textContent = hostname;
                    }
                }
                const response = await chrome.runtime.sendMessage({
                    type: 'getDomainData',
                    tabId: activeTab.id,
                });

                if (chrome.runtime.lastError || !response || !response.urls) {
                    console.error("Error or no URLs received:", chrome.runtime.lastError?.message || "No response data.");
                    return;
                };

                if (response && response.urls) {
                    const { urls } = response;

                    ulElement.innerHTML = '';
                    const uniqueUrls = new Set();
                    urls.forEach(domain => {
                        try {
                            uniqueUrls.add(domain);
                            // Render the full URL in the list
                            const li = document.createElement('li');
                            li.textContent = domain;
                            ulElement.appendChild(li);
                        } catch (error) {
                            // Ignore the invalid URLs
                        }
                    });

                    domainInfoElement.innerHTML = `<i class="fa fa-link"></i> Domains Connected: ${uniqueUrls.size}`;

                    if (urls.length === 0) {
                        const li = document.createElement('li');
                        li.textContent = "No network requests detected yet. Try refreshing the page.";
                        ulElement.appendChild(li);
                    }
                }

            });

            if (refreshButton) {
                refreshButton.addEventListener("click", (e) => {
                    refreshButton.classList.add('spin');
                    chrome.tabs.query({
                        active: true,
                        currentWindow: true
                    },
                        (tabs) => {
                            const activeTab = tabs[0];
                            if (activeTab && activeTab.id) {
                                chrome.tabs.reload(activeTab.id, {}, () => {
                                    // Remove the spin class after reload
                                    setTimeout(() => {
                                        refreshButton.classList.remove('spin');
                                    }, 800); // Adjust timeout as needed
                                });
                            }
                        })
                })
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
})


document.addEventListener("contextmenu", (e) => {
    return e.preventDefault();
})