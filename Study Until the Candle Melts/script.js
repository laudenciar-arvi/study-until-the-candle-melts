
/* =========================================
   STUDY UNTIL THE CANDLE MELTS
   Candle-Only Version
========================================= */


/* =========================================
   1. TIMER SETTINGS
========================================= */

const SHORT_BREAK_TIME = 5 * 60;
const LONG_BREAK_TIME = 15 * 60;
const SESSIONS_BEFORE_LONG_BREAK = 4;

let startingTime = 25 * 60;
let timeRemaining = startingTime;
let timerInterval = null;

let timerMode = "study";
let completedSessions = 0;


/* =========================================
   2. HTML ELEMENTS
========================================= */

// Timer
const timerDisplay = document.getElementById("timer");
const favicon = document.getElementById("favicon");

// Timer controls
const startButton = document.getElementById("start-button");
const pauseButton = document.getElementById("pause-button");
const resetButton = document.getElementById("reset-button");

// Mode buttons
const studyModeButton = document.getElementById("study-mode-button");
const shortBreakButton = document.getElementById("short-break-button");
const longBreakButton = document.getElementById("long-break-button");

// Study duration buttons
const studySettings = document.getElementById("study-settings");

const quickButton = document.getElementById("quick-button");
const classicButton = document.getElementById("classic-button");
const deepButton = document.getElementById("deep-button");
const customButton = document.getElementById("custom-button");

// Candle elements
const candle = document.querySelector(".candle");
const flame = document.querySelector(".flame");

const dripOne = document.querySelector(".drip-one");
const dripTwo = document.querySelector(".drip-two");
const dripThree = document.querySelector(".drip-three");

const meltedWax = document.querySelector(".melted-wax");


/* =========================================
   3. TIMER DISPLAY
========================================= */

function updateTimer() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;

    const formattedTime =
        `${minutes}:${String(seconds).padStart(2, "0")}`;

    // Update the timer
    if (timerDisplay) {
        timerDisplay.textContent = formattedTime;
    }

    // Update the browser tab title
    document.title = `${formattedTime} — Study Until...`;

    // Update the interface
    updateModeAppearance();

    // Update candle progress during study
    if (timerMode === "study") {
        updateCandle();
    }
}


/* =========================================
   4. MODE APPEARANCE
========================================= */

function updateModeAppearance() {
    const isStudy = timerMode === "study";
    const isShortBreak = timerMode === "shortBreak";
    const isLongBreak = timerMode === "longBreak";

    document.body.classList.toggle("break-mode", !isStudy);
    document.body.classList.toggle("short-break", isShortBreak);
    document.body.classList.toggle("long-break", isLongBreak);

    // Show duration settings only during study
    if (studySettings) {
        studySettings.style.display = isStudy ? "block" : "none";
    }

    // Highlight the selected mode
    const activeButton = isStudy
        ? studyModeButton
        : isShortBreak
            ? shortBreakButton
            : longBreakButton;

    setActiveModeButton(activeButton);
}


function setActiveModeButton(activeButton) {
    document.querySelectorAll(".mode-button").forEach(button => {
        button.classList.toggle("active", button === activeButton);
    });
}


/* =========================================
   5. CANDLE MELTING ANIMATION
========================================= */

function updateCandle() {
    if (!candle || !flame || !meltedWax) {
        return;
    }

    // 1 = fresh candle; 0 = fully melted
    const progress = startingTime > 0
        ? Math.max(0, Math.min(1, timeRemaining / startingTime))
        : 0;

    // Candle becomes shorter over time
    const candleHeight = 20 + (120 * progress);
    candle.style.height = `${candleHeight}px`;

    // Flame gradually becomes smaller
    const flameHeight = 20 + (25 * progress);
    flame.style.height = `${flameHeight}px`;

    // Wax drips become more noticeable
    if (dripOne) {
        dripOne.style.height =
            `${8 + (25 * (1 - progress))}px`;
    }

    if (dripTwo) {
        dripTwo.style.height =
            `${6 + (18 * (1 - progress))}px`;
    }

    if (dripThree) {
        dripThree.style.height =
            `${4 + (12 * (1 - progress))}px`;
    }

    // Melted wax spreads across the surface
    const waxWidth = 60 + (50 * (1 - progress));
    const waxHeight = 8 + (10 * (1 - progress));

    meltedWax.style.width = `${waxWidth}px`;
    meltedWax.style.height = `${waxHeight}px`;
}


/* =========================================
   6. START AND STOP TIMER
========================================= */

