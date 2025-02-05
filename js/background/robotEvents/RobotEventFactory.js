import { RobotClickEvent, RobotInputEvent } from './robotEvents.js';

export class RobotEventFactory {
  static createEvent(message) {
    switch (message.type) {
      case 'click':
        return (message.details.tagName === 'INPUT' &&
          message.details.tagType != 'submit') ? false : new RobotClickEvent(message);
      // return new RobotClickEvent(message);
      case 'input':
        return new RobotInputEvent(message);
      default:
        console.warn(`Unknown tagName: ${message.details.tagName}`);
        return null;
    }
  }
}
