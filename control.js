document.addEventListener("DOMContentLoaded", function () {
  // Select buttons and script area
  const startStopButton = document.getElementById("start-stop-button");
  const pauseButton = document.getElementById("pause-button");
  const scriptArea = document.getElementById("script-area");

  // Button State
  let isRecording = false;

  // Helper function to append logs (no timestamp)
  function appendLog(message) {
    scriptArea.value += message + "\n";
    scriptArea.scrollTop = scriptArea.scrollHeight; // Auto-scroll to the bottom
  }

  // Example: Log initial content
  appendLog("Script initialized.");

  // Handle Start/Stop Button
  startStopButton.addEventListener("click", () => {
    isRecording = !isRecording;

    if (isRecording) {
      startStopButton.textContent = "Stop";
      startStopButton.classList.remove("start");
      startStopButton.classList.add("stop");
      pauseButton.disabled = false; // Enable pause button when recording starts
      appendLog("Recording started.");
    } else {
      startStopButton.textContent = "Start";
      startStopButton.classList.remove("stop");
      startStopButton.classList.add("start");
      pauseButton.disabled = true; // Disable pause button when recording stops
      appendLog("Recording stopped.");
    }
  });

  // Handle Pause Button
  pauseButton.addEventListener("click", () => {
    appendLog("Recording paused (functionality to be added).");
  });
});
