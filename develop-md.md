# Development Guide for Code Gatherer Extension

This guide provides instructions on how to compile the code and generate the extension for the Code Gatherer VS Code extension.

## Prerequisites

- Node.js (LTS version recommended)
- bun (for build and development)
- Visual Studio Code
- Git

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/Hitesh-Sisara/code-gatherer.git
   cd code-gatherer
   ```

2. Install dependencies:
   ```
   bun install
   ```

## Compilation

To compile the TypeScript code into JavaScript, run:

```
bun run compile
```

This command uses the TypeScript compiler to transpile the code based on the `tsconfig.json` configuration.

## Watching for Changes

During development, you can use the watch mode to automatically recompile the code when changes are detected:

```
bun run watch
```

## Linting

To run the linter and check for code style issues:

```
bun run lint
```

## Testing

To run the tests:

```
bun test
```

## Packaging the Extension

To create a `.vsix` file for distribution:

1. Ensure you have the `vsce` tool installed:
   ```
   npm install -g vsce
   ```

2. Run the package command:
   ```
   bun run package
   ```

This will generate a `.vsix` file in the project root directory.

## Publishing the Extension

To publish the extension to the VS Code Marketplace:

1. Ensure you have a Personal Access Token from Azure DevOps.
2. Run:
   ```
   vsce publish
   ```

Note: Make sure to update the version number in `package.json` before publishing a new version.

## Updating the Extension Version

1. Open `package.json`
2. Locate the `"version"` field and increment it according to semantic versioning rules.
3. Save the file.
4. Commit the changes to the repository.

## Troubleshooting

- If you encounter any issues with bun, try using npm as an alternative:
  - Replace `bun run` with `npm run` in the above commands.
  - Use `npm install` instead of `bun install` for dependency installation.

- If you face any "command not found" errors, ensure that the necessary tools are installed and added to your system's PATH.

For any other issues, please refer to the project's issue tracker on GitHub.
