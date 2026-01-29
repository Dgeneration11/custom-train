function drawCrosshair(canvas, config) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    // Pixel Snapping Center
    // For even width lines (2, 4), we want to be on pixel boundaries.
    // For odd width lines (1, 3), we want to be on half-pixels (0.5).
    // Canvas coords: (0,0) is top-left.
    const cx = Math.floor(w / 2);
    const cy = Math.floor(h / 2);

    ctx.clearRect(0, 0, w, h);

    const p = config.primary;
    const color = p.color;

    // Helper: Draw Rect aligned to center
    // x, y relative to center
    function drawRectLocal(rx, ry, rw, rh, fill, alpha, outline) {
        // Absolute coords
        // If thickness is even, snap to integer.
        // If odd, snap to .5?
        // Actually, let's just use raw coords.

        const ax = cx + rx;
        const ay = cy + ry;

        if (outline && p.outlineOpacity > 0) {
            const th = p.outlineThickness || 1;
            ctx.fillStyle = `rgba(0,0,0,${p.outlineOpacity})`;
            ctx.fillRect(ax - th, ay - th, rw + (th * 2), rh + (th * 2));
        }

        ctx.globalAlpha = alpha;
        ctx.fillStyle = fill;
        ctx.fillRect(ax, ay, rw, rh);
        ctx.globalAlpha = 1.0;
    }

    // 1. Center Dot
    if (p.centerDot.enabled) {
        const size = p.centerDot.thickness;
        const half = size / 2;
        // Draw at -half, -half relative to center
        drawRectLocal(-half, -half, size, size, color, p.centerDot.opacity, true);
    }

    // 2. Inner Lines
    if (p.innerLines.enabled) {
        drawLineSet(ctx, cx, cy, p.innerLines, color, p.outlines, p);
    }

    // 3. Outer Lines
    if (p.outerLines.enabled) {
        drawLineSet(ctx, cx, cy, p.outerLines, color, p.outlines, p);
    }
}

function drawLineSet(ctx, cx, cy, settings, color, hasOutlines, globalP) {
    const t = settings.thickness;
    const l = settings.length;
    const o = settings.offset;
    const a = settings.opacity;
    const halfT = t / 2;

    // Helper function with globalP access for outlines
    function dRect(rx, ry, rw, rh) {
        const ax = cx + rx;
        const ay = cy + ry;

        // Outlines
        // If global outline setting implies outlines are ON (outlineOpacity > 0)
        // Usually outlines are always drawn if outlineOpacity > 0.
        // Some configs have explicit 'h' for outlines?
        if (globalP.outlineOpacity > 0) {
            const oth = globalP.outlineThickness || 1;
            ctx.fillStyle = `rgba(0,0,0,${globalP.outlineOpacity})`;
            ctx.fillRect(ax - oth, ay - oth, rw + (oth * 2), rh + (oth * 2));
        }

        ctx.globalAlpha = a;
        ctx.fillStyle = color;
        ctx.fillRect(ax, ay, rw, rh);
        ctx.globalAlpha = 1.0;
    }

    // Top
    dRect(-halfT, -(o + l), t, l);
    // Bottom
    dRect(-halfT, o, t, l);
    // Left
    dRect(-(o + l), -halfT, l, t);
    // Right
    dRect(o, -halfT, l, t);
}
