/**
 * Logger Module
 * Structured logging with timestamps, levels, and formatted output
 */

import chalk from 'chalk';
import { icons, createThemedChalk, getTheme } from './theme.js';
import { createBox, createBadge } from './ui.js';

// ═══════════════════════════════════════════════════════════════════════════
// LOG LEVELS
// ═══════════════════════════════════════════════════════════════════════════

const LOG_LEVELS = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    SUCCESS: 4,
};

let currentLogLevel = LOG_LEVELS.INFO;

// ═══════════════════════════════════════════════════════════════════════════
// TIMESTAMP FORMATTING
// ═══════════════════════════════════════════════════════════════════════════

function getTimestamp() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

function formatTimestamp() {
    const tc = createThemedChalk();
    return tc.muted(`[${getTimestamp()}]`);
}

// ═══════════════════════════════════════════════════════════════════════════
// LOGGER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Set the minimum log level
 */
export function setLogLevel(level) {
    if (LOG_LEVELS[level] !== undefined) {
        currentLogLevel = LOG_LEVELS[level];
    }
}

/**
 * Log a debug message
 */
export function debug(message, data = null) {
    if (currentLogLevel > LOG_LEVELS.DEBUG) return;

    const tc = createThemedChalk();
    const prefix = `${formatTimestamp()} ${tc.muted(`[${icons.gear} DEBUG]`)}`;
    console.log(`${prefix} ${tc.muted(message)}`);

    if (data) {
        console.log(tc.muted(JSON.stringify(data, null, 2)));
    }
}

/**
 * Log an info message
 */
export function info(message, context = '') {
    if (currentLogLevel > LOG_LEVELS.INFO) return;

    const tc = createThemedChalk();
    const prefix = `${formatTimestamp()} ${tc.info(`[${icons.info} INFO]`)}`;
    const contextStr = context ? tc.muted(` (${context})`) : '';
    console.log(`${prefix} ${tc.text(message)}${contextStr}`);
}

/**
 * Log a warning message
 */
export function warn(message, context = '') {
    if (currentLogLevel > LOG_LEVELS.WARN) return;

    const tc = createThemedChalk();
    const prefix = `${formatTimestamp()} ${tc.warning(`[${icons.warning} WARN]`)}`;
    const contextStr = context ? tc.muted(` (${context})`) : '';
    console.log(`${prefix} ${tc.warning(message)}${contextStr}`);
}

/**
 * Log an error message with optional stack trace
 */
export function error(message, err = null) {
    if (currentLogLevel > LOG_LEVELS.ERROR) return;

    const tc = createThemedChalk();
    const prefix = `${formatTimestamp()} ${tc.error(`[${icons.error} ERROR]`)}`;
    console.log(`${prefix} ${tc.error(message)}`);

    if (err && err.stack) {
        console.log(tc.dim.muted(err.stack));
    }
}

/**
 * Log a success message
 */
export function success(message) {
    const tc = createThemedChalk();
    const prefix = `${formatTimestamp()} ${tc.success(`[${icons.success} OK]`)}`;
    console.log(`${prefix} ${tc.success(message)}`);
}

// ═══════════════════════════════════════════════════════════════════════════
// SPECIAL FORMATTED LOGS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Log a request (for API calls)
 */
export function request(method, url, params = null) {
    const tc = createThemedChalk();
    const prefix = `${formatTimestamp()} ${tc.secondary(`[${icons.arrowRight} REQ]`)}`;
    console.log(`${prefix} ${tc.bold.secondary(method)} ${tc.text(url)}`);

    if (params) {
        console.log(tc.muted(`  Params: ${JSON.stringify(params)}`));
    }
}

/**
 * Log a response
 */
export function response(status, message = '') {
    const tc = createThemedChalk();
    const isSuccess = status >= 200 && status < 300;
    const statusColor = isSuccess ? tc.success : tc.error;
    const icon = isSuccess ? icons.success : icons.error;

    const prefix = `${formatTimestamp()} ${statusColor(`[${icon} RES]`)}`;
    console.log(`${prefix} ${statusColor(status)} ${tc.text(message)}`);
}

/**
 * Log a process milestone
 */
export function milestone(message) {
    const tc = createThemedChalk();
    const prefix = `${formatTimestamp()} ${tc.accent(`[${icons.star} STEP]`)}`;
    console.log(`${prefix} ${tc.bold.text(message)}`);
}

/**
 * Log a command being executed
 */
export function command(cmd) {
    const tc = createThemedChalk();
    const prefix = `${formatTimestamp()} ${tc.primary(`[${icons.triangleRight} CMD]`)}`;
    console.log(`${prefix} ${tc.secondary(cmd)}`);
}

// ═══════════════════════════════════════════════════════════════════════════
// BOXED MESSAGES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Log an error in a box (for critical errors)
 */
export function errorBox(title, message, err = null) {
    const tc = createThemedChalk();
    const theme = getTheme();

    const lines = [
        tc.error(`${icons.error} ${message}`),
    ];

    if (err && err.message) {
        lines.push('');
        lines.push(tc.muted(`Details: ${err.message}`));
    }

    console.log('');
    console.log(createBox(lines, {
        title: `⚠ ${title}`,
        borderStyle: 'double',
        borderColor: theme.error,
        titleColor: theme.error,
        padding: 1,
    }));
    console.log('');
}

/**
 * Log a success in a box (for important completions)
 */
export function successBox(title, message) {
    const tc = createThemedChalk();
    const theme = getTheme();

    console.log('');
    console.log(createBox([tc.success(`${icons.success} ${message}`)], {
        title: `✓ ${title}`,
        borderStyle: 'rounded',
        borderColor: theme.success,
        titleColor: theme.success,
        padding: 1,
    }));
    console.log('');
}

/**
 * Log information in a box
 */
export function infoBox(title, content) {
    const tc = createThemedChalk();
    const theme = getTheme();

    const lines = Array.isArray(content) ? content : [content];

    console.log('');
    console.log(createBox(lines.map(l => tc.text(l)), {
        title: `${icons.info} ${title}`,
        borderStyle: 'rounded',
        borderColor: theme.info,
        titleColor: theme.info,
        padding: 1,
    }));
    console.log('');
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Create a blank line
 */
export function blank() {
    console.log('');
}

/**
 * Clear the console
 */
export function clear() {
    console.clear();
}

export default {
    LOG_LEVELS,
    setLogLevel,
    debug,
    info,
    warn,
    error,
    success,
    request,
    response,
    milestone,
    command,
    errorBox,
    successBox,
    infoBox,
    blank,
    clear,
};
