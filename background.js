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

// Listen for messages from the control panel (popup)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'exportDataRequest') {
    // Send back the current eventStore and commandQueue
    sendResponse({ eventStore: eventStore, commandQueue: commandQueue });
  }
  // Other actions can be handled here
});

// Capture click event
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'clickCaptured') {
    const eventDetails = message.details;

    // Generate a unique name for this event based on its properties
    const uniqueName = `${eventDetails.tagName}_${eventDetails.name.trim()}`;

    // Only store the event if it doesn't already exist
    if (!eventStore[uniqueName]) {
      eventStore[uniqueName] = {
        xpath: eventDetails.xpath,
        cssSelector: eventDetails.cssSelector,
        value: null, // No value for click events
        name: eventDetails.name,
      };

      // Create the corresponding Robot Framework command
      const command = `Click Element    \${${uniqueName}.cssSelector}`;
      commandQueue.push(command);

      console.log('Click event stored and command added:', eventStore);
    }
  } else if (message.action === 'inputCaptured') {
    const eventDetails = message.details;

    // Generate a unique name for this event based on its properties
    const uniqueName = `${eventDetails.tagName}_${eventDetails.name || eventDetails.id || eventDetails.class}`;

    // Only store the event if it doesn't already exist
    if (!eventStore[uniqueName]) {
      eventStore[uniqueName] = {
        xpath: eventDetails.xpath,
        cssSelector: eventDetails.cssSelector,
        value: eventDetails.value, // Store the dynamically captured input value
        name: eventDetails.name,
      };

      // Create the corresponding Robot Framework command with dynamic value
      const command = `Input Text    \${${uniqueName}.cssSelector}    ${eventDetails.value}`;
      commandQueue.push(command);

      console.log('Input event stored and command added:', eventStore);
    }
  }
});
