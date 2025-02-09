export const locatorStore = {}; // Stores events with unique IDs as top-level keys

export function storeTarget(message) {
  const { action, details } = message;
  const uniqueName = generateUniqueName(details);

  if (!locatorStore[uniqueName]) {
    locatorStore[uniqueName] = {
      xpath: details.xpath,
      cssSelector: details.cssSelector,
      value: action === 'inputCaptured' ? details.value : null,
      name: details.name,
      nameSelector: details.nameSelector,
    };
    console.log(`${action} element stored:`, locatorStore[uniqueName]);
  }
}

// Helper function to generate unique event names
function generateUniqueName(details) {
  return `${details.tagName}_${details.innerText || details.name || details.id || details.class}`;
}

