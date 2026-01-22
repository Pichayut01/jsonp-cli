#!/usr/bin/env node
/**
 * JSONP-CLI - Professional JSON Prompt Generator
 * A beautiful, feature-rich CLI for generating creative JSON prompts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import inquirer from 'inquirer';
import chalk from 'chalk';
import Conf from 'conf';
import ora from 'ora';
import { highlight } from 'cli-highlight';

// ═══════════════════════════════════════════════════════════════════════════
// IMPORTS FROM LIB MODULES
// ═══════════════════════════════════════════════════════════════════════════

import {
  icons,
  borders,
  getTheme,
  getThemeName,
  setTheme,
  getAvailableThemes,
  createThemedChalk,
} from './lib/theme.js';

import {
  createBox,
  createDivider,
  createBanner,
  createHeader,
  createKeyValueTable,
  createCommandTable,
  createBadge,
  createLabel,
  gradientText,
  sparkleText,
  createBulletList,
} from './lib/ui.js';

import * as logger from './lib/logger.js';
import { typeText, spinnerFrames, sleep } from './lib/animations.js';

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = new Conf({ projectName: 'jsonp-cli' });
const VERSION = '2.0.0';
const APP_NAME = 'JSONP-CLI';

// Load ASCII logo from file
function loadAsciiLogo() {
  try {
    const logoPath = path.join(__dirname, 'ASCIIlogo');
    return fs.readFileSync(logoPath, 'utf-8');
  } catch {
    return `
     ╦╔═╗╔═╗╔╗╔╔═╗   ╔═╗╦  ╦
     ║╚═╗║ ║║║║╠═╝───║  ║  ║
    ╚╝╚═╝╚═╝╝╚╝╩     ╚═╝╩═╝╩
    `;
  }
}

// Output directory - uses config or defaults to user's home/jsonp-output
const getOutputDir = () => {
  const configDir = config.get('output_dir');
  if (configDir) return configDir;

  // Default: ~/jsonp-output (cross-platform)
  const homeDir = process.env.HOME || process.env.USERPROFILE || '.';
  return path.join(homeDir, 'jsonp-output');
};

const jsonpDir = getOutputDir();
if (!fs.existsSync(jsonpDir)) {
  fs.mkdirSync(jsonpDir, { recursive: true });
  logger.info(`Created output directory: ${jsonpDir}`);
}

// ═══════════════════════════════════════════════════════════════════════════
// DISPLAY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Display the welcome screen with ASCII art and info
 */
function displayWelcome() {
  const tc = createThemedChalk();
  const logo = loadAsciiLogo();
  const theme = getTheme();

  console.clear();

  // ASCII Logo with gradient
  console.log('');
  console.log(gradientText(logo, theme.gradient));

  // Info box
  const infoLines = [
    `${tc.accent(icons.lightning)} ${tc.bold.text('JSON Prompt Generator')} ${tc.muted(`v${VERSION}`)}`,
    '',
    `${tc.muted(icons.gear)} Model: ${tc.secondary(config.get('prompt_model', 'llama3:latest'))}`,
    `${tc.muted(icons.folder)} Output: ${tc.secondary(jsonpDir)}`,
    `${tc.muted(icons.star)} Theme: ${tc.secondary(getThemeName())}`,
  ];

  console.log(createBox(infoLines, {
    borderStyle: 'double',
    padding: 1,
    title: `[ ${APP_NAME} ]`,
    titleAlign: 'center',
  }));

  console.log('');
  console.log(tc.muted(`  Type ${tc.accent('/help')} for commands or start typing your prompt`));
  console.log('');
}

/**
 * Display the help menu
 */
