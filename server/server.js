const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

// Path to data file
const DATA_FILE = path.join(__dirname, '../history.json');

// --- API Endpoints ---

// GET History
app.get('/api/history', (req, res) => {
    if (fs.existsSync(DATA_FILE)) {
        fs.readFile(DATA_FILE, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to read data' });
            }
            try {
                const history = JSON.parse(data);
                res.json(history);
            } catch (e) {
                res.json([]); // Return empty if file is corrupt or empty
            }
        });
    } else {
        res.json([]); // No file yet, return empty array
    }
});

// POST Save Workout (Append/Update)
app.post('/api/workout', (req, res) => {
    const newWorkout = req.body;

    // Read existing
    let history = [];
    if (fs.existsSync(DATA_FILE)) {
        try {
            const fileData = fs.readFileSync(DATA_FILE, 'utf8');
            history = JSON.parse(fileData);
        } catch (e) {
            console.error("Error parsing existing history", e);
            history = [];
        }
    }

    // Add new (unshift to keep newest first)
    history.unshift(newWorkout);

    // Write back
    fs.writeFile(DATA_FILE, JSON.stringify(history, null, 2), (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to save data' });
        }
        res.json({ success: true, count: history.length });
    });
});

// Default route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
