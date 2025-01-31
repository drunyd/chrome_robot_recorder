import { handleMessage } from './eventHandlers.js';

export function setupMessaging() {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    try {
      const result = handleMessage(message, sender);
      sendResponse(result);
    } catch (error) {
      console.error('Error handling message:', error);
    }
  });
}

