chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed and ready!');
});

chrome.action.onClicked.addListener(() => {
  chrome.windows.create({
    url: "control.html", // The HTML file for your floating window
    type: "popup",
    width: 400, // Customize the dimensions
    height: 600,
    focused: true
  });
});
