export function sendStatus(message) {
  chrome.runtime.sendMessage({
    action: 'newstatus',
    message: message,
  });
}
