/**
 * UI Utilities Module
 * Beautiful box drawing, tables, and visual components for the CLI
 */

import chalk from 'chalk';
import stringWidth from 'string-width';
import { borders, icons, createThemedChalk, getTheme } from './theme.js';

// ═══════════════════════════════════════════════════════════════════════════
// STRING UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get visual width of string (accounting for emojis and special chars)
 * Uses string-width package for accurate width calculation
 */
function getStringWidth(str) {
    // Remove ANSI codes and use string-width for accurate calculation
    return stringWidth(str);
}


/**
 * Pad string to exact width
 */
function padToWidth(str, width, align = 'left') {
    const currentWidth = getStringWidth(str);
    const padding = Math.max(0, width - currentWidth);

    if (align === 'center') {
        const leftPad = Math.floor(padding / 2);
        const rightPad = padding - leftPad;
        return ' '.repeat(leftPad) + str + ' '.repeat(rightPad);
    } else if (align === 'right') {
        return ' '.repeat(padding) + str;
    }
    return str + ' '.repeat(padding);
}

// ═══════════════════════════════════════════════════════════════════════════
// BOX DRAWING
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Create a beautiful box around content
 * @param {string|string[]} content - Content to box (string or array of lines)
 * @param {Object} options - Box options
 */
export function createBox(content, options = {}) {
    const {
        title = '',
        borderStyle = 'rounded',
        padding = 1,
        width = null,
        titleAlign = 'left',
        borderColor = null,
        titleColor = null,
    } = options;

    const tc = createThemedChalk();
    const border = borders[borderStyle] || borders.rounded;
    const colorFn = borderColor ? chalk.hex(borderColor) : tc.primary;
    const titleFn = titleColor ? chalk.hex(titleColor) : tc.accent;

    // Convert content to array of lines
    const lines = Array.isArray(content) ? content : content.split('\n');

    // Calculate max width
    const contentWidths = lines.map(line => getStringWidth(line));
    const maxContentWidth = Math.max(...contentWidths, getStringWidth(title));
    const boxWidth = width || maxContentWidth + (padding * 2);
    const innerWidth = boxWidth;

    const result = [];

    // Top border with optional title
    let topLine = border.horizontal.repeat(innerWidth + 2);
    if (title) {
        const titleText = ` ${title} `;
        const titleWidth = getStringWidth(titleText);
        if (titleAlign === 'center') {
            const leftLen = Math.floor((innerWidth + 2 - titleWidth) / 2);
            const rightLen = innerWidth + 2 - titleWidth - leftLen;
            topLine = border.horizontal.repeat(leftLen) + titleFn(titleText) + border.horizontal.repeat(rightLen);
        } else {
            topLine = border.horizontal + titleFn(titleText) + border.horizontal.repeat(innerWidth - titleWidth + 1);
        }
    }
    result.push(colorFn(border.topLeft + topLine + border.topRight));

    // Padding top
    for (let i = 0; i < padding; i++) {
        result.push(colorFn(border.vertical) + ' '.repeat(innerWidth + 2) + colorFn(border.vertical));
    }

    // Content lines
    for (const line of lines) {
        const paddedLine = padToWidth(line, innerWidth);
        result.push(colorFn(border.vertical) + ' ' + paddedLine + ' ' + colorFn(border.vertical));
    }

    // Padding bottom
    for (let i = 0; i < padding; i++) {
        result.push(colorFn(border.vertical) + ' '.repeat(innerWidth + 2) + colorFn(border.vertical));
    }

    // Bottom border
    result.push(colorFn(border.bottomLeft + border.horizontal.repeat(innerWidth + 2) + border.bottomRight));

    return result.join('\n');
}

// ═══════════════════════════════════════════════════════════════════════════
// DIVIDERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Create a horizontal divider
 */
export function createDivider(options = {}) {
    const {
        width = 60,
        style = 'single',
        text = '',
        textAlign = 'center',
    } = options;

    const tc = createThemedChalk();
    const border = borders[style] || borders.single;
    const char = border.horizontal;

    if (!text) {
        return tc.muted(char.repeat(width));
    }

    const textWidth = getStringWidth(text);
    const sideWidth = Math.floor((width - textWidth - 2) / 2);

    return tc.muted(char.repeat(sideWidth)) + tc.secondary(` ${text} `) + tc.muted(char.repeat(width - sideWidth - textWidth - 2));
}

// ═══════════════════════════════════════════════════════════════════════════
// BANNERS & HEADERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Create a banner with decorative borders
 */
export function createBanner(text, options = {}) {
    const tc = createThemedChalk();
    const lines = Array.isArray(text) ? text : [text];

    return createBox(lines, {
        borderStyle: 'double',
        padding: 1,
        titleAlign: 'center',
        ...options,
    });
}

/**
 * Create a section header
 */
export function createHeader(text, options = {}) {
    const { icon = '◆', width = 50 } = options;
    const tc = createThemedChalk();

    const headerText = `${icon} ${text}`;
    const paddingWidth = Math.max(0, width - getStringWidth(headerText) - 2);

    return tc.bold.primary(headerText) + tc.muted(' ' + '─'.repeat(paddingWidth));
}

// ═══════════════════════════════════════════════════════════════════════════
// TABLES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Create a simple key-value table
 */
