/**
 * Theme Configuration Module
 * Enhanced color palettes and styling for the CLI
 */

import chalk from 'chalk';

// ═══════════════════════════════════════════════════════════════════════════
// ICON SETS
// ═══════════════════════════════════════════════════════════════════════════

export const icons = {
    success: '✓',
    error: '✗',
    warning: '⚠',
    info: 'ℹ',
    arrow: '➜',
    arrowRight: '→',
    arrowDown: '↓',
    bullet: '•',
    star: '★',
    lightning: '⚡',
    gear: '⚙',
    folder: '📁',
    file: '📄',
    clock: '⏱',
    check: '✔',
    cross: '✘',
    heart: '❤',
    sparkle: '✨',
    fire: '🔥',
    rocket: '🚀',
    pin: '📌',
    tag: '🏷',
    link: '🔗',
    lock: '🔒',
    unlock: '🔓',
    key: '🔑',
    search: '🔍',
    prompt: '❯',
    dot: '●',
    circle: '○',
    square: '■',
    diamond: '◆',
    triangleRight: '▶',
    triangleDown: '▼',
};

// ═══════════════════════════════════════════════════════════════════════════
// BORDER CHARACTERS
// ═══════════════════════════════════════════════════════════════════════════

export const borders = {
    double: {
        topLeft: '╔',
        topRight: '╗',
        bottomLeft: '╚',
        bottomRight: '╝',
        horizontal: '═',
        vertical: '║',
        cross: '╬',
        leftT: '╠',
        rightT: '╣',
        topT: '╦',
        bottomT: '╩',
    },
    single: {
        topLeft: '┌',
        topRight: '┐',
        bottomLeft: '└',
        bottomRight: '┘',
        horizontal: '─',
        vertical: '│',
        cross: '┼',
        leftT: '├',
        rightT: '┤',
        topT: '┬',
        bottomT: '┴',
    },
    rounded: {
        topLeft: '╭',
        topRight: '╮',
        bottomLeft: '╰',
        bottomRight: '╯',
        horizontal: '─',
        vertical: '│',
        cross: '┼',
        leftT: '├',
        rightT: '┤',
        topT: '┬',
        bottomT: '┴',
    },
    heavy: {
        topLeft: '┏',
        topRight: '┓',
        bottomLeft: '┗',
        bottomRight: '┛',
        horizontal: '━',
        vertical: '┃',
        cross: '╋',
        leftT: '┣',
        rightT: '┫',
        topT: '┳',
        bottomT: '┻',
    },
};

// ═══════════════════════════════════════════════════════════════════════════
// COLOR THEMES
// ═══════════════════════════════════════════════════════════════════════════

