import { deleteCommand, commandQueue } from './stores/CommandQueue.js';
import { storeEvent, locatorStore } from './stores/LocatorStore.js';
import { setRecordingStatus, recording } from './utils/RecordingStatus.js';
import { sendStatus } from './utils/StatusSender.js';
import { RobotEventFactory } from './robotEvents/RobotEventFactory.js';

export function handleMessage(message, sender) {
  switch (message.action) {
    case 'eventCaptured':
      storeEvent(message);
      const robotEvent = RobotEventFactory.createEvent(message);
      const robotScript = robotEvent.getScript();
      storeCommand(robotScript);
      sendStatus("Event captured");
      return { command: robotScript };

    case 'deleteCommand':
      deleteCommand(message.index);
      return { success: true };

    case 'exportDataRequest':
      return { data: { locatorStore, commandQueue } };

    case 'getRecordingStatus':
      return { recording: recording };

    case 'updateRecordingStatus':
      setRecordingStatus(message.recording);
      return null;

    default:
      console.warn(`Unknown action: ${message.action}`);
      return null;
  }
}
