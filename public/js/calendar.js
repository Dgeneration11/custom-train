class WorkoutCalendar {
    constructor(containerId, data, onDayClick) {
        this.container = document.getElementById(containerId);
        this.data = data; // Array of workout objects { date, sets }
        this.onDayClick = onDayClick; // Callback function
        this.today = new Date();
        this.currentMonth = this.today.getMonth();
        this.currentYear = this.today.getFullYear();
        this.selectedDate = null; // Track selected date string "YYYY-M-D"

        this.render();
    }

    getDaysInMonth(month, year) {
        return new Date(year, month + 1, 0).getDate();
    }

    getFirstDayOfMonth(month, year) {
        return new Date(year, month, 1).getDay();
    }

    // Aggregate sets per day for easier lookup
    processData() {
        const heatmap = {};
        this.data.forEach(item => {
            const date = new Date(item.date);
            const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
            if (!heatmap[key]) heatmap[key] = 0;
            heatmap[key] += item.sets || 0;
        });
        return heatmap;
    }

    render() {
        this.container.innerHTML = '';
        const heatmap = this.processData();
        const daysInMonth = this.getDaysInMonth(this.currentMonth, this.currentYear);
        const firstDay = this.getFirstDayOfMonth(this.currentMonth, this.currentYear);
        const monthName = new Date(this.currentYear, this.currentMonth).toLocaleString('default', { month: 'long' });

        // Header
        const header = document.createElement('div');
        header.className = 'calendar-header';
        header.innerHTML = `
            <h2>${monthName} ${this.currentYear}</h2>
            <div class="calendar-nav">
                <button id="prev-month">&lt;</button>
                <button id="next-month">&gt;</button>
            </div>
        `;
        this.container.appendChild(header);

        // Grid Container
        const grid = document.createElement('div');
        grid.className = 'calendar-grid';

        // Weekday Headers
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        weekdays.forEach(day => {
            const el = document.createElement('div');
            el.className = 'calendar-weekday';
            el.textContent = day;
            grid.appendChild(el);
        });

        // Empty Slots for previous month
        for (let i = 0; i < firstDay; i++) {
            const empty = document.createElement('div');
            empty.className = 'calendar-day empty';
            grid.appendChild(empty);
        }

        // Days
        for (let day = 1; day <= daysInMonth; day++) {
            const el = document.createElement('div');
            el.className = 'calendar-day';

            const key = `${this.currentYear}-${this.currentMonth}-${day}`;
            const sets = heatmap[key];

            // Content
            el.innerHTML = `<span class="day-number">${day}</span>`;

            if (sets) {
                el.classList.add('has-workout');
                // Optional: Intensity scaling
                // if (sets > 5) el.classList.add('high-intensity');

                const indicator = document.createElement('div');
                indicator.className = 'workout-indicator';
                indicator.textContent = `${sets} Sets`;
                el.appendChild(indicator);
            }

            // Check if today
            if (day === this.today.getDate() &&
                this.currentMonth === this.today.getMonth() &&
                this.currentYear === this.today.getFullYear()) {
                el.classList.add('is-today');
            }

            // Check if selected
            if (this.selectedDate === key) {
                el.classList.add('selected');
            }

            // Click Handler
            el.addEventListener('click', () => {
                this.selectedDate = key;
                this.render(); // Re-render to update selected styling
                if (this.onDayClick) {
                    // Pass specific date object for filtering
                    this.onDayClick(new Date(this.currentYear, this.currentMonth, day));
                }
            });

            grid.appendChild(el);
        }

        this.container.appendChild(grid);

        // Bind Events
        document.getElementById('prev-month').addEventListener('click', () => this.changeMonth(-1));
        document.getElementById('next-month').addEventListener('click', () => this.changeMonth(1));
    }

    changeMonth(delta) {
        this.currentMonth += delta;
        if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
        } else if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
        }
        this.render();
    }
}

// Init when page loads
document.addEventListener('DOMContentLoaded', () => {
    const history = window.AppStorage.getHistory();
    // Callback logic is moved to stats.html inline script to handle UI updates
    // new WorkoutCalendar('calendar-mount', history); 
});
