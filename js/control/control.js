import { startStopButtonHandler, clearButtonHandler, exportButtonHandler } from './eventHandlers.js';
import { updateActionsList } from './actions.js';
import StatusUpdater from './statusUpdater.js';

// Initialize the control panel
function initializeControlPanel() {
  document.getElementById("start-stop-btn").addEventListener("click", startStopButtonHandler);
  document.getElementById("clear-btn").addEventListener("click", clearButtonHandler);
  document.getElementById("export-btn").addEventListener("click", exportButtonHandler);

  // Listen for messages from background.js
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'updateActionsList') {
      const { command, event, uniqueName, index } = message;
      updateActionsList(command, event, uniqueName, index);
    }
    if (message.action === 'newstatus') {
      StatusUpdater.updateStatus(message.message);
    }
  });
}

// Start the control panel initialization
initializeControlPanel();

