const eventStore = {}; // Stores events with unique IDs as top-level keys

export function storeEvent(message) {
  const { action, details } = message;
  const uniqueName = generateUniqueName(details);

  if (!eventStore[uniqueName]) {
    eventStore[uniqueName] = {
      xpath: details.xpath,
      cssSelector: details.cssSelector,
      value: action === 'inputCaptured' ? details.value : null,
      name: details.name,
      nameSelector: details.nameSelector,
    };
    console.log(`${action} element stored:`, eventStore[uniqueName]);
  }
}

// Helper function to generate unique event names
function generateUniqueName(details) {
  return `${details.tagName}_${details.name || details.id || details.class}`;
}

export { eventStore };
