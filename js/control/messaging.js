// Function to send a message to all tabs with the content script
export function sendMessageToContentScript(message) {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      chrome.tabs.sendMessage(tab.id, message, (response) => {
        if (chrome.runtime.lastError) {
          // Handle error if necessary
        } else if (response) {
          console.log(`Response from tab ${tab.id}:`, response);
        }
      });
    });
  });
}
