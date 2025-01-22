const eventStore = {}; // Stores events with unique IDs as top-level keys
const commandQueue = []; // Stores commands in the order they were captured

export function storeEvent(message) {
  const { action, details } = message;
  const uniqueName = generateUniqueName(details);

  if (!eventStore[uniqueName]) {
    eventStore[uniqueName] = {
      xpath: details.xpath,
      cssSelector: details.cssSelector,
      value: action === 'inputCaptured' ? details.value : null,
      name: details.name,
    };
    console.log(`${action} event stored:`, eventStore[uniqueName]);
  }
}

export function deleteCommand(index) {
  if (index > -1 && commandQueue[index]) {
    const removed = commandQueue.splice(index, 1)[0];
    console.log(`Command "${removed}" removed.`);
  }
}

export function addCommand(command) {
  commandQueue.push(command);
  return commandQueue.length - 1; // Return the index
}

// Helper function to generate unique event names
function generateUniqueName(details) {
  return `${details.tagName}_${details.name || details.id || details.class}`;
}

export { eventStore, commandQueue };
