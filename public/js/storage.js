const Storage = {
    // Save a completed workout
    saveWorkout: async (data) => {
        try {
            const response = await fetch('/api/workout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (err) {
            console.error("Failed to save workout:", err);
            // Fallback? or just log
        }
    },

    // Get all workouts
    getHistory: async () => {
        try {
            const response = await fetch('/api/history');
            if (response.ok) {
                return await response.json();
            }
            return [];
        } catch (err) {
            console.error("Failed to fetch history:", err);
            return [];
        }
    },

    // Get aggregated stats
    getStats: async () => {
        const history = await Storage.getHistory();
        const totalSessions = history.length;
        const totalSets = history.reduce((acc, curr) => acc + (curr.sets || 0), 0);

        return {
            totalSessions,
            totalSets
        };
    }
};

// Expose to window
if (typeof window !== 'undefined') {
    window.AppStorage = Storage;
}
