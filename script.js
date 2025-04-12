// Global Variables
let systemOn = false;
let drying = false;
let tempThreshold = 40;
let humidityThreshold = 50;
let startTime = null;
let timerInterval = null;
let timeInterval = null;
let dryingDuration = null; 

console.log("Script loaded");

// Start the App
function startApp() {
  console.log("Get Started button clicked");
  document.getElementById("intro").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");
  updateTime();
}

// Toggle System ON/OFF
function toggleSystem(state) {
  systemOn = state;
  document.getElementById("status").textContent = state ? "ON" : "OFF";

  // Show or hide the drying controls based on the system state
  const dryingControls = document.getElementById("drying-controls");
  if (state) {
    dryingControls.classList.remove("hidden"); // Show drying controls
    document.getElementById("notification").textContent = "✅ System is ON.";
  } else {
    dryingControls.classList.add("hidden"); // Hide drying controls
    drying = false; // Reset drying state
    document.getElementById("notification").textContent = "🛑 System is OFF.";
    document.getElementById("drying-status").textContent = "STOPPED";
    clearInterval(timerInterval); // Stop the timer if running
    document.getElementById("timer").textContent = "--:--:--";
  }
}


// Play Notification Sound
function playNotificationSound() {
  const notificationSound = document.getElementById("notificationSound");
  if (notificationSound) {
    notificationSound.currentTime = 0; // Reset to the beginning
    notificationSound.play().catch((error) => {
      console.error("Notification sound failed to play:", error);
    });
  }
}

// Play Alert Sound
function playAlertSound() {
  const alertSound = document.getElementById("alertSound");
  if (alertSound) {
    alertSound.currentTime = 0; // Reset to the beginning
    alertSound.play().catch((error) => {
      console.error("Alert sound failed to play:", error);
    });
  }
}

// Play Notification Sound ➜ Then Alert Sound
function playCompletionSounds() {
  const notificationSound = document.getElementById("notificationSound");
  const alertSound = document.getElementById("alertSound");

  if (notificationSound && alertSound) {
    console.log("Playing notification sound first...");

    // Reset sounds to the beginning
    notificationSound.currentTime = 0;
    alertSound.currentTime = 0;

    // Play notification sound first
    notificationSound.play().then(() => {
      notificationSound.onended = () => {
        console.log("Notification sound ended. Playing alert sound...");
        alertSound.play().catch((error) => {
          console.error("Alert sound failed to play:", error);
        });
      };
    }).catch((error) => {
      console.error("Notification sound failed to play:", error);
    });
  } else {
    console.error("One or both audio elements not found.");
  }
}

  
// Start Drying
function startDrying() {
  const hours = parseInt(document.getElementById("hoursInput").value);
  const minutes = parseInt(document.getElementById("minutesInput").value);
 
  if (isNaN(hours) || isNaN(minutes)) {
    document.getElementById("notification").textContent = "⚠ Please enter valid hours and minutes!";
    return;
  }

  dryingDuration = (hours * 60 + minutes) * 60 * 1000; // Convert hours and minutes to milliseconds

  if (systemOn) {
    drying = true;
    startTime = new Date();
    document.getElementById("notification").textContent = "Drying Started...";
    document.getElementById("start-time").textContent = formatTime(startTime);
    document.getElementById("drying-status").textContent = "RUNNING";
   
    playNotificationSound(); // Play notification sound

    timerInterval = setInterval(updateTimer, 1000);

    // Automatically stop drying after the set duration
    setTimeout(() => {
      if (drying) {
        stopDrying(); // Stop drying when the timer finishes
        document.getElementById("notification").textContent = "✅ Drying Complete!";
        playCompletionSounds(); 
      }
    }, dryingDuration);
  } else {
    document.getElementById("notification").textContent =
      "⚠ Turn on the system first!";
  }
}

// Stop Drying
function stopDrying() {
  if (systemOn && drying) {
    drying = false;
    document.getElementById("notification").textContent = "Drying Stopped.";
    document.getElementById("stop-time").textContent = formatTime(new Date());
    document.getElementById("drying-status").textContent = "STOPPED";
    clearInterval(timerInterval);

    
    playNotificationSound(); // Play notification sound
  } else {
    document.getElementById("notification").textContent =
      "⚠ Drying is not running!";
  }
}

// Set Thresholds
function setThresholds() {
  const tempInput = parseInt(document.getElementById("tempInput").value);
  const humidityInput = parseInt(document.getElementById("humidityInput").value);

  if (isNaN(tempInput) || isNaN(humidityInput)) {
    document.getElementById("notification").textContent =
      "⚠ Please enter valid numbers for thresholds!";
      playAlertSound(); 
    return;
  }

  tempThreshold = tempInput;
  humidityThreshold = humidityInput;
  document.getElementById("notification").textContent =
    "✅ Thresholds updated successfully!";
}

// Update Time
function updateTime() {
  if (timeInterval) {
    clearInterval(timeInterval);
  }
  timeInterval = setInterval(() => {
    document.getElementById("current-time").textContent = formatTime(
      new Date()
    );
  }, 1000);
}

// Update Timer
function updateTimer() {
  let elapsed = Math.floor((new Date() - startTime) / 1000);
  document.getElementById("timer").textContent = new Date(elapsed * 1000)
    .toISOString()
    .substr(11, 8);
}

// Format Time
function formatTime(date) {
  return date.toLocaleTimeString();
}

// Volume Control
function updateVolume() {
  const volume = document.getElementById("volumeControl").value;
  const notificationSound = document.getElementById("notificationSound");
  const alertSound = document.getElementById("alertSound");
 
 
 
  if (notificationSound) {
    notificationSound.volume = volume / 100; // Set volume (0 to 1)
  }
  if (alertSound) {
    alertSound.volume = volume / 100; // Set volume (0 to 1)
  }
  console.log(`Volume set to: ${volume}%`); 
  
} alertSound.volume = volume / 100; // Set volume (0 to 1)
