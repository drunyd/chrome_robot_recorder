import { deleteCommand, commandQueue, storeRobotCommand } from './stores/CommandQueue.js';
import { storeEvent, locatorStore } from './stores/LocatorStore.js';
import { setRecordingStatus, recording } from './utils/RecordingStatus.js';
import { sendStatus } from './utils/StatusSender.js';
import { RobotEventFactory } from './robotEvents/RobotEventFactory.js';

export function handleMessage(message, sender) {
  switch (message.action) {
    case 'eventCaptured':
      let success = false;
      let robotScript;
      storeEvent(message);
      const robotEvent = RobotEventFactory.createEvent(message);
      if (robotEvent) {
        robotScript = robotEvent.generateRobotInstructions();
        storeRobotCommand(robotScript);
        sendStatus("Event captured");
        success = true;
      }
      return { success: success };

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