export function createKeyValueTable(data, options = {}) {
    const { keyWidth = 20, borderStyle = 'single' } = options;
    const tc = createThemedChalk();
    const border = borders[borderStyle] || borders.single;

    const result = [];

    for (const [key, value] of Object.entries(data)) {
        const keyStr = padToWidth(key, keyWidth);
        result.push(`  ${tc.secondary(keyStr)} ${tc.muted(border.vertical)} ${tc.text(value)}`);
    }

    return result.join('\n');
}

/**
 * Create a command menu table
 */
export function createCommandTable(commands, options = {}) {
    const { width = 45 } = options;
    const tc = createThemedChalk();
    const border = borders.rounded;

    const result = [];

    // Header
    result.push(tc.primary(border.topLeft + border.horizontal.repeat(width) + border.topRight));
    result.push(tc.primary(border.vertical) + tc.bold.accent(padToWidth(` ${icons.pin} Commands`, width)) + tc.primary(border.vertical));
    result.push(tc.primary(border.leftT + border.horizontal.repeat(width) + border.rightT));

    // Commands
    for (const cmd of commands) {
        const cmdText = `  ${tc.secondary(cmd.name.padEnd(15))} ${tc.muted(icons.arrow)} ${tc.text(cmd.description)}`;
        result.push(tc.primary(border.vertical) + padToWidth(cmdText, width) + tc.primary(border.vertical));
    }

    // Footer
    result.push(tc.primary(border.bottomLeft + border.horizontal.repeat(width) + border.bottomRight));

    return result.join('\n');
}

// ═══════════════════════════════════════════════════════════════════════════
// STATUS BADGES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Create a status badge
 */
export function createBadge(text, type = 'info') {
    const tc = createThemedChalk();
    const theme = getTheme();

    const badges = {
        success: { bg: theme.success, icon: icons.success },
        error: { bg: theme.error, icon: icons.error },
        warning: { bg: theme.warning, icon: icons.warning },
        info: { bg: theme.info, icon: icons.info },
    };

    const badge = badges[type] || badges.info;
    return chalk.bgHex(badge.bg).black(` ${badge.icon} ${text} `);
}

/**
 * Create an inline label
 */
export function createLabel(text, color = null) {
    const tc = createThemedChalk();
    const colorFn = color ? chalk.hex(color) : tc.accent;
    return colorFn(`[${text}]`);
}

// ═══════════════════════════════════════════════════════════════════════════
// PROGRESS & LOADING
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Create a progress bar
 */
export function createProgressBar(current, total, options = {}) {
    const { width = 30, showPercent = true, filled = '█', empty = '░' } = options;
    const tc = createThemedChalk();

    const percent = Math.round((current / total) * 100);
    const filledWidth = Math.round((current / total) * width);
    const emptyWidth = width - filledWidth;

    let bar = tc.success(filled.repeat(filledWidth)) + tc.muted(empty.repeat(emptyWidth));

    if (showPercent) {
        bar += tc.text(` ${percent}%`);
    }

    return bar;
}

// ═══════════════════════════════════════════════════════════════════════════
// GRADIENT TEXT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Apply gradient colors to text
 */
export function gradientText(text, colors = null) {
    const theme = getTheme();
    const gradientColors = colors || theme.gradient;

    if (gradientColors.length < 2) {
        return chalk.hex(gradientColors[0])(text);
    }

    const result = [];
    const step = text.length / (gradientColors.length - 1);

    for (let i = 0; i < text.length; i++) {
        const colorIndex = Math.min(Math.floor(i / step), gradientColors.length - 2);
        const localProgress = (i % step) / step;

        const startColor = gradientColors[colorIndex];
        const endColor = gradientColors[colorIndex + 1];

        const color = interpolateColor(startColor, endColor, localProgress);
        result.push(chalk.hex(color)(text[i]));
    }

    return result.join('');
}

/**
 * Interpolate between two hex colors
 */
function interpolateColor(color1, color2, factor) {
    const c1 = hexToRgb(color1);
    const c2 = hexToRgb(color2);

    const r = Math.round(c1.r + (c2.r - c1.r) * factor);
    const g = Math.round(c1.g + (c2.g - c1.g) * factor);
    const b = Math.round(c1.b + (c2.b - c1.b) * factor);

    return rgbToHex(r, g, b);
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
    } : { r: 0, g: 0, b: 0 };
}

function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

// ═══════════════════════════════════════════════════════════════════════════
// SPECIAL EFFECTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Create a sparkle effect around text
 */
export function sparkleText(text) {
    const tc = createThemedChalk();
    return tc.accent(`${icons.sparkle} ${text} ${icons.sparkle}`);
}

/**
 * Create emphasized text with arrows
 */
export function arrowText(text) {
    const tc = createThemedChalk();
    return tc.secondary(`${icons.triangleRight} ${text}`);
}

/**
 * Create a bullet list
 */
export function createBulletList(items, options = {}) {
    const { bullet = icons.bullet, indent = 2 } = options;
    const tc = createThemedChalk();

    return items.map(item =>
        ' '.repeat(indent) + tc.accent(bullet) + ' ' + tc.text(item)
    ).join('\n');
}

export default {
    createBox,
    createDivider,
    createBanner,
    createHeader,
    createKeyValueTable,
    createCommandTable,
    createBadge,
    createLabel,
    createProgressBar,
    gradientText,
    sparkleText,
    arrowText,
    createBulletList,
    getStringWidth,
    padToWidth,
};
