import { setupMessaging } from './js/background/messaging.js';

// Initialize the extension
setupMessaging();

chrome.action.onClicked.addListener(() => {
  chrome.windows.create({
    url: chrome.runtime.getURL("control.html"),
    type: "popup",
    width: 400,
    height: 600,
    left: 100,
    top: 100,
    focused: true,
  });
});
