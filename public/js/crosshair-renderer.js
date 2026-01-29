document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.crosshairs-grid');
    if (!grid) return;

    // Clear existing content
    grid.innerHTML = '';

    crosshairs.forEach(crosshair => {
        const card = document.createElement('div');
        card.className = 'tool-card crosshair-card';

        // Parse Code
        const config = parseCrosshairCode(crosshair.code);

        // Container structure
        const previewContainer = document.createElement('div');
        previewContainer.className = 'crosshair-preview';

        // Canvas
        const canvas = document.createElement('canvas');
        canvas.width = 150;
        canvas.height = 150;
        canvas.className = 'crosshair-canvas';

        previewContainer.appendChild(canvas);

        card.innerHTML = `
            <div class="tool-title">${crosshair.name}</div>
            <div class="code-snippet">${crosshair.code}</div>
            <button class="btn btn-secondary btn-sm copy-btn" onclick="copyCode(this)">COPY CODE</button>
        `;

        // Prepend preview
        card.insertBefore(previewContainer, card.firstChild);
        grid.appendChild(card);

        // Draw
        if (config) {
            drawCrosshair(canvas, config);
        }
    });
});

// Copy Functionality (Global)
function copyCode(btn) {
    const card = btn.closest('.tool-card');
    const code = card.querySelector('.code-snippet').textContent;
    navigator.clipboard.writeText(code).then(() => {
        const originalText = btn.textContent;
        btn.textContent = 'COPIED!';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    });
}
