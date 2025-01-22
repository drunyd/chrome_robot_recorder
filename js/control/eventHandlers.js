import { sendMessageToContentScript } from './messaging.js';

// Handle the start/stop button
export function startStopButtonHandler() {
  const button = document.getElementById("start-stop-btn");

  if (button.classList.contains("start")) {
    button.textContent = "Stop";
    button.classList.remove("start");
    button.classList.add("stop");
    sendMessageToContentScript({ action: "startRecording" });
    chrome.runtime.sendMessage({ action: 'updateRecordingStatus', recording: true });
    console.log("Recording started.");
  } else {
    button.textContent = "Start";
    button.classList.remove("stop");
    button.classList.add("start");
    sendMessageToContentScript({ action: "stopRecording" });
    chrome.runtime.sendMessage({ action: 'updateRecordingStatus', recording: false });
    console.log("Recording stopped.");
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
  chrome.runtime.sendMessage({ action: 'exportDataRequest' }, (response) => {
    const eventStore = response.data.eventStore;
    const commandQueue = response.data.commandQueue;

    const yamlOutput = convertEventsToYAML(eventStore);
    const commandOutput = exportCommandsToText(commandQueue);

    createDownloadLink(yamlOutput, 'events.yaml', 'text/yaml');
    createDownloadLink(commandOutput, 'commands.txt', 'text/plain');
  });
}

function createDownloadLink(content, filename, type) {
  const blob = new Blob([content], { type });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

function convertEventsToYAML(eventStore) {
  return jsyaml.dump(eventStore);
}

function exportCommandsToText(commandQueue) {
  return commandQueue.join("\n");
}