function displayHelp() {
  const tc = createThemedChalk();

  const commands = [
    { name: '/model', description: 'Set AI model (short for /promptmodel)' },
    { name: '/theme', description: 'Change color theme' },
    { name: '/output', description: 'Set output directory' },
    { name: '/setting', description: 'View current settings' },
    { name: '/history', description: 'View prompt history' },
    { name: '/info', description: 'System information' },
    { name: '/clear', description: 'Clear screen' },
    { name: '/help', description: 'Show this menu' },
    { name: '/exit', description: 'Exit application' },
  ];

  console.log('');
  console.log(createHeader('Available Commands', { icon: icons.pin }));
  console.log('');

  for (const cmd of commands) {
    console.log(`  ${tc.primary(cmd.name.padEnd(16))} ${tc.muted(icons.arrow)} ${tc.text(cmd.description)}`);
  }

  console.log('');
  console.log(createDivider({ width: 50, text: 'Tips' }));
  console.log('');
  console.log(createBulletList([
    'Type any text to generate a JSON prompt template',
    'Use /model <name> to change AI model',
    'Use /theme <name> to change colors',
  ]));
  console.log('');
}

/**
 * Display current settings
 */
function displaySettings() {
  const tc = createThemedChalk();
  const promptModel = config.get('prompt_model', 'llama3:latest');

  console.log('');
  console.log(createBox([
    `${tc.muted('Prompt Model:')}  ${tc.bold.secondary(promptModel)}`,
    `${tc.muted('Output Dir:')}    ${tc.secondary(jsonpDir)}`,
    `${tc.muted('Theme:')}         ${tc.secondary(getThemeName())}`,
    `${tc.muted('Version:')}       ${tc.secondary(VERSION)}`,
  ], {
    title: ':: Settings',
    borderStyle: 'rounded',
    padding: 1,
  }));
  console.log('');
}

/**
 * Display prompt history
 */
function displayHistory() {
  const tc = createThemedChalk();

  try {
    const files = fs.readdirSync(jsonpDir)
      .filter(f => f.endsWith('.json'))
      .sort()
      .reverse()
      .slice(0, 10);

    if (files.length === 0) {
      console.log('');
      console.log(tc.warning(`  ${icons.warning} No prompt history found`));
      console.log('');
      return;
    }

    console.log('');
    console.log(createHeader('Recent Prompts', { icon: icons.clock }));
    console.log('');

    for (const file of files) {
      const filePath = path.join(jsonpDir, file);
      const stats = fs.statSync(filePath);
      const date = stats.mtime.toLocaleDateString();
      const time = stats.mtime.toLocaleTimeString();

      console.log(`  ${tc.muted(icons.file)} ${tc.secondary(file)}`);
      console.log(`     ${tc.muted(`${date} ${time}`)}`);
    }

    console.log('');
    console.log(tc.muted(`  ${icons.folder} Location: ${jsonpDir}`));
    console.log('');
  } catch (error) {
    logger.error('Failed to read history', error);
  }
}

/**
 * Display system information
 */
