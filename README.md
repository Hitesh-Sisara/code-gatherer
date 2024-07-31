# Code Gatherer for AI Analysis

## Purpose

Code Gatherer is a Visual Studio Code extension designed to streamline the process of collecting and preparing code for AI-assisted analysis and development. In today's software development landscape, AI tools like Claude are increasingly used for code writing, debugging, and refactoring. However, providing the necessary context to these AI assistants can be time-consuming and tedious.

This extension aims to solve that problem by allowing developers to easily select multiple files or folders, gather their contents, and prepare them in a format that's optimized for AI analysis. It also generates project structure overviews, providing AI assistants with a comprehensive understanding of your codebase.

## How It Increases Developer Productivity

1. **Time-saving**: Eliminates the need to manually copy and paste multiple file contents and paths.
2. **Context Preservation**: Automatically includes file paths and structures, providing better context to AI assistants.
3. **Selective Gathering**: Allows developers to choose specific files or folders for analysis, focusing the AI's attention where it's needed most.
4. **AI-Optimized Output**: Generates Markdown files with appropriate code blocks and language specifications, making it easy for AI tools to understand and process the code.
5. **Large Project Handling**: Automatically splits large codebases into multiple files if needed, ensuring compatibility with AI token limits.
6. **Clipboard Integration**: Automatically copies the content of the first generated file to the clipboard for immediate use with AI tools.
7. **Prompt Engineering**: Includes predefined prompts and instructions in the generated files, guiding the AI towards more useful and relevant responses.
8. **Project Structure Generation**: Creates a comprehensive overview of your project's file and folder structure, helping AI assistants understand the organization of your codebase.

## How to Use

### Code Gathering

1. Install the extension in Visual Studio Code.
2. Open your project in VS Code.
3. Use the keyboard shortcut `Ctrl+Shift+G` (or `Cmd+Shift+G` on Mac) to open the Code Gatherer side panel.
4. In the side panel, you'll see a tree view of your project files and folders. Each item has a checkbox next to it.
5. Select the files and folders you want to include in your AI analysis by checking the boxes.
6. Once you've made your selection, click the "Generate" button at the top of the side panel.
7. The extension will create one or more Markdown files in a `CodeGatherer` folder in your workspace, containing the selected code with appropriate formatting and context.
8. The content of the first generated file will be automatically copied to your clipboard.
9. You can now paste this content directly into your AI assistant's interface for analysis.

### Project Structure Generation

1. Right-click on any file or folder in the VS Code explorer.
2. Select "Generate Project Structure" from the context menu.
3. The extension will generate a text file containing your project's file and folder structure, ignoring common build artifacts and following `.gitignore` rules.
4. The generated file will be saved in the `CodeGatherer` folder and automatically opened in the editor.

## Features

- Easy file and folder selection through a familiar tree view interface.
- Keyboard shortcut for quick access to the Code Gatherer panel.
- Automatic generation of AI-friendly Markdown files.
- Inclusion of file paths and language-specific code blocks.
- Handling of large codebases by splitting into multiple files if necessary.
- Automatic clipboard copy of the first generated file.
- Inclusion of prompt engineering to guide AI analysis.
- Project structure generation for comprehensive codebase overview.
- Intelligent ignoring of build artifacts and respecting of `.gitignore` rules.

## Use Cases

- Quickly gather code for bug analysis and fixing.
- Prepare code for AI-assisted refactoring or optimization.
- Collect relevant parts of your codebase for new feature implementation discussions with AI.
- Easily share code context when seeking AI help for debugging or problem-solving.
- Generate project structure overviews to help AI assistants understand your codebase organization.
- Prepare comprehensive context for AI-assisted architectural discussions or reviews.

## Benefits

- **Faster Context Sharing**: Reduce the time spent on copying and formatting code for AI tools.
- **Improved AI Responses**: By providing more context and structure, get more accurate and relevant assistance from AI.
- **Codebase Understanding**: Help AI assistants quickly grasp your project's organization and scope.
- **Collaboration Enhancement**: Easily share relevant code snippets and project structure with team members or AI assistants.
- **Customizable Selection**: Choose exactly what parts of your codebase to include in the analysis, maintaining control over shared information.
- **Consistent Formatting**: Ensure that code is always presented to AI tools in a consistent, easy-to-parse format.

By using Code Gatherer, you can significantly reduce the time and effort required to leverage AI assistance in your development workflow, allowing you to focus more on problem-solving and less on preparation and context-setting. Whether you're working on bug fixes, new features, or architectural improvements, Code Gatherer helps you get the most out of your AI-assisted development process.
