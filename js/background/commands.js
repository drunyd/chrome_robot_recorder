import { addCommand } from './storage.js';

export function createClickCommand(message) {
  const { details } = message;
  const uniqueName = `${details.tagName}_${details.name.trim()}`;
  const command = `Click Element    \${${uniqueName}.cssSelector}`;
  const index = addCommand(command);

  console.log('Command added:', command);
  return { command, index };
}

export function createInputCommand(message) {
  const { details } = message;
  const uniqueName = `${details.tagName}_${details.name || details.id || details.class}`;
  const command = `Input Text    \${${uniqueName}.cssSelector}    ${details.value}`;
  const index = addCommand(command);

  console.log('Command added:', command);
  return { command, index };
}

