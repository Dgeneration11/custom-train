const QUOTES = [
    { text: "The only bad workout is the one that didn't happen.", author: "Unknown" },
    { text: "Don't stop when you're tired. Stop when you're done.", author: "David Goggins" },
    { text: "Your body can stand almost anything. It's your mind that you have to convince.", author: "Andrew Murphy" },
    { text: "We are what we repeatedly do. Excellence then is not an act but a habit.", author: "Aristotle" },
    { text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau" },
    { text: "Pain is weakness leaving the body.", author: "Chesty Puller" },
    { text: "Discipline is doing what needs to be done, even if you don't want to do it.", author: "Unknown" },
    { text: "Light weight baby!", author: "Ronnie Coleman" }
];

// Exposure for usage in index.html
if (typeof window !== 'undefined') {
    window.TRAINING_QUOTES = QUOTES;
}
