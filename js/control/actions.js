// Function to update the actions list on control.html
export function updateActionsList(command, event, uniqueName, index) {
  const actionsList = document.getElementById('actions-list');

  // Create a new element for this action
  const actionItem = document.createElement('div');
  actionItem.classList.add('action-item');
  actionItem.setAttribute('data-unique-name', uniqueName);
  actionItem.setAttribute('data-index', index);

  const commandElement = document.createElement('span');
  commandElement.textContent = command;
  actionItem.appendChild(commandElement);

  // Create a delete button
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'X';
  deleteButton.classList.add('delete-btn');
  deleteButton.addEventListener('click', () => {
    handleDeleteCommand(actionItem);
  });

  actionItem.appendChild(deleteButton);
  actionsList.appendChild(actionItem);
}

function handleDeleteCommand(actionItem) {
  const commandIndex = actionItem.getAttribute('data-index');
  chrome.runtime.sendMessage({
    action: 'deleteCommand',
    index: parseInt(commandIndex, 10),
  });

  actionItem.remove();
  adjustRemainingActions();
}

function adjustRemainingActions() {
  const remainingItems = document.querySelectorAll('.action-item');
  remainingItems.forEach((item, index) => {
    item.setAttribute('data-index', index);
  });
}
