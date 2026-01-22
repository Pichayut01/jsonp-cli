/**
 * Animation Utilities Module
 * Terminal animations and effects
 */

import chalk from 'chalk';
import { createThemedChalk, getTheme } from './theme.js';

// ═══════════════════════════════════════════════════════════════════════════
// SPINNER CONFIGURATIONS
// ═══════════════════════════════════════════════════════════════════════════

export const spinnerFrames = {
    dots: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
    dots2: ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷'],
    dots3: ['⠋', '⠙', '⠚', '⠞', '⠖', '⠦', '⠴', '⠲', '⠳', '⠓'],
    line: ['-', '\\', '|', '/'],
    star: ['✶', '✷', '✸', '✹', '✺', '✹', '✸', '✷'],
    arc: ['◜', '◠', '◝', '◞', '◡', '◟'],
    circle: ['◐', '◓', '◑', '◒'],
    squareCorners: ['◰', '◳', '◲', '◱'],
    triangles: ['◢', '◣', '◤', '◥'],
    bounce: ['⠁', '⠂', '⠄', '⠂'],
    bouncingBar: ['[    ]', '[=   ]', '[==  ]', '[=== ]', '[ ===]', '[  ==]', '[   =]', '[    ]'],
    arrow: ['←', '↖', '↑', '↗', '→', '↘', '↓', '↙'],
    clock: ['🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚', '🕛'],
    earth: ['🌍', '🌎', '🌏'],
    moon: ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'],
};

// ═══════════════════════════════════════════════════════════════════════════
// TYPING EFFECT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Create a typing effect for text
 * @param {string} text - Text to animate
 * @param {number} delay - Delay between characters in ms
 */
export async function typeText(text, delay = 30) {
    for (const char of text) {
        process.stdout.write(char);
        await sleep(delay);
    }
    console.log('');
}

/**
 * Type multiple lines with a pause between them
 */
export async function typeLines(lines, charDelay = 30, lineDelay = 100) {
    for (const line of lines) {
        await typeText(line, charDelay);
        await sleep(lineDelay);
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// LOADING ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Show a loading animation for a promise
 * @param {Promise} promise - The promise to wait for
 * @param {string} message - Loading message
 * @param {Object} options - Animation options
 */
export async function withLoading(promise, message, options = {}) {
    const { frames = spinnerFrames.dots, interval = 80 } = options;
    const tc = createThemedChalk();

    let frameIndex = 0;
    let isRunning = true;

    const animate = () => {
        if (!isRunning) return;

        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        process.stdout.write(tc.primary(frames[frameIndex]) + ' ' + tc.text(message));

        frameIndex = (frameIndex + 1) % frames.length;
        setTimeout(animate, interval);
    };

    animate();

    try {
        const result = await promise;
        isRunning = false;
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        console.log(tc.success('✓') + ' ' + tc.text(message));
        return result;
    } catch (error) {
        isRunning = false;
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        console.log(tc.error('✗') + ' ' + tc.text(message));
        throw error;
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// PROGRESS BAR ANIMATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Animate a progress bar
 */
export async function animateProgress(total, options = {}) {
    const {
        width = 30,
        filled = '█',
        empty = '░',
        prefix = '',
        stepDelay = 50,
    } = options;
    const tc = createThemedChalk();

    for (let current = 0; current <= total; current++) {
        const percent = Math.round((current / total) * 100);
        const filledWidth = Math.round((current / total) * width);
        const emptyWidth = width - filledWidth;

        const bar = tc.success(filled.repeat(filledWidth)) + tc.muted(empty.repeat(emptyWidth));

        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        process.stdout.write(`${prefix}${bar} ${percent}%`);

        await sleep(stepDelay);
    }
    console.log('');
}

// ═══════════════════════════════════════════════════════════════════════════
// FADE EFFECTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Fade in text effect
 */
export async function fadeIn(text, options = {}) {
    const { steps = 5, delay = 100 } = options;
    const grays = [];

    for (let i = 0; i < steps; i++) {
        const grayValue = Math.floor((i / (steps - 1)) * 255);
        grays.push(`#${grayValue.toString(16).padStart(2, '0').repeat(3)}`);
    }

    for (const gray of grays) {
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        process.stdout.write(chalk.hex(gray)(text));
        await sleep(delay);
    }
    console.log('');
}

// ═══════════════════════════════════════════════════════════════════════════
// RAINBOW EFFECT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Apply rainbow colors to text
 */
export function rainbow(text) {
    const colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#8B00FF'];
    let result = '';

    for (let i = 0; i < text.length; i++) {
        const color = colors[i % colors.length];
        result += chalk.hex(color)(text[i]);
    }

    return result;
}

/**
 * Animate rainbow colors across text
 */
export async function animateRainbow(text, cycles = 3, delay = 100) {
    const colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#8B00FF'];

    for (let c = 0; c < cycles * colors.length; c++) {
        let result = '';
        for (let i = 0; i < text.length; i++) {
            const colorIndex = (i + c) % colors.length;
            result += chalk.hex(colors[colorIndex])(text[i]);
        }

        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        process.stdout.write(result);
        await sleep(delay);
    }
    console.log('');
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Sleep for specified milliseconds
 */
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Flash text effect
 */
export async function flashText(text, times = 3, delay = 200) {
    const tc = createThemedChalk();

    for (let i = 0; i < times; i++) {
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        process.stdout.write(tc.bold.accent(text));
        await sleep(delay);

        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        await sleep(delay / 2);
    }

    process.stdout.write(tc.bold.accent(text));
    console.log('');
}

export default {
    spinnerFrames,
    typeText,
    typeLines,
    withLoading,
    animateProgress,
    fadeIn,
    rainbow,
    animateRainbow,
    sleep,
    flashText,
};
