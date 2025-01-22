// Function to send a message to all tabs with the content script
function sendMessageToContentScript(message) {
  // Query all tabs in the browser
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      chrome.tabs.sendMessage(tab.id, message, (response) => {
        if (chrome.runtime.lastError) {
          // console.error(`Error sending message to tab ${tab.id}:`, chrome.runtime.lastError.message);
        } else if (response) {
          console.log(`Response from tab ${tab.id}:`, response);
        }
      });
    });
  });
}


// Handle the start/stop button
document.getElementById("start-stop-btn").addEventListener("click", function() {
  const button = this;
  if (button.classList.contains("start")) {
    button.textContent = "Stop";
    button.classList.remove("start");
    button.classList.add("stop");
    // chrome.runtime.sendMessage({ action: "startRecording" });
    sendMessageToContentScript({ action: "startRecording" })
    console.log("started rec. controljs")
  } else {
    button.textContent = "Start";
    button.classList.remove("stop");
    button.classList.add("start");
    chrome.runtime.sendMessage({ action: "stopRecording" });
    console.log("stopped rec. controljs")
  }
});
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'updateActionsList') {
    const { command, event, uniqueName, index } = message;
    updateActionsList(command, event, uniqueName, index);
  }
});
// Function to update the actions list on control.html
function updateActionsList(command, event, uniqueName, index) {
  const actionsList = document.getElementById('actions-list');

  // Create a new element for this action
  const actionItem = document.createElement('div');
  actionItem.classList.add('action-item');
  actionItem.setAttribute('data-unique-name', uniqueName);
  actionItem.setAttribute('data-index', index); // Store the index in the element

  // Determine if the action is a "Click Element" or "Input Text"
  let commandText = command;

  // Add the command text to the new item
  const commandElement = document.createElement('span');
  commandElement.textContent = commandText;
  actionItem.appendChild(commandElement);

  // Create a delete button
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'X';
  deleteButton.classList.add('delete-btn');

  deleteButton.addEventListener('click', () => {
    const commandIndex = actionItem.getAttribute('data-index'); // Get the stored index
    chrome.runtime.sendMessage({
      action: 'deleteCommand',
      index: parseInt(commandIndex, 10) // Send the index for deletion
    });

    // Remove the action item from the control panel UI
    actionItem.remove();

    // Adjust the data-index of the following items to ensure consistency
    const remainingItems = document.querySelectorAll('.action-item');
    remainingItems.forEach((item, index) => {
      // Update the data-index attribute to reflect the new order
      item.setAttribute('data-index', index);
    });
  });


  actionItem.appendChild(deleteButton);

  // Append the action item to the actions list
  actionsList.appendChild(actionItem);
}


// Handle the clear button to clear the recorded actions
document.getElementById("clear-btn").addEventListener("click", function() {
  chrome.runtime.sendMessage({ action: "clearRecordedActions" });
  scriptArea.value = ""; // Clear the textarea
});

document.getElementById('export-btn').addEventListener('click', () => {
  // Send a message to background.js to get the event data and commands
  chrome.runtime.sendMessage({ action: 'exportDataRequest' }, (response) => {
    // Handle the response data from background.js
    const eventStore = response.eventStore;
    const commandQueue = response.commandQueue;

    // Convert events to YAML and commands to plain text
    const yamlOutput = convertEventsToYAML(eventStore);
    const commandOutput = exportCommandsToText(commandQueue);

    // Create Blob and save as files
    const yamlBlob = new Blob([yamlOutput], { type: 'text/yaml' });
    const textBlob = new Blob([commandOutput], { type: 'text/plain' });

    // Download event YAML
    const yamlLink = document.createElement('a');
    yamlLink.href = URL.createObjectURL(yamlBlob);
    yamlLink.download = 'events.yaml';
    yamlLink.click();

    // Download command text
    const textLink = document.createElement('a');
    textLink.href = URL.createObjectURL(textBlob);
    textLink.download = 'commands.txt';
    textLink.click();
  });
});

// Convert eventStore to YAML
function convertEventsToYAML(eventStore) {
  const yamlEvents = jsyaml.dump(eventStore);
  return yamlEvents;
}

// Convert commandQueue to plain text
function exportCommandsToText(commandQueue) {
  return commandQueue.join("\n");
}
