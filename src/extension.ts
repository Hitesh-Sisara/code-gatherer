import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "extension.codeGatherer",
    async () => {
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders) {
        vscode.window.showErrorMessage("No workspace folder open");
        return;
      }

      const rootPath = workspaceFolders[0].uri.fsPath;

      // Allow user to select files and folders
      const selectedItems = await vscode.window.showOpenDialog({
        canSelectFiles: true,
        canSelectFolders: true,
        canSelectMany: true,
        openLabel: "Select Files and Folders",
        defaultUri: vscode.Uri.file(rootPath),
      });

      if (!selectedItems) {
        return;
      }

      let content = "";
      for (const item of selectedItems) {
        await processItem(item.fsPath, rootPath, content);
      }

      // Create 'ai' folder if it doesn't exist
      const aiFolder = path.join(rootPath, "ai");
      if (!fs.existsSync(aiFolder)) {
        fs.mkdirSync(aiFolder);
      }

      // Generate timestamp
      const timestamp = new Date()
        .toISOString()
        .replace(/[:]/g, "-")
        .split(".")[0];

      // Write content to file
      const outputFile = path.join(aiFolder, `ai-${timestamp}.md`);
      fs.writeFileSync(outputFile, content);

      vscode.window.showInformationMessage(
        `Code gathering completed: ${outputFile}`
      );
    }
  );

  context.subscriptions.push(disposable);
}

async function processItem(
  itemPath: string,
  rootPath: string,
  content: string
) {
  const stats = fs.statSync(itemPath);
  const relativePath = path.relative(rootPath, itemPath);

  if (stats.isDirectory()) {
    const files = fs.readdirSync(itemPath);
    for (const file of files) {
      await processItem(path.join(itemPath, file), rootPath, content);
    }
  } else if (stats.isFile()) {
    content += `\n\n<!-- File: ${relativePath} -->\n\n`;
    content += `\`\`\`${getLanguageFromFileName(itemPath)}\n`;
    content += fs.readFileSync(itemPath, "utf8");
    content += "\n```\n";
  }
}

function getLanguageFromFileName(fileName: string): string {
  const ext = path.extname(fileName).toLowerCase();
  const languageMap: { [key: string]: string } = {
    ".js": "javascript",
    ".ts": "typescript",
    ".tsx": "typescript",
    ".jsx": "javascript",
    ".py": "python",
    ".html": "html",
    ".css": "css",
    ".scss": "scss",
    ".less": "less",
    ".json": "json",
    ".md": "markdown",
    ".go": "go",
    ".dart": "dart",
    ".java": "java",
    ".kt": "kotlin",
    ".swift": "swift",
    ".c": "c",
    ".cpp": "cpp",
    ".h": "c",
    ".hpp": "cpp",
    ".cs": "csharp",
    ".rb": "ruby",
    ".php": "php",
    ".rs": "rust",
    ".scala": "scala",
    ".sql": "sql",
    ".sh": "bash",
    ".bash": "bash",
    ".yml": "yaml",
    ".yaml": "yaml",
    ".toml": "toml",
    ".ini": "ini",
    ".cfg": "ini",
    ".conf": "ini",
    ".env": "plaintext",
    ".gitignore": "plaintext",
    ".dockerignore": "plaintext",
    ".editorconfig": "plaintext",
    ".xml": "xml",
    ".svg": "svg",
    ".vue": "vue",
    ".elm": "elm",
    ".clj": "clojure",
    ".erl": "erlang",
    ".ex": "elixir",
    ".hs": "haskell",
    ".lua": "lua",
    ".pl": "perl",
    ".r": "r",
    ".sass": "sass",
    ".styl": "stylus",
    ".tf": "terraform",
    ".gradle": "groovy",
    ".proto": "protobuf",
    ".pug": "pug",
  };
  return languageMap[ext] || "plaintext";
}

export function deactivate() {}
