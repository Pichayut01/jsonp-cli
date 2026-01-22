# JSONP-CLI

<p align="center">
  <pre>
     ▄▄▄██▀▀▀██████  ▒█████   ███▄    █  ██▓███         ▄████▄   ██▓     ██▓
       ▒██ ▒██    ▒ ▒██▒  ██▒ ██ ▀█   █ ▓██░  ██▒      ▒██▀ ▀█  ▓██▒    ▓██▒
       ░██ ░ ▓██▄   ▒██░  ██▒▓██  ▀█ ██▒▓██░ ██▓▒      ▒▓█    ▄ ▒██░    ▒██▒
    ▓██▄██▓  ▒   ██▒▒██   ██░▓██▒  ▐▌██▒▒██▄█▓▒ ▒      ▒▓▓▄ ▄██▒▒██░    ░██░
     ▓███▒ ▒██████▒▒░ ████▓▒░▒██░   ▓██░▒██▒ ░  ░      ▒ ▓███▀ ░░██████▒░██░
     ▒▓▒▒░ ▒ ▒▓▒ ▒ ░░ ▒░▒░▒░ ░ ▒░   ▒ ▒ ▒▓▒░ ░  ░      ░ ░▒ ▒  ░░ ▒░▓  ░░▓  
     ▒ ░▒░ ░ ░▒  ░ ░  ░ ▒ ▒░ ░ ░░   ░ ▒░░▒ ░             ░  ▒   ░ ░ ▒  ░ ▒ ░
     ░ ░ ░ ░  ░  ░  ░ ░ ░ ▒     ░   ░ ░ ░░             ░          ░ ░    ▒ ░
     ░   ░       ░      ░ ░           ░                ░ ░          ░  ░ ░  
  </pre>
</p>

<p align="center">
  <strong>A Professional JSON Prompt Generator CLI</strong>
</p>

<p align="center">
  <em>Create AI prompt templates for instructing other AI models with style</em>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#commands">Commands</a> •
  <a href="#themes">Themes</a> •
  <a href="#configuration">Configuration</a>
</p>

---

## ✨ Features

- 🎨 **Beautiful Terminal UI** - Stunning visual design with ASCII art, gradient colors, and themed styling
- 🤖 **AI-Powered Generation** - Uses Ollama to generate structured JSON prompt templates
- 🎭 **Multiple Themes** - Choose from pastel, cyberpunk, ocean, forest, sunset, and neon themes
- 💾 **Auto-Save** - All generated prompts are automatically saved as JSON files
- ⚡ **Interactive Mode** - User-friendly REPL interface with slash commands
- 📜 **History Tracking** - View and manage your prompt generation history
- ⚙️ **Configurable** - Customize models, output directory, and themes

## 📋 Prerequisites

- **Node.js** v18.0.0 or higher
- **Ollama** running locally at `http://localhost:11434`

## 🚀 Installation

### From Source

```bash
# Clone the repository
git clone https://github.com/Pichayut01/jsonp-cli.git
cd jsonp-cli

# Install dependencies
npm install

# Run the CLI
npm start
```

### Global Installation

```bash
# Install globally from the project
npm link

# Now you can use it anywhere
jsonp
```

## 💻 Usage

### Interactive Mode (Recommended)

Simply run the command without arguments to enter interactive mode:

```bash
jsonp
```

You'll be greeted with a beautiful welcome screen. Just type your prompt idea and press Enter to generate a structured JSON prompt template.

**Example:**
```
❯ Write a blog post about TypeScript best practices
```

This will generate a comprehensive JSON prompt template containing:
- Task description
- System prompt
- User prompt
- Context
- Output format
- Constraints
- Suggested temperature and max tokens

### Direct Commands

```bash
# View prompt history
jsonp history

# Show system information
jsonp info

# Set configuration
jsonp config prompt_model gemma
jsonp config theme cyberpunk
```

## 🎮 Commands

When in interactive mode, use these slash commands:

| Command | Description |
|---------|-------------|
| `/model <name>` | Set the AI model (e.g., `/model llama3`) |
| `/theme <name>` | Change color theme (e.g., `/theme cyberpunk`) |
| `/output <path>` | Set output directory for saved prompts |
| `/setting` | View current settings |
| `/history` | View prompt history (last 10 prompts) |
| `/info` | Display system information |
| `/clear` | Clear screen and show welcome |
| `/help` | Show available commands |
| `/exit` | Exit the application |

## 🎨 Themes

JSONP-CLI comes with 6 beautiful themes:

- **pastel** - Soft, pleasant colors (default)
- **cyberpunk** - Neon pink and cyan vibes
- **ocean** - Cool blues and teals
- **forest** - Natural greens
- **sunset** - Warm oranges and purples
- **neon** - Vibrant glowing colors

Change theme with:
```bash
/theme cyberpunk
```

Or via command line:
```bash
jsonp config theme cyberpunk
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Ollama API URL (default: http://localhost:11434)
OLLAMA_URL=http://localhost:11434

# Default model for prompt generation
DEFAULT_MODEL=llama3:latest

# Output directory for saved prompts
OUTPUT_DIR=C:/jsonp

# Default theme
DEFAULT_THEME=pastel
```

### Configuration Options

| Key | Description | Default |
|-----|-------------|---------|
| `prompt_model` | Ollama model to use | `llama3:latest` |
| `theme` | Color theme | `pastel` |
| `output_dir` | Directory for saved prompts | `~/jsonp-output` |

Set via CLI:
```bash
jsonp config prompt_model gemma
```

## 📁 Output

Generated prompts are saved as JSON files in the output directory:
- Default location: `~/jsonp-output/`
- Filename format: `prompt-{timestamp}.json`

### Example Output

```json
{
  "task": "Write a technical blog post",
  "system_prompt": "You are a professional technical writer...",
  "user_prompt": "Write a comprehensive blog post about TypeScript best practices...",
  "context": "Target audience: intermediate developers...",
  "output_format": "markdown",
  "constraints": [
    "Keep it under 2000 words",
    "Include code examples",
    "Use clear headings"
  ],
  "examples": [],
  "temperature": 0.7,
  "max_tokens": 2048
}
```

## 🏗️ Project Structure

```
jsonp-cli/
├── bin/
│   └── jsonp          # CLI entry point
├── lib/
│   ├── animations.js  # Terminal animations and effects
│   ├── logger.js      # Structured logging utilities
│   ├── theme.js       # Theme configurations
│   └── ui.js          # UI components and utilities
├── index.js           # Main application logic
├── ASCIIlogo          # ASCII art logo
├── package.json
└── .env.example       # Environment configuration template
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

---

<p align="center">
  ✨ Made with love for creative prompt generation ✨
</p>
