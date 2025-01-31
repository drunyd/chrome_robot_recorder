import { addCommand } from './stores/CommandQueue.js';

export function createClickCommand(message) {
  const { details } = message;
  const uniqueName = `${details.tagName}_${details.name.trim()}`;
  const locator = details.nameSelector ? `\${${uniqueName}.nameSelector}` : `\${${uniqueName}.cssSelector}`;
  let command;

  if (details.tagName === 'SELECT') {
    command = `SELECT FROM LIST BY VALUE    ${locator}    ${details.choosenValue}`;
  } else {
    command = `Click Element    ${locator}`;
  }

  const index = addCommand(command);

  console.log('Command added:', command);
  return { command, index };
}

export function createInputCommand(message) {
  const { details } = message;
  const uniqueName = `${details.tagName}_${details.name || details.id || details.class}`;
  const locator = details.nameSelector ? `\${${uniqueName}.nameSelector}` : `\${${uniqueName}.cssSelector}`;
  const command = `Input Text    ${locator}    ${details.value}`;
  const index = addCommand(command);

  console.log('Command added:', command);
  return { command, index };
}
