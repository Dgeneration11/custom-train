/**
 * Parses a Valorant crosshair code string into a configuration object.
 */
function parseCrosshairCode(code) {
    if (!code) return null;

    // Default Configuration
    const config = {
        primary: {
            color: '#ffffff', // Default White if unspecified
            outlines: false,  // Default Off (0) unless specified
            outlineOpacity: 1,
            outlineThickness: 1,
            centerDot: { enabled: false, opacity: 1, thickness: 2 },
            innerLines: { enabled: false, opacity: 0.8, length: 6, thickness: 2, offset: 3 },
            outerLines: { enabled: false, opacity: 0.35, length: 2, thickness: 2, offset: 10 }
        }
    };

    const parts = code.split(';');
    // Simple state machine
    let currentSection = 'general'; // general, primary, ads, sniper

    for (let i = 0; i < parts.length; i++) {
        const key = parts[i];

        // Section Switching Keys
        if (key === 'P') { currentSection = 'primary'; continue; }
        if (key === 'A') { currentSection = 'ads'; continue; }
        if (key === 'S') { currentSection = 'sniper'; continue; }

        // We only care about Primary or Global settings that affect Primary
        // (Some codes put color 'c' before 'P')
        if (currentSection !== 'primary' && currentSection !== 'general') continue;

        // Value usually follows key
        const val = parts[i + 1];
        if (val === undefined) break;

        // --- COLORS ---
        if (key === 'c') {
            const colors = ['#ffffff', '#00ff00', '#7ffff0', '#00ff00', '#ffff00', '#00ffff', '#ff00ff', '#ff0000'];
            // Valorant index 0 is white.
            config.primary.color = colors[parseInt(val)] || '#ffffff';
            i++; continue;
        }
        if (key === 'u') {
            // Custom Hex: RRGGBB or RRGGBBAA
            config.primary.color = '#' + val.substring(0, 6);
            i++; continue;
        }

        // --- OUTLINES ---
        if (key === 'h') { config.primary.outlines = (val === '1'); i++; continue; } // 'h' often incorrectly cited, but 'o' is opacity. 
        // Standard code: If 'o' is present and >0, outlines are visible? 
        // Some codes imply 'h' is 'Hide Lines'? No.
        // Let's assume if 'o' > 0, we draw outlines. Or look for 'b' ?
        // Usually, 'o' is Outline Opacity.

        if (key === 'o') { config.primary.outlineOpacity = parseFloat(val); i++; continue; }
        if (key === 't') { config.primary.outlineThickness = parseFloat(val); i++; continue; }

        // --- CENTER DOT ---
        if (key === 'd') { config.primary.centerDot.enabled = (val === '1'); i++; continue; }
        if (key === 'z') { config.primary.centerDot.thickness = parseFloat(val); i++; continue; }
        if (key === 'a') { config.primary.centerDot.opacity = parseFloat(val); i++; continue; }

        // --- INNER LINES (0) ---
        if (key === '0b') { config.primary.innerLines.enabled = (val === '1'); i++; continue; }
        if (key === '0t') { config.primary.innerLines.thickness = parseFloat(val); config.primary.innerLines.enabled = true; i++; continue; }
        if (key === '0l') { config.primary.innerLines.length = parseFloat(val); config.primary.innerLines.enabled = true; i++; continue; }
        if (key === '0o') { config.primary.innerLines.offset = parseFloat(val); config.primary.innerLines.enabled = true; i++; continue; }
        if (key === '0a') { config.primary.innerLines.opacity = parseFloat(val); config.primary.innerLines.enabled = true; i++; continue; }

        // --- OUTER LINES (1) ---
        if (key === '1b') { config.primary.outerLines.enabled = (val === '1'); i++; continue; }
        if (key === '1t') { config.primary.outerLines.thickness = parseFloat(val); config.primary.outerLines.enabled = true; i++; continue; }
        if (key === '1l') { config.primary.outerLines.length = parseFloat(val); config.primary.outerLines.enabled = true; i++; continue; }
        if (key === '1o') { config.primary.outerLines.offset = parseFloat(val); config.primary.outerLines.enabled = true; i++; continue; }
        if (key === '1a') { config.primary.outerLines.opacity = parseFloat(val); config.primary.outerLines.enabled = true; i++; continue; }

        // Explicit 'b' keys often explicitly enable/disable sets
        // If '0b' is '0', disable inner lines even if we parsed length
    }

    // Post-Process Logic
    // If opacity is 0 or length is 0, disable the line set visual
    if (config.primary.innerLines.opacity === 0 || config.primary.innerLines.length === 0) config.primary.innerLines.enabled = false;
    if (config.primary.outerLines.opacity === 0 || config.primary.outerLines.length === 0) config.primary.outerLines.enabled = false;

    return config;
}
