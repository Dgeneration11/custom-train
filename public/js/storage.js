const STORAGE_KEY = 'neon_pulse_history';

const Storage = {
    // Save a completed workout
    saveWorkout: (data) => {
        // data structure: { date: ISOString, sets: number, duration: string (e.g. "20m") }
        const history = Storage.getHistory();
        history.unshift(data); // Add new to top
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    },

    // Get all workouts
    getHistory: () => {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },

    // Get aggregated stats
    getStats: () => {
        const history = Storage.getHistory();
        const totalSessions = history.length;
        const totalSets = history.reduce((acc, curr) => acc + (curr.sets || 0), 0);

        return {
            totalSessions,
            totalSets
        };
    },

    // Clear history (optional dev utility)
    clear: () => {
        localStorage.removeItem(STORAGE_KEY);
    }
};

// Expose to window
if (typeof window !== 'undefined') {
    window.AppStorage = Storage;
}