function displayInfo() {
  const tc = createThemedChalk();

  const info = {
    'Application': `${APP_NAME} v${VERSION}`,
    'Node.js': process.version,
    'Platform': `${process.platform} (${process.arch})`,
    'Memory': `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
    'Uptime': `${Math.round(process.uptime())} seconds`,
    'Output Dir': jsonpDir,
    'Config Dir': config.path,
  };

  console.log('');
  console.log(createBox(
    Object.entries(info).map(([key, value]) =>
      `${tc.muted(key.padEnd(12))} ${tc.secondary(value)}`
    ),
    {
      title: ':: System Information',
      borderStyle: 'rounded',
      padding: 1,
    }
  ));
  console.log('');
}

/**
 * Display theme selection
 */
function displayThemes() {
  const tc = createThemedChalk();
  const themes = getAvailableThemes();
  const current = getThemeName();

  console.log('');
  console.log(createHeader('Available Themes', { icon: icons.star }));
  console.log('');

  for (const theme of themes) {
    const marker = theme === current ? tc.success(`${icons.check} `) : '  ';
    const label = theme === current ? tc.bold.accent(theme) : tc.text(theme);
    console.log(`  ${marker}${label}`);
  }

  console.log('');
  console.log(tc.muted(`  Usage: /theme <name>`));
  console.log('');
}

// ═══════════════════════════════════════════════════════════════════════════
// CORE FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generate creative JSON prompt using Ollama
 */
async function generateCreativePrompt(prompt, model, spinner) {
  const tc = createThemedChalk();

  spinner.start(tc.info(`${icons.lightning} Generating creative JSON prompt...`));
  logger.debug('Starting prompt generation', { prompt, model });

  try {
    const creativePromptInstruction = `You are an expert prompt engineer. Based on the user's request, create a structured JSON prompt template that can be used to instruct another AI model effectively.

The JSON should contain the following fields:
- "task": A clear, concise description of what the AI should do
- "system_prompt": The system instructions for the AI (role, behavior, constraints)  
- "user_prompt": The actual prompt to send to the AI (this should be detailed and well-crafted)
- "context": Any relevant background information or context
- "output_format": Expected output format (e.g., "markdown", "json", "plain text", "code")
- "constraints": Array of rules or limitations the AI should follow
- "examples": Optional array of example inputs/outputs if helpful
- "temperature": Suggested temperature setting (0.0-1.0)
- "max_tokens": Suggested max tokens for response

Make this prompt template professional, detailed, and optimized for the best AI response.
Output ONLY the valid JSON object, no additional text or markdown code blocks.

User's Request: "${prompt}"`;

    logger.request('POST', 'http://localhost:11434/api/generate', { model });

    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: model,
        prompt: creativePromptInstruction,
        stream: false,
      }),
    });

    if (!response.ok) {
      spinner.fail(tc.error(`${icons.error} API request failed (${response.status})`));
      logger.error(`Ollama API request failed with status ${response.status}`);
      return null;
    }

    const data = await response.json();

    spinner.succeed(tc.success(`${icons.success} JSON prompt generated successfully!`));
    logger.success('Prompt generated successfully');
    logger.response(200, 'OK');

    return data.response;
  } catch (error) {
    spinner.fail(tc.error(`${icons.error} Connection failed`));
    logger.error('Error connecting to Ollama', error);
    logger.errorBox('Connection Error', 'Failed to connect to Ollama. Make sure Ollama is running.', error);
    return null;
  }
}

/**
 * Save JSON prompt to file
 */
function saveJson(content, originalPrompt) {
  const tc = createThemedChalk();
  const fileName = `prompt-${Date.now()}.json`;
  const filePath = path.join(jsonpDir, fileName);

  try {
    fs.writeFileSync(filePath, content);

    console.log('');
    console.log(createBox([
      `${tc.success(icons.success)} Saved successfully!`,
      '',
      `${tc.muted('File:')} ${tc.secondary(fileName)}`,
      `${tc.muted('Path:')} ${tc.secondary(filePath)}`,
    ], {
      borderStyle: 'rounded',
      padding: 1,
    }));
    console.log('');

    logger.success(`JSON saved to ${filePath}`);
  } catch (err) {
    logger.error('Error saving the JSON file', err);
  }
}

/**
 * Display generated JSON with theme-based syntax highlighting
 */
