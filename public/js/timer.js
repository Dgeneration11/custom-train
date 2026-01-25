class WorkoutTimer {
    constructor() {
        // Configuration
        this.workTime = 60; // seconds
        this.restTime = 10; // seconds
        this.currentPhaseDuration = this.workTime;

        // Timer State
        this.isWorkPhase = true;
        this.isRunning = false;
        this.setsCompleted = 0;

        // Animation / Timing State
        this.startTime = 0;       // Timestamp when phase started/resumed
        this.elapsedTime = 0;     // Time passed in this phase (ms)
        this.animationFrame = null;

        // DOM Elements
        this.timeDisplay = document.getElementById('time-display');
        this.statusLabel = document.getElementById('status-label');
        this.cycleLabel = document.getElementById('cycle-label');
        this.startBtn = document.getElementById('start-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.finishBtn = document.getElementById('finish-btn');
        this.progressRing = document.querySelector('.progress-ring__circle');
        this.body = document.body;

        // Theme Elements
        this.themeToggleBtn = document.getElementById('theme-toggle');
        this.sunIcon = this.themeToggleBtn.querySelector('.sun-icon');
        this.moonIcon = this.themeToggleBtn.querySelector('.moon-icon');

        // Inputs
        this.workMinInput = document.getElementById('work-min');
        this.workSecInput = document.getElementById('work-sec');
        this.restMinInput = document.getElementById('rest-min');
        this.restSecInput = document.getElementById('rest-sec');

        // Ring Calculation
        this.radius = 140; // Hardcoded from SVG r="140"
        this.circumference = this.radius * 2 * Math.PI;

        // Constants (for easy reference if needed in comments)
        // Work Color: #0066ff (Blue)
        // Rest Color: #00ff00 (Green)

        this.init();
    }

    init() {
        // Setup Progress Ring
        this.progressRing.style.strokeDasharray = `${this.circumference} ${this.circumference}`;
        this.progressRing.style.strokeDashoffset = 0;

        // Event Listeners
        this.startBtn.addEventListener('click', () => this.toggleTimer());
        this.resetBtn.addEventListener('click', () => this.resetTimer());
        this.finishBtn.addEventListener('click', () => this.finishWorkout());
        this.finishBtn.addEventListener('click', () => this.finishWorkout());
        // this.themeToggleBtn.addEventListener('click', () => this.toggleTheme()); // Handled by theme.js

        ['change', 'input'].forEach(evt => {
            this.workMinInput.addEventListener(evt, () => this.updateSettings());
            this.workSecInput.addEventListener(evt, () => this.updateSettings());
            this.restMinInput.addEventListener(evt, () => this.updateSettings());
            this.restSecInput.addEventListener(evt, () => this.updateSettings());
        });

        // this.updateSettings(); // Removed redundant call
        // this.updateDisplay(0); // Removed redundant call

        // Call resetTimer to ensure correct initial state (Green READY text)
        this.resetTimer();
    }

    // Theme toggling is handled globally by theme.js
    toggleTheme() {
        // Deprecated
    }

    updateSettings() {
        if (this.isRunning) return;

        const workMin = parseInt(this.workMinInput.value) || 0;
        const workSec = parseInt(this.workSecInput.value) || 0;
        const restMin = parseInt(this.restMinInput.value) || 0;
        const restSec = parseInt(this.restSecInput.value) || 0;

        this.workTime = (workMin * 60) + workSec;
        this.restTime = (restMin * 60) + restSec;

        if (this.workTime < 1) this.workTime = 1;
        if (this.restTime < 1) this.restTime = 1;

        // If stopped, update current phase duration immediately
        if (!this.isRunning) {
            this.currentPhaseDuration = this.isWorkPhase ? this.workTime : this.restTime;
            this.elapsedTime = 0;
            this.updateDisplay(0);
        }
    }

    toggleTimer() {
        if (this.isRunning) {
            this.pause();
        } else {
            this.start();
        }
    }

    start() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.startBtn.textContent = 'PAUSE';
        this.finishBtn.style.display = 'none'; // Hide finish while running

        this.startTime = performance.now() - this.elapsedTime;

        this.animationFrame = requestAnimationFrame(() => this.tick());
    }

    pause() {
        this.isRunning = false;
        this.startBtn.textContent = 'RESUME';

        // Show finish button if we have done at least some work or if paused?
        // Let's show it if we are paused, so user can decide they are done.
        this.finishBtn.style.display = 'block';

        cancelAnimationFrame(this.animationFrame);
    }

    resetTimer() {
        this.pause();
        this.isWorkPhase = true;
        this.setsCompleted = 0;
        this.elapsedTime = 0;
        this.finishBtn.style.display = 'none';

        this.updateSettings();
        this.currentPhaseDuration = this.workTime;

        // Reset Visuals
        this.body.classList.remove('state-rest');
        this.statusLabel.classList.remove('status-ready'); // Clean up just in case

        // Actually, for READY state, we might want a specific class on statusLabel or body
        this.statusLabel.classList.add('status-ready');
        this.body.classList.add('state-work'); // Default bg
        this.statusLabel.textContent = 'READY';
        this.startBtn.textContent = 'START';

        this.updateDisplay(0);
    }

    finishWorkout() {
        if (this.setsCompleted === 0 && this.elapsedTime === 0) {
            alert("No workout to save!");
            return;
        }

        const date = new Date().toISOString();
        // Calculate total duration roughly or just log sets
        // For now, let's just log "X Sets Completed"

        if (window.AppStorage) {
            this.finishBtn.disabled = true; // Prevent double click
            this.finishBtn.textContent = 'Saving...';

            window.AppStorage.saveWorkout({
                date: date,
                sets: this.setsCompleted,
                duration: `${this.setsCompleted} sets` // Simple duration for now
            }).then(() => {
                alert(`Workout Saved! ${this.setsCompleted} sets completed.`);
                this.finishBtn.disabled = false;
                this.finishBtn.textContent = 'FINISH & SAVE WORKOUT';
                this.resetTimer();
            }).catch(err => {
                console.error("Save failed", err);
                alert("Failed to save workout. Check console.");
                this.finishBtn.disabled = false;
                this.finishBtn.textContent = 'FINISH & SAVE WORKOUT';
            });
        } else {
            console.error("Storage module not found");
        }
    }

    tick() {
        if (!this.isRunning) return;

        const now = performance.now();
        this.elapsedTime = now - this.startTime;
        const totalDurationMs = this.currentPhaseDuration * 1000;

        if (this.elapsedTime >= totalDurationMs) {
            this.switchPhase();
            return;
        }

        this.updateDisplay(this.elapsedTime);
        this.animationFrame = requestAnimationFrame(() => this.tick());
    }

    switchPhase() {
        if (this.isWorkPhase) {
            // Work finished -> Switch to Rest
            // Set is "Completed" after the work phase is done
            this.setsCompleted++;

            this.isWorkPhase = false;
            this.currentPhaseDuration = this.restTime;
            this.body.classList.remove('state-work');
            this.body.classList.add('state-rest');
            this.statusLabel.textContent = 'REST';
        } else {
            // Rest finished -> Switch back to Work
            this.isWorkPhase = true;
            this.currentPhaseDuration = this.workTime;
            this.body.classList.remove('state-rest');
            this.body.classList.add('state-work');
            this.statusLabel.textContent = 'WORK';
        }

        // Reset timing for new phase
        this.elapsedTime = 0;
        this.startTime = performance.now();
        this.updateDisplay(0);

        // Continue loop
        this.animationFrame = requestAnimationFrame(() => this.tick());
    }

    updateDisplay(elapsedMs) {
        const totalMs = this.currentPhaseDuration * 1000;
        const remainingMs = Math.max(0, totalMs - elapsedMs);
        const remainingSecs = Math.ceil(remainingMs / 1000);

        // Format Time
        const m = Math.floor(remainingSecs / 60);
        const s = remainingSecs % 60;
        this.timeDisplay.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;

        // Update Sets Label
        this.cycleLabel.textContent = `SETS COMPLETED: ${this.setsCompleted}`;

        // Dynamic Status Label updates if running
        if (this.isRunning && this.statusLabel.textContent === 'READY') {
            this.statusLabel.textContent = 'WORK';
            this.statusLabel.classList.remove('status-ready');
        }

        // Progress Ring Smooth
        const ratio = totalMs > 0 ? remainingMs / totalMs : 0;
        const offset = this.circumference - (ratio * this.circumference);
        this.progressRing.style.strokeDashoffset = offset;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const timer = new WorkoutTimer();
});