function startTimer() {
    // Prevent duplicate intervals
    if (timerInterval !== null) {
        return;
    }

    // Do not start a completed timer
    if (timeRemaining <= 0) {
        return;
    }

    timerInterval = setInterval(() => {
        timeRemaining--;

        updateTimer();

        if (timeRemaining <= 0) {
            stopTimer();

            if (timerMode === "study") {
                finishStudySession();
            } else {
                finishBreak();
            }
        }
    }, 1000);
}


function stopTimer() {
    if (timerInterval !== null) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}


function pauseTimer() {
    stopTimer();
}


/* =========================================
   7. STUDY SESSION COMPLETION
========================================= */

function finishStudySession() {
    completedSessions++;

    // Every fourth completed session gets a long break
    if (completedSessions % SESSIONS_BEFORE_LONG_BREAK === 0) {
        timerMode = "longBreak";
        timeRemaining = LONG_BREAK_TIME;
    } else {
        timerMode = "shortBreak";
        timeRemaining = SHORT_BREAK_TIME;
    }

    // Display the selected break without starting it
    updateTimer();
}


/* =========================================
   8. BREAK COMPLETION
========================================= */

function finishBreak() {
    // Return to study mode after the break ends
    timerMode = "study";
    timeRemaining = startingTime;

    updateTimer();
}


/* =========================================
   9. RESET TIMER
========================================= */

function resetTimer() {
    stopTimer();

    // Reset the selected mode without changing it
    switch (timerMode) {
        case "study":
            timeRemaining = startingTime;
            break;

        case "shortBreak":
            timeRemaining = SHORT_BREAK_TIME;
            break;

        case "longBreak":
            timeRemaining = LONG_BREAK_TIME;
            break;
    }

    updateTimer();
}


/* =========================================
   10. STUDY DURATION
========================================= */

function setStudyTime(minutes) {
    if (!Number.isFinite(minutes) || minutes <= 0) {
        alert("Please enter a valid number of minutes.");
        return;
    }

    // Duration settings apply only to study mode
    if (timerMode !== "study") {
        return;
    }

    stopTimer();

    startingTime = Math.floor(minutes * 60);
    timeRemaining = startingTime;

    updateTimer();
}


/* =========================================
   11. MODE BUTTON EVENTS
========================================= */

if (studyModeButton) {
    studyModeButton.addEventListener("click", () => {
        stopTimer();

        timerMode = "study";
        timeRemaining = startingTime;

        updateTimer();
    });
}


if (shortBreakButton) {
    shortBreakButton.addEventListener("click", () => {
        stopTimer();

        timerMode = "shortBreak";
        timeRemaining = SHORT_BREAK_TIME;

        updateTimer();
    });
}


if (longBreakButton) {
    longBreakButton.addEventListener("click", () => {
        stopTimer();

        timerMode = "longBreak";
        timeRemaining = LONG_BREAK_TIME;

        updateTimer();
    });
}


/* =========================================
   12. TIMER BUTTON EVENTS
========================================= */

if (startButton) {
    startButton.addEventListener("click", startTimer);
}

if (pauseButton) {
    pauseButton.addEventListener("click", pauseTimer);
}

if (resetButton) {
    resetButton.addEventListener("click", resetTimer);
}


/* =========================================
   13. STUDY PRESET BUTTONS
========================================= */

if (quickButton) {
    quickButton.addEventListener("click", () => {
        setStudyTime(15);
    });
}


if (classicButton) {
    classicButton.addEventListener("click", () => {
        setStudyTime(25);
    });
}


if (deepButton) {
    deepButton.addEventListener("click", () => {
        setStudyTime(45);
    });
}


if (customButton) {
    customButton.addEventListener("click", () => {
        const input = prompt(
            "How many minutes would you like to study?"
        );

        // Cancel without changing the timer
        if (input === null || input.trim() === "") {
            return;
        }

        const minutes = Number(input);

        if (!Number.isFinite(minutes) || minutes <= 0) {
            alert("Please enter a valid number of minutes.");
            return;
        }

        setStudyTime(minutes);
    });
}


/* =========================================
   14. CANDLE FAVICON
========================================= */

function setCandleFavicon() {
    if (!favicon) {
        return;
    }

    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <text x="50%" y="75%"
                  text-anchor="middle"
                  font-size="80">🕯️</text>
        </svg>
    `;

    favicon.href =
        `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}


/* =========================================
   15. INITIALIZE THE APP
========================================= */

setCandleFavicon();
updateTimer();