const themes = {
    cyberpunk: {
        name: 'Cyberpunk',
        primary: '#FF00FF',      // Magenta
        secondary: '#00FFFF',    // Cyan
        accent: '#FFFF00',       // Yellow
        success: '#00FF00',      // Green
        error: '#FF0000',        // Red
        warning: '#FFA500',      // Orange
        info: '#00BFFF',         // Deep Sky Blue
        muted: '#808080',        // Gray
        text: '#FFFFFF',         // White
        gradient: ['#FF00FF', '#00FFFF', '#FF00FF'],
    },
    ocean: {
        name: 'Ocean',
        primary: '#0077B6',      // Blue
        secondary: '#00B4D8',    // Light Blue
        accent: '#90E0EF',       // Sky Blue
        success: '#2E8B57',      // Sea Green
        error: '#CD5C5C',        // Indian Red
        warning: '#F4A460',      // Sandy Brown
        info: '#87CEEB',         // Sky Blue
        muted: '#708090',        // Slate Gray
        text: '#E0FFFF',         // Light Cyan
        gradient: ['#0077B6', '#00B4D8', '#90E0EF'],
    },
    forest: {
        name: 'Forest',
        primary: '#228B22',      // Forest Green
        secondary: '#32CD32',    // Lime Green
        accent: '#9ACD32',       // Yellow Green
        success: '#00FF7F',      // Spring Green
        error: '#DC143C',        // Crimson
        warning: '#DAA520',      // Goldenrod
        info: '#98FB98',         // Pale Green
        muted: '#6B8E23',        // Olive Drab
        text: '#F0FFF0',         // Honeydew
        gradient: ['#228B22', '#32CD32', '#9ACD32'],
    },
    sunset: {
        name: 'Sunset',
        primary: '#FF6B6B',      // Light Coral
        secondary: '#FFE66D',    // Light Yellow
        accent: '#FF8E53',       // Mango
        success: '#4CAF50',      // Green
        error: '#F44336',        // Red
        warning: '#FF9800',      // Orange
        info: '#FFC107',         // Amber
        muted: '#9E9E9E',        // Gray
        text: '#FFFAF0',         // Floral White
        gradient: ['#FF6B6B', '#FF8E53', '#FFE66D'],
    },
    pastel: {
        name: 'Pastel',
        primary: '#A7B2E2',      // Pastel Blue
        secondary: '#D4B2E2',    // Pastel Purple
        accent: '#E2D4B2',       // Pastel Yellow
        success: '#B2E2B2',      // Pastel Green
        error: '#E2B2B2',        // Pastel Red
        warning: '#E2D4B2',      // Pastel Orange
        info: '#A7D8E2',         // Pastel Cyan
        muted: '#C0C0C0',        // Light Gray
        text: '#FFFFFF',         // White
        gradient: ['#A7B2E2', '#D4B2E2', '#E2B2D4'],
    },
    neon: {
        name: 'Neon',
        primary: '#39FF14',      // Neon Green
        secondary: '#FF1493',    // Deep Pink
        accent: '#00FFFF',       // Cyan
        success: '#39FF14',      // Neon Green
        error: '#FF073A',        // Neon Red
        warning: '#FFFF00',      // Yellow
        info: '#1B03A3',         // Neon Blue
        muted: '#4A4A4A',        // Dark Gray
        text: '#FFFFFF',         // White
        gradient: ['#39FF14', '#00FFFF', '#FF1493'],
    },
};

// Default theme
let currentTheme = 'pastel';

// ═══════════════════════════════════════════════════════════════════════════
// THEME FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get the current theme object
 */
export function getTheme() {
    return themes[currentTheme];
}

/**
 * Get the current theme name
 */
export function getThemeName() {
    return currentTheme;
}

/**
 * Set the current theme
 */
export function setTheme(themeName) {
    if (themes[themeName]) {
        currentTheme = themeName;
        return true;
    }
    return false;
}

/**
 * Get available theme names
 */
export function getAvailableThemes() {
    return Object.keys(themes);
}

/**
 * Create themed chalk functions
 */
export function createThemedChalk() {
    const t = getTheme();
    return {
        primary: chalk.hex(t.primary),
        secondary: chalk.hex(t.secondary),
        accent: chalk.hex(t.accent),
        success: chalk.hex(t.success),
        error: chalk.hex(t.error),
        warning: chalk.hex(t.warning),
        info: chalk.hex(t.info),
        muted: chalk.hex(t.muted),
        text: chalk.hex(t.text),
        bold: {
            primary: chalk.bold.hex(t.primary),
            secondary: chalk.bold.hex(t.secondary),
            accent: chalk.bold.hex(t.accent),
            success: chalk.bold.hex(t.success),
            error: chalk.bold.hex(t.error),
            warning: chalk.bold.hex(t.warning),
            info: chalk.bold.hex(t.info),
            text: chalk.bold.hex(t.text),
            muted: chalk.bold.hex(t.muted),
        },
        dim: {
            primary: chalk.dim.hex(t.primary),
            secondary: chalk.dim.hex(t.secondary),
            muted: chalk.dim.hex(t.muted),
        },
    };
}

export default {
    icons,
    borders,
    themes,
    getTheme,
    getThemeName,
    setTheme,
    getAvailableThemes,
    createThemedChalk,
};
