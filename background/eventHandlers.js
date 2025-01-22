import { storeEvent, deleteCommand } from './storage.js';
import { createClickCommand, createInputCommand } from './commands.js';

export function handleMessage(message, sender) {
  switch (message.action) {
    case 'clickCaptured':
      storeEvent(message);
      const clickCommand = createClickCommand(message);
      return { command: clickCommand };

    case 'inputCaptured':
      storeEvent(message);
      const inputCommand = createInputCommand(message);
      return { command: inputCommand };

    case 'deleteCommand':
      deleteCommand(message.index);
      return { success: true };

    case 'exportDataRequest':
      return { data: { eventStore, commandQueue } };

    default:
      console.warn(`Unknown action: ${message.action}`);
      return null;
  }
}
