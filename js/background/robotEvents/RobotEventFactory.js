import { RobotClickEvent } from './robotEvents.js';
import { RobotInputEvent } from './robotEvents.js';

export class RobotEventFactory {
  static createEvent(message) {
    switch (message.tagName) {
      case 'BUTTON':
        return new RobotClickEvent(message);
      case 'INPUT':
        return new RobotInputEvent(message);
      default:
        console.warn(`Unknown tagName: ${message.tagName}`);
        return null;
    }
  }
}
