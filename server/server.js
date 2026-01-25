const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

// Default route to serve index.html for SPA-like behavior, or just rely on static
// For Express 5, use regex or simple static serving. 
// Since we have multiple HTML files, let's just let static middleware handle specific files
// and default to index.html for root.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
