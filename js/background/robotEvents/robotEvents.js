//Base Command Class
export class RobotEvent {
  constructor(message) {
    this.details = message.details;
    this.uniqueName = `${this.details.tagName}_${this.details.name || this.details.id || this.details.class}`;
    this.locator = this.details.nameSelector ? `\${${this.uniqueName}.nameSelector}` : `\${${this.uniqueName}.cssSelector}`;
  }
  generateRobotInstructions() {
    throw new Error("Subclasses must implement generateRobotCommand");
  }
}

//Click Command
export class RobotClickEvent extends RobotEvent {
  constructor(message) {
    super(message);
    this.type = 'click';
  }

  generateRobotInstructions() {
    let command;
    if (this.details.tagName === 'SELECT') {
      command = `SELECT FROM LIST BY VALUE    ${this.locator}    ${this.details.choosenValue}`;
    } else {
      command = `Click Element    ${this.locator}`;
    }
    return command;
  }
}

//Input Command
export class RobotInputEvent extends RobotEvent {
  constructor(message) {
    super(message);
    this.type = 'input';
  }

  generateRobotInstructions() {
    return `Input Text    ${this.locator}    ${this.details.value}`;
  }
}
