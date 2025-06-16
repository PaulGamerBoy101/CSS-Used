// When user clicks the browser action button, send message to content script to create the modal
chrome.browserAction.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, { action: "showCssModal" });
});
