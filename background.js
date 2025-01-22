let recordedActions = [];

// Open the control window when the extension icon is clicked
chrome.action.onClicked.addListener(() => {
  chrome.windows.create({
    url: chrome.runtime.getURL("control.html"),
    type: "popup",
    width: 400,
    height: 600,
    left: 100,
    top: 100,
    focused: true
  });
});

let eventStore = {}; // Stores events with unique IDs as top-level keys
let commandQueue = []; // Stores commands in the order they were captured


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'exportDataRequest') {
    // Send back the current eventStore and commandQueue
    sendResponse({ eventStore: eventStore, commandQueue: commandQueue });
  }

  if (message.action === 'clickCaptured') {
    const eventDetails = message.details;

    // Generate a unique name for this event based on its properties
    const uniqueName = `${eventDetails.tagName}_${eventDetails.name.trim()}`;

    // If event doesn't exist in eventStore, store it, otherwise just store the command
    if (!eventStore[uniqueName]) {
      eventStore[uniqueName] = {
        xpath: eventDetails.xpath,
        cssSelector: eventDetails.cssSelector,
        value: null, // No value for click events
        name: eventDetails.name,
      };
      console.log('Click event stored in eventStore:', eventStore);
    }

    // Always store the corresponding Robot Framework command in commandQueue
    const command = `Click Element    \${${uniqueName}.cssSelector}`;
    commandQueue.push(command);

    console.log('Command added to commandQueue:', command);
    const commandIndex = commandQueue.indexOf(command);
    // Send the event to control.js
    chrome.runtime.sendMessage({
      action: 'updateActionsList',
      command: command,
      event: eventStore[uniqueName],
      uniqueName: uniqueName,
      index: commandIndex // Send the index of the command in the queue
    });
  } else if (message.action === 'inputCaptured') {
    const eventDetails = message.details;

    // Generate a unique name for this event based on its properties
    const uniqueName = `${eventDetails.tagName}_${eventDetails.name || eventDetails.id || eventDetails.class}`;

    // If event doesn't exist in eventStore, store it, otherwise just store the command
    if (!eventStore[uniqueName]) {
      eventStore[uniqueName] = {
        xpath: eventDetails.xpath,
        cssSelector: eventDetails.cssSelector,
        value: eventDetails.value, // Store the dynamically captured input value
        name: eventDetails.name,
      };
      console.log('Input event stored in eventStore:', eventStore);
    }

    // Always store the corresponding Robot Framework command with dynamic value in commandQueue
    const command = `Input Text    \${${uniqueName}.cssSelector}    ${eventDetails.value}`;
    commandQueue.push(command);

    console.log('Command added to commandQueue:', command);
    const commandIndex = commandQueue.indexOf(command);
    // Send the event to control.js
    chrome.runtime.sendMessage({
      action: 'updateActionsList',
      command: command,
      event: eventStore[uniqueName],
      uniqueName: uniqueName,
      index: commandIndex // Send the index of the command in the queue
    });
  }
  // Listen for deleteCommand action from control panel
  if (message.action === 'deleteCommand') {
    const commandIndex = message.index;

    // Remove the command at the specified index from the commandQueue
    if (commandIndex > -1 && commandQueue[commandIndex]) {
      const removedCommand = commandQueue.splice(commandIndex, 1)[0]; // Remove and store the deleted command
      console.log(`Command "${removedCommand}" removed from commandQueue`);
    }
  }
});
