let timerCount = 0;
const timers = {};

// Load saved timers from localStorage
function loadTimers() {
	const savedTimers = JSON.parse(localStorage.getItem("timers")) || {};
	for (const [timerId, timerData] of Object.entries(savedTimers)) {
		createTimerElement(timerId, timerData.elapsed);
		timers[timerId] = { ...timerData, interval: null };
		if (timerData.isRunning) {
			startTimer(timerId);
		} else {
			updateTimerDisplay(timerId, timerData.elapsed);
		}
	}
}

// Save timers to localStorage
function saveTimers() {
	const timersToSave = {};
	for (const [timerId, timerData] of Object.entries(timers)) {
		timersToSave[timerId] = {
			elapsed: timerData.elapsed,
			isRunning: timerData.interval !== null,
		};
	}
	localStorage.setItem("timers", JSON.stringify(timersToSave));
}

// Create a new timer element
function createTimerElement(timerId, elapsed = 0) {
	const timerElement = document.createElement("div");
	timerElement.id = timerId;
	timerElement.className =
		"bg-gray-700 p-4 rounded-lg gap-2 flex flex-col justify-between items-center";

	const timerDisplay = document.createElement("span");
	timerDisplay.className = "text-white text-3xl font-semibold";
	timerDisplay.textContent = formatTime(elapsed);

	const timerControls = document.createElement("div");
	timerControls.className = "flex gap-2";

	const startButton = document.createElement("button");
	startButton.textContent = "Start";
	startButton.className =
		"bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600";
	startButton.addEventListener("click", () => startTimer(timerId));

	const pauseButton = document.createElement("button");
	pauseButton.textContent = "Pause";
	pauseButton.className =
		"bg-yellow-500 text-black py-1 px-3 rounded-md hover:bg-yellow-600";
	pauseButton.addEventListener("click", () => pauseTimer(timerId));

	const deleteButton = document.createElement("button");
	deleteButton.textContent = "Delete";
	deleteButton.className =
		"bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600";
	deleteButton.addEventListener("click", () => deleteTimer(timerId));

	timerControls.appendChild(startButton);
	timerControls.appendChild(pauseButton);
	timerControls.appendChild(deleteButton);

	timerElement.appendChild(timerDisplay);
	timerElement.appendChild(timerControls);

	document.getElementById("timers-container").appendChild(timerElement);
}

// Add a new timer
document.getElementById("add-timer").addEventListener("click", () => {
	timerCount++;
	const timerId = `timer-${timerCount}`;
	createTimerElement(timerId);
	timers[timerId] = { elapsed: 0, interval: null };
	saveTimers();
});

// Start a timer
function startTimer(timerId) {
	if (!timers[timerId]) return;

	if (!timers[timerId].interval) {
		timers[timerId].startTime = Date.now() - timers[timerId].elapsed;
		timers[timerId].interval = setInterval(() => {
			const currentTime = Date.now();
			const elapsedTime = currentTime - timers[timerId].startTime;
			timers[timerId].elapsed = elapsedTime;
			updateTimerDisplay(timerId, elapsedTime);
		}, 10);
		saveTimers();
	}
}

// Pause a timer
function pauseTimer(timerId) {
	if (timers[timerId] && timers[timerId].interval) {
		clearInterval(timers[timerId].interval);
		timers[timerId].interval = null;
		saveTimers();
	}
}

// Delete a timer
function deleteTimer(timerId) {
	pauseTimer(timerId);
	delete timers[timerId];
	document.getElementById(timerId).remove();
	saveTimers();
}

// Update the timer display
function updateTimerDisplay(timerId, elapsedTime) {
	const timerDisplay = document.querySelector(`#${timerId} span`);
	timerDisplay.textContent = formatTime(elapsedTime);
}

// Format time as HH:MM:SS
function formatTime(elapsedTime) {
	const hours = Math.floor(elapsedTime / 3600000);
	const minutes = Math.floor((elapsedTime % 3600000) / 60000);
	const seconds = Math.floor((elapsedTime % 60000) / 1000);
	const milliseconds = Math.floor((elapsedTime % 1000) / 10);

	return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
		2,
		"0"
	)}:${String(seconds).padStart(2, "0")}.${String(milliseconds).padStart(
		2,
		"0"
	)}`;
}

// Load timers when the page loads
window.addEventListener("load", loadTimers);
