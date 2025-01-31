import { sendMessageToContentScript } from './messaging.js';
import StatusUpdater from './statusUpdater.js';

// Handle the start/stop button
export function startStopButtonHandler() {
  const button = document.getElementById("start-stop-btn");

  if (button.classList.contains("start")) {
    button.textContent = "Stop";
    button.classList.remove("start");
    button.classList.add("stop");
    sendMessageToContentScript({ action: "startRecording" });
    StatusUpdater.updateStatus("Recording...");
    chrome.runtime.sendMessage({ action: 'updateRecordingStatus', recording: true });
    console.log("Recording started.");
  } else {
    button.textContent = "Start";
    button.classList.remove("stop");
    button.classList.add("start");
    sendMessageToContentScript({ action: "stopRecording" });
    chrome.runtime.sendMessage({ action: 'updateRecordingStatus', recording: false });
    console.log("Recording stopped.");
    StatusUpdater.updateStatus("Recording stopped.");
  }

  // Send a message to the background script with the new recording status
}

// Handle the clear button to clear the recorded actions
export function clearButtonHandler() {
  chrome.runtime.sendMessage({ action: "clearRecordedActions" });
  const scriptArea = document.querySelector("#scriptArea");
  scriptArea.value = ""; // Clear the textarea
}

// Handle the export button
export function exportButtonHandler() {
  StatusUpdater.updateStatus("Exporting locators and commands...");
  chrome.runtime.sendMessage({ action: 'exportDataRequest' }, (response) => {
    const locatorStore = response.data.locatorStore;
    const commandQueue = response.data.commandQueue;

    const yamlOutput = convertEventsToYAML(locatorStore);
    const commandOutput = exportCommandsToText(commandQueue);

    createDownloadLink(yamlOutput, 'locators.yaml', 'text/yaml');
    createDownloadLink(commandOutput, 'commands.txt', 'text/plain');
    StatusUpdater.updateStatus("Export done.");
  });
}

function createDownloadLink(content, filename, type) {
  const blob = new Blob([content], { type });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

function convertEventsToYAML(locatorStore) {
  return jsyaml.dump(locatorStore);
}

function exportCommandsToText(commandQueue) {
  return commandQueue.join("\n");
}