function displayJson(jsonString) {
  const tc = createThemedChalk();
  const theme = getTheme();

  console.log('');
  console.log(createHeader('Generated JSON Prompt', { icon: icons.file }));
  console.log('');

  // Custom recursive JSON highlighter
  function highlightValue(value, indent = 0) {
    const pad = '  '.repeat(indent);

    if (value === null) {
      return chalk.hex(theme.muted)('null');
    }
    if (typeof value === 'boolean') {
      return chalk.hex(theme.warning)(String(value));
    }
    if (typeof value === 'number') {
      return chalk.hex(theme.accent)(String(value));
    }
    if (typeof value === 'string') {
      return chalk.hex(theme.success)(`"${value}"`);
    }
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return chalk.hex(theme.primary)('[]');
      }
      const items = value.map(item => pad + '  ' + highlightValue(item, indent + 1));
      return chalk.hex(theme.primary)('[') + '\n' +
        items.join(',\n') + '\n' +
        pad + chalk.hex(theme.primary)(']');
    }
    if (typeof value === 'object') {
      const keys = Object.keys(value);
      if (keys.length === 0) {
        return chalk.hex(theme.primary)('{}');
      }
      const entries = keys.map(key => {
        const coloredKey = chalk.hex(theme.secondary)(`"${key}"`);
        const coloredValue = highlightValue(value[key], indent + 1);
        return pad + '  ' + coloredKey + ': ' + coloredValue;
      });
      return chalk.hex(theme.primary)('{') + '\n' +
        entries.join(',\n') + '\n' +
        pad + chalk.hex(theme.primary)('}');
    }
    return String(value);
  }

  try {
    const parsed = JSON.parse(jsonString);
    console.log(highlightValue(parsed));
  } catch {
    // If parsing fails, just use cli-highlight as fallback
    console.log(highlight(jsonString, { language: 'json', ignoreIllegals: true }));
  }

  console.log('');
}

// ═══════════════════════════════════════════════════════════════════════════
// INTERACTIVE MODE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Handle slash commands
 */
async function handleCommand(input, promptModel) {
  const tc = createThemedChalk();
  const [command, ...args] = input.slice(1).split(' ');

  switch (command.toLowerCase()) {
    case 'promptmodel':
      if (args.length > 0) {
        const newModel = args[0];
        config.set('prompt_model', newModel);
        logger.success(`Model updated to: ${newModel}`);
        console.log(tc.success(`\n  ${icons.success} Model set to: ${tc.bold.secondary(newModel)}\n`));
        return newModel;
      } else {
        console.log(tc.info(`\n  ${icons.info} Current model: ${tc.bold.secondary(promptModel)}\n`));
      }
      break;

    case 'help':
      displayHelp();
      break;

    case 'setting':
    case 'settings':
      displaySettings();
      break;

    case 'history':
      displayHistory();
      break;

    case 'info':
      displayInfo();
      break;

    case 'theme':
      if (args.length > 0) {
        const themeName = args[0].toLowerCase();
        if (setTheme(themeName)) {
          config.set('theme', themeName);
          console.log(tc.success(`\n  ${icons.success} Theme changed to: ${tc.bold.secondary(themeName)}\n`));
          logger.success(`Theme changed to: ${themeName}`);
        } else {
          console.log(tc.error(`\n  ${icons.error} Unknown theme: ${themeName}`));
          displayThemes();
        }
      } else {
        displayThemes();
      }
      break;

    case 'model':
      // Alias for /promptmodel
      if (args.length > 0) {
        const newModel = args[0];
        config.set('prompt_model', newModel);
        logger.success(`Model updated to: ${newModel}`);
        console.log(tc.success(`\n  ${icons.success} Model set to: ${tc.bold.secondary(newModel)}\n`));
        return newModel;
      } else {
        console.log(tc.info(`\n  ${icons.info} Current model: ${tc.bold.secondary(promptModel)}`));
        console.log(tc.muted(`  Usage: /model <model_name>\n`));
      }
      break;

    case 'output':
      if (args.length > 0) {
        const newDir = args.join(' ');
        config.set('output_dir', newDir);
        console.log(tc.success(`\n  ${icons.success} Output directory set to: ${tc.bold.secondary(newDir)}`));
        console.log(tc.warning(`  ${icons.warning} Restart the app for changes to take effect\n`));
      } else {
        console.log(tc.info(`\n  ${icons.info} Current output: ${tc.bold.secondary(jsonpDir)}`));
        console.log(tc.muted(`  Usage: /output <directory_path>\n`));
      }
      break;

    case 'clear':
      displayWelcome();
      break;

    case 'exit':
    case 'quit':
      console.log('');
      console.log(tc.muted(`  ${icons.sparkle} Goodbye! Thanks for using ${APP_NAME}`));
      console.log('');
      process.exit(0);
      break;

    default:
      console.log(tc.error(`\n  ${icons.error} Unknown command: ${command}\n`));
      console.log(tc.muted(`  Type ${tc.accent('/help')} for available commands\n`));
      break;
  }

  return promptModel;
}

