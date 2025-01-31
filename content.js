// ==============================
// Recording Status Initialization
// ==============================
let recording = false;

console.log('Contentjs asking for recording status...');
chrome.runtime.sendMessage({ action: 'getRecordingStatus' }, (response) => {
  // Set the recording status based on the response
  recording = response.recording;
  console.log(`Recording status set to: ${recording}`);
});

// ==============================
// Message Listener from Background Script
// ==============================
chrome.runtime.onMessage.addListener((message) => {
  console.log('Message received in content script:', message);

  // Check the message content and act accordingly
  if (message.action === 'startRecording') {
    recording = true;
    console.log("Recording started");
  }
  if (message.action === 'stopRecording') {
    recording = false;
    console.log("Recording stopped");
  }

  // Indicate if you want to keep the response channel open for asynchronous responses
  return true; // Return true if you plan to send an asynchronous response
});

// ==============================
// Event Handlers
// ==============================

// Add event listener for all clicks on the page
document.addEventListener('click', (event) => {
  const target = event.target;

  // Log all properties of the target element
  console.log('Click event captured:', target);

  // Optionally send the click event details to the background script or control panel
  if (recording) {
    sendMessage('clickCaptured', target);
  }

});

let inputTimeout;

document.addEventListener('input', (event) => {
  const target = event.target;

  // Only capture input for text fields or text areas
  if (['INPUT', 'TEXTAREA'].includes(target.tagName)) {
    clearTimeout(inputTimeout);

    // Set a timeout to wait for the user to stop typing
    inputTimeout = setTimeout(() => {
      console.log('Final input value:', target.value);

      // Optionally send the value to the background script
      if (recording) {
        sendMessage('inputCaptured', target);
      }
    }, 1000); // Adjust delay as needed
  }
});

// ==============================
// Utility Functions
// ==============================


function sendMessage(action, target) {
  const optimizedXPath = generateOptimizedXPath(target);
  const optimizedCSSSelector = generateOptimizedCSSSelector(target);
  let choosenValue = null;

  let optimizedNameSelector = null;

  if (target.name) {
    optimizedNameSelector = `xpath=${target.tagName.toLowerCase()}[contains(@name,"${target.name}")]`;
  }


  if (target.tagName === 'SELECT') {
    choosenValue = target.value;
  }

  chrome.runtime.sendMessage({
    action: action,
    details: {
      tagName: target.tagName,
      name: target.name,
      id: target.id,
      classes: Array.from(target.classList),
      textContent: target.textContent.trim(),
      xpath: optimizedXPath,
      cssSelector: optimizedCSSSelector,
      nameSelector: optimizedNameSelector,
      choosenValue: choosenValue,
      value: target.value,
    },
  });
}

// ==============================
// XPath Generator
// ==============================

function generateOptimizedXPath(element) {
  if (!element || element.nodeType !== Node.ELEMENT_NODE) {
    return '';
  }

  // Helper to escape special characters in attributes
  const escapeAttribute = (value) => `"${value.replace(/"/g, '\\"')}"`;

  // Generate a simple XPath for the current element
  const getNodeSelector = (el) => {
    let selector = el.tagName.toLowerCase();

    // Add meaningful attributes for specificity
    if (el.classList.length > 0) {
      selector += `[contains(@class, ${escapeAttribute(el.classList[0])})]`;
    } else if (el.hasAttribute('name')) {
      selector += `[@name=${escapeAttribute(el.getAttribute('name'))}]`;
    } else if (el.hasAttribute('data-testid')) {
      selector += `[@data-testid=${escapeAttribute(el.getAttribute('data-testid'))}]`;
    }

    return selector;
  };

  // Recursively build the path from the element to its parent
  const parts = [];
  while (element && element.tagName.toLowerCase() !== 'body') {
    const selector = getNodeSelector(element);
    if (!selector) break;
    parts.unshift(selector);
    element = element.parentNode;
  }

  // Join the parts to create the XPath
  return `//${parts.join('/')}`;
}

// ==============================
// CSS Selector Generator
// ==============================

function generateOptimizedCSSSelector(element) {
  if (!element || element.nodeType !== Node.ELEMENT_NODE) {
    return '';
  }

  // Helper to escape special characters in CSS selectors
  const escapeCSS = (value) => value.replace(/([!"#$%&'()*+,.\\/:;<=>?@[\\\]^`{|}~])/g, '\\$1');

  // Generate a simple CSS selector for the current element
  const getNodeSelector = (el) => {
    let selector = el.tagName.toLowerCase();

    if (el.classList.length > 0) {
      selector += `.${Array.from(el.classList)
        .map(escapeCSS)
        .join('.')}`;
    } else if (el.hasAttribute('name')) {
      selector += `[name="${escapeCSS(el.getAttribute('name'))}"]`;
    } else if (el.hasAttribute('data-testid')) {
      selector += `[data-testid="${escapeCSS(el.getAttribute('data-testid'))}"]`;
    }

    return selector;
  };

  // Recursively build the path from the element to its parent
  const parts = [];
  while (element && element.tagName.toLowerCase() !== 'body') {
    const selector = getNodeSelector(element);
    if (!selector) break;
    parts.unshift(selector);
    element = element.parentNode;
  }

  // Join the parts to create the CSS selector
  return parts.join(' > ');
}
