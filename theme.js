const ThemeManager = {
    init() {
        this.toggleBtn = document.getElementById('theme-toggle');
        if (!this.toggleBtn) return;

        this.sunIcon = this.toggleBtn.querySelector('.sun-icon');
        this.moonIcon = this.toggleBtn.querySelector('.moon-icon');
        this.body = document.body;

        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            this.setTheme('light');
        } else {
            this.setTheme('dark');
        }

        // Bind click
        this.toggleBtn.addEventListener('click', () => {
            const isLight = this.body.classList.contains('light-theme');
            this.setTheme(isLight ? 'dark' : 'light');
        });
    },

    setTheme(mode) {
        if (mode === 'light') {
            this.body.classList.add('light-theme');
            this.sunIcon.style.display = 'none';
            this.moonIcon.style.display = 'block';
            localStorage.setItem('theme', 'light');
        } else {
            this.body.classList.remove('light-theme');
            this.sunIcon.style.display = 'block';
            this.moonIcon.style.display = 'none';
            localStorage.setItem('theme', 'dark');
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
});