/**
 * Main interactive prompt loop
 */
async function interactivePrompt() {
  // Load saved theme
  const savedTheme = config.get('theme', 'pastel');
  setTheme(savedTheme);

  const tc = createThemedChalk();

  // Display welcome screen
  displayWelcome();

  let promptModel = config.get('prompt_model', 'llama3:latest');

  while (true) {
    try {
      const { prompt } = await inquirer.prompt([
        {
          type: 'input',
          name: 'prompt',
          message: tc.accent(icons.prompt),
          prefix: '',
        },
      ]);

      // Handle empty input
      if (!prompt.trim()) {
        continue;
      }

      // Check for exit commands
      if (prompt.toLowerCase() === 'exit' || prompt.toLowerCase() === 'quit') {
        console.log('');
        console.log(tc.muted(`  ${icons.sparkle} Goodbye! Thanks for using ${APP_NAME}`));
        console.log('');
        break;
      }

      // Handle slash commands
      if (prompt.startsWith('/')) {
        promptModel = await handleCommand(prompt, promptModel);
        continue;
      }

      // Generate JSON prompt
      logger.milestone('Processing user prompt');

      const spinner = ora({
        spinner: { frames: spinnerFrames.dots, interval: 80 },
      });

      const generatedPrompt = await generateCreativePrompt(prompt, promptModel, spinner);

      if (generatedPrompt) {
        displayJson(generatedPrompt);
        saveJson(generatedPrompt, prompt);
      }

    } catch (error) {
      if (error.name === 'ExitPromptError') {
        console.log('');
        console.log(tc.muted(`  ${icons.sparkle} Goodbye!`));
        console.log('');
        break;
      }
      logger.error('Interactive prompt error', error);
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// CLI SETUP
// ═══════════════════════════════════════════════════════════════════════════

const tc = createThemedChalk();

yargs(hideBin(process.argv))
  .scriptName('jsonp')
  .usage(tc.bold.primary(`${APP_NAME} - Professional JSON Prompt Generator`))
  .command(
    '$0',
    'Start interactive session to create JSON prompts',
    () => { },
    interactivePrompt
  )
  .command(
    'config <key> [value]',
    'Set a configuration value',
    (yargs) => {
      yargs.positional('key', {
        describe: 'Configuration key (prompt_model, theme)',
        type: 'string',
      });
      yargs.positional('value', {
        describe: 'Value to set',
        type: 'string',
      });
    },
    (argv) => {
      if (argv.value) {
        config.set(argv.key, argv.value);
        console.log(tc.success(`\n  ${icons.success} ${argv.key} = ${argv.value}\n`));
        logger.success(`Configuration updated: ${argv.key} = ${argv.value}`);
      } else {
        const value = config.get(argv.key, 'not set');
        console.log(tc.info(`\n  ${icons.info} ${argv.key} = ${value}\n`));
      }
    }
  )
  .command(
    'history',
    'View prompt history',
    () => { },
    () => {
      displayHistory();
    }
  )
  .command(
    'info',
    'Show system information',
    () => { },
    () => {
      displayInfo();
    }
  )
  .example('$0', 'Start interactive mode')
  .example('$0 config prompt_model gemma', 'Set the AI model')
  .example('$0 config theme cyberpunk', 'Change color theme')
  .example('$0 history', 'View saved prompts')
  .help()
  .alias('h', 'help')
  .version(VERSION)
  .alias('v', 'version')
  .epilogue(tc.muted(`${icons.sparkle} Made with love for creative prompt generation`))
  .argv;