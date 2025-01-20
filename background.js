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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'clickCaptured') {
    console.log('Click event received in background:', message.details);
  } else if (message.action === 'inputCaptured') {
    console.log('Input event received in background:', message.details);
  }
});
