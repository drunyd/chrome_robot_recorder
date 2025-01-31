// FILE: js/statusUpdater.js
class StatusUpdater {
  constructor() {
    if (!StatusUpdater.instance) {
      this.statusElement = document.getElementById('status-message');
      StatusUpdater.instance = this;
    }
    return StatusUpdater.instance;
  }

  updateStatus(message) {
    if (this.statusElement) {
      this.statusElement.textContent = message;
    }
  }
}

const instance = new StatusUpdater();
Object.freeze(instance);

export default instance;
