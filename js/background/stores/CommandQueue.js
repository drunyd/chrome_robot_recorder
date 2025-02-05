const commandQueue = []; // Stores commands in the order they were captured

export function deleteCommand(index) {
  if (index > -1 && commandQueue[index]) {
    const removed = commandQueue.splice(index, 1)[0];
    console.log(`Command "${removed}" removed.`);
  }
}

export function storeRobotCommand(command, event, uniqueName) {
  const index = commandQueue.push(command) - 1; // Add command to the queue and get the index
  console.log('Command added:', command);

  // Send a message to control.js to update the actions list
  chrome.runtime.sendMessage({
    action: 'updateActionsList',
    command: command,
    event: event,
    uniqueName: uniqueName,
    index: index,
  });

  return index; // Return the index of the added command
}


export { commandQueue };

